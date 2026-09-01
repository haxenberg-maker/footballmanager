/**
 * ═══════════════════════════════════════════════════════════════════
 * smart-rating.js — SINGURA sursă de adevăr pentru calculul Smart Rating.
 * ═══════════════════════════════════════════════════════════════════
 *
 * Încărcat de AMBELE pagini (index.html și setari.html) ÎNAINTE de
 * scriptul propriu al fiecărei pagini:
 *
 *   <script src="smart-rating.js"></script>
 *   <script src="app.js?v=..."></script>       (în index.html)
 *   ...sau...
 *   <script src="smart-rating.js"></script>
 *   <script>...cod propriu setari.html...</script>
 *
 * De ce există fișierul ăsta: înainte, formula de calcul era duplicată
 * în 2-3 locuri (app.js real, preview-ul din setari.html, uneori și
 * modalul de breakdown) — de fiecare dată când modificam algoritmul,
 * trebuia sincronizat manual peste tot, și era ușor să uit un loc
 * (exact ce s-a întâmplat cu Borda/MVP inițial). Acum orice modificare
 * de formulă se face O SINGURĂ DATĂ, aici.
 *
 * DEPENDENȚE GLOBALE necesare din pagina care include acest fișier
 * (trebuie să existe până la primul apel al funcțiilor de mai jos,
 * nu neapărat la momentul în care se încarcă acest <script>):
 *   - db.players  → array de jucători {name, status, wins, games,
 *                   totalGoals, ratings, adminTags, adminRating,
 *                   lastImbalanceLoss, positionPrimary, role, ...}
 *   - db.history  → array de meciuri {orangePlayers, greenPlayers,
 *                   blackPlayers, winner, ...}
 *   - tagsConfig  → array de tag-uri configurate {id, type, impact_profile, ...}
 *   - POSITIONS   → obiect {COD: {group:'GK'|'DEF'|'MID'|'FWD', ...}} —
 *                   fiecare pagină își definește propriul POSITIONS (cu
 *                   propriile culori de UI), dar câmpul `.group` trebuie
 *                   să existe și să fie consistent între pagini.
 *
 * Acest fișier NU face nimic legat de UI (fără HTML, fără DOM) — doar
 * calcul pur. Panourile de editare (sliders, butoane, culori) rămân în
 * fiecare pagină separat, pentru că design-ul diferă (temă light vs dark).
 */

// ── Configurare (stare mutabilă, comună ambelor pagini) ────────────
const DEFAULT_W = {winrate:0.25, goals:0.20, defense:0.15, tags:0.20, chemistry:0.08, speed:0.05, potm:0.04, mvp:0.03};
let W = {...DEFAULT_W};
let TW = {}; // coeficienți fini per-tag: {tagId: -0.5..+0.5}

// Punctul de start al ratingului (implicit 5.0) — nu face parte din cei
// 100%, e un modificator global: mută unde "pornește" toată lumea pe
// scala 1-10.
let BASE_RATING = 5.0;

// Cât de mult contează activitatea recentă (absențele) — 0% = ignorată
// complet, 100% = intensitatea implicită, poate merge și peste 100%
// pentru o penalizare mai agresivă.
let ACTIVITY_INTENSITY = 1.0;

// Cât de mult contează penalizarea de dezechilibru (lastImbalanceLoss) —
// aceeași idee ca ACTIVITY_INTENSITY: 0% = ignorată complet, 100% =
// intensitatea implicită (coeficient 0.20/pierdere, plafonat la 3).
let IMBALANCE_INTENSITY = 1.0;

// Coeficientul unui tag (−50%..+50%) se scalează ×14, ca un singur tag
// la maxim să poată muta ratingul cu până la ±7 puncte.
const TAG_COEF_SCALE = 14;

// "meciuri virtuale" la 50% winrate — shrinkage bayesian pentru win rate,
// ca un jucător cu 1 meci/1 victorie să nu primească același bonus ca
// unul cu 20 din 25.
const WINRATE_PRIOR_GAMES = 8;

const W_LABELS = {
    winrate:'📈 Win Rate',
    goals:'⚽ Goluri (relativ la poziție)',
    defense:'🛡️ Goluri încasate — echipă (relativ la poziție)',
    tags:'🏷️ Tag-uri',
    chemistry:'🧪 Chimie (coechipieri actuali)',
    speed:'💨 Viteză',
    potm:'⭐ POTM (Player of The Match)',
    mvp:'👑 MVP (voturi colegi)',
};

const PRESETS = {
    balanced:    {winrate:.25, goals:.20, defense:.15, tags:.20, chemistry:.08, speed:.05, potm:.04, mvp:.03},
    defensive:   {winrate:.20, goals:.10, defense:.30, tags:.25, chemistry:.10, speed:.02, potm:.02, mvp:.01},
    performance: {winrate:.22, goals:.30, defense:.08, tags:.18, chemistry:.05, speed:.07, potm:.06, mvp:.04},
};

// Profile attrs folosite în profilul de impact al tag-urilor (echilibrare
// echipe — NU influențează ratingul, vezi computeTagBonus mai jos).
const PROFILE_ATTRS = ['viteza','tehnica','strategie','aparare','efort','mentalitate','fizic','executie','pozitionare'];

// ── Poziție → grup (GK/DEF/MID/FWD) ─────────────────────────────────
const LEGACY_ROLE_MAP = { portar:'GK', fundas:'CB', mijlocas:'CM', atacant:'ST' };
function getPlayerPrimaryPos(p){
    if (p.positionPrimary && POSITIONS[p.positionPrimary]) return p.positionPrimary;
    if (p.role && LEGACY_ROLE_MAP[p.role]) return LEGACY_ROLE_MAP[p.role];
    return null;
}
function getPlayerPrimaryGroup(p){
    const pos = getPlayerPrimaryPos(p);
    return pos ? POSITIONS[pos].group : null;
}

// ── Goluri, relativ la poziție ───────────────────────────────────────
/**
 * Media de goluri/meci a unui grup de jucători (folosit ca bază de
 * comparație pentru componenta de goluri raportată la poziție). Ignoră
 * jucătorii fără meciuri jucate.
 */
function getGroupAvgGoalsPerGame(pool){
    const withGames = pool.filter(pl => pl.games > 0);
    if (!withGames.length) return 0;
    return withGames.reduce((s,pl) => s + (pl.totalGoals||0) / pl.games, 0) / withGames.length;
}

/**
 * Scor 0-10 (centrat pe BASE_RATING) pentru golurile unui jucător,
 * calculat RELATIV la media jucătorilor din același grup de poziție
 * (GK/DEF/MID/FWD) — nu un bonus fix, ca să nu penalizeze nedrept
 * fundașii/portarii față de atacanți. Dacă jucătorul nu are poziție
 * setată sau grupul are prea puțini jucători cu date, se raportează la
 * media tuturor jucătorilor.
 */
function getGoalsScoreRelative(p){
    if (!p.games) return BASE_RATING;
    const gpg = (p.totalGoals||0) / p.games;
    const group = getPlayerPrimaryGroup(p);
    let pool = group ? db.players.filter(pl => getPlayerPrimaryGroup(pl) === group) : [];
    if (pool.filter(pl=>pl.games>0).length < 3) pool = db.players; // fallback: prea puțini jucători cu poziție/date în grup
    const avgGpg = getGroupAvgGoalsPerGame(pool);
    const scale = Math.max(avgGpg, 0.3); // evită împărțire la ~0 când media grupului e minusculă
    const diff = (gpg - avgGpg) / scale;
    const delta = Math.max(-3, Math.min(3, diff * 2.5));
    return BASE_RATING + delta;
}

// ── Goluri încasate (de echipă, cât timp a jucat el), relativ la poziție ──
/**
 * La fel ca getGoalsScoreRelative, dar INVERSAT: mai puține goluri primite
 * de echipă decât media grupului de poziție → scor mai mare (a apărat
 * bine). p.totalGoalsConceded e calculat automat (nu introdus manual) —
 * vezi computeTeamConcededWhilePlaying() în app.js: pentru fiecare meci
 * jucat, câte goluri a marcat echipa ADVERSĂ cât timp el era pe teren.
 */
function getGroupAvgConcededPerGame(pool){
    const withGames = pool.filter(pl => pl.games > 0);
    if (!withGames.length) return 0;
    return withGames.reduce((s,pl) => s + (pl.totalGoalsConceded||0) / pl.games, 0) / withGames.length;
}
function getConcededScoreRelative(p){
    if (!p.games) return BASE_RATING;
    const cpg = (p.totalGoalsConceded||0) / p.games;
    const group = getPlayerPrimaryGroup(p);
    let pool = group ? db.players.filter(pl => getPlayerPrimaryGroup(pl) === group) : [];
    if (pool.filter(pl=>pl.games>0).length < 3) pool = db.players;
    const avgCpg = getGroupAvgConcededPerGame(pool);
    const scale = Math.max(avgCpg, 0.3);
    const diff = (avgCpg - cpg) / scale; // inversat față de goluri date
    const delta = Math.max(-3, Math.min(3, diff * 2.5));
    return BASE_RATING + delta;
}

// ── Viteză (status admin, 6 trepte) ──────────────────────────────────
/**
 * La fel ca golurile — NU o scală fixă, ci relativă la media celorlalți
 * jucători care AU un status de viteză setat (dacă nimeni nu are setat,
 * media cade pe 'normal'). Neutru (BASE_RATING) dacă jucătorul însuși nu
 * are status setat — nu penalizează pe nimeni doar pentru că admin n-a
 * apucat să-l seteze încă.
 */
const SPEED_TIER_VALUE = { 'slow-':1, 'slow':2, 'normal':3, 'fast':4, 'fast+':5, 'fast++':6 };
function getGroupAvgSpeedValue(pool){
    const withSpeed = pool.filter(pl => pl.speedStatus && SPEED_TIER_VALUE[pl.speedStatus] != null);
    if (!withSpeed.length) return 3; // nimeni nu are setat → bază neutră ('normal')
    return withSpeed.reduce((s,pl)=> s + SPEED_TIER_VALUE[pl.speedStatus], 0) / withSpeed.length;
}
function getSpeedScore(p){
    if (!p.speedStatus || SPEED_TIER_VALUE[p.speedStatus] == null) return BASE_RATING;
    const myVal  = SPEED_TIER_VALUE[p.speedStatus];
    const avgVal = getGroupAvgSpeedValue(db.players);
    const diff   = myVal - avgVal; // interval tipic ~ -2..+2 (scală 1-6, medie ~3)
    const delta  = Math.max(-3, Math.min(3, diff * 1.5));
    return BASE_RATING + delta;
}

// ── POTM & MVP (câte premii a avut, raportat la câte meciuri a jucat) ──
/**
 * Rată (premii/meci), nu total brut — altfel un jucător cu mult mai
 * multe meciuri jucate ar acumula avantaj artificial doar din volum.
 * Plafonat, ca un jucător cu premii dese să nu domine disproporționat.
 */
function getPotmScore(p){
    if (!p.games) return BASE_RATING;
    const rate = (p.potmCount||0) / p.games;
    const delta = Math.min(rate * 15, 4);
    return BASE_RATING + delta;
}
function getMvpScore(p){
    if (!p.games) return BASE_RATING;
    const rate = (p.mvpCount||0) / p.games;
    const delta = Math.min(rate * 12, 3.5);
    return BASE_RATING + delta;
}

// ── Win Rate, cu shrinkage bayesian ──────────────────────────────────
function getWinrateShrunk(p){
    return (p.wins + WINRATE_PRIOR_GAMES*0.5) / (p.games + WINRATE_PRIOR_GAMES);
}

// ── Tag-uri ───────────────────────────────────────────────────────────
function getPlayerActiveTagObjects(p){
    const adminSet = new Set((p.adminTags||[]).map(String));
    const result = [];
    tagsConfig.forEach(tag=>{
        const tid = String(tag.id);
        if(!adminSet.has(tid)) return;
        result.push({ id: tid, tag, adminSet: true });
    });
    return result;
}

/**
 * computeTagBonus — Un singur cadran per tag pentru rating.
 *
 * Contribuția unui tag la Smart Rating depinde EXCLUSIV de "Coeficient
 * rating" (tw_weight, −50%..+50%) — nimic altceva. Profilul de impact
 * (9 sliders) NU influențează ratingul deloc; el rămâne folosit doar
 * pentru echilibrarea echipelor (computeTeamAttrProfile din app.js), un
 * calcul complet separat.
 *
 * Coeficientul se scalează ×14 — un singur tag la maxim (±50%) poate
 * muta ratingul cu până la ±7 puncte.
 */
function computeTagBonus(activeTags){
    if(!activeTags.length) return {bonus:0, signals:[], buckets:{}};

    let totalBonus = 0;
    const signals = [];

    activeTags.forEach(obj=>{
        const tag = obj.tag;
        const tw = TW[String(obj.id)] || 0;
        const dir = tag.type==='pos' ? 1 : tag.type==='neg' ? -1 : 0;
        const contrib = tw * TAG_COEF_SCALE;
        signals.push({id:obj.id, tag, raw:contrib, dir});
        totalBonus += contrib;
    });

    // Clamp defensiv generos — un singur tag poate ajunge deja la ±7, deci
    // plafonul de siguranță trebuie să lase loc pentru câteva tag-uri
    // suprapuse fără să taie artificial din efectul lor.
    const bonus = Math.max(-20, Math.min(20, totalBonus));
    return {bonus: parseFloat(bonus.toFixed(3)), signals, buckets:{}};
}

// ── Chimie (win-rate cu coechipierii actuali) ────────────────────────
/**
 * Dacă un meci s-a jucat și cine a câștigat, din perspectiva unui jucător.
 * Returnează true/false/null (null = nu a jucat deloc acel meci).
 */
function playerWonMatch(h, playerName){
    const inOrange = (h.orangePlayers||[]).includes(playerName);
    const inGreen  = (h.greenPlayers||[]).includes(playerName);
    const inBlack  = (h.blackPlayers||[]).includes(playerName);
    if (!inOrange && !inGreen && !inBlack) return null; // nu a jucat deloc

    const w = (h.winner||'').toLowerCase().trim();
    if (!w || w === 'egal') return false; // egal = nimeni nu câștigă

    if (inOrange) return w.includes('portocaliu') || w.includes('orange');
    if (inGreen)  return w.includes('verde') || w.includes('green');
    if (inBlack)  return w.includes('negru') || w.includes('black');
    return false;
}

/**
 * Win-rate al jucătorului `pName` atunci când joacă alături de `mateName`,
 * calculat din istoricul real de meciuri. 0.5 = neutru (istoric insuficient).
 */
function getSynergyScore(pName, mateName){
    let together = 0, wins = 0;
    db.history.forEach(h => {
        const inOrange = (h.orangePlayers||[]).includes(pName) && (h.orangePlayers||[]).includes(mateName);
        const inGreen  = (h.greenPlayers||[]).includes(pName)  && (h.greenPlayers||[]).includes(mateName);
        const inBlack  = (h.blackPlayers||[]).includes(pName)  && (h.blackPlayers||[]).includes(mateName);
        if (!inOrange && !inGreen && !inBlack) return;
        together++;
        const won = playerWonMatch(h, pName);
        if (won === true) wins++;
    });
    if (together < 2) return 0.5; // insuficient istoric → neutru
    return wins / together; // 0..1, 0.5 = neutru
}

/**
 * Bonus sinergie pentru un jucător față de un grup de coechipieri: media
 * win-rate pairwise. Returnează [-0.5, +0.5] față de neutru.
 */
function getTeamSynergyBonus(playerName, teammates){
    if (!teammates.length) return 0;
    const scores = teammates.map(m => getSynergyScore(playerName, m.name));
    const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
    return (avg - 0.5) * 1.0;
}

/**
 * Coechipierii ACTUALI ai unui jucător — folosiți implicit pentru
 * componenta de Chimie când nu se dă un context explicit (ex: în timpul
 * balansării de echipe). Se bazează pe statusul curent (orange/green/
 * bench) din dashboard, deci se recalculează automat de îndată ce
 * jucătorul e mutat din echipă în echipă.
 */
function getCurrentTeammates(p){
    if (!p.status || !['orange','green','bench'].includes(p.status)) return [];
    return db.players.filter(pl => pl.status===p.status && pl.name!==p.name);
}

// ── Activitate recentă ────────────────────────────────────────────────
function getActivityMultiplier(p){
    const recentMatches = db.history.slice(0, 8); // ultimele 8 meciuri
    if (recentMatches.length < 3) return 1.0; // prea puțin istoric
    let absent = 0;
    recentMatches.forEach(h => {
        const played = (h.orangePlayers||[]).includes(p.name) || (h.greenPlayers||[]).includes(p.name) || (h.blackPlayers||[]).includes(p.name);
        if (!played) absent++;
    });
    // 0 absențe = 1.0, 3+ absențe = 0.80
    return Math.max(0.80, 1.0 - absent * 0.06);
}

// ── Formula principală ────────────────────────────────────────────────
/**
 * Calculează toate componentele Smart Rating pentru un jucător, ca o
 * listă de "pași" aditivi plecând de la BASE_RATING — folosit atât de
 * getSmartRating() (ia doar rezultatul final) cât și de modalul de
 * breakdown din app.js (afișează fiecare pas). UN SINGUR loc unde
 * trăiește formula.
 */
function computeSmartRatingComponents(p, context = {}){
    // Fiecare componentă e un scor 0-10 centrat pe BASE_RATING; media
    // ponderată se exprimă echivalent ca "BASE_RATING + suma deltelor
    // ponderate", ceea ce permite afișarea sub formă de pași aditivi.
    const wrShrunk     = getWinrateShrunk(p);
    const winrateScore = BASE_RATING + (wrShrunk - 0.5) * 10;
    const goalsScore   = getGoalsScoreRelative(p);

    const activeTags = getPlayerActiveTagObjects(p);
    const { bonus: tagsNetSum, signals: tagSignals } = computeTagBonus(activeTags);
    const tagsScore = BASE_RATING + tagsNetSum;

    const teammates = (context.teammates && context.teammates.length) ? context.teammates : getCurrentTeammates(p);
    const chemistryRaw   = getTeamSynergyBonus(p.name, teammates); // ±0.5
    const chemistryScore = BASE_RATING + chemistryRaw * 10; // 0-10

    const defenseScore = getConcededScoreRelative(p);
    const speedScore   = getSpeedScore(p);
    const potmScore    = getPotmScore(p);
    const mvpScore     = getMvpScore(p);

    const parts = [
        { key:'winrate',   icon:'📈', label:'Win Rate',                     score:winrateScore,   w:W.winrate||0 },
        { key:'goals',     icon:'⚽', label:'Goluri (poziție)',             score:goalsScore,     w:W.goals||0 },
        { key:'defense',   icon:'🛡️', label:'Goluri încasate (echipă)',     score:defenseScore,   w:W.defense||0 },
        { key:'tags',      icon:'🏷️', label:'Tag-uri',                      score:tagsScore,      w:W.tags||0 },
        { key:'chemistry', icon:'🧪', label:'Chimie',                       score:chemistryScore, w:W.chemistry||0 },
        { key:'speed',     icon:'💨', label:'Viteză',                       score:speedScore,     w:W.speed||0 },
        { key:'potm',      icon:'⭐', label:'POTM',                         score:potmScore,      w:W.potm||0 },
        { key:'mvp',       icon:'👑', label:'MVP',                          score:mvpScore,       w:W.mvp||0 },
    ];
    const wSum = parts.reduce((s,c)=>s+c.w, 0);
    parts.forEach(c => { c.delta = wSum>0 ? (c.score-BASE_RATING) * c.w / wSum : 0; });
    const blendBase = BASE_RATING + parts.reduce((s,c)=>s+c.delta, 0);

    // Penalizare dezechilibru — IMBALANCE_INTENSITY scalează cât de mult
    // contează efectiv (0% = ignorată complet, 100% = normal), la fel ca
    // ACTIVITY_INTENSITY mai jos.
    const imbalPen   = Math.min((p.lastImbalanceLoss||0), 3) * 0.20 * IMBALANCE_INTENSITY;
    const afterImbal = blendBase - imbalPen;

    // Penalizare absențe (blend spre BASE_RATING) — actMult brut vine din
    // shape-ul fix (8 meciuri recente, −6%/absență, prag 80%);
    // ACTIVITY_INTENSITY scalează cât de mult contează efectiv acel
    // multiplicator: 0% îl anulează complet, 100% = normal, >100% amplifică.
    const actMultRaw    = getActivityMultiplier(p);
    const actMult       = 1 - (1 - actMultRaw) * ACTIVITY_INTENSITY;
    const afterActivity = afterImbal*actMult + BASE_RATING*(1-actMult);
    const deltaActivity = afterActivity - afterImbal;

    const final = parseFloat(Math.max(1, Math.min(10, afterActivity)).toFixed(2));

    return {
        parts, wSum, blendBase,
        wrShrunk, wrRaw: p.games>0 ? p.wins/p.games : 0.5,
        goalsScore, gpg: p.games>0 ? (p.totalGoals||0)/p.games : 0,
        tagsScore, tagsNetSum, tagSignals,
        chemistryScore, chemistryRaw, teammates,
        imbalPen, afterImbal,
        actMultRaw, actMult, afterActivity, deltaActivity,
        final,
    };
}

function getSmartRating(p, context = {}){
    if (p.adminRating != null) return parseFloat(p.adminRating.toFixed(2));
    return computeSmartRatingComponents(p, context).final;
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * MOTOR EA FC / FIFA (extensie) — atribute stil card (1-99), OVR
 * pozițional, Weak Foot ★ / Skill Moves ★.
 * ═══════════════════════════════════════════════════════════════════
 *
 * Complet ADITIV — nu modifică nimic din formula Smart Rating de mai
 * sus (W, TW, computeSmartRatingComponents, getSmartRating rămân
 * exact cum erau). E un strat separat, derivat automat din ACELEAȘI
 * date deja calculate în acest fișier (goluri/poziție, goluri
 * încasate/poziție, viteză, win rate, tag-uri) — fără input manual de
 * atribute din partea adminului.
 *
 * Punct de intrare pentru UI: eaGetPlayerCard(p).
 * Pentru echilibrare pe linii de poziție: eaComputeTeamLineOVR(team).
 */

const EA_ATTR_KEYS = ['PAC','SHO','PAS','DRI','DEF','PHY'];
const GK_ATTR_KEYS = ['DIV','HAN','KIC','REF','POS','SPD'];

// O ligă recreativă 6v6 nu e "90 OVR ca la profesioniști" — pornim de
// la un centru mai jos ca scala 1-99 să aibă sens vizual (jucătorul
// mediu ~62, nu ~75).
const EA_BASE99 = 62;
// Cât "cântărește" o abatere de 1 punct pe scala internă 0-10
// (centrată pe BASE_RATING) atunci când e proiectată pe scala 1-99.
const EA_SCALE99 = 6.5;
// Clamp pe suma impact_profile a UNUI jucător per atribut de bază, ca
// 4-5 tag-uri suprapuse să nu explodeze un atribut EA la extreme.
const EA_PROFILE_CLAMP = 6;

function eaMapScoreTo99(score0to10){
    const val = EA_BASE99 + (score0to10 - BASE_RATING) * EA_SCALE99;
    return Math.max(1, Math.min(99, Math.round(val)));
}

/**
 * getPlayerImpactProfile — suma impact_profile (cele 9 atribute de
 * bază din tags_config) pentru tag-urile ACTIVE ale UNUI SINGUR
 * jucător, NECLAMPUITĂ. Refolosită și de computeTeamAttrProfile din
 * app.js (însumează peste toată echipa) — comportament IDENTIC cu
 * varianta veche inline de acolo (o singură buclă de calcul, nu
 * duplicată). Clamp-ul pentru motorul EA (mai jos) se aplică separat,
 * per-jucător, DOAR când se transformă în scor 0-10 — vezi
 * eaProfileAttrScore.
 */
function getPlayerImpactProfile(p){
    const profile = {};
    PROFILE_ATTRS.forEach(a=>{ profile[a]=0; });
    getPlayerActiveTagObjects(p).forEach(obj=>{
        const ip = obj.tag?.impact_profile || {};
        PROFILE_ATTRS.forEach(a=>{
            const v = parseFloat(ip[a]);
            if(!isNaN(v)) profile[a]+=v;
        });
    });
    return profile;
}

/** Un atribut de bază individual (din profilul de tag-uri al unui
 * jucător) → scor 0-10 centrat pe BASE_RATING, ca să poată fi combinat
 * cu celelalte semnale (goluri, viteză, win rate) pe aceeași scală.
 * Clamp-ul (EA_PROFILE_CLAMP) se aplică AICI, nu în profilul brut, ca
 * să nu afecteze computeTeamAttrProfile din app.js. */
function eaProfileAttrScore(profile, key){
    const clamped = Math.max(-EA_PROFILE_CLAMP, Math.min(EA_PROFILE_CLAMP, profile[key]||0));
    return BASE_RATING + clamped * (5/EA_PROFILE_CLAMP); // ±6 (clamp) → ±5 pe scala 0-10
}

function eaBlend(parts){
    const wSum = parts.reduce((s,x)=>s+x.w,0);
    return BASE_RATING + parts.reduce((s,x)=>s+(x.score-BASE_RATING)*x.w,0)/(wSum||1);
}

/**
 * eaComputeOutfieldAttributes — cele 6 atribute EA FC (1-99) pentru un
 * jucător de câmp: PACE, SHOOTING, PASSING, DRIBBLING, DEFENDING,
 * PHYSICAL. Derivate din statistici (goluri/poziție, goluri
 * încasate/poziție, status viteză, win rate) + profilul de tag-uri.
 */
function eaComputeOutfieldAttributes(p){
    const profile = getPlayerImpactProfile(p);
    const goalsScore   = getGoalsScoreRelative(p);
    const defenseScore = getConcededScoreRelative(p);
    const speedScore   = getSpeedScore(p);

    const viteza      = eaProfileAttrScore(profile,'viteza');
    const tehnica     = eaProfileAttrScore(profile,'tehnica');
    const strategie   = eaProfileAttrScore(profile,'strategie');
    const aparare     = eaProfileAttrScore(profile,'aparare');
    const efort       = eaProfileAttrScore(profile,'efort');
    const mentalitate = eaProfileAttrScore(profile,'mentalitate');
    const fizic       = eaProfileAttrScore(profile,'fizic');
    const executie    = eaProfileAttrScore(profile,'executie');
    const pozitionare = eaProfileAttrScore(profile,'pozitionare');

    const PAC = eaBlend([ {score:speedScore, w:.55}, {score:viteza, w:.30}, {score:efort, w:.15} ]);
    const SHO = eaBlend([ {score:goalsScore, w:.55}, {score:executie, w:.25}, {score:tehnica, w:.10}, {score:strategie, w:.10} ]);
    const PAS = eaBlend([ {score:tehnica, w:.35}, {score:strategie, w:.35}, {score:mentalitate, w:.15}, {score:pozitionare, w:.15} ]);
    const DRI = eaBlend([ {score:tehnica, w:.45}, {score:viteza, w:.25}, {score:executie, w:.30} ]);
    const DEF = eaBlend([ {score:defenseScore, w:.50}, {score:aparare, w:.30}, {score:pozitionare, w:.20} ]);
    const PHY = eaBlend([ {score:fizic, w:.45}, {score:efort, w:.35}, {score:viteza, w:.20} ]);

    return {
        PAC: eaMapScoreTo99(PAC), SHO: eaMapScoreTo99(SHO), PAS: eaMapScoreTo99(PAS),
        DRI: eaMapScoreTo99(DRI), DEF: eaMapScoreTo99(DEF), PHY: eaMapScoreTo99(PHY),
        _raw: {PAC,SHO,PAS,DRI,DEF,PHY}, // scala internă 0-10, utilă pt. un breakdown UI ulterior
    };
}

/**
 * eaComputeGkAttributes — atributele de portar (1-99): DIVING,
 * HANDLING, KICKING, REFLEXES, POSITIONING, SPEED. Formulă separată de
 * cea a jucătorilor de câmp (SHO/DRI nu sunt relevante pentru portar).
 * Acoperă explicit tag-urile de portar din tags_config (Shot Stopper,
 * Sweeper Keeper, Distribuție cu Piciorul).
 */
function eaComputeGkAttributes(p){
    const profile = getPlayerImpactProfile(p);
    const defenseScore = getConcededScoreRelative(p); // goluri primite, relativ la ceilalți portari
    const speedScore   = getSpeedScore(p);
    const aparare      = eaProfileAttrScore(profile,'aparare');
    const tehnica      = eaProfileAttrScore(profile,'tehnica');
    const strategie    = eaProfileAttrScore(profile,'strategie');
    const pozitionare  = eaProfileAttrScore(profile,'pozitionare');
    const mentalitate  = eaProfileAttrScore(profile,'mentalitate');

    const DIV = eaBlend([ {score:defenseScore,w:.60}, {score:aparare,w:.25}, {score:mentalitate,w:.15} ]);
    const HAN = eaBlend([ {score:defenseScore,w:.50}, {score:aparare,w:.35}, {score:tehnica,w:.15} ]);
    const KIC = eaBlend([ {score:tehnica,w:.55}, {score:strategie,w:.45} ]); // ← „Distribuție cu Piciorul"
    const REF = eaBlend([ {score:defenseScore,w:.65}, {score:aparare,w:.20}, {score:mentalitate,w:.15} ]);
    const POS = eaBlend([ {score:pozitionare,w:.45}, {score:strategie,w:.35}, {score:defenseScore,w:.20} ]); // ← „Sweeper Keeper"
    const SPD = eaBlend([ {score:speedScore,w:.75}, {score:pozitionare,w:.25} ]);

    return {
        DIV: eaMapScoreTo99(DIV), HAN: eaMapScoreTo99(HAN), KIC: eaMapScoreTo99(KIC),
        REF: eaMapScoreTo99(REF), POS: eaMapScoreTo99(POS), SPD: eaMapScoreTo99(SPD),
        _raw: {DIV,HAN,KIC,REF,POS,SPD},
    };
}

/**
 * eaComputeStarRatings — Weak Foot ★ / Skill Moves ★ (1-5), derivate
 * din atributele deja calculate (nu input manual). Formulă simplă și
 * ușor de recalibrat dacă distribuția rezultată nu arată bine în
 * practică (ex: dacă toată lumea iese 3★, strânge intervalul /13, /14).
 */
function eaComputeStarRatings(attrs){
    const skillMoves = Math.max(1, Math.min(5, Math.round(1 + (attrs.DRI - 40) / 13)));
    const weakFoot    = Math.max(1, Math.min(5, Math.round(1 + ((attrs.PAS + attrs.SHO)/2 - 40) / 14)));
    return { skillMoves, weakFoot };
}

// ── Matrice de ponderi per poziție (transformă cele 6 atribute în OVR) ──
// Grupurile (GK/DEF/MID/FWD) vin din POSITIONS[...].group (definit în
// pagina care include acest fișier — vezi getPlayerPrimaryGroup mai
// sus). Suma ponderilor pe fiecare linie = 1. (FWD = "ATT" din cerință,
// redenumit ca să fie consistent cu gruparea deja existentă în cod.)
const EA_POSITION_WEIGHTS = {
    FWD: { PAC:.20, SHO:.35, PAS:.10, DRI:.25, DEF:.02, PHY:.08 },
    MID: { PAC:.12, SHO:.10, PAS:.30, DRI:.25, DEF:.13, PHY:.10 },
    DEF: { PAC:.15, SHO:.03, PAS:.12, DRI:.10, DEF:.45, PHY:.15 },
};

/**
 * eaComputeBaseOVR — OVR (1-99) pe baza istoricului COMPLET al
 * jucătorului — nivelul lui de bază, stabil (spre deosebire de
 * eaComputeFormDelta, care e volatil pe termen scurt). Pentru portari,
 * folosește direct media (ponderată) a atributelor GK.
 */
function eaComputeBaseOVR(p){
    // Fără poziție setată → tratat ca mijlocaș (profilul de ponderi cel
    // mai "neutru", nu penalizează/favorizează artificial).
    const group = getPlayerPrimaryGroup(p) || 'MID';
    if (group === 'GK'){
        const gk = eaComputeGkAttributes(p);
        const ovr = Math.round((gk.DIV + gk.HAN + gk.REF + gk.POS + gk.KIC*0.6 + gk.SPD*0.4) / 4.2);
        return { ovr: Math.max(1, Math.min(99, ovr)), group, attrs: gk, isGk: true };
    }
    const attrs = eaComputeOutfieldAttributes(p);
    const weights = EA_POSITION_WEIGHTS[group] || EA_POSITION_WEIGHTS.MID;
    const ovr = Math.round(EA_ATTR_KEYS.reduce((s,k)=> s + attrs[k]*weights[k], 0));
    return { ovr: Math.max(1, Math.min(99, ovr)), group, attrs, isGk: false };
}

/**
 * eaComputeFormDelta — modificator ± bazat pe ultimele meciuri (aceeași
 * fereastră ca getActivityMultiplier: ultimele 8 din db.history), dar
 * aici măsurăm win-rate RECENT vs. win-rate general — nu prezența.
 * Independent de Base OVR; se adună la final (Current = Base + Form).
 */
function eaComputeFormDelta(p){
    if (!p.games || p.games < 3) return 0;
    const recent = db.history.slice(0, 8);
    let played = 0, wins = 0;
    recent.forEach(h=>{
        const w = playerWonMatch(h, p.name);
        if (w === null) return;
        played++;
        if (w) wins++;
    });
    if (played < 3) return 0; // istoric recent insuficient → fără modificator, nu ghici
    const recentWr = wins / played;
    const baseWr   = getWinrateShrunk(p);
    const diff = recentWr - baseWr; // -1..+1
    return Math.round(Math.max(-6, Math.min(6, diff * 14)));
}

/**
 * eaGetPlayerCard — punctul de intrare principal pentru UI (echivalent
 * cu getSmartRating(p) de mai sus, dar pentru stratul EA FC). Complet
 * paralel — NU atinge getSmartRating()/computeSmartRatingComponents().
 */
function eaGetPlayerCard(p){
    const base = eaComputeBaseOVR(p);
    // Form deocamdată doar pt. jucători de câmp — eșantionul de meciuri
    // per-portar e de regulă prea mic pt. un semnal de formă fiabil.
    const form = base.isGk ? 0 : eaComputeFormDelta(p);
    const current = Math.max(1, Math.min(99, base.ovr + form));
    const stars = base.isGk ? { skillMoves:1, weakFoot:3 } : eaComputeStarRatings(base.attrs);
    return {
        group: base.group,
        isGk: base.isGk,
        baseOVR: base.ovr,
        formDelta: form,
        currentOVR: current,
        attrs: base.attrs,      // {PAC,SHO,PAS,DRI,DEF,PHY} sau {DIV,HAN,KIC,REF,POS,SPD}
        skillMoves: stars.skillMoves,
        weakFoot: stars.weakFoot,
    };
}

/**
 * eaComputeTeamLineOVR — media Current OVR a unei echipe, per linie de
 * poziție (GK/DEF/MID/FWD) — semnal suplimentar pentru echilibrarea pe
 * 3 echipe (folosibil alături de/în completarea Smart Rating existent
 * din doBalance(), fără să-l înlocuiască).
 */
function eaComputeTeamLineOVR(teamPlayers){
    const lines = { GK:[], DEF:[], MID:[], FWD:[] };
    teamPlayers.forEach(p=>{
        const g = getPlayerPrimaryGroup(p) || 'MID';
        (lines[g]||lines.MID).push(eaGetPlayerCard(p).currentOVR);
    });
    const avg = arr => arr.length ? Math.round(arr.reduce((s,v)=>s+v,0)/arr.length) : null;
    return {
        GK:avg(lines.GK), DEF:avg(lines.DEF), MID:avg(lines.MID), FWD:avg(lines.FWD),
        overall: avg(teamPlayers.map(p=>eaGetPlayerCard(p).currentOVR)),
    };
}
