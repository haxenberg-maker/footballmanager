/**
 * ═══════════════════════════════════════════════════════════════════
 * smart-rating.js — SINGURA sursă de adevăr pentru rating: sistem
 * stil EA FC / FIFA, scală 1-99 (OVR), cu atribute PAC/SHO/PAS/DRI/
 * DEF/PHY (portar: DIV/HAN/KIC/REF/POS/SPD).
 * ═══════════════════════════════════════════════════════════════════
 *
 * ARHITECTURĂ (v3 — control manual):
 *   - Atributele (PAC/SHO/PAS/DRI/DEF/PHY, respectiv DIV/HAN/KIC/REF/
 *     POS/SPD la portari) NU mai sunt calculate automat din statistici
 *     (goluri/viteză/goluri încasate). Adminul le setează DIRECT, din
 *     modalul jucătorului, cu butoane +/− (vezi eaGetManualAttrs).
 *     Implicit, un jucător fără nimic setat pornește de la
 *     EA_MANUAL_DEFAULT (40) la toate — adminul le ajustează după
 *     cum crede de cuviință.
 *   - Tag-urile rămân — dar acum sunt un BONUS mic peste valoarea
 *     manuală (±EA_TAG_BONUS_CAP puncte per atribut), nu mai sunt
 *     motorul principal. Vezi eaComputeTagBonus.
 *   - REFACTOR (v4 — effects in-line, fără profil extern): tag-ul NU
 *     mai are un "Profil atribute" (impact_profile pe 9 chei abstracte
 *     viteza/tehnica/.../pozitionare) mapat indirect spre PAC/SHO/PAS/
 *     DRI/DEF/PHY. În loc, tag-ul are un obiect `effects` in-line, cu
 *     EXACT cele 6 chei EA (pac/sho/pas/dri/def/phy), aplicate direct,
 *     1-la-1, ca bonus pe atributul cu același nume. Vezi EFFECT_KEYS
 *     și eaComputeTagBonus.
 *   - Base OVR = combinație ponderată (per poziție) din atributele
 *     finale (manual + bonus tag-uri) — neschimbat conceptual.
 *   - Form Rating (Win Rate recent, Chimie, POTM, MVP, Activitate,
 *     Dezechilibru) rămâne un modificator ± separat peste Base OVR —
 *     neschimbat față de varianta anterioară.
 *   - getSmartRating(p) rămâne numele funcției (folosit peste tot în
 *     app.js/setari.html), returnează OVR (1-99, întreg).
 *
 * Încărcat de TOATE paginile (index.html, setari.html, ...) ÎNAINTE
 * de scriptul propriu al fiecărei pagini:
 *   <script src="smart-rating.js"></script>
 *   <script src="app.js?v=..."></script>
 *
 * DEPENDENȚE GLOBALE necesare din pagina care include acest fișier:
 *   - db.players  → array de jucători {name, status, wins, games,
 *                   adminTags, adminRating, manualAttrs,
 *                   lastImbalanceLoss, positionPrimary, role,
 *                   potmCount, mvpCount, ...}
 *   - db.history  → array de meciuri {orangePlayers, greenPlayers,
 *                   blackPlayers, winner, ...}
 *   - tagsConfig  → array de tag-uri configurate {id, type, effects, ...}
 *                   unde effects = {pac,sho,pas,dri,def,phy} (in-line,
 *                   fără profil extern — vezi REFACTOR v4 mai sus)
 *   - POSITIONS   → obiect {COD: {group:'GK'|'DEF'|'MID'|'FWD', ...}}
 *
 * Acest fișier NU face nimic legat de UI (fără HTML, fără DOM) — doar
 * calcul pur.
 */

// "meciuri virtuale" la 50% winrate — shrinkage bayesian, ca un
// jucător cu 1 meci/1 victorie să nu primească același bonus ca unul
// cu 20 din 25.
const WINRATE_PRIOR_GAMES = 8;

// Cele 6 chei EA pe care le poate seta direct un tag, in-line, în
// `tag.effects` — nu mai există un profil intermediar/extern.
const EFFECT_KEYS = ['pac','sho','pas','dri','def','phy'];

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

// ── Chimie (win-rate cu coechipierii) — folosit de Form Rating ──────
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

function getTeamSynergyBonus(playerName, teammates){
    if (!teammates.length) return 0;
    const scores = teammates.map(m => getSynergyScore(playerName, m.name));
    const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
    return (avg - 0.5) * 1.0;
}

function getCurrentTeammates(p){
    if (!p.status || !['orange','green','bench'].includes(p.status)) return [];
    return db.players.filter(pl => pl.status===p.status && pl.name!==p.name);
}

// ── Performanță Goluri (relativ la grupul de meciuri jucate) ────────
// Înlocuiește vechiul calcul "goluri brute * pondere" dintr-un scor de
// performanță: un jucător cu 5 goluri din 3 meciuri nu e comparabil
// direct cu unul cu 5 goluri din 15 meciuri, deci comparăm fiecare
// jucător cu MEDIA grupului lui de jucători cu ACELAȘI matchesPlayed.
const DEFAULT_GOAL_BONUS_WEIGHT = 0.6; // ia locul fostului `s.goals*0.6`
let GOAL_BONUS_WEIGHT = DEFAULT_GOAL_BONUS_WEIGHT;

/**
 * computeGoalDeltaScores — primește un array de statistici de jucători
 * `{ name, goals, matchesPlayed, ... }` (de regulă o fereastră de timp:
 * săptămâna curentă, sezonul curent etc.) și întoarce ACELAȘI array,
 * augmentat cu:
 *   - groupAvgGoals: media golurilor jucătorilor cu același matchesPlayed
 *   - deltaGoals:    goluri proprii − groupAvgGoals
 *   - goalScore:     deltaGoals * goalBonusWeight (component în scorul final)
 * Jucătorii cu matchesPlayed=0 nu au grup relevant → deltaGoals=0.
 */
function computeGoalDeltaScores(playersStats, goalBonusWeight = GOAL_BONUS_WEIGHT){
    // 1) Grupare după numărul exact de meciuri jucate.
    const groups = {}; // matchesPlayed -> { totalGoals, count }
    playersStats.forEach(s=>{
        const mp = s.matchesPlayed;
        if(!mp) return;
        if(!groups[mp]) groups[mp] = { totalGoals:0, count:0 };
        groups[mp].totalGoals += (s.goals||0);
        groups[mp].count += 1;
    });
    // 2) Medie pe grup: Medie_Goluri_Grup = Total_Goluri_Grup / Numar_Jucatori_Grup
    const avgByGroup = {};
    Object.keys(groups).forEach(mp=>{
        avgByGroup[mp] = groups[mp].count ? groups[mp].totalGoals / groups[mp].count : 0;
    });
    // 3) Delta + 4) Punctaj_Goluri = deltaGoals * goalBonusWeight
    return playersStats.map(s=>{
        const groupAvg = s.matchesPlayed ? (avgByGroup[s.matchesPlayed] || 0) : 0;
        const deltaGoals = (s.goals||0) - groupAvg;
        return { ...s, groupAvgGoals: groupAvg, deltaGoals, goalScore: deltaGoals * goalBonusWeight };
    });
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
 * MOTOR EA FC / FIFA — atribute SETATE MANUAL de admin + bonus mic din
 * tag-uri, OVR pozițional, Weak Foot ★ / Skill Moves ★, Base OVR +
 * Form Rating.
 * ═══════════════════════════════════════════════════════════════════
 */

const EA_ATTR_KEYS = ['PAC','SHO','PAS','DRI','DEF','PHY'];
const GK_ATTR_KEYS = ['DIV','HAN','KIC','REF','POS','SPD'];
const EA_DIRECT_KEYS = ['PAC','SHO','PAS','DRI','DEF','PHY'];

// Valoarea de start pentru un atribut nesetat încă de admin — un
// jucător nou pornește de la un profil "mediu" pe toate, și adminul îl
// ajustează manual din modal.
const EA_MANUAL_DEFAULT = 40;

// Cât de mult poate un tag să tragă (în sus/jos) un atribut — și cât
// de "tare" contează, per unitate de profil. Astea 2 sunt SINGURELE
// cadrane reglabile din panoul de admin acum (restul e control manual
// direct pe jucător).
const DEFAULT_EA_TAG_BONUS_CAP = 8;    // puncte OVR, max per atribut
const DEFAULT_EA_TAG_BONUS_SCALE = 1.0; // multiplicator de intensitate
let EA_TAG_BONUS_CAP = DEFAULT_EA_TAG_BONUS_CAP;
let EA_TAG_BONUS_SCALE = DEFAULT_EA_TAG_BONUS_SCALE;

/**
 * eaGetManualAttrs — valorile SETATE DE ADMIN pentru un jucător (1-99,
 * întregi). Dacă nu s-a setat nimic încă, toate pornesc de la
 * EA_MANUAL_DEFAULT. NU calculează nimic din statistici — e input
 * direct, citit din p.manualAttrs (coloana `manual_attrs`, jsonb).
 */
function eaGetManualAttrs(p, isGk){
    const keys = isGk ? GK_ATTR_KEYS : EA_ATTR_KEYS;
    const saved = p.manualAttrs || {};
    const out = {};
    keys.forEach(k=>{
        const v = parseFloat(saved[k]);
        out[k] = (!isNaN(v)) ? Math.max(1, Math.min(99, Math.round(v))) : EA_MANUAL_DEFAULT;
    });
    return out;
}

/**
 * getPlayerDirectEaProfile — suma `tag.effects` (cele 6 chei EA
 * in-line: pac/sho/pas/dri/def/phy) peste tag-urile ACTIVE ale UNUI
 * SINGUR jucător, NECLAMPUITĂ, cu chei rezultat în format EA
 * (PAC/SHO/PAS/DRI/DEF/PHY) — gata de folosit peste EA_ATTR_KEYS.
 * Fără GK: schema `effects` acoperă doar cele 6 atribute de câmp;
 * portarii nu primesc bonus din tag-uri (ca înainte de refactor,
 * pentru chei GK nu exista mapare directă oricum).
 */
function getPlayerDirectEaProfile(p){
    const profile = {};
    EA_DIRECT_KEYS.forEach(k=>{ profile[k]=0; });
    getPlayerActiveTagObjects(p).forEach(obj=>{
        const fx = obj.tag?.effects || {};
        EFFECT_KEYS.forEach(k=>{
            const v = parseFloat(fx[k]);
            if(!isNaN(v)) profile[k.toUpperCase()] += v;
        });
    });
    return profile;
}

/**
 * eaComputeTagBonus — bonus/penalizare per atribut EA, DOAR din
 * tag-urile active — plafonat la ±EA_TAG_BONUS_CAP puncte. Se adună
 * peste valoarea manuală (eaGetManualAttrs), nu o înlocuiește.
 * Portarii (isGk) nu au bonus din tag-uri: `effects` e definit doar
 * pentru atributele de câmp (PAC/SHO/PAS/DRI/DEF/PHY).
 */
function eaComputeTagBonus(p, isGk){
    const keys = isGk ? GK_ATTR_KEYS : EA_ATTR_KEYS;
    const bonus = {}; keys.forEach(k=>{ bonus[k]=0; });
    if(isGk) return bonus;

    const direct = getPlayerDirectEaProfile(p);
    EA_DIRECT_KEYS.forEach(k=>{
        const raw = Math.max(-EA_TAG_BONUS_CAP, Math.min(EA_TAG_BONUS_CAP, direct[k]||0));
        bonus[k] += raw * EA_TAG_BONUS_SCALE;
    });

    keys.forEach(k=>{ bonus[k] = Math.max(-EA_TAG_BONUS_CAP, Math.min(EA_TAG_BONUS_CAP, Math.round(bonus[k]))); });
    return bonus;
}

/**
 * eaComputeOutfieldAttributes — atributele finale (1-99) ale unui
 * jucător de câmp: manual (setat de admin) + bonus tag-uri, clampuit.
 */
function eaComputeOutfieldAttributes(p){
    const manual = eaGetManualAttrs(p, false);
    const bonus  = eaComputeTagBonus(p, false);
    const out = { _manual: manual, _bonus: bonus };
    EA_ATTR_KEYS.forEach(k=>{ out[k] = Math.max(1, Math.min(99, manual[k] + bonus[k])); });
    return out;
}
/** La fel, pentru portari: DIV/HAN/KIC/REF/POS/SPD. */
function eaComputeGkAttributes(p){
    const manual = eaGetManualAttrs(p, true);
    const bonus  = eaComputeTagBonus(p, true);
    const out = { _manual: manual, _bonus: bonus };
    GK_ATTR_KEYS.forEach(k=>{ out[k] = Math.max(1, Math.min(99, manual[k] + bonus[k])); });
    return out;
}

/** Weak Foot ★ / Skill Moves ★ (1-5), derivate din atributele finale
 * (manual + bonus). Formulă simplă, ușor de recalibrat direct în cod. */
function eaComputeStarRatings(attrs){
    const skillMoves = Math.max(1, Math.min(5, Math.round(1 + (attrs.DRI - 40) / 13)));
    const weakFoot    = Math.max(1, Math.min(5, Math.round(1 + ((attrs.PAS + attrs.SHO)/2 - 40) / 14)));
    return { skillMoves, weakFoot };
}

// ── Matrice de ponderi per poziție (transformă cele 6 atribute în OVR) ──
const EA_POSITION_WEIGHTS = {
    FWD: { PAC:.20, SHO:.35, PAS:.10, DRI:.25, DEF:.02, PHY:.08 },
    MID: { PAC:.12, SHO:.10, PAS:.30, DRI:.25, DEF:.13, PHY:.10 },
    DEF: { PAC:.15, SHO:.03, PAS:.12, DRI:.10, DEF:.45, PHY:.15 },
};

/**
 * eaComputeBaseOVR — OVR (1-99) din atributele finale (manual + bonus
 * tag-uri), ponderat pe poziție. Pentru portari, medie ponderată a
 * atributelor GK.
 */
function eaComputeBaseOVR(p){
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
 * eaComputeTagImpact — cât Base OVR câștigă/pierde jucătorul DOAR din
 * tag-ul `tagId`, izolat de restul. Delta e ACELAȘI număr indiferent
 * dacă tag-ul e activ acum sau nu (efectul marginal de "a avea
 * tag-ul") — doar `isActive` schimbă cum îl explici în UI.
 */
function eaComputeTagImpact(p, tagId){
    const tid = String(tagId);
    const current = (p.adminTags||[]).map(String);
    const isActive = current.includes(tid);

    const withSet = new Set(current); withSet.add(tid);
    const withoutSet = new Set(current); withoutSet.delete(tid);

    const pWith = { ...p, adminTags: [...withSet] };
    const pWithout = { ...p, adminTags: [...withoutSet] };

    const ovrWith = eaComputeBaseOVR(pWith).ovr;
    const ovrWithout = eaComputeBaseOVR(pWithout).ovr;
    return { delta: ovrWith - ovrWithout, isActive };
}

// ── FORM RATING — modificator ± peste Base OVR ──────────────────────
// Win Rate recent, Chimia cu coechipierii, POTM, MVP, Activitatea
// recentă (absențe) și penalizarea de Dezechilibru — semnale DE
// MOMENT, nu skill intrinsec (ăla e Base OVR, de mai sus). Constantele
// de mai jos nu mai sunt expuse în panoul de admin — se reglează
// direct în cod dacă e nevoie.
const EA_FORM_WINRATE_SCALE  = 14;
const EA_FORM_WINRATE_CAP    = 6;
const EA_FORM_CHEM_SCALE     = 8;
const EA_FORM_CHEM_CAP       = 4;
const EA_FORM_POTM_SCALE     = 20;
const EA_FORM_POTM_CAP       = 3;
const EA_FORM_MVP_SCALE      = 16;
const EA_FORM_MVP_CAP        = 2;
const EA_FORM_ACTIVITY_SCALE = 20;
const EA_FORM_IMBALANCE_PER  = 1.5;
const EA_FORM_TOTAL_CAP      = 12;

function eaComputeFormDelta(p, context = {}){
    if (!p.games || p.games < 3) return { delta:0, signals:[] };
    const signals = [];
    let total = 0;

    const recent = db.history.slice(0, 8);
    let played=0, wins=0;
    recent.forEach(h=>{ const w=playerWonMatch(h,p.name); if(w===null) return; played++; if(w) wins++; });
    if (played >= 3){
        const recentWr = wins/played, baseWr = getWinrateShrunk(p);
        const d = Math.round(Math.max(-EA_FORM_WINRATE_CAP, Math.min(EA_FORM_WINRATE_CAP, (recentWr-baseWr) * EA_FORM_WINRATE_SCALE)));
        if (d){ total+=d; signals.push({icon:'📈', label:'Win Rate recent', note:`${Math.round(recentWr*100)}% (ultimele ${played}) vs ${Math.round(baseWr*100)}% general`, delta:d}); }
    }

    const teammates = (context.teammates && context.teammates.length) ? context.teammates : getCurrentTeammates(p);
    if (teammates.length){
        const chemRaw = getTeamSynergyBonus(p.name, teammates);
        const d = Math.round(Math.max(-EA_FORM_CHEM_CAP, Math.min(EA_FORM_CHEM_CAP, chemRaw * EA_FORM_CHEM_SCALE)));
        if (d){ total+=d; signals.push({icon:'🧪', label:'Chimie', note:`win-rate cu ${teammates.length} coechipieri: ${Math.round((chemRaw+0.5)*100)}%`, delta:d}); }
    }

    const potmRate = (p.potmCount||0)/p.games;
    const dPotm = Math.round(Math.min(potmRate*EA_FORM_POTM_SCALE, EA_FORM_POTM_CAP));
    if (dPotm){ total+=dPotm; signals.push({icon:'⭐', label:'POTM', note:`${p.potmCount||0} din ${p.games} meciuri`, delta:dPotm}); }

    const mvpRate = (p.mvpCount||0)/p.games;
    const dMvp = Math.round(Math.min(mvpRate*EA_FORM_MVP_SCALE, EA_FORM_MVP_CAP));
    if (dMvp){ total+=dMvp; signals.push({icon:'👑', label:'MVP', note:`${p.mvpCount||0} din ${p.games} meciuri`, delta:dMvp}); }

    const actMult = getActivityMultiplier(p);
    const dAct = Math.round((actMult-1) * EA_FORM_ACTIVITY_SCALE);
    if (dAct){ total+=dAct; signals.push({icon:'📅', label:'Activitate recentă', note: 'absențe în ultimele meciuri', delta:dAct}); }

    const imbalLoss = Math.min(p.lastImbalanceLoss||0, 3);
    const dImbal = imbalLoss>0 ? -Math.round(imbalLoss * EA_FORM_IMBALANCE_PER) : 0;
    if (dImbal){ total+=dImbal; signals.push({icon:'⚠️', label:'Dezechilibru', note:`${imbalLoss} meci(uri) pierdut(e) cu 3+ goluri`, delta:dImbal}); }

    const clamped = Math.max(-EA_FORM_TOTAL_CAP, Math.min(EA_FORM_TOTAL_CAP, total));
    return { delta: clamped, signals };
}

/**
 * eaGetPlayerCard — punctul de intrare principal pentru UI. Base OVR
 * (manual + bonus tag-uri), Form Rating, Current (=Base+Form),
 * atribute, weak foot/skill moves.
 */
function eaGetPlayerCard(p, context = {}){
    const base = eaComputeBaseOVR(p);
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
        attrs: base.attrs, // include _manual și _bonus per atribut
        skillMoves: stars.skillMoves,
        weakFoot: stars.weakFoot,
    };
}

/**
 * eaComputeTeamLineOVR — media Current OVR a unei echipe, per linie de
 * poziție (GK/DEF/MID/FWD).
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
 * getSmartRating — PĂSTRAT ca nume (folosit peste tot în app.js/
 * setari.html), returnează OVR-ul EA (1-99, întreg). `context` e
 * propagat la Chimie — folosit de doBalance() la echilibrarea echipelor.
 */
function getSmartRating(p, context = {}){
    if (p.adminRating != null) return Math.max(1, Math.min(99, Math.round(p.adminRating)));
    return eaGetPlayerCard(p, context).currentOVR;
}
