const SUPABASE_URL      = 'https://lfnumwbjikiyngdxsgrk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbnVtd2JqaWtpeW5nZHhzZ3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDQ1MzEsImV4cCI6MjA5MDA4MDUzMX0.BrrmEHnOwa66hDqN-GhYCyqHqOqTAV7dswjcOVxx-wc';
const VAPID_PUBLIC_KEY  = 'YOUR_VAPID_PUBLIC_KEY';
const ADMIN_EMAIL       = 'evoluttionofall@gmail.com';

// ── Supabase Client ──
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Auth State ──
let currentUser = null;
let currentProfile = null;

// ── Constants ──
const CATS = ['general','viteza','tehnica','strategie','aparare'];
const CAT_LABELS = {general:'⚽ General',viteza:'⚡ Viteză',tehnica:'🎯 Tehnică',strategie:'🧠 Strategie',aparare:'🛡️ Apărare'};
const CAT_COLORS = {general:'#8a6800',viteza:'#9c4f00',tehnica:'#3d5afe',strategie:'#00bcd4',aparare:'#2e7d32'};

// ── Player Tags System ───────────────────────────────────────────
// ── Dynamic Tags System (loaded from Supabase tags_config) ──────
let tagsConfig = []; // populated by loadTagsConfig()

// Default tags — seeded if table is empty
const DEFAULT_TAGS_CONFIG = [
    // Atac
    {label:'Șut Bun',         emoji:'🎯', type:'pos', category:'atac',    impact_attribute:'tehnica',   sort_order:1},
    {label:'Pasează Mult',    emoji:'🎭', type:'pos', category:'atac',    impact_attribute:'strategie', sort_order:2},
    {label:'Driblează',       emoji:'🌪️', type:'pos', category:'atac',    impact_attribute:'viteza',    sort_order:3},
    {label:'Finalizator',     emoji:'🥅', type:'pos', category:'atac',    impact_attribute:'tehnica',   sort_order:4},
    // Apărare
    {label:'Stă în Spate',    emoji:'🏰', type:'pos', category:'aparare', impact_attribute:'aparare',   sort_order:5},
    {label:'Pune Corpul',     emoji:'🧱', type:'pos', category:'aparare', impact_attribute:'aparare',   sort_order:6},
    {label:'Interceptează',   emoji:'✋', type:'pos', category:'aparare', impact_attribute:'strategie', sort_order:7},
    {label:'Dur',             emoji:'🔥', type:'neg', category:'aparare', impact_attribute:'aparare',   sort_order:8},
    // Efort
    {label:'Aleargă Mult',    emoji:'💪', type:'pos', category:'efort',   impact_attribute:'viteza',    sort_order:9},
    {label:'Rapid',           emoji:'⚡', type:'pos', category:'efort',   impact_attribute:'viteza',    sort_order:10},
    {label:'Static',          emoji:'🪨', type:'neg', category:'efort',   impact_attribute:'viteza',    sort_order:11},
    {label:'Pivot',           emoji:'🔄', type:'pos', category:'efort',   impact_attribute:'tehnica',   sort_order:12},
    // Portar
    {label:'Reflexe',         emoji:'🧤', type:'pos', category:'portar',  impact_attribute:'aparare',   sort_order:13},
    {label:'Iese pe Inter.',  emoji:'🎮', type:'pos', category:'portar',  impact_attribute:'strategie', sort_order:14},
    {label:'Spectaculos',     emoji:'🌟', type:'neu', category:'portar',  impact_attribute:'tehnica',   sort_order:15},
    // Negative
    {label:'Nu pasează',      emoji:'🤡', type:'neg', category:'negativ', impact_attribute:'strategie', sort_order:16},
    {label:'Picior de lemn',  emoji:'🦵', type:'neg', category:'negativ', impact_attribute:'tehnica',   sort_order:17},
    {label:'Obosește repede', emoji:'🪫', type:'neg', category:'negativ', impact_attribute:'aparare',   sort_order:18},
];

const CAT_LABELS_CONFIG = {atac:'⚽ Atac',aparare:'🛡️ Apărare',efort:'🏃 Efort',portar:'🧤 Portar',mentalitate:'💡 Mentalitate / IQ',fizic:'💪 Profil Fizic',executie:'🎯 Execuție',pozitionare:'📍 Poziționare',negativ:'❌ Negative'};

async function loadTagsConfig(){
    // Always fetch from Supabase (no localStorage cache) so tw_weight is always fresh
    try{
        const{data,error}=await sb.from('tags_config').select('*').order('sort_order');
        if(error) throw error;
        if(data?.length){
            tagsConfig=data;
        } else {
            const{data:seeded}=await sb.from('tags_config').insert(DEFAULT_TAGS_CONFIG).select();
            tagsConfig=seeded||DEFAULT_TAGS_CONFIG.map((t,i)=>({...t,id:i+1}));
        }
    }catch(e){
        console.warn('tags_config load failed, using defaults:',e.message);
        tagsConfig=DEFAULT_TAGS_CONFIG.map((t,i)=>({...t,id:i+1}));
    }
    buildPTById();
    buildTWFromConfig(); // ← load TW from Supabase column, not localStorage
}

let PT_BY_ID = {};
function buildPTById(){ PT_BY_ID=Object.fromEntries(tagsConfig.map(t=>[String(t.id),t])); }

function tagById(id){ return PT_BY_ID[String(id)] || null; }

// Map selected tag IDs → old numeric columns for DB compat
function tagsToColumns(tagIds, general){
    const cols={viteza:general,tehnica:general,strategie:general,aparare:general};
    (tagIds||[]).forEach(id=>{
        const t=tagById(id); if(!t) return;
        const attr=t.impact_attribute;
        // 'general' impact → affects all attributes equally
        const targets = (!attr || attr==='general')
            ? ['viteza','tehnica','strategie','aparare']
            : [attr];
        targets.forEach(a=>{
            if(t.type==='pos') cols[a]=Math.max(cols[a],8);
            else if(t.type==='neg') cols[a]=Math.min(cols[a],3);
        });
    });
    return cols;
}

// Returns active tags as objects {id, tag, adminSet} — status-uri setate manual de admin
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

// Returns array of tag IDs (backward compat)
function getPlayerTags(p){
    return getPlayerActiveTagObjects(p).map(t=>t.id);
}

// Render tag badges (👑 = status setat de admin)
function renderTagBadges(tagObjsOrIds){
    if(!tagObjsOrIds?.length) return '';
    return tagObjsOrIds.map(item=>{
        // Accept both objects {id,tag,adminSet} and plain strings
        const isObj = typeof item === 'object';
        const id = isObj ? item.id : String(item);
        const t = isObj ? item.tag : tagById(id);
        if(!t) return '';
        const cls = t.type==='pos'?'tag-pos':t.type==='neg'?'tag-neg':'tag-neu';
        return `<span class="ptag ${cls} crown">👑 ${t.emoji} ${t.label}</span>`;
    }).join('');
}

// ── Archetype System (kept for backward compat) ───────────────────
const ARCHETYPES_STRENGTH = {
    viteza:    {icon:'⚡', label:'Vitezoman'},
    aparare:   {icon:'🛡️', label:'Zid'},
    tehnica:   {icon:'🎯', label:'Playmaker'},
    strategie: {icon:'🧠', label:'Creierul'},
};
const ARCHETYPES_WEAKNESS = {
    viteza:    {icon:'🐌', label:'Lent'},
    tehnica:   {icon:'🧱', label:'Picior de lemn'},
    strategie: {icon:'👤', label:'Solist'},
    aparare:   {icon:'🪫', label:'Fără condiție'},
};
// Map from status id → archetype definition
const ARCH_STR_BY_ID = {
    vitezoman:  {icon:'⚡',label:'Vitezoman'},
    zid:        {icon:'🛡️',label:'Zid'},
    playmaker:  {icon:'🎯',label:'Playmaker'},
    creierul:   {icon:'🧠',label:'Creierul'},
    finalizator:{icon:'🥅',label:'Finalizator'},
};
const ARCH_WEAK_BY_ID = {
    lent:       {icon:'🐌',label:'Lent'},
    piciorlemn: {icon:'🧱',label:'Picior de lemn'},
    solist:     {icon:'👤',label:'Solist'},
    fara_cond:  {icon:'🪫',label:'Fără condiție'},
};
// Map from category → strength/weakness (for auto-calc)
const CAT_TO_STR  = {viteza:'vitezoman',aparare:'zid',tehnica:'playmaker',strategie:'creierul'};
const CAT_TO_WEAK = {viteza:'lent',tehnica:'piciorlemn',strategie:'solist',aparare:'fara_cond'};

function getPlayerArchetype(p){
    // Admin-set has priority
    if(p.mainStatus || p.negativeStatus){
        return {
            strength: p.mainStatus    ? ARCH_STR_BY_ID[p.mainStatus]    : null,
            weakness: p.negativeStatus? ARCH_WEAK_BY_ID[p.negativeStatus]: null,
            adminSet: true
        };
    }
    // Auto-compute from ratings
    if(p.ratings.length < 2) return null;
    const cats = ['viteza','tehnica','strategie','aparare'];
    const avgs = {};
    cats.forEach(c => avgs[c] = p.ratings.reduce((s,r)=>s+(r[c]||5),0)/p.ratings.length);
    const sorted = cats.slice().sort((a,b)=>avgs[b]-avgs[a]);
    const maxCat = sorted[0], minCat = sorted[sorted.length-1];
    const spread = avgs[maxCat] - avgs[minCat];
    if(spread < 1.2) return null;
    return {
        strength: ARCH_STR_BY_ID[CAT_TO_STR[maxCat]],
        weakness: ARCH_WEAK_BY_ID[CAT_TO_WEAK[minCat]],
        adminSet: false
    };
}
const DEFAULT_W = {winrate:0.30,goals:0.30,tags:0.30,chemistry:0.10};
let W = {...DEFAULT_W};
// Punctul de start al ratingului (implicit 5.0) — nu face parte din cei 100%,
// e un modificator global: mută unde "pornește" toată lumea pe scala 1-10.
let BASE_RATING = 5.0;
// Cât de mult contează activitatea recentă (absențele) — 0% = ignorată complet,
// 100% = intensitatea implicită (comportamentul de dinainte), poate merge și
// peste 100% pentru o penalizare mai agresivă.
let ACTIVITY_INTENSITY = 1.0;
function saveWeights(){ /* now saved to Supabase in saveAlgorithm */ }

async function loadAlgoSettings(){
    try{
        const {data} = await sb.from('algo_settings').select('key,value');
        if(!data?.length) return;
        data.forEach(row=>{
            if(row.key==='weights') Object.assign(W, row.value);
            if(row.key==='base_rating') BASE_RATING = parseFloat(row.value);
            if(row.key==='activity_intensity') ACTIVITY_INTENSITY = parseFloat(row.value);
        });
        if(isNaN(BASE_RATING)) BASE_RATING = 5.0;
        if(isNaN(ACTIVITY_INTENSITY)) ACTIVITY_INTENSITY = 1.0;
        // Migrare: sistemul de voturi pe colegi (Borda/MVP/"Voturi colegi") a fost
        // eliminat complet din formulă — nu mai contează deloc în Smart Rating.
        W.borda = 0; W.mvpWin = 0; W.mvpLoss = 0;
        W.general = 0; W.viteza = 0; W.tehnica = 0; W.strategie = 0; W.aparare = 0;
        // Migrare: configurări salvate înainte de introducerea componentei de
        // goluri raportate la poziție nu au deloc cheia 'goals' — îi dăm o
        // valoare implicită rezonabilă în loc să rămână 0 (invizibilă).
        if(W.goals == null) W.goals = DEFAULT_W.goals;
        // Migrare: configurări salvate înainte ca tag-urile să devină un slot
        // ponderat (înainte foloseau un "cap" separat în puncte, nu procent) —
        // îi dăm o valoare implicită; admin o poate ajusta oricând din panou.
        if(W.tags == null) W.tags = DEFAULT_W.tags;
        // Migrare: configurări salvate înainte de introducerea Chimiei —
        // îi dăm o valoare implicită (~10%); admin o poate ajusta oricând.
        if(W.chemistry == null) W.chemistry = DEFAULT_W.chemistry;
    }catch(e){ console.warn('loadAlgoSettings:', e.message); }
}


// Tag weights: {tagId → float, range -0.5..+0.5}
// These are ADDITIVE bonuses per active tag, not part of the 100% sum
// TW is now loaded from tags_config.tw_weight (Supabase), not localStorage
// localStorage kept only as fallback during same session
let TW = {};
function buildTWFromConfig(){
    // Rebuild TW from tagsConfig.tw_weight column
    TW = {};
    tagsConfig.forEach(t=>{ TW[String(t.id)] = parseFloat(t.tw_weight)||0; });
}
async function saveTagWeights(){
    // Save each changed tag weight to Supabase tags_config.tw_weight
    const updates = tagsConfig.map(t=>({id:t.id, tw_weight: TW[String(t.id)]||0}));
    try{
        for(const u of updates){
            if((u.tw_weight||0) !== 0 || (parseFloat(t_cfg_find(u.id)?.tw_weight)||0) !== 0)
                await sb.from('tags_config').update({tw_weight:u.tw_weight}).eq('id',u.id);
        }
    }catch(e){ console.warn('saveTagWeights error:',e.message); }
    // Also invalidate cache so next load reads fresh values
    invalidateTagsCache();
}
function t_cfg_find(id){ return tagsConfig.find(t=>t.id===id); }
let siteTitle = localStorage.getItem('site_title') || 'Arena Friends FC';
const DEFAULT_PLAYERS = ["Vlad Galatanu","Cristi Stan","Potirniche Ionut","Andrei Magazin Dez","Vlad Stan","Gabi Balan","Tudor","Andrei Rascu","Andrei Stan","Adrian Prisecaru","Om Vlad Stan 1","Om Vlad Stan 2"];
const today = new Date().toLocaleDateString('ro-RO');

// ── App State ──
let db = { players:[], history:[], nextMatch:{date:null,time:null,location:null,confirmedIds:[],absentIds:[]} };
let lobbySearchQuery = ''; // filtrul de căutare din secțiunea de prezență
let currentPlayerId = null;
let selectedCats = {general:null,viteza:null,tehnica:null,strategie:null,aparare:null};
let activeCatTab = 'general', ratingChartInstance = null, csvParsed = null;
let detailsOpen=false, ratingsListOpen=false;
let qvVotes = {}, confirmCallback = null;
let statsVisible = localStorage.getItem('dash_stats_visible') !== 'false';
let tagsVisible  = localStorage.getItem('dash_tags_visible')  !== 'false';
let rolesVisible = localStorage.getItem('dash_roles_visible') !== 'false';
let pushPlayerName = localStorage.getItem('pushPlayerName') || null;


function isAdmin() {
    if (!currentUser) return false;
    if (currentUser.email === ADMIN_EMAIL) return true;
    if (currentProfile?.role === 'admin') return true;
    return false;
}

function applyRoleUI() {
    // Apply site title
    const titleEl = document.getElementById('clubTitle');
    if (titleEl && siteTitle) titleEl.textContent = siteTitle;
    document.title = siteTitle || 'Arena Friends FC';
    const admin = isAdmin();
    document.body.classList.toggle('is-admin', admin);
    document.body.classList.toggle('is-player', !admin);

    // User bar
    const bar = document.getElementById('userBar');
    bar.style.display = 'flex';
    document.getElementById('userBarEmail').textContent = currentUser?.email || '';
    const roleEl = document.getElementById('userBarRole');
    roleEl.textContent = admin ? '👑 Admin' : '⚽ Jucător';
    roleEl.className = 'user-bar-role ' + (admin ? 'role-admin' : 'role-player');

    // Show linked player name
    const playerEl = document.getElementById('userBarPlayer');
    if (!admin && currentProfile?.player_id) {
        const p = db.players.find(x => x.id == currentProfile.player_id);
        playerEl.textContent = p ? '→ ' + p.name : '';
    } else {
        playerEl.textContent = '';
    }

    // Show Conturi tab only for admin
    document.getElementById('tabAccounts').style.display = admin ? 'block' : 'none';
}

// Auth tab switch
function switchAuthTab(tab) {
    document.getElementById('tabLogin').classList.toggle('active', tab==='login');
    document.getElementById('tabRegister').classList.toggle('active', tab==='register');
    document.getElementById('authLoginPanel').style.display = tab==='login' ? 'block' : 'none';
    document.getElementById('authRegisterPanel').style.display = tab==='register' ? 'block' : 'none';
    document.getElementById('authError').classList.remove('show');
}

function showAuthError(msg) {
    const el = document.getElementById('authError');
    el.textContent = msg; el.classList.add('show');
}

async function doLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) { showAuthError('Completează email și parolă.'); return; }
    showLoading(true);
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    showLoading(false);
    if (error) { showAuthError(error.message); return; }
    await onAuthSuccess(data.user);
}

async function doRegister() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    if (!name || !email || !password) { showAuthError('Completează toate câmpurile.'); return; }
    if (password.length < 6) { showAuthError('Parola trebuie să aibă minim 6 caractere.'); return; }
    showLoading(true);
    const { data, error } = await sb.auth.signUp({ email, password });
    showLoading(false);
    if (error) { showAuthError(error.message); return; }
    if (data.user) {
        // Create profile
        await sb.from('profiles').insert({
            id: data.user.id, email, display_name: name,
            role: email === ADMIN_EMAIL ? 'admin' : 'player'
        });
        await onAuthSuccess(data.user);
        showToast('✅ Cont creat! Bine ai venit, ' + name + '!');
    } else {
        showAuthError('Verifică emailul pentru confirmare.');
    }
}

async function doLogout() {
    await sb.auth.signOut();
    currentUser = null; currentProfile = null;
    document.getElementById('userBar').style.display = 'none';
    document.body.classList.remove('is-admin','is-player');
    document.getElementById('authOverlay').classList.remove('hidden');
}

async function onAuthSuccess(user) {
    currentUser = user;
    // Load or create profile
    let { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (!profile) {
        // Auto-create profile if missing (e.g. first login after manual DB insert)
        const role = user.email === ADMIN_EMAIL ? 'admin' : 'player';
        const { data: newProfile } = await sb.from('profiles').insert({
            id: user.id, email: user.email, role, display_name: user.email
        }).select().single();
        profile = newProfile;
    }
    // Force admin role for admin email regardless of DB
    if (user.email === ADMIN_EMAIL && profile) profile.role = 'admin';
    currentProfile = profile;
    document.getElementById('authOverlay').classList.add('hidden');
    await loadAll();
    setupRealtime();
    applyRoleUI();
    initMobile();
    initSwipe();
    applyThreeTeamUI();
    setTimeout(async () => {
        await checkPresenceModal();
    }, 800);
}


async function loadAll() {
    showLoading(true);
    try {
        await loadTagsConfig();
        await loadMilestoneConfig();
        await loadAlgoSettings();
        await loadScenarios();
        await loadTeamConfigs(); // ← load team names + colors from Supabase
        // Players + Ratings (joined)
        const { data: playersRaw, error: pe } = await sb
            .from('players')
            .select('*, ratings(*)')
            .order('id');
        if (pe) throw pe;

        db.players = (playersRaw || []).map(rowToPlayer);


        // If empty DB — seed default players
        if (db.players.length === 0) {
            await seedDefaultPlayers();
            const { data: seeded } = await sb.from('players').select('*, ratings(*)').order('id');
            db.players = (seeded || []).map(rowToPlayer);
        }

        // Match history — doar sezonul curent (nearhivat); sezoanele salvate se
        // încarcă separat, la cerere, din viewSeasons()/openSeasonArchive()
        let histRaw = null;
        {
            const r = await sb.from('match_history').select('*').is('season', null).order('created_at', { ascending: false });
            if (r.error) {
                // Coloana 'season' probabil nu există încă (migrare SQL neefectuată) — fallback la toate meciurile
                const r2 = await sb.from('match_history').select('*').order('created_at', { ascending: false });
                histRaw = r2.data;
            } else {
                histRaw = r.data;
            }
        }

        // Load match_goals in bulk — one query for all matches
        // Încercăm întâi CU is_penalty (ca să separăm corect golurile de penalty de
        // cele normale în topScorer/playerGoals); dacă migrarea nu a fost rulată încă,
        // cădem defensiv pe interogarea veche, fără is_penalty.
        let goalsPerMatch = {};
        try {
            let allGoals = null;
            const withPen = await sb.from('match_goals').select('match_id,player_name,team,goals,is_penalty');
            if (withPen.error) {
                const noPen = await sb.from('match_goals').select('match_id,player_name,team,goals');
                allGoals = noPen.data;
            } else {
                allGoals = withPen.data;
            }
            (allGoals || []).forEach(g => {
                if (!goalsPerMatch[g.match_id]) goalsPerMatch[g.match_id] = [];
                goalsPerMatch[g.match_id].push(g);
            });
        } catch(e) { /* match_goals may not exist */ }

        db.history = (histRaw || []).map(h => {
            const goals = goalsPerMatch[h.id] || [];
            // Aggregate goals per player for top scorer — golurile de penalty (is_penalty:true)
            // se țin STRICT separat, nu se adună la golurile normale.
            const playerGoals = {};
            const playerPenaltyGoals = {};
            goals.forEach(g => {
                if (g.is_penalty) {
                    playerPenaltyGoals[g.player_name] = (playerPenaltyGoals[g.player_name]||0) + (g.goals||1);
                } else {
                    playerGoals[g.player_name] = (playerGoals[g.player_name]||0) + (g.goals||1);
                }
            });
            const topEntries = Object.entries(playerGoals).sort((a,b)=>b[1]-a[1]);
            const topScorer = topEntries[0] ? { name: topEntries[0][0], goals: topEntries[0][1] } : null;
            // Goals per team (goluri normale — fără penalty)
            const teamGoals = { orange:0, green:0, black:0 };
            goals.forEach(g => { if(!g.is_penalty && teamGoals[g.team]!==undefined) teamGoals[g.team] += (g.goals||1); });
            return {
                _dbId: h.id,
                createdAt: h.created_at || null, // pentru ordonarea cronologică a sesiunilor de 3 echipe
                date: h.date, winner: h.winner, score: h.score,
                imbalanced: h.imbalanced||false,
                startedAt: h.started_at||null, endedAt: h.ended_at||null,
                orangePlayers: h.orange_players || [],
                greenPlayers:  h.green_players  || [],
                blackPlayers:  h.black_players  || [],
                roundsDetail:  h.rounds_detail  || null, // istoric ture (doar meciuri mod 3 echipe)
                playerGoals,   // { playerName: goalsScored } — folosit la editarea meciului
                playerPenaltyGoals, // { playerName: goluriPenalty } — SEPARAT de playerGoals
                topScorer,   // { name, goals } or null
                teamGoals,   // { orange, green, black }
            };
        }).sort((a, b) => parseDateToObj(b.date) - parseDateToObj(a.date));

        // Next match
        const { data: nm } = await sb.from('next_match').select('*').eq('id',1).maybeSingle();
        db.nextMatch = nm
            ? { date:nm.match_date, time:nm.match_time, location:nm.location, confirmedIds:nm.confirmed_ids||[], absentIds:nm.absent_ids||[] }
            : { date:null, time:null, location:null, confirmedIds:[], absentIds:[] };

        setConnected(true);
        render();
    } catch (err) {
        setConnected(false);
        showToast('❌ Eroare conectare DB: ' + (err.message||err), '');
        // Fallback la localStorage dacă există
        const local = localStorage.getItem('fb_club_v6');
        if (local) { try { db = JSON.parse(local); render(); } catch(_){} }
    } finally {
        showLoading(false);
    }
}

function rowToPlayer(p) {
    return {
        id: p.id, name: p.name, status: p.status||'bench', role: p.role||null,
        positionPrimary: p.position_primary || null,
        positionSecondary: p.position_secondary || null,
        wins: p.wins||0, games: p.games||0,
        matchHistory: p.match_history||[],
        mainStatus: p.main_status||null,
        negativeStatus: p.negative_status||null,
        adminTags: p.admin_tags ? p.admin_tags.split(',').filter(Boolean) : [],
        adminRating: p.admin_rating != null ? parseFloat(p.admin_rating) : null,
        totalGoals: p.total_goals||0,
        totalGoalsConceded: p.total_goals_conceded||0,
        totalPenaltyGoals: p.total_penalty_goals||0,
        lastImbalanceLoss: p.last_imbalance_loss||0,
        ratings: (p.ratings||[]).sort((a,b)=>new Date(a.created_at)-new Date(b.created_at)).map(r=>({
            _dbId: r.id, rater:r.rater, date:r.date, tags:r.tags||'',
            general:r.general||5, viteza:r.viteza||5, tehnica:r.tehnica||5,
            strategie:r.strategie||5, aparare:r.aparare||5
        }))
    };
}

async function seedDefaultPlayers() {
    const rows = DEFAULT_PLAYERS.map((name,i) => ({
        id: i+1, name, status:'bench', wins:0, games:0, match_history:[]
    }));
    await sb.from('players').upsert(rows);
    // Add default rating for each
    const ratingRows = rows.map(p => ({
        player_id:p.id, rater:'Default', date:today,
        general:5,viteza:5,tehnica:5,strategie:5,aparare:5
    }));
    await sb.from('ratings').insert(ratingRows);
}

async function dbUpdatePlayer(p) {
    const { error } = await sb.from('players').upsert({
        id:p.id, name:p.name, status:p.status,
        wins:p.wins, games:p.games, match_history:p.matchHistory,
        total_goals: p.totalGoals||0,
        total_goals_conceded: p.totalGoalsConceded||0,
        last_imbalance_loss: p.lastImbalanceLoss||0
    });
    if (error) {
        console.error('dbUpdatePlayer error for', p.name, ':', error.message, error.details, error.hint);
        throw error;
    }
}

async function dbInsertRating(playerId, r) {
    const { data, error } = await sb.from('ratings').insert({
        player_id:playerId, rater:r.rater, date:r.date,
        general:r.general, viteza:r.viteza, tehnica:r.tehnica,
        strategie:r.strategie, aparare:r.aparare
    }).select().single();
    if (error) throw error;
    return data.id; // UUID for future deletion
}

async function dbDeleteRating(dbId) {
    const { error } = await sb.from('ratings').delete().eq('id', dbId);
    if (error) throw error;
}

async function dbSaveNextMatch() {
    const nm = db.nextMatch;
    const { error } = await sb.from('next_match').upsert({
        id:1,
        match_date: nm.date || null,
        match_time: nm.time || null,
        location:   nm.location || null,
        confirmed_ids: nm.confirmedIds || [],
        absent_ids: nm.absentIds || []
    });
    if (error) throw error;
}

async function dbInsertMatchHistory(entry) {
    const { data, error } = await sb.from('match_history').insert({
        date: entry.date, winner: entry.winner, score: entry.score,
        orange_players: entry.orangePlayers, green_players: entry.greenPlayers,
        imbalanced: entry.imbalanced||false
    }).select().single();
    if (error) throw error;
    if(data) entry._dbId = data.id;
    return entry;
}

// ── Realtime: sync lobby across all devices ──
function setupRealtime() {
    sb.channel('next_match_realtime')
        .on('postgres_changes', { event:'*', schema:'public', table:'next_match' }, async () => {
            const { data:nm } = await sb.from('next_match').select('*').eq('id',1).maybeSingle();
            if (nm) {
                db.nextMatch = { date:nm.match_date, time:nm.match_time, location:nm.location, confirmedIds:nm.confirmed_ids||[], absentIds:nm.absent_ids||[] };
                renderLobby();
                updateScenarioBadge();
            }
        })
        .subscribe();
    setupScenariosRealtime();
    // Subscribe to live state for live banner
    sb.channel('live_state_idx')
        .on('postgres_changes',{event:'UPDATE',schema:'public',table:'live_state',filter:'id=eq.1'},()=>checkLiveStatus())
        .subscribe();
}


// ── Roluri jucători ───────────────────────────────────────────────
// ── POZIȚII STANDARD — Primary + Secondary, grupate pentru echilibrare ──
const POSITIONS = {
    GK:  { label: 'Portar',           group: 'GK',  emoji: '🧤', color: '#8e3a9e' },
    CB:  { label: 'Fundaș Central',   group: 'DEF', emoji: '🛡️', color: '#1b7a43' },
    LB:  { label: 'Fundaș Stânga',    group: 'DEF', emoji: '🛡️', color: '#1b7a43' },
    RB:  { label: 'Fundaș Dreapta',   group: 'DEF', emoji: '🛡️', color: '#1b7a43' },
    CDM: { label: 'Mijlocaș Defensiv',group: 'MID', emoji: '🎯', color: '#1554b3' },
    CM:  { label: 'Mijlocaș Central', group: 'MID', emoji: '🎯', color: '#1554b3' },
    CAM: { label: 'Mijlocaș Ofensiv', group: 'MID', emoji: '🎯', color: '#1554b3' },
    LM:  { label: 'Mijlocaș Stânga',  group: 'MID', emoji: '🎯', color: '#1554b3' },
    RM:  { label: 'Mijlocaș Dreapta', group: 'MID', emoji: '🎯', color: '#1554b3' },
    LW:  { label: 'Extremă Stânga',   group: 'FWD', emoji: '⚽', color: '#9c4f00' },
    RW:  { label: 'Extremă Dreapta',  group: 'FWD', emoji: '⚽', color: '#9c4f00' },
    ST:  { label: 'Vârf',             group: 'FWD', emoji: '⚽', color: '#9c4f00' },
    FW:  { label: 'Atacant',          group: 'FWD', emoji: '⚽', color: '#9c4f00' },
};
const POSITION_GROUPS = { GK:'Portar', DEF:'Fundași', MID:'Mijlocași', FWD:'Atacanți' };

// Compatibilitate: dacă jucătorul are doar vechiul `role`, mapăm la o poziție primary
const LEGACY_ROLE_MAP = { portar:'GK', fundas:'CB', mijlocas:'CM', atacant:'ST' };
function getPlayerPrimaryPos(p) {
    if (p.positionPrimary && POSITIONS[p.positionPrimary]) return p.positionPrimary;
    if (p.role && LEGACY_ROLE_MAP[p.role]) return LEGACY_ROLE_MAP[p.role];
    return null;
}
function getPlayerSecondaryPos(p) {
    return (p.positionSecondary && POSITIONS[p.positionSecondary]) ? p.positionSecondary : null;
}
function getPlayerPrimaryGroup(p) {
    const pos = getPlayerPrimaryPos(p);
    return pos ? POSITIONS[pos].group : null;
}

// Profile attrs used in multi-impact system
const PROFILE_ATTRS = ['viteza','tehnica','strategie','aparare','efort','mentalitate','fizic','executie','pozitionare'];

/**
 * getTagProfileStrength — suma absolută a impact_profile (înlocuiește intensity)
 */
function getTagProfileStrength(tag){
    const p = tag.impact_profile || {};
    const sum = PROFILE_ATTRS.reduce((s,a)=>s+Math.abs(parseFloat(p[a])||0),0);
    return sum || 1.0; // fallback dacă nu are profil
}

/**
 * getTagProfileNet — net impact general (pos - neg)
 */
function getTagProfileNet(tag){
    const p = tag.impact_profile || {};
    return PROFILE_ATTRS.reduce((s,a)=>s+(parseFloat(p[a])||0),0);
}

/**
 * computeTagBonus 5.0 — Model pur aditiv, fără cap separat
 *
 * Fiecare tag activ contribuie INDEPENDENT:
 *   pos tag: +0.25 .. +0.50 (în funcție de puterea profilului)
 *   neg tag: −0.25 .. −0.50
 *   neu tag: ±0.10 (mic)
 *
 * tw_weight (coeficient admin, −50%..+50%) ajustează fin contribuția per-tag:
 *   tw pozitiv = întărește contribuția (pos devine mai bun, neg mai puțin sever)
 *   tw negativ = slăbește contribuția
 *
 * Suma tuturor tag-urilor active devine un scor 0-10 (5 + sumă, clamped
 * defensiv la ±5) care intră în ACELAȘI blend ponderat ca Win Rate/Goluri/
 * Voturi colegi, cu propria pondere W.tags — nu mai există un "cap" separat
 * în puncte; cât de mult contează tag-urile se decide 100% din W.tags.
 */
/**
 * computeTagBonus 5.1 — Un singur cadran per tag pentru rating
 *
 * Contribuția unui tag la Smart Rating depinde EXCLUSIV de "Coeficient rating"
 * (tw_weight, −50%..+50%) — nimic altceva. Profilul de impact (9 sliders)
 * NU mai influențează ratingul deloc; el rămâne folosit doar pentru
 * echilibrarea echipelor / afișarea profilului de atribute (computeTeamAttrProfile),
 * un calcul complet separat. Așa nu mai există două cadrane care fac cam
 * același lucru pentru rating — un singur % de setat per tag.
 */
// Coeficientul (−50%..+50%) se scalează ×14, ca un singur tag la maxim să
// poată muta ratingul cu până la ±7 puncte — suficient de puternic încât
// câteva tag-uri bune să conteze vizibil, fără să fie nevoie de zeci de tag-uri.
const TAG_COEF_SCALE = 14;

function computeTagBonus(activeTags){
    if(!activeTags.length) return {bonus:0, signals:[], buckets:{}};

    let totalBonus = 0;
    const signals = [];

    activeTags.forEach(obj=>{
        const tag = obj.tag;
        const tw = TW[String(obj.id)] || 0;
        const dir = tag.type==='pos' ? 1 : tag.type==='neg' ? -1 : 0;
        // Coeficientul E contribuția (scalat) — la ±50% → ±7pt.
        const contrib = tw * TAG_COEF_SCALE;
        signals.push({id:obj.id, tag, raw:contrib, dir});
        totalBonus += contrib;
    });

    // Clamp defensiv generos — un singur tag poate ajunge deja la ±7, deci
    // plafonul de siguranță trebuie să lase loc pentru câteva tag-uri suprapuse
    // fără să taie artificial din efectul lor.
    const bonus = Math.max(-20, Math.min(20, totalBonus));
    return {bonus: parseFloat(bonus.toFixed(3)), signals, buckets:{}};
}

/**
 * computeTeamAttrProfile — suma impact_profile per atribut pentru o echipă
 */
function computeTeamAttrProfile(teamPlayers){
    const profile = {};
    PROFILE_ATTRS.forEach(a=>{ profile[a]=0; });
    teamPlayers.forEach(p=>{
        getPlayerActiveTagObjects(p).forEach(obj=>{
            const ip = obj.tag?.impact_profile || {};
            PROFILE_ATTRS.forEach(a=>{ profile[a]+=(parseFloat(ip[a])||0); });
        });
    });
    return profile;
}

// ── Smart Rating 2.0 — Base 5, Goals, Imbalance coeff ────────────
// ── Smart Rating 3.0 ─────────────────────────────────────────────
//
// base(5) + performanță(±2.5) + goluri(+1) + bucket tags(±CAP)
// Buckets: TEHNIC · TACTIC · FIZIC · DEFENSIV (fiecare ±CAP/4)
//

/**
 * Media de goluri/meci a unui grup de jucători (folosit ca bază de comparație
 * pentru componenta de goluri raportată la poziție). Ignoră jucătorii fără
 * meciuri jucate.
 */
function getGroupAvgGoalsPerGame(pool){
    const withGames = pool.filter(pl => pl.games > 0);
    if (!withGames.length) return 0;
    return withGames.reduce((s,pl) => s + (pl.totalGoals||0) / pl.games, 0) / withGames.length;
}

/**
 * Scor 0-10 (centrat pe 5) pentru golurile unui jucător, calculat RELATIV la
 * media jucătorilor din același grup de poziție (GK/DEF/MID/FWD) — nu un
 * bonus fix, ca să nu penalizeze nedrept fundașii/portarii față de atacanți.
 * Dacă jucătorul nu are poziție setată sau grupul are prea puțini jucători
 * cu date, se raportează la media tuturor jucătorilor activi.
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

/**
 * Notă medie a unei categorii (general/viteza/tehnica/strategie/aparare) cu
 * shrinkage bayesian spre 5 — proporțional cu numărul de voturi primite.
 * Un singur vot extrem (ex: un 9 sau un 1) nu mai poate muta ratingul brusc;
 * cu multe voturi, media reflectă aproape integral notele reale.
 */
const RATING_PRIOR_VOTES = 3; // "voturi virtuale" de 5, echivalentul unui prior neutru
function getCatScoreShrunk(p, cat){
    const n = p.ratings.length;
    if (!n) return 5;
    const sum = p.ratings.reduce((s,r)=>s+(r[cat]||5),0);
    return (sum + RATING_PRIOR_VOTES*5) / (n + RATING_PRIOR_VOTES);
}

/**
 * Win rate cu shrinkage bayesian spre 50% — proporțional cu numărul de
 * meciuri jucate. Un jucător cu 1 meci și 1 victorie (100% WR) nu mai
 * primește același bonus ca unul cu 20 victorii din 25 de meciuri.
 */
const WINRATE_PRIOR_GAMES = 8; // "meciuri virtuale" la 50% winrate
function getWinrateShrunk(p){
    return (p.wins + WINRATE_PRIOR_GAMES*0.5) / (p.games + WINRATE_PRIOR_GAMES);
}

/**
 * Calculează toate componentele Smart Rating pentru un jucător, ca o listă
 * de "pași" aditivi plecând de la baza 5.0 — folosit atât de getSmartRating()
 * (ia doar rezultatul final) cât și de modalul de breakdown (afișează fiecare
 * pas). Are UN SINGUR loc unde trăiește formula, ca să nu mai apară decalaje
 * între ce se calculează și ce se explică în UI.
 */
/**
 * Coechipierii ACTUALI ai unui jucător — folosiți implicit pentru componenta
 * de Chimie când nu se dă un context explicit (ex: în timpul balansării de
 * echipe). Se bazează pe statusul curent (orange/green/bench) din dashboard,
 * deci se recalculează automat de îndată ce muți jucătorul din echipă în echipă.
 */
function getCurrentTeammates(p){
    if(!p.status || !['orange','green','bench'].includes(p.status)) return [];
    return db.players.filter(pl => pl.status===p.status && pl.name!==p.name);
}

function computeSmartRatingComponents(p, context = {}){
    // ── Blend ponderat (medie ponderată, auto-normalizată) ────────────
    // Fiecare componentă e un scor 0-10 centrat pe BASE_RATING (implicit 5,
    // dar admin poate muta punctul de start); media ponderată se exprimă
    // echivalent ca "BASE_RATING + suma deltelor ponderate", ceea ce ne
    // permite să păstrăm afișarea sub formă de pași aditivi din UI.
    const wrShrunk     = getWinrateShrunk(p);
    const winrateScore = BASE_RATING + (wrShrunk - 0.5) * 10;
    const goalsScore   = getGoalsScoreRelative(p);

    // Tag-urile devin un scor 0-10 (BASE_RATING + suma netă a contribuțiilor
    // per tag), exact ca celelalte componente — cu propria pondere W.tags în
    // ACELAȘI blend, nu un strat aditiv separat cu "cap" fix cum era înainte.
    const activeTags = getPlayerActiveTagObjects(p);
    const { bonus: tagsNetSum, signals: tagSignals } = computeTagBonus(activeTags);
    const tagsScore = BASE_RATING + tagsNetSum;

    // Chimia — win-rate real alături de coechipierii ACTUALI, ca scor 0-10
    // (BASE_RATING + delta), exact ca Win Rate-ul individual. Se recalculează
    // singură de fiecare dată când jucătorul schimbă echipa (status orange/green/bench).
    const teammates = (context.teammates && context.teammates.length) ? context.teammates : getCurrentTeammates(p);
    const chemistryRaw   = getTeamSynergyBonus(p.name, teammates); // ±0.5
    const chemistryScore = BASE_RATING + chemistryRaw * 10; // 0-10

    const parts = [
        { key:'winrate',   icon:'📈', label:'Win Rate',   score:winrateScore,   w:W.winrate||0 },
        { key:'goals',     icon:'⚽', label:'Goluri (poziție)', score:goalsScore, w:W.goals||0 },
        { key:'tags',      icon:'🏷️', label:'Tag-uri',    score:tagsScore,      w:W.tags||0 },
        { key:'chemistry', icon:'🧪', label:'Chimie',      score:chemistryScore, w:W.chemistry||0 },
    ];
    const wSum = parts.reduce((s,c)=>s+c.w, 0);
    parts.forEach(c => { c.delta = wSum>0 ? (c.score-BASE_RATING) * c.w / wSum : 0; });
    const blendBase = BASE_RATING + parts.reduce((s,c)=>s+c.delta, 0);

    // ── Penalizare dezechilibru ────────────────────────────────────
    const imbalPen   = Math.min((p.lastImbalanceLoss||0), 3) * 0.20;
    const afterImbal = blendBase - imbalPen;

    // ── Penalizare absențe (blend spre BASE_RATING) ────────────────
    // actMult brut vine din shape-ul fix (8 meciuri recente, −6%/absență, prag 80%);
    // ACTIVITY_INTENSITY (setat de admin) scalează CÂT DE MULT contează efectiv
    // acel multiplicator — 0% îl anulează complet, 100% = comportamentul normal,
    // peste 100% îl amplifică.
    const actMultRaw      = getActivityMultiplier(p);
    const actMult         = 1 - (1 - actMultRaw) * ACTIVITY_INTENSITY;
    const afterActivity   = afterImbal*actMult + BASE_RATING*(1-actMult);
    const deltaActivity   = afterActivity - afterImbal;

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

function getSmartRating(p, context = {}) {
    if (p.adminRating != null) return parseFloat(p.adminRating.toFixed(2));
    return computeSmartRatingComponents(p, context).final;
}
// ═══════════════════════════════════════════════════════════════════
// ── SMART ALGORITHMS v2.0 ──────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

/**
 * #1 SINERGIE REALĂ
 * Win-rate al jucătorului p atunci când joacă cu coechipierul `mate`.
 * Calculat din match_history (orange_players / green_players arrays).
 */
function getSynergyScore(pName, mateName) {
    let together = 0, wins = 0;
    db.history.forEach(h => {
        const inOrange = h.orangePlayers.includes(pName) && h.orangePlayers.includes(mateName);
        const inGreen  = h.greenPlayers.includes(pName)  && h.greenPlayers.includes(mateName);
        const inBlack  = (h.blackPlayers||[]).includes(pName) && (h.blackPlayers||[]).includes(mateName);
        if (!inOrange && !inGreen && !inBlack) return;
        together++;
        const pInOrange = h.orangePlayers.includes(pName);
        const won = playerWonMatch(h, pName);
        if (won === true) wins++;
    });
    if (together < 2) return 0.5; // insuficient istoric → neutru
    return wins / together; // 0..1, 0.5 = neutru
}

/**
 * Bonus sinergie pentru o echipă: media win-rate pairwise între toți coechipieri.
 * Returnează bonus [-0.5, +0.5] față de neutru.
 */
function getTeamSynergyBonus(playerName, teammates) {
    if (!teammates.length) return 0;
    const scores = teammates.map(m => getSynergyScore(playerName, m.name));
    const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
    return (avg - 0.5) * 1.0; // ±0.5 max
}

/**
 * #2 PENALIZARE ABSENȚE
 * Jucătorii care au lipsit la ultimele N meciuri primesc un multiplicator de activitate.
 * Calculat din match_history: câte meciuri recente NU apare jucătorul.
 */
function getActivityMultiplier(p) {
    const recentMatches = db.history.slice(0, 8); // ultimele 8 meciuri
    if (recentMatches.length < 3) return 1.0; // prea puțin istoric
    let absent = 0;
    recentMatches.forEach(h => {
        const played = h.orangePlayers.includes(p.name) || h.greenPlayers.includes(p.name) || (h.blackPlayers||[]).includes(p.name);
        if (!played) absent++;
    });
    // 0 absențe = 1.0, 3+ absențe = 0.82
    return Math.max(0.80, 1.0 - absent * 0.06);
}

/**
 * #6 ANTI-SINERGIE
 * Perechi cu win-rate împreună < 33% din >= 3 meciuri comune.
 */
function getAntiSynergyPairs() {
    const pairs = [];
    const players = db.players.filter(p => p.games > 0);
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            const a = players[i].name, b = players[j].name;
            let together = 0, wins = 0;
            db.history.forEach(h => {
                const inOrange = h.orangePlayers.includes(a) && h.orangePlayers.includes(b);
                const inGreen  = h.greenPlayers.includes(a)  && h.greenPlayers.includes(b);
                const inBlack  = (h.blackPlayers||[]).includes(a) && (h.blackPlayers||[]).includes(b);
                if (!inOrange && !inGreen && !inBlack) return;
                together++;
                // Folosim playerWonMatch (cu winner string) pentru corectitudine cu 3 echipe
                const won = playerWonMatch(h, a) === true;
                if (won) wins++;
            });
            if (together >= 3 && wins / together < 0.33) {
                pairs.push({ a, b, wr: wins/together, together });
            }
        }
    }
    return pairs;
}

// Cache anti-synergy pairs (recomputed when doBalance runs)
let _antiSynergyPairs = [];

function hasAntiSynergy(nameA, nameB) {
    return _antiSynergyPairs.some(p =>
        (p.a === nameA && p.b === nameB) || (p.a === nameB && p.b === nameA)
    );
}

function countAntiSynergyInTeam(team) {
    let count = 0;
    for (let i = 0; i < team.length; i++)
        for (let j = i + 1; j < team.length; j++)
            if (hasAntiSynergy(team[i].name, team[j].name)) count++;
    return count;
}

/**
 * #5 DETECȚIE DEZECHILIBRU
 * Jucători cu streak de W >= 3. Returnează lista cu numele și streak-ul.
 */
function detectImbalancedPlayers() {
    return db.players
        .map(p => {
            const { count, type } = getStreak(p);
            return { p, streak: type === 'W' ? count : 0 };
        })
        .filter(x => x.streak >= 3)
        .sort((a, b) => b.streak - a.streak);
}

/**
 * #7 THRESHOLD DINAMIC
 * Dacă diferența de rating medie e mare, echipa slabă primește +1 toleranță.
 */
function getDynamicThreshold(base, oPlayers, gPlayers) {
    if (!oPlayers.length || !gPlayers.length) return base;
    const oAvg = oPlayers.reduce((s,p) => s + getSmartRating(p), 0) / oPlayers.length;
    const gAvg = gPlayers.reduce((s,p) => s + getSmartRating(p), 0) / gPlayers.length;
    const diff = Math.abs(oAvg - gAvg);
    return diff >= 1.5 ? base + 1 : base;
}

/**
 * #9 PONDERARE DURATĂ
 * Meciul cu durată mai mică e mai puțin reprezentativ pentru rating.
 * Returnează multiplicator 0.5..1.0 bazat pe durată în secunde.
 */
function getDurationWeight(durationSec) {
    if (!durationSec || durationSec <= 0) return 1.0;
    const minutes = durationSec / 60;
    return Math.min(1.0, Math.max(0.5, minutes / 15));
}

// ── END SMART ALGORITHMS v2.0 ──────────────────────────────────────
function getCatAvg(p,cat){return p.ratings?.length?p.ratings.reduce((s,r)=>s+(r[cat]||5),0)/p.ratings.length:5;}
function getGeneralAvg(p){return getCatAvg(p,'general');}
function getStreak(p){
    if(!p.matchHistory?.length)return{count:0,type:null};
    const last=p.matchHistory[p.matchHistory.length-1];let count=0;
    for(let i=p.matchHistory.length-1;i>=0;i--){if(p.matchHistory[i]===last)count++;else break;}
    return{count,type:last};
}

// ── 🔥 Pe val / 🥶 În cădere — cea mai lungă serie ACTIVĂ (nu all-time) ──
function playerLastMatchDate(p){
    for(const h of db.history){ // db.history e deja sortat descrescător după dată
        if((h.orangePlayers||[]).includes(p.name) || (h.greenPlayers||[]).includes(p.name) || (h.blackPlayers||[]).includes(p.name)){
            return parseDateToObj(h.date);
        }
    }
    return null;
}
const STREAK_RECENCY_DAYS = 21; // doar jucători activi în ultimele 3 săptămâni intră în calcul
function renderStreakBanner(){
    const el = document.getElementById('streakBanner');
    if(!el) return;
    const cutoff = new Date(Date.now() - STREAK_RECENCY_DAYS*24*60*60*1000);
    const withGames = db.players.filter(p=>{
        if(!p.games) return false;
        const lastDate = playerLastMatchDate(p);
        return lastDate && lastDate >= cutoff;
    });
    let hot=null;
    withGames.forEach(p=>{
        const s = getStreak(p);
        if(!s.count || s.count<2) return; // sub 2 nu e "serie"
        if(s.type==='W' && (!hot || s.count>hot.count)) hot = {p, count:s.count};
    });
    const topScorer = computeWeekTopScorer();
    if(!hot && !topScorer){ el.style.display='none'; el.innerHTML=''; return; }
    el.style.display='block';
    el.innerHTML = `<div class="streak-banner-grid">
        ${hot ? `<div class="streak-banner-card hot" onclick="openModal(${hot.p.id})">
            <div class="streak-banner-icon">🔥</div>
            <div>
                <div class="streak-banner-lbl">Pe val</div>
                <div class="streak-banner-name">${hot.p.name}</div>
                <div class="streak-banner-sub">${hot.count} victorii la rând</div>
            </div>
        </div>` : ''}
        ${topScorer ? `<div class="streak-banner-card goal" onclick="${topScorer.players.length===1 && topScorer.players[0].player ? `openModal(${topScorer.players[0].player.id})` : ''}">
            <div class="streak-banner-icon">⚽</div>
            <div>
                <div class="streak-banner-lbl">Golgheterul Săptămânii</div>
                <div class="streak-banner-name">${topScorer.players.map(s=>s.name).join(', ')}</div>
                <div class="streak-banner-sub">${topScorer.goals} gol${topScorer.goals!==1?'uri':''} în ultima săptămână</div>
            </div>
        </div>` : ''}
    </div>`;
}

// ── ⚔️ Nemesis — adversarul împotriva căruia jucătorul pierde cel mai des ──
// Prag minim 3 meciuri directe, și doar dacă rata de înfrângere e peste 50%.
function computeNemesis(p){
    const opponents = {}; // name -> {games, losses}
    db.history.forEach(h=>{
        const inOrange = (h.orangePlayers||[]).includes(p.name);
        const inGreen  = (h.greenPlayers||[]).includes(p.name);
        const inBlack  = (h.blackPlayers||[]).includes(p.name);
        if(!inOrange && !inGreen && !inBlack) return;
        const won = playerWonMatch(h, p.name);
        if(won===null) return;
        let oppList = [];
        if(inOrange) oppList = [...(h.greenPlayers||[]), ...(h.blackPlayers||[])];
        else if(inGreen) oppList = [...(h.orangePlayers||[]), ...(h.blackPlayers||[])];
        else oppList = [...(h.orangePlayers||[]), ...(h.greenPlayers||[])];
        oppList.forEach(name=>{
            if(name===p.name) return;
            if(!opponents[name]) opponents[name]={games:0,losses:0};
            opponents[name].games++;
            if(won===false) opponents[name].losses++;
        });
    });
    let nemesis=null;
    Object.entries(opponents).forEach(([name,st])=>{
        if(st.games<3) return;
        const lossRate = st.losses/st.games;
        if(lossRate<=0.5) return;
        if(!nemesis || lossRate>nemesis.lossRate || (lossRate===nemesis.lossRate && st.games>nemesis.games)){
            nemesis = {name, games:st.games, losses:st.losses, lossRate};
        }
    });
    return nemesis;
}

// ── 🎖️ Insigne / Milestone-uri — apar automat la praguri, editabile din Setări ──
function getLongestWinStreak(p){
    let longest=0, cur=0;
    (p.matchHistory||[]).forEach(r=>{
        if(r==='W'){ cur++; longest=Math.max(longest,cur); } else cur=0;
    });
    return longest;
}
function getBestSingleMatchGoals(p){
    let max=0;
    db.history.forEach(h=>{ const g=(h.playerGoals&&h.playerGoals[p.name])||0; if(g>max) max=g; });
    return max;
}

// Praguri implicite — folosite doar dacă tabela milestone_config e goală (prima
// rulare) sau dacă încărcarea din Supabase eșuează. Editabile din Setări → Milestone-uri.
const DEFAULT_MILESTONE_CONFIG = [
    {category:'goals',  threshold:10,  emoji:'⚽',   label:'10 Goluri',              sort_order:1},
    {category:'goals',  threshold:25,  emoji:'🎯',   label:'25 Goluri',              sort_order:2},
    {category:'goals',  threshold:50,  emoji:'🔱',   label:'50 Goluri',              sort_order:3},
    {category:'goals',  threshold:100, emoji:'💯',   label:'100 Goluri',             sort_order:4},
    {category:'wins',   threshold:10,  emoji:'🏆',   label:'10 Victorii',            sort_order:1},
    {category:'wins',   threshold:25,  emoji:'🥇',   label:'25 Victorii',            sort_order:2},
    {category:'wins',   threshold:50,  emoji:'👑',   label:'50 Victorii',            sort_order:3},
    {category:'games',  threshold:25,  emoji:'📅',   label:'25 Meciuri',             sort_order:1},
    {category:'games',  threshold:50,  emoji:'🏟️',  label:'50 Meciuri',             sort_order:2},
    {category:'games',  threshold:100, emoji:'💼',   label:'100 Meciuri',            sort_order:3},
    {category:'streak', threshold:5,   emoji:'🔥',   label:'5 Victorii la rând',     sort_order:1},
    {category:'streak', threshold:10,  emoji:'🚀',   label:'10 Victorii la rând',    sort_order:2},
    {category:'best_match_goals', threshold:3, emoji:'🎩',  label:'Hat-trick',       sort_order:1},
    {category:'best_match_goals', threshold:4, emoji:'🎩🎩', label:'Poker de goluri', sort_order:2},
];

let milestoneConfig = []; // populat de loadMilestoneConfig(), din tabela milestone_config

async function loadMilestoneConfig(){
    try{
        const { data, error } = await sb.from('milestone_config').select('*').order('category').order('threshold');
        if(error) throw error;
        if(!data || !data.length){
            const { data:seeded } = await sb.from('milestone_config').insert(DEFAULT_MILESTONE_CONFIG).select();
            milestoneConfig = seeded || DEFAULT_MILESTONE_CONFIG.map((t,i)=>({...t,id:i+1}));
        } else {
            milestoneConfig = data;
        }
    }catch(e){
        console.warn('milestone_config load failed, using defaults (ai rulat migrarea SQL?):', e.message);
        milestoneConfig = DEFAULT_MILESTONE_CONFIG.map((t,i)=>({...t,id:i+1}));
    }
}

function _pickTier(arr,val){ let best=null; arr.forEach(t=>{ if(val>=t.threshold) best=t; }); return best; }
function _milestoneTiersFor(category){
    return milestoneConfig.filter(t=>t.category===category).sort((a,b)=>a.threshold-b.threshold);
}
function getPlayerMilestones(p){
    const badges=[];
    let b;
    b=_pickTier(_milestoneTiersFor('goals'),(p.totalGoals||0));      if(b) badges.push(b);
    b=_pickTier(_milestoneTiersFor('wins'),(p.wins||0));              if(b) badges.push(b);
    b=_pickTier(_milestoneTiersFor('games'),(p.games||0));            if(b) badges.push(b);
    b=_pickTier(_milestoneTiersFor('streak'),getLongestWinStreak(p)); if(b) badges.push(b);
    b=_pickTier(_milestoneTiersFor('best_match_goals'), getBestSingleMatchGoals(p)); if(b) badges.push(b);
    return badges;
}
function renderMilestoneBadges(p, big){
    const badges = getPlayerMilestones(p);
    if(!badges.length) return '';
    return `<div class="milestone-row">${badges.map(b=>`<span class="milestone-badge${big?' big':''}" title="${b.label}">${b.emoji} ${b.label}</span>`).join('')}</div>`;
}

// ── 📅 Echipa Săptămânii + 🎬 Derby-ul săptămânii ──────────────────
// Fereastră: ultimele 7 zile; dacă nu s-a jucat nimic recent, cad back pe ultimele 5 meciuri.
function getRecentMatchesWindow(){
    if(!db.history.length) return [];
    const cutoff = new Date(Date.now()-7*24*60*60*1000);
    let recent = db.history.filter(h=>parseDateToObj(h.date)>=cutoff);
    if(!recent.length) recent = db.history.slice(0,5);
    return recent;
}

function computeWeekPlayerStats(){
    const recent = getRecentMatchesWindow();
    if(!recent.length) return {};
    const stats={};
    const ensure=n=>stats[n]||(stats[n]={name:n,games:0,wins:0,goals:0});
    recent.forEach(h=>{
        const winO=h.winner==='Portocaliu', winG=h.winner==='Verde', winB=h.winner==='Negru';
        (h.orangePlayers||[]).forEach(n=>{const s=ensure(n);s.games++;if(winO)s.wins++;});
        (h.greenPlayers ||[]).forEach(n=>{const s=ensure(n);s.games++;if(winG)s.wins++;});
        (h.blackPlayers ||[]).forEach(n=>{const s=ensure(n);s.games++;if(winB)s.wins++;});
        if(h.playerGoals) Object.entries(h.playerGoals).forEach(([n,g])=>{ ensure(n).goals += (g||0); });
    });
    return stats;
}

function computeWeekTeam(){
    const stats = computeWeekPlayerStats();
    const arr = Object.values(stats).map(s=>{
        const p = db.players.find(x=>x.name===s.name);
        const wr = s.games>0 ? s.wins/s.games : 0;
        const smartBonus = p ? getSmartRating(p)/10 : 0;
        return { ...s, player:p, score: wr*3 + s.goals*0.6 + smartBonus };
    });
    arr.sort((a,b)=>b.score-a.score);
    return arr.slice(0,5);
}

// ── ⚽ Golgheterul Săptămânii — cele mai multe goluri date în fereastra recentă (7 zile / fallback 5 meciuri) ──
function computeWeekTopScorer(){
    const stats = computeWeekPlayerStats();
    const arr = Object.values(stats).filter(s=>s.goals>0).sort((a,b)=>b.goals-a.goals);
    if(!arr.length) return null;
    const topGoals = arr[0].goals;
    const top = arr.filter(s=>s.goals===topGoals);
    return { players: top, goals: topGoals };
}

function computeDerbyOfWeek(){
    const recent = getRecentMatchesWindow();
    if(!recent.length) return null;
    let best=null, bestExcitement=-Infinity;
    recent.forEach(h=>{
        if(!h.score) return;
        const parts = h.score.split(':').map(s=>parseInt(s.trim(),10));
        if(parts.length<2 || isNaN(parts[0]) || isNaN(parts[1])) return;
        const diff = Math.abs(parts[0]-parts[1]);
        const total = parts[0]+parts[1];
        // "Captivant" = multe goluri ȘI scor strâns — penalizează atât 0-0-urile cât și scorurile zdrobitoare
        const excitement = total - diff;
        if(excitement > bestExcitement){
            best={h,diff,total,excitement,a:parts[0],b:parts[1]};
            bestExcitement=excitement;
        }
    });
    return best;
}

// Marcatorul ULTIMEI PARTIDE — poate fi un meci normal (2 echipe) sau o
// sesiune întreagă de 3 echipe (mai multe perechi jucate în aceeași seară).
// Foloseste aceeași grupare pe sesiuni ca la istoricul de meciuri, ca golgheterul
// să fie corect cumulat pe toată seara, nu doar pe ultima pereche salvată.
function computeLastMatchTopScorer(){
    if(!db.history.length) return null;
    const groups = groupHistoryForDisplay(db.history);
    if(!groups.length) return null;
    const last = groups[0];
    const rows = last.rows;

    const totalGoals = {};
    rows.forEach(h => { Object.entries(h.playerGoals||{}).forEach(([n,g]) => { totalGoals[n]=(totalGoals[n]||0)+g; }); });
    const entries = Object.entries(totalGoals).sort((a,b)=>b[1]-a[1]);
    if(!entries.length) return null;
    const topGoals = entries[0][1];
    const topScorers = entries.filter(([,g])=>g===topGoals).map(([name])=>name);
    const h = rows[0]; // pentru dată — toate rândurile sesiunii au aceeași zi
    return { h, topScorers, goals: topGoals, isSession: last.type==='session' };
}

function renderWeeklyCards(){
    const wrap = document.getElementById('weeklyCards');
    if(!wrap) return;
    const weekTeam = computeWeekTeam();
    const derby = computeDerbyOfWeek();
    if(!weekTeam.length && !derby){ wrap.style.display='none'; wrap.innerHTML=''; return; }
    wrap.style.display='block';

    const teamHtml = weekTeam.length ? `<div class="week-card">
        <div class="week-card-title">📅 Echipa Săptămânii</div>
        ${weekTeam.map((s,i)=>`<div class="week-player-row" onclick="${s.player?`openModal(${s.player.id})`:''}">
            <span class="week-player-rank">${i+1}</span>
            <span class="week-player-name">${s.name}</span>
            <span class="week-player-sub">${s.wins}V/${s.games}M${s.goals?' · ⚽'+s.goals:''}</span>
        </div>`).join('')}
    </div>` : '';

    let derbyHtml = '';
    if(derby){
        const h=derby.h;
        const orangeName = teamNames?.orange || 'Portocaliu';
        const greenName  = teamNames?.green  || 'Verde';
        let summary;
        if(derby.total>=7 && derby.diff<=1)      summary = `🔥🔥 Meci nebun — plin de goluri și super strâns!`;
        else if(derby.diff===0 && derby.total>=4) summary = `⚡ Egalitate spectaculoasă, plină de goluri!`;
        else if(derby.diff===0)                   summary = `⚡ Egalitate, ${derby.a}-${derby.b}.`;
        else if(derby.total>=6)                   summary = `🎯 Meci plin de goluri!`;
        else if(derby.diff===1)                   summary = `🔥 Decis la un singur gol diferență!`;
        else                                        summary = `🎬 Cel mai captivant meci recent.`;
        derbyHtml = `<div class="week-card">
            <div class="week-card-title">🎬 Meciul Captivant al Săptămânii</div>
            <div class="derby-teams"><span>${orangeName}</span><span>${greenName}</span></div>
            <div class="derby-score">${derby.a} : ${derby.b}</div>
            <div class="derby-summary">${summary}</div>
            <div class="derby-date">${h.date||''}</div>
        </div>`;
    }

    let scorerHtml = '';
    const topScorer = computeLastMatchTopScorer();
    if(topScorer){
        const { h, topScorers, goals, isSession } = topScorer;
        const isTie = topScorers.length > 1;
        scorerHtml = `<div class="week-card">
            <div class="week-card-title">⚽ Marcatorul Ultimei Partide</div>
            ${topScorers.map(name=>{
                const p = db.players.find(x=>x.name===name);
                return `<div class="week-player-row" onclick="${p?`openModal(${p.id})`:''}">
                    <span class="week-player-rank">${isTie?'🤝':'👑'}</span>
                    <span class="week-player-name">${name}</span>
                    <span class="week-player-sub">${goals} gol${goals!==1?'uri':''}</span>
                </div>`;
            }).join('')}
            <div class="derby-date">${h.date||''}${isSession?' · sesiune 3 echipe':''}</div>
        </div>`;
    }

    wrap.innerHTML = `<div class="week-cards-grid">${teamHtml}${derbyHtml}${scorerHtml}</div>`;
}

// Form Index: last 5 results as dots, plus form label
function getFormIndex(p){
    const history = p.matchHistory || [];
    const last5 = history.slice(-5); // last 5 results
    const wins  = last5.filter(r=>r==='W').length;
    const total = last5.length;
    // Form label
    let label='', color='#555';
    if(total < 2) { label='—'; color='#555'; }
    else if(wins >= 4)       { label='🔥 În formă'; color='#2e7d32'; }
    else if(wins === 3)      { label='📈 OK'; color='#8bc34a'; }
    else if(wins === 2)      { label='😐 Mediu'; color='#ffd600'; }
    else if(wins === 1)      { label='📉 Formă slabă'; color='#9c4f00'; }
    else                      { label='❄️ În cădere'; color='#a52020'; }
    return { last5, wins, total, label, color };
}

function showLoading(v){document.getElementById('loadingOverlay').classList.toggle('hidden',!v);}
function setConnected(v){
    const b=document.getElementById('connBadge'),t=document.getElementById('connText');
    b.className='conn-badge '+(v?'online':'offline');
    t.textContent=v?'Online':'Offline';
}
function showToast(msg,type=''){
    const t=document.getElementById('toast');t.textContent=msg;t.className='toast'+(type?' toast-'+type:'');
    requestAnimationFrame(()=>{t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);});
}
function showConfirm(icon,title,msg,yesLabel,yesBg,cb){
    document.getElementById('confirmIcon').textContent=icon;
    document.getElementById('confirmTitle').textContent=title;
    document.getElementById('confirmMsg').textContent=msg;
    const btn=document.getElementById('confirmYesBtn');btn.textContent=yesLabel;
    btn.style.background=yesBg;btn.style.color=(yesBg==='var(--orange)'||yesBg==='/orange')?'#000':'#fff';
    btn.onclick=()=>{closeConfirm();cb();};
    document.getElementById('confirmOverlay').style.display='flex';
}
function closeConfirm(){document.getElementById('confirmOverlay').style.display='none';}

function render(){
    ['orange','green','bench','active'].forEach(t=>{
        const el = document.getElementById(`list-${t}`);
        if(el) el.innerHTML='';
    });
    const sorted=[...db.players].sort((a,b)=>getSmartRating(b)-getSmartRating(a));
    const byTeam={orange:[],green:[],bench:[],active:[]};
    sorted.forEach(p=>{
        const s = p.status;
        if(byTeam[s]) byTeam[s].push(p);
        else byTeam.active.push(p); // fallback — status necunoscut → Jucători Activi
    });
    const admin = isAdmin();
    ['orange','green','bench','active'].forEach(team=>{
        byTeam[team].forEach((p,idx)=>{
            const smart=getSmartRating(p).toFixed(1),general=getGeneralAvg(p).toFixed(1);
            const rankClass=idx===0?'rank-1':idx===1?'rank-2':idx===2?'rank-3':'rank-other';
            const wr=p.games>0?((p.wins/p.games)*100).toFixed(0)+'%':'—';
            const s=getStreak(p); // kept for leaderboard use
            const playerTagObjs = getPlayerActiveTagObjects(p);
            const archHtml = playerTagObjs.length
                ? `<div class="ptag-row">${renderTagBadges(playerTagObjs.slice(0,4))}</div>`
                : '';
            const card=document.createElement('div');
            card.className='player-card';
            card.id=`p-${p.id}`;
            card.onclick=()=>openModal(p.id);
            // Drag only for admin
            if(admin){
                card.draggable=true;
                card.ondragstart=e=>e.dataTransfer.setData("text",p.id);
                card.style.cursor='grab';
            }
            const form = getFormIndex(p);
            // Form dots: 5 slots, fill from left with actual results
            const dots5 = Array.from({length:5},(_,i)=>{
                const res = form.last5[i];
                if(!res) return `<div class="form-dot empty"></div>`;
                return `<div class="form-dot ${res}" title="${res==='W'?'Victorie':'Înfrângere'}"></div>`;
            }).join('');
            // Smart rating color based on value
            const smartNum = parseFloat(smart);
            const smartColor = p.adminRating!=null?'var(--orange)':smartNum>=8?'#1b7a43':smartNum>=6?'#8a6800':smartNum>=4?'#9c4f00':'#e57373';
            const teamCls = p.status==='orange'?'team-orange':p.status==='green'?'team-green':'';
            card.className=`player-card ${teamCls}`;

            // Active tag badges (max 6, grouped pos/neg)
            const posTagObjs = playerTagObjs.filter(t=>t.tag?.type==='pos').slice(0,3);
            const negTagObjs = playerTagObjs.filter(t=>t.tag?.type==='neg').slice(0,2);
            const tagPreviewHtml = [...posTagObjs,...negTagObjs].map(t=>{
                const cls = t.tag.type==='pos'?'tag-pos':t.tag.type==='neg'?'tag-neg':'tag-neu';
                return `<span class="ptag ${cls}" style="font-size:.55rem;padding:1px 5px;">${t.tag.emoji} ${t.tag.label}</span>`;
            }).join('');
            const goalsLine = (p.totalGoals||0)>0
                ? `<div class="fifa-stat" style="color:#1b7a43;">⚽<span>${p.totalGoals}</span>${(p.totalPenaltyGoals||0)>0?` <span style="font-size:.55rem;color:#7d6849;">(🥅${p.totalPenaltyGoals} pen)</span>`:''}</div>`
                : ((p.totalPenaltyGoals||0)>0 ? `<div class="fifa-stat" style="color:#7d6849;font-size:.55rem;">🥅${p.totalPenaltyGoals} pen</div>` : '');
            const gcLine = (p.totalGoalsConceded||0)>0
                ? `<div class="fifa-stat" style="color:#b71c1c;">🧤<span>${p.totalGoalsConceded}</span></div>` : '';
            card.innerHTML=`
                <div class="player-rank-label ${rankClass}"></div>
                <div class="fifa-card-body">
                    <div class="fifa-rating-col">
                        <div class="fifa-rating-num" style="color:${smartColor};">${smart}${p.adminRating!=null?'<span style="font-size:.5rem;">👑</span>':''}</div>
                        <div class="fifa-rating-lbl" style="color:${smartColor};font-size:.45rem;letter-spacing:.8px;">SMART</div>
                        <div class="form-row" style="margin-top:5px;justify-content:center;padding-top:4px;border-top:1px solid rgba(255,255,255,.05);">
                            ${dots5}
                        </div>
                    </div>
                    <div class="fifa-info-col">
                        <div class="player-name">${p.name}${getPlayerPrimaryPos(p)?` <span class="role-badge-inline" style="font-size:.5rem;padding:1px 4px;border-radius:3px;background:${POSITIONS[getPlayerPrimaryPos(p)].color}22;border:1px solid ${POSITIONS[getPlayerPrimaryPos(p)].color}44;color:${POSITIONS[getPlayerPrimaryPos(p)].color};">${getPlayerPrimaryPos(p)}</span>`:''}</div>
                        <div class="fifa-stats-row" style="margin:4px 0;">
                            <div class="fifa-stat">WR:<span>${wr}</span></div>
                            <div class="fifa-stat">M:<span>${p.games}</span></div>
                            ${goalsLine}${gcLine}
                        </div>
                        <div class="ptag-row" style="margin-top:2px;">${tagPreviewHtml||'<span style="font-size:.62rem;color:#7d6849;">Fără statusuri</span>'}</div>
                        ${renderMilestoneBadges(p)}
                    </div>
                </div>`;
            const container = document.getElementById(`list-${team}`);
            if(container) container.appendChild(card);
        });
    });
    updateTeamStats();renderLeaderboard();renderStreakBanner();renderWeeklyCards();renderHistory();renderLobby();renderTeamTitles();applyThreeTeamUI();
    checkLiveStatus();
    localStorage.setItem('fb_club_v6',JSON.stringify(db));
    // Keep mobile tab active after re-render
    if (window.innerWidth <= 640) switchMobileTab(currentMobileTab || 'match');
    applyDashStatsVisibility();
    applyDashTagsVisibility();
    applyDashRolesVisibility();
}

function analyzeTeamBalance(teamPlayers){
    if(!teamPlayers.length) return [{cls:'tbi-ok', msg:'—'}];
    const profile = computeTeamAttrProfile(teamPlayers);
    const warnings = [];
    const n = teamPlayers.length;
    // Threshold scales with team size
    const thr = n >= 5 ? -3 : n >= 3 ? -2 : -1;

    // BUCKET checks (sum of bucket axes vs threshold)
    const tehnicSum   = (profile.tehnica||0) + (profile.executie||0);
    const tacticSum   = (profile.strategie||0) + (profile.pozitionare||0) + (profile.mentalitate||0);
    const fizicSum    = (profile.viteza||0) + (profile.efort||0) + (profile.fizic||0);
    const defensivSum = (profile.aparare||0) + (profile.pozitionare||0);

    // Scale threshold by number of axes in bucket
    if(defensivSum < thr * 2)
        warnings.push({cls:'tbi-danger', msg:'🛡️ Apărare descoperită'});
    if(tacticSum < thr * 3)
        warnings.push({cls:'tbi-warn', msg:'🧠 Lipsă viziune / IQ tactic'});
    if(fizicSum < thr * 3)
        warnings.push({cls:'tbi-warn', msg:'💪 Profil fizic slab'});
    if(tehnicSum < thr * 2)
        warnings.push({cls:'tbi-warn', msg:'🎯 Lipsă execuție tehnică'});
    if((profile.mentalitate||0) < thr)
        warnings.push({cls:'tbi-warn', msg:'💡 Mentalitate fragilă'});
    if((profile.pozitionare||0) < thr)
        warnings.push({cls:'tbi-warn', msg:'📍 Poziționare slabă'});

    // Too many negative tags?
    const negCount = teamPlayers.flatMap(p=>getPlayerActiveTagObjects(p))
        .filter(o=>o.tag?.type==='neg').length;
    if(negCount >= n * 2)
        warnings.push({cls:'tbi-warn', msg:'☠️ Mulți factori negativi'});

    if(!warnings.length)
        return [{cls:'tbi-ok', msg:'✅ Echipă echilibrată'}];

    return warnings;
}

function updateTeamStats(){
    const oPlayers = db.players.filter(p=>p.status==='orange');
    const gPlayers = db.players.filter(p=>p.status==='green');

    ['orange','green'].forEach(team=>{
        const pl = team==='orange' ? oPlayers : gPlayers;
        const n = pl.length;
        const tot = pl.reduce((s,p)=>s+getSmartRating(p),0);
        const avg = n ? (tot/n).toFixed(1) : '—';
        document.getElementById(`avg-${team}`).textContent=`★ ${avg}`;
        document.getElementById(`count-${team}`).textContent=`${n} jucători`;
        document.getElementById(`bar-${team}`).style.width=(n?Math.min((tot/n)/10*100,100):0)+'%';
    });
    const bPlayers = db.players.filter(p=>p.status==='bench');
    document.getElementById('count-bench').textContent=`${bPlayers.length} jucători`;
    document.getElementById('count-active').textContent=`${db.players.filter(p=>p.status==='active').length} jucători`;
    // Show bench rating when 3-team mode
    if(threeTeamMode && bPlayers.length > 0){
        const bTot = bPlayers.reduce((s,p)=>s+getSmartRating(p),0);
        const bAvg = (bTot/bPlayers.length).toFixed(1);
        const avgEl = document.getElementById('avg-bench');
        const barEl = document.getElementById('bar-bench');
        const balEl = document.getElementById('balance-bench');
        if(avgEl) avgEl.textContent=`★ ${bAvg}`;
        if(barEl) barEl.style.width=Math.min((bTot/bPlayers.length)/10*100,100)+'%';
        if(balEl){const w=analyzeTeamBalance(bPlayers);balEl.className='team-balance-indicator';balEl.innerHTML=w.map(x=>`<div class="${x.cls}" style="margin-bottom:1px;">${x.msg}</div>`).join('');}
    } else {
        const balEl=document.getElementById('balance-bench');
        if(balEl){balEl.className='team-balance-indicator';balEl.innerHTML='';}
    }

    // Team balance indicators
    function renderBalance(elId, players){
        const el=document.getElementById(elId);if(!el)return;
        const warnings=analyzeTeamBalance(players);
        el.className='team-balance-indicator';
        el.style.display='';
        el.innerHTML=warnings.map(w=>`<div class="${w.cls}" style="margin-bottom:1px;">${w.msg}</div>`).join('');
    }
    renderBalance('balance-orange', oPlayers);
    renderBalance('balance-green', gPlayers);

    // Win probability banner
    const banner = document.getElementById('matchStatsBanner');
    if (oPlayers.length > 0 && gPlayers.length > 0) {
        const oSum = oPlayers.reduce((s,p)=>s+getSmartRating(p),0);
        const gSum = gPlayers.reduce((s,p)=>s+getSmartRating(p),0);
        const total = oSum + gSum;
        const oPct = Math.round((oSum/total)*100);
        const gPct = 100 - oPct;
        const oAvg = (oSum/oPlayers.length).toFixed(1);
        const gAvg = (gSum/gPlayers.length).toFixed(1);

        document.getElementById('probOrange').textContent     = oPct + '%';
        document.getElementById('probGreen').textContent      = gPct + '%';
        document.getElementById('probBarOrange').style.width  = oPct + '%';
        document.getElementById('probBarGreen').style.width   = gPct + '%';
        document.getElementById('avgLabelOrange').textContent = `★ ${oAvg} (${oPlayers.length} juc.)`;
        document.getElementById('avgLabelGreen').textContent  = `★ ${gAvg} (${gPlayers.length} juc.)`;
        if (banner) banner.style.display = 'block';
    } else {
        if (banner) banner.style.display = 'none';
    }
}
let currentLbTab = 'smart';
let currentLbPeriod = 'all';   // 'all' | 'month'
let lbExpanded = false;        // arată tot clasamentul, nu doar top 10
const LB_MIN_GAMES = 3;        // prag minim pt. taburi bazate pe rată (Win%, G/Meci)
const LB_PERIODLESS_TABS = ['smart','general']; // taburi bazate pe rating, nu pe perioadă

function setLeaderboardMode(m){ setLbTab(m); }
function setLbTab(tab){
    currentLbTab=tab;
    lbExpanded=false;
    document.querySelectorAll('.lb-tab').forEach(b=>b.classList.remove('active'));
    const btn=document.getElementById('lbt-'+tab);
    if(btn) btn.classList.add('active');
    const periodRow = document.getElementById('lbPeriodRow');
    if(periodRow) periodRow.style.display = LB_PERIODLESS_TABS.includes(tab) ? 'none' : 'flex';
    renderLeaderboard();
}
function setLbPeriod(period){
    currentLbPeriod=period;
    lbExpanded=false;
    document.querySelectorAll('.lb-period-btn').forEach(b=>b.classList.remove('active'));
    const btn=document.getElementById('lbp-'+period);
    if(btn) btn.classList.add('active');
    renderLeaderboard();
}
function toggleLbExpand(){ lbExpanded=!lbExpanded; renderLeaderboard(); }

// Calculează stats per jucător (meciuri/victorii/goluri/penalty-uri câștigate)
// strict din db.history, filtrat pe perioada aleasă — independent de p.wins/p.games (all-time).
function computeLbPeriodStats(period){
    const cutoff = period==='month' ? new Date(Date.now()-30*86400000) : null;
    const stats = {};
    const ensure = n => stats[n] || (stats[n] = {name:n, games:0, wins:0, goals:0, penaltyWins:0});
    db.history.forEach(h=>{
        if (cutoff){ const d=parseDateToObj(h.date); if(!d || d<cutoff) return; }
        const winO = h.winner==='Portocaliu', winG = h.winner==='Verde', winB = h.winner==='Negru';
        (h.orangePlayers||[]).forEach(n=>{ const s=ensure(n); s.games++; if(winO) s.wins++; });
        (h.greenPlayers ||[]).forEach(n=>{ const s=ensure(n); s.games++; if(winG) s.wins++; });
        (h.blackPlayers ||[]).forEach(n=>{ const s=ensure(n); s.games++; if(winB) s.wins++; });
        if (h.playerGoals) Object.entries(h.playerGoals).forEach(([n,g])=>{ ensure(n).goals += (g||0); });
        if (Array.isArray(h.roundsDetail)) h.roundsDetail.forEach(r=>{
            if (r.penalty_winner_name) ensure(r.penalty_winner_name).penaltyWins++;
        });
    });
    return stats;
}
function renderLeaderboard(){
    const medals=['🥇','🥈','🥉'];
    const content=document.getElementById('lbContent');
    if(!content) return;

    // Taburile bazate pe rating (Smart/General) rămân mereu all-time — perioada nu se aplică.
    const periodApplies = !LB_PERIODLESS_TABS.includes(currentLbTab);
    const usesPeriodStats = periodApplies && (currentLbPeriod==='month' || currentLbTab==='pen');
    const periodStats = usesPeriodStats ? computeLbPeriodStats(currentLbTab==='pen' ? currentLbPeriod : currentLbPeriod) : null;

    const gamesOf = p => usesPeriodStats ? (periodStats[p.name]?.games||0) : p.games;
    const winsOf  = p => usesPeriodStats ? (periodStats[p.name]?.wins ||0) : p.wins;
    const goalsOf = p => usesPeriodStats ? (periodStats[p.name]?.goals||0) : (p.totalGoals||0);

    const all = db.players;
    const withGames = usesPeriodStats
        ? db.players.filter(p=>(periodStats[p.name]?.games||0)>0)
        : db.players.filter(p=>p.games>0);

    let sorted=[], getValue, subLabel, bigColor='var(--star)', bigLabel;
    switch(currentLbTab){
        case 'smart':
            sorted=[...all].sort((a,b)=>getSmartRating(b)-getSmartRating(a));
            getValue=p=>getSmartRating(p).toFixed(1);
            subLabel=p=>{const wr=p.games>0?((p.wins/p.games)*100).toFixed(0)+'%':'—';return wr+' WR · '+p.games+'M';};
            bigColor='#6b46c1'; bigLabel='★ Smart';
            break;
        case 'general':
            sorted=[...all].sort((a,b)=>getGeneralAvg(b)-getGeneralAvg(a));
            getValue=p=>getGeneralAvg(p).toFixed(1);
            subLabel=p=>{const wr=p.games>0?((p.wins/p.games)*100).toFixed(0)+'%':'—';return wr+' WR';};
            bigColor='var(--star)'; bigLabel='⭐ General';
            break;
        case 'goals':
            sorted=[...withGames].filter(p=>goalsOf(p)>0).sort((a,b)=>goalsOf(b)-goalsOf(a));
            getValue=p=>'⚽'+goalsOf(p);
            subLabel=p=>{const g=gamesOf(p);const gpg=g>0?(goalsOf(p)/g).toFixed(1):'—';return gpg+'/meci';};
            bigColor='#1b7a43'; bigLabel='⚽ Goluri';
            break;
        case 'wins':
            sorted=[...withGames].sort((a,b)=>winsOf(b)-winsOf(a));
            getValue=p=>'🏆'+winsOf(p);
            subLabel=p=>{const g=gamesOf(p);const wr=g>0?((winsOf(p)/g)*100).toFixed(0)+'%':'—';return wr+' WR';};
            bigColor='#c9820a'; bigLabel='🏆 Victorii';
            break;
        case 'games':
            sorted=[...withGames].sort((a,b)=>gamesOf(b)-gamesOf(a));
            getValue=p=>'📅'+gamesOf(p);
            subLabel=p=>winsOf(p)+'V / '+(gamesOf(p)-winsOf(p))+'P';
            bigColor='#1554b3'; bigLabel='📅 Meciuri';
            break;
        case 'wr':
            // Prag minim de meciuri, ca winrate-ul să nu fie umflat de un singur meci jucat
            sorted=[...withGames].filter(p=>gamesOf(p)>=LB_MIN_GAMES).sort((a,b)=>(winsOf(b)/gamesOf(b))-(winsOf(a)/gamesOf(a)));
            getValue=p=>((winsOf(p)/gamesOf(p))*100).toFixed(0)+'%';
            subLabel=p=>winsOf(p)+'V / '+gamesOf(p)+'M';
            bigColor='#2e7d32'; bigLabel='📈 Win Rate';
            break;
        case 'gpg':
            // Același prag minim — altfel 1 meci + 1 gol iese pe primul loc la rată
            sorted=[...withGames].filter(p=>gamesOf(p)>=LB_MIN_GAMES && goalsOf(p)>0)
                .sort((a,b)=>(goalsOf(b)/gamesOf(b))-(goalsOf(a)/gamesOf(a)));
            getValue=p=>(goalsOf(p)/gamesOf(p)).toFixed(2);
            subLabel=p=>goalsOf(p)+' goluri'+(usesPeriodStats && currentLbPeriod==='month' ? ' (30 zile)' : ' total');
            bigColor='#8a6800'; bigLabel='⚡ G/Meci';
            break;
        case 'pen':
            sorted=db.players.filter(p=>(periodStats[p.name]?.penaltyWins||0)>0)
                .sort((a,b)=>(periodStats[b.name]?.penaltyWins||0)-(periodStats[a.name]?.penaltyWins||0));
            getValue=p=>'🥅'+(periodStats[p.name]?.penaltyWins||0);
            subLabel=p=>(periodStats[p.name]?.penaltyWins||0)+' câștigate la penalty';
            bigColor='#b71c1c'; bigLabel='🥅 Penalty';
            break;
        default:
            sorted=[...all].sort((a,b)=>getSmartRating(b)-getSmartRating(a));
            getValue=p=>getSmartRating(p).toFixed(1); subLabel=p=>p.games+'M'; bigColor='#6b46c1';
    }
    if(!sorted.length){
        const emptyMsg = usesPeriodStats && currentLbPeriod==='month'
            ? 'Niciun meci în ultimele 30 de zile.'
            : (currentLbTab==='pen' ? 'Nicio tură decisă la penalty încă.' : 'Fără date disponibile.');
        content.innerHTML=`<p style="color:#6b5840;font-size:.85rem;text-align:center;padding:14px;">${emptyMsg}</p>`;
        return;
    }
    const maxVal=parseFloat(getValue(sorted[0]).replace(/[^0-9.]/g,''))||1;
    const visibleCount = lbExpanded ? sorted.length : Math.min(10, sorted.length);
    content.innerHTML='<div style="display:flex;flex-direction:column;gap:4px;">'+
        sorted.slice(0,visibleCount).map((p,i)=>{
            const val=getValue(p);
            const numVal=parseFloat(val.replace(/[^0-9.]/g,''))||0;
            const pct=Math.round((numVal/maxVal)*100);
            const medalColors=['#ffd700','#c0c0c0','#cd7f32'];
            const bg=i===0?`rgba(167,139,250,.06)`:i===1?`rgba(192,192,192,.03)`:i===2?`rgba(205,127,50,.03)`:'transparent';
            const nameColor=i<3?'#fff':'#888';
            const form=getFormIndex(p);
            const dots=form.last5.slice(0,5).map(r=>`<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${r==='W'?'#4caf50':'#a52020'};"></span>`).join('');
            return `<div style="display:flex;align-items:center;gap:8px;padding:7px 6px;border-radius:8px;background:${bg};border-bottom:1px solid #f5e9d4;">
                <span style="font-family:'Bebas Neue',sans-serif;font-size:${i<3?'1rem':'.8rem'};min-width:24px;text-align:center;color:${medalColors[i]||'#333'};">${medals[i]||(i+1)}</span>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:700;font-size:${i===0?'.9rem':'.82rem'};color:${nameColor};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.name}</div>
                    <div style="display:flex;align-items:center;gap:5px;margin-top:2px;">
                        <div style="flex:1;height:${i===0?'3px':'2px'};background:#e3d3ac;border-radius:1px;overflow:hidden;max-width:80px;"><div style="width:${pct}%;height:100%;background:${i===0?bigColor:'#d3bd8c'};border-radius:1px;"></div></div>
                        <span style="font-size:.58rem;color:#6b5840;">${subLabel(p)}</span>
                        <span style="font-size:.58rem;">${dots}</span>
                    </div>
                </div>
                <span style="font-family:'Bebas Neue',sans-serif;font-size:${i===0?'1.1rem':'.9rem'};color:${i===0?bigColor:i<3?'#aaa':'#444'};white-space:nowrap;">${val}</span>
            </div>`;
        }).join('')+
        (sorted.length>10 ? `<button class="lb-more-btn" onclick="toggleLbExpand()">${lbExpanded?'▲ Arată doar top 10':'▼ Vezi tot clasamentul ('+sorted.length+')'}</button>` : '')
        +'</div>';
}
// Returnează numele echipelor (Portocaliu/Verde/Negru) prezente într-un rând de istoric
// (fiecare rând de tip pereche are exact 2 din cele 3 populate).
function getRowTeamNames(h){
    const names = [];
    if ((h.orangePlayers||[]).length) names.push('Portocaliu');
    if ((h.greenPlayers ||[]).length) names.push('Verde');
    if ((h.blackPlayers ||[]).length) names.push('Negru');
    return names;
}

// Grupează rândurile de istoric: meciurile de 3 echipe (au roundsDetail) provenite din
// aceeași sesiune live (aceeași dată + created_at apropiat, la câteva minute distanță,
// pentru că toate perechile unei sesiuni se salvează în același apel, la rând) sunt
// puse laolaltă într-un singur "card de sesiune". Meciurile de 2 echipe rămân ca rânduri
// individuale, ca înainte.
function groupHistoryForDisplay(sorted){
    const SESSION_GAP_MS = 10*60*1000; // 10 minute — generos, dar separă sesiuni diferite din aceeași zi
    const items = [];
    let i = 0;
    while (i < sorted.length) {
        const h = sorted[i];
        const is3Team = Array.isArray(h.roundsDetail) && h.roundsDetail.length > 0;
        if (!is3Team) { items.push({type:'single', rows:[h]}); i++; continue; }
        const group = [h];
        let j = i+1;
        while (j < sorted.length) {
            const next = sorted[j];
            const nextIs3 = Array.isArray(next.roundsDetail) && next.roundsDetail.length > 0;
            if (!nextIs3 || next.date !== h.date) break;
            const tA = group[group.length-1].createdAt ? new Date(group[group.length-1].createdAt).getTime() : null;
            const tB = next.createdAt ? new Date(next.createdAt).getTime() : null;
            if (tA===null || tB===null || Math.abs(tA-tB) > SESSION_GAP_MS) break;
            group.push(next);
            j++;
        }
        items.push({type:'session', rows: group});
        i = j;
    }
    return items;
}

function renderHistory(){
    const admin = isAdmin();
    document.getElementById('th-actions').style.display = admin ? '' : 'none';
    document.querySelector('#match-history thead tr').lastElementChild.style.display = admin ? '' : 'none';

    const sorted = [...db.history].sort((a,b) => parseDateToObj(b.date) - parseDateToObj(a.date));

    if (!sorted.length) {
        document.querySelector('#match-history tbody').innerHTML =
            `<tr><td colspan="3" style="color:#7d6849;text-align:center;padding:20px;">Niciun meci înregistrat</td></tr>`;
        return;
    }

    const items = groupHistoryForDisplay(sorted);

    document.querySelector('#match-history tbody').innerHTML = items.map(item => {
        if (item.type === 'session') return renderSessionRow(item.rows, admin);
        return renderSingleMatchRow(item.rows[0], admin);
    }).join('');
}

// ── Un singur meci (2 echipe, sau 3 echipe fără altă pereche în aceeași sesiune) ──
function renderSingleMatchRow(h, admin){
    const origIdx = db.history.indexOf(h);
    const hasBlack = (h.blackPlayers||[]).length > 0;
    const _ws = getWinnerSideFromScore(h); // 'orange'|'green'|'black'|'draw'|null
    const winColor = _ws === 'orange' ? teamColors.orange
                   : _ws === 'green'  ? teamColors.green
                   : _ws === 'black'  ? '#3d3d3d'
                   : '#7d6849'; // draw
    const winnerBadge = `<span style="display:inline-block;padding:2px 8px;border-radius:20px;background:${winColor};color:#fff;font-size:.68rem;font-weight:700;white-space:nowrap;">${h.winner||'Egal'}</span>`;
    const imbalBadge = h.imbalanced ? `<span title="Dezechilibru 3+ goluri" style="font-size:.65rem;color:#b71c1c;margin-left:4px;">⚠️</span>` : '';

    const { teamsHTML, topScorerHTML } = renderPairBody(h);

    const adminBtns = admin ? `<button class="match-edit-btn" onclick="event.stopPropagation();openMatchEditor(${origIdx})" title="Editează">✏️</button>
        <button class="match-edit-btn" onclick="event.stopPropagation();confirmDeleteMatch(${origIdx})" title="Șterge" style="color:#c62828;">🗑️</button>` : '';

    return `<tr onclick="openMatchModal(${origIdx})" style="cursor:pointer;">
        <td style="vertical-align:top;padding-top:10px;">
            <div style="font-weight:700;font-size:.82rem;color:#3a2f1f;">${h.date||'—'}</div>
        </td>
        <td style="padding:8px 12px 8px 6px;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;">
                ${winnerBadge}${imbalBadge}
                ${h.score ? `<span style="font-size:.72rem;color:#7d6849;">ture: ${h.score}</span>` : ''}
            </div>
            <div style="background:#fffaf0;border-radius:8px;padding:6px 10px;border:1px solid #e3d3ac;min-width:220px;">
                ${teamsHTML}
            </div>
            ${topScorerHTML}
        </td>
        <td style="white-space:nowrap;vertical-align:top;padding-top:10px;">${adminBtns}</td>
    </tr>`;
}

// Construiește markup-ul comun (scoruri per echipă + golgheter) pentru o pereche —
// reutilizat atât de rândul individual, cât și de fiecare sub-secțiune dintr-o sesiune.
function renderPairBody(h){
    const hasBlack = (h.blackPlayers||[]).length > 0;
    const tg = h.teamGoals || { orange:0, green:0, black:0 };

    const penG = { orange:0, green:0, black:0 };
    if (Array.isArray(h.roundsDetail)) {
        h.roundsDetail.forEach(r=>{
            if (Array.isArray(r.penalty_shots)) {
                r.penalty_shots.forEach(s=>{
                    if (s.state==='goal' && penG[s.team]!==undefined) penG[s.team]++;
                });
            }
        });
    }

    const makeTeamScore = (names, teamKey, color, label) => {
        if (!names?.length) return '';
        const g = tg[teamKey] || 0;
        const pen = penG[teamKey] || 0;
        const isWinner = h.winner?.toLowerCase().includes(label.toLowerCase());
        return `<div style="display:flex;align-items:center;gap:6px;padding:3px 0;">
            <span style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;display:inline-block;"></span>
            <span style="font-weight:700;font-size:.82rem;color:${isWinner?color:'#3a2f1f'};">${label}</span>
            <span style="font-size:.72rem;color:#7d6849;">(${names.length} juc.)</span>
            <span style="font-family:'Bebas Neue',sans-serif;font-size:1rem;margin-left:auto;color:${isWinner?color:'#3a2f1f'};min-width:18px;text-align:right;">${g}${pen>0?` <span style="font-family:'Rajdhani',sans-serif;font-size:.62rem;color:#7d6849;">(pen ${pen})</span>`:''}</span>
        </div>`;
    };

    const teamsHTML = [
        makeTeamScore(h.orangePlayers, 'orange', teamColors.orange, 'Portocaliu'),
        makeTeamScore(h.greenPlayers,  'green',  teamColors.green,  'Verde'),
        hasBlack ? makeTeamScore(h.blackPlayers, 'black', '#555', 'Negru') : '',
    ].filter(Boolean).join('<div style="height:1px;background:#e3d3ac;margin:1px 0;"></div>');

    const hattrick = h.topScorer && h.topScorer.goals >= 3;
    const topScorerHTML = h.topScorer
        ? `<div style="margin-top:5px;padding:3px 8px;background:${hattrick?'rgba(156,39,176,.1)':'#fdf3df'};border-radius:6px;border:1px solid ${hattrick?'rgba(156,39,176,.35)':'#e3d3ac'};font-size:.72rem;color:#4a3a26;display:inline-flex;align-items:center;gap:5px;">
            ${hattrick?'🎩':'⚽'} <b>${h.topScorer.name}</b> ${h.topScorer.goals} gol${h.topScorer.goals!==1?'uri':''}${hattrick?' <span style="color:#8e3a9e;font-weight:700;">HATTRICK!</span>':''}
           </div>`
        : '';

    return { teamsHTML, topScorerHTML, hattrick };
}

// ── Card de sesiune: mai multe perechi (Portocaliu vs Verde, Verde vs Negru, ...)
// din același meci de 3 echipe, agregate cu golgheter total, MVP, hattrick-uri și
// "povestea" în ordine cronologică. ──
function renderSessionRow(rows, admin){
    // Cronologic: cel mai vechi rând primul (rows vine în ordine descrescătoare)
    const chrono = [...rows].reverse();
    const first = chrono[0];
    const origIdxFirst = db.history.indexOf(first);

    // Golgheter + MVP total pe sesiune (sumă peste toate perechile, EXCLUZÂND penalty)
    const totalGoals = {};
    chrono.forEach(h => {
        Object.entries(h.playerGoals||{}).forEach(([n,g]) => { totalGoals[n]=(totalGoals[n]||0)+g; });
    });

    // Minute jucate per jucător, cumulate pe toată sesiunea — suma duratelor turelor
    // (roundsDetail[].duration_sec) din FIECARE pereche în care a fost pe teren.
    // Un jucător care a jucat mult mai multe minute e mai valoros la MVP, la goluri
    // egale sau apropiate, decât unul care a marcat similar dar a stat mult pe bancă.
    const totalSeconds = {};
    chrono.forEach(h => {
        const rowSeconds = (h.roundsDetail||[]).reduce((s,r)=>s+(r.duration_sec||0),0);
        const playersInRow = new Set([...(h.orangePlayers||[]), ...(h.greenPlayers||[])]);
        playersInRow.forEach(n => { totalSeconds[n] = (totalSeconds[n]||0) + rowSeconds; });
    });

    // Scor compus: goluri + bonus proporțional cu minutele jucate (90 min jucate =
    // echivalentul unui gol în plus). Golurile rămân factorul principal — bonusul de
    // minute contează mai ales la goluri egale sau apropiate, nu răstoarnă un
    // decalaj mare de goluri.
    const allNames = new Set([...Object.keys(totalGoals), ...Object.keys(totalSeconds)]);
    const mvpCandidates = [...allNames].map(name => {
        const goals = totalGoals[name] || 0;
        const minutes = Math.round((totalSeconds[name]||0) / 60);
        const score = goals + minutes / 90;
        return { name, goals, minutes, score };
    }).sort((a,b) => b.score - a.score);
    const sessionTop = mvpCandidates[0] || null;

    // Penalty — cel mai bun marcator la penalty pe toată sesiunea (separat, informativ)
    const totalPenGoals = {};
    chrono.forEach(h => {
        Object.entries(h.playerPenaltyGoals||{}).forEach(([n,g]) => { totalPenGoals[n]=(totalPenGoals[n]||0)+g; });
    });
    const totalPenSorted = Object.entries(totalPenGoals).sort((a,b)=>b[1]-a[1]);
    const sessionPenTop = totalPenSorted[0] ? {name:totalPenSorted[0][0], goals:totalPenSorted[0][1]} : null;

    // Hattrick-uri — orice jucător cu ≥3 goluri într-o SINGURĂ poveste de pereche
    const hattricks = [];
    chrono.forEach(h => {
        if (h.topScorer && h.topScorer.goals >= 3) {
            hattricks.push({ name: h.topScorer.name, goals: h.topScorer.goals, teams: getRowTeamNames(h) });
        }
    });

    // Bilanț per echipă în sesiune: victorii / meciuri jucate în cadrul sesiunii
    const teamPlayed = {}, teamWon = {};
    chrono.forEach(h => {
        getRowTeamNames(h).forEach(t => { teamPlayed[t]=(teamPlayed[t]||0)+1; });
        if (h.winner) teamWon[h.winner]=(teamWon[h.winner]||0)+1;
    });
    const standingColor = { Portocaliu: teamColors.orange, Verde: teamColors.green, Negru: '#555' };
    const standingHTML = Object.keys(teamPlayed).map(t =>
        `<span style="color:${standingColor[t]||'#3a2f1f'};font-weight:700;">${t}</span> <span style="color:#7d6849;">${teamWon[t]||0}/${teamPlayed[t]}</span>`
    ).join('<span style="color:#c9b587;margin:0 6px;">·</span>');

    // Poveste cronologică: "Portocaliu vs Verde → Verde vs Negru → ..."
    const storyHTML = chrono.map((h,idx) => {
        const [tA,tB] = getRowTeamNames(h);
        return `<span style="white-space:nowrap;">${idx===0?'<b>Start:</b> ':'→ '}${tA||'?'} vs ${tB||'?'} <span style="color:#7d6849;">(${h.score||'—'}, câștigă ${h.winner||'—'})</span></span>`;
    }).join(' ');

    // Sub-secțiuni pentru fiecare pereche, în ordine cronologică
    const pairSections = chrono.map((h) => {
        const origIdx = db.history.indexOf(h);
        const { teamsHTML, topScorerHTML } = renderPairBody(h);
        const [tA,tB] = getRowTeamNames(h);
        const editBtns = admin ? `<button class="match-edit-btn" onclick="event.stopPropagation();openMatchEditor(${origIdx})" title="Editează">✏️</button>
            <button class="match-edit-btn" onclick="event.stopPropagation();confirmDeleteMatch(${origIdx})" title="Șterge" style="color:#c62828;">🗑️</button>` : '';
        return `<div onclick="openMatchModal(${origIdx})" style="cursor:pointer;background:#fffaf0;border-radius:8px;padding:8px 10px;border:1px solid #e3d3ac;margin-bottom:6px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
                <span style="font-size:.68rem;color:#7d6849;font-weight:700;text-transform:uppercase;letter-spacing:.4px;">${tA||'?'} vs ${tB||'?'} <span style="font-weight:400;text-transform:none;">· ture ${h.score||'—'}</span></span>
                <span onclick="event.stopPropagation()">${editBtns}</span>
            </div>
            ${teamsHTML}
            ${topScorerHTML}
        </div>`;
    }).join('');

    return `<tr>
        <td colspan="3" style="padding:10px 4px;">
            <div style="background:linear-gradient(135deg,#fdf3df,#f5e9d4);border:1px solid #dcc89a;border-radius:12px;padding:12px 14px;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:1px;color:#7d6849;">🎮 SESIUNE 3 ECHIPE</span>
                        <span style="font-weight:700;font-size:.82rem;color:#3a2f1f;">${first.date||'—'}</span>
                    </div>
                    <span style="font-size:.68rem;color:#7d6849;">${chrono.length} meciuri jucate</span>
                </div>

                <div style="font-size:.68rem;margin-bottom:8px;">${standingHTML}</div>

                <div style="font-size:.72rem;color:#4a3a26;margin-bottom:10px;line-height:1.6;">${storyHTML}</div>

                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
                    ${sessionTop ? `<div style="padding:4px 10px;background:rgba(27,122,67,.1);border:1px solid rgba(27,122,67,.3);border-radius:7px;font-size:.72rem;color:#1b7a43;font-weight:700;">⭐ MVP sesiune: ${sessionTop.name} (${sessionTop.goals} goluri · ${sessionTop.minutes} min)</div>` : ''}
                    ${sessionPenTop ? `<div style="padding:4px 10px;background:rgba(125,104,73,.1);border:1px solid rgba(125,104,73,.3);border-radius:7px;font-size:.72rem;color:#7d6849;font-weight:700;">🥅 Penalty: ${sessionPenTop.name} (${sessionPenTop.goals})</div>` : ''}
                    ${hattricks.map(ht => `<div style="padding:4px 10px;background:rgba(156,39,176,.1);border:1px solid rgba(156,39,176,.3);border-radius:7px;font-size:.72rem;color:#8e3a9e;font-weight:700;">🎩 Hattrick: ${ht.name} (${ht.goals}, ${ht.teams.join(' vs ')})</div>`).join('')}
                </div>

                ${pairSections}
            </div>
        </td>
    </tr>`;
}

// Elimină diacriticele ca să caute "Stefan" -> "Ștefan", "Barbu" -> "Bărbu" etc.
function normalizeSearchStr(s){
    return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}
function filterLobbySearch(value){
    lobbySearchQuery = value;
    const clearBtn = document.getElementById('lobbySearchClear');
    if(clearBtn) clearBtn.style.display = value ? 'block' : 'none';
    renderLobby();
}
function clearLobbySearch(){
    lobbySearchQuery = '';
    const input = document.getElementById('lobbySearch');
    if(input){ input.value = ''; input.focus(); }
    const clearBtn = document.getElementById('lobbySearchClear');
    if(clearBtn) clearBtn.style.display = 'none';
    renderLobby();
}

function renderLobby(){
    const nm=db.nextMatch;
    const dtEl=document.getElementById('lobbyDatetime');
    const bd = document.getElementById('matchBannerDate');

    // Check if next match date+time is actually in the past
    const matchIsPast = nm.date && (() => {
        const dt = new Date(nm.date + 'T' + (nm.time || '23:59'));
        return dt < new Date();
    })();

    if(nm.date && !matchIsPast){
        const d=new Date(nm.date+'T'+(nm.time||'00:00'));
        let str=d.toLocaleDateString('ro-RO',{weekday:'short',day:'numeric',month:'short'});
        if(nm.time)str+=' · '+nm.time;
        if(nm.location)str+=' · '+nm.location;
        dtEl.textContent=str;dtEl.className='lobby-datetime';
        if(bd) bd.textContent='📅 ' + str;
    }else{
        dtEl.textContent='Niciun meci programat';dtEl.className='lobby-datetime no-date';
        if(bd) bd.textContent='';
    }

    const container=document.getElementById('lobbyPlayers');container.innerHTML='';
    // Prezență recentă — ultimele N meciuri (db.history e deja sortat, cel mai recent primul)
    const RECENT_WINDOW = 6;
    const recentMatches = db.history.slice(0, RECENT_WINDOW);
    const recentTotal = recentMatches.length;
    const showStats = recentTotal >= 3; // sub 3 meciuri recente, procentul e prea zgomotos
    const playedIn = (p,h) => (h.orangePlayers||[]).includes(p.name) || (h.greenPlayers||[]).includes(p.name) || (h.blackPlayers||[]).includes(p.name);
    const withRate = db.players.map(p=>{
        const recentCount = recentMatches.filter(h=>playedIn(p,h)).length;
        const rate = recentTotal>0 ? recentCount/recentTotal : 0;
        return {p, rate, recentCount};
    });
    // A. Sortare după cât de recent/des a jucat (ultimele meciuri), apoi alfabetic
    let sortedPlayers = withRate
        .sort((a,b)=> b.recentCount-a.recentCount || (b.p.games||0)-(a.p.games||0) || a.p.name.localeCompare(b.p.name,'ro'));

    // Filtrare după căutare (fără diacritice, insensibil la majuscule)
    const searchQ = normalizeSearchStr(lobbySearchQuery.trim());
    if (searchQ) {
        sortedPlayers = sortedPlayers.filter(({p}) => normalizeSearchStr(p.name).includes(searchQ));
    }

    if (searchQ && !sortedPlayers.length) {
        container.innerHTML = `<div style="width:100%;text-align:center;padding:14px 0;font-size:.78rem;color:#7d6849;">Niciun jucător găsit pentru „${lobbySearchQuery.trim()}".</div>`;
    }

    let dividerShown = false;
    sortedPlayers.forEach(({p,rate,recentCount})=>{
        // E. Separator vizual între „nucleul dur" (≥70% din meciurile recente) și restul
        // (sărit peste când e activă o căutare — n-are sens cu o listă deja filtrată)
        if(!searchQ && showStats && !dividerShown && rate < 0.7 && sortedPlayers.some(x=>x.rate>=0.7)){
            const divider=document.createElement('div');
            divider.style.cssText='width:100%;display:flex;align-items:center;gap:8px;margin:4px 0 2px;';
            divider.innerHTML = `<div style="flex:1;height:1px;background:#dcc89a;"></div><span style="font-size:.62rem;color:#9a8663;white-space:nowrap;">restul grupului</span><div style="flex:1;height:1px;background:#dcc89a;"></div>`;
            container.appendChild(divider);
            dividerShown = true;
        }
        const confirmed = nm.confirmedIds.includes(p.id);
        const absent    = nm.absentIds?.includes(p.id);
        const chip=document.createElement('div');
        let chipClass = 'lobby-player-chip';
        let dotHtml = '<div class="chip-dot"></div>';
        let nameHtml = `<span class="chip-name">${p.name}</span>`;
        if(confirmed){
            chipClass += ' confirmed';
            dotHtml = '<div class="chip-dot"></div>';
        } else if(absent){
            chipClass += ' absent';
            dotHtml = '<span style="font-size:0.75rem;line-height:1;">✕</span>';
        }
        chip.className = chipClass;
        // C. Badge de regularitate — câte din ultimele meciuri a jucat
        const rateBadge = showStats
            ? `<span title="${recentCount}/${recentTotal} din ultimele meciuri" style="font-size:.6rem;color:${rate>=0.7?'#1b7a43':rate>=0.4?'#9c4f00':'#b71c1c'};margin-left:3px;">${recentCount}/${recentTotal}</span>`
            : '';
        chip.innerHTML = dotHtml + nameHtml + `<span style="font-size:0.68rem;color:${confirmed?'#5c8aff':absent?'#c62828':'#333'};margin-left:2px;">${getGeneralAvg(p).toFixed(1)}</span>` + rateBadge;
        // Admin can toggle anyone; players can only toggle themselves
        chip.onclick = () => toggleLobbyPresence(p.id);
        container.appendChild(chip);
    });

    const cnt = nm.confirmedIds.length;
    const absCnt = nm.absentIds?.length || 0;
    const pending = db.players.length - cnt - absCnt;
    let countText = '';
    if(cnt > 0) countText += `✅ ${cnt} prezenți`;
    if(absCnt > 0) countText += (countText?' · ':'') + `❌ ${absCnt} absenți`;
    if(pending > 0) countText += (countText?' · ':'') + `⏳ ${pending} fără răspuns`;
    document.getElementById('lobbyCount').textContent = countText || 'Nimeni nu a răspuns încă.';
}

async function toggleLobbyPresence(playerId){
    if(!isAdmin()){
        // Jucătorii nu pot schimba singuri din lobby — folosesc modalul de prezență
        showToast('⚠️ Folosește modalul de prezență la login!');
        return;
    }
    // Admin: ciclează prin stări: niciuna → prezent → absent → niciuna
    const ids = db.nextMatch.confirmedIds;
    const abs = db.nextMatch.absentIds || (db.nextMatch.absentIds=[]);
    const inConf = ids.indexOf(playerId);
    const inAbs  = abs.indexOf(playerId);

    if(inConf === -1 && inAbs === -1){
        // Niciuna → PREZENT → mută pe bench
        ids.push(playerId);
        const p = db.players.find(x=>x.id==playerId);
        if(p && p.status === 'active') { p.status='bench'; await dbUpdatePlayer(p); }
    } else if(inConf !== -1){
        // PREZENT → ABSENT → mută înapoi în active
        ids.splice(inConf,1);
        abs.push(playerId);
        const p = db.players.find(x=>x.id==playerId);
        if(p && p.status === 'bench') { p.status='active'; await dbUpdatePlayer(p); }
    } else {
        // ABSENT → niciuna
        abs.splice(inAbs,1);
    }

    renderLobby();
    render();
    try{ await dbSaveNextMatch(); }catch(e){ showToast('⚠️ '+e.message); }
}

function openScheduleModal(){
    const nm=db.nextMatch;
    document.getElementById('scheduleDate').value=nm.date||'';
    document.getElementById('scheduleTime').value=nm.time||'';
    document.getElementById('scheduleLocation').value=nm.location||'';
    document.getElementById('scheduleOverlay').style.display='flex';
}
function closeScheduleModal(){document.getElementById('scheduleOverlay').style.display='none';}
async function saveSchedule(){
    db.nextMatch.date=document.getElementById('scheduleDate').value||null;
    db.nextMatch.time=document.getElementById('scheduleTime').value||null;
    db.nextMatch.location=document.getElementById('scheduleLocation').value.trim()||null;
    renderLobby();closeScheduleModal();
    try{
        await dbSaveNextMatch();
        showToast('📅 Meci programat!');
        // Send push notifications to all subscribers
        await sendPushToAll({
            title:'⚽ Meci programat!',
            body:`${db.nextMatch.date||''}${db.nextMatch.time?' · '+db.nextMatch.time:''}${db.nextMatch.location?' · '+db.nextMatch.location:''}`,
            url: window.location.origin
        });
    }catch(e){showToast('⚠️ '+e.message);}
}
async function clearSchedule(){
    db.nextMatch={date:null,time:null,location:null,confirmedIds:[],absentIds:[]};
    renderLobby();closeScheduleModal();
    try{await dbSaveNextMatch();showToast('🗑️ Meci șters.');}catch(e){showToast('⚠️ '+e.message);}
}
function formTeamsFromLobby(){
    const confirmed = db.players.filter(p => db.nextMatch.confirmedIds.includes(p.id));
    if(confirmed.length < 2){ showToast('⚠️ Minim 2 jucători confirmați!'); return; }
    db.players.forEach(p => {
        if(p.status === 'orange' || p.status === 'green') p.status = 'bench';
    });
    // ── EGALITATE NUMĂR JUCĂTORI — prioritate maximă ───────────────
    const sorted = [...confirmed].sort((a,b) => getSmartRating(b) - getSmartRating(a));
    const maxSize = Math.ceil(sorted.length / 2);
    const oArr = [], gArr = [];
    let oSum = 0, gSum = 0;
    sorted.forEach(p => {
        const r = getSmartRating(p);
        const oFull = oArr.length >= maxSize;
        const gFull = gArr.length >= maxSize;
        if      (oFull)        { p.status='green';  gArr.push(p); gSum+=r; }
        else if (gFull)        { p.status='orange'; oArr.push(p); oSum+=r; }
        else if (oSum <= gSum) { p.status='orange'; oArr.push(p); oSum+=r; }
        else                   { p.status='green';  gArr.push(p); gSum+=r; }
    });
    render();
    Promise.all(db.players.filter(p=>['orange','green'].includes(p.status)).map(p=>dbUpdatePlayer(p)))
        .catch(e => showToast('⚠️ '+e.message));
    showToast(`⚡ Echipe formate: ${oArr.length} vs ${gArr.length} jucători!`);
}

function addNewPlayer(){
    const name=prompt('Numele jucătorului nou:');if(!name||!name.trim())return;
    const newP={id:Date.now(),name:name.trim(),status:'active',wins:0,games:0,matchHistory:[],ratings:[{_dbId:null,rater:'Initial',date:today,general:5,viteza:5,tehnica:5,strategie:5,aparare:5}]};
    db.players.push(newP);render();
    dbUpdatePlayer(newP)
        .then(()=>sb.from('ratings').insert({player_id:newP.id,rater:'Initial',date:today,general:5,viteza:5,tehnica:5,strategie:5,aparare:5}))
        .catch(e=>showToast('⚠️ '+e.message));
    showToast(`✅ ${name.trim()} adăugat!`);
}

async function saveSeason(){
    if(!isAdmin()){ showToast('⚠️ Doar adminul poate face asta!'); return; }
    const suggested = 'Ianuarie - Iunie';
    const name = prompt('Numele sezonului care se arhivează:', suggested);
    if(name===null) return;
    const seasonName = name.trim();
    if(!seasonName){ showToast('⚠️ Numele sezonului nu poate fi gol.'); return; }
    showConfirm('💾', `Salvezi sezonul „${seasonName}"?`,
        'Meciurile curente vor fi arhivate sub acest nume, iar victoriile/golurile jucătorilor se resetează pentru un sezon nou. Meciurile NU se șterg din baza de date — le poți revedea oricând din „📂 Sezoane Anterioare". Ratingurile jucătorilor rămân neschimbate.',
        '💾 Salvează Sezon', '#1b5e20', async () => {
        try{
            const { error: upErr } = await sb.from('match_history').update({season: seasonName}).is('season', null);
            if(upErr) throw new Error('Ai rulat migrarea SQL pentru coloana "season"? Detalii: ' + upErr.message);
            db.players.forEach(p=>{p.wins=0;p.games=0;p.matchHistory=[];p.totalGoals=0;p.totalGoalsConceded=0;p.totalPenaltyGoals=0;});
            await Promise.all(db.players.map(p=>dbUpdatePlayer(p)));
            try{ await sb.from('players').update({total_penalty_goals:0}).neq('id',0); }catch(_){ /* coloana nu există încă — vezi nota de migrare */ }
            db.history = [];
            db.nextMatch.confirmedIds=[]; db.nextMatch.absentIds=[];
            await dbSaveNextMatch();
            render();
            showToast(`✅ Sezon „${seasonName}" salvat! Sezon nou început.`);
        }catch(e){ showToast('⚠️ '+e.message); }
    });
}

async function viewSeasons(){
    try{
        const { data, error } = await sb.from('match_history').select('season').not('season','is',null);
        if(error) throw new Error('Ai rulat migrarea SQL pentru coloana "season"? Detalii: ' + error.message);
        const names = [...new Set((data||[]).map(r=>r.season).filter(Boolean))];
        if(!names.length){ showToast('📂 Nu există sezoane arhivate încă.'); return; }
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
        overlay.onclick = (e)=>{ if(e.target===overlay) overlay.remove(); };
        overlay.innerHTML = `<div style="background:#f5e9d4;border-radius:14px;padding:20px;max-width:360px;width:100%;max-height:80vh;overflow:auto;">
            <h3 style="margin:0 0 12px;font-family:'Bebas Neue',sans-serif;letter-spacing:2px;color:#7d6849;">📂 Sezoane Anterioare</h3>
            <div style="display:flex;flex-direction:column;gap:8px;">
                ${names.map(n=>`<div style="display:flex;gap:6px;">
                    <button data-season="${n.replace(/"/g,'&quot;')}" style="flex:1;text-align:left;padding:11px 14px;border-radius:9px;background:#fffaf0;border:1px solid #dcc89a;color:#3a2f1f;font-weight:700;font-size:.9rem;cursor:pointer;">🗓️ ${n}</button>
                    <button data-rename="${n.replace(/"/g,'&quot;')}" title="Redenumește sezonul" style="width:40px;flex-shrink:0;border-radius:9px;background:#fdf3df;border:1px solid #dcc89a;color:#7d6849;cursor:pointer;font-size:.9rem;">✏️</button>
                </div>`).join('')}
            </div>
            <button id="seasonListCloseBtn" style="margin-top:14px;width:100%;padding:10px;border-radius:9px;background:rgba(198,40,40,.1);border:1px solid #c62828;color:#b71c1c;font-weight:700;cursor:pointer;">Închide</button>
        </div>`;
        overlay.querySelectorAll('button[data-season]').forEach(btn=>{
            btn.onclick = ()=>{ overlay.remove(); openSeasonArchive(btn.dataset.season); };
        });
        overlay.querySelectorAll('button[data-rename]').forEach(btn=>{
            btn.onclick = (e)=>{ e.stopPropagation(); renameSeason(btn.dataset.rename, names, overlay); };
        });
        overlay.querySelector('#seasonListCloseBtn').onclick = ()=>overlay.remove();
        document.body.appendChild(overlay);
    }catch(e){ showToast('⚠️ '+e.message); }
}

async function renameSeason(oldName, existingNames, overlay){
    if(!isAdmin()){ showToast('⚠️ Doar adminul poate face asta!'); return; }
    const newName = prompt('Nume nou pentru sezonul „'+oldName+'":', oldName);
    if(newName===null) return;
    const trimmed = newName.trim();
    if(!trimmed){ showToast('⚠️ Numele sezonului nu poate fi gol.'); return; }
    if(trimmed === oldName){ return; }
    if((existingNames||[]).includes(trimmed)){ showToast('⚠️ Există deja un sezon cu acest nume!'); return; }
    try{
        const { error } = await sb.from('match_history').update({season: trimmed}).eq('season', oldName);
        if(error) throw error;
        showToast(`✅ Sezon redenumit: „${oldName}" → „${trimmed}"`);
        if(overlay) overlay.remove();
        viewSeasons();
    }catch(e){ showToast('⚠️ '+e.message); }
}

async function openSeasonArchive(seasonName){
    try{
        const { data: rows, error } = await sb.from('match_history').select('*').eq('season', seasonName).order('created_at', { ascending: false });
        if(error) throw error;
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
        overlay.onclick = (e)=>{ if(e.target===overlay) overlay.remove(); };
        const rowsHtml = (rows||[]).map(h => `<div style="padding:10px 12px;background:#fffaf0;border:1px solid #dcc89a;border-radius:9px;">
                <div style="font-size:.72rem;color:#9a8663;">${h.date||''}</div>
                <div style="font-weight:700;color:#3a2f1f;">${h.score||''} ${h.winner?`— câștigă ${h.winner}`:''}</div>
            </div>`).join('') || '<div style="color:#7d6849;">Niciun meci găsit.</div>';
        overlay.innerHTML = `<div style="background:#f5e9d4;border-radius:14px;padding:20px;max-width:420px;width:100%;max-height:80vh;overflow:auto;">
            <h3 style="margin:0 0 12px;font-family:'Bebas Neue',sans-serif;letter-spacing:2px;color:#7d6849;">🗓️ ${seasonName} <span style="font-size:.7rem;color:#9a8663;font-family:inherit;letter-spacing:0;">(${(rows||[]).length} meciuri)</span></h3>
            <div style="display:flex;flex-direction:column;gap:8px;">${rowsHtml}</div>
            <button id="seasonArchiveCloseBtn" style="margin-top:14px;width:100%;padding:10px;border-radius:9px;background:rgba(198,40,40,.1);border:1px solid #c62828;color:#b71c1c;font-weight:700;cursor:pointer;">Închide</button>
        </div>`;
        overlay.querySelector('#seasonArchiveCloseBtn').onclick = ()=>overlay.remove();
        document.body.appendChild(overlay);
    }catch(e){ showToast('⚠️ '+e.message); }
}

async function resetSeason(){
    showConfirm('↺','Reset Sezon','Victoriile și istoricul se șterg. Ratingurile rămân.','Reset','#c62828',async()=>{
        db.players.forEach(p=>{p.wins=0;p.games=0;p.matchHistory=[];});
        db.history=[];db.nextMatch.confirmedIds=[];db.nextMatch.absentIds=[];render();
        try{
            await Promise.all(db.players.map(p=>dbUpdatePlayer(p)));
            await sb.from('match_history').delete().neq('id','00000000-0000-0000-0000-000000000000');
            await dbSaveNextMatch();
            showToast('↺ Sezon resetat!');
        }catch(e){showToast('⚠️ '+e.message);}
    });
}

async function resetAllGoals(){
    showConfirm('⚽','Resetezi toate golurile?',
        'Se șterg total_goals, total_goals_conceded din profilul tuturor jucătorilor și toate înregistrările din match_goals. Istoricul meciurilor rămâne.',
        '⚽ Resetează Goluri','#c62828',
        async()=>{
            try{
                // Reset player goal counters
                await sb.from('players').update({total_goals:0, total_goals_conceded:0}).neq('id',0);
                try{ await sb.from('players').update({total_penalty_goals:0}).neq('id',0); }catch(_){}
                // Delete all match_goals entries
                await sb.from('match_goals').delete().neq('id','00000000-0000-0000-0000-000000000000');
                // Also clear live_goals if any
                try{ await sb.from('live_goals').delete().neq('id','00000000-0000-0000-0000-000000000000'); }catch(_){}
                // Update local state
                db.players.forEach(p=>{ p.totalGoals=0; p.totalGoalsConceded=0; p.totalPenaltyGoals=0; });
                render();
                showToast('✅ Goluri resetate pentru toți jucătorii!');
            }catch(e){ showToast('⚠️ '+e.message); }
        }
    );
}

async function nukeAll(){
    showConfirm('💥','Șterge Tot?','TOATE datele din Supabase vor fi șterse definitiv.','Șterge Tot','#7b1010',async()=>{
        try{
            await sb.from('ratings').delete().neq('id','00000000-0000-0000-0000-000000000000');
            await sb.from('players').delete().neq('id',0);
            await sb.from('match_history').delete().neq('id','00000000-0000-0000-0000-000000000000');
            await sb.from('next_match').upsert({id:1,match_date:null,match_time:null,location:null,confirmed_ids:[],absent_ids:[]});
            localStorage.removeItem('fb_club_v6');
            location.reload();
        }catch(e){showToast('⚠️ '+e.message);}
    });
}

function copyTeams(){
    document.getElementById('balancePopup').classList.remove('show');

    const oP = db.players.filter(p=>p.status==='orange');
    const gP = db.players.filter(p=>p.status==='green');

    if (!oP.length && !gP.length) { showToast('⚠️ Nu există jucători în echipe!'); return; }

    // Sort each team by rating descending
    const sortBySmart   = (a,b) => getSmartRating(b)   - getSmartRating(a);
    const sortByGeneral = (a,b) => getGeneralAvg(b)     - getGeneralAvg(a);

    // Win chance calculation
    const oSmartAvg = oP.length ? oP.reduce((s,p)=>s+getSmartRating(p),0)/oP.length : 0;
    const gSmartAvg = gP.length ? gP.reduce((s,p)=>s+getSmartRating(p),0)/gP.length : 0;
    const oGenAvg   = oP.length ? oP.reduce((s,p)=>s+getGeneralAvg(p),0)/oP.length   : 0;
    const gGenAvg   = gP.length ? gP.reduce((s,p)=>s+getGeneralAvg(p),0)/gP.length   : 0;

    const totalSmart = oSmartAvg + gSmartAvg || 1;
    const totalGen   = oGenAvg   + gGenAvg   || 1;
    const oChanceSmart   = Math.round(oSmartAvg/totalSmart*100);
    const gChanceSmart   = 100 - oChanceSmart;
    const oChanceGeneral = Math.round(oGenAvg/totalGen*100);
    const gChanceGeneral = 100 - oChanceGeneral;

    // Format player line with rating
    const fmtSmart   = (p,i) => `  ${i+1}. ${p.name} (★${getSmartRating(p).toFixed(1)})`;
    const fmtGeneral = (p,i) => `  ${i+1}. ${p.name} (⭐${getGeneralAvg(p).toFixed(1)})`;

    const oSmart = [...oP].sort(sortBySmart);
    const gSmart = [...gP].sort(sortBySmart);
    const oGen   = [...oP].sort(sortByGeneral);
    const gGen   = [...gP].sort(sortByGeneral);

    const today = new Date().toLocaleDateString('ro-RO', {day:'numeric',month:'long',year:'numeric'});

    const text = [
        `⚽ ECHIPE ${today}`,
        '',
        `━━━ V1 — Smart Rating ━━━`,
        `${teamNames.orange} (★${oSmartAvg.toFixed(1)}) — ${oChanceSmart}% șanse câștig`,
        oSmart.map(fmtSmart).join('\n'),
        '',
        `${teamNames.green} (★${gSmartAvg.toFixed(1)}) — ${gChanceSmart}% șanse câștig`,
        gSmart.map(fmtSmart).join('\n'),
        '',
        `━━━ V2 — Rating General ━━━`,
        `${teamNames.orange} (⭐${oGenAvg.toFixed(1)}) — ${oChanceGeneral}% șanse câștig`,
        oGen.map(fmtGeneral).join('\n'),
        '',
        `${teamNames.green} (⭐${gGenAvg.toFixed(1)}) — ${gChanceGeneral}% șanse câștig`,
        gGen.map(fmtGeneral).join('\n'),
        '',
        `📱 Arena Friends FC`
    ].join('\n');

    navigator.clipboard?.writeText(text)
        .then(()=>showToast('📋 Echipe copiate cu rating și șanse!'))
        .catch(()=>showToast('❌ Eroare clipboard'));
}

function adminAllowDrop(e){ if(isAdmin()) e.preventDefault(); }
async function adminDrop(e){
    if(!isAdmin()) return;
    if(window._isLive){showToast("⚠️ Meciul e live — echipele sunt blocate!");return;}
    e.preventDefault();
    const id=e.dataTransfer.getData("text");
    let target=e.target;
    while(target && !target.id.startsWith('col-')) target=target.parentElement;
    if(target){
        const tId=target.id.replace('col-','');
        if(['orange','green','bench','active'].includes(tId)){
            const p=db.players.find(x=>x.id==id);
            p.status=tId;
            render();
            await dbUpdatePlayer(p).catch(err=>showToast('⚠️ '+err.message));
        }
    }
}


// ── Editable team names ───────────────────────────────────────────
function renderTeamTitles(){
    const tO=document.getElementById('titleOrange');
    const tG=document.getElementById('titleGreen');
    const tB=document.getElementById('titleBench');
    if(tO) tO.textContent=teamNames.orange;
    if(tG) tG.textContent=teamNames.green;
    if(tB) tB.textContent=threeTeamMode ? teamNames.bench : 'Bancă'; // always update
    document.querySelectorAll('.me-team-header').forEach((el,i)=>{
        if(i===0){ el.textContent=teamNames.orange; el.style.color=teamColors.orange; }
        if(i===1){ el.textContent=teamNames.green;  el.style.color=teamColors.green;  }
    });
    const swapLblO = document.getElementById('swapLblOrange');
    const swapLblG = document.getElementById('swapLblGreen');
    if (swapLblO) swapLblO.textContent = teamNames.orange + ' ↔ ' + (teamNames.bench||'Bancă');
    if (swapLblG) swapLblG.textContent = teamNames.green  + ' ↔ ' + (teamNames.bench||'Bancă');
    applyTeamColors();
    updateAllTeamLabels();
}

function updateAllTeamLabels() {
    const o = teamNames.orange, g = teamNames.green;
    const oH = teamColors.orange, gH = teamColors.green;

    // Score display labels (goal tracking area)
    const sLblO = document.querySelector('#goalScoreO')?.previousElementSibling;
    const sLblG = document.querySelector('#goalScoreG')?.previousElementSibling;
    if (sLblO) { sLblO.textContent = o; sLblO.style.color = oH; }
    if (sLblG) { sLblG.textContent = g; sLblG.style.color = gH; }
    const gSO = document.getElementById('goalScoreO');
    const gSG = document.getElementById('goalScoreG');
    if (gSO) gSO.style.color = oH;
    if (gSG) gSG.style.color = gH;

    // Captain labels
    document.querySelectorAll('[data-team-label-o]').forEach(el => { el.textContent = 'Căpitan ' + o; el.style.color = oH; });
    document.querySelectorAll('[data-team-label-g]').forEach(el => { el.textContent = 'Căpitan ' + g; el.style.color = gH; });

    // Match editor win buttons
    const meWinO = document.getElementById('meWinO');
    const meWinG = document.getElementById('meWinG');
    if (meWinO) meWinO.textContent = o;
    if (meWinG) meWinG.textContent = g;

    // Match editor score labels
    const meScoreLbls = document.querySelectorAll('.me-score-lbl');
    if (meScoreLbls[0]) { meScoreLbls[0].textContent = o; meScoreLbls[0].style.color = oH; }
    if (meScoreLbls[1]) { meScoreLbls[1].textContent = g; meScoreLbls[1].style.color = gH; }

    // Live score / match title bars
    const mOT = document.getElementById('matchOrangeTitle');
    const mGT = document.getElementById('matchGreenTitle');
    if (mOT) { mOT.textContent = o; mOT.style.color = oH; }
    if (mGT) { mGT.textContent = g; mGT.style.color = gH; }
    const mOT2 = document.getElementById('matchOrangeTitle2');
    const mGT2 = document.getElementById('matchGreenTitle2');
    if (mOT2) mOT2.textContent = o;
    if (mGT2) mGT2.textContent = g;

    // Export/snapshot team headers in modals
    document.querySelectorAll('.snap-team-o').forEach(el => { el.textContent = o; el.style.color = oH; });
    document.querySelectorAll('.snap-team-g').forEach(el => { el.textContent = g; el.style.color = gH; });
}

function startEditTeamName(side){
    // Numele echipelor sunt FIXE — PORTOCALIU/VERDE/NEGRU — nu se editează
    showToast('ℹ️ Numele echipelor sunt standardizate: ' + teamNames[side]);
}

// ── Export teams as copyable text ─────────────────────────────────
function exportTeamsText(){
    document.getElementById('balancePopup').classList.remove('show');
    const orange = db.players.filter(p=>p.status==='orange');
    const green  = db.players.filter(p=>p.status==='green');
    if(!orange.length && !green.length){ showToast('⚠️ Nicio echipă formată!'); return; }

    const fmtEmoji = (players) => players
        .sort((a,b)=>getSmartRating(b)-getSmartRating(a))
        .map(p=>{
            const role = getPlayerPrimaryPos(p)?POSITIONS[getPlayerPrimaryPos(p)].emoji+' ':' ';
            return '  '+role+p.name;
        }).join('\n');

    const fmtRaw = (players) => players
        .sort((a,b)=>getSmartRating(b)-getSmartRating(a))
        .map(p => '  '+p.name)
        .join('\n');

    const bench3 = threeTeamMode ? db.players.filter(p=>p.status==='bench') : [];

    const textEmoji =
        '🟠 '+teamNames.orange+' ('+orange.length+')'+'\n'+
        fmtEmoji(orange)+
        '\n\nvs\n\n'+
        '🟢 '+teamNames.green+' ('+green.length+')'+'\n'+
        fmtEmoji(green)+
        (bench3.length ? '\n\n⏳ '+(teamNames.bench||'Echipa 3')+' ('+bench3.length+')\n'+fmtEmoji(bench3) : '');

    const textRaw =
        teamNames.orange.toUpperCase()+' ('+orange.length+')'+'\n'+
        fmtRaw(orange)+
        '\n\nvs\n\n'+
        teamNames.green.toUpperCase()+' ('+green.length+')'+'\n'+
        fmtRaw(green)+
        (bench3.length ? '\n\nvs\n\n'+(teamNames.bench||'ECHIPA 3').toUpperCase()+' ('+bench3.length+')\n'+fmtRaw(bench3) : '');

    window._exportRaw = textRaw;
    const overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:300;display:flex;align-items:flex-end;justify-content:center;';
    overlay.innerHTML=`<div style="background:#fff8ed;width:100%;max-width:480px;border-radius:16px 16px 0 0;border:1px solid #d3bd8c;border-bottom:none;padding:18px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:2px;margin-bottom:12px;">📋 Exportă Echipe</div>
        <pre id="exportPreview" style="background:#f5e9d4;border:1px solid var(--border);border-radius:8px;padding:12px;font-family:'Rajdhani',sans-serif;font-size:.85rem;line-height:1.6;white-space:pre-wrap;word-break:break-word;margin-bottom:12px;">${textEmoji}</pre>
        <div style="display:flex;gap:6px;">
            <button onclick="this.closest('div[style*=fixed]').remove()" style="padding:10px 12px;border-radius:9px;background:#fdf3df;border:1px solid #d3bd8c;color:#7d6849;cursor:pointer;font-size:.78rem;">✕</button>
            <button id="exportBtnEmoji" onclick="navigator.clipboard.writeText(document.getElementById('exportPreview').textContent).then(()=>{this.textContent='✅ Copiat!';setTimeout(()=>this.textContent='📋 Cu Emoji',1500);})" style="flex:1;padding:10px;border-radius:9px;font-family:'Bebas Neue',sans-serif;font-size:.9rem;letter-spacing:1.5px;cursor:pointer;background:linear-gradient(135deg,#dff3df,var(--green));border:1px solid var(--green);color:#3a2f1f;">📋 Cu Emoji</button>
            <button onclick="navigator.clipboard.writeText(window._exportRaw||'').then(()=>{this.textContent='✅ Copiat!';setTimeout(()=>this.textContent='📄 RAW',1500);})" style="flex:1;padding:10px;border-radius:9px;font-family:'Bebas Neue',sans-serif;font-size:.9rem;letter-spacing:1.5px;cursor:pointer;background:linear-gradient(135deg,#dde9ff,var(--accent));border:1px solid var(--accent);color:#3a2f1f;">📄 RAW</button>
        </div>
    </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove();});
}

function exportTeamsTable() {
    document.getElementById('balancePopup').classList.remove('show');
    const orange = db.players.filter(p => p.status === 'orange').sort((a,b) => getSmartRating(b)-getSmartRating(a));
    const green  = db.players.filter(p => p.status === 'green').sort((a,b)  => getSmartRating(b)-getSmartRating(a));
    const bench3 = threeTeamMode ? db.players.filter(p => p.status === 'bench').sort((a,b) => getSmartRating(b)-getSmartRating(a)) : [];
    if (!orange.length && !green.length) { showToast('⚠️ Nicio echipă formată!'); return; }

    const fmtPlayer = (p) => {
        const role = getPlayerPrimaryPos(p) ? POSITIONS[getPlayerPrimaryPos(p)].emoji : '·';
        const rating = getSmartRating(p).toFixed(1);
        return `<tr>
            <td style="padding:5px 8px;font-weight:700;">${role} ${p.name}</td>
            <td style="padding:5px 8px;text-align:right;font-family:'Bebas Neue',sans-serif;font-size:.95rem;color:#7d6849;">${rating}★</td>
        </tr>`;
    };

    const colStyle = (hex) => `background:${hex}22;border-radius:10px;overflow:hidden;border:1px solid ${hex}44;`;
    const hdStyle  = (hex) => `background:${hex};color:${getContrastColorIdx(hex)};padding:8px 12px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;`;
    const avgO = orange.reduce((s,p)=>s+getSmartRating(p),0)/Math.max(orange.length,1);
    const avgG = green.reduce((s,p)=>s+getSmartRating(p),0)/Math.max(green.length,1);
    const avgB = bench3.length ? bench3.reduce((s,p)=>s+getSmartRating(p),0)/bench3.length : 0;

    const cols = threeTeamMode
        ? [`<td style="width:33%;vertical-align:top;padding:6px;">
               <div style="${colStyle(teamColors.orange)}">
                   <div style="${hdStyle(teamColors.orange)}">${teamNames.orange} (${orange.length})</div>
                   <table style="width:100%;border-collapse:collapse;">${orange.map(fmtPlayer).join('')}</table>
                   <div style="padding:4px 8px 6px;font-size:.62rem;color:#6b5840;text-align:right;">Avg ★${avgO.toFixed(2)}</div>
               </div></td>`,
           `<td style="width:33%;vertical-align:top;padding:6px;">
               <div style="${colStyle(teamColors.green)}">
                   <div style="${hdStyle(teamColors.green)}">${teamNames.green} (${green.length})</div>
                   <table style="width:100%;border-collapse:collapse;">${green.map(fmtPlayer).join('')}</table>
                   <div style="padding:4px 8px 6px;font-size:.62rem;color:#6b5840;text-align:right;">Avg ★${avgG.toFixed(2)}</div>
               </div></td>`,
           `<td style="width:33%;vertical-align:top;padding:6px;">
               <div style="${colStyle(teamColors.bench||'#111111')}">
                   <div style="${hdStyle(teamColors.bench||'#111111')}">${teamNames.bench||'Echipa 3'} (${bench3.length})</div>
                   <table style="width:100%;border-collapse:collapse;">${bench3.map(fmtPlayer).join('')}</table>
                   <div style="padding:4px 8px 6px;font-size:.62rem;color:#6b5840;text-align:right;">Avg ★${avgB.toFixed(2)}</div>
               </div></td>`].join('')
        : [`<td style="width:50%;vertical-align:top;padding:6px;">
               <div style="${colStyle(teamColors.orange)}">
                   <div style="${hdStyle(teamColors.orange)}">${teamNames.orange} (${orange.length})</div>
                   <table style="width:100%;border-collapse:collapse;">${orange.map(fmtPlayer).join('')}</table>
                   <div style="padding:4px 8px 6px;font-size:.62rem;color:#6b5840;text-align:right;">Avg ★${avgO.toFixed(2)}</div>
               </div></td>`,
           `<td style="width:50%;vertical-align:top;padding:6px;">
               <div style="${colStyle(teamColors.green)}">
                   <div style="${hdStyle(teamColors.green)}">${teamNames.green} (${green.length})</div>
                   <table style="width:100%;border-collapse:collapse;">${green.map(fmtPlayer).join('')}</table>
                   <div style="padding:4px 8px 6px;font-size:.62rem;color:#6b5840;text-align:right;">Avg ★${avgG.toFixed(2)}</div>
               </div></td>`].join('');

    const tableHtml = `<table style="width:100%;border-collapse:collapse;font-family:'Rajdhani',sans-serif;font-size:.82rem;color:#4a3c28;"><tr>${cols}</tr></table>`;

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:300;display:flex;align-items:center;justify-content:center;padding:12px;';
    overlay.innerHTML = `
        <div style="background:#fffaf0;width:100%;max-width:640px;border-radius:14px;border:1px solid #e3d3ac;overflow:hidden;max-height:90vh;display:flex;flex-direction:column;">
            <div style="padding:12px 16px;border-bottom:1px solid #e3d3ac;display:flex;align-items:center;justify-content:space-between;">
                <span style="font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;color:#3a2f1f;">📊 Tabelă Echipe</span>
                <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:1px solid #dcc89a;color:#7d6849;padding:4px 10px;border-radius:6px;cursor:pointer;">✕</button>
            </div>
            <div style="overflow-y:auto;padding:4px;">${tableHtml}</div>
        </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}
function openSettings(){
    buildPlayerEditList();
    if (isAdmin()) buildAccountsList();
    // Populate push player select
    const sel=document.getElementById('pushPlayerSelect');
    sel.innerHTML='<option value="">— Selectează —</option>';
    db.players.forEach(p=>{const o=document.createElement('option');o.value=p.name;o.textContent=p.name;if(p.name===pushPlayerName)o.selected=true;sel.appendChild(o);});
    document.getElementById('pushPlayerVal').textContent=pushPlayerName||'—';
    document.getElementById('pushStatusVal').textContent=Notification.permission==='granted'?'Activ':'Inactiv';
    document.getElementById('pushStatusVal').className='push-status-val '+(Notification.permission==='granted'?'active':'inactive');
    document.getElementById('settingsOverlay').style.display='flex';
}
function closeSettings(){document.getElementById('settingsOverlay').style.display='none';}
function switchSettingsTab(tab){
    const tabNames=['players','accounts','notifications','export','algorithm','tags','season'];
    document.querySelectorAll('.settings-tab').forEach((t,i)=>t.classList.toggle('active',tabNames[i]===tab));
    document.querySelectorAll('.settings-panel').forEach(p=>p.classList.remove('active'));
    document.getElementById('panel-'+tab)?.classList.add('active');
    if(tab==='accounts') buildAccountsList();
    if(tab==='algorithm') buildAlgorithmPanel();
    if(tab==='tags') buildTagsPanel();
}
function buildPlayerEditList(){
    const sorted=[...db.players].sort((a,b)=>getSmartRating(b)-getSmartRating(a));

    document.getElementById('playerEditList').innerHTML=sorted.map(p=>{
        const wr=p.games>0?((p.wins/p.games)*100).toFixed(0)+'%':'—';
        const smartReal = p.adminRating != null
            ? `<span style="color:var(--orange);font-weight:700;">⭐ ${p.adminRating.toFixed(1)} 👑</span>`
            : `⭐${getGeneralAvg(p).toFixed(1)} | ★${getSmartRating(p).toFixed(1)} ${wr}`;
        const hasOverride = p.adminRating != null;
        return `<div class="player-edit-row" style="flex-wrap:wrap;gap:4px;">
            <span class="player-edit-id">#${p.id}</span>
            <input class="player-edit-input" type="text" value="${p.name}" id="editname-${p.id}" onkeydown="if(event.key==='Enter')savePlayerName(${p.id})">
            <span class="player-edit-stats" style="font-size:.72rem;">${smartReal}</span>
            <button class="btn-save-name" onclick="savePlayerName(${p.id})">✓</button>
            <button class="btn-delete-player" onclick="deletePlayer(${p.id})">🗑️</button>
            <div style="width:100%;display:flex;gap:6px;padding-left:28px;flex-wrap:wrap;align-items:center;">
                <!-- Hard-set rating override -->
                <div style="display:flex;align-items:center;gap:5px;background:#fff7e8;border:1px solid ${hasOverride?'var(--orange)':'#e3d3ac'};border-radius:8px;padding:4px 8px;flex-shrink:0;">
                    <span style="font-size:.6rem;color:${hasOverride?'var(--orange)':'#444'};text-transform:uppercase;letter-spacing:1px;white-space:nowrap;">
                        ${hasOverride?'👑 Rating forțat':'★ Override'}
                    </span>
                    <input type="number" id="ar-${p.id}" min="1" max="10" step="0.1"
                        value="${p.adminRating != null ? p.adminRating.toFixed(1) : ''}"
                        placeholder="—"
                        style="width:44px;background:transparent;border:none;color:${hasOverride?'var(--orange)':'#7d6849'};font-family:'Bebas Neue',sans-serif;font-size:.95rem;text-align:center;outline:none;"
                        oninput="saveAdminRating(${p.id})">
                    ${hasOverride?`<button onclick="clearAdminRating(${p.id})" title="Șterge override" style="background:none;border:none;color:#c62828;cursor:pointer;font-size:.75rem;padding:0 2px;">✕</button>`:''}
                </div>
            </div>
        </div>`;
    }).join('');
}

async function saveAdminRating(id){
    const p=db.players.find(x=>x.id==id);if(!p)return;
    const val=parseFloat(document.getElementById(`ar-${id}`)?.value);
    const rating=(isNaN(val)||val<1||val>10)?null:Math.round(val*10)/10;
    p.adminRating=rating;
    try{
        await sb.from('players').update({admin_rating:rating}).eq('id',id);
        render();buildPlayerEditList();
        showToast(rating!=null?`👑 Rating forțat: ${p.name} → ${rating}`:`↺ Override eliminat: ${p.name}`);
    }catch(e){showToast('⚠️ '+e.message);}
}

async function clearAdminRating(id){
    document.getElementById(`ar-${id}`).value='';
    await saveAdminRating(id);
}

async function saveArchetype(id){
    const p=db.players.find(x=>x.id==id);if(!p)return;
    const newStr=document.getElementById(`str-${id}`)?.value||null;
    const newWk=document.getElementById(`wk-${id}`)?.value||null;
    p.mainStatus    = newStr||null;
    p.negativeStatus= newWk||null;
    try{
        await sb.from('players').update({main_status:newStr||null,negative_status:newWk||null}).eq('id',id);
        render();
        showToast(`✅ Profil actualizat: ${p.name}`);
    }catch(e){showToast('⚠️ '+e.message);}
}
async function savePlayerName(id){
    const input=document.getElementById(`editname-${id}`);
    const newName=input.value.trim();
    if(!newName){showToast('⚠️ Numele nu poate fi gol!');return;}
    const p=db.players.find(x=>x.id==id);
    const oldName=p.name;
    if(oldName===newName) return;
    p.name=newName;
    render();buildPlayerEditList();

    try{
        // 1. Update players table
        await dbUpdatePlayer(p);

        // 2. Update ratings — rater field
        await sb.from('ratings').update({rater:newName}).eq('rater',oldName);

        // 3. Update match_history — orange_players and green_players arrays
        // Fetch all matches that contain old name
        const{data:matches}=await sb.from('match_history').select('id,orange_players,green_players');
        const toUpdate=(matches||[]).filter(m=>
            (m.orange_players||[]).includes(oldName)||(m.green_players||[]).includes(oldName)
        );
        await Promise.all(toUpdate.map(m=>sb.from('match_history').update({
            orange_players:(m.orange_players||[]).map(n=>n===oldName?newName:n),
            green_players: (m.green_players ||[]).map(n=>n===oldName?newName:n)
        }).eq('id',m.id)));

        // Also update db.history in memory
        db.history.forEach(h=>{
            h.orangePlayers=(h.orangePlayers||[]).map(n=>n===oldName?newName:n);
            h.greenPlayers =(h.greenPlayers ||[]).map(n=>n===oldName?newName:n);
        });

        // 5. Update profiles display_name if linked
        try{
            await sb.from('profiles').update({display_name:newName}).eq('display_name',oldName);
        }catch(e){}

        showToast(`✅ Redenumit: ${oldName} → ${newName}`);
        render();
    }catch(e){showToast('⚠️ '+e.message);}
}
async function deletePlayer(id){
    const p=db.players.find(x=>x.id==id);
    showConfirm('🗑️',`Șterge ${p.name}?`,'Toate datele jucătorului vor fi șterse.','Șterge','#c62828',async()=>{
        db.players=db.players.filter(x=>x.id!=id);
        db.nextMatch.confirmedIds=db.nextMatch.confirmedIds.filter(i=>i!=id);
        db.nextMatch.absentIds=(db.nextMatch.absentIds||[]).filter(i=>i!=id);
        render();buildPlayerEditList();
        try{
            await sb.from('players').delete().eq('id',id);
            showToast(`🗑️ ${p.name} șters.`);
        }catch(e){showToast('⚠️ '+e.message);}
    });
}
function addNewPlayerFromSettings(){
    const name=prompt('Numele jucătorului nou:');if(!name||!name.trim())return;
    const newP={id:Date.now(),name:name.trim(),status:'active',wins:0,games:0,matchHistory:[],ratings:[{_dbId:null,rater:'Initial',date:today,general:5,viteza:5,tehnica:5,strategie:5,aparare:5}]};
    db.players.push(newP);render();buildPlayerEditList();
    dbUpdatePlayer(newP)
        .then(()=>sb.from('ratings').insert({player_id:newP.id,rater:'Initial',date:today,general:5,viteza:5,tehnica:5,strategie:5,aparare:5}))
        .catch(e=>showToast('⚠️ '+e.message));
    showToast(`✅ ${name.trim()} adăugat!`);
}

function saveSiteTitle(){
    const val = document.getElementById('siteTitleInput').value.trim();
    if (!val) { showToast('⚠️ Titlul nu poate fi gol!'); return; }
    siteTitle = val;
    localStorage.setItem('site_title', val);
    applyRoleUI();
    showToast('✅ Titlu salvat: ' + val);
}

// ── Admin Tag Toggle (from modal) ────────────────────────────────
async function adminToggleTag(playerId, tagId){
    const p = db.players.find(x=>x.id==playerId); if(!p) return;
    const tid = String(tagId);
    const adminTags = [...(p.adminTags||[]).map(String)];
    const idx = adminTags.indexOf(tid);
    if(idx>=0) adminTags.splice(idx,1);
    else adminTags.push(tid);
    p.adminTags = adminTags;
    try{
        await sb.from('players').update({admin_tags:adminTags.join(',')}).eq('id',playerId);
        render();
        // Refresh modal stats in-place
        buildModalStats(p);
        const t = tagById(tid);
        showToast(`${idx>=0?'🔓 Dezactivat':'👑 Activat manual'}: ${t?t.emoji+' '+t.label:tid}`);
    }catch(e){ showToast('⚠️ '+e.message); }
}

// ── Tags Admin CRUD ──────────────────────────────────────────────
// Intensity labels and colors
// Profile attr labels + colors for UI
const PROFILE_ATTR_META = {
    viteza:      {label:'⚡ Viteză',       color:'#9c4f00'},
    tehnica:     {label:'🎯 Tehnică',      color:'#1554b3'},
    strategie:   {label:'🧠 Strategie',    color:'#00bcd4'},
    aparare:     {label:'🛡️ Apărare',     color:'#2e7d32'},
    efort:       {label:'🏃 Efort',        color:'#8a6800'},
    mentalitate: {label:'💡 Mentalitate',  color:'#8e3a9e'},
    fizic:       {label:'💪 Fizic',        color:'#b71c1c'},
    executie:    {label:'🎯 Execuție',     color:'#a5d6a7'},
    pozitionare: {label:'📍 Poziționare',  color:'#80deea'},
};

// Render impact profile sliders into a container element
function renderProfileSliders(containerId, profile={}, tagId=null){
    const el = document.getElementById(containerId);
    if(!el) return;
    el.innerHTML = PROFILE_ATTRS.map(a=>{
        const meta = PROFILE_ATTR_META[a];
        const val = parseFloat(profile[a])||0;
        const pct = ((val+3)/6)*100;
        const col = val>0?'#1b7a43':val<0?'#b71c1c':'#555';
        const sliderId = tagId ? `ip-${tagId}-${a}` : a;
        const onin = tagId ? `onProfileSlider(this,'${a}','${tagId}')` : `onProfileSlider(this,'${a}',null)`;
        return `<div class="ip-row">
            <span class="ip-lbl" style="color:${meta.color};">${meta.label}</span>
            <input class="ip-slider" type="range" min="-3" max="3" step="1" value="${val}" id="${sliderId}"
                style="background:linear-gradient(to right,${meta.color} ${pct}%,#e3d3ac ${pct}%);"
                oninput="${onin}">
            <span class="ip-val" id="${sliderId}-v" style="color:${col};">${val>0?'+':''}${val}</span>
        </div>`;
    }).join('');
}

function onProfileSlider(input, attr, tagId){
    const val = parseInt(input.value);
    const col = val>0?'#1b7a43':val<0?'#b71c1c':'#555';
    const vEl = document.getElementById(input.id+'-v');
    if(vEl){ vEl.textContent=(val>0?'+':'')+val; vEl.style.color=col; }
    const meta = PROFILE_ATTR_META[attr];
    const pct = ((val+3)/6)*100;
    input.style.background = 'linear-gradient(to right,'+meta.color+' '+pct+'%,#e3d3ac '+pct+'%)';
    // Live update DB if editing existing tag
    if(tagId){
        const t = tagsConfig.find(x=>String(x.id)===String(tagId));
        if(t){
            if(!t.impact_profile) t.impact_profile={};
            t.impact_profile[attr]=val;
            clearTimeout(window._ipSaveTimer);
            window._ipSaveTimer=setTimeout(()=>saveTagProfile(tagId),600);
        }
    }
}

async function saveTagProfile(tagId){
    const t=tagsConfig.find(x=>String(x.id)===String(tagId));
    if(!t) return;
    try{
        await sb.from('tags_config').update({impact_profile:t.impact_profile}).eq('id',tagId);
        buildPTById(); invalidateTagsCache();
    }catch(e){ console.warn('saveTagProfile:',e.message); }
}

// Get profile from sliders in addTagForm
function getNewTagProfile(){
    const p={};
    PROFILE_ATTRS.forEach(a=>{
        const el=document.getElementById(a);
        p[a]=el?parseInt(el.value):0;
    });
    return p;
}

const INT_META = {
    1:{label:'Slab',   color:'#2e7d32', icon:'🟢'},
    2:{label:'Mediu',  color:'#1554b3', icon:'🔵'},
    3:{label:'Ridicat',color:'#7a6300', icon:'🟡'},
    4:{label:'Critic', color:'#b71c1c', icon:'🔴'},
};

function selectIntensity(val){
    document.getElementById('ntIntensity').value = val;
    document.querySelectorAll('.int-btn').forEach(btn=>{
        const v = parseInt(btn.dataset.val);
        const m = INT_META[v];
        if(v===val){
            btn.style.border=`1px solid ${m.color}`;
            btn.style.background=`rgba(${v===1?'76,175,80':v===2?'130,177,255':v===3?'255,214,0':'239,154,154'},.15)`;
            btn.style.color=m.color;
        } else {
            btn.style.border='1px solid #e3d3ac';
            btn.style.background='#fdf3df';
            btn.style.color='#7d6849';
        }
    });
}

function buildTagsPanel(){
    const el=document.getElementById('tagsList');if(!el)return;
    const cats=[...new Set(tagsConfig.map(t=>t.category))];
    el.innerHTML=cats.map(cat=>{
        const tags=tagsConfig.filter(t=>t.category===cat);
        const catLabel=CAT_LABELS_CONFIG[cat]||cat;
        return `<div style="margin-bottom:14px;">
            <div style="font-size:.65rem;color:#7d6849;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid #e3d3ac;">${catLabel}</div>
            ${tags.map(t=>{
                const typeColor=t.type==='pos'?'#1b7a43':t.type==='neg'?'#b71c1c':'#1554b3';
                const ip=t.impact_profile||{};
                const profileStr=PROFILE_ATTRS.map(a=>{
                    const v=parseFloat(ip[a])||0;
                    return v!==0 ? (PROFILE_ATTR_META[a]?.label.split(' ')[0]||a)+(v>0?'+'+v:v) : null;
                }).filter(Boolean).join(', ')||'—';
                const expandId=`tag-profile-${t.id}`;
                const tid=String(t.id);
                const twCur=Math.round((TW[tid]||0)*100);
                const twNumColor=twCur>0?'#1b7a43':twCur<0?'#b71c1c':'#555';
                return `<div style="border-bottom:1px solid #f1e4c8;padding:6px 0;">
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                        <input type="text" value="${t.emoji}" maxlength="4"
                            style="width:34px;background:#fdf3df;border:1px solid #d3bd8c;color:#3a2f1f;padding:4px;border-radius:6px;text-align:center;font-size:.85rem;outline:none;"
                            onchange="updateTagField(${t.id},'emoji',this.value)">
                        <input type="text" value="${t.label}"
                            style="flex:1;min-width:80px;background:#fdf3df;border:1px solid #d3bd8c;color:#3a2f1f;padding:4px 8px;border-radius:6px;font-family:'Rajdhani',sans-serif;font-size:.85rem;outline:none;"
                            onchange="updateTagField(${t.id},'label',this.value)">
                        <select style="background:#fdf3df;border:1px solid #d3bd8c;color:${typeColor};padding:4px;border-radius:6px;font-size:.72rem;outline:none;"
                            onchange="updateTagField(${t.id},'type',this.value)">
                            <option value="pos" ${t.type==='pos'?'selected':''}>✅</option>
                            <option value="neg" ${t.type==='neg'?'selected':''}>❌</option>
                            <option value="neu" ${t.type==='neu'?'selected':''}>⚪</option>
                        </select>
                        <select style="background:#fdf3df;border:1px solid #d3bd8c;color:#7d6849;padding:4px;border-radius:6px;font-size:.7rem;outline:none;"
                            onchange="updateTagField(${t.id},'category',this.value)">
                            ${['atac','aparare','efort','portar','negativ'].map(a=>`<option value="${a}" ${t.category===a?'selected':''}>${a}</option>`).join('')}
                        </select>
                        <button onclick="toggleTagProfile('${expandId}')" title="Profil echilibrare echipe: ${profileStr} (NU afectează ratingul)"
                            style="padding:3px 8px;border-radius:6px;background:rgba(61,90,254,.1);border:1px solid #d3bd8c;color:#1554b3;font-size:.65rem;cursor:pointer;">📊 Profil echipă</button>
                        <button onclick="deleteTag(${t.id})"
                            style="background:none;border:1px solid #c62828;color:#c62828;padding:2px 6px;border-radius:6px;font-size:.72rem;cursor:pointer;">🗑️</button>
                    </div>
                    <div class="tw-row" style="margin-top:2px;">
                        <span class="tw-emoji" style="color:#7d6849;font-size:.62rem;">🎚️ Coeficient rating</span>
                        <button class="tw-btn" onclick="stepTagWeight('${tid}',-5)">−</button>
                        <span class="tw-val" id="twval-${tid}" style="color:${twNumColor};width:44px;">${twCur>0?'+'+twCur:twCur}%</span>
                        <button class="tw-btn" onclick="stepTagWeight('${tid}',+5)">+</button>
                        <span style="font-size:.55rem;color:#9c7a4a;margin-left:4px;">→ singurul lucru care contează pentru Smart Rating</span>
                    </div>
                    <div id="${expandId}" style="display:none;background:#f3e6cf;border-radius:8px;padding:10px;margin-top:6px;border:1px solid #e3d3ac;">
                        <div style="font-size:.6rem;color:#7d6849;margin-bottom:2px;text-transform:uppercase;letter-spacing:1px;">📊 Profil pentru echilibrare echipe (−3 → +3)</div>
                        <div style="font-size:.58rem;color:#9c7a4a;margin-bottom:6px;">Nu afectează ratingul — folosit doar când se formează echipe echilibrate. Poți sări peste asta.</div>
                        <div id="ipSliders-${t.id}"></div>
                    </div>
                </div>`;
            }).join('')}
        </div>`;
    }).join('');
}

function toggleTagProfile(id){
    const el=document.getElementById(id);
    if(!el) return;
    const tagId=id.replace('tag-profile-','');
    const t=tagsConfig.find(x=>String(x.id)===tagId);
    if(el.style.display==='none'||!el.style.display){
        el.style.display='block';
        renderProfileSliders('ipSliders-'+tagId, t?.impact_profile||{}, tagId);
    } else {
        el.style.display='none';
    }
}

function openAddTag(){
    document.getElementById('addTagForm').style.display='block';
    renderProfileSliders('ntProfileSliders', {});
}

async function saveNewTag(){
    const emoji=document.getElementById('ntEmoji').value.trim()||'⚽';
    const label=document.getElementById('ntLabel').value.trim();
    const type=document.getElementById('ntType').value;
    const category=document.getElementById('ntCat').value;
    const impact_profile=getNewTagProfile();
    // Coeficient implicit, ca tag-ul să aibă un efect din start (adminul poate ajusta oricând)
    const tw_weight = type==='pos' ? 0.20 : type==='neg' ? -0.20 : 0;
    if(!label){showToast('⚠️ Introdu un label!');return;}
    try{
        const{data,error}=await sb.from('tags_config')
            .insert({emoji,label,type,category,impact_profile,tw_weight,sort_order:tagsConfig.length+1})
            .select().single();
        if(error)throw error;
        tagsConfig.push(data);
        TW[String(data.id)] = tw_weight;
        buildPTById();buildTWFromConfig();invalidateTagsCache();
        document.getElementById('addTagForm').style.display='none';
        document.getElementById('ntEmoji').value='';document.getElementById('ntLabel').value='';
        buildTagsPanel();
        showToast('✅ Tag adăugat: '+emoji+' '+label);
    }catch(e){showToast('⚠️ '+e.message);}
}

async function updateTagField(id,field,value){
    const t=tagsConfig.find(x=>x.id===id);if(!t)return;
    t[field]=value;
    try{
        await sb.from('tags_config').update({[field]:t[field]}).eq('id',id);
        buildPTById();invalidateTagsCache();
    }catch(e){showToast('⚠️ '+e.message);}
}

async function deleteTag(id){
    showConfirm('🗑️','Șterge tag-ul?','Tag-ul va fi eliminat din configurație.','Șterge','#c62828',async()=>{
        try{
            await sb.from('tags_config').delete().eq('id',id);
            tagsConfig=tagsConfig.filter(t=>t.id!==id);
            buildPTById();invalidateTagsCache();buildTagsPanel();
            showToast('✅ Tag șters!');
        }catch(e){showToast('⚠️ '+e.message);}
    });
}

function invalidateTagsCache(){
    localStorage.removeItem('tags_config_cache');
    localStorage.removeItem('tags_config_ts');
}

const W_LABELS = {
    winrate:'📈 Win Rate',
    goals:'⚽ Goluri (relativ la poziție)',
    tags:'🏷️ Tag-uri',
    chemistry:'🧪 Chimie (coechipieri actuali)',
};

const PRESETS = {
    balanced:    {winrate:.30,goals:.30,tags:.30,chemistry:.10},
    defensive:   {winrate:.25,goals:.20,tags:.40,chemistry:.15},
    performance: {winrate:.30,goals:.40,tags:.25,chemistry:.05}
};

function buildAlgorithmPanel(){
    document.getElementById('siteTitleInput').value = siteTitle;

    // ── Weights grid (fără MVP) ──────────────────────────────────
    const weightsHtml = Object.entries(W_LABELS).map(([k,lbl])=>{
        const pct = Math.round((W[k]||0)*100);
        return `<div class="algo-weight-cell">
            <span class="algo-weight-lbl">${lbl}</span>
            <div class="algo-weight-ctrl">
                <button class="algo-btn" onclick="stepWeight('${k}',-5)">−</button>
                <input class="algo-num" type="number" id="wnum-${k}" value="${pct}" min="0" max="100"
                    oninput="syncWeightNum('${k}')">
                <button class="algo-btn" onclick="stepWeight('${k}',+5)">+</button>
                <span class="algo-pct">%</span>
            </div>
        </div>`;
    }).join('');

    // ── Modificatori globali (NU fac parte din cei 100%) ─────────
    const modifiersHtml = `
        <div class="algo-weight-cell" style="border-top:1px dashed #e3d3ac;margin-top:8px;padding-top:12px;">
            <span class="algo-weight-lbl">🎯 Rating de bază <span style="font-size:.6em;color:#9c7a4a;">(de unde pornește toată lumea)</span></span>
            <div class="algo-weight-ctrl">
                <button class="algo-btn" onclick="stepBaseRating(-0.5)">−</button>
                <input class="algo-num" type="number" id="baseRatingNum" value="${BASE_RATING.toFixed(1)}" min="1" max="10" step="0.5"
                    oninput="syncBaseRating()">
                <button class="algo-btn" onclick="stepBaseRating(0.5)">+</button>
                <span class="algo-pct">pt</span>
            </div>
        </div>
        <div class="algo-weight-cell">
            <span class="algo-weight-lbl">📅 Intensitate activitate recentă <span style="font-size:.6em;color:#9c7a4a;">(0% = ignorată, 100% = normal)</span></span>
            <div class="algo-weight-ctrl">
                <button class="algo-btn" onclick="stepActivityIntensity(-10)">−</button>
                <input class="algo-num" type="number" id="activityIntensityNum" value="${Math.round(ACTIVITY_INTENSITY*100)}" min="0" max="200" step="10"
                    oninput="syncActivityIntensity()">
                <button class="algo-btn" onclick="stepActivityIntensity(10)">+</button>
                <span class="algo-pct">%</span>
            </div>
        </div>`;

    document.getElementById('weightsList').innerHTML = weightsHtml + modifiersHtml;

    updateWeightsSum();
}
function stepBaseRating(delta){
    BASE_RATING = Math.max(1, Math.min(10, parseFloat((BASE_RATING+delta).toFixed(1))));
    const el = document.getElementById('baseRatingNum'); if(el) el.value = BASE_RATING.toFixed(1);
}
function syncBaseRating(){
    let v = parseFloat(document.getElementById('baseRatingNum').value);
    if(isNaN(v)) v = 5.0;
    BASE_RATING = Math.max(1, Math.min(10, v));
}
function stepActivityIntensity(delta){
    ACTIVITY_INTENSITY = Math.max(0, Math.min(2, parseFloat(((ACTIVITY_INTENSITY*100+delta)/100).toFixed(2))));
    const el = document.getElementById('activityIntensityNum'); if(el) el.value = Math.round(ACTIVITY_INTENSITY*100);
}
function syncActivityIntensity(){
    let v = parseInt(document.getElementById('activityIntensityNum').value);
    if(isNaN(v)) v = 100;
    ACTIVITY_INTENSITY = Math.max(0, Math.min(2, v/100));
}
function stepWeight(key, delta){
    let val = Math.round((W[key]||0)*100) + delta;
    val = Math.max(0, Math.min(100, val));
    W[key] = val/100;
    const el = document.getElementById(`wnum-${key}`);
    if(el) el.value = val;
    updateWeightsSum();
}

function syncWeightNum(key){
    let val = parseInt(document.getElementById(`wnum-${key}`).value)||0;
    val = Math.max(0, Math.min(100, val));
    W[key] = val/100;
    updateWeightsSum();
}

function stepTagWeight(tid, delta){
    let cur = Math.round((TW[tid]||0)*100) + delta;
    cur = Math.max(-50, Math.min(50, cur));
    TW[tid] = cur/100;
    // Also update local tagsConfig object so cache stays in sync
    const t = tagsConfig.find(x=>String(x.id)===tid);
    if(t) t.tw_weight = TW[tid];
    const el = document.getElementById('twval-'+tid);
    if(el){
        el.textContent = (cur>0?'+'+cur:cur)+'%';
        el.style.color = cur>0?'#1b7a43':cur<0?'#b71c1c':'#555';
    }
    clearTimeout(window._twSaveTimer);
    window._twSaveTimer = setTimeout(()=>saveTagWeight(tid), 600);
}
async function saveTagWeight(tid){
    try{ await sb.from('tags_config').update({tw_weight:TW[tid]||0}).eq('id',tid); invalidateTagsCache(); }
    catch(e){ console.warn('saveTagWeight:', e.message); }
}

// Legacy compat
function syncWeight(key, source){
    const numEl = document.getElementById(`wnum-${key}`);
    if(numEl) syncWeightNum(key);
}
function syncTagWeight(tid, source){}
function updateWeight(key,val){ stepWeight(key,0); }

function applyPreset(name){
    const p = PRESETS[name]; if(!p) return;
    Object.entries(p).forEach(([k,v])=>{
        W[k]=v;
        const el=document.getElementById(`wnum-${k}`);
        if(el) el.value=Math.round(v*100);
    });
    updateWeightsSum();
    showToast(`✅ Presetare "${name}" aplicată!`);
}

function updateWeightsSum(){
    const sum = ['winrate','goals','tags','chemistry'].reduce((s,k)=>s+(W[k]||0),0);
    const pct = Math.round(sum*100);
    const ok  = Math.abs(pct-100) <= 1;

    // Ring
    const CIRC = 207.3;
    const fill = document.getElementById('algoRingFill');
    const pctEl = document.getElementById('algoPowerPct');
    const saveBtn = document.getElementById('btnSaveAlgo');
    if(fill){
        const progress = Math.min(pct/100,1);
        fill.style.strokeDashoffset = CIRC*(1-progress);
        fill.style.stroke = ok?'#2e7d32':pct>100?'#a52020':'#9c4f00';
    }
    if(pctEl){ pctEl.textContent=pct+'%'; pctEl.style.color=ok?'#2e7d32':pct>100?'#a52020':'#9c4f00'; }
    if(saveBtn){ saveBtn.disabled=!ok; saveBtn.style.opacity=ok?'1':'.45'; saveBtn.style.cursor=ok?'pointer':'not-allowed'; }

    // Legacy weightsSum (hidden but keep compat)
    const el=document.getElementById('weightsSum');
    if(el){ el.textContent=pct+'%'; el.style.color=ok?'#2e7d32':'#e57373'; }
}

async function saveAlgorithm(){
    const mainKeys = ['winrate','goals','tags','chemistry'];
    const sum = mainKeys.reduce((s,k)=>s+(W[k]||0),0);
    if (Math.abs(sum-1) > 0.02) {
        showToast(`⚠️ Suma ponderi (Win Rate + Goluri + Tag-uri + Chimie) = ${(sum*100).toFixed(0)}% — trebuie să fie 100%!`);
        return;
    }
    try{
        await sb.from('algo_settings').upsert([
            {key:'weights', value: W},
            {key:'base_rating', value: BASE_RATING},
            {key:'activity_intensity', value: ACTIVITY_INTENSITY}
        ], {onConflict:'key'});
        showToast('✅ Algoritm salvat în baza de date!');
    }catch(e){ showToast('⚠️ Eroare: '+e.message); return; }
    render();
}

async function resetAlgorithm(){
    Object.assign(W, DEFAULT_W);
    BASE_RATING = 5.0;
    ACTIVITY_INTENSITY = 1.0;
    tagsConfig.forEach(t=>{ TW[String(t.id)]=0; t.tw_weight=0; });
    try{
        await sb.from('algo_settings').upsert([
            {key:'weights', value: DEFAULT_W},
            {key:'base_rating', value: 5.0},
            {key:'activity_intensity', value: 1.0}
        ], {onConflict:'key'});
        await Promise.all(tagsConfig.map(t=>sb.from('tags_config').update({tw_weight:0}).eq('id',t.id)));
    }catch(e){ console.warn('reset algo error:',e.message); }
    buildAlgorithmPanel();
    buildTagsPanel();
    render();
    showToast('↺ Algoritm resetat!');
}

function toggleDashStats(){
    statsVisible = !statsVisible;
    localStorage.setItem('dash_stats_visible', statsVisible);
    applyDashStatsVisibility();
}
function applyDashStatsVisibility(){
    const dashboard = document.getElementById('mainPage');
    if(!dashboard) return;
    if(statsVisible){
        dashboard.classList.remove('dash-stats-hidden');
        document.getElementById('btnToggleStats').style.opacity='1';
        document.getElementById('btnToggleStats').style.color='';
    } else {
        dashboard.classList.add('dash-stats-hidden');
        document.getElementById('btnToggleStats').style.opacity='0.5';
        document.getElementById('btnToggleStats').style.color='#555';
    }
}

function toggleDashRoles(){
    rolesVisible = !rolesVisible;
    localStorage.setItem('dash_roles_visible', rolesVisible);
    applyDashRolesVisibility();
}
function applyDashRolesVisibility(){
    const dashboard = document.getElementById('mainPage');
    if(!dashboard) return;
    const btn = document.getElementById('btnToggleRoles');
    if(rolesVisible){
        dashboard.classList.remove('dash-roles-hidden');
        if(btn){ btn.style.opacity='1'; btn.style.color=''; }
    } else {
        dashboard.classList.add('dash-roles-hidden');
        if(btn){ btn.style.opacity='0.6'; btn.style.color='#7d6849'; }
    }
}

function toggleDashTags(){
    tagsVisible = !tagsVisible;
    localStorage.setItem('dash_tags_visible', tagsVisible);
    applyDashTagsVisibility();
    applyDashRolesVisibility();
}
function applyDashTagsVisibility(){
    const dashboard = document.getElementById('mainPage');
    if(!dashboard) return;
    const btn = document.getElementById('btnToggleTags');
    if(tagsVisible){
        dashboard.classList.remove('dash-tags-hidden');
        if(btn){ btn.style.opacity='1'; btn.style.background=''; btn.style.color=''; btn.title='Ascunde statusuri'; }
    } else {
        dashboard.classList.add('dash-tags-hidden');
        if(btn){ btn.style.opacity='0.6'; btn.style.background='rgba(0,0,0,0)'; btn.style.color='#7d6849'; btn.title='Arată statusuri'; }
    }
}

// Admin rating hard override
async function saveAdminRating(id){
    const input = document.getElementById('adminRatingInput');
    const val = parseFloat(input?.value);
    if(isNaN(val) || val < 1 || val > 10){
        showToast('⚠️ Rating trebuie să fie între 1.0 și 10.0');
        return;
    }
    const p = db.players.find(x=>x.id==id); if(!p) return;
    p.adminRating = parseFloat(val.toFixed(1));
    try{
        await sb.from('players').update({admin_rating: p.adminRating}).eq('id', id);
        render();
        // Refresh modal header
        document.getElementById('modalSmart').textContent = `★ Smart: ${getSmartRating(p).toFixed(2)}`;
        document.getElementById('modalSmart').style.borderColor = 'var(--orange)';
        buildModalStats(p);
        showToast(`👑 Rating setat la ${p.adminRating} pentru ${p.name}`);
    }catch(e){ showToast('⚠️ '+e.message); }
}
async function clearAdminRating(id){
    const p = db.players.find(x=>x.id==id); if(!p) return;
    p.adminRating = null;
    try{
        await sb.from('players').update({admin_rating: null}).eq('id', id);
        render();
        document.getElementById('modalSmart').textContent = `★ Smart: ${getSmartRating(p).toFixed(2)}`;
        document.getElementById('modalSmart').style.borderColor = '';
        buildModalStats(p);
        showToast(`✅ Rating override șters pentru ${p.name}`);
    }catch(e){ showToast('⚠️ '+e.message); }
}

async function saveStatsEdit(id) {
    const p = db.players.find(x => x.id == id); if (!p) return;
    const goals = parseInt(document.getElementById('editGoals')?.value) || 0;
    const wins  = parseInt(document.getElementById('editWins')?.value)  || 0;
    const games = parseInt(document.getElementById('editGames')?.value) || 0;
    if (wins > games) { showToast('⚠️ Victorii nu pot depăși meciurile!'); return; }
    p.totalGoals = goals;
    p.wins  = wins;
    p.games = games;
    try {
        await sb.from('players').update({
            total_goals: goals,
            wins,
            games,
        }).eq('id', id);
        render();
        buildModalStats(p);
        showToast(`✅ Statistici actualizate pentru ${p.name}`);
    } catch(e) { showToast('⚠️ ' + e.message); }
}

async function buildAccountsList(){
    const container=document.getElementById('accountsList');
    container.innerHTML='<div style="color:#6b5840;font-size:0.85rem;text-align:center;padding:16px;">Se încarcă...</div>';
    try{
        const { data: profiles } = await sb.from('profiles').select('*').order('created_at');
        if(!profiles||profiles.length===0){
            container.innerHTML='<div style="color:#6b5840;font-size:0.85rem;text-align:center;padding:16px;">Niciun cont înregistrat încă.</div>';
            return;
        }
        container.innerHTML = profiles.map(prof=>{
            const linkedPlayer = db.players.find(p=>p.id==prof.player_id);
            const roleColor = prof.role==='admin'
                ? 'background:rgba(255,140,0,0.15);color:var(--orange);border:1px solid rgba(255,140,0,0.3)'
                : 'background:rgba(61,90,254,0.15);color:#7986cb;border:1px solid rgba(61,90,254,0.3)';
            const playerOptions = `<option value="">— Neasociat —</option>`
                + db.players.sort((a,b)=>a.name.localeCompare(b.name))
                    .map(p=>`<option value="${p.id}" ${p.id==prof.player_id?'selected':''}>${p.name}</option>`).join('');
            return `<div class="account-row" id="arow-${prof.id}">
                <div style="display:flex;flex-direction:column;gap:3px;flex:1;min-width:0;">
                    <div style="display:flex;align-items:center;gap:6px;">
                        <span class="account-email" title="${prof.email}">${prof.email}</span>
                        <span class="account-role-badge" style="${roleColor}">${prof.role==='admin'?'👑 Admin':'⚽'}</span>
                    </div>
                    <div style="font-size:0.72rem;color:${linkedPlayer?'#2e7d32':'#555'};">
                        ${linkedPlayer ? '🔗 ' + linkedPlayer.name : '⚠️ Neasociat cu niciun jucător'}
                    </div>
                </div>
                <select class="account-player-select" id="accsel-${prof.id}">${playerOptions}</select>
                <button class="btn-link-account" onclick="linkAccountToPlayer('${prof.id}', document.getElementById('accsel-${prof.id}').value)">Salvează</button>
            </div>`;
        }).join('');
    }catch(e){
        container.innerHTML=`<div style="color:#b33030;font-size:0.85rem;padding:10px;">Eroare: ${e.message}</div>`;
    }
}

async function linkAccountToPlayer(profileId, playerId){
    try{
        const player = playerId ? db.players.find(p => p.id == parseInt(playerId)) : null;
        await sb.from('profiles').update({
            player_id: player ? player.id : null,
            display_name: player ? player.name : null
        }).eq('id', profileId);
        showToast('✅ ' + (player ? `${player.name} asociat!` : 'Asociere ștearsă!'));
        buildAccountsList();
        if(currentUser?.id === profileId){
            const {data} = await sb.from('profiles').select('*').eq('id',profileId).single();
            currentProfile = data;
            applyRoleUI();
        }
    }catch(e){ showToast('⚠️ Eroare: ' + e.message + ' — verifică policy RLS din Supabase!'); }
}

async function enablePushNotifications(){
    if(!('serviceWorker' in navigator)||!('PushManager' in window)){
        showToast('⚠️ Browser-ul nu suportă push notifications.');return;
    }
    const playerName=document.getElementById('pushPlayerSelect').value;
    if(!playerName){showToast('⚠️ Selectează jucătorul tău mai întâi!');return;}
    try{
        const permission=await Notification.requestPermission();
        if(permission!=='granted'){showToast('⚠️ Permisiunea a fost refuzată.');return;}
        const reg=await navigator.serviceWorker.ready;
        const sub=await reg.pushManager.subscribe({
            userVisibleOnly:true,
            applicationServerKey:urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
        // Save subscription to Supabase
        await sb.from('push_subscriptions').upsert({
            player_name:playerName,
            subscription:sub.toJSON()
        },{onConflict:'player_name'});
        pushPlayerName=playerName;
        localStorage.setItem('pushPlayerName',playerName);
        document.getElementById('pushStatusVal').textContent='Activ';
        document.getElementById('pushStatusVal').className='push-status-val active';
        document.getElementById('pushPlayerVal').textContent=playerName;
        showToast('🔔 Notificări activate pentru '+playerName+'!');
    }catch(e){showToast('⚠️ Eroare push: '+e.message);}
}

async function sendPushToAll(payload){
    // Apelează Supabase Edge Function care trimite notificările
    // Creează funcția în Supabase Dashboard → Edge Functions → "send-push"
    try{
        await sb.functions.invoke('send-push',{body:payload});
    }catch(e){
        console.log('Push send skipped (edge function not set up):',e.message);
    }
}

function urlBase64ToUint8Array(base64String){
    const padding='='.repeat((4-base64String.length%4)%4);
    const base64=(base64String+padding).replace(/-/g,'+').replace(/_/g,'/');
    const rawData=window.atob(base64);const outputArray=new Uint8Array(rawData.length);
    for(let i=0;i<rawData.length;++i)outputArray[i]=rawData.charCodeAt(i);
    return outputArray;
}

function copyPlayerLink(){
    const p = db.players.find(x=>x.id==currentPlayerId);
    if(!p){ showToast('Nu am găsit jucătorul','error'); return; }
    const base = window.location.href.replace(/[^/]*$/, ''); // directorul curent, indiferent de numele fișierului
    const url = `${base}clasament.html?player=${encodeURIComponent(p.name)}`;
    const done = ()=> showToast(`🔗 Link copiat pentru ${p.name}`, 'g');
    const fail = ()=>{
        window.prompt('Copiază linkul manual:', url);
    };
    if(navigator.clipboard?.writeText){
        navigator.clipboard.writeText(url).then(done).catch(fail);
    } else { fail(); }
}

function openModal(id){
    currentPlayerId=id;
    const p=db.players.find(x=>x.id==id);
    if(!p) return;

    // ── FIFA Header ───────────────────────────────────────────────
    // Avatar initials
    const initials = p.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const teamColor = p.status==='orange'?'#9c4f00':p.status==='green'?'#1b7a35':'#3d5afe';
    const teamGrad  = p.status==='orange'
        ? 'linear-gradient(145deg,#ffe9cc,#ffd9a8)'
        : p.status==='green'
        ? 'linear-gradient(145deg,#dff3df,#c5e8c0)'
        : 'linear-gradient(145deg,#fff7e8,#fce9c8)';
    const teamBorder = p.status==='orange'?'rgba(255,140,0,.3)':p.status==='green'?'rgba(40,167,69,.25)':'rgba(61,90,254,.2)';

    document.getElementById('modalFifaHeader').style.background = teamGrad;
    document.getElementById('modalFifaHeader').style.borderBottom = `1px solid ${teamBorder}`;
    document.getElementById('modalAvatar').textContent = initials;
    document.getElementById('modalAvatar').style.background = `rgba(0,0,0,.5)`;
    document.getElementById('modalAvatar').style.borderColor = teamColor;
    document.getElementById('modalAvatar').style.color = teamColor;
    document.getElementById('modalPlayerName').textContent = p.name;

    // Smart Rating
    const smart = getSmartRating(p);
    const smartNum = parseFloat(smart.toFixed(1));
    const smartColor = p.adminRating!=null?'var(--orange)':smartNum>=8?'#1b7a43':smartNum>=6?'#8a6800':smartNum>=4?'#9c4f00':'#e57373';
    document.getElementById('modalRatingBig').textContent = p.adminRating!=null ? p.adminRating.toFixed(1)+' 👑' : smart.toFixed(1);
    document.getElementById('modalRatingBig').style.color = smartColor;
    document.getElementById('modalRatingLabel').textContent = p.adminRating!=null ? 'FORȚAT' : 'SMART';

    // Form dots (last 5)
    const form = getFormIndex(p);
    document.getElementById('modalFormDotsWrap').innerHTML =
        Array.from({length:5},(_,i)=>{
            const r=form.last5[i];
            if(!r) return `<div class="modal-form-dot empty"></div>`;
            return `<div class="modal-form-dot ${r}" title="${r==='W'?'Victorie':'Înfrângere'}"></div>`;
        }).join('') +
        `<span style="font-size:.65rem;color:${form.color};margin-left:4px;font-weight:700;">${form.label}</span>`;

    // Streak + win rate
    const s=getStreak(p),el=document.getElementById('modalStreak');
    if(s.count){el.textContent=s.type==='W'?`🔥 ${s.count}V la rând`:`❄️ ${s.count}P la rând`;el.className='modal-streak-big '+(s.type==='W'?'streak-win':'streak-loss');}
    else{el.textContent='';el.className='modal-streak-big';}
    const wr=p.games>0?((p.wins/p.games)*100).toFixed(0)+'%':'—';
    document.getElementById('modalWinRate').textContent=`${p.wins}V / ${p.games}M (${wr})`;

    // Milestone badges
    const msEl = document.getElementById('modalMilestones');
    if(msEl) msEl.innerHTML = renderMilestoneBadges(p, true);

    // Nemesis
    const nemesisEl = document.getElementById('modalNemesis');
    if(nemesisEl){
        const nem = computeNemesis(p);
        if(nem){
            const winsVsNem = nem.games - nem.losses;
            nemesisEl.innerHTML = `⚔️ <strong>${nem.name}</strong> e Nemesis-ul tău — l-ai bătut doar ${winsVsNem}/${nem.games} ori`;
            nemesisEl.style.display='flex';
        } else {
            nemesisEl.innerHTML=''; nemesisEl.style.display='none';
        }
    }

    // Build tabs
    buildModalStats(p);
    buildModalQuickGlance(p);
    buildModalChemPreview(p);
    buildHexChart(p);
    buildPlayerMatchHistory(p);
    buildChemistry(p);
    buildRatingsList(p);

    switchModalTab('stats');
    document.getElementById('modalOverlay').style.display='flex';
    // Restart animation
    const modal = document.querySelector('#modalOverlay .modal');
    modal.style.animation='none';
    modal.offsetHeight; // reflow
    modal.style.animation='';
}
function switchModalTab(tab){
    document.querySelectorAll('.modal-tab').forEach((t,i)=>{
        const tabs=['stats','evolution','radar','history','chemistry'];
        t.classList.toggle('active',tabs[i]===tab);
    });
    document.querySelectorAll('.modal-tab-panel').forEach(p=>p.classList.remove('active'));
    const panels={stats:'tabStats',evolution:'tabEvolution',radar:'tabRadar',history:'tabHistory',chemistry:'tabChemistry'};
    document.getElementById(panels[tab])?.classList.add('active');
    if(tab==='evolution'){
        const p=db.players.find(x=>x.id==currentPlayerId);
        if(p){ buildCatTabs(p); buildRatingChart(p,activeCatTab); }
    }
}

// ── buildModalStats — with Live Preview Editor ───────────────────
function buildModalStats(p){
    const admin = isAdmin();

    // ── Stats Edit Panel (admin only) ─────────────────────────────
    const statsEditPanel = document.getElementById('statsEditPanel');
    if (statsEditPanel) {
        if (admin) {
            statsEditPanel.style.display = 'block';
            statsEditPanel.innerHTML = `
                <div style="background:#fffaf0;border:1px solid #e3d3ac;border-radius:10px;padding:10px 14px;margin-bottom:10px;">
                    <div style="font-size:.65rem;color:#7d6849;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">✏️ Editare statistici</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
                        <div>
                            <div style="font-size:.6rem;color:#6b5840;margin-bottom:4px;">⚽ Goluri</div>
                            <input type="number" min="0" id="editGoals" value="${p.totalGoals||0}"
                                style="width:100%;background:#fdf3df;border:1px solid #d3bd8c;color:#1b7a43;padding:6px;border-radius:7px;font-family:'Bebas Neue',sans-serif;font-size:1.1rem;text-align:center;outline:none;">
                        </div>
                        <div>
                            <div style="font-size:.6rem;color:#6b5840;margin-bottom:4px;">🏆 Victorii</div>
                            <input type="number" min="0" id="editWins" value="${p.wins||0}"
                                style="width:100%;background:#fdf3df;border:1px solid #d3bd8c;color:#1b7a43;padding:6px;border-radius:7px;font-family:'Bebas Neue',sans-serif;font-size:1.1rem;text-align:center;outline:none;">
                        </div>
                        <div>
                            <div style="font-size:.6rem;color:#6b5840;margin-bottom:4px;">🎮 Meciuri</div>
                            <input type="number" min="0" id="editGames" value="${p.games||0}"
                                style="width:100%;background:#fdf3df;border:1px solid #d3bd8c;color:#5c4a32;padding:6px;border-radius:7px;font-family:'Bebas Neue',sans-serif;font-size:1.1rem;text-align:center;outline:none;">
                        </div>
                    </div>
                    <button onclick="saveStatsEdit(${p.id})"
                        style="margin-top:10px;width:100%;background:rgba(61,90,254,.15);border:1px solid #3d5afe;color:#1554b3;padding:8px;border-radius:8px;font-size:.8rem;font-weight:700;cursor:pointer;">
                        💾 Salvează statistici
                    </button>
                </div>`;
        } else {
            statsEditPanel.style.display = 'none';
        }
    }

    // ── Admin Rating Override ─────────────────────────────────────
    const arPanel = document.getElementById('adminRatingPanel');
    if(arPanel){
        if(admin){
            const curVal = p.adminRating != null ? p.adminRating : '';
            arPanel.style.display = 'block';
            arPanel.innerHTML = `
                <div style="background:#fffaf0;border:1px solid ${p.adminRating!=null?'var(--orange)':'#e3d3ac'};border-radius:10px;padding:10px 14px;margin-bottom:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                    <span style="font-size:.7rem;color:#7d6849;text-transform:uppercase;letter-spacing:1px;flex:1;">👑 Rating Admin Override</span>
                    <input type="number" id="adminRatingInput" min="1" max="10" step="0.1"
                        value="${curVal}" placeholder="—"
                        style="width:60px;background:#fdf3df;border:1px solid #d3bd8c;color:var(--orange);padding:5px 8px;border-radius:7px;font-family:'Bebas Neue',sans-serif;font-size:1rem;text-align:center;outline:none;">
                    <button onclick="saveAdminRating(${p.id})"
                        style="background:rgba(255,140,0,.15);border:1px solid var(--orange);color:var(--orange);padding:5px 12px;border-radius:7px;font-size:.78rem;font-weight:700;cursor:pointer;">
                        💾 Setează
                    </button>
                    ${p.adminRating!=null?`<button onclick="clearAdminRating(${p.id})"
                        style="background:none;border:1px solid #dcc89a;color:#7d6849;padding:5px 10px;border-radius:7px;font-size:.75rem;cursor:pointer;">
                        ✕ Șterge
                    </button>`:''}
                    ${p.adminRating!=null?`<span style="font-size:.68rem;color:var(--orange);">Activ: ${p.adminRating.toFixed(1)}</span>`:''}
                </div>`;
        } else {
            arPanel.style.display = 'none';
        }
    }

    // ── Formula info line ─────────────────────────────────────────
    let formulaHtml = `<strong>Smart Rating</strong>: WinRate×${(W.winrate*100).toFixed(0)}% + Goluri×${((W.goals||0)*100).toFixed(0)}% + Tag-uri×${((W.tags||0)*100).toFixed(0)}% + Chimie×${((W.chemistry||0)*100).toFixed(0)}%`;
    const _activeTags = getPlayerActiveTagObjects(p);
    if(_activeTags.length>0){
        const {bonus:_tb, signals:_sigs} = computeTagBonus(_activeTags);
        const bonusStr=_tb>0?`<span style="color:#2e7d32">+${_tb.toFixed(2)}</span>`:`<span style="color:#b33030">${_tb.toFixed(2)}</span>`;
        const posC=_sigs.filter(s=>s.dir>0).length, negC=_sigs.filter(s=>s.dir<0).length;
        formulaHtml += ` | Tags brut: ${bonusStr} <span style="font-size:.6em;color:#6b5840;">(${posC>0?'+'+posC+' pos':''}${negC>0?' −'+negC+' neg':''})</span>`;
    }
    document.getElementById('algoInfo').innerHTML = formulaHtml;

    // ── Tag activation grid — statusuri setate manual de admin ────
    const adminSet = new Set((p.adminTags||[]).map(String));
    const catsWithTags = {};
    tagsConfig.forEach(tag=>{
        const tid = String(tag.id);
        const isAdminSet = adminSet.has(tid);
        if(!admin && !isAdminSet) return;
        const cat = tag.category||'other';
        if(!catsWithTags[cat]) catsWithTags[cat]=[];
        catsWithTags[cat].push({tag,tid,isAdminSet});
    });

    let gridHtml = '';
    if(Object.keys(catsWithTags).length === 0){
        gridHtml = admin
            ? '<div style="color:#6b5840;font-size:.8rem;padding:12px 0;text-align:center;">Tag-urile nu sunt configurate.</div>'
            : '<div style="color:#6b5840;font-size:.8rem;padding:12px 0;text-align:center;">Niciun status setat.</div>';
    } else {
        Object.entries(catsWithTags).forEach(([cat,items])=>{
            const catLabel = CAT_LABELS_CONFIG[cat]||cat;
            gridHtml += `<div style="font-size:.6rem;color:#6b5840;text-transform:uppercase;letter-spacing:1px;margin:10px 0 5px;">${catLabel}</div>`;
            items.forEach(({tag,tid,isAdminSet})=>{
                const cls = tag.type==='pos'?'tag-pos':tag.type==='neg'?'tag-neg':'tag-neu';
                const dir = tag.type==='pos'?1:tag.type==='neg'?-1:0;
                const tw = TW[tid]||0;
                // Contribuție: aceeași formulă ca în computeTagBonus (o singură
                // sursă de adevăr) — depinde EXCLUSIV de coeficientul (tw) tag-ului.
                const contribNet = tw * TAG_COEF_SCALE;
                const contribColor = contribNet>0?'#1b7a43':contribNet<0?'#b71c1c':'#555';
                const twLabel = `<span style="font-size:.58rem;color:${contribColor};margin-left:3px;">${contribNet>=0?'+':''}${contribNet.toFixed(2)}pt</span>`;
                const toggleBtn = admin ? `<button class="tag-toggle-btn"
                    style="background:${isAdminSet?'rgba(255,140,0,.15)':'rgba(61,90,254,.08)'};
                    border:1px solid ${isAdminSet?'var(--orange)':'#d3bd8c'};
                    color:${isAdminSet?'var(--orange)':'#7d6849'};"
                    onclick="adminToggleTag(${p.id},'${tid}')">
                    ${isAdminSet?'👑 Dezact.':'+ Activ.'}
                </button>` : '';
                gridHtml += `<div class="tag-act-row">
                    <div class="tag-act-top">
                        <span class="ptag ${cls}">${tag.emoji} ${tag.label}${twLabel}</span>
                        <span class="tag-act-status">${isAdminSet?'👑':'○'}</span>
                        ${toggleBtn}
                    </div>
                </div>`;
            });
        });
    }

    // ── Pas-cu-pas explicat ─────────────────────────────────────────
    // O SINGURĂ sursă de adevăr: componentele vin din computeSmartRatingComponents,
    // aceeași funcție care produce getSmartRating(p) — nu se mai poate desincroniza
    // ce se explică aici de ce se calculează efectiv.
    const rc = computeSmartRatingComponents(p);
    const finalRaw = rc.final;

    // Color helper
    const col = v => v > 0.05 ? '#1b7a43' : v < -0.05 ? '#b71c1c' : '#666';
    const fmt = v => (v>0?'+':'')+v.toFixed(2);

    const steps = [
        {icon:'🎯', label:'Punct de start', val:BASE_RATING, note:'Toată lumea pornește de la '+BASE_RATING.toFixed(1), color:'#7d6849', delta:null},
    ];
    rc.parts.forEach(part => {
        if (part.w <= 0) return; // pondere 0 → componentă dezactivată, nu o mai afișăm
        let icon = part.icon, label = part.label, note;
        if (part.key === 'winrate') note = Math.round(rc.wrRaw*100)+'% WR (ajustat: '+Math.round(rc.wrShrunk*100)+'%)';
        else if (part.key === 'goals') note = (p.totalGoals||0)+' goluri · '+(Math.round(rc.gpg*100)/100)+'/meci vs media poziției';
        else if (part.key === 'chemistry') note = rc.teammates.length ? 'win-rate cu ' + rc.teammates.length + ' coechipieri actuali: ' + Math.round((rc.chemistryRaw+0.5)*100) + '%' : 'fără coechipieri actuali (neutru '+BASE_RATING.toFixed(1)+')';
        else if (part.key === 'tags') {
            if (!rc.tagSignals.length) { note = 'Fără tag-uri active (neutru '+BASE_RATING.toFixed(1)+')'; }
            else {
                const posCount = rc.tagSignals.filter(s=>s.dir>0).length;
                const negCount = rc.tagSignals.filter(s=>s.dir<0).length;
                label = `Tag-uri (${posCount>0?'+'+posCount+' pos':''}${negCount>0?' −'+negCount+' neg':''}${rc.tagSignals.length-posCount-negCount>0?' ~neu':''})`;
                const tagDetails = rc.tagSignals.filter(s=>s.dir!==0).map(s=>`${s.tag.emoji}${s.raw>=0?'+':''}${s.raw.toFixed(2)}`).join(' ');
                note = tagDetails + (tagDetails?' → ':'') + `net ${rc.tagsNetSum>=0?'+':''}${rc.tagsNetSum.toFixed(2)}`;
            }
        }
        steps.push({icon, label, val:null, note, color:col(part.delta), delta:part.delta});
    });
    if (rc.imbalPen > 0) steps.push({icon:'⚠️', label:'Dezechilibru echipă', val:null, note:(p.lastImbalanceLoss||0)+' meci(uri) pierdut cu 3+ goluri', color:'#b71c1c', delta:-rc.imbalPen});
    if (Math.abs(rc.deltaActivity) > 0.005) steps.push({icon:'📅', label:'Activitate recentă', val:null, note: (rc.actMult<1 ? 'Absențe recente → blend spre '+BASE_RATING.toFixed(1) : 'Prezență constantă') + ' (intensitate '+Math.round(ACTIVITY_INTENSITY*100)+'%)', color:col(rc.deltaActivity), delta:rc.deltaActivity});

    const stepsHtml = steps.map((s,i)=>{
        return i===0
            ? `<div style="display:flex;justify-content:space-between;align-items:baseline;">
                <span style="font-size:.8rem;color:${s.color};">${s.icon} ${s.label}</span>
                <span style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:${s.color};">${s.val.toFixed(1)}</span>
               </div>`
            : `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:3px 0;border-bottom:1px solid #f5e9d4;">
                <span style="font-size:.78rem;color:#7d6849;">${s.icon} ${s.label}</span>
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-size:.65rem;color:#6b5840;max-width:140px;text-align:right;">${s.note}</span>
                    <span style="font-family:'Bebas Neue',sans-serif;font-size:.95rem;min-width:40px;text-align:right;color:${s.color};">${fmt(s.delta)}</span>
                </div>
               </div>`;
    }).join('');

    // Weak attr warning
    const n=p.ratings.length||1;
    const vit=p.ratings.reduce((s,r)=>s+(r.viteza||5),0)/n;
    const teh=p.ratings.reduce((s,r)=>s+(r.tehnica||5),0)/n;
    const str=p.ratings.reduce((s,r)=>s+(r.strategie||5),0)/n;
    const apr=p.ratings.reduce((s,r)=>s+(r.aparare||5),0)/n;
    const weak=[vit<2.5&&'Viteză',teh<2.5&&'Tehnică',str<2.5&&'Strategie',apr<2.5&&'Apărare'].filter(Boolean);
    const weakWarn = weak.length ? `<div style="margin-top:6px;padding:6px 10px;background:rgba(229,57,53,.08);border:1px solid rgba(229,57,53,.2);border-radius:7px;font-size:.72rem;color:#b71c1c;">⚠️ Penalizare −10%: <strong>${weak.join(', ')}</strong> sub 2.5/10 din voturi</div>` : '';

    document.getElementById('algoBreakdown').innerHTML =
        `<div style="background:#f3e6cf;border-radius:10px;padding:12px;margin-bottom:8px;">
            <div style="font-size:.6rem;color:#6b5840;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">📐 Cum s-a calculat ${finalRaw.toFixed(2)}</div>
            ${stepsHtml}
            ${weakWarn}
            <div style="margin-top:8px;padding-top:8px;border-top:1px solid #e3d3ac;display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:.72rem;color:#7d6849;">Rezultat final (1–10)</span>
                <span style="font-family:'Bebas Neue',sans-serif;font-size:1.6rem;color:${finalRaw>=7?'#1b7a43':finalRaw>=5?'#8a6800':'#b71c1c'};">${finalRaw.toFixed(2)}</span>
            </div>
        </div>
        <div class="algo-title" style="margin-top:8px;margin-bottom:4px;">🏷️ Statusuri</div>` +
        gridHtml;

    buildCatTabs(p);
}

// ── Sumar rapid — o privire, fără să dai click prin taburi ────────
function buildModalQuickGlance(p){
    const el = document.getElementById('modalQuickGlance');
    if(!el) return;
    const chip = (label,color)=>`<span style="font-size:.68rem;font-weight:700;padding:4px 9px;border-radius:8px;background:${color}18;border:1px solid ${color}44;color:${color};">${label}</span>`;
    const chips = [];
    chips.push(chip(`⚽ ${p.totalGoals||0} goluri sezon`, '#1b7a43'));
    if((p.totalPenaltyGoals||0)>0) chips.push(chip(`🥅 ${p.totalPenaltyGoals} goluri penalty`, '#7d6849'));
    const tagCount = getPlayerActiveTagObjects(p).length;
    if(tagCount>0) chips.push(chip(`👑 ${tagCount} status${tagCount!==1?'uri':''}`, '#9c4f00'));
    chips.push(chip(`🎮 ${p.games||0} meciuri`, '#1554b3'));
    el.innerHTML = chips.join('');
}

// ── Preview chimie — cel mai bun & cel mai slab partener, direct în tab Rating ──
function buildModalChemPreview(p){
    const el = document.getElementById('modalChemPreview');
    if(!el) return;
    const myMatches = db.history.filter(h=>(h.orangePlayers||[]).includes(p.name)||(h.greenPlayers||[]).includes(p.name)||(h.blackPlayers||[]).includes(p.name));
    if(myMatches.length===0){ el.innerHTML=''; return; }
    const chemMap={};
    myMatches.forEach(h=>{
        const inOrange=(h.orangePlayers||[]).includes(p.name);
        const inBlack=(h.blackPlayers||[]).includes(p.name);
        const myTeam=inOrange?h.orangePlayers:inBlack?(h.blackPlayers||[]):h.greenPlayers;
        const won = playerWonMatch(h, p.name) === true;
        (myTeam||[]).forEach(name=>{
            if(name===p.name)return;
            if(!chemMap[name])chemMap[name]={together:0,wins:0};
            chemMap[name].together++;
            if(won)chemMap[name].wins++;
        });
    });
    const total=myMatches.length;
    const results=Object.entries(chemMap)
        .map(([name,d])=>{
            const freq=d.together/total, wr=d.together>0?d.wins/d.together:0;
            return {name, score:(freq*0.4+wr*0.6)*10, together:d.together};
        })
        .filter(r=>r.together>=2) // sub 2 meciuri împreună e prea zgomotos ca semnal
        .sort((a,b)=>b.score-a.score);
    if(results.length<2){ el.innerHTML=''; return; }
    const best = results[0], worst = results[results.length-1];
    el.innerHTML = `<div style="font-size:.6rem;color:#6b5840;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">🤝 Chimie — pe scurt</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <div style="flex:1;min-width:140px;background:#f3e6cf;border:1px solid rgba(46,125,50,.3);border-radius:9px;padding:8px 10px;">
                <div style="font-size:.6rem;color:#2e7d32;font-weight:700;text-transform:uppercase;">💚 Cea mai bună chimie</div>
                <div style="font-weight:700;color:#3a2f1f;font-size:.85rem;margin-top:2px;">${best.name}</div>
                <div style="font-size:.65rem;color:#6b5840;">${best.together} meciuri împreună · ${best.score.toFixed(1)}/10</div>
            </div>
            <div style="flex:1;min-width:140px;background:#f3e6cf;border:1px solid rgba(183,28,28,.25);border-radius:9px;padding:8px 10px;">
                <div style="font-size:.6rem;color:#b71c1c;font-weight:700;text-transform:uppercase;">🧊 Cea mai slabă chimie</div>
                <div style="font-weight:700;color:#3a2f1f;font-size:.85rem;margin-top:2px;">${worst.name}</div>
                <div style="font-size:.65rem;color:#6b5840;">${worst.together} meciuri împreună · ${worst.score.toFixed(1)}/10</div>
            </div>
        </div>
        <div onclick="switchModalTab('chemistry')" style="margin-top:6px;text-align:center;font-size:.65rem;color:#1554b3;cursor:pointer;text-decoration:underline;">Vezi toată chimia →</div>`;
}

// ── Live Stats Editor ────────────────────────────────────────────
let _liveEditPlayerId = null;
const LIVE_ATTRS = [
    {key:'general',  label:'⚽ General',  color:'#8a6800'},
    {key:'viteza',   label:'⚡ Viteză',   color:'#9c4f00'},
    {key:'tehnica',  label:'🎯 Tehnică',  color:'#3d5afe'},
    {key:'strategie',label:'🧠 Strategie',color:'#00bcd4'},
    {key:'aparare',  label:'🛡️ Apărare', color:'#2e7d32'},
];

function buildLiveEditor(p){
    _liveEditPlayerId = p.id;
    const existing = document.getElementById('liveEditorWrap');
    if(existing) existing.remove();

    // Snapshot current averages as starting point
    const snap = {};
    LIVE_ATTRS.forEach(a => snap[a.key] = Math.round(getCatAvg(p, a.key)*10));

    const preview = previewSmartRating(p, snap);

    const attrsHtml = LIVE_ATTRS.map(a => {
        const v = snap[a.key];
        const contrib = (preview.contribs[a.key]||0).toFixed(2);
        return `<div>
            <div class="live-attr-row">
                <span class="live-attr-lbl" style="color:${a.color};">${a.label}</span>
                <input class="live-attr-slider" type="range" min="0" max="100" step="1" value="${v}"
                    id="les-${p.id}-${a.key}"
                    style="background:linear-gradient(to right,${a.color} ${v}%,#dcc89a ${v}%);"
                    oninput="onLiveSlider(${p.id},'${a.key}',this)">
                <span class="live-attr-val" id="lev-${p.id}-${a.key}" style="color:${a.color};">${v}</span>
                <span class="live-attr-contrib" id="lec-${p.id}-${a.key}"
                    style="color:#7d6849;font-size:.6rem;">+${contrib}pt</span>
            </div>
            <div class="live-quickset">
                <button class="live-qs-btn" onclick="liveQuickSet(${p.id},'${a.key}',20)">Slab (20)</button>
                <button class="live-qs-btn" onclick="liveQuickSet(${p.id},'${a.key}',50)">Mediu (50)</button>
                <button class="live-qs-btn" onclick="liveQuickSet(${p.id},'${a.key}',80)">Pro (80)</button>
            </div>
        </div>`;
    }).join('');

    const srColor = preview.final>=8?'#1b7a43':preview.final>=6?'#8a6800':preview.final>=4?'#9c4f00':'#e57373';

    const wrap = document.createElement('div');
    wrap.id = 'liveEditorWrap';
    wrap.className = 'live-edit-wrap';
    wrap.innerHTML = `
        <!-- Live SR badge -->
        <div class="live-sr-badge">
            <div>
                <div style="font-size:.6rem;color:#6b5840;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Smart Rating Preview</div>
                <div class="live-sr-num" id="liveSrNum" style="color:${srColor};">${preview.final.toFixed(1)}</div>
            </div>
            <div class="live-sr-meta">
                <div id="livePenaltyBadge" class="live-penalty-badge ${preview.penalized?'penalty show':''}">${preview.penalized?'⚠️ Dezechilibru −10%':''}</div>
                <div style="font-size:.6rem;color:#7d6849;margin-top:4px;">Real: <strong style="color:#5c4a32;">${getSmartRating(p).toFixed(2)}</strong></div>
            </div>
        </div>
        <!-- Sliders -->
        <div style="display:flex;flex-direction:column;gap:2px;">${attrsHtml}</div>
        <!-- Save button -->
        <button onclick="saveLiveStats(${p.id})"
            style="margin-top:10px;width:100%;padding:9px;border-radius:9px;background:linear-gradient(135deg,#dff3df,#28a745);border:1px solid #28a745;color:#3a2f1f;font-size:.88rem;font-weight:700;cursor:pointer;">
            💾 Salvează Statisticile
        </button>`;

    // Insert before algoInfo
    const algoInfo = document.getElementById('algoInfo');
    algoInfo.parentNode.insertBefore(wrap, algoInfo);
}

function previewSmartRating(p, snap){
    // snap: {general:0..100, viteza:0..100, ...} — valori setate direct de admin
    // prin sliders, tratate ca notă finală (nu mai trec prin shrinkage de voturi,
    // pentru că nu sunt "un vot printre altele" ci un snapshot definit manual).
    const v10 = k => (snap[k]||0)/10; // convert 0-100 → 0-10
    const catScores = {
        general:   v10('general'),
        viteza:    v10('viteza'),
        tehnica:   v10('tehnica'),
        strategie: v10('strategie'),
        aparare:   v10('aparare'),
    };

    // Win Rate, Goluri și Tag-uri rămân calculate din statisticile reale ale
    // jucătorului, exact ca în computeSmartRatingComponents — ca "Preview" și
    // "Real" să difere DOAR prin ce se schimbă efectiv la sliders (notele pe
    // categorii), nu prin formulă.
    const winrateScore = 5 + (getWinrateShrunk(p) - 0.5) * 10;
    const goalsScore   = getGoalsScoreRelative(p);
    const activeTags   = getPlayerActiveTagObjects(p);
    const {bonus: tagsNetSum, signals} = computeTagBonus(activeTags);
    const tagsScore    = 5 + tagsNetSum;

    const parts = [
        { key:'winrate',   score:winrateScore,        w:W.winrate||0 },
        { key:'goals',     score:goalsScore,          w:W.goals||0 },
        { key:'general',   score:catScores.general,   w:W.general||0 },
        { key:'tags',      score:tagsScore,           w:W.tags||0 },
        { key:'viteza',    score:catScores.viteza,    w:W.viteza||0 },
        { key:'tehnica',   score:catScores.tehnica,   w:W.tehnica||0 },
        { key:'strategie', score:catScores.strategie, w:W.strategie||0 },
        { key:'aparare',   score:catScores.aparare,   w:W.aparare||0 },
    ];
    const wSum = parts.reduce((s,c)=>s+c.w, 0);
    let base = wSum>0 ? 5 + parts.reduce((s,c)=>s+(c.score-5)*c.w, 0)/wSum : 5;

    const THRESHOLD = 2.5;
    const penalized = catScores.viteza<THRESHOLD || catScores.tehnica<THRESHOLD || catScores.strategie<THRESHOLD || catScores.aparare<THRESHOLD;
    if(penalized) base *= 0.90;

    // Per-attribute contribution for display (câte puncte din rating vin din fiecare atribut)
    const contribOf = key => {
        const part = parts.find(c=>c.key===key);
        return parseFloat((wSum>0 ? (part.score-5)*part.w/wSum : 0).toFixed(2));
    };
    const contribs = {
        general:   contribOf('general'),
        viteza:    contribOf('viteza'),
        tehnica:   contribOf('tehnica'),
        strategie: contribOf('strategie'),
        aparare:   contribOf('aparare'),
        tags:      contribOf('tags'),
    };

    return {
        final: parseFloat(Math.max(1,Math.min(10,base)).toFixed(2)),
        contribs, penalized, tagsNetSum, signals
    };
}

function onLiveSlider(pid, key, el){
    const val = parseInt(el.value);
    // Update gradient
    el.style.background = `linear-gradient(to right,${LIVE_ATTRS.find(a=>a.key===key)?.color||'#3d5afe'} ${val}%,#dcc89a ${val}%)`;
    // Update displayed value
    document.getElementById(`lev-${pid}-${key}`).textContent = val;
    // Recalculate preview
    const snap = {};
    LIVE_ATTRS.forEach(a=>{
        const el2 = document.getElementById(`les-${pid}-${a.key}`);
        snap[a.key] = el2 ? parseInt(el2.value) : 50;
    });
    const p = db.players.find(x=>x.id==pid); if(!p) return;
    const preview = previewSmartRating(p, snap);

    // Update SR num with pulse animation
    const srEl = document.getElementById('liveSrNum');
    const srColor = preview.final>=8?'#1b7a43':preview.final>=6?'#8a6800':preview.final>=4?'#9c4f00':'#e57373';
    srEl.style.color = srColor;
    srEl.textContent = preview.final.toFixed(1);
    srEl.style.transform = 'scale(1.15)';
    setTimeout(()=>srEl.style.transform='', 150);

    // Update penalty badge
    const penEl = document.getElementById('livePenaltyBadge');
    penEl.textContent = preview.penalized ? '⚠️ Dezechilibru −10%' : '';
    penEl.className = `live-penalty-badge penalty${preview.penalized?' show':''}`;

    // Update contributions
    Object.entries(preview.contribs).forEach(([k,contrib])=>{
        const cEl = document.getElementById(`lec-${pid}-${k}`);
        if(cEl){
            const isLow = (snap[k]||0)/10 < 2.5 && k !== 'general';
            cEl.textContent = `+${contrib.toFixed(2)}pt`;
            cEl.style.color = isLow ? '#b71c1c' : contrib > 1 ? '#1b7a43' : '#555';
        }
    });
}

function liveQuickSet(pid, key, val){
    const el = document.getElementById(`les-${pid}-${key}`);
    if(!el) return;
    el.value = val;
    onLiveSlider(pid, key, el);
}

async function saveLiveStats(pid){
    const p = db.players.find(x=>x.id==pid); if(!p) return;
    const snap = {};
    LIVE_ATTRS.forEach(a=>{
        const el = document.getElementById(`les-${pid}-${a.key}`);
        snap[a.key] = el ? parseInt(el.value) : 50;
    });
    // Save as a new "Admin" rating entry
    const today = new Date().toLocaleDateString('ro-RO');
    const rData = {
        rater:'Admin', date:today, tags:'',
        general: snap.general/10,
        viteza:  snap.viteza/10,
        tehnica: snap.tehnica/10,
        strategie: snap.strategie/10,
        aparare: snap.aparare/10
    };
    try{
        const dbId = await dbInsertRating(pid, rData);
        p.ratings.push({...rData, _dbId:dbId});
        render();
        buildModalStats(p);
        showToast('✅ Statistici salvate!');
    }catch(e){ showToast('⚠️ '+e.message); }
}

// ── buildHexChart — Tag Category Radar ───────────────────────────
function buildHexChart(p){
    // Axes = tag categories with scores derived from active tags
    // 6 radar axes = 4 buckets + WR + Rezistență
    const radarAxes = [
        {key:'tehnic',   label:'Tehnic',    color:'#1554b3', icon:'🎯', axes:['tehnica','executie']},
        {key:'tactic',   label:'Tactic/IQ', color:'#00bcd4', icon:'🧠', axes:['strategie','pozitionare','mentalitate']},
        {key:'fizic',    label:'Fizic',     color:'#8a6800', icon:'💪', axes:['viteza','efort','fizic']},
        {key:'defensiv', label:'Defensiv',  color:'#2e7d32', icon:'🛡️', axes:['aparare','pozitionare']},
        {key:'_wr',      label:'Win Rate',  color:'#6b46c1', icon:'📈', axes:[]},
        {key:'_res',     label:'Rezistență',color:'#b71c1c', icon:'🔋', axes:[]},
    ];

    const activeTags = getPlayerActiveTagObjects(p);

    // Aggregate impact_profile across all active tags
    const aggProfile = {};
    PROFILE_ATTRS.forEach(a=>{ aggProfile[a]=0; });
    activeTags.forEach(obj=>{
        const ip = obj.tag?.impact_profile||{};
        PROFILE_ATTRS.forEach(a=>{ aggProfile[a]+=(parseFloat(ip[a])||0); });
    });

    const vals = radarAxes.map(ax=>{
        if(ax.key==='_wr') return p.games>0 ? (1+p.wins/p.games*9) : 5;
        if(ax.key==='_res'){
            const negCount = activeTags.filter(o=>o.tag?.type==='neg').length;
            return Math.max(1, Math.min(10, 5 + (aggProfile.mentalitate||0)*0.5 - negCount*0.8));
        }
        const sum = ax.axes.reduce((s,a)=>s+(aggProfile[a]||0),0);
        return Math.max(1, Math.min(10, 5 + sum * 0.6));
    });
    const colors = radarAxes.map(ax=>ax.color);
    const labels = radarAxes.map(ax=>ax.label);

    const cx=110,cy=110,R=80,r_min=8,N=6;
    const angle=i=>((i/N)*Math.PI*2 - Math.PI/2);
    const pt=(r,i)=>({x:cx+r*Math.cos(angle(i)),y:cy+r*Math.sin(angle(i))});

    let rings='';
    [0.2,0.4,0.6,0.8,1.0].forEach(f=>{
        const pts=Array.from({length:N},(_,i)=>pt(R*f,i));
        rings+=`<polygon points="${pts.map(p=>p.x+','+p.y).join(' ')}" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="1"/>`;
    });
    let spokes='';
    for(let i=0;i<N;i++){const p2=pt(R,i);spokes+=`<line x1="${cx}" y1="${cy}" x2="${p2.x}" y2="${p2.y}" stroke="rgba(255,255,255,.05)" stroke-width="1"/>`;}

    const dataPts=vals.map((v,i)=>pt(Math.max(r_min,R*(v/10)),i));
    const dataPath=dataPts.map(p=>p.x+','+p.y).join(' ');

    let lbls='';
    radarAxes.forEach((ax,i)=>{
        const p2=pt(R+20,i);
        const anchor=p2.x<cx-5?'end':p2.x>cx+5?'start':'middle';
        lbls+=`<text x="${p2.x}" y="${p2.y}" text-anchor="${anchor}" fill="${ax.color}" font-size="8.5" font-family="Rajdhani,sans-serif" font-weight="700">${ax.icon}</text>`;
        lbls+=`<text x="${p2.x}" y="${p2.y+10}" text-anchor="${anchor}" fill="${ax.color}" font-size="7.5" font-family="Rajdhani,sans-serif">${ax.label}</text>`;
    });

    let dots='';
    dataPts.forEach((p2,i)=>{dots+=`<circle cx="${p2.x}" cy="${p2.y}" r="4" fill="${colors[i]}" stroke="#f7ecd9" stroke-width="1.5"/>`;});

    // Color polygon by dominant category
    document.getElementById('hexSvg').innerHTML=`
        ${rings}${spokes}
        <polygon points="${dataPath}" fill="rgba(167,139,250,.15)" stroke="#6b46c1" stroke-width="1.5" stroke-linejoin="round"/>
        ${dots}${lbls}`;

    // Legend with tag count and score
    document.getElementById('hexLabels').innerHTML = radarAxes.map((ax,i)=>{
        let tagStr='—';
        if(ax.key!=='_wr'&&ax.key!=='_res'){
            const relevant = activeTags.filter(o=>{
                const ip=o.tag?.impact_profile||{};
                return ax.axes.some(a=>Math.abs(parseFloat(ip[a])||0)>0);
            });
            tagStr = relevant.length ? relevant.slice(0,4).map(t=>t.tag.emoji).join('')+(relevant.length>4?'…':'') : '—';
        }
        return `<div class="hex-lbl-row">
            <div class="hex-lbl-dot" style="background:${ax.color};"></div>
            <span class="hex-lbl-text">${ax.icon} ${ax.label}</span>
            <span style="font-size:.65rem;color:#7d6849;flex:1;text-align:right;overflow:hidden;white-space:nowrap;">${tagStr}</span>
            <span class="hex-lbl-val">${vals[i].toFixed(1)}</span>
        </div>`;
    }).join('');
}
function buildRadarChart(p){ buildHexChart(p); }

// ── buildPlayerMatchHistory — Timeline style ─────────────────────
function buildPlayerMatchHistory(p){
    const matches=db.history.filter(h=>(h.orangePlayers||[]).includes(p.name)||(h.greenPlayers||[]).includes(p.name)||(h.blackPlayers||[]).includes(p.name));
    const el=document.getElementById('playerMatchHistory');
    if(!matches.length){el.innerHTML='<div style="text-align:center;padding:24px;color:#6b5840;">Niciun meci înregistrat.</div>';return;}
    const sorted=[...matches].sort((a,b)=>parseDateToObj(b.date)-parseDateToObj(a.date));
    el.innerHTML=sorted.map(h=>{
        const inOrange=(h.orangePlayers||[]).includes(p.name);
        const inBlack=(h.blackPlayers||[]).includes(p.name);
        const myTeam=inOrange?h.orangePlayers:inBlack?(h.blackPlayers||[]):h.greenPlayers;
        const oppTeam=inOrange?[...h.greenPlayers,...(h.blackPlayers||[])]:inBlack?[...h.orangePlayers,...h.greenPlayers]:h.orangePlayers;
        const won = playerWonMatch(h, p.name) === true;
        const teammates=(myTeam||[]).filter(n=>n!==p.name);
        const teamColor=inOrange?'#9c4f00':inBlack?'#555':'#1b7a35';
        const teamName=inOrange?'Portocaliu':inBlack?'Negru':'Verde';
        return `<div class="tl-item">
            <div class="tl-dot ${won?'W':'L'}"></div>
            <div class="tl-date">${h.date||'—'}</div>
            <div class="tl-result ${won?'W':'L'}">${won?'✅ CÂȘTIG':'❌ ÎNFRÂNGERE'} · <span style="color:${teamColor};font-size:.75rem;">${teamName}</span></div>
            ${teammates.length?`<div class="tl-mates">👥 ${teammates.join(' · ')}</div>`:''}
            ${(oppTeam||[]).length?`<div class="tl-mates" style="color:#2a2d3a;">⚔️ ${(oppTeam||[]).join(' · ')}</div>`:''}
        </div>`;
    }).join('');
}

// ── buildChemistry ──────────────────────────────────────────────
function buildChemistry(p){
    const el=document.getElementById('chemistryList');
    const myMatches=db.history.filter(h=>(h.orangePlayers||[]).includes(p.name)||(h.greenPlayers||[]).includes(p.name)||(h.blackPlayers||[]).includes(p.name));
    if(myMatches.length===0){el.innerHTML='<div style="text-align:center;padding:20px;color:#6b5840;">Insuficiente meciuri pentru calcul.</div>';return;}

    const chemMap={};
    myMatches.forEach(h=>{
        const inOrange=(h.orangePlayers||[]).includes(p.name);
        const inBlack=(h.blackPlayers||[]).includes(p.name);
        const myTeam=inOrange?h.orangePlayers:inBlack?(h.blackPlayers||[]):h.greenPlayers;
        const won = playerWonMatch(h, p.name) === true;
        (myTeam||[]).forEach(name=>{
            if(name===p.name)return;
            if(!chemMap[name])chemMap[name]={together:0,wins:0};
            chemMap[name].together++;
            if(won)chemMap[name].wins++;
        });
    });

    const total=myMatches.length;
    const results=Object.entries(chemMap).map(([name,d])=>{
        const freq=d.together/total;           // 0-1: cât de des au jucat împreună
        const wr=d.together>0?d.wins/d.together:0; // 0-1: win rate împreună
        const score=(freq*0.4+wr*0.6)*10;     // 0-10
        return{name,score,together:d.together,wins:d.wins,freq,wr};
    }).sort((a,b)=>b.score-a.score);

    if(!results.length){el.innerHTML='<div style="text-align:center;padding:24px;color:#6b5840;">Niciun coechipier comun.</div>';return;}

    const chemColor=s=>s>=8?'#2e7d32':s>=6?'#8bc34a':s>=4?'#ffd600':s>=2?'#9c4f00':'#a52020';
    const hearts=s=>{
        const filled=Math.round(s/2);
        return Array.from({length:5},(_,i)=>`<span class="chem-heart" style="opacity:${i<filled?1:.15};">❤️</span>`).join('');
    };

    el.innerHTML=results.map((r,i)=>{
        const partner=db.players.find(x=>x.name===r.name);
        const partnerSmart=partner?getSmartRating(partner).toFixed(1):'—';
        const rank=i===0?'🥇':i===1?'🥈':i===2?'🥉':'';
        const scoreColor=chemColor(r.score);
        const inits=r.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
        return `<div class="chem-mini-card">
            <div class="chem-mini-av" style="background:rgba(61,90,254,.12);border:2px solid rgba(61,90,254,.3);color:#1554b3;">${inits}</div>
            <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
                    <span style="font-weight:700;font-size:.9rem;color:#3a2f1f;">${r.name}</span>
                    <span style="font-size:.8rem;">${rank}</span>
                </div>
                <div class="chem-hearts">${hearts(r.score)}</div>
                <div style="font-size:.65rem;color:#6b5840;margin-top:3px;">${r.together} meciuri · ${(r.wr*100).toFixed(0)}% victorii</div>
            </div>
            <div style="text-align:right;">
                <div class="chem-mini-rating" style="color:${scoreColor};">${r.score.toFixed(1)}</div>
                <div style="font-size:.58rem;color:#6b5840;">CHIMIE</div>
                <div style="font-size:.68rem;color:#7d6849;margin-top:2px;">★ ${partnerSmart}</div>
            </div>
        </div>`;
    }).join('');
}

// ── Tabela overlay ──────────────────────────────────────────────
function openTableView(){
    document.getElementById('balancePopup').classList.remove('show');
    const o=db.players.filter(p=>p.status==='orange');
    const g=db.players.filter(p=>p.status==='green');
    const row=p=>`<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #f1e4c8;"><div style="width:28px;height:28px;border-radius:50%;background:#fdf3df;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:.65rem;color:#6b5840;">${p.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div><span style="font-weight:700;font-size:.88rem;">${p.name}</span></div>`;
    document.getElementById('tableOrangePlayers').innerHTML=o.length?o.map(row).join(''):'<div style="color:#7d6849;font-size:.85rem;padding:10px;">—</div>';
    document.getElementById('tableGreenPlayers').innerHTML=g.length?g.map(row).join(''):'<div style="color:#7d6849;font-size:.85rem;padding:10px;">—</div>';
    document.getElementById('tableOverlay').style.display='flex';
}
function closeTableView(){document.getElementById('tableOverlay').style.display='none';}
function buildCatTabs(p){document.getElementById('catTabs').innerHTML=CATS.map(c=>`<div class="cat-tab ${c===activeCatTab?'active':''}" onclick="switchCatTab('${c}')">${CAT_LABELS[c]}</div>`).join('');}
function switchCatTab(cat){activeCatTab=cat;const p=db.players.find(x=>x.id==currentPlayerId);buildCatTabs(p);buildRatingChart(p,cat);document.getElementById('chartLabel').textContent=`📈 Evoluție Rating — ${CAT_LABELS[cat]}`;}
function buildRatingChart(p,cat){
    if(ratingChartInstance){ratingChartInstance.destroy();ratingChartInstance=null;}
    const ctx=document.getElementById('ratingChart').getContext('2d');
    const labels=p.ratings.map((r,i)=>r.rater||`#${i+1}`),vals=p.ratings.map(r=>r[cat]||5);
    const avg=vals.reduce((a,b)=>a+b,0)/vals.length;
    ratingChartInstance=new Chart(ctx,{type:'line',data:{labels,datasets:[{label:'Rating',data:vals,borderColor:CAT_COLORS[cat],backgroundColor:CAT_COLORS[cat]+'15',pointBackgroundColor:CAT_COLORS[cat],pointRadius:4,tension:0.35,fill:true},{label:'Medie',data:vals.map(()=>avg),borderColor:'rgba(255,255,255,0.15)',borderDash:[5,5],pointRadius:0,fill:false}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{min:0,max:10,ticks:{color:'#7d6849',stepSize:2},grid:{color:'rgba(255,255,255,0.04)'}},x:{ticks:{color:'#7d6849',maxRotation:0,font:{size:9}},grid:{display:false}}}}});
}
function buildRatingsList(p){
    const el=document.getElementById('ratingsList'); if(!el) return;
    const count = p.ratings.length;
    const admin = isAdmin();
    const lbl = document.getElementById('ratingsListLabel');
    if(lbl) lbl.textContent = `📊 Voturi existente (${count})`;
    el.innerHTML = p.ratings.map((r,i) => `
        <div class="rating-entry">
            <div class="rating-entry-left">
                <span class="rating-entry-name">
                    ${admin ? `${r.rater} <span style="color:#6b5840;font-size:0.72rem;">${r.date||''}</span>` : `<span style="color:#7d6849;font-size:0.78rem;">${r.date||'—'}</span>`}
                </span>
                <span class="rating-entry-cats">⚽${r.general||5} ⚡${r.viteza||5} 🎯${r.tehnica||5} 🧠${r.strategie||5} 🛡️${r.aparare||5}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
                <span style="color:var(--star);">${((r.general+r.viteza+r.tehnica+r.strategie+r.aparare)/5).toFixed(1)} ★</span>
                ${admin ? `<button class="btn-delete-r" onclick="event.stopPropagation();deleteRating(${i})">✕</button>` : ''}
            </div>
        </div>`).join('');
}
function buildGeneralBigPicker(){
    const row=document.getElementById('stars-general-big');if(!row)return;row.innerHTML='';
    for(let i=1;i<=10;i++){const btn=document.createElement('button');btn.className='general-star-btn'+(i===selectedCats.general?' selected':'');btn.setAttribute('data-val',i);btn.textContent=i;btn.onclick=()=>selectGeneralStar(i);row.appendChild(btn);}
}
function selectGeneralStar(val){
    selectedCats.general=val;const valEl=document.getElementById('lbl-general-big');valEl.textContent=val;valEl.className='general-rating-val-big filled';
    document.querySelectorAll('#stars-general-big .general-star-btn').forEach((b,i)=>b.classList.toggle('selected',i+1===val));
    document.getElementById('generalRatingWrap').classList.add('has-value');document.getElementById('generalRequired').style.display='none';
}
function buildSubCatPickers(){
    ['viteza','tehnica','strategie','aparare'].forEach(cat=>{
        const row=document.getElementById(`stars-${cat}`);if(!row)return;row.innerHTML='';
        for(let i=1;i<=10;i++){const btn=document.createElement('button');btn.className='cat-star-btn'+(i===selectedCats[cat]?' selected':'');btn.textContent=i;btn.onclick=()=>selectSubCatStar(cat,i);row.appendChild(btn);}
    });
}
function selectSubCatStar(cat,val){
    selectedCats[cat]=val;const lbl=document.getElementById(`lbl-${cat}`);lbl.textContent=val;lbl.className='cat-val-badge set';
    document.querySelectorAll(`#stars-${cat} .cat-star-btn`).forEach((b,i)=>b.classList.toggle('selected',i+1===val));
}
function resetCatInputs(){
    selectedCats={general:null,viteza:null,tehnica:null,strategie:null,aparare:null};
    const valEl=document.getElementById('lbl-general-big');valEl.textContent='—';valEl.className='general-rating-val-big empty';
    document.getElementById('generalRatingWrap').classList.remove('has-value');document.getElementById('generalRequired').style.display='';
    buildGeneralBigPicker();
    ['viteza','tehnica','strategie','aparare'].forEach(c=>{const lbl=document.getElementById(`lbl-${c}`);if(lbl){lbl.textContent='—';lbl.className='cat-val-badge unset';}});
    buildSubCatPickers();
}
function handleOverlayClick(e){if(e.target===document.getElementById('modalOverlay'))closeModal();}
function closeModal(){document.getElementById('modalOverlay').style.display='none';}

async function submitRating(){
    const selVal=document.getElementById('raterSelect').value;
    if(!selVal){showToast('⚠️ Selectează cine votează!');return;}
    if(selectedCats.general===null){showToast('⚠️ Selectează nota generală!');return;}
    const name=selVal==='__other__'?(document.getElementById('raterCustom').value.trim()||'Anonim'):selVal;
    const g=selectedCats.general;
    const ratingData={rater:name,date:today,general:g,viteza:selectedCats.viteza??g,tehnica:selectedCats.tehnica??g,strategie:selectedCats.strategie??g,aparare:selectedCats.aparare??g};
    const p=db.players.find(x=>x.id==currentPlayerId);
    p.ratings.push({...ratingData,_dbId:null});
    openModal(currentPlayerId);render();
    showToast(`✅ Nota ${g} salvată! (${name})`);
    try{
        const dbId=await dbInsertRating(currentPlayerId,ratingData);
        p.ratings[p.ratings.length-1]._dbId=dbId;
    }catch(e){showToast('⚠️ Eroare salvare: '+e.message);}
}
async function deleteRating(index){
    const p=db.players.find(x=>x.id==currentPlayerId);
    if(p.ratings.length>1){
        const rating=p.ratings[index];
        p.ratings.splice(index,1);openModal(currentPlayerId);render();
        if(rating._dbId){
            try{await dbDeleteRating(rating._dbId);}catch(e){showToast('⚠️ '+e.message);}
        }
    }
}

// ── Match Detail Modal ──
async function openMatchModal(idx){
    const h=db.history[idx];
    const _wSide=getWinnerSideFromScore(h); // acum bazat pe winner string
    const isO=_wSide==='orange';
    const isG=_wSide==='green';
    const isB=_wSide==='black';
    const isEq=!isO&&!isG&&!isB;
    const bannerColor = isO?'var(--orange)':isG?'var(--green)':isB?'#555':'#7d6849';
    const bannerBg    = isO?'rgba(255,140,0,0.12)':isG?'rgba(40,167,69,0.12)':isB?'rgba(0,0,0,0.08)':'rgba(125,100,73,0.1)';

    document.getElementById('matchModalDate').textContent=`📅 ${h.date||'—'}`;
    const banner=document.getElementById('matchWinnerBanner');
    banner.textContent = isEq ? '🤝 Egal' : `🏆 ${h.winner} a câștigat`;
    banner.style.cssText=`background:${bannerBg};border:1px solid ${bannerColor};color:${bannerColor}`;
    document.getElementById('matchScore').textContent=h.score&&h.score!=='—'?`Scor: ${h.score}`:'';

    // Timing info (started_at / ended_at)
    const timingEl=document.getElementById('matchTiming');
    if(h.startedAt||h.endedAt){
        timingEl.style.display='block';
        let lines=[];
        const fmt=iso=>{if(!iso)return null;const d=new Date(iso);return d.toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit'});};
        const fmtDur=(s,e)=>{if(!s||!e)return null;const diff=Math.round((new Date(e)-new Date(s))/60000);return diff>0?diff+' minute':null;};
        if(h.startedAt) lines.push('▶ Start: '+fmt(h.startedAt));
        if(h.endedAt)   lines.push('⏹ Final: '+fmt(h.endedAt));
        const dur=fmtDur(h.startedAt,h.endedAt);
        if(dur) lines.push('⏱ Durată: '+dur);
        timingEl.innerHTML=lines.join(' &nbsp;·&nbsp; ');
    } else {
        timingEl.style.display='none';
    }

    // Load match_goals from DB — one row per goal event
    let goalsData=[];
    if(h._dbId){
        try{
            const{data}=await sb.from('match_goals').select('*').eq('match_id',h._dbId).order('minute',{ascending:true,nullsFirst:false});
            goalsData=data||[];
        }catch(e){ console.warn('match_goals load:',e.message); }
    }

    // Aggregate per player
    const goalsByPlayer={};
    goalsData.forEach(g=>{
        if(!goalsByPlayer[g.player_name]) goalsByPlayer[g.player_name]={goals:0,conceded:0,team:g.team,minutes:[]};
        goalsByPlayer[g.player_name].goals+=(g.goals||1);
        goalsByPlayer[g.player_name].conceded+=(g.goals_conceded||0);
        if(g.minute!=null) goalsByPlayer[g.player_name].minutes.push(g.minute);
    });

    // Render team players with goal counts
    const renderTeam=(names,team,color)=>{
        if(!names?.length) return '<div class="match-team-player" style="color:#6b5840">—</div>';
        return names.map(n=>{
            const gd=goalsByPlayer[n];
            const goalsHtml=gd?.goals>0?` <span style="color:#1b7a43;font-size:.7rem;">⚽×${gd.goals}${gd.minutes?.length?' ('+gd.minutes.map(m=>m+"'").join(', ')+')':''}</span>`:'';
            const gcHtml=gd?.conceded>0?` <span style="color:#b71c1c;font-size:.7rem;">🧤×${gd.conceded}</span>`:'';
            return `<div class="match-team-player">${n}${goalsHtml}${gcHtml}</div>`;
        }).join('');
    };

    document.getElementById('matchOrangePlayers').innerHTML=renderTeam(h.orangePlayers,'orange','#9c4f00');
    document.getElementById('matchGreenPlayers').innerHTML=renderTeam(h.greenPlayers,'green','#1b7a35');
    const blackBlock = document.getElementById('matchBlackBlock');
    const blackPls = h.blackPlayers || [];
    if (blackBlock) {
        blackBlock.style.display = blackPls.length ? 'block' : 'none';
        document.getElementById('matchBlackPlayers').innerHTML = renderTeam(blackPls,'black','#555');
    }

    // Goal timeline — each row in goalsData is one goal event
    const tlEl=document.getElementById('matchTimeline');
    const tlBody=document.getElementById('matchTimelineBody');
    // Only rows with goals=1 (new format, one row per goal with minute)
    const goalEvents=goalsData.filter(g=>g.goals===1&&g.minute!=null);
    goalEvents.sort((a,b)=>a.minute-b.minute);

    if(goalEvents.length>0){
        tlEl.style.display='block';
        tlBody.innerHTML=goalEvents.map(ev=>{
            const teamColor=ev.team==='orange'?'var(--orange)':'#2e7d32';
            return `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #f5e9d4;">
                <span style="font-family:'Bebas Neue',sans-serif;font-size:.9rem;color:var(--star);min-width:32px;text-align:right;letter-spacing:-.5px;">${ev.minute}'</span>
                <div style="width:7px;height:7px;border-radius:50%;background:${teamColor};flex-shrink:0;"></div>
                <span style="flex:1;font-weight:700;font-size:.85rem;">${ev.player_name}</span>
                <span style="font-size:.8rem;">⚽</span>
            </div>`;
        }).join('');
    } else if(goalsData.some(g=>g.goals>0)){
        // Old format — has goals but no per-minute rows; show compact list
        tlEl.style.display='block';
        const allScoredOld=goalsData.filter(g=>g.goals>0).sort((a,b)=>b.goals-a.goals);
        tlBody.innerHTML='<div style="font-size:.68rem;color:#6b5840;margin-bottom:6px;">Minute indisponibile — rulează SQL migration pentru meciuri viitoare</div>'
            +allScoredOld.map(ev=>{
                const teamColor=ev.team==='orange'?'var(--orange)':'#2e7d32';
                const balls='⚽'.repeat(Math.min(ev.goals,8))+(ev.goals>8?'×'+ev.goals:'');
                return `<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #f5e9d4;">
                    <div style="width:7px;height:7px;border-radius:50%;background:${teamColor};flex-shrink:0;margin-left:8px;"></div>
                    <span style="flex:1;font-weight:700;font-size:.85rem;">${ev.player_name}</span>
                    <span style="font-size:.75rem;">${balls}</span>
                </div>`;
            }).join('');
    } else {
        tlEl.style.display='none';
    }

    renderMatchRounds(h);

    document.getElementById('matchModalOverlay').style.display='flex';
}
function closeMatchModal(){document.getElementById('matchModalOverlay').style.display='none';}

// ── Rounds history block (mod 3 echipe) ──
function renderMatchRounds(h){
    const sectEl = document.getElementById('matchRoundsSection');
    const bodyEl = document.getElementById('matchRoundsBody');
    const rd = h.roundsDetail;
    if(!Array.isArray(rd) || !rd.length){ sectEl.style.display='none'; return; }

    const reasonIcon  = {goals:'⚽',time:'⏱',manual:'✋',final:'🏁',penalty:'🥅'};
    const reasonLabel = {goals:'goluri',time:'timp',manual:'manual',final:'final',penalty:'penalty'};
    const outReasonText = {
        goals:   'prea multe goluri primite',
        time:    'timp expirat',
        manual:  'schimbare manuală',
        final:   'final meci',
        penalty: 'egalitate — decis la penalty',
    };

    bodyEl.innerHTML = rd.map(r=>{
        const icon  = reasonIcon[r.end_reason]  || '•';
        const label = reasonLabel[r.end_reason] || r.end_reason || '';
        const m = r.duration_sec ? Math.floor(r.duration_sec/60) : 0;
        const s = r.duration_sec ? r.duration_sec%60 : 0;
        const durStr = r.duration_sec ? `${m}:${String(s).padStart(2,'0')}` : '—';

        let subLines = '';
        if(r.loser_name){
            subLines += `<div style="font-size:.62rem;color:#7d6849;margin-top:2px;">↩ <b>${r.loser_name}</b> iese — ${outReasonText[r.end_reason]||''}</div>`;
        }
        let penScoreHtml = '';
        if(r.end_reason==='penalty' && Array.isArray(r.penalty_shots) && r.penalty_shots.length){
            const penA = r.penalty_shots.filter(s=>s.team==='orange'&&s.state==='goal').length;
            const penB = r.penalty_shots.filter(s=>s.team==='green' &&s.state==='goal').length;
            penScoreHtml = ` <span style="color:#7d6849;font-weight:400;">(pen ${penA}-${penB})</span>`;
        }
        if(r.end_reason==='penalty' && r.penalty_winner_name){
            subLines += `<div style="font-size:.62rem;color:#7d6849;margin-top:2px;">🏆 <b style="color:#1b7a43;">${r.penalty_winner_name}</b> câștigă la penalty</div>`;
        }

        return `<div style="padding:6px 0;border-bottom:1px solid #e3d3ac;">
            <div style="display:flex;align-items:center;gap:6px;font-size:.72rem;">
                <span style="color:#6b5840;min-width:44px;">Tur ${r.num}</span>
                <span style="color:#3a2f1f;font-weight:700;flex:1;">${r.score_a}-${r.score_b}${penScoreHtml}</span>
                <span style="color:#7d6849;font-weight:700;">${icon} ${label}</span>
                <span style="color:#7d6849;font-size:.65rem;min-width:38px;text-align:right;">⏲ ${durStr}</span>
            </div>
            ${subLines}
        </div>`;
    }).join('');
    sectEl.style.display='block';
}

function openCSVModal(){document.getElementById('csvModalOverlay').style.display='flex';}
function closeCsvModal(){document.getElementById('csvModalOverlay').style.display='none';csvParsed=null;document.getElementById('csvPreviewArea').style.display='none';}
function previewCSV(event){
    const file=event.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=e=>{
        try{
            const lines=e.target.result.split('\n').filter(l=>l.trim()),headers=parseCSVLine(lines[0]),results=[];
            for(let row=1;row<lines.length;row++){const vals=parseCSVLine(lines[row]);if(vals.length<3)continue;const evaluator=vals[1]||'Anonim',rowDate=vals[0]?vals[0].split(' ')[0]:today,pR={};
                for(let col=2;col<headers.length;col++){const parts=(headers[col]||'').split('-').map(s=>s.trim());if(parts.length<2)continue;const pName=parts[0].trim(),catRaw=parts[1].toLowerCase().trim().replace('viteză','viteza').replace('tehnică','tehnica').replace('apărare','aparare');if(!CATS.includes(catRaw))continue;if(!pR[pName])pR[pName]={general:5,viteza:5,tehnica:5,strategie:5,aparare:5};pR[pName][catRaw]=Math.min(10,Math.max(1,parseInt(vals[col])||5));}
                Object.entries(pR).forEach(([name,cats])=>{const match=db.players.find(p=>p.name.toLowerCase()===name.toLowerCase());results.push({evaluator,date:rowDate,playerName:name,cats,matched:!!match,matchedPlayer:match});});}
            csvParsed=results;
            document.getElementById('csvResultRows').innerHTML=results.map(r=>`<div class="csv-result-row"><span class="${r.matched?'csv-match':'csv-no-match'}">${r.matched?'✓':'✗'} ${r.playerName}</span><span style="color:#6b5840;font-size:0.75rem;">${r.evaluator} — ⚽${r.cats.general}</span></div>`).join('');
            document.getElementById('csvPreviewArea').style.display='block';
        }catch(err){showToast('❌ Eroare CSV: '+err.message);}
    };reader.readAsText(file);
}
function parseCSVLine(line){const r=[];let cur='',inQ=false;for(const ch of line){if(ch==='"')inQ=!inQ;else if(ch===','&&!inQ){r.push(cur.trim());cur='';}else cur+=ch;}r.push(cur.trim());return r;}
async function confirmCSVImport(){
    if(!csvParsed)return;
    let n=0;
    for(const r of csvParsed){
        if(r.matched&&r.matchedPlayer){
            const rData={rater:r.evaluator,date:r.date,...r.cats};
            r.matchedPlayer.ratings.push({_dbId:null,...rData});
            try{const dbId=await dbInsertRating(r.matchedPlayer.id,rData);r.matchedPlayer.ratings[r.matchedPlayer.ratings.length-1]._dbId=dbId;}catch(e){}
            n++;
        }
    }
    render();closeCsvModal();showToast(`✅ Import reușit! ${n} evaluări adăugate.`);
}

function exportData(){
    const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`fotbal_backup_${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);
}
async function importData(event){
    const file=event.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=async e=>{
        try{
            const imp=JSON.parse(e.target.result);if(!imp.players||!imp.history)throw new Error('Format invalid');
            showConfirm('📂','Import Date?',`${imp.players.length} jucători. Datele actuale vor fi suprascrise.`,'Import','#1a4a7a',async()=>{
                showLoading(true);
                try{
                    // Wipe existing
                    await sb.from('ratings').delete().neq('id','00000000-0000-0000-0000-000000000000');
                    await sb.from('players').delete().neq('id',0);
                    // Insert imported
                    for(const p of imp.players){
                        await sb.from('players').insert({id:p.id,name:p.name,status:p.status||'bench',wins:p.wins||0,games:p.games||0,match_history:p.matchHistory||[]});
                        if(p.ratings?.length){
                            const rRows=p.ratings.map(r=>({player_id:p.id,rater:r.rater||'?',date:r.date||'—',general:r.general||r.value||5,viteza:r.viteza||r.value||5,tehnica:r.tehnica||r.value||5,strategie:r.strategie||r.value||5,aparare:r.aparare||r.value||5}));
                            await sb.from('ratings').insert(rRows);
                        }
                    }
                    for(const h of imp.history){await sb.from('match_history').insert({date:h.date,winner:h.winner,score:h.score,orange_players:h.orangePlayers||[],green_players:h.greenPlayers||[]});}
                    await loadAll();
                    showToast('✅ Import reușit!');
                }catch(e){showToast('❌ Import eșuat: '+e.message);}
                finally{showLoading(false);}
            });
        }catch{showToast('❌ Fișier invalid!');}
    };reader.readAsText(file);event.target.value='';
}

function exportPDF(){
    const {jsPDF}=window.jspdf;const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
    const W2=210,M=16;let y=20;
    const C={orange:[255,140,0],green:[40,167,69],dark:[14,17,24],card:[30,34,48],grey:[42,45,60],light:[190,195,215],star:[255,204,0],white:[255,255,255],purple:[167,139,250]};
    const bg=()=>{doc.setFillColor(...C.dark);doc.rect(0,0,W2,297,'F');};bg();
    doc.setFillColor(...C.card);doc.roundedRect(M,y-6,W2-M*2,24,4,4,'F');
    doc.setFont('helvetica','bold');doc.setFontSize(18);doc.setTextColor(...C.white);
    doc.text(document.getElementById('clubTitle').textContent.trim(),W2/2,y+5,{align:'center'});
    doc.setFontSize(8);doc.setFont('helvetica','normal');doc.setTextColor(...C.light);
    doc.text(`Raport sezon — ${new Date().toLocaleDateString('ro-RO')}`,W2/2,y+13,{align:'center'});y+=28;
    const tG=db.history.length,oW=db.history.filter(h=>h.winner==='Portocaliu').length;
    const active=db.players.filter(p=>p.games>0);
    const top=active.length?[...active].sort((a,b)=>getSmartRating(b)-getSmartRating(a))[0]:null;
    const boxes=[{label:'Meciuri',val:tG},{label:'Portocaliu',val:oW},{label:'Verde',val:tG-oW},{label:'Activi',val:active.length}];
    const bw=(W2-M*2-9)/4;
    boxes.forEach((b,i)=>{const bx=M+i*(bw+3);doc.setFillColor(...C.grey);doc.roundedRect(bx,y,bw,17,3,3,'F');doc.setFontSize(16);doc.setFont('helvetica','bold');doc.setTextColor(...C.star);doc.text(String(b.val),bx+bw/2,y+9,{align:'center'});doc.setFontSize(7);doc.setFont('helvetica','normal');doc.setTextColor(...C.light);doc.text(b.label,bx+bw/2,y+14.5,{align:'center'});});y+=22;
    if(top){const wr=((top.wins/top.games)*100).toFixed(0);doc.setFillColor(25,65,40);doc.roundedRect(M,y,W2-M*2,11,3,3,'F');doc.setFontSize(9);doc.setFont('helvetica','bold');doc.setTextColor(...C.white);doc.text(`MVP: ${top.name}   ${wr}% victorii   Smart: ${getSmartRating(top).toFixed(2)}   General: ${getGeneralAvg(top).toFixed(1)}`,W2/2,y+7,{align:'center'});y+=16;}
    doc.setFontSize(10);doc.setFont('helvetica','bold');doc.setTextColor(...C.white);doc.text('CLASAMENT SMART RATING',M,y+5);y+=9;
    const lC=[M,M+8,M+60,M+82,M+100,M+118,M+136,M+155,M+172];
    doc.setFillColor(...C.grey);doc.rect(M,y,W2-M*2,7,'F');doc.setFontSize(6.5);doc.setFont('helvetica','bold');doc.setTextColor(...C.light);['#','Nume','Smart','General','Vit','Teh','Str','Apar','Win%'].forEach((h,i)=>doc.text(h,lC[i]+1,y+5));y+=7;
    [...db.players].sort((a,b)=>getSmartRating(b)-getSmartRating(a)).forEach((p,idx)=>{
        if(y>260){doc.addPage();bg();y=16;}
        doc.setFillColor(idx%2===0?20:25,idx%2===0?23:28,idx%2===0?35:42);doc.rect(M,y,W2-M*2,7,'F');
        const wr=p.games>0?((p.wins/p.games)*100).toFixed(0)+'%':'—';
        doc.setFontSize(7);doc.setFont('helvetica','normal');doc.setTextColor(...C.light);doc.text(`${idx+1}.`,lC[0]+1,y+5);doc.text(p.name.slice(0,20),lC[1],y+5);
        doc.setTextColor(...C.purple);doc.text(getSmartRating(p).toFixed(2),lC[2],y+5);doc.setTextColor(...C.star);doc.text(getGeneralAvg(p).toFixed(1),lC[3],y+5);
        doc.setTextColor(...C.light);['viteza','tehnica','strategie','aparare'].forEach((c,ci)=>doc.text(getCatAvg(p,c).toFixed(1),lC[4+ci],y+5));doc.text(wr,lC[8],y+5);y+=7;
    });
    doc.setFontSize(7);doc.setTextColor(50,55,70);doc.text(`${document.getElementById('clubTitle').textContent.trim()} — Manager Fotbal 2026`,W2/2,292,{align:'center'});
    doc.save(`raport_fotbal_${new Date().toISOString().slice(0,10)}.pdf`);
}

async function registerServiceWorker(){
    if(!('serviceWorker' in navigator))return;
    try{
        await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registered');
    }catch(e){
        console.log('SW registration skipped (local dev?):', e.message);
    }
}

let matchEditorIdx = null; // null = nou, number = editare
let matchEditorWinner = null;

async function openMatchEditor(idx) {
    if (idx === null || idx === undefined || !db.history[idx]) return; // doar editare — nu mai există creare manuală
    matchEditorIdx = idx;
    matchEditorWinner = null;

    document.getElementById('matchEditorTitle').textContent = '✏️ Editează Meci';
    document.getElementById('meDeleteBtn').style.display = 'block';

    // Reset fields
    document.getElementById('meDate').value = '';
    document.getElementById('meWinO').className = 'me-winner-btn';
    document.getElementById('meWinG').className = 'me-winner-btn';
    document.getElementById('meWinB').className = 'me-winner-btn';
    document.getElementById('meScoreO').value = 0;
    document.getElementById('meScoreG').value = 0;
    document.getElementById('meScoreB').value = 0;
    document.getElementById('meGoalsList').innerHTML = '';
    document.getElementById('meConcededList').innerHTML = '';
    meGoalEvents = [];

    const h = db.history[idx];
    document.getElementById('meDate').value = h.date || '';
    if (h.winner) setMatchWinner(h.winner);
    buildMePlayerLists(h.orangePlayers || [], h.greenPlayers || [], h.blackPlayers || []);
    // Populate score — mapăm pozițional NUMERELE din h.score pe sloturile
    // de culoare care sunt ACTIV implicate în acest meci (nu mereu O apoi G!).
    // La un meci dintr-o sesiune 3 echipe, perechea poate fi Verde-Negru (fără
    // Portocaliu deloc) — vechea logică presupunea mereu "O:G[:B]" și, dacă
    // scorul avea deja 3 părți (ex. corupt dintr-o editare anterioară), pica
    // silențios pe 0:0:0. Acum acceptă orice număr de părți.
    const activeColorsForScore = [];
    if ((h.orangePlayers||[]).length) activeColorsForScore.push('O');
    if ((h.greenPlayers ||[]).length) activeColorsForScore.push('G');
    if ((h.blackPlayers ||[]).length) activeColorsForScore.push('B');
    if(h.score && h.score !== '—'){
        const parts = h.score.split(':').map(s=>parseInt(s)||0);
        parts.forEach((val, i) => {
            const col = activeColorsForScore[i];
            if (col) document.getElementById('meScore'+col).value = val;
        });
    }

    // Încarcă golurile REALE (eveniment cu eveniment, cu minut) direct din DB, nu doar agregatul local
    let existingConceded = {};
    if (h._dbId) {
        try {
            const { data: goalRows } = await sb.from('match_goals').select('*').eq('match_id', h._dbId).order('minute', { ascending: true, nullsFirst: false });
            (goalRows||[]).forEach(g=>{
                if ((g.goals||0) > 0) {
                    meGoalEvents.push({ player: g.player_name, minute: g.minute!=null ? g.minute : '', goals: g.goals });
                }
                if ((g.goals_conceded||0) > 0) {
                    existingConceded[g.player_name] = (existingConceded[g.player_name]||0) + g.goals_conceded;
                }
            });
        } catch(e) { console.warn('load goals for editor:', e.message); }
    }
    renderMeGoalEvents();
    buildMeConcededList(h.orangePlayers||[], h.greenPlayers||[], h.blackPlayers||[], existingConceded);

    // Arată "Negru" doar dacă meciul are efectiv jucători pe echipa neagră
    updateMeTeamVisibility();

    document.getElementById('matchEditorOverlay').style.display = 'flex';
}

function closeMatchEditor() {
    document.getElementById('matchEditorOverlay').style.display = 'none';
    meGoalEvents = [];
}

function setMatchWinner(winner) {
    matchEditorWinner = winner;
    document.getElementById('meWinO').className = 'me-winner-btn' + (winner==='Portocaliu'?' active-o':'');
    document.getElementById('meWinG').className = 'me-winner-btn' + (winner==='Verde'?' active-g':'');
    const wb = document.getElementById('meWinB');
    if(wb) wb.className = 'me-winner-btn' + (winner==='Negru'?' active-b':'');
}

function buildMePlayerLists(orangeNames, greenNames, blackNames=[]) {
    const sorted = [...db.players].sort((a,b) => a.name.localeCompare(b.name));

    ['Orange','Green','Black'].forEach(team => {
        const names = team==='Orange'?orangeNames:team==='Green'?greenNames:blackNames;
        const container = document.getElementById(`me${team}Players`);
        if(!container) return;
        container.innerHTML = sorted.map(p => {
            const checked = names.includes(p.name);
            return `<label class="me-player-check ${checked?'checked':''}" id="mecheck-${team}-${p.id}">
                <input type="checkbox" ${checked?'checked':''} onchange="mePLayerToggle(this,'${team}',${p.id})">
                <span>${p.name}</span>
            </label>`;
        }).join('');
    });
}

// ── Editor de goluri pe evenimente: fiecare gol = jucător + minut + câte (de obicei 1) ──
let meGoalEvents = []; // [{player, minute, goals}]

function getMeAllMatchPlayers(){
    return [
        ...getMeSelectedPlayers('Orange').map(n=>({name:n,team:'orange',color:'#9c4f00'})),
        ...getMeSelectedPlayers('Green').map(n=>({name:n,team:'green',color:'#1b7a35'})),
        ...getMeSelectedPlayers('Black').map(n=>({name:n,team:'black',color:'#555'})),
    ];
}

function addGoalEventRow(){
    const players = getMeAllMatchPlayers();
    if(!players.length){ showToast('⚠️ Selectează jucătorii meciului mai întâi!'); return; }
    meGoalEvents.push({ player: players[0].name, minute: '', goals: 1 });
    renderMeGoalEvents();
}
function removeGoalEventRow(i){
    meGoalEvents.splice(i,1);
    renderMeGoalEvents();
}
function updateGoalEventField(i, field, value){
    if(!meGoalEvents[i]) return;
    meGoalEvents[i][field] = value;
}

function renderMeGoalEvents(){
    const list = document.getElementById('meGoalsList');
    if(!list) return;
    const allPlayers = getMeAllMatchPlayers();
    if(!allPlayers.length){
        list.innerHTML = '<div style="color:#7d6849;font-size:.78rem;padding:6px;">Selectează jucători mai întâi.</div>';
        return;
    }
    const rowsHtml = meGoalEvents.map((ev,i)=>{
        const pl = allPlayers.find(p=>p.name===ev.player);
        const color = pl?.color || '#3a2f1f';
        const options = allPlayers.map(p=>`<option value="${p.name}" ${ev.player===p.name?'selected':''}>${p.name}</option>`).join('');
        return `<div style="display:flex;align-items:center;gap:5px;padding:4px 6px;background:#f5e9d4;border-radius:6px;">
            <span style="font-size:.7rem;color:#7d6849;">⚽</span>
            <select onchange="updateGoalEventField(${i},'player',this.value)" style="flex:1;min-width:0;font-size:.78rem;padding:4px;border-radius:5px;border:1px solid #dcc89a;background:#fffaf0;color:${color};">${options}</select>
            <input type="number" inputmode="numeric" value="${ev.minute}" placeholder="min" oninput="updateGoalEventField(${i},'minute',this.value)" style="width:50px;font-size:.78rem;padding:4px;border-radius:5px;border:1px solid #dcc89a;text-align:center;">
            <span style="font-size:.65rem;color:#7d6849;">′</span>
            <button onclick="removeGoalEventRow(${i})" style="width:24px;height:24px;border-radius:5px;background:rgba(198,40,40,.1);border:1px solid #c62828;color:#b71c1c;font-size:.9rem;cursor:pointer;flex-shrink:0;">×</button>
        </div>`;
    }).join('');
    list.innerHTML = rowsHtml + `<button onclick="addGoalEventRow()" style="margin-top:2px;padding:8px;border-radius:7px;background:rgba(40,167,69,.1);border:1px dashed #28a745;color:#1b7a43;font-weight:700;font-size:.78rem;cursor:pointer;">+ Adaugă Gol</button>`;
}

// ── Goluri primite (per jucător) — rămâne un simplu contor +/- ──
function buildMeConcededList(orangeNames, greenNames, blackNames=[], existingConceded={}){
    const list = document.getElementById('meConcededList');
    if(!list) return;
    const allPlayers = [...orangeNames.map(n=>({name:n,color:'#9c4f00'})),...greenNames.map(n=>({name:n,color:'#1b7a35'})),...(blackNames||[]).map(n=>({name:n,color:'#555'}))];
    if(!allPlayers.length){ list.innerHTML='<div style="color:#7d6849;font-size:.78rem;padding:6px;">Selectează jucători mai întâi.</div>'; return; }
    list.innerHTML = allPlayers.map(pl=>{
        const key = pl.name.replace(/ /g,'__');
        const conceded = existingConceded[pl.name]||0;
        return `<div style="display:flex;align-items:center;gap:5px;padding:4px 6px;background:#f5e9d4;border-radius:6px;">
            <span style="flex:1;font-size:.8rem;color:${pl.color};">${pl.name}</span>
            <span style="font-size:.6rem;color:#7d6849;">🧤</span>
            <button onclick="meGoalStep('${key}','conceded',-1)" style="width:22px;height:22px;border-radius:5px;background:#fdf3df;border:1px solid #dcc89a;color:#7d6849;font-size:.85rem;cursor:pointer;">−</button>
            <span id="meg-conceded-${key}" style="font-family:'Bebas Neue',sans-serif;font-size:.95rem;color:#b71c1c;min-width:16px;text-align:center;">${conceded}</span>
            <button onclick="meGoalStep('${key}','conceded',1)" style="width:22px;height:22px;border-radius:5px;background:rgba(198,40,40,.08);border:1px solid #c62828;color:#b71c1c;font-size:.85rem;cursor:pointer;">+</button>
        </div>`;
    }).join('');
}

function meGoalStep(key, type, delta){
    const el = document.getElementById(`meg-${type}-${key}`);
    if(!el) return;
    let cur = parseInt(el.textContent)||0;
    cur = Math.max(0, cur+delta);
    el.textContent = cur;
}

function captureCurrentConceded(){
    const result = {};
    document.querySelectorAll('[id^="meg-conceded-"]').forEach(el=>{
        const val = parseInt(el.textContent)||0;
        if(val>0){
            const name = el.id.replace('meg-conceded-','').replace(/__/g,' ');
            result[name] = val;
        }
    });
    return result;
}

function mePLayerToggle(el, team, playerId) {
    const label = el.closest('.me-player-check');
    label.classList.toggle('checked', el.checked);
    ['Orange','Green','Black'].filter(t=>t!==team).forEach(ot=>{
        const lbl=document.getElementById(`mecheck-${ot}-${playerId}`);
        if(lbl&&el.checked){lbl.querySelector('input').checked=false;lbl.classList.remove('checked');}
    });
    renderMeGoalEvents();
    buildMeConcededList(getMeSelectedPlayers('Orange'),getMeSelectedPlayers('Green'),getMeSelectedPlayers('Black'), captureCurrentConceded());
    updateMeTeamVisibility();
}

// Arată scorul + butonul "Negru" doar dacă există jucători bifați pe echipa Negru
// Ascunde/arată sloturile de scor & câștigător pentru Portocaliu / Negru, în
// funcție de cine e efectiv selectat în meci. Verde rămâne mereu vizibil (e
// întotdeauna implicat, fie la un meci normal 2 echipe, fie într-o pereche de
// sesiune). IMPORTANT: Portocaliu nu mai e presupus mereu prezent — o pereche
// dintr-o sesiune 3 echipe poate fi Verde-Negru, fără Portocaliu deloc, caz în
// care sloturile lui trebuie ascunse la fel cum se întâmplă deja cu Negru.
function updateMeTeamVisibility() {
    const hasOrange = getMeSelectedPlayers('Orange').length > 0;
    const hasBlack  = getMeSelectedPlayers('Black').length  > 0;

    const winO = document.getElementById('meWinO');
    const blkO = document.getElementById('meScoreBlockO');
    const sepOG= document.getElementById('meScoreSepOG');
    const winB = document.getElementById('meWinB');
    const sepB = document.getElementById('meScoreSepB');
    const blkB = document.getElementById('meScoreBlockB');

    if (winO)  winO.style.display  = hasOrange ? '' : 'none';
    if (blkO)  blkO.style.display  = hasOrange ? '' : 'none';
    if (sepOG) sepOG.style.display = hasOrange ? '' : 'none';
    if (winB)  winB.style.display  = hasBlack ? '' : 'none';
    if (sepB)  sepB.style.display  = hasBlack ? '' : 'none';
    if (blkB)  blkB.style.display  = hasBlack ? '' : 'none';

    // Dacă o echipă dispare și era selectată ca și câștigătoare, resetăm
    if (!hasOrange && matchEditorWinner === 'Portocaliu') {
        matchEditorWinner = null;
        if (winO) winO.className = 'me-winner-btn';
    }
    if (!hasBlack && matchEditorWinner === 'Negru') {
        matchEditorWinner = null;
        if (winB) winB.className = 'me-winner-btn';
    }
    // Scorurile rămase ascunse nu trebuie să influențeze salvarea — le resetăm la 0
    if (!hasOrange) { const so = document.getElementById('meScoreO'); if (so) so.value = 0; }
    if (!hasBlack)  { const sb = document.getElementById('meScoreB'); if (sb) sb.value = 0; }
}

function getMeSelectedPlayers(team) {
    return [...document.querySelectorAll(`#me${team}Players .me-player-check input:checked`)]
        .map(el => {
            const id = parseInt(el.closest('label').id.split('-')[2]);
            return db.players.find(p => p.id === id)?.name;
        }).filter(Boolean);
}

let _savingMatchEdit = false; // blochează salvări duble (dublu-click / dublă invocare) care duplicau golurile în DB
async function saveMatchEdit() {
    if (_savingMatchEdit) return; // deja se salvează — ignorăm orice apăsare suplimentară
    if (matchEditorIdx === null || matchEditorIdx === undefined) return; // doar editare — nu mai există creare manuală
    const date   = document.getElementById('meDate').value.trim();
    const winner = matchEditorWinner;

    if (!date)   { showToast('⚠️ Introduceți data meciului!'); return; }
    if (!winner) { showToast('⚠️ Selectați câștigătorul!');   return; }

    _savingMatchEdit = true;
    const saveBtn = document.querySelector('#matchEditorOverlay .me-actions button[onclick="saveMatchEdit()"]')
        || [...document.querySelectorAll('#matchEditorOverlay button')].find(b=>b.textContent.includes('Salvează Meciul'));
    if (saveBtn) { saveBtn.disabled = true; saveBtn.style.opacity = '0.6'; saveBtn.textContent = '⏳ Se salvează...'; }

    const orangePlayers = getMeSelectedPlayers('Orange');
    const greenPlayers  = getMeSelectedPlayers('Green');
    const blackPlayers  = getMeSelectedPlayers('Black');
    const scoreO = parseInt(document.getElementById('meScoreO')?.value)||0;
    const scoreG = parseInt(document.getElementById('meScoreG')?.value)||0;
    const scoreB = parseInt(document.getElementById('meScoreB')?.value||'0')||0;
    // Scorul se construiește DOAR din culorile efectiv implicate în meci, în
    // ordine canonică O,G,B — nu mai adăugăm orbește un al treilea număr.
    // Asta cauza bug-ul "2:3:0": la o pereche dintr-o sesiune 3 echipe fără
    // Portocaliu (ex. Verde-Negru), se adăuga mereu un scor 0 pentru Negru
    // în plus față de cele 2 numere reale, coruptând scorul.
    const activeScores = [];
    if (orangePlayers.length) activeScores.push(scoreO);
    if (greenPlayers.length)  activeScores.push(scoreG);
    if (blackPlayers.length)  activeScores.push(scoreB);
    const hasManualScore = activeScores.some(s => s > 0);
    const score = hasManualScore ? activeScores.join(':') : '—';
    const imbalanced = hasManualScore && activeScores.length===2 && Math.abs(activeScores[0]-activeScores[1]) >= 3;

    // Colectăm golurile — un rând per gol individual, cu jucător + minut reale
    const goalsConceded = {};
    [...orangePlayers,...greenPlayers,...blackPlayers].forEach(name=>{
        const key = name.replace(/ /g,'__');
        const conceded = parseInt(document.getElementById('meg-conceded-'+key)?.textContent)||0;
        if(conceded>0) goalsConceded[name]=conceded;
    });

    // Validăm evenimentele de gol: jucătorul trebuie să fie în meci, numărul de goluri >=1
    const validGoalEvents = meGoalEvents.filter(ev => ev.player && [...orangePlayers,...greenPlayers,...blackPlayers].includes(ev.player));
    const invalidCount = meGoalEvents.length - validGoalEvents.length;
    if (invalidCount > 0) {
        showToast(`⚠️ ${invalidCount} gol(uri) ignorate — jucătorul nu mai e selectat în meci.`);
    }

    // playerGoals local (pentru afișare imediată, fără reload) — sumă pe jucător
    // Fiecare eveniment = exact 1 gol (un jucător nu poate da 2 goluri în același minut)
    const goals = {};
    validGoalEvents.forEach(ev => {
        goals[ev.player] = (goals[ev.player]||0) + 1;
    });

    const entry = { date, winner, score, imbalanced, orangePlayers, greenPlayers, blackPlayers, playerGoals: goals };

    const h = db.history[matchEditorIdx];
    const dbId = h._dbId;
    Object.assign(h, entry);
    try {
        if (dbId) {
            await sb.from('match_history').update({
                date, winner, score, imbalanced,
                orange_players: orangePlayers,
                green_players:  greenPlayers,
                black_players:  blackPlayers
            }).eq('id', dbId);
            entry._dbId = dbId; h._dbId = dbId;
            // Update goals: delete old, insert new
            const { error: delErr } = await sb.from('match_goals').delete().eq('match_id', dbId);
            if (delErr) throw new Error('Ștergere goluri vechi eșuată: ' + delErr.message);

            // Verificare: dacă Supabase (ex. o politică RLS pe DELETE) blochează silențios
            // ștergerea — fără să arunce eroare — rândurile vechi ar rămâne, iar cele noi
            // s-ar aduna peste ele (exact bug-ul "adaugă goluri în loc să șteargă/editeze").
            // Verificăm explicit că nu a mai rămas nimic înainte să inserăm rândurile noi.
            const { count: leftoverCount, error: checkErr } = await sb
                .from('match_goals')
                .select('id', { count: 'exact', head: true })
                .eq('match_id', dbId);
            if (checkErr) throw new Error('Verificare goluri vechi eșuată: ' + checkErr.message);
            if (leftoverCount && leftoverCount > 0) {
                throw new Error(`Nu s-au putut șterge ${leftoverCount} goluri vechi din baza de date (posibil o politică RLS pe DELETE pentru tabela match_goals). Salvarea a fost oprită ca să nu dubleze golurile — verifică permisiunile din Supabase.`);
            }

            // Un rând per gol individual (cu minut real, dacă a fost completat)
            const goalRows = validGoalEvents.map(ev => ({
                match_id: dbId,
                player_name: ev.player,
                team: orangePlayers.includes(ev.player) ? 'orange' : blackPlayers.includes(ev.player) ? 'black' : 'green',
                goals: 1,
                goals_conceded: 0,
                minute: (ev.minute !== '' && ev.minute !== null && !isNaN(parseInt(ev.minute))) ? parseInt(ev.minute) : null,
            }));
            // Rânduri separate pentru goluri primite (agregat per jucător, fără minut)
            const concededRows = Object.keys(goalsConceded).map(name => ({
                match_id: dbId,
                player_name: name,
                team: orangePlayers.includes(name) ? 'orange' : blackPlayers.includes(name) ? 'black' : 'green',
                goals: 0,
                goals_conceded: goalsConceded[name],
                minute: null,
            }));
            const rows = [...goalRows, ...concededRows];
            if(rows.length) {
                const { error: insErr } = await sb.from('match_goals').insert(rows);
                if (insErr) throw new Error('Salvare goluri eșuată: ' + insErr.message);
            }
        }
    } catch(e) {
        showToast('⚠️ ' + e.message);
        _savingMatchEdit = false;
        if (saveBtn) { saveBtn.disabled = false; saveBtn.style.opacity = ''; saveBtn.textContent = '💾 Salvează Meciul'; }
        return;
    }

    recalculateAllPlayerStats();
    const affectedNames = new Set([...orangePlayers,...greenPlayers,...blackPlayers]);
    const affectedPlayers = db.players.filter(p => affectedNames.has(p.name));
    try {
        await Promise.all(affectedPlayers.map(p => dbUpdatePlayer(p)));
        showToast('✅ Meci actualizat!');
    } catch(e) { showToast('⚠️ Salvat local, eroare DB: ' + e.message); }

    _savingMatchEdit = false;
    if (saveBtn) { saveBtn.disabled = false; saveBtn.style.opacity = ''; saveBtn.textContent = '💾 Salvează Meciul'; }
    closeMatchEditor();
    render();
}

// ── 3. Mută toți Jucătorii Activi pe Bancă ──
async function moveAllActiveToBench() {
    const actives = db.players.filter(p => p.status === 'active');
    if (!actives.length) { showToast('⚠️ Niciun jucător activ!'); return; }
    showConfirm('🔵', 'Mută toți pe Bancă?',
        `${actives.length} jucători activi vor fi mutați pe Bancă.`,
        'Mută', '#2979ff',
        async () => {
            actives.forEach(p => p.status = 'bench');
            render();
            try { await Promise.all(actives.map(p => dbUpdatePlayer(p))); showToast(`✅ ${actives.length} jucători mutați pe Bancă!`); }
            catch(e) { showToast('⚠️ '+e.message); }
        }
    );
}

// ── 6. Leaderboard mode toggle ──
let leaderboardMode = 'smart';
function setLeaderboardMode(mode) {
    leaderboardMode = mode;
    document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.getElementById('lbt-'+mode);
    if(activeTab) activeTab.classList.add('active');
    renderLeaderboard();
}

function toggleBalancePopup(e) {
    e.stopPropagation();
    const popup = document.getElementById('balancePopup');
    popup.classList.toggle('show');
    if (popup.classList.contains('show')) {
        updateScenarioBadge();
        // Update team name labels every time popup opens
        const lblO = document.getElementById('swapLblOrange');
        const lblG = document.getElementById('swapLblGreen');
        if (lblO) lblO.textContent = teamNames.orange + ' ↔ Bancă';
        if (lblG) lblG.textContent = teamNames.green  + ' ↔ Bancă';
    }
}
document.addEventListener('click', () => {
    document.getElementById('balancePopup')?.classList.remove('show');
});

// ── Mobile tabs ──
let currentMobileTab = 'orange';

function switchMobileTab(tab) {
    currentMobileTab = tab;
    if (window.innerWidth > 640) return; // desktop: CSS handles everything

    // Hide all columns
    ['orange','green','bench','active'].forEach(t =>
        document.getElementById(`col-${t}`)?.style && (document.getElementById(`col-${t}`).style.display = 'none')
    );
    // Hide all areas
    document.getElementById('playersArea').style.display  = 'none';
    document.getElementById('sectionsArea').style.display = 'none';
    document.getElementById('sec-lobby').style.display    = 'none';
    document.getElementById('sec-history').style.display  = 'none';

    if (tab === 'match') {
        // Show orange + verde + bench stacked
        ['orange','green','bench'].forEach(t => {
            document.getElementById(`col-${t}`).style.display = 'flex';
        });
    } else if (tab === 'players') {
        // Show active column + leaderboard
        document.getElementById('col-active').style.display   = 'flex';
        document.getElementById('playersArea').style.display  = 'block';
        document.getElementById('sec-stats').style.display    = 'block';
    } else if (tab === 'lobby') {
        document.getElementById('sectionsArea').style.display = 'block';
        document.getElementById('sec-lobby').style.display    = 'block';
    } else if (tab === 'history') {
        document.getElementById('sectionsArea').style.display = 'block';
        document.getElementById('sec-history').style.display  = 'block';
    }

    // Update tab active styles
    document.querySelectorAll('.mobile-tab').forEach(el => {
        const isActive = el.classList.contains(`tab-${tab}`);
        el.classList.toggle('active', isActive);
    });
}

// Initialize mobile
// ── Undo Toast ──
let undoTimer = null;
function showUndoToast(msg, type, snapshot) {
    if (undoTimer) clearTimeout(undoTimer);
    const t = document.getElementById('toast');
    t.innerHTML = `${msg} <button onclick="undoMatch()" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:#3a2f1f;padding:2px 10px;border-radius:6px;margin-left:10px;font-size:0.78rem;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;">↩ Undo</button>`;
    t.className = 'toast' + (type ? ' toast-'+type : '');
    t.style.pointerEvents = 'all';
    requestAnimationFrame(() => {
        t.classList.add('show');
        undoTimer = setTimeout(() => {
            t.classList.remove('show');
            t.style.pointerEvents = 'none';
            t.innerHTML = '';
            window._undoSnapshot = null;
        }, 8000);
    });
    window._undoSnapshot = snapshot;
}

async function undoMatch() {
    if (!window._undoSnapshot) return;
    const snap = window._undoSnapshot;
    window._undoSnapshot = null;
    clearTimeout(undoTimer);
    document.getElementById('toast').classList.remove('show');

    // Restore state
    db.players = snap.players;
    db.history = snap.history;
    db.nextMatch = snap.nextMatch;

    // Delete the last match from DB
    const lastH = db.history[0]; // after restore, old first is now accessible via snap
    if (snap.history.length < JSON.parse(localStorage.getItem('fb_club_v6') || '{}')?.history?.length) {
        // just re-save players and delete last history entry
    }
    try {
        // Delete last inserted match history
        const { data: lastMatches } = await sb.from('match_history').select('id').order('created_at', {ascending:false}).limit(1);
        if (lastMatches?.[0]) await sb.from('match_history').delete().eq('id', lastMatches[0].id);
        await Promise.all(db.players.map(p => dbUpdatePlayer(p)));
        await dbSaveNextMatch();
    } catch(e) { console.error('Undo DB error:', e); }

    render();
    showToast('↩ Meci anulat!');
}

// ── Export echipe ca imagine ──
async function exportTeamsImage() {
    const o = db.players.filter(p=>p.status==='orange');
    const g = db.players.filter(p=>p.status==='green');
    if (!o.length && !g.length) { showToast('⚠️ Nu există jucători în echipe!'); return; }

    const canvas = document.createElement('canvas');
    canvas.width = 800; canvas.height = 440;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#f7ecd9';
    ctx.fillRect(0, 0, 800, 440);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Bebas Neue, sans-serif';
    ctx.letterSpacing = '4px';
    const title = document.getElementById('clubTitle')?.textContent || 'Arena Friends FC';
    ctx.fillText(title.toUpperCase(), 40, 50);

    ctx.font = '14px Rajdhani, sans-serif';
    ctx.fillStyle = '#555';
    ctx.fillText(new Date().toLocaleDateString('ro-RO'), 40, 72);

    // Orange team
    ctx.fillStyle = '#9c4f00';
    ctx.font = 'bold 18px Bebas Neue, sans-serif';
    ctx.fillText('🟠 ECHIPA PORTOCALIE', 40, 110);
    ctx.fillStyle = '#666';
    ctx.fillRect(40, 118, 340, 1);
    ctx.font = '15px Rajdhani, sans-serif';
    o.forEach((p,i) => {
        ctx.fillStyle = '#e0e0e0';
        ctx.fillText(`${i+1}. ${p.name}`, 40, 140 + i*26);
        ctx.fillStyle = '#8a6800';
        ctx.fillText(`⭐ ${getGeneralAvg(p).toFixed(1)}`, 300, 140 + i*26);
    });

    // Green team
    ctx.fillStyle = '#1b7a35';
    ctx.font = 'bold 18px Bebas Neue, sans-serif';
    ctx.fillText('🟢 ECHIPA VERDE', 420, 110);
    ctx.fillStyle = '#666';
    ctx.fillRect(420, 118, 340, 1);
    ctx.font = '15px Rajdhani, sans-serif';
    g.forEach((p,i) => {
        ctx.fillStyle = '#e0e0e0';
        ctx.fillText(`${i+1}. ${p.name}`, 420, 140 + i*26);
        ctx.fillStyle = '#8a6800';
        ctx.fillText(`⭐ ${getGeneralAvg(p).toFixed(1)}`, 680, 140 + i*26);
    });

    // Footer
    ctx.fillStyle = '#333';
    ctx.font = '12px Rajdhani, sans-serif';
    ctx.fillText('Arena Friends FC · Manager Fotbal 2026', 40, 420);

    // Download
    const link = document.createElement('a');
    link.download = `echipe_${new Date().toISOString().slice(0,10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('🖼️ Imagine descărcată!');
}

// ── Swipe support for mobile columns ──
function initSwipe() {
    const page = document.querySelector('.page');
    if (!page) return;
    let startX = 0, startY = 0;
    const colOrder = ['match', 'players', 'lobby', 'history'];

    page.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    page.addEventListener('touchend', e => {
        if (window.innerWidth > 640) return;
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return; // not a horizontal swipe

        // Find current active tab
        const activeDot = document.querySelector('.mobile-tab.active');
        if (!activeDot) return;
        const current = currentMobileTab || 'match';
        const idx = colOrder.indexOf(current);

        if (dx < 0 && idx < colOrder.length - 1) switchMobileTab(colOrder[idx + 1]); // swipe left → next
        if (dx > 0 && idx > 0) switchMobileTab(colOrder[idx - 1]); // swipe right → prev
    }, { passive: true });
}

function initMobile() {
    if (window.innerWidth <= 640) {
        switchMobileTab('match');
    }
}
window.addEventListener('resize', () => {
    if (window.innerWidth > 640) {
        // Desktop: clear all inline styles so CSS takes over
        ['orange','green','bench','active'].forEach(t => {
            const el = document.getElementById('col-'+t);
            if (el) el.style.display = '';
        });
        ['playersArea','sectionsArea','sec-lobby','sec-stats','sec-history'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = '';
        });
    } else {
        switchMobileTab(currentMobileTab || 'match');
    }
});

function moveTeamsToBench() {
    document.getElementById('balancePopup').classList.remove('show');
    const moved = db.players.filter(p => p.status === 'orange' || p.status === 'green');
    if (!moved.length) { showToast('⚠️ Nu sunt jucători în echipe!'); return; }
    moved.forEach(p => p.status = 'bench');
    render();
    Promise.all(moved.map(p => dbUpdatePlayer(p))).catch(e => showToast('⚠️ ' + e.message));
    showToast(`🔵 ${moved.length} jucători mutați pe bancă!`);
}

// ── Scenario (Draft) System ──────────────────────────────────────
let currentScenario = 1;
let threeTeamMode = localStorage.getItem('idx_3team')==='1';
let teamNames = { orange: 'Portocaliu', green: 'Verde', bench: 'Negru' };
// Curăță orice resturi vechi din localStorage care ar putea cauza inconsecvențe de culoare
['team_name_orange','team_name_green','team_name_bench','team_color_orange','team_color_green','team_color_bench'].forEach(k => localStorage.removeItem(k));
let teamColors = { orange: '#9c4f00', green: '#1b7a35', bench: '#111111' };

const TEAM_COLOR_PALETTE = ['#9c4f00', '#1b7a35', '#111111'];
const COLOR_NAMES_IDX = {
    '#9c4f00': 'PORTOCALIU',
    '#1b7a35': 'VERDE',
    '#111111': 'NEGRU',
};
// Toate cele 3 culori standard sunt suficient de întunecate — text alb mereu
function getContrastColorIdx(hex) { return '#ffffff'; }
function colorToNameIdx(hex) {
    if (!hex) return 'ECHIPA';
    const direct = COLOR_NAMES_IDX[hex.toLowerCase()];
    if (direct) return direct;
    let best = null, bestD = Infinity;
    Object.entries(COLOR_NAMES_IDX).forEach(([h,n]) => {
        const dr=parseInt(h.slice(1,3),16)-parseInt(hex.slice(1,3),16);
        const dg=parseInt(h.slice(3,5),16)-parseInt(hex.slice(3,5),16);
        const db=parseInt(h.slice(5,7),16)-parseInt(hex.slice(5,7),16);
        const d=dr*dr+dg*dg+db*db;
        if(d<bestD){bestD=d;best=n;}
    });
    return best||hex;
}
// ── Determină câștigătorul din scor (nu din string winner care se schimbă) ──
// ── Determină câștigătorul — folosim winner string (cel mai robust) ──
// getWinnerSideFromScore e păstrat pentru compatibilitate vizuală (culori badge)
// DAR nu mai e folosit pentru logica de W/L a jucătorilor!
function getWinnerSideFromScore(h) {
    // Dacă avem winner string, folosim asta (cel mai corect)
    const w = (h.winner||'').toLowerCase().trim();
    if (!w || w === 'egal') return 'draw';
    if (w.includes('portocaliu') || w.includes('orange')) return 'orange';
    if (w.includes('verde') || w.includes('green')) return 'green';
    if (w.includes('negru') || w.includes('black')) return 'black';
    // Fallback: parsare scor (funcționează corect DOAR pentru orange vs green direct)
    const parts = (h.score||'').split(':').map(s => parseInt(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        if (parts[0] > parts[1]) return 'orange';
        if (parts[1] > parts[0]) return 'green';
        return 'draw';
    }
    return null;
}

// Determină dacă un jucător a câștigat un meci — bazat pe winner string, NU pe scor
function playerWonMatch(h, playerName) {
    const inOrange = (h.orangePlayers||[]).includes(playerName);
    const inGreen  = (h.greenPlayers||[]).includes(playerName);
    const inBlack  = (h.blackPlayers||[]).includes(playerName);
    if (!inOrange && !inGreen && !inBlack) return null; // nu a jucat deloc

    const w = (h.winner||'').toLowerCase().trim();
    if (!w || w === 'egal') return false; // egal = nimeni nu câștigă

    // Mapare directă echipă → victorie prin winner string
    if (inOrange) return w.includes('portocaliu') || w.includes('orange');
    if (inGreen)  return w.includes('verde') || w.includes('green');
    if (inBlack)  return w.includes('negru') || w.includes('black');
    return false;
}


function applyTeamColors() {
    document.documentElement.style.setProperty('--orange', teamColors.orange);
    document.documentElement.style.setProperty('--green',  teamColors.green);
    const bHex = teamColors.bench || '#111111';
    document.documentElement.style.setProperty('--bench-col', bHex);
    document.documentElement.style.setProperty('--bench-text', getContrastColorIdx(bHex));
    // Column headers — override hardcoded gradient with team color + contrast text
    const oHd = document.querySelector('#col-orange .col-header');
    const gHd = document.querySelector('#col-green  .col-header');
    const bHd = document.querySelector('#col-bench  .col-header');
    if (oHd) { oHd.style.background = teamColors.orange; oHd.style.color = getContrastColorIdx(teamColors.orange); }
    if (gHd) { gHd.style.background = teamColors.green;  gHd.style.color = getContrastColorIdx(teamColors.green); }
    if (bHd && threeTeamMode) { bHd.style.background = bHex; bHd.style.color = getContrastColorIdx(bHex); }
    // Title contrast
    const tO = document.getElementById('titleOrange');
    const tG = document.getElementById('titleGreen');
    const tB = document.getElementById('titleBench');
    if (tO) tO.style.color = getContrastColorIdx(teamColors.orange);
    if (tG) tG.style.color = getContrastColorIdx(teamColors.green);
    if (tB && threeTeamMode) tB.style.color = getContrastColorIdx(bHex);
}

async function loadTeamConfigs() {
    // Numele/culorile sunt FIXE — PORTOCALIU/VERDE/NEGRU. Nu se mai citesc din DB.
    teamColors = { orange: '#9c4f00', green: '#1b7a35', bench: '#111111' };
    teamNames  = { orange: 'Portocaliu', green: 'Verde', bench: 'Negru' };
    applyTeamColors();
    renderTeamTitles();
}

async function saveTeamConfigs() {
    // No-op: identitatea echipelor nu mai e editabilă/salvabilă.
}
let scenarios = {1:null, 2:null, 3:null};

// ── Jucătorii eligibili = confirmați pentru meciul activ ──────────
function getEligiblePlayers(){
    const confirmed = db.nextMatch?.confirmedIds || [];
    if(confirmed.length > 0){
        return db.players.filter(p => confirmed.includes(p.id));
    }
    // Fallback: jucători bench/orange/green (activi în dashboard)
    return db.players.filter(p => ['bench','orange','green'].includes(p.status));
}

// Copiază în clipboard lista alfabetică a jucătorilor confirmați/activi,
// FĂRĂ nicio referire la echipă (Portocaliu/Verde/Bancă) — utilă pentru
// a trimite rapid „cine vine" într-un grup, fără să dai spoiler la echipe.
function copyConfirmedPresence(){
    const players = getEligiblePlayers();
    if(!players.length){ showToast('⚠️ Niciun jucător confirmat momentan!'); return; }
    const sortedNames = [...players].map(p=>p.name).sort((a,b)=>a.localeCompare(b,'ro'));
    const text = sortedNames.map((n,i)=>`${i+1}. ${n}`).join('\n');
    navigator.clipboard.writeText(text).then(()=>{
        showToast(`✅ Copiat! ${sortedNames.length} jucători confirmați (ordine alfabetică).`);
    }).catch(()=>{
        showToast('⚠️ Nu am putut copia în clipboard — verifică permisiunile browserului.');
    });
}

function snapshotTeams(){
    return {
        orange: db.players.filter(p=>p.status==='orange').map(p=>p.name),
        green:  db.players.filter(p=>p.status==='green').map(p=>p.name)
    };
}

function applyScenario(sc){
    if(!sc) return;
    // Only move eligible players — don't touch others
    const eligible = getEligiblePlayers().map(p=>p.name);
    db.players.forEach(p=>{
        if(!eligible.includes(p.name)) return; // skip non-eligible
        if(sc.orange.includes(p.name))      p.status='orange';
        else if(sc.green.includes(p.name))  p.status='green';
        else                                p.status='bench';
    });
    render();
}

function switchScenario(n){
    currentScenario = n;
    [1,2,3].forEach(i=>{
        const btn = document.getElementById('scBtn'+i);
        if(!btn) return;
        btn.classList.toggle('active', i===n);
        btn.classList.toggle('saved', !!scenarios[i]);
    });
    if(scenarios[n]){
        applyScenario(scenarios[n]);
        showToast('📋 Scenariu '+n+' încărcat');
    } else {
        showToast('📋 Scenariu '+n+' gol — aranjează echipele și salvează');
    }
    updateScenarioBadge();
}

function updateScenarioBadge(){
    // Show eligible count in popup title
    const el = document.querySelector('.balance-popup-title');
    if(!el) return;
    const eligible = getEligiblePlayers();
    const hasCon = (db.nextMatch?.confirmedIds||[]).length > 0;
    el.innerHTML = '⚖️ Echipe: Balans &amp; Instrumente'+(hasCon?` <span style="font-size:.55rem;color:#1b7a43;font-family:'Rajdhani',sans-serif;">(${eligible.length} confirmați)</span>`:'');
}

async function resetScenarios(){
    scenarios = {1:null, 2:null, 3:null};
    currentScenario = 1;
    [1,2,3].forEach(i=>{
        const btn=document.getElementById('scBtn'+i);
        if(btn){ btn.classList.remove('saved'); btn.classList.toggle('active', i===1); btn.textContent='S'+i; }
    });
    try{ await sb.from('match_scenarios').delete().neq('scenario_id',0); }catch(e){}
    showToast('🗑️ Scenarii resetate!');
}

async function saveScenario(){
    const sc = snapshotTeams();
    if(!sc.orange.length && !sc.green.length){
        showToast('⚠️ Nu există jucători în echipe!'); return;
    }
    scenarios[currentScenario] = sc;
    try{
        await sb.from('match_scenarios').upsert({
            scenario_id: currentScenario,
            orange_players: sc.orange,
            green_players:  sc.green,
            updated_at: new Date().toISOString()
        }, {onConflict:'scenario_id'});
    }catch(e){ showToast('⚠️ '+e.message); return; }
    const btn = document.getElementById('scBtn'+currentScenario);
    if(btn){ btn.classList.add('saved'); btn.textContent='S'+currentScenario+' ✓'; }
    showToast('✅ Scenariu '+currentScenario+' salvat!');
}

async function loadScenarios(){
    try{
        const {data} = await sb.from('match_scenarios').select('*').order('scenario_id');
        if(data && data.length){
            data.forEach(row=>{
                scenarios[row.scenario_id]={orange:row.orange_players||[],green:row.green_players||[]};
            });
            [1,2,3].forEach(i=>{
                const btn=document.getElementById('scBtn'+i);
                if(btn&&scenarios[i]){btn.classList.add('saved');btn.textContent='S'+i+' \u2713';}
            });
        }
    }catch(e){ console.warn('scenario load:', e.message); }
}

// ── Realtime pentru scenarii ──────────────────────────────────────
function setupScenariosRealtime(){
    sb.channel('match_scenarios_rt')
        .on('postgres_changes',{event:'*',schema:'public',table:'match_scenarios'}, async ()=>{
            // Reload scenarios from DB when another client saves
            const{data}=await sb.from('match_scenarios').select('*').order('scenario_id');
            scenarios={1:null,2:null,3:null};
            [1,2,3].forEach(i=>{
                const btn=document.getElementById('scBtn'+i);
                if(btn){btn.classList.remove('saved');btn.textContent='S'+i;btn.classList.toggle('active',i===currentScenario);}
            });
            (data||[]).forEach(row=>{
                scenarios[row.scenario_id]={orange:row.orange_players||[],green:row.green_players||[]};
                const btn=document.getElementById('scBtn'+row.scenario_id);
                if(btn){btn.classList.add('saved');btn.textContent='S'+row.scenario_id+' \u2713';}
            });
        })
        .subscribe();
}

function openVoteTeamsLink(){
    document.getElementById('balancePopup').classList.remove('show');
    const hasSaved = Object.values(scenarios).some(s=>s!==null);
    if(!hasSaved){ showToast('⚠️ Salvează cel puțin un scenariu mai întâi!'); return; }
    window.open('vote-teams.html','_blank');
}


// La meciuri de 10 la 10, echilibrarea pe rating nu mai e suficientă — contează
// și să nu ajungi cu toți fundașii/atacanții într-o singură echipă. Această
// rafinare încearcă swap-uri care reduc diferența de posturi (GK/DEF/MID/FWD)
// dintre echipe, atâta timp cât nu strică prea mult echilibrul de rating deja
// obținut în refineTeamSplit().
function refinePositionBalance(oArr, gArr, getRating) {
    const groups = ['GK','DEF','MID','FWD'];
    const countBy = (arr) => {
        const c = {GK:0,DEF:0,MID:0,FWD:0};
        arr.forEach(p => { const g = getPlayerPrimaryGroup(p); if (g && c[g] !== undefined) c[g]++; });
        return c;
    };
    const imbalance = (oC,gC) => groups.reduce((s,g) => s + Math.abs(oC[g]-gC[g]), 0);

    let oSum = oArr.reduce((s,p) => s + getRating(p), 0);
    let gSum = gArr.reduce((s,p) => s + getRating(p), 0);

    let iterations = 0, improved = true;
    while (improved && iterations < 40) {
        improved = false;
        iterations++;
        const oC = countBy(oArr), gC = countBy(gArr);
        const curImb = imbalance(oC, gC);
        if (curImb <= 1) break; // deja suficient de echilibrat pe posturi (diferență ≤1 per post)

        let bestI = -1, bestJ = -1, bestImb = curImb;
        for (let i = 0; i < oArr.length; i++) {
            for (let j = 0; j < gArr.length; j++) {
                const giGroup = getPlayerPrimaryGroup(oArr[i]);
                const gjGroup = getPlayerPrimaryGroup(gArr[j]);
                if (giGroup === gjGroup) continue; // fără efect pe distribuția de posturi

                const rO = getRating(oArr[i]), rG = getRating(gArr[j]);
                const newOSum = oSum - rO + rG, newGSum = gSum - rG + rO;
                // Nu lăsăm rating-ul să se strice semnificativ doar ca să echilibrăm posturile
                if (Math.abs(newOSum - newGSum) > Math.abs(oSum - gSum) + 0.6) continue;

                const testOC = {...oC}, testGC = {...gC};
                if (giGroup) { testOC[giGroup]--; testGC[giGroup]++; }
                if (gjGroup) { testGC[gjGroup]--; testOC[gjGroup]++; }
                const newImb = imbalance(testOC, testGC);
                if (newImb < bestImb) { bestImb = newImb; bestI = i; bestJ = j; }
            }
        }

        if (bestI >= 0) {
            const pO = oArr[bestI], pG = gArr[bestJ];
            oArr[bestI] = pG; pG.status = 'orange';
            gArr[bestJ] = pO; pO.status = 'green';
            oSum = oSum - getRating(pO) + getRating(pG);
            gSum = gSum - getRating(pG) + getRating(pO);
            improved = true;
        }
    }
}

// Întreabă pe ce format se joacă înainte de a echilibra (Smart / Rating General) —
// la 10 la 10 aplicăm și rafinarea pe posturi, la 6/7 la 7 nu (nu are sens).
function askFormatThenBalance(mode) {
    document.getElementById('balancePopup').classList.remove('show');
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div style="background:#f5e9d4;border-radius:14px;padding:20px;max-width:320px;width:100%;">
        <h3 style="margin:0 0 6px;font-family:'Bebas Neue',sans-serif;letter-spacing:2px;color:#7d6849;">⚽ Pe ce format jucați?</h3>
        <div style="font-size:.72rem;color:#7d6849;margin-bottom:14px;">La 10 la 10 echilibrez și pe posturi (portar / fundaș / mijlocaș / atacant). La 6 la 6 sau 7 la 7 nu e nevoie.</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
            <button data-fmt="6"  style="padding:11px;border-radius:9px;background:#fffaf0;border:1px solid #dcc89a;color:#3a2f1f;font-weight:700;cursor:pointer;">6 la 6</button>
            <button data-fmt="7"  style="padding:11px;border-radius:9px;background:#fffaf0;border:1px solid #dcc89a;color:#3a2f1f;font-weight:700;cursor:pointer;">7 la 7</button>
            <button data-fmt="10" style="padding:11px;border-radius:9px;background:#fffaf0;border:1px solid #dcc89a;color:#3a2f1f;font-weight:700;cursor:pointer;">10 la 10 <span style="font-size:.65rem;color:#7d6849;">(și pe posturi)</span></button>
        </div>
        <button id="fmtCancelBtn" style="margin-top:12px;width:100%;padding:9px;border-radius:9px;background:rgba(198,40,40,.1);border:1px solid #c62828;color:#b71c1c;font-weight:700;cursor:pointer;">Anulează</button>
    </div>`;
    overlay.querySelectorAll('button[data-fmt]').forEach(btn => {
        btn.onclick = () => { overlay.remove(); doBalance(mode, btn.dataset.fmt); };
    });
    overlay.querySelector('#fmtCancelBtn').onclick = () => overlay.remove();
    document.body.appendChild(overlay);
}

function doBalance(mode, format) {
    document.getElementById('balancePopup').classList.remove('show');
    const eligible = getEligiblePlayers();
    const active = eligible.length >= 2
        ? eligible
        : db.players.filter(p => p.status === 'orange' || p.status === 'green' || p.status === 'bench');
    if (active.length < 2) { showToast('⚠️ Minim 2 jucători confirmați!'); return; }
    active.forEach(p => { if (p.status === 'active') p.status = 'bench'; });

    // La 10 la 10 contează și distribuția pe posturi (portar/fundaș/mijlocaș/atacant);
    // la 6 la 6 / 7 la 7, per cererea ta, nu mai e nevoie.
    const usePositionBalance = format === '10';

    // Pre-compute anti-synergy pairs once per balance call
    _antiSynergyPairs = getAntiSynergyPairs();

    // ── 3-team mode ───────────────────────────────────────────────
    if (threeTeamMode) {
        const getRatingT = (p) => mode==='smart'||mode==='roles'||mode==='surprise' ? getSmartRating(p) : getGeneralAvg(p);
        const sorted3 = mode === 'surprise'
            ? [...active].sort(() => Math.random() - .5)
            : [...active].sort((a,b) => getRatingT(b) - getRatingT(a));
        const teams3 = ['orange','green','bench'];
        const arrs3  = [[],[],[]];
        const sizes3 = [0,0,0];
        const sums3  = [0,0,0];
        const maxS3  = Math.ceil(active.length/3);
        sorted3.forEach(p => {
            const r = getRatingT(p);
            let best = -1, bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                if (sizes3[i] >= maxS3) continue;
                // Anti-synergy penalty: prefer placing p away from bad pairs
                const antiPen = countAntiSynergyInTeam([...arrs3[i], p]) * 0.3;
                const score = sums3[i] + antiPen;
                if (score < bestScore) { bestScore = score; best = i; }
            }
            if (best === -1) best = sizes3.indexOf(Math.min(...sizes3));
            p.status = teams3[best]; arrs3[best].push(p); sizes3[best]++; sums3[best] += r;
        });
        render();
        Promise.all(active.map(p => dbUpdatePlayer(p))).catch(e => showToast('⚠️ '+e.message));
        const [a3,b3,c3] = [0,1,2].map(i => arrs3[i].length);
        showToast(`⚖️ ${teamNames.orange}:${a3} · ${teamNames.green}:${b3} · ${teamNames.bench||'E3'}:${c3}`);
        const report3 = buildBalanceReport(arrs3[0], arrs3[1], mode, arrs3[2]);
        _showImbalanceAlert(report3);
        return;
    }

    const maxSize = Math.ceil(active.length / 2);

    // ── SURPRISE mode ─────────────────────────────────────────────
    if (mode === 'surprise') {
        const shuffled = [...active].sort(() => Math.random() - 0.5);
        const oT = [], gT = [];
        let oSum = 0, gSum = 0;
        shuffled.forEach(p => {
            const r = getSmartRating(p);
            const oFull = oT.length >= maxSize, gFull = gT.length >= maxSize;
            const oAnti = !oFull ? countAntiSynergyInTeam([...oT, p]) : 999;
            const gAnti = !gFull ? countAntiSynergyInTeam([...gT, p]) : 999;
            if (!oFull && (gFull || (oAnti <= gAnti && oSum <= gSum))) {
                p.status = 'orange'; oT.push(p); oSum += r;
            } else {
                p.status = 'green'; gT.push(p); gSum += r;
            }
        });
        render();
        Promise.all(active.map(p => dbUpdatePlayer(p))).catch(e => showToast('⚠️ '+e.message));
        showToast('🎰 Surprise! Echipe random echilibrate!');
        const reportS = buildBalanceReport(oT, gT, 'surprise');
        _showImbalanceAlert(reportS);
        return;
    }

    // ── ROLES mode ────────────────────────────────────────────────
    if (mode === 'roles') {
        const groupOrder = ['GK','DEF','MID','FWD'];
        const oArr = [], gArr = [];
        let oSum = 0, gSum = 0;
        const byGroup = {}; groupOrder.forEach(g => byGroup[g] = []);
        const noGroup = [];
        [...active].sort((a,b) => getSmartRating(b)-getSmartRating(a)).forEach(p => {
            const grp = getPlayerPrimaryGroup(p);
            if (grp && byGroup[grp]) byGroup[grp].push(p); else noGroup.push(p);
        });
        const assignR = (p) => {
            const r = getSmartRating(p);
            const oFull = oArr.length >= maxSize, gFull = gArr.length >= maxSize;
            const oAnti = !oFull ? countAntiSynergyInTeam([...oArr, p]) : 999;
            const gAnti = !gFull ? countAntiSynergyInTeam([...gArr, p]) : 999;
            if (!oFull && (gFull || oAnti < gAnti || (oAnti === gAnti && oSum <= gSum))) {
                p.status = 'orange'; oArr.push(p); oSum += r;
            } else {
                p.status = 'green'; gArr.push(p); gSum += r;
            }
        };
        groupOrder.forEach(grp => {
            byGroup[grp].sort((a,b) => getSmartRating(b)-getSmartRating(a)).forEach(p => {
                const oHas = oArr.filter(x => getPlayerPrimaryGroup(x)===grp).length;
                const gHas = gArr.filter(x => getPlayerPrimaryGroup(x)===grp).length;
                if (oHas <= gHas && oArr.length < maxSize) { p.status='orange'; oArr.push(p); oSum+=getSmartRating(p); }
                else if (gArr.length < maxSize) { p.status='green'; gArr.push(p); gSum+=getSmartRating(p); }
                else assignR(p);
            });
        });
        // Jucători fără poziție primary: verifică secondary ca rezervă pentru fine-tuning
        noGroup.sort((a,b) => {
            const aSec = getPlayerSecondaryPos(a), bSec = getPlayerSecondaryPos(b);
            return (bSec?1:0) - (aSec?1:0); // cei cu secondary definit întâi (informativ, nu strict necesar)
        }).forEach(p => assignR(p));
        render();
        Promise.all(active.map(p => dbUpdatePlayer(p))).catch(e => showToast('⚠️ '+e.message));
        const oGK = oArr.filter(x=>getPlayerPrimaryGroup(x)==='GK').length;
        const gGK = gArr.filter(x=>getPlayerPrimaryGroup(x)==='GK').length;
        showToast(`🎭 Balans Pozitii: ${oArr.length} vs ${gArr.length} · 🧤${oGK}-${gGK}`);
        const reportR = buildBalanceReport(oArr, gArr, 'roles');
        _showImbalanceAlert(reportR);
        return;
    }

    // ── SMART / GENERAL mode ──────────────────────────────────────
    const getRating = (p, ctx={}) => mode === 'smart' ? getSmartRating(p, ctx) : getGeneralAvg(p);
    const sorted = [...active].sort((a,b) => getRating(b) - getRating(a));
    const oArr = [], gArr = [];
    let oSum = 0, gSum = 0;

    sorted.forEach(p => {
        const oFull = oArr.length >= maxSize, gFull = gArr.length >= maxSize;
        // Anti-synergy cost
        const oAnti = !oFull ? countAntiSynergyInTeam([...oArr, p]) * 0.3 : 999;
        const gAnti = !gFull ? countAntiSynergyInTeam([...gArr, p]) * 0.3 : 999;
        // Rating de sinergie (ține cont de coechipierii deja aleși, doar la 'smart')
        const rO = !oFull ? getRating(p, mode==='smart'?{teammates:oArr}:{}) : Infinity;
        const rG = !gFull ? getRating(p, mode==='smart'?{teammates:gArr}:{}) : Infinity;

        // Scor = ce s-ar întâmpla cu suma echipei dacă p intră acolo + penalizare anti-sinergie.
        // (Înainte rO/rG erau calculate dar anulate cu "* 0" — bug, sinergia nu conta deloc.)
        const scoreO = oFull ? Infinity : (oSum + rO + oAnti);
        const scoreG = gFull ? Infinity : (gSum + rG + gAnti);

        if (!oFull && (gFull || scoreO <= scoreG)) {
            p.status = 'orange'; oArr.push(p); oSum += getRating(p);
        } else {
            p.status = 'green'; gArr.push(p); gSum += getRating(p);
        }
    });

    // ── Rafinare finală: căutare locală (2-opt) ────────────────────
    // Împărțirea greedy de mai sus e un bun punct de plecare, dar nu garantează
    // cel mai mic decalaj posibil între echipe. Încercăm sistematic swap-uri
    // 1-la-1 între echipe și le acceptăm doar dacă reduc decalajul de rating
    // ȘI nu cresc numărul de perechi cu anti-sinergie din aceeași echipă.
    refineTeamSplit(oArr, gArr, getRating);
    if (usePositionBalance) refinePositionBalance(oArr, gArr, getRating);
    oSum = oArr.reduce((s,p) => s + getRating(p), 0);
    gSum = gArr.reduce((s,p) => s + getRating(p), 0);

    render();
    Promise.all(active.map(p => dbUpdatePlayer(p))).catch(e => showToast('⚠️ '+e.message));
    const oAvg = (oSum/oArr.length).toFixed(1), gAvg = (gSum/gArr.length).toFixed(1);
    showToast(`⚖️ ${teamNames.orange}:${oArr.length} (★${oAvg}) vs ${teamNames.green}:${gArr.length} (★${gAvg})`);
    const reportSG = buildBalanceReport(oArr, gArr, mode);
    _showImbalanceAlert(reportSG);
}

// Căutare locală: încearcă să reducă decalajul de rating dintre cele două echipe
// prin schimbarea unor perechi de jucători (unul din fiecare echipă), atâta timp
// cât schimbarea nu crește numărul de perechi cu "anti-sinergie" din aceeași echipă.
// Mutează direct p.status pe obiectele din oArr/gArr (aceleași referințe ca în `active`).
function refineTeamSplit(oArr, gArr, getRating) {
    let oSum = oArr.reduce((s,p) => s + getRating(p), 0);
    let gSum = gArr.reduce((s,p) => s + getRating(p), 0);
    const antiBaseline = () => countAntiSynergyInTeam(oArr) + countAntiSynergyInTeam(gArr);

    let iterations = 0;
    let improved = true;
    while (improved && iterations < 60) {
        improved = false;
        iterations++;
        let bestGain = 0.05; // prag minim ca să nu oscilăm pe zecimale nesemnificative
        let bestI = -1, bestJ = -1;
        const antiBefore = antiBaseline();

        for (let i = 0; i < oArr.length; i++) {
            for (let j = 0; j < gArr.length; j++) {
                const rO = getRating(oArr[i]), rG = getRating(gArr[j]);
                const newOSum = oSum - rO + rG;
                const newGSum = gSum - rG + rO;
                const gainGap = Math.abs(oSum - gSum) - Math.abs(newOSum - newGSum);
                if (gainGap <= bestGain) continue;

                const swappedO = oArr.slice(); swappedO[i] = gArr[j];
                const swappedG = gArr.slice(); swappedG[j] = oArr[i];
                const antiAfter = countAntiSynergyInTeam(swappedO) + countAntiSynergyInTeam(swappedG);
                if (antiAfter > antiBefore) continue; // nu acceptăm swap-uri care strică sinergia

                bestGain = gainGap; bestI = i; bestJ = j;
            }
        }

        if (bestI >= 0) {
            const pO = oArr[bestI], pG = gArr[bestJ];
            oArr[bestI] = pG; pG.status = 'orange';
            gArr[bestJ] = pO; pO.status = 'green';
            oSum = oSum - getRating(pO) + getRating(pG);
            gSum = gSum - getRating(pG) + getRating(pO);
            improved = true;
        }
    }
}

function _showImbalanceAlert(report) {
    // Show detailed balance report in popup
    if (report) {
        const wrap = document.getElementById('balanceReportWrap');
        const el   = document.getElementById('balanceReport');
        if (wrap && el) { el.innerHTML = report; wrap.style.display = 'block'; }
    }

    // #5 Detectare dezechilibru — alertă dacă cineva are streak W≥3
    const imb = detectImbalancedPlayers();
    if (imb.length) {
        const names = imb.map(x => `${x.p.name} (${x.streak}W)`).join(', ');
        setTimeout(() => showToast(`⚠️ Jucători dominanți: ${names} — consideră rebalansare!`), 1200);
    }
    // Anti-synergy info
    if (_antiSynergyPairs.length) {
        const oPlayers = db.players.filter(p=>p.status==='orange');
        const gPlayers = db.players.filter(p=>p.status==='green');
        const oBadPairs = countAntiSynergyInTeam(oPlayers);
        const gBadPairs = countAntiSynergyInTeam(gPlayers);
        if (oBadPairs + gBadPairs > 0) {
            setTimeout(() => showToast(`🔴 ${oBadPairs+gBadPairs} pereche(i) cu anti-sinergie în aceeași echipă`), 2400);
        }
    }
}

function buildBalanceReport(oArr, gArr, mode, bArr) {
    const fmtTeam = (arr, name, hex) => {
        if (!arr.length) return '';
        const avg = (arr.reduce((s,p)=>s+getSmartRating(p),0)/arr.length).toFixed(2);
        const actMults = arr.map(p => getActivityMultiplier(p));
        const lowestAct = actMults.some(m => m < 0.95);
        const synPairs = [];
        for(let i=0;i<arr.length;i++) for(let j=i+1;j<arr.length;j++) {
            const sc = getSynergyScore(arr[i].name, arr[j].name);
            if (sc !== 0.5) synPairs.push({a:arr[i].name,b:arr[j].name,sc});
        }
        const goodSyn = synPairs.filter(p=>p.sc>0.6).length;
        const badSyn  = synPairs.filter(p=>p.sc<0.4).length;
        const antiPairs = countAntiSynergyInTeam(arr);

        let html = `<div style="margin-bottom:6px;padding:5px 7px;background:#fffaf0;border-radius:6px;border-left:3px solid ${hex};">
            <div style="color:${hex};font-weight:700;font-size:.7rem;">${name} (${arr.length} juc.)</div>
            <div style="color:#7d6849;margin-top:2px;">★ Avg: <b style="color:#3a2f1f;">${avg}</b>`;
        if (lowestAct) html += ` · ⚠️ <span style="color:#8a6307;">activitate scăzută</span>`;
        if (goodSyn > 0) html += ` · 💚 ${goodSyn} pereche(i) cu sinergie bună`;
        if (badSyn > 0)  html += ` · 🔴 ${badSyn} anti-sinergie`;
        if (antiPairs > 0) html += ` · <span style="color:#b71c1c;">⚠️ ${antiPairs} pereche(i) problematice</span>`;
        html += `</div>`;
        const imb = arr.filter(p=>getStreak(p).type==='W'&&getStreak(p).count>=3);
        if (imb.length) html += `<div style="color:#8a6307;font-size:.62rem;">⚡ ${imb.map(p=>p.name+'('+getStreak(p).count+'W)').join(', ')} dominant(i)</div>`;
        html += `</div>`;
        return html;
    };

    const oAvg = oArr.length ? oArr.reduce((s,p)=>s+getSmartRating(p),0)/oArr.length : 0;
    const gAvg = gArr.length ? gArr.reduce((s,p)=>s+getSmartRating(p),0)/gArr.length : 0;
    const diff = Math.abs(oAvg - gAvg);
    const modeLabels = {smart:'★ Smart Balans', general:'⭐ Rating General', roles:'🎭 Pozitii', surprise:'🎰 Aleatoriu'};

    let html = `<div style="color:#7d6849;margin-bottom:5px;">Mod: <b style="color:#5c4a32;">${modeLabels[mode]||mode}</b> · Diferență rating: <b style="color:${diff<0.3?'#1b7a43':diff<0.7?'#c9920a':'#b71c1c'};">${diff.toFixed(2)}★</b></div>`;
    html += fmtTeam(oArr, teamNames.orange, teamColors.orange);
    html += fmtTeam(gArr, teamNames.green,  teamColors.green);
    if (bArr?.length) html += fmtTeam(bArr, teamNames.bench||'Negru', teamColors.bench||'#111111');

    if (_antiSynergyPairs.length) {
        html += `<div style="color:#7d6849;font-size:.6rem;margin-top:3px;">🔴 Anti-sinergie globală: ${_antiSynergyPairs.map(p=>`${p.a}+${p.b} (${(p.wr*100).toFixed(0)}%WR)`).join(', ')}</div>`;
    }
    return html;
}
// ── Compute consecutive wins for a team from history ─────────────
function computeTeamStreak(team) {
    const winner = team === 'orange' ? (teamNames?.orange||'Portocaliu') : (teamNames?.green||'Verde');
    const sorted = [...db.history].sort((a,b) => parseDateToObj(b.date) - parseDateToObj(a.date));
    let streak = 0;
    for (const h of sorted) {
        if (h.winner === winner) streak++;
        else break;
    }
    return streak;
}




// ── is_live flag ─────────────────────────────────────────────────
window._isLive = false;
async function checkLiveStatus(){
    try{
        const{data}=await sb.from('live_state').select('timer_status,match_started_at').eq('id',1).single();
        const live = data?.timer_status==='running'||data?.timer_status==='paused';
        window._isLive = live;
        const banner=document.getElementById('liveBanner');
        if(banner) banner.style.display=live?'flex':'none';
        // Disable drag on player cards
        document.querySelectorAll('.player-card').forEach(card=>{
            card.draggable = isAdmin() && !live;
            card.style.cursor = live?'pointer':'';
        });
    }catch(e){}
}

// ── 3-team toggle (index) ─────────────────────────────────────────
function toggleThreeTeamIndex(){
    threeTeamMode = !threeTeamMode;
    localStorage.setItem('idx_3team', threeTeamMode?'1':'0');
    applyThreeTeamUI();
    render();
}

function applyThreeTeamUI(){
    const btn = document.getElementById('btn3team');
    const colBench = document.getElementById('col-bench');
    const titleBench = document.getElementById('titleBench');
    const avgBench = document.getElementById('avg-bench');
    const barWrap = document.getElementById('bar-bench-wrap');
    if(btn){
        btn.classList.toggle('active', threeTeamMode);
        btn.title = threeTeamMode ? '3 Echipe ACTIV — click pentru dezactivare' : 'Activează Mod 3 Echipe';
    }
    if(colBench) colBench.classList.toggle('team3-active', threeTeamMode);
    if(titleBench){
        titleBench.textContent = threeTeamMode ? teamNames.bench : 'Pe Bancă';
        if(threeTeamMode){
            titleBench.style.cursor = 'pointer';
            titleBench.title = 'Click pentru editare';
            titleBench.onclick = () => startEditTeamName('bench');
        } else {
            titleBench.style.cursor = '';
            titleBench.onclick = null;
        }
    }
    if(avgBench) avgBench.style.display = threeTeamMode ? '' : 'none';
    if(barWrap) barWrap.style.display = threeTeamMode ? '' : 'none';
    // Apply bench column header color in 3-team mode
    const benchHd = document.querySelector('#col-bench .col-header');
    if(benchHd && threeTeamMode){
        benchHd.style.background = teamColors.bench || '#111111';
        benchHd.style.color = getContrastColorIdx(teamColors.bench || '#111111');
    }
}


// ── Start Match Modal ─────────────────────────────────────────────
let startBenchChoice = null; // ce echipă (orange/green/bench) stă pe bancă la acest meci — alegere temporară, NU schimbă echipele din dashboard

function openStartMatch(){
    if(!isAdmin()) return;
    const bP = db.players.filter(p=>p.status==='bench');
    const has3 = bP.length > 0; // auto-detect from bench players
    startBenchChoice = 'bench'; // implicit: echipa deja pe bancă rămâne pe bancă, dacă adminul nu alege alta

    if (has3) {
        renderStartTeamPicker();
    } else {
        renderStartMatchSummary();
    }
    document.getElementById('startMatchOverlay').style.display='flex';
}

// ── Step 1 (doar mod 3 echipe): alege ce echipă stă pe bancă prima repriză ──
function renderStartTeamPicker(){
    const groups = [
        { key:'orange', name: teamNames.orange,        color: teamColors.orange,        players: db.players.filter(p=>p.status==='orange') },
        { key:'green',  name: teamNames.green,          color: teamColors.green,         players: db.players.filter(p=>p.status==='green')  },
        { key:'bench',  name: teamNames.bench||'Echipa 3', color: teamColors.bench||'#7c4dff', players: db.players.filter(p=>p.status==='bench') },
    ];

    document.getElementById('startMatchBody').innerHTML =
        `<div style="font-size:.78rem;color:#7d6849;margin-bottom:12px;">Care echipă stă pe bancă în prima repriză? Celelalte două intră direct pe teren.</div>`
        + groups.map(g => `
            <div onclick="selectStartingBench('${g.key}')"
                style="background:#fffaf0;border-radius:10px;border:1px solid ${g.color}44;padding:10px 12px;margin-bottom:8px;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;"
                onmousedown="this.style.background='${g.color}15'" onmouseup="this.style.background='#fffaf0'">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <div style="font-family:'Bebas Neue',sans-serif;font-size:.9rem;letter-spacing:2px;color:${g.color};">${g.name} (${g.players.length})</div>
                    <span style="font-size:.68rem;color:#7d6849;">Stă pe bancă ›</span>
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:4px;">${
                    g.players.length
                        ? g.players.map(p=>`<span style="background:${g.color}11;border:1px solid ${g.color}33;color:${g.color};padding:2px 8px;border-radius:5px;font-size:.72rem;font-weight:700;">${p.name}</span>`).join('')
                        : '<span style="font-size:.7rem;color:#b71c1c;">Goală</span>'
                }</div>
            </div>`).join('');

    document.getElementById('startMatchActions').innerHTML =
        `<button onclick="closeStartMatch()" style="padding:12px;border-radius:10px;background:#fdf3df;border:1px solid #dcc89a;color:#7d6849;cursor:pointer;font-size:.85rem;">✕ Anulează</button>`;
}

// Utilizatorul a ales ce echipă stă pe bancă → reținem alegerea (fără să mutăm
// jucătorii sau să le schimbăm identitatea/culoarea în dashboard). Alegerea
// contează doar pentru mapping-ul teamA/teamB/teamC la lansarea meciului live.
function selectStartingBench(key){
    startBenchChoice = key;
    renderStartMatchSummary();
}

// ── Step 2: rezumat final + buton de start ──────────────────────────────
function renderStartMatchSummary(){
    const groups = {
        orange: { name: teamNames.orange,          color: teamColors.orange,          players: db.players.filter(p=>p.status==='orange') },
        green:  { name: teamNames.green,            color: teamColors.green,           players: db.players.filter(p=>p.status==='green')  },
        bench:  { name: teamNames.bench||'Echipa 3', color: teamColors.bench||'#111111', players: db.players.filter(p=>p.status==='bench') },
    };
    const has3 = groups.bench.players.length > 0;
    const benchKey = has3 ? (startBenchChoice || 'bench') : null;

    const teamBlock = (key) => {
        const g = groups[key];
        if(!g.players.length) return '';
        const sitsOut = key === benchKey;
        return `<div style="background:#fffaf0;border-radius:10px;border:1px solid ${g.color}33;padding:10px 12px;margin-bottom:8px;${sitsOut?'opacity:.7;':''}">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <div style="font-family:'Bebas Neue',sans-serif;font-size:.85rem;letter-spacing:2px;color:${g.color};">${g.name} (${g.players.length})</div>
                ${sitsOut ? '<span style="font-size:.62rem;color:#7d6849;background:#f1e4c8;border:1px solid #dcc89a;border-radius:6px;padding:1px 6px;">🪑 pe bancă</span>' : ''}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;">${g.players.map(p=>`<span style="background:${g.color}11;border:1px solid ${g.color}33;color:${g.color};padding:2px 8px;border-radius:5px;font-size:.72rem;font-weight:700;">${p.name}</span>`).join('')}</div>
        </div>`;
    };

    const playingKeys = ['orange','green','bench'].filter(k=>k!==benchKey);
    const warnings = [];
    if(!groups[playingKeys[0]].players.length) warnings.push(`⚠️ Echipa ${groups[playingKeys[0]].name} e goală`);
    if(!groups[playingKeys[1]].players.length) warnings.push(`⚠️ Echipa ${groups[playingKeys[1]].name} e goală`);
    if(has3 && !groups[benchKey].players.length) warnings.push('⚠️ Nicio echipă pe bancă (mod 3 echipe activ)');

    document.getElementById('startMatchBody').innerHTML =
        `<div style="font-size:.72rem;color:#7d6849;margin-bottom:12px;">Mod: <strong style="color:${has3?'#8e3a9e':'#1554b3'};">${has3?'3️⃣ Trei Echipe':'👥 Două Echipe'}</strong>${has3?' · pe bancă prima repriză: <strong>'+groups[benchKey].name+'</strong>':''}</div>`
        + (warnings.length ? `<div style="background:rgba(198,40,40,.1);border:1px solid #c6282855;border-radius:8px;padding:8px 12px;margin-bottom:12px;">${warnings.map(w=>`<div style="font-size:.75rem;color:#b71c1c;">${w}</div>`).join('')}</div>` : '')
        + teamBlock('orange')
        + teamBlock('green')
        + (has3 ? teamBlock('bench') : '');

    const canStart = groups[playingKeys[0]].players.length > 0 && groups[playingKeys[1]].players.length > 0;
    document.getElementById('startMatchActions').innerHTML =
        `<button id="launchLiveBtn" onclick="launchLive()" ${canStart?'':'disabled style="opacity:.4;cursor:not-allowed;"'}
            style="padding:14px;border-radius:10px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;background:linear-gradient(135deg,#dff3df,#28a745);border:1px solid #28a745;color:#3a2f1f;">
            ▶ Start Meci — Deschide Live
        </button>`
        + (has3 ? `<button onclick="renderStartTeamPicker()" style="padding:10px;border-radius:10px;background:none;border:1px solid #dcc89a;color:#7d6849;cursor:pointer;font-size:.8rem;">‹ Înapoi la alegerea echipei de pe bancă</button>` : '')
        + `<button onclick="closeStartMatch()" style="padding:12px;border-radius:10px;background:#fdf3df;border:1px solid #dcc89a;color:#7d6849;cursor:pointer;font-size:.85rem;">✕ Anulează</button>`;
}
function closeStartMatch(){ document.getElementById('startMatchOverlay').style.display='none'; }

async function launchLive(){
    const btn = document.getElementById('launchLiveBtn');
    if(btn){ btn.disabled=true; btn.textContent='⏳ Se pregătește...'; }

    const bP = db.players.filter(p=>p.status==='bench');
    const has3 = bP.length > 0; // auto-detect from bench players
    const benchKey = has3 ? (startBenchChoice || 'bench') : null;
    const playKeys = has3 ? ['orange','green','bench'].filter(k=>k!==benchKey) : [];

    try{
        const patch = {
            timer_status: 'idle',
            timer_elapsed_ms: 0,
            timer_started_at: null,
            round_start_sec: 0,
            three_team_mode: has3,
            // Echipa aleasă să stea pe bancă la acest meci devine teamC (indiferent
            // dacă e orange/green/bench) — celelalte două ocupă teamA/teamB.
            // Identitatea (culoarea/numele) echipelor NU se schimbă în dashboard.
            color_map: has3 ? { [playKeys[0]]:'teamA', [playKeys[1]]:'teamB', [benchKey]:'teamC' } : {},
            match_started_at: null,
        };

        // Reset live goals and rounds for fresh start
        await Promise.all([
            sb.from('live_goals').delete().neq('id','00000000-0000-0000-0000-000000000000'),
            sb.from('live_rounds').delete().neq('id','00000000-0000-0000-0000-000000000000'),
        ]);
        await sb.from('live_state').update(patch).eq('id',1);

        // Generate pseudo match ID from timestamp
        const matchTs = new Date().toISOString();
        const matchId = btoa(matchTs).replace(/[^a-zA-Z0-9]/g,'').slice(0,10);

        closeStartMatch();
        showToast('✅ Meci pregătit! Deschidere Live...');
        setTimeout(()=> window.open('live.html?match='+matchId, '_blank'), 400);
    }catch(e){
        showToast('⚠️ Eroare: '+e.message);
        if(btn){ btn.disabled=false; btn.textContent='▶ Start Meci — Deschide Live'; }
    }
}

// ── 3-team quick swap (index) ─────────────────────────────────────
function quickSwap(team){
    document.getElementById('balancePopup').classList.remove('show');
    const bench = db.players.filter(p=>p.status==='bench');
    const teamPlayers = db.players.filter(p=>p.status===team);
    if(!bench.length){ showToast('⚠️ Niciun jucător pe bancă!'); return; }
    const lbl = team==='orange' ? ('🟠 '+teamNames.orange) : ('🟢 '+teamNames.green);
    showConfirm('🔄','Schimbă Echipa?',
        `${lbl} (${teamPlayers.length} jucători) iese pe Bancă.
${bench.length} jucători de pe Bancă intră.`,
        '↔ Schimbă','#5a2fd9',
        async()=>{
            teamPlayers.forEach(p=>p.status='bench');
            bench.forEach(p=>p.status=team);
            render();
            try{ await Promise.all([...teamPlayers,...bench].map(p=>dbUpdatePlayer(p))); }
            catch(e){ showToast('⚠️ '+e.message); }
            showToast(`✅ ${lbl} schimbată cu Banca!`);
        }
    );
}


// ── Reset Prezență ────────────────────────────────────────────────
async function resetPrezenta(){
    if(!isAdmin()){showToast('⚠️ Doar adminul poate face asta!');return;}
    showConfirm('🔄','Reset Prezență?',
        'Toți jucătorii (inclusiv din echipe și bancă) vor fi mutați în lista Jucători și prezența se resetează.',
        'Da, Resetează','#c62828',
        async()=>{
            try{
                // Move all players to 'active'
                const moved = db.players.filter(p=>p.status!=='active');
                moved.forEach(p=>p.status='active');
                if(moved.length){
                    await Promise.all(moved.map(p=>sb.from('players').update({status:'active'}).eq('id',p.id)));
                }
                // Reset presence
                db.nextMatch.confirmedIds=[];
                db.nextMatch.absentIds=[];
                await dbSaveNextMatch();
                render();
                showToast(`✅ ${moved.length} jucători mutați în Jucători. Prezența resetată!`);
            }catch(e){showToast('⚠️ '+e.message);}
        }
    );
}

// ── Rotation: winner stays, loser swaps with bench ────────────────
function doRotation() {
    document.getElementById('balancePopup').classList.remove('show');
    const lastMatch = db.history[0];
    if (!lastMatch) { showToast('⚠️ Niciun meci înregistrat!'); return; }

    const winTeam  = lastMatch.winner === 'Portocaliu' ? 'orange' : 'green';
    const loseTeam = winTeam === 'orange' ? 'green' : 'orange';
    const losers   = db.players.filter(p => p.status === loseTeam);
    const bench    = db.players.filter(p => p.status === 'bench');

    if (!bench.length) { showToast('⚠️ Nu sunt jucători pe bancă pentru rotație!'); return; }

    const winLabel  = winTeam === 'orange' ? teamNames.orange : teamNames.green;
    const loseLabel = loseTeam === 'orange' ? '🟠 Portocaliu' : '🟢 Verde';

    showConfirm('🔄', 'Rotație Echipe',
        `${winLabel} rămâne. ${loseLabel} iese (${losers.length} jucători → Bancă).\n${bench.length} jucători de pe Bancă intră în locul lor.`,
        'Aplică Rotația', '#1b7a35',
        async () => {
            // Loser team → bench
            losers.forEach(p => p.status = 'bench');
            // Bench players → loser team slot (up to loser count)
            const incoming = bench.slice(0, losers.length);
            incoming.forEach(p => p.status = loseTeam);
            // Remaining bench stays bench
            render();
            try { await Promise.all([...losers, ...incoming].map(p => dbUpdatePlayer(p))); showToast(`✅ Rotație aplicată! ${winLabel} rămâne.`); }
            catch(e) { showToast('⚠️ '+e.message); }
        }
    );
}

// ── Draft Mode ────────────────────────────────────────────────────
let draftState = { picks: [], currentTurn: 'orange', captains: {orange:null, green:null}, available: [] };

function openDraftMode() {
    document.getElementById('balancePopup').classList.remove('show');
    const eligible = getEligiblePlayers();
    const active = eligible.length >= 4
        ? eligible
        : db.players.filter(p => ['orange','green','bench'].includes(p.status));
    if (active.length < 4) { showToast('⚠️ Minim 4 jucători pentru Draft!'); return; }

    // Move all active to neutral pool
    active.forEach(p => p.status = 'bench');

    // Pick 2 captains: highest rated available
    const sorted = [...active].sort((a,b) => getSmartRating(b) - getSmartRating(a));
    const capO = sorted[0], capG = sorted[1];
    capO.status = 'orange'; capG.status = 'green';
    const pool = sorted.slice(2);

    draftState = {
        available: pool,
        currentTurn: 'orange',  // orange picks first after captains
        picks: [{player:capO,team:'orange'},{player:capG,team:'green'}],
        captains: {orange: capO, green: capG}
    };

    document.getElementById('draftCapOrangeName').textContent = capO.name;
    document.getElementById('draftCapGreenName').textContent  = capG.name;
    renderDraft();
    document.getElementById('draftOverlay').style.display = 'flex';
    render();
}

function renderDraft() {
    const {available, currentTurn, picks} = draftState;
    const oCount = picks.filter(p=>p.team==='orange').length;
    const gCount = picks.filter(p=>p.team==='green').length;
    const color  = currentTurn === 'orange' ? 'var(--orange)' : '#2e7d32';
    const label  = currentTurn === 'orange' ? '🟠 Portocaliu' : '🟢 Verde';

    document.getElementById('draftStatus').textContent = `Portocaliu: ${oCount} · Verde: ${gCount} · Disponibili: ${available.length}`;
    document.getElementById('draftPickIndicator').innerHTML = available.length
        ? `<span style="color:${color};">Alege ${label}</span>`
        : '<span style="color:#2e7d32;">Draft complet! ✅</span>';

    document.getElementById('draftPickIndicator').style.background = available.length
        ? (currentTurn==='orange'?'rgba(255,140,0,.08)':'rgba(40,167,69,.08)') : 'rgba(40,167,69,.05)';

    const grid = document.getElementById('draftPlayerGrid');
    if (!available.length) { grid.innerHTML = '<div style="text-align:center;color:#7d6849;padding:20px;">Toți jucătorii au fost aleși!</div>'; return; }

    grid.innerHTML = available.map((p, i) => {
        const smart = getSmartRating(p).toFixed(1);
        const tags = getPlayerActiveTagObjects(p).slice(0,3).map(t=>`<span class="ptag ${t.tag.type==='pos'?'tag-pos':t.tag.type==='neg'?'tag-neg':'tag-neu'}" style="font-size:.58rem;padding:1px 5px;">${t.tag.emoji}</span>`).join('');
        return `<div onclick="draftPick(${i})" style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:#fff8ed;border:1px solid #dcc89a;border-radius:10px;cursor:pointer;transition:all .15s;"
            onmouseover="this.style.borderColor='${currentTurn==='orange'?'var(--orange)':'#1b7a35'}'"
            onmouseout="this.style.borderColor='#dcc89a'">
            <div style="width:34px;height:34px;border-radius:50%;background:#fdf3df;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:.85rem;color:#7d6849;">${p.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
            <div style="flex:1;">
                <div style="font-weight:700;color:#3a2f1f;font-size:.9rem;">${p.name}</div>
                <div style="display:flex;gap:4px;margin-top:2px;">${tags}</div>
            </div>
            <div style="font-family:'Bebas Neue',sans-serif;font-size:1rem;color:var(--star);">★ ${smart}</div>
        </div>`;
    }).join('');
}

function draftPick(idx) {
    const {available, currentTurn} = draftState;
    const player = available[idx];
    if (!player) return;

    player.status = currentTurn;
    draftState.picks.push({player, team: currentTurn});
    draftState.available = available.filter((_,i) => i !== idx);

    // Snake draft order: O G G O O G G...
    const pickNum = draftState.picks.length - 2; // exclude captains
    draftState.currentTurn = (Math.floor(pickNum / 2) % 2 === 0) ? 'orange' : 'green';

    if (navigator.vibrate) navigator.vibrate(30);
    renderDraft();
    render();
}

function confirmDraft() {
    const all = [...db.players.filter(p => p.status === 'orange' || p.status === 'green')];
    Promise.all(all.map(p => dbUpdatePlayer(p))).catch(e => showToast('⚠️ '+e.message));
    closeDraft();
    showToast(`✅ Draft confirmat! Echipe formate.`);
}

function closeDraft() {
    document.getElementById('draftOverlay').style.display = 'none';
}

// ── Rating la o anumită dată (pentru calculul scorului istoric) ──
function getSmartRatingAtDate(player, dateStr) {
    const targetDate = parseDateToObj(dateStr);
    // Filtrează ratingurile care existau la data meciului
    const validRatings = player.ratings.filter(r => {
        if (!r.date || r.date === '—') return true; // ratinguri fără dată = mereu valide
        const rDate = parseDateToObj(r.date);
        return rDate <= targetDate;
    });
    if (validRatings.length === 0) return 5; // default

    const cats = ['general','viteza','tehnica','strategie','aparare'];
    const base = cats.reduce((s,c) =>
        s + (validRatings.reduce((a,r)=>a+(r[c]||5),0)/validRatings.length)*W[c], 0);
    // Win rate la acel moment — calculat din meciurile de dinainte
    const matchesBefore = db.history.filter(h => parseDateToObj(h.date) < targetDate);
    let wins = 0, games = 0;
    matchesBefore.forEach(h => {
        const inMatch = [...(h.orangePlayers||[]),...(h.greenPlayers||[])].includes(player.name);
        if (!inMatch) return;
        games++;
        const isOrange = (h.orangePlayers||[]).includes(player.name);
        if ((isOrange && h.winner==='Portocaliu') || (!isOrange && h.winner==='Verde')) wins++;
    });
    const wr = games > 0 ? 1 + (wins/games)*9 : 5;
    return parseFloat((base + wr*W.winrate).toFixed(2));
}

function parseDateToObj(dateStr) {
    if (!dateStr || dateStr === '—') return new Date(0);
    if (dateStr.includes('.')) {
        const [d,m,y] = dateStr.split('.');
        return new Date(`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}T12:00:00`);
    }
    return new Date(dateStr);
}

function recalculateAllPlayerStats() {
    db.players.forEach(p => { p.wins = 0; p.games = 0; p.matchHistory = []; p.totalGoals = 0; });

    // Sortează după data reală a meciului, cel mai vechi primul
    const sortedHistory = [...db.history].sort((a, b) =>
        parseDateToObj(a.date) - parseDateToObj(b.date)
    );

    sortedHistory.forEach(h => {
        const orangeNames = h.orangePlayers || [];
        const greenNames  = h.greenPlayers  || [];
        const blackNames  = h.blackPlayers  || [];

        // Comparație robustă (case-insensitive, "conține"), identică cu playerWonMatch:
        // un rezultat de tip 'Egal' sau câștigat de a treia echipă NU e victorie pentru orange/green.
        const w = (h.winner || '').toLowerCase().trim();
        const orangeWon = !!w && w !== 'egal' && (w.includes('portocaliu') || w.includes('orange'));
        const greenWon  = !!w && w !== 'egal' && (w.includes('verde') || w.includes('green'));
        const blackWon  = !!w && w !== 'egal' && (w.includes('negru') || w.includes('black'));

        orangeNames.forEach(name => {
            const p = db.players.find(x => x.name === name);
            if (!p) return;
            p.games++;
            if (orangeWon) p.wins++;
            p.matchHistory.push(orangeWon ? 'W' : 'L');
        });

        greenNames.forEach(name => {
            const p = db.players.find(x => x.name === name);
            if (!p) return;
            p.games++;
            if (greenWon) p.wins++;
            p.matchHistory.push(greenWon ? 'W' : 'L');
        });

        blackNames.forEach(name => {
            const p = db.players.find(x => x.name === name);
            if (!p) return;
            p.games++;
            if (blackWon) p.wins++;
            p.matchHistory.push(blackWon ? 'W' : 'L');
        });

        // Goluri — sumate din playerGoals al fiecărui meci (sursă: match_goals, mereu suprascris corect la editare)
        if (h.playerGoals) {
            Object.entries(h.playerGoals).forEach(([name, g]) => {
                const p = db.players.find(x => x.name === name);
                if (p) p.totalGoals += (g || 0);
            });
        }
    });

    // Salvează wins, games și match_history în DB pentru toți jucătorii afectați
    db.players.forEach(p => dbUpdatePlayer(p).catch(e => console.warn('recalc save:', e.message)));
}

function confirmDeleteMatch(idx) {
    const h = db.history[idx];
    showConfirm('🗑️', `Șterge meciul din ${h.date}?`, 'Meciul va fi șters definitiv din istoric.', 'Șterge', '#c62828', async () => {
        try {
            if (h._dbId) {
                await sb.from('match_history').delete().eq('id', h._dbId);
            } else {
                // Încearcă delete după date+winner
                await sb.from('match_history').delete().eq('date', h.date).eq('winner', h.winner);
            }
            db.history.splice(idx, 1);
            recalculateAllPlayerStats();
            // Salvează toți jucătorii afectați
            await Promise.all(db.players.map(p => dbUpdatePlayer(p)));
            render();
            showToast('🗑️ Meci șters și stats recalculate.');
        } catch(e) { showToast('⚠️ ' + e.message); }
    });
}

function deleteMatchEdit() {
    if (matchEditorIdx !== null) {
        closeMatchEditor();
        confirmDeleteMatch(matchEditorIdx);
    }
}

let voteState = {
    match: null,          // istoricul meciului
    players: [],          // jucătorii de votat (fără self)
    currentIdx: 0,
    votes: {},            // { playerId: { general, viteza, tehnica, strategie, aparare } }
    raterName: null,
    detailsOpen: {}       // { playerId: bool }
};

async function checkPresenceModal() {
    // Verifică dacă există meci viitor programat
    const nm = db.nextMatch;
    if (!nm.date) return false;

    const matchDate = new Date(nm.date + 'T' + (nm.time || '00:00'));
    const now = new Date();
    if (matchDate <= now) return false; // meciul a trecut

    // Găsește jucătorul curent
    let myPlayer = null;
    if (currentProfile?.player_id) myPlayer = db.players.find(p=>p.id==currentProfile.player_id);
    if (!myPlayer && currentProfile?.display_name) myPlayer = db.players.find(p=>p.name.toLowerCase()===currentProfile.display_name.toLowerCase());
    if (!myPlayer) return false;

    // A răspuns deja?
    const alreadyConfirmed = nm.confirmedIds.includes(myPlayer.id);
    const alreadyAbsent    = (nm.absentIds||[]).includes(myPlayer.id);
    if (alreadyConfirmed || alreadyAbsent) return false;

    // Verifică sessionStorage — dacă a sarit deja în sesiunea asta
    const skipKey = `presence_skip_${currentUser.id}_${nm.date}`;
    if (sessionStorage.getItem(skipKey)) return false;

    // Afișează modalul
    let matchStr = matchDate.toLocaleDateString('ro-RO', {weekday:'long', day:'numeric', month:'long'});
    if (nm.time) matchStr += ' · ' + nm.time;
    if (nm.location) matchStr += ' · ' + nm.location;
    document.getElementById('presenceMatchInfo').textContent = matchStr;
    document.getElementById('presencePlayerName').textContent = `ca ${myPlayer.name}`;
    document.getElementById('presenceOverlay').style.display = 'flex';

    // Salvează referința la jucător pentru respondPresence
    window._presencePlayer = myPlayer;
    return true;
}

async function respondPresence(present) {
    const myPlayer = window._presencePlayer;
    if (!myPlayer) return;

    const nm = db.nextMatch;
    if (!nm.absentIds) nm.absentIds = [];

    if (present) {
        // Adaugă la confirmați dacă nu e deja
        if (!nm.confirmedIds.includes(myPlayer.id)) nm.confirmedIds.push(myPlayer.id);
        // Scoate din absenți dacă era
        const absIdx = nm.absentIds.indexOf(myPlayer.id);
        if (absIdx !== -1) nm.absentIds.splice(absIdx, 1);
        // Mută jucătorul în Pe Bancă (așteptând formarea echipelor)
        myPlayer.status = 'bench';
        await dbUpdatePlayer(myPlayer).catch(()=>{});
        showToast(`✅ Prezență confirmată! Te așteptăm, ${myPlayer.name}!`, 'g');
    } else {
        // Adaugă la absenți
        if (!nm.absentIds.includes(myPlayer.id)) nm.absentIds.push(myPlayer.id);
        // Scoate din confirmați dacă era
        const confIdx = nm.confirmedIds.indexOf(myPlayer.id);
        if (confIdx !== -1) nm.confirmedIds.splice(confIdx, 1);
        // Dacă era pe bancă, mută înapoi în activi (point 5)
        if (myPlayer.status === 'bench') {
            myPlayer.status = 'active';
            await dbUpdatePlayer(myPlayer).catch(()=>{});
        }
        showToast(`❌ Absență înregistrată. Data viitoare!`);
    }

    document.getElementById('presenceOverlay').style.display = 'none';

    try {
        await dbSaveNextMatch();
    } catch(e) { showToast('⚠️ ' + e.message); }

    render();
}

function parseMatchDate(dateStr) {
    return parseDateToObj(dateStr);
}

function toggleSection(bodyId, chevronId) {
    const body = document.getElementById(bodyId);
    const chev = document.getElementById(chevronId);
    if (!body) return;
    const isOpen = body.classList.toggle('open');
    if (chev) chev.classList.toggle('open', isOpen);
}

async function init(){
    document.getElementById('current-date').innerText=new Date().toLocaleDateString('ro-RO',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    await registerServiceWorker();

    const { data: { session } } = await sb.auth.getSession();
    if(session?.user){
        await onAuthSuccess(session.user);
    } else {
        document.getElementById('authOverlay').classList.remove('hidden');
    }

    sb.auth.onAuthStateChange(async (event, session) => {
        if(event==='SIGNED_IN' && session?.user && !currentUser){
            await onAuthSuccess(session.user);
        }
        if(event==='SIGNED_OUT'){ currentUser=null; currentProfile=null; }
    });

    window.addEventListener('online',()=>{setConnected(true);if(currentUser)loadAll();});
    window.addEventListener('offline',()=>setConnected(false));
}

init();
