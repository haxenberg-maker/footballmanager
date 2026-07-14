<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>Live · Arena Friends FC</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
html{overflow-x:clip;max-width:100vw;}
html,body{background:#f7ecd9;color:#3a2f1f;font-family:'Rajdhani',sans-serif;min-height:100vh;min-height:100dvh;overscroll-behavior-y:contain;}
:root{--o:#ff8c00;--g:#28a745;--b:#e3d3ac;--accent:#3d5afe;}

.hd{background:#f3e6cf;border-bottom:1px solid var(--b);padding:8px 14px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:30;}
.hd-logo{font-family:'Bebas Neue',sans-serif;font-size:.95rem;letter-spacing:3px;}
.hd-right{display:flex;align-items:center;gap:8px;}
.live-pill{display:flex;align-items:center;gap:4px;background:rgba(40,167,69,.12);border:1px solid rgba(40,167,69,.3);padding:2px 7px;border-radius:12px;}
.live-dot{width:6px;height:6px;border-radius:50%;background:#28a745;box-shadow:0 0 6px #28a745;animation:blink 1.5s infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:.2;}}
.live-lbl{font-size:.58rem;font-weight:700;color:#1b7a43;text-transform:uppercase;letter-spacing:1px;}
.conn-pill{display:flex;align-items:center;gap:4px;padding:2px 7px;border-radius:12px;font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px;transition:all .2s;}
.conn-pill.ok{background:rgba(40,167,69,.12);border:1px solid rgba(40,167,69,.3);color:#1b7a43;}
.conn-pill.warn{background:rgba(255,193,7,.15);border:1px solid #ffc107;color:#8a6800;}
.conn-pill.off{background:rgba(198,40,40,.15);border:1px solid #c62828;color:#b71c1c;}
.conn-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.conn-pill.ok .conn-dot{background:#28a745;}
.conn-pill.warn .conn-dot{background:#ffc107;animation:blink 1s infinite;}
.conn-pill.off .conn-dot{background:#c62828;animation:blink .6s infinite;}
.icon-btn{background:none;border:1px solid var(--b);color:#6b5840;padding:7px 11px;border-radius:7px;font-size:.75rem;cursor:pointer;white-space:nowrap;min-height:36px;touch-action:manipulation;}
.icon-btn:hover{border-color:#7d6849;color:#5c4a32;}
.icon-btn.danger{border-color:#c6282833;color:#b71c1c44;}
.icon-btn.danger:hover{border-color:#c62828;color:#b71c1c;}

.timer-bar{background:#fffaf0;border-bottom:1px solid var(--b);padding:8px 14px;display:flex;align-items:center;gap:10px;}
.timer-btn{padding:10px 20px;border-radius:10px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;border:1px solid;transition:all .12s;flex-shrink:0;touch-action:manipulation;min-height:44px;}
.timer-btn.start{background:rgba(40,167,69,.1);border-color:var(--g);color:#1b7a43;}
.timer-btn.pause{background:rgba(255,204,0,.1);border-color:#8a6800;color:#8a6800;}
.timer-btn.resume{background:rgba(61,90,254,.1);border-color:var(--accent);color:#1554b3;}
.timer-display{font-family:'Bebas Neue',sans-serif;font-size:1.6rem;color:#3a2f1f;letter-spacing:3px;min-width:60px;}
.timer-display.running{color:#1b7a43;}
.timer-display.paused{color:#8a6800;}
.half-badge{font-size:.62rem;color:#7d6849;flex:1;}

.score-wrap{background:#f3e6cf;border-bottom:2px solid var(--b);padding:10px 12px 4px;}
.score-row{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:6px;}
.sc-side{display:flex;flex-direction:column;}
.sc-side.right{align-items:flex-end;}
/* ── Team Config Edit ───────────────────────────────────── */
.sc-lbl{font-size:.58rem;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;margin-bottom:2px;cursor:pointer;display:flex;align-items:center;gap:4px;touch-action:manipulation;}
.sc-lbl-edit{font-size:.55rem;opacity:.4;}
.team-edit-overlay{position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:600;display:none;align-items:center;justify-content:center;padding:16px;}
.team-edit-overlay.show{display:flex;}
.team-edit-box{background:#fff8ed;width:100%;max-width:360px;border-radius:16px;border:1px solid #d3bd8c;overflow:hidden;}
.team-edit-hd{padding:14px 18px 0;display:flex;align-items:center;justify-content:space-between;}
.team-edit-title{font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:2px;color:#3a2f1f;}
.team-edit-close{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:#7d6849;width:28px;height:28px;border-radius:7px;cursor:pointer;font-size:.8rem;display:flex;align-items:center;justify-content:center;touch-action:manipulation;}
.team-edit-body{padding:14px 18px 18px;display:flex;flex-direction:column;gap:12px;}
.team-edit-lbl{font-size:.6rem;text-transform:uppercase;letter-spacing:1px;color:#6b5840;margin-bottom:5px;}
.team-edit-input{width:100%;background:#fffaf0;border:1px solid #3d5afe;color:#3a2f1f;border-radius:9px;padding:11px 14px;font-size:1rem;font-family:'Rajdhani',sans-serif;font-weight:600;outline:none;}
.team-edit-input:focus{border-color:#1554b3;box-shadow:0 0 0 2px rgba(61,90,254,.2);}
.color-palette{display:flex;flex-wrap:wrap;gap:8px;}
.color-swatch{width:34px;height:34px;border-radius:8px;cursor:pointer;border:2px solid transparent;transition:transform .1s,border-color .1s;touch-action:manipulation;}
.color-swatch:active{transform:scale(.88);}
.color-swatch.sel{border-color:#3a2f1f !important;transform:scale(1.1);box-shadow:0 0 0 2px rgba(255,255,255,.3);}
.color-preview-bar{height:4px;border-radius:2px;margin-top:4px;transition:background .2s;}
.team-edit-actions{display:flex;gap:8px;margin-top:4px;}
.team-edit-cancel{flex:1;padding:11px;border-radius:9px;background:#fdf3df;border:1px solid #dcc89a;color:#7d6849;cursor:pointer;font-size:.85rem;touch-action:manipulation;}
.team-edit-save{flex:2;padding:11px;border-radius:9px;font-family:'Bebas Neue',sans-serif;font-size:.95rem;letter-spacing:2px;cursor:pointer;background:linear-gradient(135deg,#1a3a2a,var(--g));border:1px solid var(--g);color:#3a2f1f;touch-action:manipulation;}
/* All teams manager */
.all-teams-btn{display:flex;align-items:center;gap:5px;padding:6px 10px;border-radius:7px;font-size:.68rem;font-weight:700;cursor:pointer;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:#7d6849;touch-action:manipulation;}
.sc-lbl.o{color:var(--o);}
.sc-lbl.g{color:var(--g);}
.sc-n{font-family:'Bebas Neue',sans-serif;font-size:5rem;line-height:.9;transition:transform .15s,text-shadow .15s;}
.sc-n.o{color:var(--o);}
.sc-n.g{color:var(--g);}
.sc-n.bump{transform:scale(1.25);text-shadow:0 0 30px currentColor;}
.sc-sep{font-family:'Bebas Neue',sans-serif;font-size:2rem;color:#e3d3ac;padding:0 4px;}
.score-sub{text-align:center;font-size:.62rem;color:#7d6849;padding:3px 0 7px;min-height:18px;}
.score-sub b{color:#7d6849;}

.undo-bar{background:#fffaf0;border-bottom:1px solid var(--b);padding:8px 14px;display:flex;align-items:center;gap:8px;min-height:42px;}
.undo-lbl{flex:1;font-size:.75rem;color:#7d6849;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.undo-lbl span{color:#3a2f1f;}

.universal-undo-btn{position:fixed;right:14px;bottom:calc(64px + max(8px,env(safe-area-inset-bottom)));z-index:500;display:none;flex-direction:column;align-items:flex-end;gap:2px;background:linear-gradient(135deg,#fdf3df,#f1e0bb);border:1px solid #b89860;color:#3a2f1f;padding:10px 14px;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,.35);cursor:pointer;touch-action:manipulation;max-width:min(78vw,320px);}
.universal-undo-btn.show{display:flex;}
.universal-undo-btn .uu-main{font-size:.82rem;font-weight:700;letter-spacing:.3px;white-space:nowrap;}
.universal-undo-btn .uu-sub{font-size:.62rem;color:#7d6849;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}
.universal-undo-btn:active{transform:scale(.96);}

.teams-wrap{display:grid;grid-template-columns:1fr 1fr;overflow:hidden;}
.team-col{padding:4px 3px 6px;}
.team-col.o-col{border-right:1px solid var(--b);}
.team-hd{display:flex;align-items:baseline;justify-content:space-between;padding:3px 3px 5px;border-bottom:1px solid #f1e4c8;margin-bottom:3px;}
.team-hd-lbl{font-family:'Bebas Neue',sans-serif;font-size:.78rem;letter-spacing:1.5px;}
.team-hd-lbl.o{color:var(--o);}
.team-hd-lbl.g{color:var(--g);}
.team-hd-cnt{font-size:.58rem;color:#7d6849;}
.pr{display:flex;align-items:center;padding:2px 2px;gap:3px;min-height:46px;}
.pr-name{flex:1;font-weight:700;font-size:.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;}
.pr-cnt{font-family:'Bebas Neue',sans-serif;font-size:1.2rem;min-width:18px;text-align:center;color:#dcc89a;transition:color .15s;flex-shrink:0;}
.pr-cnt.has{color:#3a2f1f;}
.pr-minus{width:34px;height:42px;background:none;border:none;color:#7d6849;font-size:.9rem;cursor:pointer;display:none;align-items:center;justify-content:center;border-radius:6px;flex-shrink:0;touch-action:manipulation;}
.pr-minus.show{display:flex;}
.pr-minus:active{background:#fdf3df;color:#b71c1c;}
.pr-plus{width:40px;height:42px;border-radius:9px;border:1px solid;font-size:1.3rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .1s,background .1s;-webkit-tap-highlight-color:transparent;touch-action:manipulation;}
.pr-plus:active,.pr-plus.busy{transform:scale(.88);}
.pr-plus.busy{opacity:.4;pointer-events:none;}
.o-col .pr-plus{background:rgba(255,140,0,.08);border-color:rgba(255,140,0,.2);color:var(--o);}
.o-col .pr-plus:active{background:rgba(255,140,0,.22);}
.g-col .pr-plus{background:rgba(40,167,69,.08);border-color:rgba(40,167,69,.2);color:var(--g);}
.g-col .pr-plus:active{background:rgba(40,167,69,.22);}

.log-toggle{background:#f7ecd9;border-top:1px solid var(--b);padding:7px 14px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;}
.log-toggle-lbl{font-size:.72rem;color:#7d6849;display:flex;align-items:center;gap:6px;}
.log-toggle-cnt{background:rgba(61,90,254,.15);border:1px solid #d3bd8c;color:#1554b3;font-size:.6rem;padding:1px 6px;border-radius:10px;}
.log-panel{display:none;background:#f3e6cf;border-top:1px solid var(--b);max-height:220px;overflow-y:auto;padding-bottom:12px;}
.log-panel.open{display:block;}
.log-entry{display:flex;align-items:center;gap:8px;padding:7px 14px;border-bottom:1px solid #f5e9d4;font-size:.78rem;}
.log-entry:last-child{border-bottom:none;}
.log-min{font-family:'Bebas Neue',sans-serif;font-size:.85rem;color:#7d6849;min-width:28px;}
.log-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.log-name{flex:1;font-weight:700;}
.log-badge{font-size:.6rem;padding:1px 5px;border-radius:4px;background:rgba(105,240,174,.1);border:1px solid rgba(105,240,174,.2);color:#1b7a43;}
.log-empty{padding:16px 14px;color:#7d6849;font-size:.78rem;text-align:center;}

.bottom-bar{position:fixed;bottom:0;left:0;right:0;background:#f3e6cf;border-top:1px solid var(--b);padding:8px 12px;padding-bottom:max(8px,env(safe-area-inset-bottom));display:flex;gap:7px;z-index:30;}
.btn-finalize{flex:1;padding:13px;border-radius:9px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;background:linear-gradient(135deg,#1a3a2a,var(--g));border:1px solid var(--g);color:#3a2f1f;min-height:48px;touch-action:manipulation;}
.btn-finalize:disabled{opacity:.35;cursor:not-allowed;}
/* Extra padding so last player row is never hidden by bottom-bar */
main, body{padding-bottom:80px;}

.dialog-overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:100;display:none;align-items:center;justify-content:center;padding:16px;}
.dialog-overlay.show{display:flex;}
.dialog-box{background:#fff8ed;width:100%;max-width:520px;border-radius:16px;border:1px solid #d3bd8c;padding:20px;max-height:88vh;max-height:88dvh;overflow-y:auto;}
.dialog-title{font-family:'Bebas Neue',sans-serif;font-size:1.3rem;letter-spacing:3px;margin-bottom:4px;}
.dialog-score{font-family:'Bebas Neue',sans-serif;font-size:2.2rem;margin:8px 0;}
.dialog-section{font-size:.62rem;text-transform:uppercase;letter-spacing:1px;color:#7d6849;margin:12px 0 6px;}
.scorer-row{display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #f1e4c8;font-size:.82rem;}
.scorer-row:last-child{border-bottom:none;}
.scorer-dot{width:8px;height:8px;border-radius:50%;}
.scorer-name{flex:1;font-weight:700;}
.scorer-goals{font-family:'Bebas Neue',sans-serif;font-size:.95rem;color:#3a2f1f;}
.scorer-mins{font-size:.68rem;color:#7d6849;}
.mvp-row{display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,204,0,.06);border:1px solid rgba(255,204,0,.2);border-radius:9px;margin:8px 0;}
.mvp-icon{font-size:1.4rem;}
.mvp-info-lbl{font-size:.6rem;color:#7d6849;text-transform:uppercase;letter-spacing:1px;}
.mvp-info-name{font-weight:700;font-size:.95rem;color:#8a6800;}
.dialog-actions{display:flex;gap:8px;margin-top:14px;}
.dia-cancel{flex:0 0 auto;padding:12px 16px;border-radius:9px;background:#fdf3df;border:1px solid #d3bd8c;color:#7d6849;font-size:.82rem;cursor:pointer;}
.dia-confirm{flex:1;padding:12px;border-radius:9px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;border:1px solid var(--g);color:#3a2f1f;background:linear-gradient(135deg,#1a3a2a,var(--g));}

.toast{position:fixed;top:16px;left:50%;transform:translateX(-50%);background:#fdf3df;border:1px solid var(--accent);color:#3a2f1f;padding:8px 16px;border-radius:9px;font-size:.82rem;font-weight:700;opacity:0;transition:opacity .3s;pointer-events:none;z-index:999;white-space:nowrap;}
.toast.show{opacity:1;}
.empty-teams{text-align:center;padding:40px 16px;color:#7d6849;grid-column:span 2;font-size:.85rem;}

/* 3-team */
.three-mode-bar{background:#fffaf0;border-top:2px solid #9c27b0;padding:10px 14px;display:none;}
.three-mode-bar.show{display:block;}
.waiting-team{background:linear-gradient(135deg,#1a0050,#2d006a);border:2px dashed #7c4dff;border-radius:12px;padding:10px;margin-bottom:6px;}
.waiting-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.waiting-lbl{font-family:'Bebas Neue',sans-serif;font-size:.85rem;letter-spacing:2px;color:#8e3a9e;}
.swap-btn{padding:5px 12px;border-radius:7px;font-size:.72rem;font-weight:700;cursor:pointer;white-space:nowrap;}
.swap-o{background:rgba(255,140,0,.2);color:var(--o);border:1px solid rgba(255,140,0,.4)!important;}
.swap-g{background:rgba(40,167,69,.2);color:var(--g);border:1px solid rgba(40,167,69,.4)!important;}
.threshold-row{display:flex;align-items:center;gap:8px;padding:6px 0;}
.thr-lbl{font-size:.7rem;color:#7d6849;flex:1;}
.thr-btn{width:32px;height:32px;border-radius:7px;background:#fdf3df;border:1px solid #dcc89a;color:#7d6849;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;touch-action:manipulation;}

/* Reset confirm modal */
.reset-overlay{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:500;display:none;align-items:center;justify-content:center;padding:20px;}
.reset-overlay.show{display:flex;}
.reset-box{background:#fff8ed;width:100%;max-width:360px;border-radius:16px;border:1px solid #c62828;padding:24px;text-align:center;}
.reset-title{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:3px;color:#b71c1c;margin-bottom:8px;}
.reset-sub{font-size:.8rem;color:#6b5840;margin-bottom:20px;line-height:1.5;}
.reset-actions{display:flex;gap:8px;}
.reset-cancel{flex:1;padding:13px;border-radius:9px;background:#fdf3df;border:1px solid #dcc89a;color:#7d6849;cursor:pointer;font-size:.88rem;touch-action:manipulation;}
.reset-confirm{flex:1;padding:13px;border-radius:9px;background:linear-gradient(135deg,#3a1a1a,#c62828);border:1px solid #c62828;color:#3a2f1f;cursor:pointer;font-family:'Bebas Neue',sans-serif;font-size:.95rem;letter-spacing:1.5px;touch-action:manipulation;}
.result-overlay{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:500;display:none;align-items:center;justify-content:center;padding:20px;}
.result-overlay.show{display:flex;}
.result-box{background:#fff8ed;width:100%;max-width:400px;border-radius:16px;border:1px solid #28a745;padding:22px;text-align:center;}
.result-title{font-family:'Bebas Neue',sans-serif;font-size:1.3rem;letter-spacing:2px;color:#1b7a43;margin-bottom:10px;}
.result-preview{background:#f3e6cf;border:1px solid #e3d3ac;border-radius:10px;padding:12px;font-size:.78rem;color:#3a2f1f;text-align:left;white-space:pre-wrap;line-height:1.5;margin-bottom:14px;max-height:220px;overflow-y:auto;}
.result-actions{display:flex;gap:8px;}
.result-copy{flex:1;padding:13px;border-radius:9px;background:linear-gradient(135deg,#dff3df,#28a745);border:1px solid #28a745;color:#3a2f1f;cursor:pointer;font-family:'Bebas Neue',sans-serif;font-size:.95rem;letter-spacing:1px;touch-action:manipulation;}
.result-close{flex:1;padding:13px;border-radius:9px;background:#fdf3df;border:1px solid #dcc89a;color:#7d6849;cursor:pointer;font-size:.85rem;touch-action:manipulation;}
.thr-val{font-family:'Bebas Neue',sans-serif;font-size:1rem;color:#8e3a9e;min-width:20px;text-align:center;}
.round-badge{font-size:.58rem;padding:1px 5px;border-radius:4px;background:rgba(124,77,255,.15);border:1px solid #7c4dff;color:#8e3a9e;margin-left:4px;}
.rotation-toast{position:fixed;top:60px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#ede3fa,#8e3a9e);border:1px solid #7c4dff;color:#3a2f1f;padding:14px 24px;border-radius:12px;font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:2px;z-index:500;display:none;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.8);}
.rotation-toast.show{display:block;animation:rotPop .3s ease;}
@keyframes rotPop{from{transform:translateX(-50%) scale(.8);opacity:0}to{transform:translateX(-50%) scale(1);opacity:1}}
#roundTimeBar{display:none;align-items:center;gap:6px;padding:5px 0;border-top:1px solid #e3d3ac;margin-top:4px;}

/* Team ID badges */
.tid{font-size:.55rem;padding:1px 5px;border-radius:3px;font-weight:700;font-family:'Rajdhani',sans-serif;vertical-align:middle;}
.tid-a{background:rgba(255,140,0,.18);color:#9c4f00;border:1px solid rgba(255,140,0,.35);}
.tid-b{background:rgba(40,167,69,.18);color:#1b7a35;border:1px solid rgba(40,167,69,.35);}
.tid-c{background:rgba(124,77,255,.18);color:#8e3a9e;border:1px solid rgba(124,77,255,.35);}

/* Ture history */
.ture-section{display:none;background:#f3e6cf;border-top:1px solid #e3d3ac;}
.ture-section.show{display:block;}
.ture-toggle{display:flex;align-items:center;justify-content:space-between;padding:7px 14px;cursor:pointer;border-bottom:1px solid #f1e4c8;}
.ture-toggle-lbl{font-size:.72rem;color:#7d6849;display:flex;align-items:center;gap:6px;}
.ture-cnt{background:rgba(124,77,255,.15);border:1px solid #7c4dff;color:#8e3a9e;font-size:.6rem;padding:1px 6px;border-radius:10px;}
.ture-body{max-height:220px;overflow-y:auto;display:none;}
.ture-body.open{display:block;}
/* ── Code Auth ───────────────────────────── */
.code-auth-overlay{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:700;display:none;align-items:center;justify-content:center;padding:20px;}
.code-auth-overlay.show{display:flex;}
.code-auth-box{background:#fff8ed;width:100%;max-width:320px;border-radius:16px;border:1px solid #d3bd8c;padding:20px;}
.admin-badge{display:none;font-size:.58rem;background:rgba(61,90,254,.15);border:1px solid #3d5afe44;color:#1554b3;padding:3px 8px;border-radius:6px;font-weight:700;cursor:pointer;white-space:nowrap;}
.hd-key-btn{background:none;border:1px solid #dcc89a;color:#6b5840;padding:5px 9px;border-radius:7px;font-size:.7rem;cursor:pointer;touch-action:manipulation;}
/* ── Add Temp Player Modal ──────────────────────────────── */
/* ── Ultima Faza ─────────────────────────────────────────── */
.uf-overlay{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:480;display:none;align-items:center;justify-content:center;padding:16px;}
.uf-overlay.show{display:flex;animation:ufPop .25s ease;}
@keyframes ufPop{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}
.uf-box{background:#fff8ed;width:100%;max-width:400px;border-radius:16px;border:2px solid #c9920a;overflow:hidden;}
.uf-hd{background:linear-gradient(135deg,#1a1500,#3d3000);padding:14px 18px;text-align:center;}
.uf-title{font-family:'Bebas Neue',sans-serif;font-size:1.6rem;letter-spacing:4px;color:#8a6307;}
.uf-sub{font-size:.68rem;color:rgba(255,213,79,.6);margin-top:2px;}
.uf-score{font-family:'Bebas Neue',sans-serif;font-size:3.5rem;color:#3a2f1f;text-align:center;padding:16px 0 8px;line-height:1;}
.uf-teams{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 16px 14px;}
.uf-team{background:#fffaf0;border-radius:8px;padding:8px 10px;text-align:center;border:1px solid #e3d3ac;}
.uf-team-lbl{font-size:.68rem;font-weight:700;margin-bottom:2px;}
.uf-question{font-size:.78rem;color:#7d6849;text-align:center;padding:0 16px 12px;line-height:1.5;}
.uf-actions{display:flex;flex-direction:column;gap:8px;padding:0 16px 16px;}
.uf-btn-confirm{padding:14px;border-radius:10px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;background:linear-gradient(135deg,#3a1a1a,#c62828);border:1px solid #c62828;color:#3a2f1f;touch-action:manipulation;}
.uf-btn-penalty{padding:14px;border-radius:10px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;background:linear-gradient(135deg,#1a3a1a,#28a745);border:1px solid #28a745;color:#3a2f1f;touch-action:manipulation;}
.add-temp-overlay{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:550;display:none;align-items:flex-end;justify-content:center;}
.add-temp-overlay.show{display:flex;}
.add-temp-box{background:#fff8ed;width:100%;max-width:480px;border-radius:16px 16px 0 0;border:1px solid #d3bd8c;border-bottom:none;max-height:72vh;max-height:72dvh;display:flex;flex-direction:column;padding-bottom:max(8px,env(safe-area-inset-bottom));}
.add-temp-hd{padding:12px 16px;border-bottom:1px solid #e3d3ac;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
.add-temp-body{overflow-y:auto;padding:10px 12px;}
.round-detail-overlay{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:450;display:none;align-items:center;justify-content:center;padding:16px;}
.round-detail-overlay.show{display:flex;}
.round-detail-box{background:#fff8ed;width:100%;max-width:480px;border-radius:16px;border:1px solid #7c4dff;overflow:hidden;max-height:88vh;max-height:88dvh;display:flex;flex-direction:column;}
.rd-hd{background:linear-gradient(135deg,#1a0050,#3d006a);padding:14px 18px;display:flex;align-items:center;justify-content:space-between;}
.rd-hd-left{flex:1;}
.rd-title{font-family:'Bebas Neue',sans-serif;font-size:1.3rem;letter-spacing:3px;color:#3a2f1f;}
.rd-sub{font-size:.65rem;color:rgba(255,255,255,.45);margin-top:1px;}
.rd-close{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);color:#3a2f1f;width:30px;height:30px;border-radius:8px;cursor:pointer;font-size:.9rem;display:flex;align-items:center;justify-content:center;touch-action:manipulation;}
.rd-score-row{display:flex;align-items:center;justify-content:center;gap:12px;padding:16px 20px;background:#fffaf0;border-bottom:1px solid #e3d3ac;}
.rd-team{text-align:center;flex:1;}
.rd-team-lbl{font-size:.6rem;text-transform:uppercase;letter-spacing:1px;color:#7d6849;margin-bottom:4px;}
.rd-team-score{font-family:'Bebas Neue',sans-serif;font-size:3rem;line-height:1;}
.rd-vs{font-family:'Bebas Neue',sans-serif;font-size:1rem;color:#dcc89a;}
.rd-body{overflow-y:auto;padding:14px 18px;display:flex;flex-direction:column;gap:12px;}
.rd-section{font-size:.6rem;text-transform:uppercase;letter-spacing:1px;color:#6b5840;margin-bottom:5px;}
.rd-players{display:flex;gap:8px;}
.rd-pl-col{flex:1;background:#fffaf0;border-radius:8px;padding:8px 10px;border:1px solid #e3d3ac;}
.rd-pl-col-hd{font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin-bottom:5px;}
.rd-pl-name{font-size:.78rem;color:#7d6849;padding:2px 0;display:flex;align-items:center;gap:5px;}
.rd-goal-row{display:flex;align-items:center;gap:7px;padding:5px 0;border-bottom:1px solid #f5e9d4;font-size:.8rem;}
.rd-goal-row:last-child{border-bottom:none;}
.rd-goal-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.rd-goal-name{flex:1;font-weight:700;}
.rd-goal-min{font-family:'Bebas Neue',sans-serif;font-size:.75rem;color:#7d6849;}
.rd-meta-row{display:flex;gap:8px;}
.rd-meta-chip{flex:1;background:#fffaf0;border:1px solid #e3d3ac;border-radius:8px;padding:8px 10px;text-align:center;}
.rd-meta-val{font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:#8e3a9e;}
.rd-meta-lbl{font-size:.58rem;color:#6b5840;text-transform:uppercase;letter-spacing:.5px;margin-top:2px;}
.tur-item{border-bottom:1px solid #f5e9d4;}
.tur-item:last-child{border-bottom:none;}
.tur-row{display:flex;align-items:center;gap:7px;padding:9px 14px;font-size:.76rem;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation;transition:background .1s;}
.tur-row:active{background:#f1e4c8;}
.tur-num{font-family:'Bebas Neue',sans-serif;font-size:.78rem;color:#6b5840;min-width:34px;}
.tur-teams{display:flex;align-items:center;gap:4px;flex:1;}
.tur-score{font-family:'Bebas Neue',sans-serif;font-size:1rem;min-width:28px;text-align:center;}
.tur-meta{font-size:.6rem;color:#6b5840;white-space:nowrap;}
.tur-reason{font-size:.58rem;padding:1px 5px;border-radius:4px;margin-left:3px;}
.tur-reason.goals{background:rgba(40,167,69,.1);border:1px solid rgba(40,167,69,.3);color:#1b7a43;}
.tur-reason.time{background:rgba(124,77,255,.1);border:1px solid #7c4dff;color:#8e3a9e;}
.tur-reason.manual{background:rgba(255,204,0,.08);border:1px solid rgba(255,204,0,.3);color:#8a6800;}
.tur-reason.final{background:rgba(100,100,100,.1);border:1px solid #7d6849;color:#7d6849;}
.tur-reason.penalty{background:rgba(198,40,40,.1);border:1px solid #c62828;color:#b71c1c;}
.tur-sub{padding:0 14px 9px 14px;margin-top:-4px;font-size:.64rem;color:#7d6849;display:flex;align-items:center;gap:4px;}
.tur-sub b{font-weight:700;}

/* ── Penalty Shootout ─────────────────────────────────────────── */
.penalty-overlay{position:fixed;inset:0;background:#f3e6cf;z-index:400;display:none;flex-direction:column;}
.penalty-overlay.show{display:flex;}
.penalty-box{display:flex;flex-direction:column;width:100%;height:100dvh;overflow:hidden;background:#f3e6cf;}
.penalty-hd{background:linear-gradient(135deg,#7b1010,#c62828);padding:12px 16px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
.penalty-hd-title{font-family:'Bebas Neue',sans-serif;font-size:1.3rem;letter-spacing:3px;color:#3a2f1f;}
.penalty-hd-sub{font-size:.62rem;color:rgba(255,255,255,.6);margin-top:1px;}
.penalty-score-row{display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 16px;background:#fffaf0;border-bottom:1px solid #e3d3ac;flex-shrink:0;}
.pen-team-score{text-align:center;flex:1;}
.pen-team-lbl{font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;}
.pen-score-num{font-family:'Bebas Neue',sans-serif;font-size:2.4rem;line-height:1;transition:all .15s;}
.pen-dots{display:flex;gap:4px;justify-content:center;margin-top:3px;min-height:14px;}
.pen-dot{width:12px;height:12px;border-radius:50%;border:2px solid;flex-shrink:0;}
.pen-dot.goal{background:#28a745;border-color:#1b7a35;box-shadow:0 0 6px #28a745;}
.pen-dot.miss{background:transparent;border-color:#c62828;}
.pen-dot.pending{background:#dcc89a;border-color:#6b5840;}
.pen-vs{font-family:'Bebas Neue',sans-serif;font-size:1rem;color:#dcc89a;}
.penalty-current{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;min-height:0;}
.penalty-kicker-label{font-size:.6rem;color:#7d6849;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:14px;}
.penalty-kicker-name{font-family:'Bebas Neue',sans-serif;font-size:3rem;letter-spacing:3px;color:#3a2f1f;margin-bottom:8px;line-height:1.1;}
.penalty-kicker-team{font-size:.78rem;font-weight:700;padding:4px 14px;border-radius:20px;display:inline-block;}
.penalty-btns{display:flex;gap:10px;padding:12px 16px;padding-bottom:max(12px,env(safe-area-inset-bottom));flex-shrink:0;}
.penalty-btn-goal{flex:1;padding:24px 10px;border-radius:14px;font-family:'Bebas Neue',sans-serif;font-size:1.6rem;letter-spacing:3px;cursor:pointer;background:linear-gradient(135deg,#1a3a1a,#28a745);border:2px solid #28a745;color:#3a2f1f;touch-action:manipulation;}
.penalty-btn-miss{flex:1;padding:24px 10px;border-radius:14px;font-family:'Bebas Neue',sans-serif;font-size:1.6rem;letter-spacing:3px;cursor:pointer;background:linear-gradient(135deg,#3a1a1a,#c62828);border:2px solid #c62828;color:#3a2f1f;touch-action:manipulation;}
.penalty-btn-goal:active,.penalty-btn-miss:active{opacity:.8;}
.penalty-kicker-list{padding:0 16px 8px;flex-shrink:0;max-height:140px;overflow-y:auto;}
.pen-list-section{font-size:.58rem;color:#7d6849;text-transform:uppercase;letter-spacing:1px;padding:4px 0 3px;}
.pen-list-row{display:flex;align-items:center;gap:8px;padding:4px 0;}
.pen-list-name{flex:1;font-size:.82rem;font-weight:700;}
.pen-list-result{font-size:.82rem;}
.pen-select-area{padding:0 20px 20px;}
.pen-select-title{font-size:.68rem;color:#7d6849;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;}
.pen-player-chip{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:7px;border:1px solid var(--border);background:#fffaf0;cursor:pointer;margin:3px;font-size:.78rem;font-weight:700;color:#7d6849;transition:all .1s;}
.pen-player-chip.sel-o{border-color:var(--o);background:rgba(255,140,0,.1);color:var(--o);}
.pen-player-chip.sel-g{border-color:var(--g);background:rgba(40,167,69,.1);color:var(--g);}
.pen-start-btn{width:100%;padding:12px;border-radius:10px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;background:linear-gradient(135deg,#7b1010,#c62828);border:1px solid #c62828;color:#fff;margin-top:8px;}
.pen-result-banner{text-align:center;padding:20px;font-family:'Bebas Neue',sans-serif;font-size:1.5rem;letter-spacing:3px;}

/* ── Telefoane mici (≤360px lățime) — fonturi mari Bebas Neue puțin mai mici ── */
@media(max-width:360px){
    .sc-n{font-size:4rem;}
    .sc-sep{font-size:1.6rem;}
    .penalty-kicker-name{font-size:2.3rem;}
    .uf-score{font-size:2.7rem;}
    .rd-team-score{font-size:2.4rem;}
    .pen-score-num{font-size:1.9rem;}
    .dialog-score{font-size:1.8rem;}
}

/* ── Landscape / înălțime mică (telefon culcat, tabletă mică) ──
   Header-ul + timer-bar + score-wrap + bottom-bar fixe lasă puțin loc
   pe verticală pentru lista de jucători — le comprimăm puțin. */
@media(orientation:landscape) and (max-height:500px){
    .timer-bar{padding:5px 14px;}
    .timer-btn{padding:6px 14px;font-size:.85rem;min-height:36px;}
    .timer-display{font-size:1.2rem;}
    .score-wrap{padding:6px 12px 2px;}
    .sc-n{font-size:2.6rem;}
    .sc-sep{font-size:1.3rem;}
    .score-sub{padding:1px 0 3px;min-height:14px;}
    .pr{min-height:38px;}
    main, body{padding-bottom:64px;}
    .bottom-bar{padding:5px 12px;}
    .btn-finalize{padding:9px;min-height:38px;}
}
</style>
</head>
<body>

<div class="hd">
  <div class="hd-logo">⚽ Arena FC</div>
  <div class="hd-right">
    <div class="live-pill"><span class="live-dot"></span><span class="live-lbl">Live</span></div>
    <div class="conn-pill ok" id="connPill" title="Stare conexiune"><span class="conn-dot"></span><span id="connLbl">Online</span></div>
    <span class="admin-badge" id="adminBadge" onclick="openCodeAuth()">—</span>
    <button class="hd-key-btn" onclick="openCodeAuth()" title="Autentificare">🔑</button>
    <button class="hd-key-btn" id="swapTeamsBtn" onclick="swapTeams()" title="Schimbă echipele între ele" style="display:none;">⇄</button>
    <button class="icon-btn" id="threeBtn" onclick="toggleThreeTeam()" style="background:rgba(124,77,255,.15);border-color:#5a2fd9;color:#8e3a9e;font-size:.7rem;padding:5px 8px;font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:.5px;border-radius:7px;">3️⃣</button>
    <button class="icon-btn danger" onclick="confirmReset()">↺</button>
  </div>
</div>

<div class="timer-bar">
  <button class="timer-btn start" id="timerBtn" onclick="timerToggle()">▶ Start</button>
  <div class="timer-display" id="timerDisplay">00:00</div>
  <div class="half-badge" id="halfBadge"></div>
  <div id="roundTimerWidget" style="display:none;align-items:center;gap:5px;flex-shrink:0;margin-left:auto;">
    <div style="width:1px;height:18px;background:#e3d3ac;margin:0 2px;"></div>
    <button id="penBtn" onclick="openPenalty()" style="padding:5px 9px;border-radius:6px;font-size:.65rem;font-weight:700;cursor:pointer;background:rgba(198,40,40,.2);border:1px solid #c62828;color:#b71c1c;touch-action:manipulation;white-space:nowrap;min-height:34px;">⚽ Pen</button>
  </div>
</div>

<div class="score-wrap">
  <div class="score-row">
    <div class="sc-side"><div class="sc-lbl" id="lblO">Portocaliu</div><div class="sc-n" id="scoreO" style="color:var(--o)">0</div></div>
    <div class="sc-sep">
      <div>:</div>
      <div id="roundTimeLbl" style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:#8e3a9e;letter-spacing:2px;text-align:center;margin-top:2px;display:none;line-height:1;"></div>
    </div>
    <div class="sc-side right"><div class="sc-lbl" id="lblG">Verde</div><div class="sc-n" id="scoreG" style="color:var(--g)">0</div></div>
  </div>
  <div class="score-sub" id="scoreSub"></div>
</div>

<div class="three-mode-bar" id="threeBar">
  <!-- Waiting team row -->
  <div class="waiting-team">
    <div class="waiting-hd">
      <span class="waiting-lbl" id="waitingLbl">⏳ Echipa în Așteptare</span>
      <div style="display:flex;gap:5px;align-items:center;">
        <button class="swap-btn swap-o" onclick="manualSwap('orange')" id="swapBtnO">↔ O</button>
        <button class="swap-btn swap-g" onclick="manualSwap('green')" id="swapBtnG">↔ G</button>
      </div>
    </div>
    <div id="waitingPlayers" style="display:flex;flex-wrap:wrap;gap:4px;font-size:.75rem;align-items:center;padding-top:4px;"></div>
  </div>
</div>

<div class="teams-wrap" id="teamsWrap"><div class="empty-teams">Se încarcă...</div></div>

<!-- Transfer button — vizibil mereu pentru admin, indiferent de mod (2 sau 3 echipe) -->
<div id="transferBtnWrap" style="display:none;padding:8px 12px 4px;">
  <button onclick="openTransfer()" style="width:100%;padding:12px;border-radius:9px;background:#fffaf0;border:1px dashed #d3bd8c;color:#7d6849;font-size:.8rem;font-weight:700;cursor:pointer;touch-action:manipulation;display:flex;align-items:center;justify-content:center;gap:6px;min-height:44px;">
    ⇄ Transfer jucător între echipe
  </button>
</div>

<!-- Settings: doar în 3-team mode, sub butonul de transfer -->
<div id="belowTeamsBar" style="display:none;border-top:1px solid var(--b);">
  <div style="display:flex;align-items:center;gap:0;background:#f7ecd9;">
    <div style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:8px 12px;border-right:1px solid var(--b);">
      <span style="font-size:.6rem;color:#7d6849;white-space:nowrap;">🎯 Schimb</span>
      <button class="thr-btn" onclick="changeThreshold(-1)">−</button>
      <span class="thr-val" id="thrVal" style="font-family:'Bebas Neue',sans-serif;font-size:1.2rem;color:var(--star);min-width:22px;text-align:center;">2</span>
      <button class="thr-btn" onclick="changeThreshold(1)">+</button>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:8px 12px;">
      <span style="font-size:.6rem;color:#7d6849;white-space:nowrap;">⏱ Max min</span>
      <button class="thr-btn" onclick="changeTimeLimitMin(-1)">−</button>
      <span class="thr-val" id="timeLimitVal" style="font-family:'Bebas Neue',sans-serif;font-size:1.2rem;color:#1554b3;min-width:26px;text-align:center;">10</span>
      <button class="thr-btn" onclick="changeTimeLimitMin(1)">+</button>
    </div>
  </div>
</div>

<div class="ture-section" id="tureSection">
  <div class="ture-toggle" onclick="toggleTure()">
    <span class="ture-toggle-lbl">📊 Istoric Ture <span class="ture-cnt" id="tureCnt">0</span></span>
    <span style="font-size:.7rem;color:#7d6849;" id="tureChevron">▲</span>
  </div>
  <div class="ture-body" id="tureBody"></div>
</div>

<div class="log-toggle" onclick="toggleLog()">
  <span class="log-toggle-lbl">📋 Log goluri <span class="log-toggle-cnt" id="logCnt">0</span></span>
  <span style="font-size:.7rem;color:#7d6849;" id="logChevron">▲</span>
</div>
<div class="log-panel" id="logPanel">
  <div class="log-empty" id="logEmpty">Niciun gol înregistrat.</div>
</div>

<div class="bottom-bar">
  <button class="btn-finalize" id="btnFinalize" onclick="openFinalize()" disabled>🏁 Finalizează Meciul</button>
</div>

<div class="dialog-overlay" id="dialogOverlay">
  <div class="dialog-box" id="dialogBox"></div>
</div>
<div class="toast" id="toast"></div>

<button class="universal-undo-btn" id="universalUndoBtn" onclick="universalUndo()">
  <span class="uu-main">↩ Anulează ultima acțiune</span>
  <span class="uu-sub" id="universalUndoSub"></span>
</button>

<script>
const SB_URL = 'https://lfnumwbjikiyngdxsgrk.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbnVtd2JqaWtpeW5nZHhzZ3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDQ1MzEsImV4cCI6MjA5MDA4MDUzMX0.BrrmEHnOwa66hDqN-GhYCyqHqOqTAV7dswjcOVxx-wc';
const sb = window.supabase.createClient(SB_URL, SB_KEY);

// ── Admin auth via secret code ────────────────────────────────────
let isLiveAdmin = false; // true = authenticated player (has secret code)
let _allPlayerCodes = []; // loaded on init: [{name, secret_code, role}]

async function loadPlayerCodes() {
    const { data } = await sb.from('players').select('id,name,secret_code,role').order('name');
    _allPlayerCodes = data || [];
}

function verifyAdminCode(code) {
    if (!code) return null;
    const c = code.trim().toUpperCase();
    return _allPlayerCodes.find(p => p.secret_code && p.secret_code.toUpperCase() === c) || null;
}

function openCodeAuth() {
    document.getElementById('codeAuthOverlay').classList.add('show');
    setTimeout(() => document.getElementById('codeAuthInput').focus(), 100);
}

function closeCodeAuth() {
    document.getElementById('codeAuthOverlay').classList.remove('show');
}

async function submitCode() {
    const code = document.getElementById('codeAuthInput').value.trim();
    const player = verifyAdminCode(code);
    if (!player) {
        document.getElementById('codeAuthErr').textContent = 'Cod incorect';
        return;
    }
    isLiveAdmin = true; // orice player autentificat cu cod propriu
    localStorage.setItem('liveAuthCode', code);
    localStorage.setItem('liveAuthName', player.name);
    closeCodeAuth();
    document.getElementById('adminBadge').textContent = player.name;
    document.getElementById('adminBadge').style.display = 'inline-block';
    showToast(`👋 ${player.name} autentificat!`);
    render();
}

function tryAutoAuth() {
    const saved = localStorage.getItem('liveAuthCode');
    if (!saved) return;
    const player = verifyAdminCode(saved);
    if (player) {
        isLiveAdmin = true;
        document.getElementById('adminBadge').textContent = player.name;
        document.getElementById('adminBadge').style.display = 'inline-block';
        render();
    }
}

// ── Local state (derived from DB, never source of truth) ──────────
let players    = [];
let goals      = [];
let rounds     = [];   // live_rounds rows
let lastAction = null; // { type:'goal'|'rotation', label:string, undo:asyncFn } — pentru butonul universal ↩
let liveState  = null; // live_state row
let isSaving   = false;

// Local timer tick interval
let timerInterval    = null;
let roundTimerTO     = null;  // setTimeout for round timeout
let roundTimerIV     = null;  // setInterval for round bar update

// ── Helpers ───────────────────────────────────────────────────────
function tidBadge(tid) { return ''; } // ID-urile echipelor sunt invizibile, se folosesc doar intern

function fmtTimer(s) {
    const m = Math.floor(s / 60), ss = s % 60;
    return String(m).padStart(2,'0') + ':' + String(ss).padStart(2,'0');
}

// Calculate elapsed seconds from live_state
function calcElapsedSec(st) {
    if (!st) return 0;
    let ms = parseInt(st.timer_elapsed_ms) || 0;
    if (st.timer_status === 'running' && st.timer_started_at) {
        ms += Date.now() - new Date(st.timer_started_at).getTime();
    }
    return Math.floor(ms / 1000);
}

function calcRoundElapsedSec(st) {
    if (!st) return 0;
    const totalSec = calcElapsedSec(st);
    return Math.max(0, totalSec - (st.round_start_sec || 0));
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}
// ── Feedback sonor (pe lângă vibrație) — util pe teren, unde vibrația
// singură nu se simte/aude mereu. Nu necesită fișiere audio externe.
let _audioCtx = null;
function playBeep(freq=880, durMs=120, vol=0.16) {
    try {
        if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (_audioCtx.state === 'suspended') _audioCtx.resume();
        const osc = _audioCtx.createOscillator();
        const gain = _audioCtx.createGain();
        osc.type = 'sine'; osc.frequency.value = freq;
        gain.gain.value = vol;
        osc.connect(gain); gain.connect(_audioCtx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, _audioCtx.currentTime + durMs/1000);
        osc.stop(_audioCtx.currentTime + durMs/1000 + 0.02);
    } catch(e) {}
}
function playGoalSound(){ playBeep(920, 110); }
function playRoundEndSound(){ playBeep(660,140); setTimeout(()=>playBeep(420,180), 150); }

// ── Rezultat gata de trimis pe WhatsApp ─────────────────────────────
let _resultShareText = '';
function showResultShare(title, previewText, shareText) {
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultPreview').textContent = previewText;
    _resultShareText = shareText;
    document.getElementById('resultOverlay').classList.add('show');
}
async function copyResultShareText() {
    try {
        await navigator.clipboard.writeText(_resultShareText);
        showToast('📋 Copiat! Lipește-l în WhatsApp.');
        return;
    } catch(e) {}
    // Fallback pentru browsere fără Clipboard API disponibil
    try {
        const ta = document.createElement('textarea');
        ta.value = _resultShareText;
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('📋 Copiat! Lipește-l în WhatsApp.');
    } catch(e2) {
        showToast('⚠️ Nu am putut copia automat — selectează textul manual.');
    }
}

// ── Indicator de conexiune ──────────────────────────────────────────
// Pe teren, în aer liber, netul poate cădea fără avertisment — iar o
// salvare eșuată silențios înseamnă un gol/o tură pierdută din istoric.
function updateConnPill(state, label) {
    const pill = document.getElementById('connPill');
    const lbl  = document.getElementById('connLbl');
    if (!pill || !lbl) return;
    pill.className = 'conn-pill ' + state;
    lbl.textContent = label;
}
window.addEventListener('online',  () => updateConnPill('ok', 'Online'));
window.addEventListener('offline', () => updateConnPill('off', 'Fără conexiune'));
if (!navigator.onLine) updateConnPill('off', 'Fără conexiune');

// Reîncearcă un apel Supabase de câteva ori înainte să renunțe — și
// ține indicatorul de conexiune sincronizat cu ce se întâmplă real.
async function withRetry(fn, { retries = 3, label = 'salvare' } = {}) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const result = await fn();
            updateConnPill('ok', 'Online');
            return result;
        } catch (e) {
            if (attempt === retries) {
                updateConnPill('off', 'Salvare eșuată');
                showToast(`⚠️ Nu s-a putut salva (${label}) — verifică conexiunea!`);
                throw e;
            }
            updateConnPill('warn', `Reîncerc ${attempt}/${retries - 1}...`);
            await new Promise(r => setTimeout(r, 700 * attempt));
        }
    }
}
function showRotationToast(msg) {
    const el = document.getElementById('rotationToast');
    if (!el) return;
    el.textContent = msg; el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
}
function bump(team) {
    const el = document.getElementById(team === 'orange' ? 'scoreO' : 'scoreG');
    el.classList.add('bump'); setTimeout(() => el.classList.remove('bump'), 200);
}
function goalsMap() {
    // In 3-team mode: count goals across ALL rounds + current round
    // In 2-team mode: live_goals is never cleared, so goals = all match goals
    const src = liveState?.three_team_mode ? allMatchGoals() : goals;
    const m = {};
    src.forEach(g => { m[g.player_name] = (m[g.player_name]||0)+1; });
    return m;
}

// ── live_state helpers ────────────────────────────────────────────
function getThreeTeamMode() { return liveState?.three_team_mode || false; }
function getGoalThreshold() { return liveState?.goal_threshold || 2; }
function getTimeLimitMin()  { return liveState?.time_limit_min || 10; }
function getColorMap()      { return liveState?.color_map || {}; }

// ── IDENTITATE FIXĂ — 3 echipe standard, NEEDITABILE, pentru totdeauna ──
// teamA = PORTOCALIU, teamB = VERDE, teamC = NEGRU. Indiferent unde rotează.
const FIXED_TEAMS = {
    teamA: { hex: '#9c4f00', name: 'Portocaliu' },
    teamB: { hex: '#1b7a35', name: 'Verde' },
    teamC: { hex: '#111111', name: 'Negru' },
};
const TEAM_COLORS = ['#9c4f00', '#1b7a35', '#111111'];

// Toate cele 3 culori standard sunt suficient de întunecate — text alb mereu
function getContrastColor(hex) { return '#ffffff'; }

// teamId (teamA/B/C) → identitate FIXĂ, indiferent de slot/rotație
function getTeamConfig(teamId) { return FIXED_TEAMS[teamId] || FIXED_TEAMS.teamA; }
function getTeamNameById(teamId) { return getTeamConfig(teamId).name; }
function getTeamHexById(teamId)  { return getTeamConfig(teamId).hex; }

// slot ('orange'/'green'/'bench') → găsește CARE identitate e acolo ACUM via color_map
function getTeamIdForSlot(slot) {
    const cm = getColorMap();
    if (cm[slot]) return cm[slot];
    // Fallback (mod 2 echipe, fără color_map populat încă): mapping implicit
    return slot === 'orange' ? 'teamA' : slot === 'green' ? 'teamB' : 'teamC';
}
function getTeamName(slot) { return getTeamNameById(getTeamIdForSlot(slot)); }
function getTeamHex(slot)  { return getTeamHexById(getTeamIdForSlot(slot)); }
function getTeamIdByColor(slot) { return getTeamIdForSlot(slot); }

function applyTeamColors() {
    document.documentElement.style.setProperty('--o', getTeamHex('orange'));
    document.documentElement.style.setProperty('--g', getTeamHex('green'));
}

async function patchState(patch) {
    // Apply locally immediately — no waiting for Realtime roundtrip
    liveState = { ...liveState, ...patch };
    const { error } = await sb.from('live_state').update(patch).eq('id', 1);
    if (error) console.error('patchState:', error.message);
}

// ── Timer ─────────────────────────────────────────────────────────
function startLocalTimerTick() {
    stopLocalTimerTick();
    timerInterval = setInterval(() => {
        if (!liveState) return;
        const s = calcElapsedSec(liveState);
        document.getElementById('timerDisplay').textContent = fmtTimer(s);
        const min = Math.floor(s / 60);
        document.getElementById('halfBadge').textContent = min >= 1 ? min+"'" : '';
        updateRoundTimerBar();
    }, 500);
}
function stopLocalTimerTick() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

async function timerToggle() {
    if (!liveState) return;
    const st = liveState.timer_status;
    if (st === 'idle' || st === 'paused') {
        // Start / resume
        const patch = {
            timer_status: 'running',
            timer_started_at: new Date().toISOString(),
        };
        if (!liveState.match_started_at) { patch.match_started_at = new Date().toISOString(); }
        // If 3-team and round not started yet, set round_start_sec
        if (getThreeTeamMode() && !liveState.round_start_sec) {
            patch.round_start_sec = calcElapsedSec(liveState);
        }
        await patchState(patch);
        updateMatchUrl(liveState);
        applyTimerUI(liveState); // immediate local update
    } else {
        // Pause
        const elapsed = (liveState.timer_elapsed_ms || 0) +
            (Date.now() - new Date(liveState.timer_started_at).getTime());
        await patchState({
            timer_status: 'paused',
            timer_elapsed_ms: elapsed,
            timer_started_at: null,
        });
    }
}

function applyTimerUI(st) {
    const btn  = document.getElementById('timerBtn');
    const disp = document.getElementById('timerDisplay');
    if (!st) return;
    const s   = calcElapsedSec(st);
    disp.textContent = fmtTimer(s);
    document.getElementById('halfBadge').textContent = Math.floor(s/60) >= 1 ? Math.floor(s/60)+"'" : '';

    if (st.timer_status === 'running') {
        btn.textContent = '⏸ Pauză'; btn.className = 'timer-btn pause';
        disp.className = 'timer-display running';
        startLocalTimerTick();
        scheduleRoundTimeout(st);
    } else if (st.timer_status === 'paused') {
        btn.textContent = '▶ Continuă'; btn.className = 'timer-btn resume';
        disp.className = 'timer-display paused';
        stopLocalTimerTick();
        cancelRoundTimeout();
    } else {
        btn.textContent = '▶ Start Meci'; btn.className = 'timer-btn start';
        disp.className = 'timer-display';
        stopLocalTimerTick();
        cancelRoundTimeout();
    }
}

// ── Round timeout scheduling ──────────────────────────────────────
function scheduleRoundTimeout(st) {
    cancelRoundTimeout();
    if (!st.three_team_mode || st.timer_status !== 'running') return;
    if (!players.filter(p => p.status === 'bench').length) return;

    const timeLimitMs = (st.time_limit_min || 10) * 60 * 1000;
    const roundElapsedMs = calcRoundElapsedSec(st) * 1000;
    const remaining = Math.max(0, timeLimitMs - roundElapsedMs);

    if (remaining <= 0) { onRoundTimeout(); return; }
    roundTimerTO = setTimeout(() => onRoundTimeout(), remaining);
    roundTimerIV = setInterval(() => updateRoundTimerBar(), 500);
}
function cancelRoundTimeout() {
    if (roundTimerTO) { clearTimeout(roundTimerTO); roundTimerTO = null; }
    if (roundTimerIV) { clearInterval(roundTimerIV); roundTimerIV = null; }
}

function updateRoundTimerBar() {
    const widget = document.getElementById('roundTimerWidget');
    if (!widget) return;
    const in3team = !!liveState?.three_team_mode;
    widget.style.display = in3team ? 'flex' : 'none';
    const lbl = document.getElementById('roundTimeLbl');
    if (!lbl) return;
    if (!in3team || liveState?.timer_status !== 'running' || !liveState?.time_limit_min) {
        lbl.style.display = 'none'; return;
    }
    const totalSec  = (liveState.time_limit_min || 10) * 60;
    const elapsed   = calcRoundElapsedSec(liveState);
    const remaining = Math.max(0, totalSec - elapsed);
    const pct       = Math.min(1, elapsed / totalSec);
    const m = Math.floor(remaining/60), s = remaining%60;
    lbl.textContent = m+':'+(s<10?'0':'')+s;
    lbl.style.color = pct > 0.8 ? '#b71c1c' : pct > 0.6 ? '#c9920a' : '#8e3a9e';
    lbl.style.display = 'block';
}

async function onRoundTimeout() {
    cancelRoundTimeout();
    if (!liveState?.three_team_mode) return;
    const bench = players.filter(p => p.status === 'bench');
    if (!bench.length) return;
    if (navigator.vibrate) navigator.vibrate([300,100,300]);
    playRoundEndSound();
    showUltimaFaza();
}

function showUltimaFaza() {
    const oHex = getTeamHex('orange'), gHex = getTeamHex('green');
    const oName = getTeamName('orange'), gName = getTeamName('green');
    const roundG = getRoundGoals();
    const oG = roundG.filter(g => g.team === 'orange').length;
    const gG = roundG.filter(g => g.team === 'green').length;

    document.getElementById('ufScore').textContent = `${oG} : ${gG}`;

    const btnO = document.getElementById('ufBtnTeamO');
    const btnG = document.getElementById('ufBtnTeamG');
    const btnP = document.getElementById('ufBtnPenalty');
    const btnConfirm = document.getElementById('ufBtnConfirm');

    btnO.textContent = '⚽ Gol ' + oName;
    btnO.style.borderColor = oHex;
    btnO.style.color = oHex;
    btnO.style.background = oHex + '15';
    btnO.onclick = () => { ufPickScorer('orange'); };

    btnG.textContent = '⚽ Gol ' + gName;
    btnG.style.borderColor = gHex;
    btnG.style.color = gHex;
    btnG.style.background = gHex + '15';
    btnG.onclick = () => { ufPickScorer('green'); };

    // Determine loser for confirm button
    const loser = oG > gG ? 'green' : oG < gG ? 'orange' : null;
    const btnConfirmWrap = document.getElementById('ufBtnConfirmWrap');
    if (loser && btnConfirmWrap) {
        const lName = getTeamName(loser);
        const lHex  = getTeamHex(loser);
        btnConfirm.textContent = '✕ ' + lName + ' iese';
        btnConfirm.style.borderColor = lHex;
        btnConfirmWrap.style.display = 'block';
        btnConfirm.onclick = () => { closeUltimaFaza(); doRotation(loser, 'time'); };
    } else if (btnConfirmWrap) {
        btnConfirmWrap.style.display = 'none';
    }

    btnP.onclick = () => { closeUltimaFaza(); setTimeout(() => openPenaltyModal(), 300); };

    document.getElementById('ufOverlay').classList.add('show');
}

// ── ULTIMA FAZĂ: selectează jucătorul marcator, apoi auto-rotație ──
function ufPickScorer(team) {
    const hex = getTeamHex(team);
    const tName = getTeamName(team);
    const teamPlayers = players.filter(p => p.status === team);

    if (!teamPlayers.length) { showToast('⚠️ Nicio echipă cu jucători!'); return; }

    const list = teamPlayers.map(p => `
        <div onclick="ufConfirmScorerAndRotate('${p.name.replace(/'/g,"\\'")}','${team}')"
            style="display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:9px;border:1px solid #e3d3ac;background:#fffaf0;cursor:pointer;touch-action:manipulation;margin-bottom:6px;-webkit-tap-highlight-color:transparent;">
            <div style="width:30px;height:30px;border-radius:50%;background:${hex}22;border:1px solid ${hex}44;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:.9rem;color:${hex};flex-shrink:0;">${p.name[0]}</div>
            <div style="flex:1;font-weight:700;font-size:.88rem;color:#3a2f1f;">${p.name}</div>
            <span style="color:#7d6849;">›</span>
        </div>`).join('');

    document.getElementById('ufScorerTitle').textContent = 'Cine a marcat? — ' + tName;
    document.getElementById('ufScorerTitle').style.color = hex;
    document.getElementById('ufScorerList').innerHTML = list;
    document.getElementById('ufScorerOverlay').classList.add('show');
}

function closeUfScorerPicker() {
    document.getElementById('ufScorerOverlay').classList.remove('show');
}

async function ufConfirmScorerAndRotate(name, team) {
    closeUfScorerPicker();
    closeUltimaFaza();
    // Record the goal directly (this IS the confirmation — no need for double confirm)
    await addGoal(name, team);
    // After goal recorded, compute new score and auto-rotate (echipa de pe bancă intră)
    const roundG = getRoundGoals();
    const oG = roundG.filter(g => g.team === 'orange').length;
    const gG = roundG.filter(g => g.team === 'green').length;
    if (oG === gG) {
        // Egalare exactă → penalty
        showRotationToast('⚽ Egalare în ultima fază — PENALTYURI!');
        setTimeout(() => openPenaltyModal(), 800);
        return;
    }
    const loser = oG > gG ? 'green' : 'orange';
    setTimeout(() => doRotation(loser, 'time'), 500);
}

function closeUltimaFaza() {
    document.getElementById('ufOverlay').classList.remove('show');
}

// ── Round goals = live_goals (cleared after each rotation) ───────
function getRoundGoals() {
    return goals.filter(g => !String(g.id).startsWith('tmp_'));
}

// ── All match goals = past rounds + current round ─────────────────
function allMatchGoals() {
    const past = rounds.flatMap(r =>
        (Array.isArray(r.goals) ? r.goals : []).map(g => ({ ...g, _roundNum: r.num }))
    );
    return [...past, ...goals.filter(g => !String(g.id).startsWith('tmp_'))];
}

function getRoundConceded() {
    const rg = getRoundGoals();
    return {
        orange: rg.filter(g => g.team === 'green').length,  // green scored = orange conceded
        green:  rg.filter(g => g.team === 'orange').length, // orange scored = green conceded
    };
}

// ── 3-team toggle ─────────────────────────────────────────────────
async function toggleThreeTeam() {
    if (!liveState) return;
    const newMode = !liveState.three_team_mode;
    const btn = document.getElementById('threeBtn');

    if (newMode) {
        const orange = players.filter(p => p.status === 'orange');
        const green  = players.filter(p => p.status === 'green');
        const bench  = players.filter(p => p.status === 'bench');
        if (!orange.length && !green.length) {
            showToast('⚠️ Setează jucătorii pe echipe mai întâi!'); return;
        }
        const colorMap = { orange: 'teamA', green: 'teamB', bench: 'teamC' };
        await patchState({
            three_team_mode: true,
            color_map: colorMap,
            round_start_sec: calcElapsedSec(liveState),
        });
        if (btn) { btn.style.background='rgba(124,77,255,.4)'; btn.style.color='#fff'; }
        scheduleRoundTimeout(liveState);
    } else {
        await patchState({
            three_team_mode: false,
            color_map: {},
            round_start_sec: 0,
        });
        await sb.from('live_rounds').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        rounds = [];
        if (btn) { btn.style.background='rgba(124,77,255,.15)'; btn.style.color='#8e3a9e'; }
        cancelRoundTimeout();
    }
    render();
    applyTimerUI(liveState);
}

async function changeThreshold(d) {
    if (!liveState) return;
    const v = Math.max(1, Math.min(20, (liveState.goal_threshold||2) + d));
    // Update UI immediately — don't wait for Realtime roundtrip
    liveState.goal_threshold = v;
    const el = document.getElementById('thrVal'); if(el) el.textContent = v;
    render(); // refresh round-badge
    await sb.from('live_state').update({ goal_threshold: v }).eq('id',1);
}
async function changeTimeLimitMin(d) {
    if (!liveState) return;
    const v = Math.max(1, Math.min(90, (liveState.time_limit_min||10) + d));
    // Update UI immediately
    liveState.time_limit_min = v;
    const el = document.getElementById('timeLimitVal'); if(el) el.textContent = v;
    await sb.from('live_state').update({ time_limit_min: v }).eq('id',1);
    if (liveState.three_team_mode && liveState.timer_status === 'running') {
        scheduleRoundTimeout(liveState);
    }
}

// ── Goal rotation check ───────────────────────────────────────────
async function checkGoalRotation() {
    if (!liveState?.three_team_mode) return;
    if (!players.filter(p => p.status === 'bench').length) return;
    const threshold = liveState.goal_threshold || 2;
    const conc = getRoundConceded();
    if (conc.orange >= threshold) {
        cancelRoundTimeout();
        if (navigator.vibrate) navigator.vibrate([200,100,200]);
        playRoundEndSound();
        setTimeout(() => showRotationConfirm('orange','goals',`${getTeamName('orange')}: ${conc.orange} goluri primite — schimb!`), 400);
    } else if (conc.green >= threshold) {
        cancelRoundTimeout();
        if (navigator.vibrate) navigator.vibrate([200,100,200]);
        playRoundEndSound();
        setTimeout(() => showRotationConfirm('green','goals',`${getTeamName('green')}: ${conc.green} goluri primite — schimb!`), 400);
    }
}

// ── Save round to DB (call BEFORE swapping) ───────────────────────
// penaltyWinnerId = ID-ul echipei (team_a_id/team_b_id) care a câștigat la
// lovituri de departajare — se completează DOAR când reason === 'penalty'.
async function saveRoundToDB(loserColor, reason, penaltyWinnerId = null, penaltyShots = null) {
    const colorMap = getColorMap();
    const oTid = colorMap['orange'];
    const gTid = colorMap['green'];
    const roundGoals = getRoundGoals();
    const oG = roundGoals.filter(g => g.team === 'orange').length;
    const gG = roundGoals.filter(g => g.team === 'green').length;
    const durationSec = Math.max(0, calcRoundElapsedSec(liveState));
    const num = rounds.length + 1;
    // ID-ul echipei care IESE (merge pe bancă) — salvat explicit, nu dedus din scor
    const loserTeamId = loserColor === 'orange' ? (oTid || 'teamA') : (gTid || 'teamB');

    const roundData = {
        num,
        team_a_id:      oTid || 'teamA',
        team_b_id:      gTid || 'teamB',
        score_a:        oG,
        score_b:        gG,
        orange_players: players.filter(p => p.status === 'orange').map(p => p.name),
        green_players:  players.filter(p => p.status === 'green').map(p => p.name),
        goals:          roundGoals,
        duration_sec:   durationSec,
        end_reason:     reason,
        penalty_winner_id: reason === 'penalty' ? penaltyWinnerId : null,
        loser_team_id:  loserTeamId,
        penalty_shots:  reason === 'penalty' ? (penaltyShots || []) : null,
    };

    let data = null;
    try {
        data = await withRetry(async () => {
            const { data, error } = await sb.from('live_rounds').insert(roundData).select().single();
            if (error) throw error;
            return data;
        }, { label: 'tură ' + num });
    } catch(e) {
        console.error('saveRound:', e.message);
        // Push with temp id so UI updates even if DB tot a eșuat după reîncercări
        rounds.push({ ...roundData, id: 'tmp_' + Date.now() });
        renderTureHistory();
        return rounds[rounds.length-1].id;
    }
    if (data && !rounds.some(r => r.id === data.id)) rounds.push(data);
    renderTureHistory();
    return data ? data.id : (rounds.length ? rounds[rounds.length-1].id : null);
}

// ── Rotation ──────────────────────────────────────────────────────
async function doRotation(loserColor, reason, penaltyWinnerId = null, penaltyShots = null) {
    if (isSaving) return;
    isSaving = true;

    const bench  = players.filter(p => p.status === 'bench');
    const losers = players.filter(p => p.status === loserColor);
    if (!bench.length || !losers.length) { isSaving = false; return; }

    try {
        // 0. Snapshot ÎNAINTE de orice mutație — folosit dacă utilizatorul anulează rotația
        const preSnapshot = {
            players: players.map(p => ({ id: p.id, status: p.status })),
            goals: goals.map(g => ({ ...g })),
            colorMap: { ...getColorMap() },
            roundStartSec: liveState.round_start_sec,
        };

        // 1. Save round FIRST (before any swap)
        const savedRoundId = await saveRoundToDB(loserColor, reason, penaltyWinnerId, penaltyShots);
        preSnapshot.roundId = savedRoundId;

        // *** Clear live_goals so score resets to 0-0 for new round ***
        goals = [];
        await sb.from('live_goals').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        // 2. *** OPTIMISTIC LOCAL UPDATE *** — apply swap to local players immediately
        const loserIds = new Set(losers.map(p => p.id));
        const benchIds = new Set(bench.map(p => p.id));
        players = players.map(p => {
            if (loserIds.has(p.id)) return { ...p, status: 'bench' };
            if (benchIds.has(p.id)) return { ...p, status: loserColor };
            return p;
        });

        // 3. Persist swap to DB
        const swapOps = [
            ...losers.map(p => ({ id: p.id, status: 'bench' })),
            ...bench.map(p  => ({ id: p.id, status: loserColor })),
        ];
        await Promise.all(swapOps.map(({ id, status }) =>
            sb.from('players').update({ status }).eq('id', id)
        ));

        // 4. Update colorMap + round_start_sec — identitatea (PORTOCALIU/VERDE/NEGRU) urmează jucătorii
        const oldColorMap  = { ...getColorMap() };
        const loserTeamId  = oldColorMap[loserColor] || (loserColor === 'orange' ? 'teamA' : 'teamB');
        const benchTeamId  = oldColorMap['bench'] || 'teamC';

        // Capturează numele ÎNAINTE de swap, pentru mesajul corect din toast
        const exitingName  = getTeamNameById(loserTeamId);
        const enteringName = getTeamNameById(benchTeamId);

        const newColorMap  = { ...oldColorMap, [loserColor]: benchTeamId, bench: loserTeamId };
        const newRoundStartSec = calcElapsedSec(liveState);
        await patchState({ color_map: newColorMap, round_start_sec: newRoundStartSec });

        // *** render() DUPĂ patchState — acum liveState.color_map e actualizat ***
        // Echipa care intră apare cu numele și culoarea ei corectă
        render();

        showRotationToast(`${exitingName} IESE · ${enteringName} INTRĂ`);
        scheduleRoundTimeout({ ...liveState, color_map: newColorMap, round_start_sec: newRoundStartSec });

        lastAction = { type:'rotation', label:`Ultima rotație: ${exitingName} → bancă`, undo: () => undoRotation(preSnapshot) };
        updateUniversalUndoBtn();

    } catch(e) {
        console.error('doRotation error:', e);
        showToast('⚠️ Eroare la schimb: ' + e.message);
    } finally {
        isSaving = false;
    }
}

async function manualSwap(loserColor) {
    cancelRoundTimeout();
    await doRotation(loserColor, 'manual');
}

// ── Anulează ultima rotație — reface statusurile jucătorilor, scorul turei anterioare
//    și identitatea echipelor (color_map), și șterge tura salvată în DB ──
async function undoRotation(snap) {
    if (!snap) { showToast('⚠️ Nimic de anulat.'); return; }
    cancelRoundTimeout();
    try {
        // 1. Șterge tura salvată în DB
        if (snap.roundId && !String(snap.roundId).startsWith('tmp_')) {
            await sb.from('live_rounds').delete().eq('id', snap.roundId);
        }
        rounds = rounds.filter(r => r.id !== snap.roundId);

        // 2. Restaurează statusurile jucătorilor (local + DB)
        players = players.map(p => {
            const orig = snap.players.find(x => x.id === p.id);
            return orig ? { ...p, status: orig.status } : p;
        });
        await Promise.all(snap.players.map(({ id, status }) =>
            sb.from('players').update({ status }).eq('id', id)
        ));

        // 3. Restaurează scorul turei anterioare (live_goals)
        await sb.from('live_goals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (snap.goals.length) {
            const rows = snap.goals.map(g => ({
                id: String(g.id).startsWith('tmp_') ? undefined : g.id,
                player_name: g.player_name, team: g.team, minute: g.minute, created_at: g.created_at,
            }));
            await sb.from('live_goals').insert(rows);
        }
        const { data: freshGoals } = await sb.from('live_goals').select('*').order('created_at', { ascending: true });
        goals = freshGoals || [];

        // 4. Restaurează identitatea echipelor + cronometrul turei
        await patchState({ color_map: snap.colorMap, round_start_sec: snap.roundStartSec });

        render();
        renderTureHistory();
        scheduleRoundTimeout(liveState);
        showToast('↩ Rotația a fost anulată');
    } catch(e) {
        console.error('undoRotation error:', e);
        showToast('⚠️ Eroare la anulare — se resincronizează: ' + e.message);
        await loadAll();
    }
}

// ── Load all data ─────────────────────────────────────────────────
async function loadAll() {
    const [{ data: st }, { data: pl }, { data: gl }] = await Promise.all([
        sb.from('live_state').select('*').eq('id', 1).single(),
        sb.from('players').select('id,name,status').order('name'),
        sb.from('live_goals').select('*').order('created_at', { ascending: true }),
    ]);
    liveState = st;
    players   = pl || [];
    goals     = gl || [];
    // Fetch rounds (all current - cleared on each new match start)
    const { data: rd } = await sb.from('live_rounds').select('*').order('num', { ascending: true });
    rounds = rd || [];
    render();
    applyTimerUI(liveState);
    updateUniversalUndoBtn();
}

// ── Render ────────────────────────────────────────────────────────
function render() {
    if (!liveState) return;
    applyTeamColors(); // set --o, --g CSS vars from team configs
    const st   = liveState;
    const mode = st.three_team_mode;
    const orange = players.filter(p => p.status === 'orange');
    const green  = players.filter(p => p.status === 'green');
    const realGoals = goals.filter(g => !String(g.id).startsWith('tmp_'));

    const oTid = mode ? getTeamIdByColor('orange') : null;
    const gTid = mode ? getTeamIdByColor('green')  : null;

    // Score = all current live_goals (cleared after each rotation in 3-team mode)
    const oScore = goals.filter(g => g.team === 'orange').length;
    const gScore = goals.filter(g => g.team === 'green').length;

    const oName = getTeamName('orange');
    const gName = getTeamName('green');
    const oHex  = getTeamHex('orange');
    const gHex  = getTeamHex('green');

    document.getElementById('scoreO').textContent = oScore;
    document.getElementById('scoreG').textContent = gScore;
    document.getElementById('scoreO').style.color = oHex;
    document.getElementById('scoreG').style.color = gHex;

    const lblO = document.getElementById('lblO');
    lblO.innerHTML = `<span>${oName}</span>`;
    lblO.style.color = oHex;
    lblO.style.cursor = 'default';
    lblO.onclick = null;

    const lblG = document.getElementById('lblG');
    lblG.innerHTML = `<span>${gName}</span>`;
    lblG.style.color = gHex;
    lblG.style.cursor = 'default';
    lblG.onclick = null;

    // Score sub: cumulative same-pair total
    const subEl = document.getElementById('scoreSub');
    if (subEl) {
        if (mode && oTid && gTid && rounds.length) {
            let sA=0, sB=0, cnt=0;
            rounds.forEach(r => {
                const [rA, rB] = [r.team_a_id, r.team_b_id];
                if ((rA===oTid&&rB===gTid)||(rA===gTid&&rB===oTid)) {
                    sA += rA===oTid ? r.score_a : r.score_b;
                    sB += rB===gTid ? r.score_b : r.score_a;
                    cnt++;
                }
            });
            subEl.innerHTML = cnt > 0
                ? `Total ${tidBadge(oTid)} vs ${tidBadge(gTid)}: <b>${sA} - ${sB}</b> (${cnt} tur${cnt!==1?'e':''})`
                : '';
        } else subEl.innerHTML = '';
    }

    // (bara veche de undo a fost înlocuită de butonul universal fix, vezi updateUniversalUndoBtn())

    // Finalize button
    document.getElementById('btnFinalize').disabled = realGoals.length === 0 && rounds.length === 0;

    // 3-team button visual
    const threeBtnEl = document.getElementById('threeBtn');
    if (threeBtnEl) {
        threeBtnEl.style.background = mode ? 'rgba(124,77,255,.4)' : 'rgba(124,77,255,.15)';
        threeBtnEl.style.color      = mode ? '#fff' : '#8e3a9e';
    }

    // Teams grid
    const wrap = document.getElementById('teamsWrap');
    if (!orange.length && !green.length) {
        wrap.innerHTML = '<div class="empty-teams">Nicio echipă activă.<br><small>Setează jucătorii în aplicație.</small></div>';
    } else {
        // Define gpm and conc FIRST before makeRows uses them
        const gpm  = goalsMap();
        const conc = mode ? getRoundConceded() : { orange:0, green:0 };
        const bench = players.filter(p => p.status === 'bench');

        // Mark temp players in rows
        const makeRows = (pls, team) => pls.map(p => {
            const cnt = gpm[p.name] || 0;
            const isTemp = !!p._temp;
            const tempBadge = isTemp ? `<span style="font-size:.5rem;color:#8a6307;background:rgba(255,213,79,.12);border:1px solid rgba(255,213,79,.3);border-radius:4px;padding:1px 4px;margin-left:2px;vertical-align:middle;">TEMP</span>` : '';
            const removeTempBtn = isTemp ? `<button onclick="removeTempPlayer('${p.id}')" style="background:none;border:none;color:#6b5840;font-size:.7rem;cursor:pointer;padding:0 4px;flex-shrink:0;" title="Elimină jucător temporar">✕</button>` : '';
            return '<div class="pr">'
                + `<div class="pr-name" style="${isTemp?'color:#8a6307;':''}">${p.name}${tempBadge}</div>`
                + removeTempBtn
                + '<button class="pr-minus'+(cnt?' show':'')+'" onclick="removeGoal(\''+p.name+'\',\''+team+'\')">−</button>'
                + '<div class="pr-cnt'+(cnt?' has':'')+'">'+( cnt||'·' )+'</div>'
                + `<button class="pr-plus" onclick="confirmGoal('${p.name}','${team}')">+</button>`
                + '</div>';
        }).join('');

        const makeAddBtn = (team, hex) => {
            return `<div style="padding:4px 2px 2px;">
                <button onclick="openAddTempPlayer('${team}')"
                    style="width:100%;padding:7px 4px;border-radius:8px;border:1px dashed ${hex}44;background:${hex}0a;color:${hex};font-size:.68rem;font-weight:700;cursor:pointer;touch-action:manipulation;display:flex;align-items:center;justify-content:center;gap:5px;">
                    <span style="font-size:.9rem;">+</span> Adaugă jucător temporar
                </button>
            </div>`;
        };

        // Apare la ORICE discrepanță numerică între echipe (3v4, 4v5, 6v5 etc.),
        // indiferent dacă există jucători pe bancă — la 2 echipe se poate adăuga
        // și un nume nou (vezi openAddTempPlayer).
        const oAddBtn = isLiveAdmin && orange.length < green.length ? makeAddBtn('orange', oHex) : '';
        const gAddBtn = isLiveAdmin && green.length < orange.length ? makeAddBtn('green', gHex) : '';

        const oBadge = mode ? `<span class="round-badge">${conc.orange}/${st.goal_threshold||2} prim.</span>` : '';
        const gBadge = mode ? `<span class="round-badge">${conc.green}/${st.goal_threshold||2} prim.</span>`  : '';
        wrap.innerHTML =
            '<div class="team-col o-col">'
            + `<div class="team-hd"><span class="team-hd-lbl" style="color:${oHex}">${oName}</span>${oBadge} <span class="team-hd-cnt">${oScore}G</span></div>`
            + makeRows(orange, 'orange')
            + oAddBtn
            + '</div>'
            + '<div class="team-col g-col">'
            + `<div class="team-hd"><span class="team-hd-lbl" style="color:${gHex}">${gName}</span>${gBadge} <span class="team-hd-cnt">${gScore}G</span></div>`
            + makeRows(green, 'green')
            + gAddBtn
            + '</div>';
    }

    // 3-team bar
    const bar = document.getElementById('threeBar');
    if (bar) {
        bar.classList.toggle('show', mode);
        if (mode) {
            const thrEl = document.getElementById('thrVal'); if (thrEl) thrEl.textContent = st.goal_threshold || 2;
            const tlEl  = document.getElementById('timeLimitVal'); if (tlEl) tlEl.textContent = st.time_limit_min || 10;
            const bench = players.filter(p => p.status === 'bench');
            const bTid  = getTeamIdByColor('bench');
            const bName = getTeamName('bench');
            const bHex2 = getTeamHex('bench');
            const wp    = document.getElementById('waitingPlayers');
            const wLbl  = document.getElementById('waitingLbl');
            if (wLbl) {
                wLbl.textContent = '⏳ ' + bName;
                wLbl.style.color = bHex2;
                wLbl.style.cursor = 'default';
                wLbl.onclick = null;
            }
            const swapO = document.getElementById('swapBtnO');
            const swapG = document.getElementById('swapBtnG');
            const matchStarted = !!liveState?.match_started_at;
            if (swapO) {
                swapO.textContent = '↔ ' + oName;
                swapO.style.borderColor = oHex;
                swapO.style.color = oHex;
                swapO.disabled = matchStarted;
                swapO.title = matchStarted ? 'Meciul a început — schimb blocat' : '';
                swapO.style.opacity = matchStarted ? '0.35' : '1';
            }
            if (swapG) {
                swapG.textContent = '↔ ' + gName;
                swapG.style.borderColor = gHex;
                swapG.style.color = gHex;
                swapG.disabled = matchStarted;
                swapG.title = matchStarted ? 'Meciul a început — schimb blocat' : '';
                swapG.style.opacity = matchStarted ? '0.35' : '1';
            }
            if (wp) wp.innerHTML = bench.length
                    ? bench.map(p=>`<span style="background:#fdf3df;border:1px solid #d3bd8c;padding:2px 8px;border-radius:5px;color:#7d6849;">${p.name}</span>`).join('')
                    : '<span style="color:#7d6849;font-size:.72rem;">Nimeni</span>';
        }
    }

    renderLog();
    renderTureHistory();
    updateRoundTimerBar();

    // Below teams bar: settings in 3-team mode
    const btb = document.getElementById('belowTeamsBar');
    if (btb) btb.style.display = mode ? 'block' : 'none';

    // Swap teams button — show for admin when not started or in 3-team mode
    const swapBtn = document.getElementById('swapTeamsBtn');
    if (swapBtn) swapBtn.style.display = isLiveAdmin ? 'flex' : 'none';
    const tbw = document.getElementById('transferBtnWrap');
    if (tbw) tbw.style.display = isLiveAdmin ? 'block' : 'none';
}

// ── Ture history ──────────────────────────────────────────────────
function renderTureHistory() {
    const section = document.getElementById('tureSection');
    const body    = document.getElementById('tureBody');
    const cnt     = document.getElementById('tureCnt');
    if (!section || !body) return;
    const mode = getThreeTeamMode();
    const show = mode && rounds.length > 0;
    section.classList.toggle('show', show);
    if (cnt) cnt.textContent = rounds.length;
    if (!show) return;

    const outReasonText = {
        goals:   'prea multe goluri primite',
        time:    'timp expirat',
        manual:  'schimbare manuală',
        final:   'final meci',
        penalty: 'egalitate — decis la penalty',
    };

    body.innerHTML = [...rounds].reverse().map(r => {
        const tA = r.team_a_id, tB = r.team_b_id;
        const sA = r.score_a || 0, sB = r.score_b || 0;
        let winA = sA > sB, winB = sB > sA;
        // La egalitate, dacă runda s-a decis la penalty, câștigătorul e cel din penalty_winner_id
        if (sA === sB && r.penalty_winner_id) {
            winA = r.penalty_winner_id === tA;
            winB = r.penalty_winner_id === tB;
        }
        const cA = winA ? '#1b7a43' : winB ? '#b71c1c' : '#aaa';
        const cB = winB ? '#1b7a43' : winA ? '#b71c1c' : '#aaa';
        const min = r.duration_sec ? Math.ceil(r.duration_sec/60)+"'" : '';
        const rLabels = { goals:'goluri', time:'timp', manual:'manual', final:'final', penalty:'penalty' };
        const rLabel  = rLabels[r.end_reason] || r.end_reason || '';
        const rId = r.id;
        const nA = getTeamNameById(tA), nB = getTeamNameById(tB);

        // Linia secundară: cine iese și de ce (+ cine câștigă la penalty)
        const outName  = r.loser_team_id ? getTeamNameById(r.loser_team_id) : null;
        const outHex   = r.loser_team_id ? getTeamHexById(r.loser_team_id) : '#7d6849';
        const outText  = outReasonText[r.end_reason] || r.end_reason || '';
        let subHtml = '';
        if (outName) {
            subHtml = `<div class="tur-sub">↩ <b style="color:${outHex}">${outName}</b> iese — ${outText}</div>`;
        } else if (r.end_reason === 'final') {
            subHtml = `<div class="tur-sub">🏁 ${outText}</div>`;
        }
        if (r.end_reason === 'penalty' && r.penalty_winner_id) {
            const winName = getTeamNameById(r.penalty_winner_id);
            const winHex  = getTeamHexById(r.penalty_winner_id);
            subHtml += `<div class="tur-sub">🏆 <b style="color:${winHex}">${winName}</b> câștigă la penalty</div>`;
        }

        return `<div class="tur-item">
            <div class="tur-row" onclick="showRoundDetail('${rId}')">
                <span class="tur-num">Tur ${r.num}</span>
                <span class="tur-teams" style="flex:1;font-size:.7rem;color:#7d6849;">${nA} vs ${nB}</span>
                <span class="tur-score">
                    <span style="color:${cA}">${sA}</span>
                    <span style="color:#7d6849;font-size:.7rem;margin:0 2px">-</span>
                    <span style="color:${cB}">${sB}</span>
                </span>
                <span class="tur-meta">${min}<span class="tur-reason ${r.end_reason||''}">${rLabel}</span></span>
                <span style="color:#7d6849;font-size:.7rem;">›</span>
            </div>
            ${subHtml}
        </div>`;
    }).join('');
}

function toggleTure() {
    const body    = document.getElementById('tureBody');
    const chevron = document.getElementById('tureChevron');
    if (!body) return;
    const open = body.classList.toggle('open');
    if (chevron) chevron.textContent = open ? '▼' : '▲';
}

// ── Round Detail Modal ────────────────────────────────────────────
function showRoundDetail(roundId) {
    const r = rounds.find(x => String(x.id) === String(roundId));
    if (!r) return;

    const tA = r.team_a_id, tB = r.team_b_id;
    const sA = r.score_a || 0, sB = r.score_b || 0;
    let winA = sA > sB, winB = sB > sA;
    if (sA === sB && r.penalty_winner_id) {
        winA = r.penalty_winner_id === tA;
        winB = r.penalty_winner_id === tB;
    }
    const hA = getTeamHexById(tA), hB = getTeamHexById(tB);
    const nA = getTeamNameById(tA) || tA;
    const nB = getTeamNameById(tB) || tB;
    const cA = winA ? hA : winB ? '#b71c1c' : '#aaa';
    const cB = winB ? hB : winA ? '#b71c1c' : '#aaa';

    const rLabels = { goals:'⚽ Goluri', time:'⏱ Timp', manual:'✋ Manual', final:'🏁 Final', penalty:'⚽ Penalty' };
    let endLabel = rLabels[r.end_reason] || r.end_reason || '—';
    const outName = r.loser_team_id ? getTeamNameById(r.loser_team_id) : null;
    if (outName) endLabel += ` · ↩ ${outName} iese`;
    if (r.end_reason === 'penalty' && r.penalty_winner_id) {
        endLabel += ` · 🏆 ${getTeamNameById(r.penalty_winner_id)} câștigă`;
    }
    const durMin = r.duration_sec ? Math.floor(r.duration_sec/60)+"'"+String(r.duration_sec%60).padStart(2,'0')+"\"" : '—';

    const rGoals = Array.isArray(r.goals) ? r.goals : [];
    const scorersHtml = rGoals.length
        ? rGoals.map(g => {
            // Use team_a_id hex for orange slot, team_b_id hex for green slot
            const col = g.team === 'orange' ? hA : hB;
            const min = g.minute != null ? g.minute+"'" : '';
            return `<div class="rd-goal-row">
                <div class="rd-goal-dot" style="background:${col};"></div>
                <span class="rd-goal-name">${g.player_name}</span>
                <span class="rd-goal-min">${min}</span>
            </div>`;
        }).join('')
        : '<div style="color:#7d6849;font-size:.75rem;padding:4px 0;">Niciun gol marcat</div>';

    const oPlayers = Array.isArray(r.orange_players) ? r.orange_players : [];
    const gPlayers = Array.isArray(r.green_players)  ? r.green_players  : [];
    const oGoals = rGoals.filter(g => g.team === 'orange');
    const gGoals = rGoals.filter(g => g.team === 'green');

    const makePlayerList = (pls, teamGoals) => pls.map(name => {
        const cnt = teamGoals.filter(g => g.player_name === name).length;
        return `<div class="rd-pl-name">${name}${cnt ? ' <span style="font-family:\'Bebas Neue\',sans-serif;font-size:.8rem;color:#1b7a43;">⚽'+cnt+'</span>' : ''}</div>`;
    }).join('') || '<div style="color:#7d6849;font-size:.72rem;">—</div>';

    document.getElementById('rdTitle').textContent = `Tur ${r.num}`;
    document.getElementById('rdSub').textContent = `${nA} vs ${nB}`;
    document.getElementById('rdScoreA').style.color = cA;
    document.getElementById('rdScoreA').textContent = sA;
    document.getElementById('rdScoreB').style.color = cB;
    document.getElementById('rdScoreB').textContent = sB;
    document.getElementById('rdTeamA').innerHTML = `<span style="color:${hA}">${nA}</span>`;
    document.getElementById('rdTeamB').innerHTML = `<span style="color:${hB}">${nB}</span>`;
    document.getElementById('rdDur').textContent = durMin;
    document.getElementById('rdEnd').textContent = endLabel;
    document.getElementById('rdOPlayers').innerHTML = makePlayerList(oPlayers, oGoals);
    document.getElementById('rdGPlayers').innerHTML = makePlayerList(gPlayers, gGoals);
    document.getElementById('rdScorers').innerHTML = scorersHtml;

    // Execuții penalty, dacă tura s-a decis la lovituri de departajare
    const penSection = document.getElementById('rdPenaltySection');
    const penShotsEl  = document.getElementById('rdPenaltyShots');
    if (Array.isArray(r.penalty_shots) && r.penalty_shots.length) {
        penShotsEl.innerHTML = r.penalty_shots.map((s,i) => {
            const col = s.team === 'orange' ? hA : hB;
            const icon = s.state === 'goal' ? '✅' : '❌';
            return `<div class="rd-goal-row">
                <div class="rd-goal-dot" style="background:${col};"></div>
                <span class="rd-goal-name">${i+1}. ${s.player_name}</span>
                <span class="rd-goal-min">${icon}</span>
            </div>`;
        }).join('');
        penSection.style.display = 'block';
    } else {
        penSection.style.display = 'none';
    }
    // Fix column headers
    document.getElementById('rdOHd').style.color = hA;
    document.getElementById('rdGHd').style.color = hB;
    document.getElementById('rdOHd').textContent = nA;
    document.getElementById('rdGHd').textContent = nB;

    document.getElementById('roundDetailOverlay').classList.add('show');
}
function closeRoundDetail() {
    document.getElementById('roundDetailOverlay').classList.remove('show');
}

// ── Log ───────────────────────────────────────────────────────────
function renderLog() {
    // Show ALL goals across entire match (past rounds + current round)
    const allGoals = allMatchGoals();
    document.getElementById('logCnt').textContent = allGoals.length;
    const panel = document.getElementById('logPanel');
    const empty = document.getElementById('logEmpty');
    panel.querySelectorAll('.log-entry').forEach(e => e.remove());
    if (!allGoals.length) { if (empty) empty.style.display='block'; return; }
    if (empty) empty.style.display = 'none';
    const frag = document.createDocumentFragment();
    [...allGoals].reverse().forEach(g => {
        const div = document.createElement('div');
        div.className = 'log-entry';
        // In past rounds, team slot may have rotated — use team field as stored
        const dot = g.team === 'orange' ? 'var(--o)' : 'var(--g)';
        const min = g.minute != null ? g.minute+"'" : "—'";
        const roundLbl = g._roundNum ? `<span style="font-size:.55rem;color:#7d6849;">T${g._roundNum}</span> ` : '';
        div.innerHTML = roundLbl
            + '<span class="log-min">'+min+'</span>'
            + '<div class="log-dot" style="background:'+dot+';"></div>'
            + '<span class="log-name">'+g.player_name+'</span>'
            + '<span class="log-badge">⚽</span>';
        frag.appendChild(div);
    });
    panel.insertBefore(frag, panel.firstChild);
}
function toggleLog() {
    const panel   = document.getElementById('logPanel');
    const chevron = document.getElementById('logChevron');
    chevron.textContent = panel.classList.toggle('open') ? '▼' : '▲';
}

// ── Goal actions ──────────────────────────────────────────────────
// ── Goal confirm popup ────────────────────────────────────────────
let _pendingGoal = null;

function confirmGoal(name, team) {
    if (_goalBusy) return;
    _pendingGoal = { name, team };
    const hex = getTeamHex(team);
    const tName = getTeamName(team);
    document.getElementById('gcName').textContent = name;
    document.getElementById('gcTeam').textContent = tName;
    document.getElementById('gcTeam').style.color = hex;
    document.getElementById('gcDot').style.background = hex;
    document.getElementById('goalConfirmOverlay').classList.add('show');
}
function cancelGoalConfirm() {
    document.getElementById('goalConfirmOverlay').classList.remove('show');
    _pendingGoal = null;
    _goalBusy = false;
}
async function doConfirmGoal() {
    document.getElementById('goalConfirmOverlay').classList.remove('show');
    if (!_pendingGoal) return;
    await addGoal(_pendingGoal.name, _pendingGoal.team);
    _pendingGoal = null;
}

let _goalBusy = false;
async function addGoal(name, team) {
    if (_goalBusy) return;
    _goalBusy = true;
    setTimeout(() => { _goalBusy = false; }, 900);

    if (navigator.vibrate) navigator.vibrate(40);
    playGoalSound();
    const minute = liveState?.timer_status !== 'idle'
        ? Math.floor(calcElapsedSec(liveState) / 60) : null;
    const tmpId  = 'tmp_' + Date.now();
    goals.push({ id: tmpId, player_name: name, team, minute, created_at: new Date().toISOString() });
    render(); bump(team);

    try {
        const { data, error } = await sb.from('live_goals')
            .insert({ player_name: name, team, minute }).select().single();
        if (error) throw error;
        goals = goals.map(g => g.id === tmpId ? data : g);
        render();
        lastAction = { type:'goal', label:`Ultimul gol: ${name}`, undo: undoLast };
        updateUniversalUndoBtn();
        if (liveState?.three_team_mode) await checkGoalRotation();
    } catch(e) {
        goals = goals.filter(g => g.id !== tmpId);
        render(); showToast('⚠️ ' + e.message);
    }
}

async function removeGoal(name, team) {
    const arr = [...goals].map((g,i)=>({g,i})).filter(({g})=>g.player_name===name&&g.team===team&&!String(g.id).startsWith('tmp_'));
    if (!arr.length) return;
    const { g, i } = arr[arr.length-1];
    goals.splice(i, 1); render();
    try { await sb.from('live_goals').delete().eq('id', g.id); }
    catch(e) { goals.splice(i,0,g); render(); showToast('⚠️ '+e.message); }
}

// ── Buton universal ↩ — anulează ultima acțiune (gol SAU rotație), oriunde ar fi ──
function updateUniversalUndoBtn(){
    const btn = document.getElementById('universalUndoBtn');
    const sub = document.getElementById('universalUndoSub');
    if (!btn) return;
    if (lastAction) {
        btn.classList.add('show');
        if (sub) sub.textContent = lastAction.label || '';
    } else {
        btn.classList.remove('show');
        if (sub) sub.textContent = '';
    }
}
async function universalUndo(){
    if (!lastAction) return;
    const action = lastAction;
    lastAction = null;
    updateUniversalUndoBtn();
    try { await action.undo(); }
    catch(e){ console.error('universalUndo error:', e); showToast('⚠️ Eroare la anulare: '+e.message); }
}

async function undoLast() {
    const realGoals = goals.filter(g => !String(g.id).startsWith('tmp_'));
    const lastG = realGoals[realGoals.length-1];
    if (!lastG) return;
    goals = goals.filter(x => x.id !== lastG.id); render();
    try { await sb.from('live_goals').delete().eq('id', lastG.id); }
    catch(e) { showToast('⚠️ ' + e.message); }
}

// ── Finalize ──────────────────────────────────────────────────────
let editRounds = [];
let editPairs  = []; // 3-team mode: grouped by team pair

function buildPairs(allRounds) {
    const pairMap = {};
    allRounds.forEach(r => {
        const tA = r.team_a_id;
        const tB = r.team_b_id;
        if (!tA || !tB) return;

        // Cheia canonică: verificăm ambele ordini (A-B și B-A) să nu creăm duplicate
        const key1 = tA + '-' + tB;
        const key2 = tB + '-' + tA;
        let key, isStrictA;

        if (pairMap[key1]) {
            key = key1;
            isStrictA = true; // această rundă: r.team_a_id = pair.team_a_id
        } else if (pairMap[key2]) {
            key = key2;
            isStrictA = false; // această rundă: echipele sunt inversate față de pair
        } else {
            // Prima apariție — creăm perechea cu ordinea din această rundă
            key = key1;
            isStrictA = true;
            pairMap[key] = {
                key,
                team_a_id: tA, // PRIMA echipă văzută = canonA
                team_b_id: tB, // A DOUA echipă văzută = canonB
                score_a: 0, score_b: 0,   // ture câștigate
                goals_a: 0, goals_b: 0,   // goluri cumulate
                a_players: new Set(),
                b_players: new Set(),
                all_goals: [],
                rounds: []
            };
        }

        const pair = pairMap[key];

        // Scoruri: dacă isStrictA, runda are same order; altfel, inversat
        const rA = isStrictA ? (r.score_a||0) : (r.score_b||0);
        const rB = isStrictA ? (r.score_b||0) : (r.score_a||0);
        pair.goals_a += rA;
        pair.goals_b += rB;
        if (rA > rB) pair.score_a += 1;
        else if (rB > rA) pair.score_b += 1;
        else if (rA === rB && r.penalty_winner_id) {
            // Egalitate în timpul rundei → decisă la penalty-uri.
            // penalty_winner_id e ID-ul absolut al echipei (team_a_id/team_b_id din DB),
            // deci se compară direct cu ID-urile canonice ale perechii, nu cu rA/rB.
            if (r.penalty_winner_id === pair.team_a_id) pair.score_a += 1;
            else if (r.penalty_winner_id === pair.team_b_id) pair.score_b += 1;
        }

        // Jucători: orange = echipa care era în slotul 'orange', green = slotul 'green'
        const orangePl = r.orange_players || [];
        const greenPl  = r.green_players  || [];
        if (isStrictA) {
            // r.team_a_id === pair.team_a_id → orange slot = echipa A, green slot = echipa B
            orangePl.forEach(n => pair.a_players.add(n));
            greenPl.forEach(n  => pair.b_players.add(n));
        } else {
            // Rundă inversată → orange slot = echipa B, green slot = echipa A
            orangePl.forEach(n => pair.b_players.add(n));
            greenPl.forEach(n  => pair.a_players.add(n));
        }

        // Goluri: mapăm la canon_team ('a' sau 'b') bazat pe slotul real
        (Array.isArray(r.goals) ? r.goals : []).forEach(g => {
            // 'orange' slot → echipa A dacă isStrictA, echipa B dacă !isStrictA
            let canonTeam;
            if (g.team === 'orange') {
                canonTeam = isStrictA ? 'a' : 'b';
            } else { // 'green'
                canonTeam = isStrictA ? 'b' : 'a';
            }
            pair.all_goals.push({ ...g, canon_team: canonTeam });
        });

        pair.rounds.push({ ...r, _isStrictA: isStrictA });
    });

    return Object.values(pairMap).map(p => ({
        ...p,
        a_players: [...p.a_players],
        b_players: [...p.b_players]
    }));
}

function openFinalize() {
    const mode = getThreeTeamMode();
    const allRounds = rounds.map(r => ({...r}));
    const roundG = mode ? getRoundGoals() : [];
    const oG = roundG.filter(g=>g.team==='orange').length;
    const gG = roundG.filter(g=>g.team==='green').length;
    if (mode && (oG>0||gG>0)) {
        allRounds.push({
            id: '__current__',
            num: allRounds.length+1,
            team_a_id: getTeamIdByColor('orange')||'teamA',
            team_b_id: getTeamIdByColor('green')||'teamB',
            score_a: oG, score_b: gG,
            orange_players: players.filter(p=>p.status==='orange').map(p=>p.name),
            green_players:  players.filter(p=>p.status==='green').map(p=>p.name),
            goals: roundG,
            duration_sec: calcRoundElapsedSec(liveState),
            end_reason: 'final',
        });
    }
    if (mode) {
        editPairs  = buildPairs(allRounds);
        editRounds = allRounds; // keep for reference
    } else {
        editRounds = allRounds;
        editPairs  = [];
    }
    renderFinalizeDialog();
    document.getElementById('dialogOverlay').classList.add('show');
}

function renderFinalizeDialog() {
    if (getThreeTeamMode() && editPairs.length > 0) {
        renderFinalize3Team(); return;
    }
    // ── 2-team mode ───────────────────────────────────────────────
    const allGoals = goals.filter(g=>!String(g.id).startsWith('tmp_'));
    const scorerMap = {};
    allGoals.forEach(g => {
        if (!scorerMap[g.player_name]) scorerMap[g.player_name]={count:0,team:g.team,mins:[]};
        scorerMap[g.player_name].count++;
        if (g.minute!=null) scorerMap[g.player_name].mins.push(g.minute+"'");
    });
    const sorted = Object.entries(scorerMap).sort((a,b)=>b[1].count-a[1].count);
    const mvp = sorted[0];
    const mvpHtml = mvp
        ? '<div class="mvp-row"><div class="mvp-icon">🥇</div><div><div class="mvp-info-lbl">MVP Meci</div><div class="mvp-info-name">'+mvp[0]+' · '+mvp[1].count+' gol'+(mvp[1].count!==1?'uri':'')+'</div></div></div>'
        : '';
    const scorersHtml = sorted.length
        ? sorted.map(([name,d])=>'<div class="scorer-row"><div class="scorer-dot" style="background:'+(d.team==='orange'?'var(--o)':'var(--g)')+'"></div><span class="scorer-name">'+name+'</span><span class="scorer-goals">'+d.count+'⚽</span><span class="scorer-mins">'+(d.mins.length?' · '+d.mins.join(', '):'')+'</span></div>').join('')
        : '<div style="color:#7d6849;font-size:.78rem;padding:4px 0;">Niciun marcator.</div>';
    document.getElementById('dialogBox').innerHTML =
        '<div class="dialog-title">🏁 Finalizează Meciul</div>'
        +mvpHtml
        +'<div class="dialog-section">Marcatori</div>'
        +'<div>'+scorersHtml+'</div>'
        +'<div class="dialog-actions">'
        +'<button class="dia-cancel" onclick="closeDialog()">✕ Înapoi</button>'
        +'<button class="dia-confirm" onclick="confirmFinalize()">✅ Salvează & Finalizează</button>'
        +'</div>';
}

function renderFinalize3Team() {
    // MVP overall
    const allGoals3 = editPairs.flatMap(p => p.all_goals);
    const sc3 = {}; allGoals3.forEach(g => { sc3[g.player_name]=(sc3[g.player_name]||0)+1; });
    const topScorer = Object.entries(sc3).sort((a,b)=>b[1]-a[1])[0];
    const mvpHtml = topScorer
        ? `<div class="mvp-row"><div class="mvp-icon">🥇</div><div><div class="mvp-info-lbl">MVP Meci</div><div class="mvp-info-name">${topScorer[0]} · ${topScorer[1]} goluri</div></div></div>`
        : '';

    const reasonIcon  = {goals:'⚽',time:'⏱',manual:'✋',final:'🏁',penalty:'🥅'};
    const reasonLabel = {goals:'goluri',time:'timp',manual:'manual',final:'final',penalty:'penalty'};

    const pairsHtml = editPairs.map((pair, idx) => {
        const nA = getTeamNameById(pair.team_a_id);
        const nB = getTeamNameById(pair.team_b_id);
        const hA = getTeamHexById(pair.team_a_id);
        const hB = getTeamHexById(pair.team_b_id);
        const sA = pair.score_a, sB = pair.score_b; // ture câștigate
        const winA = sA > sB, winB = sB > sA;

        // Scorers for this pair
        const pairSc = {};
        pair.all_goals.forEach(g => { pairSc[g.player_name]=(pairSc[g.player_name]||0)+1; });
        const scorersList = Object.entries(pairSc).sort((a,b)=>b[1]-a[1])
            .map(([n,c]) => {
                const isA = pair.a_players.includes(n);
                return `<span style="font-size:.68rem;color:${isA?hA:hB};font-weight:700;">${n} ⚽${c}</span>`;
            }).join('<span style="color:#7d6849;margin:0 4px;">·</span>');

        // Rounds detail — scor, mod încheiere, durată
        const roundsDetail = pair.rounds.map(r => {
            const aIsOrange = (r.team_a_id === pair.team_a_id);
            const rA = aIsOrange ? r.score_a : r.score_b;
            const rB = aIsOrange ? r.score_b : r.score_a;
            let roundWinner = rA > rB ? nA : rB > rA ? nB : null;
            let winCol = rA > rB ? hA : rB > rA ? hB : '#555';
            if (rA === rB && r.penalty_winner_id) {
                if (r.penalty_winner_id === pair.team_a_id) { roundWinner = nA; winCol = hA; }
                else if (r.penalty_winner_id === pair.team_b_id) { roundWinner = nB; winCol = hB; }
            }
            const icon = reasonIcon[r.end_reason] || '•';
            const label = reasonLabel[r.end_reason] || r.end_reason || '';
            const m = r.duration_sec ? Math.floor(r.duration_sec/60) : 0;
            const s = r.duration_sec ? r.duration_sec%60 : 0;
            const durStr = r.duration_sec ? `${m}:${String(s).padStart(2,'0')}` : '—';
            return `<div style="display:flex;align-items:center;gap:6px;padding:4px 0;font-size:.66rem;border-bottom:1px solid #14161f;">
                <span style="color:#6b5840;min-width:38px;">Tur ${r.num}</span>
                <span style="color:#7d6849;flex:1;">${rA}-${rB}</span>
                <span style="color:${winCol};font-weight:700;min-width:62px;">${icon} ${label}</span>
                <span style="color:#7d6849;min-width:42px;text-align:right;">⏲ ${durStr}</span>
            </div>`;
        }).join('');

        return `<div style="background:#fffaf0;border-radius:10px;border:1px solid ${winA||winB?'#d3bd8c':'#e3d3ac'};padding:10px 12px;margin-bottom:10px;">
            <!-- Score row: TURE CÂȘTIGATE -->
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                <span style="font-family:'Bebas Neue',sans-serif;font-size:.95rem;letter-spacing:1px;color:${hA};flex:1;">${nA}</span>
                <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;">
                    <input type="number" min="0" max="99" value="${sA}"
                        style="width:40px;background:#f7ecd9;border:2px solid ${winA?hA:'#dcc89a'};color:${winA?hA:'#fff'};border-radius:7px;text-align:center;font-family:'Bebas Neue',sans-serif;font-size:1.4rem;padding:2px 0;outline:none;"
                        onchange="editPairScore(${idx},'a',this.value)">
                    <span style="color:#7d6849;font-family:'Bebas Neue',sans-serif;font-size:1rem;">:</span>
                    <input type="number" min="0" max="99" value="${sB}"
                        style="width:40px;background:#f7ecd9;border:2px solid ${winB?hB:'#dcc89a'};color:${winB?hB:'#fff'};border-radius:7px;text-align:center;font-family:'Bebas Neue',sans-serif;font-size:1.4rem;padding:2px 0;outline:none;"
                        onchange="editPairScore(${idx},'b',this.value)">
                </div>
                <span style="font-family:'Bebas Neue',sans-serif;font-size:.95rem;letter-spacing:1px;color:${hB};flex:1;text-align:right;">${nB}</span>
            </div>
            <div style="text-align:center;font-size:.58rem;color:#6b5840;margin-bottom:7px;">ture câștigate · goluri: ${pair.goals_a}-${pair.goals_b}</div>
            <!-- Players row -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:7px;">
                <div style="font-size:.65rem;color:#6b5840;line-height:1.5;">${pair.a_players.join(', ')||'—'}</div>
                <div style="font-size:.65rem;color:#6b5840;text-align:right;line-height:1.5;">${pair.b_players.join(', ')||'—'}</div>
            </div>
            <!-- Scorers -->
            ${scorersList ? `<div style="margin-bottom:8px;display:flex;flex-wrap:wrap;gap:4px;">${scorersList}</div>` : ''}
            <!-- Rounds detail -->
            <div style="border-top:1px solid #1a1d28;padding-top:4px;">${roundsDetail}</div>
        </div>`;
    }).join('');

    document.getElementById('dialogBox').innerHTML =
        '<div class="dialog-title">🏁 Finalizează Meciul</div>'
        + mvpHtml
        + `<div class="dialog-section">${editPairs.length} meciuri · scor = ture câștigate</div>`
        + pairsHtml
        + '<div class="dialog-actions">'
        + '<button class="dia-cancel" onclick="closeDialog()">✕ Înapoi</button>'
        + '<button class="dia-confirm" onclick="confirmFinalize()">✅ Salvează & Finalizează</button>'
        + '</div>';
}

function editPairScore(idx, side, val) {
    const v = Math.max(0, parseInt(val)||0);
    if (side === 'a') editPairs[idx].score_a = v;
    else              editPairs[idx].score_b = v;
}
function editRoundScore(idx, side, val) {
    const v = Math.max(0, parseInt(val)||0);
    if (side === 'a') editRounds[idx].score_a = v;
    else              editRounds[idx].score_b = v;
}
function deleteEditRound(idx) {
    editRounds.splice(idx, 1);
    editRounds.forEach((r,i) => r.num = i+1);
    if (getThreeTeamMode()) { editPairs = buildPairs(editRounds); renderFinalize3Team(); }
    else renderFinalizeDialog();
}
function confirmFinalize() {
    if (getThreeTeamMode()) finalizeMatch3Team(editPairs);
    else finalizeMatch2Team(editRounds);
}
function closeDialog() { document.getElementById('dialogOverlay').classList.remove('show'); }

// ── Finalize 3-team: 3 meciuri per pereche ───────────────────────
function getDurationWeight(durationSec) {
    if (!durationSec || durationSec <= 0) return 1.0;
    return Math.min(1.0, Math.max(0.5, durationSec / (15 * 60)));
}
async function finalizeMatch3Team(pairs) {
    if (isSaving) return;
    isSaving = true;
    lastAction = null; updateUniversalUndoBtn();
    document.querySelectorAll('.dia-confirm').forEach(b=>{b.disabled=true;b.textContent='⏳ Se salvează...';});
    closeDialog();
    const today = new Date().toLocaleDateString('ro-RO',{day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,'.');
    try {
        let savedCount = 0;
        const pairResults = [];
        for (const pair of pairs) {
            if (!pair.a_players.length || !pair.b_players.length) continue;
            const nA = getTeamNameById(pair.team_a_id);
            const nB = getTeamNameById(pair.team_b_id);
            const sA = pair.score_a, sB = pair.score_b;
            const winner = sA > sB ? nA : sB > sA ? nB : 'Egal';
            const aWon = sA > sB, bWon = sB > sA;
            const goalsImbalanced = Math.abs(pair.goals_a - pair.goals_b) >= 3;
            pairResults.push({ nA, nB, sA, sB });

            // ── Coloana corectă per teamId ──
            const getColumn = (teamId) => {
                if (teamId === 'teamA') return 'orange';
                if (teamId === 'teamB') return 'green';
                if (teamId === 'teamC') return 'black';
                const name = getTeamNameById(teamId).toLowerCase();
                if (name.includes('portocaliu')) return 'orange';
                if (name.includes('verde')) return 'green';
                return 'black';
            };
            const colA = getColumn(pair.team_a_id);
            const colB = getColumn(pair.team_b_id);

            const base_payload = {
                date: today, winner, score: sA + ':' + sB, imbalanced: goalsImbalanced,
                orange_players: colA==='orange' ? pair.a_players : colB==='orange' ? pair.b_players : [],
                green_players:  colA==='green'  ? pair.a_players : colB==='green'  ? pair.b_players : [],
                black_players:  colA==='black'  ? pair.a_players : colB==='black'  ? pair.b_players : [],
                team_a_id: pair.team_a_id, team_b_id: pair.team_b_id,
                started_at: liveState?.match_started_at || null, ended_at: new Date().toISOString(),
                goals_total_a: pair.goals_a, goals_total_b: pair.goals_b,
            };
            const roundsDetail = pair.rounds.map(r => {
                const aIsA = (r.team_a_id === pair.team_a_id);
                const loserName = r.loser_team_id === pair.team_a_id ? nA
                                 : r.loser_team_id === pair.team_b_id ? nB : null;
                const penWinnerName = r.penalty_winner_id === pair.team_a_id ? nA
                                     : r.penalty_winner_id === pair.team_b_id ? nB : null;
                return {
                    num: r.num,
                    score_a: aIsA ? r.score_a : r.score_b,
                    score_b: aIsA ? r.score_b : r.score_a,
                    end_reason: r.end_reason,
                    duration_sec: r.duration_sec || 0,
                    loser_name: loserName,
                    penalty_winner_name: r.end_reason === 'penalty' ? penWinnerName : null,
                    penalty_shots: r.end_reason === 'penalty' ? (r.penalty_shots || null) : null,
                };
            });

            let { data: mh, error: mhErr } = await sb.from('match_history')
                .insert({ ...base_payload, rounds_detail: roundsDetail }).select().single();
            if (mhErr) {
                const retry = await sb.from('match_history').insert(base_payload).select().single();
                mh = retry.data; mhErr = retry.error;
            }
            if (mhErr) { console.warn('pair save err:', mhErr.message); savedCount++; continue; }

            if (mh?.id && pair.all_goals.length) {
                try {
                    await sb.from('match_goals').insert(pair.all_goals.map(g => ({
                        match_id: mh.id, player_name: g.player_name,
                        team: g.canon_team === 'a' ? colA : colB,
                        goals: 1, goals_conceded: 0, minute: g.minute ?? null,
                    })));
                } catch(e) {}
                const sc = {}; pair.all_goals.forEach(g=>{sc[g.player_name]=(sc[g.player_name]||0)+1;});
                const mvpE = Object.entries(sc).sort((a,b)=>b[1]-a[1])[0];
                if (mvpE) { try { await sb.from('mvp_votes').insert({match_id:mh.id,voter:'system',mvp_player_name:mvpE[0],mvp_type:'goals'}); } catch(e){} }
            }

            for (const name of [...pair.a_players, ...pair.b_players]) {
                const p = players.find(x=>x.name===name); if(!p) continue;
                const inA = pair.a_players.includes(name);
                const won = inA ? aWon : bWon;
                const pGoals = pair.all_goals.filter(g=>g.player_name===name).length;
                const pConceded = inA ? pair.goals_b : pair.goals_a;
                try {
                    const {data:cur} = await sb.from('players')
                        .select('wins,games,match_history,total_goals,total_goals_conceded,last_imbalance_loss')
                        .eq('id',p.id).single();
                    if(cur) {
                        const newImb = (!won && goalsImbalanced)
                            ? (cur.last_imbalance_loss||0)+1 : won ? 0 : (cur.last_imbalance_loss||0);
                        await sb.from('players').update({
                            wins:(cur.wins||0)+(won?1:0), games:(cur.games||0)+1,
                            match_history:[...(cur.match_history||[]),won?'W':'L'].slice(-20),
                            total_goals:(cur.total_goals||0)+pGoals,
                            total_goals_conceded:(cur.total_goals_conceded||0)+pConceded,
                            last_imbalance_loss: newImb,
                        }).eq('id',p.id);
                    }
                } catch(e){}
            }
            savedCount++;
        }
        await sb.from('live_goals').delete().neq('id','00000000-0000-0000-0000-000000000000');
        await sb.from('live_rounds').delete().neq('id','00000000-0000-0000-0000-000000000000');
        await patchState({timer_status:'idle',timer_elapsed_ms:0,timer_started_at:null,
            three_team_mode:false,color_map:{},round_start_sec:0,match_started_at:null});
        rounds=[]; goals=[]; editPairs=[]; editRounds=[];
        render(); applyTimerUI(liveState);
        showToast(`✅ ${savedCount} meciuri salvate cu echipele corecte!`);
        const shareLines = pairResults.map(r => `⚽ ${r.nA} ${r.sA}:${r.sB} ${r.nB}`);
        const shareText = `⚽ Arena FC — ${today}\n\n` + shareLines.join('\n');
        showResultShare('🏁 Meci Finalizat', shareText, shareText);
        isSaving = false;
    } catch(e){ isSaving=false; showToast('⚠️ '+e.message); console.error(e); }
}


// ── Finalize 2-team: 1 meci ───────────────────────────────────────
async function finalizeMatch2Team(finalRounds) {
    if (isSaving) return;
    isSaving = true;
    lastAction = null; updateUniversalUndoBtn();
    document.querySelectorAll('.dia-confirm').forEach(b=>{b.disabled=true;b.textContent='⏳ Se salvează...';});
    closeDialog();
    const today = new Date().toLocaleDateString('ro-RO',{day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,'.');
    try {
        const orange=players.filter(p=>p.status==='orange').map(p=>p.name);
        const green=players.filter(p=>p.status==='green').map(p=>p.name);
        const realGoals=goals.filter(g=>!String(g.id).startsWith('tmp_'));
        const goalMap={};realGoals.forEach(g=>{if(!goalMap[g.player_name])goalMap[g.player_name]={count:0,team:g.team};goalMap[g.player_name].count++;});
        const oScore=realGoals.filter(g=>g.team==='orange').length;
        const gScore=realGoals.filter(g=>g.team==='green').length;
        const winner=oScore>gScore?'orange':gScore>oScore?'green':'draw';
        const winnerLabel=winner==='orange'?getTeamName('orange'):winner==='green'?getTeamName('green'):'Egal';
        const imbalanced=Math.abs(oScore-gScore)>=3;
        let endedAt=new Date().toISOString();
        if(liveState?.match_started_at) endedAt=new Date(new Date(liveState.match_started_at).getTime()+calcElapsedSec(liveState)*1000).toISOString();
        const{data:mh,error:mhErr}=await sb.from('match_history').insert({date:today,winner:winnerLabel,score:oScore+':'+gScore,imbalanced,orange_players:orange,green_players:green,started_at:liveState?.match_started_at||null,ended_at:endedAt}).select().single();
        if(mhErr) throw mhErr;
        if(mh?.id){
            const mvpRows=[];
            ['orange','green'].forEach(team=>{const tg=Object.entries(goalMap).filter(([,g])=>g.team===team).sort((a,b)=>b[1].count-a[1].count);if(tg.length&&tg[0][1].count>0)mvpRows.push({match_id:mh.id,voter:'system',mvp_player_name:tg[0][0],mvp_type:'goals'});});
            if(mvpRows.length){try{await sb.from('mvp_votes').insert(mvpRows);}catch(e){}}
            if(realGoals.length) await sb.from('match_goals').insert(realGoals.map(g=>({match_id:mh.id,player_name:g.player_name,team:g.team,goals:1,goals_conceded:0,minute:g.minute??null})));
        }
        for(const name of [...orange,...green]){
            const p=players.find(x=>x.name===name);if(!p)continue;
            const inO=orange.includes(name);
            const won=(inO&&winner==='orange')||(!inO&&winner==='green');
            const lost=(inO&&winner==='green')||(!inO&&winner==='orange');
            const pGoals=goalMap[name]?.count||0;
            // #4: goluri concedute = golurile echipei adverse
            const pConceded = inO ? gScore : oScore;
            // #9: durată meci
            const durSec = liveState?.match_started_at
                ? Math.round((new Date(endedAt).getTime() - new Date(liveState.match_started_at).getTime())/1000)
                : 0;
            try{
                const{data:cur}=await sb.from('players').select('wins,games,match_history,total_goals,total_goals_conceded,last_imbalance_loss').eq('id',p.id).single();
                if(cur)await sb.from('players').update({
                    wins:(cur.wins||0)+(won?1:0),
                    games:(cur.games||0)+1,
                    match_history:[...(cur.match_history||[]),won?'W':'L'],
                    total_goals:(cur.total_goals||0)+pGoals,
                    total_goals_conceded:(cur.total_goals_conceded||0)+pConceded,
                    last_imbalance_loss:(lost&&imbalanced)?(cur.last_imbalance_loss||0)+1:won?0:(cur.last_imbalance_loss||0)
                }).eq('id',p.id);
            }catch(e){}
        }
        await sb.from('live_goals').delete().neq('id','00000000-0000-0000-0000-000000000000');
        try{const active=players.filter(p=>p.status==='orange'||p.status==='green');if(active.length)await Promise.all(active.map(p=>sb.from('players').update({status:'bench'}).eq('id',p.id)));await sb.from('next_match').update({confirmed_ids:[],absent_ids:[]}).eq('id',1);}catch(e){}
        await patchState({timer_status:'idle',timer_elapsed_ms:0,timer_started_at:null,match_started_at:null,round_start_sec:0});
        goals=[];render();applyTimerUI(liveState);
        const top=Object.entries(goalMap).sort((a,b)=>b[1].count-a[1].count)[0];
        showToast('🏆 '+winnerLabel+' câștigă! '+(top?'🥇 MVP: '+top[0]:''));
        const scorerLines = Object.entries(goalMap).sort((a,b)=>b[1].count-a[1].count)
            .map(([name,g]) => `⚽ ${name} (${g.count===1?'1 gol':g.count+' goluri'})`);
        const shareText = `⚽ Arena FC — ${today}\n🏆 ${winnerLabel} câștigă ${oScore}:${gScore}\n\n`
            + (scorerLines.length ? scorerLines.join('\n') : 'Fără goluri înregistrate.');
        showResultShare('🏆 '+winnerLabel+' câștigă!', shareText, shareText);
        isSaving=false;
    } catch(e){isSaving=false;showToast('⚠️ '+e.message);console.error(e);}
}
// ── Jucători temporari ────────────────────────────────────────────
let _addTempTeam = null;

function openAddTempPlayer(team) {
    _addTempTeam = team;
    const bench = players.filter(p => p.status === 'bench');
    const already = players.filter(p => p._temp && p.status === team).map(p => p._sourceName);
    const available = bench.filter(b => !already.includes(b.name));

    const teamHex  = getTeamHex(team);
    const teamName = getTeamName(team);

    const benchListHtml = available.length ? available.map(p => {
        const cnt = goalsMap()[p.name] || 0;
        const cntLbl = cnt ? ` <span style="color:#1b7a43;font-size:.65rem;">⚽${cnt}</span>` : '';
        return `<div onclick="addTempPlayer('${p.id}','${p.name}')"
            style="display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:8px;border:1px solid #e3d3ac;background:#fffaf0;cursor:pointer;touch-action:manipulation;margin-bottom:6px;-webkit-tap-highlight-color:transparent;"
            onmousedown="this.style.background='${teamHex}15';this.style.borderColor='${teamHex}'"
            onmouseup="this.style.background='#fffaf0';this.style.borderColor='#e3d3ac'">
            <div style="width:32px;height:32px;border-radius:50%;background:${teamHex}22;border:1px solid ${teamHex}44;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:.9rem;color:${teamHex};">${p.name[0]}</div>
            <div style="flex:1;">
                <div style="font-weight:700;font-size:.85rem;">${p.name}${cntLbl}</div>
                <div style="font-size:.6rem;color:#7d6849;">Copiat temporar → ${teamName}</div>
            </div>
            <span style="color:#7d6849;font-size:.8rem;">›</span>
        </div>`;
    }).join('') : `<div style="font-size:.72rem;color:#7d6849;margin-bottom:4px;">Nu sunt jucători pe bancă momentan.</div>`;

    const customHtml = `
        <div style="margin-top:${available.length ? '12px' : '0'};padding-top:${available.length ? '12px' : '0'};${available.length ? 'border-top:1px dashed #e3d3ac;' : ''}">
            <div style="font-size:.65rem;color:#7d6849;margin-bottom:6px;">Sau adaugă un jucător nou (nume):</div>
            <div style="display:flex;gap:6px;">
                <input id="customTempName" type="text" placeholder="Nume jucător" autocomplete="off"
                    style="flex:1;padding:9px 10px;border-radius:8px;border:1px solid #e3d3ac;background:#fffaf0;font-size:.85rem;"
                    onkeydown="if(event.key==='Enter'){addCustomTempPlayer();}">
                <button onclick="addCustomTempPlayer()"
                    style="padding:9px 14px;border-radius:8px;border:1px solid ${teamHex}66;background:${teamHex}15;color:${teamHex};font-weight:700;cursor:pointer;white-space:nowrap;">+ Adaugă</button>
            </div>
        </div>`;

    document.getElementById('addTempBody').innerHTML = benchListHtml + customHtml;

    document.getElementById('addTempTitle').style.color = teamHex;
    document.getElementById('addTempTitle').textContent = '+ Adaugă în ' + teamName;
    document.getElementById('addTempOverlay').classList.add('show');
    setTimeout(() => document.getElementById('customTempName')?.focus(), 50);
}

function addCustomTempPlayer() {
    if (!_addTempTeam) return;
    const input = document.getElementById('customTempName');
    const name = (input?.value || '').trim();
    if (!name) { showToast('⚠️ Scrie un nume!'); return; }
    if (players.some(p => p._temp && p._sourceName === name && p.status === _addTempTeam)) {
        showToast('⚠️ Jucătorul e deja adăugat temporar!');
        return;
    }
    const tempId = 'temp_' + Date.now() + '_custom';
    players.push({
        id: tempId,
        name: name,
        status: _addTempTeam,
        _temp: true,
        _sourceName: name,
    });
    showToast(`✓ ${name} adăugat temporar în ${getTeamName(_addTempTeam)}`);
    closeAddTemp();
    render();
}

function closeAddTemp() {
    document.getElementById('addTempOverlay').classList.remove('show');
    _addTempTeam = null;
}

function addTempPlayer(sourceId, sourceName) {
    if (!_addTempTeam) return;
    // Check not already added
    if (players.some(p => p._temp && p._sourceName === sourceName && p.status === _addTempTeam)) {
        showToast('⚠️ Jucătorul e deja adăugat temporar!');
        closeAddTemp(); return;
    }
    const tempId = 'temp_' + Date.now() + '_' + sourceId;
    players.push({
        id: tempId,
        name: sourceName,
        status: _addTempTeam,
        _temp: true,
        _sourceName: sourceName,
    });
    showToast(`✓ ${sourceName} adăugat temporar în ${getTeamName(_addTempTeam)}`);
    closeAddTemp();
    render();
}

function removeTempPlayer(tempId) {
    const p = players.find(x => x.id === tempId);
    if (p) showToast(`✓ ${p.name} eliminat din echipă`);
    players = players.filter(x => x.id !== tempId);
    render();
}
let _transferPlayer = null;
let _transferTarget = null;

function openTransfer() {
    _transferPlayer = null; _transferTarget = null;
    renderTransferBody();
    document.getElementById('transferOverlay').classList.add('show');
}
function closeTransfer() {
    document.getElementById('transferOverlay').classList.remove('show');
}
function renderTransferBody() {
    const all = players.filter(p => ['orange','green','bench'].includes(p.status));
    const slots = ['orange','green','bench'];
    const slotLabel = s => getTeamName(s);
    const slotHex   = s => getTeamHex(s);

    const playersList = slots.map(slot => {
        const grp = all.filter(p => p.status === slot);
        if (!grp.length) return '';
        return `<div style="margin-bottom:8px;">
            <div style="font-size:.6rem;text-transform:uppercase;letter-spacing:1px;color:${slotHex(slot)};font-weight:700;margin-bottom:4px;">${slotLabel(slot)}</div>
            ${grp.map(p => `
                <div onclick="selectTransferPlayer('${p.id}')" id="tp_${p.id}"
                    style="padding:8px 10px;border-radius:8px;border:1px solid ${_transferPlayer===p.id?slotHex(slot):'#e3d3ac'};
                    background:${_transferPlayer===p.id?slotHex(slot)+'22':'#fffaf0'};
                    color:${_transferPlayer===p.id?'#fff':'#888'};font-size:.82rem;font-weight:700;
                    margin-bottom:3px;cursor:pointer;touch-action:manipulation;">
                    ${p.name} <span style="font-size:.65rem;color:${slotHex(slot)};opacity:.6;">(${slotLabel(slot)})</span>
                </div>`).join('')}
        </div>`;
    }).join('');

    const targetHtml = _transferPlayer ? (() => {
        const cur = players.find(p=>p.id===_transferPlayer);
        return `<div style="margin-top:10px;border-top:1px solid #e3d3ac;padding-top:10px;">
            <div style="font-size:.6rem;text-transform:uppercase;letter-spacing:1px;color:#7d6849;margin-bottom:6px;">Mută la echipa:</div>
            ${slots.filter(s=>s!==cur?.status).map(s=>`
                <div onclick="selectTransferTarget('${s}')" 
                    style="padding:9px 12px;border-radius:8px;border:1px solid ${_transferTarget===s?slotHex(s):'#e3d3ac'};
                    background:${_transferTarget===s?slotHex(s)+'22':'#fffaf0'};
                    color:${_transferTarget===s?'#fff':'#666'};font-size:.85rem;font-weight:700;
                    margin-bottom:4px;cursor:pointer;touch-action:manipulation;">
                    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${slotHex(s)};margin-right:6px;vertical-align:middle;"></span>
                    ${slotLabel(s)}
                </div>`).join('')}
        </div>`;
    })() : '';

    document.getElementById('transferBody').innerHTML = playersList + targetHtml;
    const btn = document.getElementById('transferConfirmBtn');
    if (btn) btn.disabled = !(_transferPlayer && _transferTarget);
}
function selectTransferPlayer(id) {
    _transferPlayer = id; _transferTarget = null;
    renderTransferBody();
}
function selectTransferTarget(slot) {
    _transferTarget = slot;
    renderTransferBody();
}
async function confirmTransfer() {
    if (!_transferPlayer || !_transferTarget) return;
    const p = players.find(x=>x.id===_transferPlayer);
    if (!p) return;
    players = players.map(x=>x.id===_transferPlayer ? {...x,status:_transferTarget} : x);
    render();
    closeTransfer();
    try { await sb.from('players').update({status:_transferTarget}).eq('id',_transferPlayer); }
    catch(e) { showToast('⚠️ '+e.message); }
    showToast(`✓ ${p.name} → ${getTeamName(_transferTarget)}`);
}
async function swapTeams() {
    if (isSaving) return;
    const orangePl = players.filter(p => p.status === 'orange');
    const greenPl  = players.filter(p => p.status === 'green');
    if (!orangePl.length && !greenPl.length) { showToast('⚠️ Nicio echipă activă!'); return; }

    // Swap optimistic
    players = players.map(p => {
        if (p.status === 'orange') return { ...p, status: 'green' };
        if (p.status === 'green')  return { ...p, status: 'orange' };
        return p;
    });

    // Also swap color_map if 3-team mode
    if (liveState?.three_team_mode) {
        const cm = { ...getColorMap() };
        const tmp = cm.orange;
        cm.orange = cm.green;
        cm.green = tmp;
        await patchState({ color_map: cm });
    }

    render();

    // Persist to DB
    isSaving = true;
    try {
        await Promise.all([
            ...orangePl.map(p => sb.from('players').update({ status: 'green'  }).eq('id', p.id)),
            ...greenPl.map(p  => sb.from('players').update({ status: 'orange' }).eq('id', p.id)),
        ]);
    } finally { isSaving = false; }
    showToast('⇄ Echipele au fost schimbate!');
}
function confirmReset() {
    document.getElementById('resetOverlay').classList.add('show');
}
async function doReset() {
    document.getElementById('resetOverlay').classList.remove('show');
    stopLocalTimerTick(); cancelRoundTimeout();
    try {
        await Promise.all([
            sb.from('live_goals').delete().neq('id','00000000-0000-0000-0000-000000000000'),
            sb.from('live_rounds').delete().neq('id','00000000-0000-0000-0000-000000000000'),
            patchState({timer_status:'idle',timer_elapsed_ms:0,timer_started_at:null,three_team_mode:false,color_map:{},round_start_sec:0,match_started_at:null}),
        ]);
        rounds=[]; goals=[];
        render(); applyTimerUI(liveState);
    } catch(e) { showToast('⚠️ '+e.message); }
}

// ── Realtime subscriptions ────────────────────────────────────────
function subscribe() {
    // live_state changes
    sb.channel('live_state_rt')
        .on('postgres_changes',{event:'UPDATE',schema:'public',table:'live_state',filter:'id=eq.1'}, payload => {
            const prev = liveState ? { ...liveState } : null;
            liveState = payload.new;
            render();
            // Only restart timer UI if status changed
            if (!prev || prev.timer_status !== liveState.timer_status
                || prev.timer_started_at !== liveState.timer_started_at) {
                applyTimerUI(liveState);
            }
            if (liveState.timer_status === 'running' && liveState.three_team_mode) {
                scheduleRoundTimeout(liveState);
            }
        })
        .subscribe();

    // live_goals changes
    sb.channel('live_goals_rt')
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'live_goals'}, p => {
            if (!goals.some(g => g.id === p.new.id)) {
                const ti = goals.findIndex(g => String(g.id).startsWith('tmp_') && g.player_name===p.new.player_name);
                if (ti !== -1) goals[ti] = p.new; else goals.push(p.new);
                render(); bump(p.new.team);
            }
        })
        .on('postgres_changes',{event:'DELETE',schema:'public',table:'live_goals'}, () => {
            // Re-fetch only — local array is already updated optimistically in doRotation/undoLast
            // This handler mainly helps spectators / other devices
            sb.from('live_goals').select('*').order('created_at',{ascending:true})
                .then(({data})=>{ goals=data||[]; render(); });
        })
        .subscribe();

    // live_rounds changes
    sb.channel('live_rounds_rt')
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'live_rounds'}, p => {
            // Replace any tmp_ placeholder with real DB row
            const tmpIdx = rounds.findIndex(r => String(r.id).startsWith('tmp_') && r.num === p.new.num);
            if (tmpIdx !== -1) rounds[tmpIdx] = p.new;
            else if (!rounds.some(r => r.id === p.new.id)) rounds.push(p.new);
            renderTureHistory();
        })
        .on('postgres_changes',{event:'DELETE',schema:'public',table:'live_rounds'}, () => {
            sb.from('live_rounds').select('*').order('num',{ascending:true}).then(({data})=>{ rounds=data||[]; renderTureHistory(); });
        })
        .subscribe();

    // players changes — debounced to avoid intermediate states during bulk updates
    let _playersRefetchTimer = null;
    sb.channel('players_rt')
        .on('postgres_changes', {event:'*', schema:'public', table:'players'}, (payload) => {
            // If we have a single row update and it matches a known player, apply it optimistically
            if (payload.eventType === 'UPDATE' && payload.new) {
                const idx = players.findIndex(p => p.id === payload.new.id);
                if (idx !== -1) players[idx] = { ...players[idx], ...payload.new };
            }
            // Debounce full refetch — wait for all parallel updates to settle
            if (_playersRefetchTimer) clearTimeout(_playersRefetchTimer);
            _playersRefetchTimer = setTimeout(() => {
                sb.from('players').select('id,name,status').order('name')
                    .then(({ data }) => { players = data || []; render(); });
                _playersRefetchTimer = null;
            }, 400);
        })
        .subscribe();
}




// ════════════════════════════════════════════════════════════════
// PENALTY SHOOTOUT
// ════════════════════════════════════════════════════════════════
// ── Penalty – tap simplu ─────────────────────────────────────────
let penState = null;

function openPenalty() {
    penState = { shots: [] };
    document.getElementById('penaltyOverlay').classList.add('show');
    renderPenalty();
}
function openPenaltyModal() { openPenalty(); }

function closePenalty() {
    document.getElementById('penaltyOverlay').classList.remove('show');
    penState = null;
}

function renderPenalty() {
    if (!penState) return;
    const oHex = getTeamHex('orange'), gHex = getTeamHex('green');
    const oName = getTeamName('orange'), gName = getTeamName('green');
    const oPlayers = players.filter(p => p.status === 'orange').map(p => p.name);
    const gPlayers = players.filter(p => p.status === 'green').map(p => p.name);
    const shots = penState.shots;
    const oGoals = shots.filter(s=>s.team==='orange'&&s.state==='goal').length;
    const gGoals = shots.filter(s=>s.team==='green' &&s.state==='goal').length;

    const shotIconsFor = (team, name) => shots
        .filter(s => s.team===team && s.playerName===name)
        .map(s => s.state==='goal' ? '✅' : '❌').join(' ') || '<span style="opacity:.3;">—</span>';

    const esc = s => s.replace(/'/g,"\\'");
    const makePlayerRow = (name, team, hex) => `
        <div style="display:flex;align-items:center;gap:6px;padding:6px 7px;background:#fffaf0;border:1px solid #e3d3ac;border-radius:8px;margin-bottom:5px;">
            <span style="flex:1;font-size:.78rem;font-weight:700;color:#3a2f1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${name}</span>
            <span style="font-size:.72rem;min-width:30px;text-align:center;">${shotIconsFor(team,name)}</span>
            <button onclick="penShot('${team}','${esc(name)}','goal')" style="width:30px;height:30px;flex-shrink:0;border-radius:7px;background:rgba(40,167,69,.15);border:1px solid #28a745;color:#1b7a43;font-size:.95rem;cursor:pointer;touch-action:manipulation;">✅</button>
            <button onclick="penShot('${team}','${esc(name)}','miss')" style="width:30px;height:30px;flex-shrink:0;border-radius:7px;background:rgba(198,40,40,.1);border:1px solid #c62828;color:#b71c1c;font-size:.95rem;cursor:pointer;touch-action:manipulation;">❌</button>
        </div>`;

    const content = document.getElementById('penaltyContent');
    if (!content) return;
    content.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:10px 14px 4px;text-align:center;">
            <div>
                <div style="font-family:'Bebas Neue',sans-serif;font-size:1.05rem;letter-spacing:2px;color:${oHex};">${oName}</div>
                <div style="font-family:'Bebas Neue',sans-serif;font-size:2.6rem;line-height:1;color:${oHex};">${oGoals}</div>
            </div>
            <div>
                <div style="font-family:'Bebas Neue',sans-serif;font-size:1.05rem;letter-spacing:2px;color:${gHex};">${gName}</div>
                <div style="font-family:'Bebas Neue',sans-serif;font-size:2.6rem;line-height:1;color:${gHex};">${gGoals}</div>
            </div>
        </div>
        <div style="padding:0 14px 6px;text-align:center;font-size:.6rem;color:#6b5840;">Apasă ✅ sau ❌ lângă jucătorul care execută lovitura</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 14px 8px;overflow-y:auto;flex:1;">
            <div>${oPlayers.length ? oPlayers.map(n=>makePlayerRow(n,'orange',oHex)).join('') : '<div style="font-size:.65rem;color:#6b5840;text-align:center;padding:8px;">Fără jucători</div>'}</div>
            <div>${gPlayers.length ? gPlayers.map(n=>makePlayerRow(n,'green',gHex)).join('') : '<div style="font-size:.65rem;color:#6b5840;text-align:center;padding:8px;">Fără jucători</div>'}</div>
        </div>
        <div style="padding:4px 14px 14px;display:flex;flex-direction:column;gap:8px;">
            <button onclick="undoPenShot()" ${shots.length?'':'disabled'} style="width:100%;padding:9px;border-radius:9px;background:#fdf3df;border:1px solid #dcc89a;color:#7d6849;font-size:.75rem;cursor:pointer;opacity:${shots.length?'1':'.5'};">↩ Anulează ultima execuție</button>
            <button onclick="confirmPenalty()" style="width:100%;padding:14px;border-radius:10px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;background:linear-gradient(135deg,#dff3df,#28a745);border:1px solid #28a745;color:#3a2f1f;touch-action:manipulation;">✓ Confirmă rezultat</button>
            <button onclick="closePenalty()" style="width:100%;padding:10px;border-radius:10px;background:#fffaf0;border:1px solid #e3d3ac;color:#7d6849;font-size:.8rem;cursor:pointer;">Anulează</button>
        </div>`;
}

function penShot(team, playerName, state) {
    if (!penState) return;
    penState.shots.push({ team, playerName, state });
    if (navigator.vibrate) navigator.vibrate(state==='goal' ? 30 : [20,40,20]);
    playBeep(state==='goal' ? 880 : 300, state==='goal' ? 90 : 160);
    renderPenalty();
}
function undoPenShot() {
    if (!penState || !penState.shots.length) return;
    penState.shots.pop();
    renderPenalty();
}

async function confirmPenalty() {
    if (!penState) return;
    const oG = penState.shots.filter(s=>s.team==='orange'&&s.state==='goal').length;
    const gG = penState.shots.filter(s=>s.team==='green' &&s.state==='goal').length;
    if (oG === gG && penState.shots.length === 0) {
        showToast('⚠️ Introdu cel puțin un rezultat!'); return;
    }
    if (oG === gG) {
        showToast(`⚽ Egal ${oG}-${gG}! Continuați!`); return;
    }
    const loser  = oG > gG ? 'green' : 'orange';
    const winner = loser === 'orange' ? 'green' : 'orange';
    const winnerTeamId = getTeamIdByColor(winner); // ID-ul echipei câștigătoare la penalty-uri
    showToast(`🏆 ${getTeamName(winner)} câștigă penalty ${oG}-${gG}!`);
    const shotsLog = penState.shots.map(s => ({ player_name: s.playerName, team: s.team, state: s.state }));
    closePenalty();
    await doRotation(loser, 'penalty', winnerTeamId, shotsLog);
}


// ── Rotation Confirmation Popup (instead of auto-swap) ────────────
let pendingRotation = null; // {loserColor, reason}

async function showRotationConfirm(loserColor, reason, triggerMsg) {
    const loserPlayers = players.filter(p => p.status === loserColor);
    const winnerColor  = loserColor === 'orange' ? 'green' : 'orange';
    const winnerPlayers= players.filter(p => p.status === winnerColor);
    const benchPlayers = players.filter(p => p.status === 'bench');

    const loseName  = getTeamName(loserColor);
    const winName   = getTeamName(winnerColor);
    const benchName = getTeamName('bench');
    const loseHex   = getTeamHex(loserColor);
    const winHex    = getTeamHex(winnerColor);
    const benchHex  = getTeamHex('bench');

    const roundG = getRoundGoals();
    const oG = roundG.filter(g=>g.team==='orange').length;
    const gG = roundG.filter(g=>g.team==='green').length;

    const scorers = {};
    roundG.forEach(g => { scorers[g.player_name]=(scorers[g.player_name]||0)+1; });
    const scorerHtml = Object.entries(scorers).length
        ? Object.entries(scorers).sort((a,b)=>b[1]-a[1])
            .map(([n,cnt])=>{
                const team = roundG.find(g=>g.player_name===n)?.team||'orange';
                const col  = getTeamHex(team);
                return `<div style="display:flex;align-items:center;gap:7px;padding:4px 0;border-bottom:1px solid #f5e9d4;">
                    <div style="width:7px;height:7px;border-radius:50%;background:${col};flex-shrink:0;"></div>
                    <span style="flex:1;font-weight:700;font-size:.82rem;">${n}</span>
                    <span style="font-family:'Bebas Neue',sans-serif;font-size:.9rem;color:#1b7a43;">⚽${cnt}</span>
                </div>`;
            }).join('')
        : '<div style="color:#7d6849;font-size:.75rem;padding:4px 0;">Niciun gol marcat în tur</div>';

    document.getElementById('rotConfirmTitle').innerHTML =
        `🔄 <span style="color:${loseHex}">${loseName}</span> IESE`;
    document.getElementById('rotConfirmSub').textContent = triggerMsg;
    document.getElementById('rotConfirmBody').innerHTML = `
        <div style="text-align:center;margin-bottom:12px;">
            <div style="font-family:'Bebas Neue',sans-serif;font-size:2.5rem;color:${getTeamHex(loserColor)};">${oG} : ${gG}</div>
            <div style="font-size:.65rem;color:#7d6849;">Scor tur curent</div>
        </div>
        <div style="font-size:.62rem;color:#7d6849;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Goluri marcate în tur</div>
        <div style="margin-bottom:12px;">${scorerHtml}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:.72rem;">
            <div style="background:#fffaf0;border-radius:8px;padding:8px;border:1px solid ${winHex}44;">
                <div style="color:${winHex};font-weight:700;margin-bottom:4px;">✅ ${winName} rămâne</div>
                ${winnerPlayers.map(p=>`<div style="color:#7d6849;">${p.name}</div>`).join('')}
            </div>
            <div style="background:#fffaf0;border-radius:8px;padding:8px;border:1px solid ${loseHex}44;">
                <div style="color:${loseHex};font-weight:700;margin-bottom:4px;">↩ ${loseName} iese</div>
                ${loserPlayers.map(p=>`<div style="color:#7d6849;">${p.name}</div>`).join('')}
                ${benchPlayers.length?`<div style="color:${benchHex};font-size:.65rem;margin-top:4px;">Intră: ${benchName} (${benchPlayers.map(p=>p.name).join(', ')})</div>`:''}
            </div>
        </div>`;

    pendingRotation = { loserColor, reason };
    document.getElementById('rotConfirmOverlay').style.display = 'flex';
}

function cancelRotConfirm() {
    document.getElementById('rotConfirmOverlay').style.display = 'none';
    pendingRotation = null;
    // Restart round timer since we cancelled
    if (liveState?.three_team_mode && liveState?.timer_status === 'running') {
        scheduleRoundTimeout(liveState);
    }
}

async function doConfirmedRotation() {
    if (!pendingRotation) return;
    document.getElementById('rotConfirmOverlay').style.display = 'none';
    const { loserColor, reason } = pendingRotation;
    pendingRotation = null;
    await doRotation(loserColor, reason);
}

// ── Init ──────────────────────────────────────────────────────────
document.getElementById('dialogOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDialog();
});

async function init() {
    // Read match param from URL
    const urlParams = new URLSearchParams(window.location.search);
    const matchParam = urlParams.get('match') || urlParams.get('id');

    await loadPlayerCodes();
    tryAutoAuth();
    await loadAll();

    // If live_state has three_team_mode active (set from index Start Meci), apply 3-team UI
    if (liveState?.three_team_mode) {
        // Asigură color_map populat dacă lipsește (siguranță, evită identitate ambiguă)
        if (!liveState.color_map || Object.keys(liveState.color_map).length === 0) {
            await patchState({ color_map: { orange: 'teamA', green: 'teamB', bench: 'teamC' } });
        }
        const btn = document.getElementById('threeBtn');
        if (btn) { btn.style.background='rgba(124,77,255,.4)'; btn.style.color='#fff'; }
    }

    // Update URL/title with match ID
    if (matchParam) {
        document.title = 'Live · Arena FC';
        if (!window.location.search.includes('match=')) {
            window.history.replaceState({}, '', window.location.pathname + '?match=' + matchParam);
        }
    } else if (liveState?.match_started_at) {
        const pseudo = btoa(liveState.match_started_at).replace(/[^a-zA-Z0-9]/g,'').slice(0,10);
        window.history.replaceState({}, '', window.location.pathname + '?match=' + pseudo);
    }

    subscribe();
}
// Update URL when match starts
function updateMatchUrl(st) {
    if (st?.match_started_at && !window.location.search.includes('match=')) {
        const pseudo = btoa(st.match_started_at).replace(/[^a-zA-Z0-9]/g,'').slice(0,10);
        window.history.replaceState({}, '', window.location.pathname + '?match=' + pseudo);
    }
}
init();
</script>

<!-- ── Penalty Shootout Overlay ────────────────────────────────── -->
<div class="penalty-overlay" id="penaltyOverlay">
  <div class="penalty-box">
    <div class="penalty-hd">
      <div>
        <div class="penalty-hd-title">⚽ Penaltyuri</div>
        <div class="penalty-hd-sub" id="penSubtitle">Selecție lovitori</div>
      </div>
      <button onclick="closePenalty()" style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#3a2f1f;width:28px;height:28px;border-radius:8px;cursor:pointer;font-size:.85rem;">✕</button>
    </div>
    <div id="penaltyContent"></div>
  </div>
</div>


<!-- Rotation Confirm Overlay -->
<div id="rotConfirmOverlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:350;align-items:center;justify-content:center;padding:16px;">
  <div style="background:#fff8ed;width:100%;max-width:520px;border-radius:16px;border:1px solid #7c4dff;padding:0;max-height:88vh;max-height:88dvh;overflow-y:auto;">
    <div style="background:linear-gradient(135deg,#ede3fa,#8e3a9e);padding:14px 18px;border-radius:16px 16px 0 0;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:1.2rem;letter-spacing:2px;color:#3a2f1f;" id="rotConfirmTitle">🔄 Schimb Echipă?</div>
      <div style="font-size:.72rem;color:rgba(255,255,255,.5);margin-top:2px;" id="rotConfirmSub"></div>
    </div>
    <div style="padding:14px 18px;" id="rotConfirmBody"></div>
    <div style="display:flex;gap:8px;padding:0 18px 18px;">
      <button onclick="cancelRotConfirm()" style="flex:1;padding:13px;border-radius:9px;background:#fdf3df;border:1px solid #dcc89a;color:#7d6849;cursor:pointer;font-size:.85rem;touch-action:manipulation;">✕ Nu acum</button>
      <button onclick="doConfirmedRotation()" id="rotConfirmBtn" style="flex:2;padding:13px;border-radius:9px;font-family:'Bebas Neue',sans-serif;font-size:.95rem;letter-spacing:2px;cursor:pointer;background:linear-gradient(135deg,#1a0050,#7c4dff);border:1px solid #7c4dff;color:#3a2f1f;touch-action:manipulation;">🔄 Confirmă Schimbul</button>
    </div>
  </div>
</div>

<!-- Round Detail Modal -->
<div class="round-detail-overlay" id="roundDetailOverlay" onclick="if(event.target===this)closeRoundDetail()">
  <div class="round-detail-box">
    <div class="rd-hd">
      <div class="rd-hd-left">
        <div class="rd-title" id="rdTitle">Tur 1</div>
        <div class="rd-sub" id="rdSub"></div>
      </div>
      <button class="rd-close" onclick="closeRoundDetail()">✕</button>
    </div>
    <div class="rd-score-row">
      <div class="rd-team">
        <div class="rd-team-lbl" id="rdTeamA">teamA</div>
        <div class="rd-team-score" id="rdScoreA" style="color:var(--o)">0</div>
      </div>
      <div class="rd-vs">:</div>
      <div class="rd-team">
        <div class="rd-team-lbl" id="rdTeamB">teamB</div>
        <div class="rd-team-score" id="rdScoreB" style="color:var(--g)">0</div>
      </div>
    </div>
    <div class="rd-body">
      <div>
        <div class="rd-section">Jucători</div>
        <div class="rd-players">
          <div class="rd-pl-col">
            <div class="rd-pl-col-hd" style="color:var(--o)" id="rdOHd">Portocaliu</div>
            <div id="rdOPlayers"></div>
          </div>
          <div class="rd-pl-col">
            <div class="rd-pl-col-hd" style="color:var(--g)" id="rdGHd">Verde</div>
            <div id="rdGPlayers"></div>
          </div>
        </div>
      </div>
      <div>
        <div class="rd-section">Goluri marcate</div>
        <div id="rdScorers"></div>
      </div>
      <div id="rdPenaltySection" style="display:none;">
        <div class="rd-section">🥅 Execuții penalty</div>
        <div id="rdPenaltyShots"></div>
      </div>
      <div class="rd-meta-row">
        <div class="rd-meta-chip">
          <div class="rd-meta-val" id="rdDur">—</div>
          <div class="rd-meta-lbl">Durată</div>
        </div>
        <div class="rd-meta-chip">
          <div class="rd-meta-val" id="rdEnd">—</div>
          <div class="rd-meta-lbl">Motiv schimb</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Reset Confirm Modal -->
<div class="reset-overlay" id="resetOverlay">
  <div class="reset-box">
    <div class="reset-title">↺ Reset Meci</div>
    <div class="reset-sub">Ești sigur? Se vor șterge toate golurile, turele și cronometrul.</div>
    <div class="reset-actions">
      <button class="reset-cancel" onclick="document.getElementById('resetOverlay').classList.remove('show')">Anulează</button>
      <button class="reset-confirm" onclick="doReset()">✓ Resetează</button>
    </div>
  </div>
</div>
<!-- Result Share Modal -->
<div class="result-overlay" id="resultOverlay">
  <div class="result-box">
    <div class="result-title" id="resultTitle">🏆 Meci Finalizat</div>
    <div class="result-preview" id="resultPreview"></div>
    <div class="result-actions">
      <button class="result-close" onclick="document.getElementById('resultOverlay').classList.remove('show')">Închide</button>
      <button class="result-copy" onclick="copyResultShareText()">📋 Copiază pt. WhatsApp</button>
    </div>
  </div>
</div>
<!-- Transfer Modal -->
<div class="dialog-overlay" id="transferOverlay" onclick="if(event.target===this)closeTransfer()">
  <div class="dialog-box" style="max-width:380px;">
    <div class="dialog-title" style="font-size:1rem;">⇄ Transfer Jucător</div>
    <div id="transferBody"></div>
    <div class="dialog-actions" style="margin-top:12px;">
      <button class="dia-cancel" onclick="closeTransfer()">✕ Anulează</button>
      <button class="dia-confirm" id="transferConfirmBtn" onclick="confirmTransfer()" disabled>✓ Transferă</button>
    </div>
  </div>
</div>

<div class="rotation-toast" id="rotationToast"></div>
<!-- Code Auth Modal -->
<div class="code-auth-overlay" id="codeAuthOverlay" onclick="if(event.target===this)closeCodeAuth()">
  <div class="code-auth-box">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:2px;color:#3a2f1f;margin-bottom:4px;">🔑 Cod Jucător</div>
    <div style="font-size:.65rem;color:#6b5840;margin-bottom:14px;">Introdu codul tău secret pentru a te identifica</div>
    <input id="codeAuthInput" type="text" maxlength="10" placeholder="Cod secret..."
      style="width:100%;background:#fffaf0;border:1px solid #3d5afe;color:#3a2f1f;border-radius:9px;padding:11px 14px;font-size:1.2rem;font-family:'Rajdhani',sans-serif;font-weight:700;outline:none;text-transform:uppercase;letter-spacing:3px;margin-bottom:6px;"
      oninput="this.value=this.value.toUpperCase();document.getElementById('codeAuthErr').textContent=''"
      onkeydown="if(event.key==='Enter')submitCode()">
    <div id="codeAuthErr" style="font-size:.68rem;color:#b71c1c;min-height:16px;margin-bottom:10px;"></div>
    <div style="display:flex;gap:8px;">
      <button onclick="closeCodeAuth()" style="flex:1;padding:11px;border-radius:9px;background:#fdf3df;border:1px solid #dcc89a;color:#7d6849;cursor:pointer;">Anulează</button>
      <button onclick="submitCode()" style="flex:2;padding:11px;border-radius:9px;font-family:'Bebas Neue',sans-serif;font-size:.95rem;letter-spacing:2px;cursor:pointer;background:linear-gradient(135deg,#1a2a4a,#3d5afe);border:1px solid #3d5afe;color:#3a2f1f;">✓ Autentifică</button>
    </div>
  </div>
</div>

<!-- Ultima Faza Modal -->
<div class="uf-overlay" id="ufOverlay">
  <div class="uf-box">
    <div class="uf-hd">
      <div class="uf-title">⏱ ULTIMA FAZĂ</div>
      <div class="uf-sub">Timpul s-a scurs — ce s-a întâmplat?</div>
    </div>
    <div class="uf-score" id="ufScore">0 : 0</div>
    <div class="uf-actions">
      <button class="uf-btn-penalty" id="ufBtnTeamO" style="border:1px solid #7d6849;background:#fffaf0;color:#7d6849;">⚽ Gol Echipa 1</button>
      <button class="uf-btn-penalty" id="ufBtnTeamG" style="border:1px solid #7d6849;background:#fffaf0;color:#7d6849;">⚽ Gol Echipa 2</button>
      <button class="uf-btn-penalty" id="ufBtnPenalty" style="border:1px solid #c9920a33;color:#8a6307;background:#fbe9c8;">🥅 Merg la Penaltyuri</button>
      <div id="ufBtnConfirmWrap">
        <button class="uf-btn-confirm" id="ufBtnConfirm">✕ Echipa înfrântă iese</button>
      </div>
    </div>
  </div>
</div>

<!-- ULTIMA FAZĂ: Player Scorer Picker -->
<div class="add-temp-overlay" id="ufScorerOverlay" onclick="if(event.target===this)closeUfScorerPicker()">
  <div class="add-temp-box">
    <div class="add-temp-hd">
      <div>
        <div id="ufScorerTitle" style="font-family:'Bebas Neue',sans-serif;font-size:1.05rem;letter-spacing:1.5px;">Cine a marcat?</div>
        <div style="font-size:.6rem;color:#6b5840;margin-top:2px;">După confirmare, echipa de pe bancă intră automat</div>
      </div>
      <button onclick="closeUfScorerPicker()" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:#7d6849;width:28px;height:28px;border-radius:7px;cursor:pointer;flex-shrink:0;">✕</button>
    </div>
    <div class="add-temp-body" id="ufScorerList"></div>
  </div>
</div>

<!-- Goal Confirm Modal -->
<div class="dialog-overlay" id="goalConfirmOverlay" onclick="if(event.target===this)cancelGoalConfirm()">
  <div class="dialog-box" style="max-width:320px;text-align:center;">
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px;">
      <div id="gcDot" style="width:12px;height:12px;border-radius:50%;flex-shrink:0;"></div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:1.2rem;letter-spacing:2px;color:#3a2f1f;">GOL!</div>
    </div>
    <div style="font-size:1rem;font-weight:700;color:#3a2f1f;margin-bottom:3px;" id="gcName">—</div>
    <div style="font-size:.75rem;margin-bottom:16px;" id="gcTeam">—</div>
    <div class="dialog-actions">
      <button class="dia-cancel" onclick="cancelGoalConfirm()">✕ Anulează</button>
      <button class="dia-confirm" onclick="doConfirmGoal()">✅ Confirmă Golul</button>
    </div>
  </div>
</div>

<div class="add-temp-overlay" id="addTempOverlay" onclick="if(event.target===this)closeAddTemp()">
  <div class="add-temp-box">
    <div class="add-temp-hd">
      <div>
        <div class="add-temp-title" id="addTempTitle" style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:2px;">+ Adaugă jucător temporar</div>
        <div style="font-size:.62rem;color:#6b5840;margin-top:2px;">Jucătorul va fi copiat temporar în acest meci · golurile se vor salva</div>
      </div>
      <button onclick="closeAddTemp()" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:#7d6849;width:28px;height:28px;border-radius:7px;cursor:pointer;flex-shrink:0;">✕</button>
    </div>
    <div class="add-temp-body" id="addTempBody"></div>
  </div>
</div>

</body>
</html>
