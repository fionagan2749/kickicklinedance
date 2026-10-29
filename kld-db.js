/* KickickLineDance data layer shared by the admin data pages.
   Needs supabase-js (UMD) loaded first. Gives: KLD.sb (database client), sign-in gate for admins,
   EN/中文 switch (same localStorage key as the rest of the site), and small helpers. */
(function(){
  var URL='https://ouhvglgfekdiejnjqxbc.supabase.co';
  /* public (publishable) key: safe in the browser, every table is locked by row-level security */
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91aHZnbGdmZWtkaWVqbmpxeGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyODM4NzEsImV4cCI6MjEwODg1OTg3MX0.reiTSKw9DkvY_RWAaUmoae-RBruF8_wW7oz64LPgm6Q';
  var sb = window.KLD_MOCK ? window.KLD_MOCK : window.supabase.createClient(URL, KEY);

  var lang='en', langFns=[];
  try{ if(localStorage.getItem('kld_lang')==='zh') lang='zh'; }catch(e){}
  function setLang(l){
    lang=l; try{ localStorage.setItem('kld_lang',l); }catch(e){}
    document.documentElement.lang = l==='zh'?'zh-Hans':'en';
    document.querySelectorAll('[data-lang]').forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.lang===l); });
    langFns.forEach(function(f){ f(l); });
  }
  /* fill every [data-t] / [data-ph] from a {key:[en,zh]} dictionary */
  function apply(dict){
    document.querySelectorAll('[data-t]').forEach(function(el){ var v=dict[el.dataset.t]; if(v) el.textContent=v[lang==='zh'?1:0]; });
    document.querySelectorAll('[data-ph]').forEach(function(el){ var v=dict[el.dataset.ph]; if(v) el.placeholder=v[lang==='zh'?1:0]; });
  }

  var toastEl, tt;
  function toast(msg){
    if(!toastEl){ toastEl=document.createElement('div'); toastEl.className='toast'; toastEl.setAttribute('role','status'); document.body.appendChild(toastEl); }
    toastEl.textContent=msg; toastEl.hidden=false; clearTimeout(tt); tt=setTimeout(function(){ toastEl.hidden=true; },2200);
  }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  /* phone as stored: digits only, Malaysian 0xx -> 60xx */
  function normPhone(p){ var d=String(p||'').replace(/\D/g,''); if(!d) return null; if(d[0]==='0') d='6'+d; return d; }
  /* 60123456789 -> 012-345 6789 */
  function showPhone(p){ if(!p) return ''; var d=p.replace(/^6(?=0)/,''); return d.length>=10 ? d.slice(0,3)+'-'+d.slice(3,d.length-4)+' '+d.slice(-4) : d; }
  function wa(p,text){ return 'https://wa.me/'+p+(text?'?text='+encodeURIComponent(text):''); }
  function initials(n){ n=String(n||'?').replace(/\(.*?\)/g,'').trim(); var cjk=n.match(/[一-鿿]/); if(cjk) return cjk[0]; var w=n.split(/\s+/); return ((w[0]||'?')[0]+((w[1]||'')[0]||'')).toUpperCase(); }
  function fmtDate(d){ if(!d) return ''; var x=new Date(d+'T00:00:00'); return x.toLocaleDateString(lang==='zh'?'zh-CN':'en-MY',{day:'numeric',month:'short',year:'numeric'}); }

  var I={
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    x:'<path d="M18 6 6 18M6 6l12 12"/>',
    wa:'<path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 9.5c.3 1.8 1.7 3.6 3.6 4.4l1.2-1.1 2 .9c-.2 1-1 1.8-2 1.8A6 6 0 0 1 8 9.7c0-1 .8-1.8 1.8-2l.9 2z"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    up:'<path d="m18 15-6-6-6 6"/>', down:'<path d="m6 9 6 6 6-6"/>',
    trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
    check:'<path d="M20 6 9 17l-5-5"/>',
    dl:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    back:'<path d="M15 18l-6-6 6-6"/>',
    merge:'<path d="M6 3v6a6 6 0 0 0 6 6h6M15 12l3 3-3 3"/><path d="M6 21v-6"/>'
  };
  function icon(n){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(I[n]||'')+'</svg>'; }

  /* ---- admin sign-in gate (email link; only emails on the admins list see any data) ---- */
  var G={
    title:['Admin sign in','管理员登录'],
    sub:['Enter your email. We send you a sign-in link.','输入电邮，我们会寄登录链接给你。'],
    email:['Your email','你的电邮'],
    send:['Email me the link','寄登录链接'],
    sent:['Check your email and tap the link. You can close this page.','请到电邮点击登录链接。这页可以关掉。'],
    notadmin:['This email is not on the admin list yet. Ask Fiona to add it.','这个电邮还不是管理员，请 Fiona 加入。'],
    signout:['Sign out','登出'],
    other:['Use another email','换电邮'],
    fail:['Could not send. Try again in a minute.','寄不出，请一分钟后再试。']
  };
  function gT(k){ return G[k][lang==='zh'?1:0]; }
  function gate(onReady){
    var g=document.createElement('div'); g.className='gate'; document.body.appendChild(g);
    var state='checking', email='';
    function draw(){
      if(state==='checking'){ g.innerHTML=''; return; }
      var h='<div class="card glass"><img src="app-logo.png" alt=""><h1>'+gT('title')+'</h1>';
      if(state==='form') h+='<p>'+gT('sub')+'</p><form id="gf" style="display:flex;flex-direction:column;gap:10px"><label class="field" style="text-align:left"><span>'+gT('email')+'</span><input class="inp" type="email" id="ge" required autocomplete="email" value="'+esc(email)+'"></label><button class="btn cta" style="justify-content:center">'+gT('send')+'</button></form>';
      if(state==='sent') h+='<p>'+gT('sent')+'</p><button class="btn ghost" id="go" type="button" style="justify-content:center">'+gT('other')+'</button>';
      if(state==='notadmin') h+='<p><b>'+esc(email)+'</b></p><p>'+gT('notadmin')+'</p><button class="btn soft" id="gs" type="button" style="justify-content:center">'+gT('signout')+'</button>';
      g.innerHTML=h+'</div>';
      var f=g.querySelector('#gf');
      if(f) f.addEventListener('submit',function(e){
        e.preventDefault(); email=g.querySelector('#ge').value.trim().toLowerCase();
        var b=f.querySelector('button'); b.disabled=true;
        sb.auth.signInWithOtp({email:email,options:{emailRedirectTo:location.href.split('#')[0],shouldCreateUser:true}}).then(function(r){
          if(r.error){ b.disabled=false; toast(gT('fail')); return; }
          state='sent'; draw();
        });
      });
      var o=g.querySelector('#go'); if(o) o.addEventListener('click',function(){ state='form'; draw(); });
      var s=g.querySelector('#gs'); if(s) s.addEventListener('click',function(){ sb.auth.signOut().then(function(){ state='form'; draw(); }); });
    }
    langFns.push(draw);
    var started=false;
    function check(session){
      if(!session){ state='form'; draw(); return; }
      email=session.user.email||'';
      sb.rpc('is_admin').then(function(r){
        if(r.data===true){ g.remove(); signedIn(email); if(!started){ started=true; onReady(); } }
        else { state='notadmin'; draw(); }
      });
    }
    sb.auth.getSession().then(function(r){ check(r.data.session); });
    sb.auth.onAuthStateChange(function(ev,session){ if(ev==='SIGNED_IN') check(session); if(ev==='SIGNED_OUT') location.reload(); });
  }
  /* small "signed in as … · Sign out" pill under the header */
  function signedIn(email){
    var slot=document.getElementById('me'); if(!slot) return;
    slot.innerHTML='<button class="who-pill" type="button" id="so">'+esc(email)+' · <span>'+gT('signout')+'</span></button>';
    slot.querySelector('#so').addEventListener('click',function(){ sb.auth.signOut(); });
  }

  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('[data-lang]').forEach(function(b){ b.addEventListener('click',function(){ setLang(b.dataset.lang); }); });
    setLang(lang);
  });

  window.KLD={sb:sb, lang:function(){ return lang; }, onLang:function(f){ langFns.push(f); }, apply:apply, toast:toast, esc:esc,
    normPhone:normPhone, showPhone:showPhone, wa:wa, initials:initials, fmtDate:fmtDate, icon:icon, gate:gate,
    pick:function(en,zh){ return lang==='zh'&&zh?zh:en; }};
})();
