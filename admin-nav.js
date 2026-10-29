/* Admin side menu shared by every admin page.
   Usage: <script src="admin-nav.js" data-active="dashboard"></script> at the end of <body>.
   Desktop (>=1024px): fixed glass sidebar on the left. Phone: ☰ button in the header opens a drawer. */
(function(){
  var me=document.currentScript, active=(me&&me.getAttribute('data-active'))||'dashboard';
  var I={
    home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    chart:'<path d="M3 3v18h18"/><path d="M7 16v-4M12 16V8M17 16v-7"/>',
    cal:'<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    teacher:'<circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/>',
    pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    users:'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>',
    qr:'<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="4" height="4"/><rect x="13" y="13" width="4" height="4"/>',
    ticket:'<path d="M3 9a3 3 0 0 0 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a3 3 0 0 0 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z"/><path d="M13 5v14"/>',
    cash:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
    tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    mega:'<path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1Z"/><path d="M16 9a4 4 0 0 1 0 6"/>',
    video:'<rect x="2" y="5" width="15" height="14" rx="2"/><path d="m17 10 5-3v10l-5-3"/>',
    bag:'<path d="M6 7h12l1 14H5z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
    gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>'
  };
  /* [id, icon, en, zh, href or null (= coming soon)] grouped by section */
  var MENU=[
    {en:'Overview',zh:'总览',items:[['dashboard','home','Dashboard','管理首页','admin.html'],['report','chart','Workshop report','活动报告','events.html']]},
    {en:'Classes',zh:'课程',items:[['classes','cal','Classes & timetable','课程与课表','classes.html'],['teachers','teacher','Teachers','老师','./#teachers'],['venues','pin','Venues & areas','场地与地区',null]]},
    {en:'Students',zh:'学生',items:[['students','users','Students','学生','students.html'],['checkin','qr','Check-in & attendance','签到与出席','event.html'],['packages','ticket','Packages & credits','配套与 Credit',null]]},
    {en:'Money',zh:'财务',items:[['payments','cash','Payments','付款记录',null],['pricing','tag','Pricing','收费方案',null]]},
    {en:'Community',zh:'活动与社群',items:[['events','star','Events & workshops','活动与体验日','event.html'],['announce','mega','Announcements','公告',null],['media','video','Videos & photos','影片与照片',null],['shop','bag','Shop','商店','products.html']]},
    {en:'System',zh:'系统',items:[['settings','gear','Settings','设置',null],['site','globe','View public site','查看公开网站','./']]}
  ];
  var css=''+
  '.anav{position:fixed;top:0;bottom:0;left:0;width:256px;z-index:60;padding:16px 12px calc(16px + env(safe-area-inset-bottom,0px));overflow-y:auto;border-radius:0 24px 24px 0;transform:translateX(-105%);transition:transform .25s ease}'+
  '.anav.open{transform:none}'+
  '.anav .brandrow{display:flex;align-items:center;gap:10px;padding:4px 8px 14px}'+
  '.anav .brandrow img{width:40px;height:40px;border-radius:13px;object-fit:cover}'+
  '.anav .brandrow b{display:block;font-size:15px;font-weight:800;line-height:1.2}'+
  '.anav .brandrow small{display:block;font-size:12px;color:var(--muted);font-weight:600}'+
  '.anav h4{margin:14px 10px 4px;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:var(--muted);font-weight:800}'+
  '.anav a,.anav button.it{display:flex;align-items:center;gap:11px;width:100%;border:0;background:transparent;text-align:left;text-decoration:none;font:inherit;font-size:14px;font-weight:700;color:var(--ink);padding:10px 10px;border-radius:13px;cursor:pointer}'+
  '.anav a svg,.anav button.it svg{width:19px;height:19px;flex-shrink:0;color:#7C6FA0}'+
  '.anav a:hover,.anav button.it:hover{background:rgba(166,60,240,.07)}'+
  '.anav .on{background:linear-gradient(90deg,rgba(255,79,139,.16),rgba(166,60,240,.10))!important;color:#C02F7A}'+
  '.anav .on svg{color:#C02F7A}'+
  '.anav .soon{margin-left:auto;font-size:10.5px;font-weight:800;color:var(--muted);background:rgba(107,102,136,.1);border-radius:999px;padding:2px 7px}'+
  '.anav-back{position:fixed;inset:0;z-index:55;background:rgba(30,27,75,.28)}'+
  '.anav-btn{width:44px;height:44px;display:grid;place-items:center;flex-shrink:0;border:1.3px solid transparent}'+
  '.anav-btn svg{width:21px;height:21px}'+
  '.anav-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%);background:var(--ink);color:#fff;padding:10px 16px;border-radius:999px;font-weight:700;font-size:14px;z-index:70}'+
  '@media (min-width:1024px){.anav{transform:none;border-radius:0 24px 24px 0}.anav-back,.anav-btn{display:none!important}body{padding-left:256px}}';
  var s=document.createElement('style'); s.textContent=css; document.head.appendChild(s);

  function lang(){ try{ return localStorage.getItem('kld_lang')==='zh'?'zh':'en'; }catch(e){ return 'en'; } }
  var nav=document.createElement('nav'); nav.className='anav glass'; nav.setAttribute('aria-label','Admin menu');
  var back=document.createElement('div'); back.className='anav-back'; back.hidden=true;
  var toast=document.createElement('div'); toast.className='anav-toast'; toast.hidden=true;
  document.body.appendChild(back); document.body.appendChild(nav); document.body.appendChild(toast);

  function svg(name){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+I[name]+'</svg>'; }
  var tt;
  function soon(){ toast.textContent=lang()==='zh'?'即将推出':'Coming soon'; toast.hidden=false; clearTimeout(tt); tt=setTimeout(function(){ toast.hidden=true; },1600); }
  function render(){
    var L=lang(), h='<div class="brandrow"><img src="app-logo.png" alt=""><div><b>KickickLineDance</b><small>'+(L==='zh'?'管理后台':'Admin')+'</small></div></div>';
    MENU.forEach(function(sec){
      h+='<h4>'+sec[L]+'</h4>';
      sec.items.forEach(function(it){
        var label=L==='zh'?it[3]:it[2], on=it[0]===active?' class="on" aria-current="page"':'';
        if(it[4]) h+='<a href="'+it[4]+'"'+on+'>'+svg(it[1])+'<span>'+label+'</span></a>';
        else h+='<button type="button" class="it" data-soon>'+svg(it[1])+'<span>'+label+'</span><span class="soon">'+(L==='zh'?'即将':'Soon')+'</span></button>';
      });
    });
    nav.innerHTML=h;
    nav.querySelectorAll('[data-soon]').forEach(function(b){ b.addEventListener('click',soon); });
  }
  function open(v){ nav.classList.toggle('open',v); back.hidden=!v; if(btn) btn.setAttribute('aria-expanded',v); }
  back.addEventListener('click',function(){ open(false); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') open(false); });

  /* ☰ button at the start of the page header (phones/tablets) */
  var hdr=document.querySelector('header'), btn=null;
  if(hdr){
    btn=document.createElement('button'); btn.type='button'; btn.className='anav-btn glass-pill'; btn.setAttribute('aria-label','Menu'); btn.setAttribute('aria-expanded','false');
    btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    btn.addEventListener('click',function(){ open(!nav.classList.contains('open')); });
    hdr.insertBefore(btn,hdr.firstChild);
  }
  render();
  /* follow the page's EN / 中文 switch */
  document.querySelectorAll('[data-lang]').forEach(function(b){ b.addEventListener('click',function(){ setTimeout(render,0); }); });
})();
