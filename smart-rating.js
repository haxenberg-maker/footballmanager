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
const DEFAULT_W = {winrate:0.30, goals:0.30, tags:0.30, chemistry:0.10};
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
    tags:'🏷️ Tag-uri',
    chemistry:'🧪 Chimie (coechipieri actuali)',
};

const PRESETS = {
    balanced:    {winrate:.30, goals:.30, tags:.30, chemistry:.10},
    defensive:   {winrate:.25, goals:.20, tags:.40, chemistry:.15},
    performance: {winrate:.30, goals:.40, tags:.25, chemistry:.05},
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

    const parts = [
        { key:'winrate',   icon:'📈', label:'Win Rate',         score:winrateScore,   w:W.winrate||0 },
        { key:'goals',     icon:'⚽', label:'Goluri (poziție)', score:goalsScore,     w:W.goals||0 },
        { key:'tags',      icon:'🏷️', label:'Tag-uri',          score:tagsScore,      w:W.tags||0 },
        { key:'chemistry', icon:'🧪', label:'Chimie',           score:chemistryScore, w:W.chemistry||0 },
    ];
    const wSum = parts.reduce((s,c)=>s+c.w, 0);
    parts.forEach(c => { c.delta = wSum>0 ? (c.score-BASE_RATING) * c.w / wSum : 0; });
    const blendBase = BASE_RATING + parts.reduce((s,c)=>s+c.delta, 0);

    // Penalizare dezechilibru
    const imbalPen   = Math.min((p.lastImbalanceLoss||0), 3) * 0.20;
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
