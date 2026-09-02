/**
 * ═══════════════════════════════════════════════════════════════════
 * smart-rating.js — SINGURA sursă de adevăr pentru rating: sistem
 * stil EA FC / FIFA, scală 1-99 (OVR), cu atribute PAC/SHO/PAS/DRI/
 * DEF/PHY (portar: DIV/HAN/KIC/REF/POS/SPD).
 * ═══════════════════════════════════════════════════════════════════
 *
 * ISTORIC: până acum fișierul ăsta calcula un "Smart Rating" 1-10,
 * o medie ponderată configurabilă (Win Rate/Goluri/Tag-uri/Chimie/
 * etc, cu procente ajustabile din panoul de admin). Sistemul ăla a
 * fost ÎNLOCUIT COMPLET cu motorul EA FC de mai jos — nu mai
 * coexistă în paralel. getSmartRating(p) rămâne ca NUME de funcție
 * (ca să nu trebuiască schimbate zeci de apeluri din app.js/setari.
 * html), dar acum returnează OVR-ul (1-99, întreg), nu vechiul 1-10.
 *
 * Ce s-a întâmplat cu vechile componente (Win Rate, Goluri, Goluri
 * încasate, Viteză, Tag-uri, Chimie, POTM, MVP)?
 *   - Goluri (relativ la poziție) și Goluri încasate (relativ la
 *     poziție) → acum alimentează direct atributele SHOOTING și
 *     DEFENDING (fac parte din Base OVR, ca reprezentare de skill pe
 *     termen lung — au sens acolo, nu doar ca "formă recentă").
 *   - Viteză (status admin) → alimentează PACE (Base OVR).
 *   - Tag-urile → alimentează toate cele 6 atribute prin
 *     impact_profile (profilul pe 9 axe), NU mai există un
 *     "coeficient de rating" separat per tag (tw_weight din
 *     tags_config a devenit vestigial — coloana rămâne în DB, dar
 *     nu mai e citită de formulă).
 *   - Win Rate recent, Chimie (coechipieri actuali), POTM, MVP,
 *     activitate recentă (absențe) și penalizarea de dezechilibru →
 *     toate topite în FORM RATING (modificator ± peste Base OVR,
 *     vezi eaComputeFormDelta) — sunt semnale "de moment", nu skill
 *     intrinsec, deci au sens ca modificator dinamic, nu ca atribut.
 *
 * Încărcat de TOATE paginile (index.html, setari.html, ...) ÎNAINTE
 * de scriptul propriu al fiecărei pagini:
 *   <script src="smart-rating.js"></script>
 *   <script src="app.js?v=..."></script>
 *
 * DEPENDENȚE GLOBALE necesare din pagina care include acest fișier:
 *   - db.players  → array de jucători {name, status, wins, games,
 *                   totalGoals, totalGoalsConceded, adminTags,
 *                   adminRating, lastImbalanceLoss, speedStatus,
 *                   positionPrimary, role, potmCount, mvpCount, ...}
 *   - db.history  → array de meciuri {orangePlayers, greenPlayers,
 *                   blackPlayers, winner, ...}
 *   - tagsConfig  → array de tag-uri configurate {id, type, impact_profile, ...}
 *   - POSITIONS   → obiect {COD: {group:'GK'|'DEF'|'MID'|'FWD', ...}}
 *
 * Acest fișier NU face nimic legat de UI (fără HTML, fără DOM) — doar
 * calcul pur.
 */

// ── Constantă internă (NU mai e configurabilă din admin) ───────────
// Punct-pivot pentru scalele intermediare 0-10 folosite de funcțiile
// de mai jos înainte de proiecția finală pe 1-99 (eaMapScoreTo99).
// Detaliu de implementare — nu mai apare nicăieri în UI.
const BASE_RATING = 5.0;

// "meciuri virtuale" la 50% winrate — shrinkage bayesian, ca un
// jucător cu 1 meci/1 victorie să nu primească același bonus ca unul
// cu 20 din 25.
const WINRATE_PRIOR_GAMES = 8;

// Atribute de bază (din impact_profile al tag-urilor) — alimentează
// motorul EA de mai jos (fiecare din cele 6 atribute EA e o combinație
// din astea + semnale statistice).
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

// ── Goluri, relativ la poziție (→ alimentează SHOOTING) ─────────────
function getGroupAvgGoalsPerGame(pool){
    const withGames = pool.filter(pl => pl.games > 0);
    if (!withGames.length) return 0;
    return withGames.reduce((s,pl) => s + (pl.totalGoals||0) / pl.games, 0) / withGames.length;
}
/**
 * Scor 0-10 (centrat pe BASE_RATING) pentru golurile unui jucător,
 * calculat RELATIV la media jucătorilor din același grup de poziție
 * (GK/DEF/MID/FWD) — nu un bonus fix, ca să nu penalizeze nedrept
 * fundașii/portarii față de atacanți.
 */
function getGoalsScoreRelative(p){
    if (!p.games) return BASE_RATING;
    const gpg = (p.totalGoals||0) / p.games;
    const group = getPlayerPrimaryGroup(p);
    let pool = group ? db.players.filter(pl => getPlayerPrimaryGroup(pl) === group) : [];
    if (pool.filter(pl=>pl.games>0).length < 3) pool = db.players;
    const avgGpg = getGroupAvgGoalsPerGame(pool);
    const scale = Math.max(avgGpg, 0.3);
    const diff = (gpg - avgGpg) / scale;
    const delta = Math.max(-3, Math.min(3, diff * 2.5));
    return BASE_RATING + delta;
}

// ── Goluri încasate (echipă, cât a jucat el), relativ la poziție (→ DEFENDING) ──
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
    const diff = (avgCpg - cpg) / scale;
    const delta = Math.max(-3, Math.min(3, diff * 2.5));
    return BASE_RATING + delta;
}

// ── Viteză (status admin, 6 trepte) (→ PACE) ─────────────────────────
const SPEED_TIER_VALUE = { 'slow-':1, 'slow':2, 'normal':3, 'fast':4, 'fast+':5, 'fast++':6 };
function getGroupAvgSpeedValue(pool){
    const withSpeed = pool.filter(pl => pl.speedStatus && SPEED_TIER_VALUE[pl.speedStatus] != null);
    if (!withSpeed.length) return 3;
    return withSpeed.reduce((s,pl)=> s + SPEED_TIER_VALUE[pl.speedStatus], 0) / withSpeed.length;
}
function getSpeedScore(p){
    if (!p.speedStatus || SPEED_TIER_VALUE[p.speedStatus] == null) return BASE_RATING;
    const myVal  = SPEED_TIER_VALUE[p.speedStatus];
    const avgVal = getGroupAvgSpeedValue(db.players);
    const diff   = myVal - avgVal;
    const delta  = Math.max(-3, Math.min(3, diff * 1.5));
    return BASE_RATING + delta;
}

// ── Win Rate, cu shrinkage bayesian ──────────────────────────────────
function getWinrateShrunk(p){
    return (p.wins + WINRATE_PRIOR_GAMES*0.5) / (p.games + WINRATE_PRIOR_GAMES);
}

// ── Tag-uri active (admin-set) ───────────────────────────────────────
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

// ── Chimie (win-rate cu coechipierii) — folosit acum de Form Rating ──
/**
 * Dacă un meci s-a jucat și cine a câștigat, din perspectiva unui jucător.
 * Returnează true/false/null (null = nu a jucat deloc acel meci).
 */
function playerWonMatch(h, playerName){
    const inOrange = (h.orangePlayers||[]).includes(playerName);
    const inGreen  = (h.greenPlayers||[]).includes(playerName);
    const inBlack  = (h.blackPlayers||[]).includes(playerName);
    if (!inOrange && !inGreen && !inBlack) return null;

    const w = (h.winner||'').toLowerCase().trim();
    if (!w || w === 'egal') return false;

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
    if (together < 2) return 0.5;
    return wins / together;
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
 * Coechipierii ACTUALI ai unui jucător (status curent orange/green/
 * bench) — folosiți implicit pentru Chimie când nu se dă un context
 * explicit (ex: pe parcursul echilibrării de echipe, unde doBalance
 * din app.js pasează teammates-ul PE CARE ÎL CONSTRUIEȘTE, nu cel
 * salvat — vezi context.teammates în eaComputeFormDelta mai jos).
 */
function getCurrentTeammates(p){
    if (!p.status || !['orange','green','bench'].includes(p.status)) return [];
    return db.players.filter(pl => pl.status===p.status && pl.name!==p.name);
}

// ── Activitate recentă (absențe) — folosit de Form Rating ────────────
function getActivityMultiplier(p){
    const recentMatches = db.history.slice(0, 8);
    if (recentMatches.length < 3) return 1.0;
    let absent = 0;
    recentMatches.forEach(h => {
        const played = (h.orangePlayers||[]).includes(p.name) || (h.greenPlayers||[]).includes(p.name) || (h.blackPlayers||[]).includes(p.name);
        if (!played) absent++;
    });
    return Math.max(0.80, 1.0 - absent * 0.06);
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * MOTOR EA FC / FIFA — atribute stil card (1-99), OVR pozițional,
 * Weak Foot ★ / Skill Moves ★, Base OVR + Form Rating.
 * ═══════════════════════════════════════════════════════════════════
 */

const EA_ATTR_KEYS = ['PAC','SHO','PAS','DRI','DEF','PHY'];
const GK_ATTR_KEYS = ['DIV','HAN','KIC','REF','POS','SPD'];

// ── Singurele 2 "cadrane" rămase reglabile din panoul de admin ─────
// (tot restul formulei e fix — vezi decizia de simplificare radicală
// a panoului). Sunt `let`, nu `const`, ca să poată fi suprascrise din
// Supabase (tabela algo_settings, cheile 'ea_base99'/'ea_scale99') la
// încărcarea paginii — vezi loadAlgoSettings() din app.js/setari.html.
const DEFAULT_EA_BASE99 = 62;   // centrul scalei — "jucătorul mediu" al ligii
const DEFAULT_EA_SCALE99 = 6.5; // cât "cântărește" 1pt de abatere (scala internă 0-10) pe scala 1-99
let EA_BASE99 = DEFAULT_EA_BASE99;
let EA_SCALE99 = DEFAULT_EA_SCALE99;

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
 * app.js (însumează peste toată echipa, pt echilibrare pe posturi).
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
 * jucător) → scor 0-10 centrat pe BASE_RATING. Clamp-ul
 * (EA_PROFILE_CLAMP) se aplică AICI, per-jucător — nu în profilul
 * brut — ca să nu afecteze computeTeamAttrProfile din app.js. */
function eaProfileAttrScore(profile, key){
    const clamped = Math.max(-EA_PROFILE_CLAMP, Math.min(EA_PROFILE_CLAMP, profile[key]||0));
    return BASE_RATING + clamped * (5/EA_PROFILE_CLAMP);
}

function eaBlend(parts){
    const wSum = parts.reduce((s,x)=>s+x.w,0);
    return BASE_RATING + parts.reduce((s,x)=>s+(x.score-BASE_RATING)*x.w,0)/(wSum||1);
}

/**
 * eaComputeOutfieldAttributes — cele 6 atribute EA FC (1-99) pentru un
 * jucător de câmp: PACE, SHOOTING, PASSING, DRIBBLING, DEFENDING,
 * PHYSICAL. Derivate din statistici (goluri/poziție, goluri
 * încasate/poziție, status viteză, win rate) + profilul de tag-uri —
 * reprezintă nivelul de SKILL pe termen lung (nu formă recentă, aia
 * e Form Rating mai jos).
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
        _raw: {PAC,SHO,PAS,DRI,DEF,PHY},
    };
}

/**
 * eaComputeGkAttributes — atributele de portar (1-99): DIVING,
 * HANDLING, KICKING, REFLEXES, POSITIONING, SPEED. Formulă separată de
 * cea a jucătorilor de câmp. Acoperă explicit tag-urile de portar din
 * tags_config (Shot Stopper, Sweeper Keeper, Distribuție cu Piciorul).
 */
function eaComputeGkAttributes(p){
    const profile = getPlayerImpactProfile(p);
    const defenseScore = getConcededScoreRelative(p);
    const speedScore   = getSpeedScore(p);
    const aparare      = eaProfileAttrScore(profile,'aparare');
    const tehnica      = eaProfileAttrScore(profile,'tehnica');
    const strategie    = eaProfileAttrScore(profile,'strategie');
    const pozitionare  = eaProfileAttrScore(profile,'pozitionare');
    const mentalitate  = eaProfileAttrScore(profile,'mentalitate');

    const DIV = eaBlend([ {score:defenseScore,w:.60}, {score:aparare,w:.25}, {score:mentalitate,w:.15} ]);
    const HAN = eaBlend([ {score:defenseScore,w:.50}, {score:aparare,w:.35}, {score:tehnica,w:.15} ]);
    const KIC = eaBlend([ {score:tehnica,w:.55}, {score:strategie,w:.45} ]);
    const REF = eaBlend([ {score:defenseScore,w:.65}, {score:aparare,w:.20}, {score:mentalitate,w:.15} ]);
    const POS = eaBlend([ {score:pozitionare,w:.45}, {score:strategie,w:.35}, {score:defenseScore,w:.20} ]);
    const SPD = eaBlend([ {score:speedScore,w:.75}, {score:pozitionare,w:.25} ]);

    return {
        DIV: eaMapScoreTo99(DIV), HAN: eaMapScoreTo99(HAN), KIC: eaMapScoreTo99(KIC),
        REF: eaMapScoreTo99(REF), POS: eaMapScoreTo99(POS), SPD: eaMapScoreTo99(SPD),
        _raw: {DIV,HAN,KIC,REF,POS,SPD},
    };
}

/** Weak Foot ★ / Skill Moves ★ (1-5), derivate din atributele deja
 * calculate. Formulă simplă, ușor de recalibrat direct în cod dacă
 * distribuția nu arată bine în practică. */
function eaComputeStarRatings(attrs){
    const skillMoves = Math.max(1, Math.min(5, Math.round(1 + (attrs.DRI - 40) / 13)));
    const weakFoot    = Math.max(1, Math.min(5, Math.round(1 + ((attrs.PAS + attrs.SHO)/2 - 40) / 14)));
    return { skillMoves, weakFoot };
}

// ── Matrice de ponderi per poziție (transformă cele 6 atribute în OVR) ──
// Grupurile (GK/DEF/MID/FWD) vin din POSITIONS[...].group. Suma
// ponderilor pe fiecare linie = 1. (FWD = "ATT"-ul din cerința
// inițială, redenumit ca să fie consistent cu gruparea din cod.)
const EA_POSITION_WEIGHTS = {
    FWD: { PAC:.20, SHO:.35, PAS:.10, DRI:.25, DEF:.02, PHY:.08 },
    MID: { PAC:.12, SHO:.10, PAS:.30, DRI:.25, DEF:.13, PHY:.10 },
    DEF: { PAC:.15, SHO:.03, PAS:.12, DRI:.10, DEF:.45, PHY:.15 },
};

/**
 * eaComputeBaseOVR — OVR (1-99) pe baza istoricului COMPLET al
 * jucătorului — nivelul lui de bază, stabil. Pentru portari, folosește
 * direct media (ponderată) a atributelor GK.
 */
function eaComputeBaseOVR(p){
    const group = getPlayerPrimaryGroup(p) || 'MID'; // fără poziție setată → profilul de ponderi cel mai neutru
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

// ── FORM RATING — modificator ± peste Base OVR ──────────────────────
// Aici sunt "topite" Win Rate recent, Chimia cu coechipierii, POTM,
// MVP, Activitatea recentă (absențe) și penalizarea de Dezechilibru —
// toate semnale DE MOMENT, nu skill intrinsec. Constantele de mai jos
// NU mai sunt expuse în panoul de admin (simplificare radicală) — se
// reglează direct în cod dacă e nevoie.
const EA_FORM_WINRATE_SCALE  = 14;  // (WR recent − WR general) × asta, clamp ±6
const EA_FORM_WINRATE_CAP    = 6;
const EA_FORM_CHEM_SCALE     = 8;   // sinergie ±0.5 × asta, clamp ±4
const EA_FORM_CHEM_CAP       = 4;
const EA_FORM_POTM_SCALE     = 20;  // rată POTM × asta, doar bonus
const EA_FORM_POTM_CAP       = 3;
const EA_FORM_MVP_SCALE      = 16;  // rată MVP × asta, doar bonus
const EA_FORM_MVP_CAP        = 2;
const EA_FORM_ACTIVITY_SCALE = 20;  // (actMult−1) × asta, doar penalizare (max −4 la actMult=0.80)
const EA_FORM_IMBALANCE_PER  = 1.5; // per meci pierdut la dezechilibru, plafonat la 3 → max −4.5
const EA_FORM_TOTAL_CAP      = 12;  // plafon final, indiferent câte semnale se adună

/**
 * eaComputeFormDelta — vezi comentariul secțiunii de mai sus. Acceptă
 * un context opțional `{teammates}` — folosit de doBalance() din
 * app.js, ca Chimia să reflecte echipa PE CARE O CONSTRUIEȘTE algorit-
 * mul în acel moment, nu echipa salvată în DB (exact ca înainte).
 * Returnează {delta, signals} — signals e folosit de UI pt breakdown.
 */
function eaComputeFormDelta(p, context = {}){
    if (!p.games || p.games < 3) return { delta:0, signals:[] };
    const signals = [];
    let total = 0;

    // 1) Win Rate recent (ultimele 8 meciuri) vs. win rate general
    const recent = db.history.slice(0, 8);
    let played=0, wins=0;
    recent.forEach(h=>{ const w=playerWonMatch(h,p.name); if(w===null) return; played++; if(w) wins++; });
    if (played >= 3){
        const recentWr = wins/played, baseWr = getWinrateShrunk(p);
        const d = Math.round(Math.max(-EA_FORM_WINRATE_CAP, Math.min(EA_FORM_WINRATE_CAP, (recentWr-baseWr) * EA_FORM_WINRATE_SCALE)));
        if (d){ total+=d; signals.push({icon:'📈', label:'Win Rate recent', note:`${Math.round(recentWr*100)}% (ultimele ${played}) vs ${Math.round(baseWr*100)}% general`, delta:d}); }
    }

    // 2) Chimie cu coechipierii (actuali, sau cei din context la balansare)
    const teammates = (context.teammates && context.teammates.length) ? context.teammates : getCurrentTeammates(p);
    if (teammates.length){
        const chemRaw = getTeamSynergyBonus(p.name, teammates); // ±0.5
        const d = Math.round(Math.max(-EA_FORM_CHEM_CAP, Math.min(EA_FORM_CHEM_CAP, chemRaw * EA_FORM_CHEM_SCALE)));
        if (d){ total+=d; signals.push({icon:'🧪', label:'Chimie', note:`win-rate cu ${teammates.length} coechipieri: ${Math.round((chemRaw+0.5)*100)}%`, delta:d}); }
    }

    // 3) POTM / MVP — rată, plafonate, DOAR bonus (niciodată penalizare)
    const potmRate = (p.potmCount||0)/p.games;
    const dPotm = Math.round(Math.min(potmRate*EA_FORM_POTM_SCALE, EA_FORM_POTM_CAP));
    if (dPotm){ total+=dPotm; signals.push({icon:'⭐', label:'POTM', note:`${p.potmCount||0} din ${p.games} meciuri`, delta:dPotm}); }

    const mvpRate = (p.mvpCount||0)/p.games;
    const dMvp = Math.round(Math.min(mvpRate*EA_FORM_MVP_SCALE, EA_FORM_MVP_CAP));
    if (dMvp){ total+=dMvp; signals.push({icon:'👑', label:'MVP', note:`${p.mvpCount||0} din ${p.games} meciuri`, delta:dMvp}); }

    // 4) Activitate recentă (absențe) — DOAR penalizare
    const actMult = getActivityMultiplier(p); // 0.80..1.0
    const dAct = Math.round((actMult-1) * EA_FORM_ACTIVITY_SCALE);
    if (dAct){ total+=dAct; signals.push({icon:'📅', label:'Activitate recentă', note: 'absențe în ultimele meciuri', delta:dAct}); }

    // 5) Dezechilibru — penalizare pt cei cu pierderi mari repetate
    const imbalLoss = Math.min(p.lastImbalanceLoss||0, 3);
    const dImbal = imbalLoss>0 ? -Math.round(imbalLoss * EA_FORM_IMBALANCE_PER) : 0;
    if (dImbal){ total+=dImbal; signals.push({icon:'⚠️', label:'Dezechilibru', note:`${imbalLoss} meci(uri) pierdut(e) cu 3+ goluri`, delta:dImbal}); }

    const clamped = Math.max(-EA_FORM_TOTAL_CAP, Math.min(EA_FORM_TOTAL_CAP, total));
    return { delta: clamped, signals };
}

/**
 * eaGetPlayerCard — punctul de intrare principal pentru UI. Base OVR,
 * Form Rating, Current (=Base+Form), atribute, weak foot/skill moves.
 */
function eaGetPlayerCard(p, context = {}){
    const base = eaComputeBaseOVR(p);
    // Form doar pt. jucători de câmp — eșantionul per-portar e de
    // regulă prea mic pt. un semnal de formă fiabil.
    const formResult = base.isGk ? { delta:0, signals:[] } : eaComputeFormDelta(p, context);
    const current = Math.max(1, Math.min(99, base.ovr + formResult.delta));
    const stars = base.isGk ? { skillMoves:1, weakFoot:3 } : eaComputeStarRatings(base.attrs);
    return {
        group: base.group,
        isGk: base.isGk,
        baseOVR: base.ovr,
        formDelta: formResult.delta,
        formSignals: formResult.signals,
        currentOVR: current,
        attrs: base.attrs,
        skillMoves: stars.skillMoves,
        weakFoot: stars.weakFoot,
    };
}

/**
 * eaComputeTeamLineOVR — media Current OVR a unei echipe, per linie de
 * poziție (GK/DEF/MID/FWD) — semnal suplimentar pentru echilibrarea pe
 * 3 echipe.
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

/**
 * getSmartRating — PĂSTRAT ca nume (folosit în zeci de locuri în
 * app.js/setari.html/live.html/clasament.html), dar acum returnează
 * OVR-ul EA (1-99, întreg) în loc de vechiul 1-10. `context` e opțional
 * și e propagat la Chimie (vezi eaComputeFormDelta) — folosit de
 * doBalance() în timpul echilibrării de echipe.
 */
function getSmartRating(p, context = {}){
    if (p.adminRating != null) return Math.max(1, Math.min(99, Math.round(p.adminRating)));
    return eaGetPlayerCard(p, context).currentOVR;
}
