import "./index.css";
/* Café Ros – v2 Full Rewrite */

// ── Types ──────────────────────────────────────
interface MI{id:number;name:string;nameEn:string;price:number;category:string;image:string;description:string;available:boolean}
interface TI{id:number;number:number;capacity:number;status:string;floor:string;name:string}
interface SI{id:number;name:string;role:string;phone:string;avatar:string;tips:number;leaveDays:number;leaveUsed:number}
interface CI{item:MI;qty:number}
interface OI{id:number;items:CI[];total:number;customerName:string;phone:string;type:string;tableNumber?:number;address?:string;status:string;createdAt:string}
interface II{id:number;name:string;quantity:number;unit:string;minStock:number;lastRestocked:string;cost:number}
interface NI{id:number;msg:string;type:string;time:string}
interface CU{id:number;name:string;phone:string;orders:number;totalSpent:number;joinDate:string;note:string}
const IM={espresso:'/images/espresso.jpg',cappuccino:'/images/cappuccino.jpg',latte:'/images/latte.jpg',mocha:'/images/mocha.jpg',cheesecake:'/images/cheesecake.jpg',tiramisu:'/images/tiramisu.jpg',croissant:'/images/croissant.jpg',hero:'/images/hero-bg.jpg',interior:'/images/interior.jpg',terrace:'/images/terrace.jpg'};

// ── Helpers ────────────────────────────────────
function ld<T>(k:string,d:T):T{try{const s=localStorage.getItem('cr_'+k);return s?JSON.parse(s):d}catch{return d}}
function sv(k:string,v:unknown){try{localStorage.setItem('cr_'+k,JSON.stringify(v))}catch{}}
function fp(p:number):string{return p.toLocaleString('fa-IR')+' تومان'}
function ni(a:{id:number}[]):number{return a.length?Math.max(...a.map(x=>x.id))+1:1}
function nt():string{const d=new Date();return`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`}
function esc(s:string):string{const d=document.createElement('div');d.textContent=s;return d.innerHTML}
function el(id:string):HTMLInputElement{return document.getElementById(id) as HTMLInputElement}
function val(id:string):string{return el(id)?.value||''}
function nval(id:string):number{return parseInt(el(id)?.value)||0}
function cfg(){return ld('cafeConfig',{name:'کافه رس',nameEn:'Café Ros',phone:'',address:'',heroTitle:'کافه رس',heroSub:'',heroDesc:''})}
function ctc(){return ld('contactInfo',{phone:'',mobile:'',address:'',email:'',hours:'',instagram:'',telegram:''})}

// ── Window global ──────────────────────────────
const W=window as any;
W.W=window; // so onclick="W.xxx()" works in HTML

// ── State ──────────────────────────────────────
let menu:MI[]=ld('menu',[]),tables:TI[]=ld('tables',[]),staff:SI[]=ld('staff',[]),inv:II[]=ld('inv',[]);
let orders:OI[]=ld('orders',[]),archive:OI[]=ld('archive',[]),notifs:NI[]=ld('notifs',[]),cust:CU[]=ld('cust',[]);
let cart:CI[]=[],pg='home',logIn=false,adm=false,mob=false,admS='dashboard';
let lnMod=false,adMod=false,pyMod=false,editId=0,editTp='';
const py={oid:0,amt:0,m:''};
const dlvFee=()=>ld('deliveryFee',25000) as number;

function addN(m:string,t:string){notifs=[{id:Date.now(),msg:m,type:t,time:nt()},...notifs.slice(0,29)];sv('notifs',notifs)}
function nav(p:string){pg=p;lnMod=adMod=pyMod=false;mob=false;window.scrollTo({top:0,behavior:'smooth'});R()}
function addCart(it:MI){const e=cart.find(c=>c.item.id===it.id);if(e)e.qty++;else cart.push({item:it,qty:1});R()}
function remC(id:number){const e=cart.find(c=>c.item.id===id);if(e&&e.qty>1)e.qty--;else cart=cart.filter(c=>c.item.id!==id);R()}
function cTot():number{return cart.reduce((s,c)=>s+c.item.price*c.qty,0)}
function cCnt():number{return cart.reduce((s,c)=>s+c.qty,0)}
// Add/update customer
function upsertCust(name:string,phone:string,amount:number){
  let c=cust.find(x=>x.phone===phone);
  if(c){c.orders++;c.totalSpent+=amount;c.name=name}
  else{cust.push({id:ni(cust),name,phone,orders:1,totalSpent:amount,joinDate:new Date().toLocaleDateString('fa-IR'),note:''})}
  sv('cust',cust);
}

// ── Render Engine ──────────────────────────────
function R(){
  const root=document.getElementById('root')!;
  let h=rNav();
  switch(pg){
    case'home':h+=rHome();break;case'menu':h+=rMenu();break;case'contact':h+=rContact();break;
    case'profile':h+=logIn?rProfile():rHome();break;case'admin':h+=adm?rAdmin():'';break;default:h+=rHome();
  }
  h+=rFooter();
  if(lnMod)h+=rLoginMod();if(adMod)h+=rAdmMod();if(pyMod)h+=rPayMod();if(W._co)h+=rCart();
  root.innerHTML=h;
  window.onscroll=()=>{const n=document.getElementById('mainNav');if(n){n.classList.toggle('nav-scrolled',window.scrollY>50)}};
}

// ── Navbar ─────────────────────────────────────
function rNav():string{
  const c=cfg();
  return`<nav class="nav" id="mainNav"><div class="nav-inner">
    <div class="nav-logo" onclick="W._nav('home')"><div class="nav-logo-icon">☕</div><div><div class="nav-logo-title">${esc(c.name)}</div><div class="nav-logo-sub">${esc(c.nameEn)}</div></div></div>
    <div class="nav-links">${['home','menu','contact'].map(p=>`<button class="nav-link ${pg===p?'nav-link-active':''}" onclick="W._nav('${p}')">${p==='home'?'خانه':p==='menu'?'منوی کافه':'ارتباط با ما'}</button>`).join('')}</div>
    <div class="nav-actions">
      <button class="nav-cart-btn" onclick="W._openCart()">🛒${cCnt()>0?`<span class="cart-badge">${cCnt()}</span>`:''}</button>
      <button class="nav-admin-btn" onclick="W._admClick()">🔐</button>
      ${logIn?`<button class="nav-btn-primary" onclick="W._nav('profile')">👤</button>`:`<button class="nav-btn-primary" onclick="W._showLn()">ورود</button>`}
    </div>
    <button class="nav-mob-btn ${mob?'mob-open':''}" onclick="W._togMob()"><i class="hb"><b></b><b></b><b></b></i></button>
  </div><div class="nav-mob ${mob?'mob-show':''}">
    ${['home','menu','contact'].map(p=>`<button class="mob-link" onclick="W._nav('${p}')">${p==='home'?'🏠 خانه':p==='menu'?'☕ منو':'📞 تماس'}</button>`).join('')}
    <hr class="mob-hr"/><button class="mob-link" onclick="W._openCart()">🛒 سبد ${cCnt()>0?`(${cCnt()})`:''}</button>
    ${logIn?`<button class="mob-link mob-primary" onclick="W._nav('profile')">👤 پنل من</button>`:`<button class="mob-link mob-primary" onclick="W._showLn()">👤 ورود</button>`}
    <button class="mob-link" onclick="W._admClick()">🔐 مدیریت</button>
  </div></nav>`}

// ── Home ───────────────────────────────────────
function rHome():string{
  const c=cfg(),hi=ld('heroImg','')||IM.hero,ii=ld('intImg','')||IM.interior,ti=ld('terImg','')||IM.terrace;
  return`<section class="hero"><div class="hero-bg"><img src="${hi}" alt="" class="hero-bg-img"/><div class="hero-overlay"></div></div>
    <div class="hero-content animate-fadeInUp">
      <h1 class="hero-title">${esc(c.heroTitle||c.name)}</h1>
      ${c.heroSub?`<p class="hero-subtitle">${esc(c.heroSub)}</p>`:''}
      ${c.heroDesc?`<p class="hero-desc">${esc(c.heroDesc)}</p>`:''}
      <div class="hero-btns"><button class="btn-primary btn-lg" onclick="W._nav('menu')">مشاهده منو ☕</button><button class="btn-outline btn-lg" onclick="W._nav('contact')">تماس با ما 📞</button></div>
    </div><div class="hero-scroll">▼</div>
  </section>
  <section class="section bg-dark"><div class="container">
    <div class="section-header"><h2 class="section-title">درباره <span class="text-gold">ما</span></h2></div>
    <div class="features-grid">${[{i:'🏆',t:'کیفیت برتر',d:'مرغوب‌ترین مواد اولیه'},{i:'⏱',t:'همیشه تازه',d:'آماده‌سازی در لحظه'},{i:'❤️',t:'با عشق',d:'توسط تیم حرفه‌ای'},{i:'🌿',t:'ارگانیک',d:'مواد طبیعی'}].map(f=>`<div class="feature-card glass-card"><div class="feature-icon">${f.i}</div><h3 class="feature-title">${f.t}</h3><p class="feature-desc">${f.d}</p></div>`).join('')}</div>
    <div class="gallery-grid">
      <div class="gallery-item gallery-wide"><img src="${ii}" alt=""/><div class="gallery-overlay"><h3>فضای داخلی</h3></div></div>
      <div class="gallery-item"><img src="${ti}" alt=""/><div class="gallery-overlay"><h3>فضای بیرونی</h3></div></div>
    </div>
  </div></section>`}

// ── Menu ───────────────────────────────────────
function rMenu():string{
  const cats:string[]=ld('categories',['عمومی']),ac=W._mc||'همه',sr=W._ms||'';
  const fl=menu.filter(m=>m.available&&(ac==='همه'||m.category===ac)&&(!sr||m.name.includes(sr)||m.nameEn.toLowerCase().includes(sr.toLowerCase())));
  return`<section class="page-section"><div class="container">
    <div class="section-header"><h2 class="section-title">منوی <span class="text-gold">کافه</span></h2></div>
    <div class="menu-topbar"><div class="search-box"><input type="text" id="mSrch" placeholder="جستجو..." value="${esc(sr)}" oninput="W._msc(this.value)"/><span class="search-icon">🔍</span></div></div>
    <div class="cat-bar">${['همه',...cats].map(c=>`<button class="cat-btn ${ac===c?'cat-btn-active':''}" onclick="W._mc='${esc(c)}';W.R()">${esc(c)}</button>`).join('')}</div>
    <div class="menu-grid">${fl.length>0?fl.map(it=>{const ic=cart.find(c=>c.item.id===it.id);return`
      <div class="menu-card glass-card"><div class="menu-card-img"><img src="${it.image}" alt=""/><span class="menu-card-cat">${esc(it.category)}</span></div>
        <div class="menu-card-body"><div class="menu-card-header"><div><h3>${esc(it.name)}</h3><small>${esc(it.nameEn)}</small></div><span class="menu-card-price">${fp(it.price)}</span></div>
          <p class="menu-card-desc">${esc(it.description)}</p>
          ${ic?`<div class="qty-control"><button class="qty-btn" onclick="W._ac(${it.id})">+</button><span>${ic.qty}</span><button class="qty-btn qty-btn-minus" onclick="W._rc(${it.id})">−</button></div>`
            :`<button class="btn-primary btn-full" onclick="W._ac(${it.id})">+ افزودن</button>`}
        </div></div>`}).join(''):'<div class="empty-state">🍽️<p>هنوز آیتمی اضافه نشده</p></div>'}</div>
  </div></section>`}

// ── Cart ───────────────────────────────────────
function rCart():string{
  const co=W._cco,ok=W._cok;
  if(ok)return`<div class="sidebar-overlay" onclick="W._cc()"></div><div class="sidebar"><div class="sidebar-success"><div class="success-icon">✓</div><h3>سفارش ثبت شد! 🎉</h3><p>#${W._lid||''}</p><p class="text-coffee-400 text-sm mt-2">${fp(W._ltot||0)}</p><button class="btn-primary btn-full mt-6" onclick="W._cc()">بازگشت ☕</button></div></div>`;
  if(co){
    const ot=W._ot||'takeout',df=dlvFee(),tot=cTot()+(ot==='delivery'?df:0);
    return`<div class="sidebar-overlay"></div><div class="sidebar"><div class="sidebar-header"><h3>ثبت سفارش</h3><button onclick="W._cco=false;W.R()">✕</button></div><div class="sidebar-body">
      <div class="order-type-bar">${[{t:'dine-in',l:'🪑 سالن'},{t:'takeout',l:'🥡 بیرون‌بر'},{t:'delivery',l:'🛵 ارسال'}].map(x=>`<button class="ot-btn ${ot===x.t?'ot-active':''}" onclick="W._ot='${x.t}';W.R()">${x.l}</button>`).join('')}</div>
      ${ot==='dine-in'?'<div class="form-group"><label>شماره میز</label><input type="number" id="coTbl" min="1" max="99"/></div>':''}
      <div class="form-group"><label>نام *</label><input type="text" id="coName"/></div>
      ${ot!=='dine-in'?'<div class="form-group"><label>شماره تماس *</label><input type="tel" id="coPhone" dir="ltr"/></div>':''}
      ${ot==='delivery'?`<div class="form-group"><label>آدرس *</label><textarea id="coAddr" rows="2"></textarea></div><p class="text-coffee-500 text-xs mb-2">هزینه ارسال: ${fp(df)}</p>`:''}
      <div class="order-summary glass-card">${cart.map(c=>`<div class="summary-row"><span>${esc(c.item.name)}×${c.qty}</span><span>${fp(c.item.price*c.qty)}</span></div>`).join('')}
        <div class="summary-total"><span>مجموع:</span><span>${fp(tot)}</span></div></div>
      <button class="btn-primary btn-full btn-lg mt-4" onclick="W._subO()">ثبت سفارش ✓</button>
    </div></div>`}
  return`<div class="sidebar-overlay" onclick="W._cc()"></div><div class="sidebar"><div class="sidebar-header"><h3>🛒 سبد خرید</h3><button onclick="W._cc()">✕</button></div>
    <div class="sidebar-body">${cart.length===0?`<div class="empty-state">🛒<p>سبد خالی است</p><button class="btn-primary mt-4" onclick="W._cc();W._nav('menu')">رفتن به منو ☕</button></div>`
      :cart.map(c=>`<div class="cart-item"><img src="${c.item.image}" alt=""/><div class="cart-item-info"><strong>${esc(c.item.name)}</strong><small>${fp(c.item.price)}</small></div>
        <div class="qty-control-sm"><button onclick="W._ac(${c.item.id})">+</button><span>${c.qty}</span><button onclick="W._rc(${c.item.id})">−</button></div></div>`).join('')}</div>
    ${cart.length>0?`<div class="sidebar-footer"><div class="summary-total"><span>مجموع:</span><span>${fp(cTot())}</span></div><button class="btn-primary btn-full btn-lg" onclick="W._gco()">ادامه</button></div>`:''}</div>`}

// ── Contact ────────────────────────────────────
function rContact():string{
  const ci=ctc();
  return`<section class="page-section"><div class="container"><div class="section-header"><h2 class="section-title">ارتباط <span class="text-gold">با ما</span></h2></div>
    <div class="glass-card p-8 max-w-lg mx-auto"><div class="contact-info">
      ${ci.phone?`<div class="contact-row"><span class="contact-icon">📞</span><div><strong>تلفن</strong><p dir="ltr">${esc(ci.phone)}</p></div></div>`:''}
      ${ci.mobile?`<div class="contact-row"><span class="contact-icon">📱</span><div><strong>موبایل</strong><p dir="ltr">${esc(ci.mobile)}</p></div></div>`:''}
      ${ci.address?`<div class="contact-row"><span class="contact-icon">📍</span><div><strong>آدرس</strong><p>${esc(ci.address)}</p></div></div>`:''}
      ${ci.email?`<div class="contact-row"><span class="contact-icon">✉️</span><div><strong>ایمیل</strong><p dir="ltr">${esc(ci.email)}</p></div></div>`:''}
      ${ci.hours?`<div class="contact-row"><span class="contact-icon">⏰</span><div><strong>ساعات</strong><p>${esc(ci.hours)}</p></div></div>`:''}
      ${ci.instagram?`<div class="contact-row"><span class="contact-icon">📷</span><div><strong>اینستاگرام</strong><p dir="ltr">${esc(ci.instagram)}</p></div></div>`:''}
      ${ci.telegram?`<div class="contact-row"><span class="contact-icon">📨</span><div><strong>تلگرام</strong><p dir="ltr">${esc(ci.telegram)}</p></div></div>`:''}
      ${!ci.phone&&!ci.address?'<div class="empty-state">📭<p>اطلاعات تماس ثبت نشده</p></div>':''}
    </div></div></div></section>`}

// ── Profile ────────────────────────────────────
function rProfile():string{
  const un=ld('userName',''),up=ld('userPhone','');
  const myO=[...orders,...archive].filter(o=>o.customerName===un||o.phone===up);
  return`<section class="page-section"><div class="container">
    <div class="glass-card p-8 mb-8"><div class="profile-header"><div class="profile-avatar">👤</div><div class="profile-info"><h2 class="text-2xl font-bold text-white">${esc(un)}</h2><p class="text-coffee-400 text-sm" dir="ltr">${up}</p></div><button class="btn-danger" onclick="W._logout()">خروج</button></div></div>
    <div class="glass-card p-6"><h3 class="text-lg font-bold text-white mb-4">📦 سفارشات من</h3>
      ${myO.length>0?myO.map(o=>`<div class="glass-card p-4 mb-3"><div class="summary-row"><span>#${o.id}</span><span>${fp(o.total)}</span></div><div class="text-coffee-500 text-xs">${o.items.map(i=>esc(i.item.name)).join('، ')}</div></div>`).join(''):'<div class="empty-state">📭<p>سفارشی ندارید</p></div>'}
    </div></div></section>`}

// ── Admin ──────────────────────────────────────
function rAdmin():string{
  const ss=[{id:'dashboard',l:'📊 داشبورد'},{id:'orders',l:'📦 سفارشات'},{id:'menu',l:'📋 منو'},{id:'staff',l:'👥 پرسنل'},{id:'inventory',l:'🏪 انبار'},{id:'club',l:'💎 مشتریان'},{id:'finance',l:'💰 مالی'},{id:'admins',l:'🔑 ادمین‌ها'},{id:'devices',l:'🖨️ دستگاه‌ها'},{id:'settings',l:'⚙️ تنظیمات'}];
  return`<section class="admin-section"><div class="admin-layout">
    <aside class="admin-sidebar">${ss.map(s=>`<button class="admin-nav-btn ${admS===s.id?'admin-nav-active':''}" onclick="W._as('${s.id}')">${s.l}</button>`).join('')}</aside>
    <main class="admin-main">${rAdmC()}</main></div></section>`}

function rAdmC():string{
  switch(admS){
    case'orders':return rAOrders();case'menu':return rAMenu();case'staff':return rAStaff();
    case'inventory':return rAInv();case'club':return rAClub();case'finance':return rAFin();
    case'admins':return rAAdmins();case'devices':return rADev();case'settings':return rASet();
    default:return rADash();
  }
}

function rADash():string{
  return`<h2 class="admin-title">📊 داشبورد</h2>
    <div class="admin-stats">
      <div class="admin-stat-card bg-green-grad"><h3>${orders.length}</h3><p>سفارش فعال</p></div>
      <div class="admin-stat-card bg-blue-grad"><h3>${menu.length}</h3><p>آیتم منو</p></div>
      <div class="admin-stat-card bg-purple-grad"><h3>${cust.length}</h3><p>مشتری</p></div>
      <div class="admin-stat-card bg-amber-grad"><h3>${archive.length}</h3><p>آرشیو</p></div>
    </div>
    <div class="glass-card p-6 mt-6"><h3 class="text-lg font-bold text-white mb-4">🔔 فعالیت‌ها</h3>
      <div class="notif-list">${notifs.length>0?notifs.slice(0,15).map(n=>`<div class="notif-item"><span class="notif-time">${n.time}</span><span>${esc(n.msg)}</span></div>`).join(''):'<p class="text-coffee-500 text-center py-8">خالی</p>'}</div>
    </div>`}

// ── Admin Orders ───────────────────────────────
function rAOrders():string{
  const df=dlvFee();
  return`<h2 class="admin-title">📦 سفارشات</h2>
    <!-- Delivery Fee -->
    <div class="glass-card p-4 mb-4"><div class="flex gap-4 items-center"><label class="text-white text-sm">🛵 هزینه ارسال:</label><input type="number" id="dlvFee" value="${df}" style="width:120px"/><button class="btn-primary btn-sm" onclick="W._svDlv()">ذخیره</button><span class="text-coffee-500 text-xs">${fp(df)}</span></div></div>
    <!-- Active Orders -->
    ${orders.length>0?orders.map(o=>`<div class="glass-card p-5 mb-4">
      <div class="order-header"><span class="order-id">#${o.id}</span><span class="order-type">${o.type==='dine-in'?'🪑 میز '+o.tableNumber:o.type==='takeout'?'🥡 بیرون‌بر':'🛵 ارسال'}</span>
        <select class="order-status-select" onchange="W._cos(${o.id},this.value)">${['pending','preparing','ready','delivered','paid'].map(s=>`<option value="${s}" ${o.status===s?'selected':''}>${s==='pending'?'در انتظار':s==='preparing'?'آماده‌سازی':s==='ready'?'آماده':s==='delivered'?'تحویل':s==='paid'?'پرداخت شده':s}</option>`).join('')}</select></div>
      <div class="order-grid-info"><div class="order-info-box"><small>مشتری</small><strong>${esc(o.customerName)}</strong></div>${o.phone?`<div class="order-info-box"><small>تلفن</small><strong dir="ltr">${o.phone}</strong></div>`:''}<div class="order-info-box"><small>مبلغ</small><strong class="text-gold">${fp(o.total)}</strong></div></div>
      <div class="order-items mt-4">${o.items.map(i=>`<span class="order-item-tag">${esc(i.item.name)}×${i.qty}</span>`).join('')}</div>
    </div>`).join(''):'<div class="empty-state">📭<p>سفارش فعالی نیست</p></div>'}
    <!-- Tables -->
    <div class="glass-card p-6 mt-6"><div class="admin-header-row"><h3 class="text-lg font-bold text-white">🪑 میزها (${tables.length})</h3><button class="btn-primary btn-sm" onclick="W._tgF('atF')">+ افزودن</button></div>
      <div id="atF" style="display:none" class="edit-section p-4 mt-4 mb-4"><div class="form-grid">
        <div class="form-group"><label>نام میز</label><input type="text" id="atNm" placeholder="VIP 1"/></div>
        <div class="form-group"><label>ظرفیت</label><input type="number" id="atCp" value="4"/></div>
        <div class="form-group"><label>طبقه</label><select id="atFl"><option>طبقه همکف</option><option>طبقه اول</option><option>تراس</option></select></div>
      </div><button class="btn-primary btn-sm mt-4" onclick="W._addT()">ثبت</button></div>
      <div class="tables-admin-grid mt-4">${tables.map(t=>`<div class="table-admin-card ta-available"><div class="ta-number">${esc(t.name||'میز '+t.number)}</div><div class="ta-info">${t.capacity} نفره · ${t.floor}</div><button class="icon-btn text-xs mt-2" style="color:#f87171" onclick="W._delT(${t.id})">🗑️</button></div>`).join('')}</div>
    </div>
    <!-- Archive -->
    ${archive.length>0?`<div class="glass-card p-6 mt-6"><h3 class="text-lg font-bold text-white mb-4">📁 آرشیو (${archive.length})</h3>
      ${archive.slice(0,10).map(o=>`<div class="notif-item"><span class="notif-time">#${o.id}</span><span>${esc(o.customerName)} — ${fp(o.total)}</span></div>`).join('')}</div>`:''}`}

// ── Admin Menu (با ویرایش) ─────────────────────
function rAMenu():string{
  const cats:string[]=ld('categories',['عمومی']),eId=editTp==='menu'?editId:0;
  return`<div class="admin-header-row"><h2 class="admin-title">📋 منو</h2><div class="btn-group"><button class="btn-outline btn-sm" onclick="W._tgF('cmP')">📁 دسته‌ها</button><button class="btn-primary btn-sm" onclick="W._tgF('amF')">+ آیتم</button></div></div>
    <div id="cmP" style="display:none" class="glass-card p-6 mb-6"><div class="cat-mgr-list">${cats.map(c=>`<div class="cat-mgr-item"><span>${esc(c)}</span>${cats.length>1?`<button class="icon-btn text-sm" onclick="W._delCat('${esc(c)}')">🗑️</button>`:''}</div>`).join('')}</div>
      <div class="flex gap-2 mt-4"><input type="text" id="newCat" placeholder="دسته جدید" class="flex-1"/><button class="btn-primary btn-sm" onclick="W._addCat()">افزودن</button></div></div>
    <div id="amF" style="display:none" class="glass-card p-6 mb-6"><h4 class="text-white font-bold mb-3">آیتم جدید</h4>
      <div class="form-group"><label>📷 تصویر</label><div class="upload-box" onclick="el('amImg').click()"><div id="amPrv">آپلود</div></div><input type="file" id="amImg" accept="image/*" style="display:none" onchange="W._prvI('amImg','amPrv')"/></div>
      <div class="form-grid"><div class="form-group"><label>نام *</label><input type="text" id="amNm"/></div><div class="form-group"><label>En</label><input type="text" id="amEn" dir="ltr"/></div>
        <div class="form-group"><label>قیمت *</label><input type="number" id="amPr"/></div><div class="form-group"><label>دسته</label><select id="amCt">${cats.map(c=>`<option>${c}</option>`).join('')}</select></div>
        <div class="form-group col-span-2"><label>توضیح</label><input type="text" id="amDs"/></div></div>
      <button class="btn-primary btn-sm mt-4" onclick="W._addMI()">ذخیره</button></div>
    ${menu.map(m=>`<div class="glass-card p-4 mb-3 ${eId===m.id?'ring-edit':''}">
      ${eId===m.id?`<!-- Edit Mode --><div class="form-grid">
        <div class="form-group"><label>نام</label><input type="text" id="emNm" value="${esc(m.name)}"/></div>
        <div class="form-group"><label>En</label><input type="text" id="emEn" value="${esc(m.nameEn)}" dir="ltr"/></div>
        <div class="form-group"><label>قیمت</label><input type="number" id="emPr" value="${m.price}"/></div>
        <div class="form-group"><label>دسته</label><select id="emCt">${cats.map(c=>`<option ${m.category===c?'selected':''}>${c}</option>`).join('')}</select></div>
        <div class="form-group col-span-2"><label>توضیح</label><input type="text" id="emDs" value="${esc(m.description)}"/></div>
        </div><div class="btn-row mt-4"><button class="btn-primary btn-sm flex-1" onclick="W._svMI(${m.id})">💾 ذخیره</button><button class="btn-outline btn-sm flex-1" onclick="W._cedit()">انصراف</button></div>`
      :`<div class="flex gap-4 items-center"><img src="${m.image}" class="table-img"/><div class="flex-1"><strong class="text-white">${esc(m.name)}</strong> <small class="text-coffee-500">${esc(m.nameEn)}</small><br/><span class="text-coffee-400 text-sm">${esc(m.category)} · ${fp(m.price)}</span></div>
        <button class="status-btn ${m.available?'status-active':'status-inactive'}" onclick="W._togMI(${m.id})">${m.available?'فعال':'غیر'}</button>
        <button class="icon-btn" onclick="W._edit('menu',${m.id})">✏️</button><button class="icon-btn" onclick="W._delMI(${m.id})">🗑️</button></div>`}
    </div>`).join('')}`}

// ── Admin Staff (با ویرایش) ────────────────────
function rAStaff():string{
  const eId=editTp==='staff'?editId:0;
  return`<div class="admin-header-row"><h2 class="admin-title">👥 پرسنل</h2><button class="btn-primary btn-sm" onclick="W._tgF('asF')">+ افزودن</button></div>
    <div id="asF" style="display:none" class="glass-card p-6 mb-6"><div class="form-grid">
      <div class="form-group"><label>نام *</label><input type="text" id="asNm"/></div>
      <div class="form-group"><label>سمت *</label><select id="asRl"><option value="">انتخاب</option>${['مدیر','باریستا','گارسون','صندوقدار','آشپز'].map(r=>`<option>${r}</option>`).join('')}</select></div>
      <div class="form-group"><label>تلفن *</label><input type="tel" id="asPh" dir="ltr"/></div>
      <div class="form-group"><label>مرخصی</label><input type="number" id="asLv" value="26"/></div>
    </div><button class="btn-primary btn-sm mt-4" onclick="W._addSI()">ثبت</button></div>
    <div class="staff-admin-grid">${staff.map(s=>`<div class="glass-card p-6 ${eId===s.id?'ring-edit':''}">
      ${eId===s.id?`<div class="form-grid">
        <div class="form-group"><label>نام</label><input type="text" id="esNm" value="${esc(s.name)}"/></div>
        <div class="form-group"><label>سمت</label><input type="text" id="esRl" value="${esc(s.role)}"/></div>
        <div class="form-group"><label>تلفن</label><input type="tel" id="esPh" value="${s.phone}" dir="ltr"/></div>
        <div class="form-group"><label>انعام</label><input type="number" id="esTp" value="${s.tips}"/></div>
        <div class="form-group"><label>مرخصی استفاده</label><input type="number" id="esLu" value="${s.leaveUsed}"/></div>
        <div class="form-group"><label>کل مرخصی</label><input type="number" id="esLd" value="${s.leaveDays}"/></div>
      </div><div class="btn-row mt-4"><button class="btn-primary btn-sm flex-1" onclick="W._svSI(${s.id})">💾</button><button class="btn-outline btn-sm flex-1" onclick="W._cedit()">لغو</button></div>`
      :`<div class="staff-card-header"><span class="text-4xl">${s.avatar}</span><div><h3 class="text-white font-bold">${esc(s.name)}</h3><p class="text-coffee-400 text-sm">${esc(s.role)}</p><p class="text-coffee-500 text-xs" dir="ltr">${s.phone}</p></div>
        <div class="btn-group"><button class="icon-btn" onclick="W._edit('staff',${s.id})">✏️</button><button class="icon-btn text-red" onclick="W._delSI(${s.id})">🗑️</button></div></div>
        <div class="staff-stats-row"><div class="staff-stat"><small>انعام</small><strong>${fp(s.tips)}</strong></div><div class="staff-stat"><small>مرخصی</small><strong>${s.leaveUsed}/${s.leaveDays}</strong></div></div>`}
    </div>`).join('')}</div>`}

// ── Admin Inventory (با ویرایش) ────────────────
function rAInv():string{
  const eId=editTp==='inv'?editId:0;
  return`<div class="admin-header-row"><h2 class="admin-title">🏪 انبار</h2><button class="btn-primary btn-sm" onclick="W._tgF('aiF')">+ افزودن</button></div>
    <div id="aiF" style="display:none" class="glass-card p-6 mb-6"><div class="form-grid">
      <div class="form-group"><label>نام *</label><input type="text" id="aiNm"/></div><div class="form-group"><label>موجودی</label><input type="number" id="aiQt"/></div>
      <div class="form-group"><label>واحد *</label><input type="text" id="aiUn" placeholder="کیلوگرم"/></div><div class="form-group"><label>حداقل</label><input type="number" id="aiMn"/></div>
      <div class="form-group"><label>هزینه واحد</label><input type="number" id="aiCs"/></div>
    </div><button class="btn-primary btn-sm mt-4" onclick="W._addII()">ذخیره</button></div>
    <div class="inv-grid">${inv.map(it=>{
      const pct=it.minStock>0?Math.min((it.quantity/(it.minStock*3))*100,100):100,cl=it.quantity<=it.minStock?'red':it.quantity<=it.minStock*2?'yellow':'green';
      return`<div class="glass-card p-5 inv-card ${eId===it.id?'ring-edit':''}">
        ${eId===it.id?`<div class="form-grid">
          <div class="form-group"><label>نام</label><input type="text" id="eiNm" value="${esc(it.name)}"/></div>
          <div class="form-group"><label>موجودی</label><input type="number" id="eiQt" value="${it.quantity}"/></div>
          <div class="form-group"><label>واحد</label><input type="text" id="eiUn" value="${esc(it.unit)}"/></div>
          <div class="form-group"><label>حداقل</label><input type="number" id="eiMn" value="${it.minStock}"/></div>
          <div class="form-group"><label>هزینه</label><input type="number" id="eiCs" value="${it.cost}"/></div>
        </div><div class="btn-row mt-4"><button class="btn-primary btn-sm flex-1" onclick="W._svII(${it.id})">💾</button><button class="btn-outline btn-sm flex-1" onclick="W._cedit()">لغو</button></div>`
        :`<div class="inv-card-header"><div class="inv-icon">📦</div><div><strong class="text-white">${esc(it.name)}</strong><br/><span class="inv-status inv-${cl}">${cl==='red'?'کمبود':cl==='yellow'?'کم':'کافی'}</span></div>
          <div class="btn-group"><button class="icon-btn" onclick="W._edit('inv',${it.id})">✏️</button><button class="icon-btn text-red" onclick="W._delII(${it.id})">🗑️</button></div></div>
          <div class="inv-bar"><div class="inv-bar-fill inv-bar-${cl}" style="width:${pct}%"></div></div>
          <div class="inv-details"><div><small>موجودی</small><strong>${it.quantity} ${it.unit}</strong></div><div><small>هزینه واحد</small><strong>${fp(it.cost)}</strong></div></div>
          <div class="inv-val"><small>ارزش</small><strong>${fp(it.quantity*it.cost)}</strong></div>`}
      </div>`}).join('')}</div>
    <!-- ارزش مالی انبار -->
    <div class="glass-card p-6 mt-6">
      <h3 class="text-lg font-bold text-white mb-4">💰 ارزش مالی انبار</h3>
      <div class="admin-stats mb-4">
        <div class="admin-stat-card bg-green-grad"><h3>${fp(inv.reduce((s,i)=>s+i.quantity*i.cost,0))}</h3><p>ارزش کل انبار</p></div>
        <div class="admin-stat-card bg-blue-grad"><h3>${inv.length}</h3><p>تعداد اقلام</p></div>
        <div class="admin-stat-card bg-amber-grad"><h3>${inv.filter(i=>i.quantity<=i.minStock).length}</h3><p>کمبود موجودی</p></div>
      </div>
      ${inv.length>0?`<div class="admin-table-wrap"><table class="admin-table">
        <thead><tr><th>کالا</th><th>موجودی</th><th>هزینه واحد</th><th>ارزش کل</th><th>وضعیت</th></tr></thead>
        <tbody>
          ${inv.map(it=>{const v=it.quantity*it.cost,cl=it.quantity<=it.minStock?'red':it.quantity<=it.minStock*2?'yellow':'green';
            return`<tr><td><strong>${esc(it.name)}</strong></td><td>${it.quantity} ${it.unit}</td><td>${fp(it.cost)}</td><td class="text-gold"><strong>${fp(v)}</strong></td><td><span class="inv-status inv-${cl}">${cl==='red'?'⚠️ کمبود':cl==='yellow'?'⚡ کم':'✅ کافی'}</span></td></tr>`}).join('')}
          <tr style="background:rgba(160,113,74,.1)"><td colspan="3"><strong>جمع کل ارزش انبار:</strong></td><td colspan="2"><strong class="text-gold" style="font-size:1.1rem">${fp(inv.reduce((s,i)=>s+i.quantity*i.cost,0))}</strong></td></tr>
        </tbody></table></div>`:''}
    </div>`}

// ── Customer Club ──────────────────────────────
function rAClub():string{
  return`<h2 class="admin-title">💎 باشگاه مشتریان (${cust.length})</h2>
    ${cust.length>0?`<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>نام</th><th>تلفن</th><th>سفارشات</th><th>مبلغ کل</th><th>تاریخ عضویت</th><th>یادداشت</th><th>عمل</th></tr></thead><tbody>
      ${cust.map(c=>`<tr><td><strong>${esc(c.name)}</strong></td><td dir="ltr">${c.phone}</td><td>${c.orders}</td><td>${fp(c.totalSpent)}</td><td>${c.joinDate}</td>
        <td>${editTp==='cust'&&editId===c.id?`<input type="text" id="ecNote" value="${esc(c.note)}" style="width:100%"/>`:`<span class="text-coffee-400 text-xs">${esc(c.note||'-')}</span>`}</td>
        <td>${editTp==='cust'&&editId===c.id?`<button class="btn-primary btn-sm" onclick="W._svCN(${c.id})">💾</button>`:`<button class="icon-btn" onclick="W._edit('cust',${c.id})">✏️</button>`}</td></tr>`).join('')}
    </tbody></table></div>`:'<div class="empty-state">👥<p>مشتری ثبت نشده. با ثبت سفارش، مشتریان خودکار اضافه می‌شوند.</p></div>'}`}

// ── Finance ────────────────────────────────────
function rAFin():string{
  const all=[...orders,...archive],tot=all.reduce((s,o)=>s+o.total,0);
  return`<div class="admin-header-row"><h2 class="admin-title">💰 مالی</h2><button class="btn-primary btn-sm" onclick="W._expCSV()">📥 خروجی</button></div>
    <div class="admin-stats mb-6"><div class="admin-stat-card bg-green-grad"><h3>${fp(tot)}</h3><p>درآمد کل</p></div><div class="admin-stat-card bg-blue-grad"><h3>${all.length}</h3><p>کل سفارشات</p></div></div>
    ${all.length>0?`<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>#</th><th>مشتری</th><th>نوع</th><th>مبلغ</th><th>وضعیت</th></tr></thead><tbody>
      ${all.map(o=>`<tr><td>#${o.id}</td><td>${esc(o.customerName)}</td><td>${o.type==='dine-in'?'سالن':o.type==='takeout'?'بیرون‌بر':'ارسال'}</td><td><strong>${fp(o.total)}</strong></td><td>${o.status}</td></tr>`).join('')}
    </tbody></table></div>`:''}`}

// ── Admins (با ویرایش) ─────────────────────────
function rAAdmins():string{
  const al:any[]=ld('admins',[{id:1,username:'admin',password:'Cr@2024!Secure',name:'مدیر',role:'super'}]),eId=editTp==='adm'?editId:0;
  return`<div class="admin-header-row"><h2 class="admin-title">🔑 ادمین‌ها</h2><button class="btn-primary btn-sm" onclick="W._tgF('aaF')">+ افزودن</button></div>
    <div id="aaF" style="display:none" class="glass-card p-6 mb-6"><div class="form-grid">
      <div class="form-group"><label>نام *</label><input type="text" id="aaNm"/></div><div class="form-group"><label>کاربری *</label><input type="text" id="aaUs" dir="ltr"/></div>
      <div class="form-group"><label>رمز *</label><input type="password" id="aaPw" dir="ltr"/></div><div class="form-group"><label>سطح</label><select id="aaRl"><option value="staff">کارمند</option><option value="manager">مدیر</option></select></div>
    </div><button class="btn-primary btn-sm mt-4" onclick="W._addAA()">ثبت</button></div>
    <div class="staff-admin-grid">${al.map(a=>`<div class="glass-card p-6 ${eId===a.id?'ring-edit':''}">
      ${eId===a.id&&a.role!=='super'?`<div class="form-grid">
        <div class="form-group"><label>نام</label><input type="text" id="eaNm" value="${esc(a.name)}"/></div>
        <div class="form-group"><label>رمز جدید</label><input type="password" id="eaPw" dir="ltr" placeholder="خالی=بدون تغییر"/></div>
      </div><div class="btn-row mt-4"><button class="btn-primary btn-sm flex-1" onclick="W._svAA(${a.id})">💾</button><button class="btn-outline btn-sm flex-1" onclick="W._cedit()">لغو</button></div>`
      :`<div class="staff-card-header"><span class="text-4xl">${a.role==='super'?'👑':'👤'}</span><div><h3 class="text-white font-bold">${esc(a.name)}</h3><p class="text-coffee-400 text-sm" dir="ltr">@${esc(a.username)}</p></div>
        ${a.role!=='super'?`<div class="btn-group"><button class="icon-btn" onclick="W._edit('adm',${a.id})">✏️</button><button class="icon-btn text-red" onclick="W._delAA(${a.id})">🗑️</button></div>`:''}</div>`}
    </div>`).join('')}</div>`}

// ── Devices ────────────────────────────────────
function rADev():string{
  const up=orders.filter(o=>o.status!=='paid');
  return`<h2 class="admin-title">🖨️ دستگاه‌ها و فیش‌ها</h2>
    <div class="glass-card p-6 mb-6"><h3 class="text-lg font-bold text-white mb-4">🧾 فیش تسویه نشده (${up.length})</h3>
      ${up.length>0?up.map(o=>`<div class="glass-card p-4 mb-3"><div class="receipt-header"><span class="receipt-id">#${o.id}</span><span>${esc(o.customerName)}</span><span class="text-gold">${fp(o.total)}</span></div>
        <div class="btn-row mt-3"><button class="btn-primary btn-sm flex-1" onclick="W._prnt(${o.id})">🖨️ چاپ</button><button class="btn-outline btn-sm flex-1" onclick="W._mkPd(${o.id})">💰 تسویه</button></div></div>`).join('')
      :'<div class="empty-state">✅<p>همه تسویه شده</p></div>'}</div>
    <div class="devices-grid">${[{i:'🖨️',t:'پرینتر حرارتی'},{i:'💳',t:'کارتخوان'},{i:'🍺',t:'پرینتر بار'}].map(d=>`<div class="glass-card p-6 text-center"><div class="text-4xl mb-2">${d.i}</div><h3 class="text-lg font-bold text-white">${d.t}</h3><div class="device-status-box dev-on mt-4"><span class="status-dot"></span>متصل</div></div>`).join('')}</div>`}

// ── Settings ───────────────────────────────────
function rASet():string{
  const c=cfg(),ci=ctc(),ct:string=ld('siteTheme','coffee');
  return`<h2 class="admin-title">⚙️ تنظیمات</h2>
    <!-- Theme --><div class="glass-card p-6 mb-6"><h3 class="text-lg font-bold text-white mb-4">🎨 تم</h3>
      <div class="theme-grid">${[{id:'coffee',n:'قهوه‌ای',c1:'#a0714a',c2:'#3d281a'},{id:'dark',n:'مشکی',c1:'#6b7280',c2:'#111827'},{id:'green',n:'سبز',c1:'#059669',c2:'#064e3b'},{id:'blue',n:'آبی',c1:'#3b82f6',c2:'#1e3a5f'},{id:'red',n:'قرمز',c1:'#dc2626',c2:'#450a0a'},{id:'purple',n:'بنفش',c1:'#9333ea',c2:'#3b0764'}].map(t=>`<button class="theme-btn ${ct===t.id?'theme-active':''}" onclick="W._thm('${t.id}')"><div class="theme-preview"><div class="theme-dot" style="background:${t.c1}"></div><div class="theme-dot" style="background:${t.c2}"></div></div><span>${t.n}</span></button>`).join('')}</div></div>
    <!-- Cafe --><div class="glass-card p-6 mb-6"><h3 class="text-lg font-bold text-white mb-4">☕ کافه</h3>
      <div class="form-grid"><div class="form-group"><label>نام</label><input type="text" id="cfNm" value="${esc(c.name)}"/></div><div class="form-group"><label>En</label><input type="text" id="cfEn" value="${esc(c.nameEn)}" dir="ltr"/></div></div>
      <button class="btn-primary btn-sm mt-4" onclick="W._svCfg()">💾 ذخیره</button></div>
    <!-- Hero --><div class="glass-card p-6 mb-6"><h3 class="text-lg font-bold text-white mb-4">🖼️ صفحه اصلی</h3>
      <div class="form-grid"><div class="form-group col-span-2"><label>عنوان</label><input type="text" id="cfHT" value="${esc(c.heroTitle)}"/></div>
        <div class="form-group col-span-2"><label>زیرعنوان</label><input type="text" id="cfHS" value="${esc(c.heroSub)}"/></div>
        <div class="form-group col-span-2"><label>توضیح</label><textarea id="cfHD" rows="2">${esc(c.heroDesc)}</textarea></div></div>
      <h4 class="text-white font-bold mt-4 mb-2">📷 تصاویر</h4>
      <div class="hero-imgs-grid">
        <div><label class="text-coffee-400 text-xs">هیرو</label><div class="upload-box" onclick="el('hiF').click()"><div id="hiPrv">${ld('heroImg','')?'✅':'📷'}</div></div><input type="file" id="hiF" accept="image/*" style="display:none" onchange="W._upHI('hiF','hiPrv','heroImg')"/></div>
        <div><label class="text-coffee-400 text-xs">داخلی</label><div class="upload-box" onclick="el('iiF').click()"><div id="iiPrv">${ld('intImg','')?'✅':'📷'}</div></div><input type="file" id="iiF" accept="image/*" style="display:none" onchange="W._upHI('iiF','iiPrv','intImg')"/></div>
        <div><label class="text-coffee-400 text-xs">بیرونی</label><div class="upload-box" onclick="el('tiF').click()"><div id="tiPrv">${ld('terImg','')?'✅':'📷'}</div></div><input type="file" id="tiF" accept="image/*" style="display:none" onchange="W._upHI('tiF','tiPrv','terImg')"/></div>
      </div><button class="btn-primary btn-sm mt-4" onclick="W._svHero()">💾 ذخیره</button></div>
    <!-- Contact --><div class="glass-card p-6 mb-6"><h3 class="text-lg font-bold text-white mb-4">📞 تماس</h3>
      <div class="form-grid"><div class="form-group"><label>تلفن</label><input type="tel" id="ciPh" value="${esc(ci.phone)}" dir="ltr"/></div><div class="form-group"><label>موبایل</label><input type="tel" id="ciMb" value="${esc(ci.mobile)}" dir="ltr"/></div>
        <div class="form-group col-span-2"><label>آدرس</label><input type="text" id="ciAd" value="${esc(ci.address)}"/></div><div class="form-group"><label>ایمیل</label><input type="email" id="ciEm" value="${esc(ci.email)}" dir="ltr"/></div>
        <div class="form-group"><label>ساعات</label><input type="text" id="ciHr" value="${esc(ci.hours)}"/></div><div class="form-group"><label>اینستاگرام</label><input type="text" id="ciIG" value="${esc(ci.instagram)}" dir="ltr"/></div>
        <div class="form-group"><label>تلگرام</label><input type="text" id="ciTG" value="${esc(ci.telegram)}" dir="ltr"/></div></div>
      <button class="btn-primary btn-sm mt-4" onclick="W._svCtc()">💾 ذخیره</button></div>`}

// ── Modals ──────────────────────────────────────
function rLoginMod():string{return`<div class="modal-overlay" onclick="W._clMod()"></div><div class="modal"><div class="glass-card animate-fadeInUp" style="position:relative"><button class="modal-close" onclick="W._clMod()">✕</button><div class="text-center mb-6"><div class="text-5xl mb-3">☕</div><h2 class="text-xl font-bold text-white">ورود / ثبت نام</h2></div><div class="form-group"><label>نام</label><input type="text" id="lNm"/></div><div class="form-group"><label>موبایل</label><input type="tel" id="lPh" dir="ltr" placeholder="09xxxxxxxxx"/></div><div id="lEr" class="form-error"></div><button class="btn-primary btn-full" onclick="W._doLn()">ورود 👤</button></div></div>`}
function rAdmMod():string{return`<div class="modal-overlay" onclick="W._clMod()"></div><div class="modal"><div class="glass-card animate-fadeInUp" style="position:relative"><button class="modal-close" onclick="W._clMod()">✕</button><div class="text-center mb-6"><div class="admin-login-icon">🛡️</div><h2 class="text-xl font-bold text-white">پنل مدیریت</h2></div><div class="form-group"><label>نام کاربری</label><input type="text" id="aUs" dir="ltr"/></div><div class="form-group"><label>رمز</label><input type="password" id="aPw" dir="ltr"/></div><div id="aEr" class="form-error"></div><button class="btn-red btn-full" onclick="W._doAdLn()">🔐 ورود</button></div></div>`}
function rPayMod():string{return`<div class="modal-overlay" onclick="W._clMod()"></div><div class="modal"><div class="glass-card animate-fadeInUp" style="position:relative;max-width:28rem"><button class="modal-close" onclick="W._clMod()">✕</button><div class="text-center mb-6"><div class="text-5xl mb-3">💳</div><h2 class="text-xl font-bold text-white">پرداخت</h2><p class="text-coffee-400 text-sm mt-2">${fp(py.amt)}</p></div><div class="pay-methods"><button class="pay-method-btn ${py.m==='card'?'pay-active':''}" onclick="W._spm('card')"><span class="text-3xl">💳</span><strong>کارتخوان</strong></button><button class="pay-method-btn ${py.m==='cash'?'pay-active':''}" onclick="W._spm('cash')"><span class="text-3xl">💵</span><strong>نقدی</strong></button></div>${py.m?`<button class="btn-primary btn-full btn-lg mt-6" onclick="W._cfmPy()">تایید ✓</button>`:''}</div></div>`}

// ── Footer ─────────────────────────────────────
function rFooter():string{const c=cfg(),ci=ctc();return`<footer class="footer"><div class="container"><div class="footer-grid"><div><div class="footer-logo">☕ <strong>${esc(c.name)}</strong></div></div><div><h4>لینک‌ها</h4><ul><li><a href="#" onclick="W._nav('home')">خانه</a></li><li><a href="#" onclick="W._nav('menu')">منو</a></li><li><a href="#" onclick="W._nav('contact')">تماس</a></li></ul></div><div><h4>تماس</h4>${ci.phone?`<p>📞 ${ci.phone}</p>`:''}${ci.address?`<p>📍 ${ci.address}</p>`:''}</div></div><div class="footer-bottom"><p>© ${esc(c.name)}</p></div></div></footer>`}

// ══════════════════════════════════════════════
// ── Window API ────────────────────────────────
// ══════════════════════════════════════════════
W.R=R;W._nav=nav;
W._togMob=()=>{mob=!mob;R()};
W._showLn=()=>{lnMod=true;adMod=false;R()};
W._clMod=()=>{lnMod=adMod=pyMod=false;R()};
W._admClick=()=>{if(adm)nav('admin');else{adMod=true;lnMod=false;R()}};
W._doLn=()=>{const n=val('lNm'),p=val('lPh'),e=document.getElementById('lEr');if(!n.trim()){if(e)e.textContent='نام را وارد کنید';return}if(!/^09\d{9}$/.test(p)){if(e)e.textContent='شماره معتبر نیست';return}logIn=true;sv('userName',n);sv('userPhone',p);lnMod=false;R()};
W._doAdLn=()=>{const u=val('aUs'),p=val('aPw'),e=document.getElementById('aEr');if(!u||!p){if(e)e.textContent='فیلدها را پر کنید';return}const al:any[]=ld('admins',[{id:1,username:'admin',password:'Cr@2024!Secure',name:'مدیر',role:'super'}]);if(al.find((a:any)=>a.username===u&&a.password===p)){adm=true;adMod=false;nav('admin')}else{if(e)e.textContent='اشتباه است'}};
W._logout=()=>{logIn=adm=false;nav('home')};
W._as=(s:string)=>{admS=s;editId=0;editTp='';R()};

// Cart
W._co=false;W._cco=false;W._cok=false;W._ot='takeout';
W._openCart=()=>{W._co=true;mob=false;R()};
W._cc=()=>{W._co=W._cco=W._cok=false;R()};
W._ac=(id:number)=>{const m=menu.find(x=>x.id===id);if(m)addCart(m)};
W._rc=(id:number)=>remC(id);
W._gco=()=>{if(!logIn){lnMod=true;R();return}W._cco=true;R()};
W._subO=()=>{
  const nm=val('coName'),ph=val('coPhone'),ot=W._ot,tbl=val('coTbl'),addr=val('coAddr');
  if(!nm)return alert('نام الزامی');if(ot!=='dine-in'&&!/^09\d{9}$/.test(ph))return alert('شماره معتبر نیست');
  const df=ot==='delivery'?dlvFee():0,tot=cTot()+df,id=ni(orders);
  orders.push({id,items:[...cart],total:tot,customerName:nm,phone:ph||'',type:ot,status:'pending',createdAt:new Date().toISOString(),tableNumber:ot==='dine-in'?parseInt(tbl)||0:undefined,address:ot==='delivery'?addr:undefined});
  sv('orders',orders);addN(`سفارش #${id} - ${nm}`,'order');
  upsertCust(nm,ph||'بدون شماره',tot);
  cart=[];W._cok=true;W._lid=id;W._ltot=tot;R();
};

// Search
W._mc='همه';W._ms='';let _st:any;
W._msc=(v:string)=>{W._ms=v;clearTimeout(_st);_st=setTimeout(()=>{const p=(document.getElementById('mSrch') as HTMLInputElement)?.selectionStart||0;R();requestAnimationFrame(()=>{const e=document.getElementById('mSrch') as HTMLInputElement;if(e){e.focus();e.setSelectionRange(p,p)}})},300)};

// Edit system
W._edit=(tp:string,id:number)=>{editTp=tp;editId=id;R()};
W._cedit=()=>{editTp='';editId=0;R()};

// Toggle form
W._tgF=(id:string)=>{const f=document.getElementById(id);if(f)f.style.display=f.style.display==='none'?'block':'none'};

// Image upload
W._uImg='';
W._prvI=(iid:string,pid:string)=>{const inp=document.getElementById(iid) as HTMLInputElement;if(inp?.files?.[0]){const r=new FileReader();r.onloadend=()=>{W._uImg=r.result;const p=document.getElementById(pid);if(p)p.innerHTML=`<img src="${r.result}" style="width:100%;height:100%;object-fit:cover;border-radius:.75rem"/>`};r.readAsDataURL(inp.files[0])}};
W._upHI=(iid:string,pid:string,key:string)=>{const inp=document.getElementById(iid) as HTMLInputElement;if(inp?.files?.[0]){const r=new FileReader();r.onloadend=()=>{sv(key,r.result as string);const p=document.getElementById(pid);if(p)p.innerHTML='✅'};r.readAsDataURL(inp.files[0])}};

// Menu CRUD
W._addMI=()=>{const n=val('amNm'),pr=nval('amPr');if(!n||!pr)return alert('نام و قیمت الزامی');menu.push({id:ni(menu),name:n,nameEn:val('amEn'),price:pr,category:val('amCt')||'عمومی',image:W._uImg||IM.cappuccino,description:val('amDs'),available:true});sv('menu',menu);W._uImg='';addN(`"${n}" اضافه شد`,'menu');R()};
W._svMI=(id:number)=>{const m=menu.find(x=>x.id===id);if(!m)return;m.name=val('emNm')||m.name;m.nameEn=val('emEn');m.price=nval('emPr')||m.price;m.category=val('emCt')||m.category;m.description=val('emDs');sv('menu',menu);editTp='';editId=0;addN(`"${m.name}" ویرایش شد`,'menu');R()};
W._togMI=(id:number)=>{const m=menu.find(x=>x.id===id);if(m){m.available=!m.available;sv('menu',menu);R()}};
W._delMI=(id:number)=>{menu=menu.filter(m=>m.id!==id);sv('menu',menu);R()};
W._addCat=()=>{const n=val('newCat');if(!n)return;const c:string[]=ld('categories',['عمومی']);if(!c.includes(n)){c.push(n);sv('categories',c);R()}};
W._delCat=(n:string)=>{let c:string[]=ld('categories',[]);c=c.filter(x=>x!==n);sv('categories',c);R()};

// Staff CRUD
W._addSI=()=>{const n=val('asNm'),r=val('asRl'),p=val('asPh');if(!n||!r||!p)return alert('الزامی');staff.push({id:ni(staff),name:n,role:r,phone:p,avatar:'👤',tips:0,leaveDays:nval('asLv')||26,leaveUsed:0});sv('staff',staff);addN(`"${n}" اضافه شد`,'staff');R()};
W._svSI=(id:number)=>{const s=staff.find(x=>x.id===id);if(!s)return;s.name=val('esNm')||s.name;s.role=val('esRl')||s.role;s.phone=val('esPh')||s.phone;s.tips=nval('esTp');s.leaveUsed=nval('esLu');s.leaveDays=nval('esLd')||s.leaveDays;sv('staff',staff);editTp='';editId=0;R()};
W._delSI=(id:number)=>{staff=staff.filter(s=>s.id!==id);sv('staff',staff);R()};

// Inventory CRUD
W._addII=()=>{const n=val('aiNm'),u=val('aiUn');if(!n||!u)return alert('نام و واحد');inv.push({id:ni(inv),name:n,quantity:nval('aiQt'),unit:u,minStock:nval('aiMn'),lastRestocked:new Date().toLocaleDateString('fa-IR'),cost:nval('aiCs')});sv('inv',inv);addN(`"${n}" اضافه شد`,'inv');R()};
W._svII=(id:number)=>{const it=inv.find(x=>x.id===id);if(!it)return;it.name=val('eiNm')||it.name;it.quantity=nval('eiQt');it.unit=val('eiUn')||it.unit;it.minStock=nval('eiMn');it.cost=nval('eiCs');sv('inv',inv);editTp='';editId=0;R()};
W._delII=(id:number)=>{inv=inv.filter(i=>i.id!==id);sv('inv',inv);R()};

// Orders
W._cos=(id:number,s:string)=>{const o=orders.find(x=>x.id===id);if(o){o.status=s;if(s==='paid'){archive.push(o);orders=orders.filter(x=>x.id!==id);sv('archive',archive)}sv('orders',orders);R()}};
W._svDlv=()=>{sv('deliveryFee',nval('dlvFee')||25000);addN('هزینه ارسال ذخیره شد','settings');R()};

// Tables
W._addT=()=>{const nm=val('atNm');if(!nm)return alert('نام میز');tables.push({id:ni(tables),number:tables.length+1,capacity:nval('atCp')||4,status:'available',floor:val('atFl')||'همکف',name:nm});sv('tables',tables);addN(`${nm} اضافه شد`,'table');R()};
W._delT=(id:number)=>{tables=tables.filter(t=>t.id!==id);sv('tables',tables);R()};

// Admins
W._addAA=()=>{const n=val('aaNm'),u=val('aaUs'),p=val('aaPw');if(!n||!u||!p)return alert('الزامی');const al:any[]=ld('admins',[]);al.push({id:ni(al),username:u,password:p,name:n,role:val('aaRl')||'staff'});sv('admins',al);addN(`ادمین "${n}" اضافه شد`,'admin');R()};
W._svAA=(id:number)=>{const al:any[]=ld('admins',[]);const a=al.find((x:any)=>x.id===id);if(!a)return;a.name=val('eaNm')||a.name;const pw=val('eaPw');if(pw)a.password=pw;sv('admins',al);editTp='';editId=0;R()};
W._delAA=(id:number)=>{let al:any[]=ld('admins',[]);al=al.filter((a:any)=>a.id!==id||a.role==='super');sv('admins',al);R()};

// Customer note
W._svCN=(id:number)=>{const c=cust.find(x=>x.id===id);if(c){c.note=val('ecNote');sv('cust',cust);editTp='';editId=0;R()}};

// Receipts
W._mkPd=(id:number)=>{const o=orders.find(x=>x.id===id);if(o){o.status='paid';archive.push(o);orders=orders.filter(x=>x.id!==id);sv('orders',orders);sv('archive',archive);addN(`فیش #${id} تسویه`,'payment');R()}};
W._prnt=(id:number)=>{const o=[...orders,...archive].find(x=>x.id===id);if(!o)return;const c=cfg();const w=window.open('','_blank','width=350,height=400');if(!w)return;w.document.write(`<html dir="rtl"><head><title>فیش</title><style>*{font-family:Tahoma,sans-serif;margin:0;padding:0}body{padding:15px;font-size:12px}.r{display:flex;justify-content:space-between;padding:2px 0}.l{border-top:1px dashed #000;margin:6px 0}.t{font-weight:bold}@media print{button{display:none}}</style></head><body><h3 style="text-align:center">${esc(c.name)}</h3><div class="l"></div>${o.items.map(i=>`<div class="r"><span>${esc(i.item.name)}×${i.qty}</span><span>${i.item.price*i.qty}</span></div>`).join('')}<div class="l"></div><div class="r t"><span>جمع:</span><span>${o.total}</span></div><br/><button onclick="window.print()" style="width:100%;padding:6px;cursor:pointer">🖨️</button></body></html>`);w.document.close()};

// Finance
W._expCSV=()=>{const all=[...orders,...archive];let csv='\uFEFF#,مشتری,نوع,مبلغ\n';all.forEach(o=>{csv+=`${o.id},${o.customerName},${o.type},${o.total}\n`});const b=new Blob([csv],{type:'text/csv;charset=utf-8;'});const l=document.createElement('a');l.href=URL.createObjectURL(b);l.download='گزارش.csv';document.body.appendChild(l);l.click();document.body.removeChild(l)};

// Settings
W._svCfg=()=>{const c=cfg();c.name=val('cfNm')||c.name;c.nameEn=val('cfEn')||c.nameEn;sv('cafeConfig',c);alert('✅');R()};
W._svHero=()=>{const c=cfg();c.heroTitle=val('cfHT');c.heroSub=val('cfHS');c.heroDesc=(document.getElementById('cfHD') as HTMLTextAreaElement)?.value||'';sv('cafeConfig',c);alert('✅')};
W._svCtc=()=>{sv('contactInfo',{phone:val('ciPh'),mobile:val('ciMb'),address:val('ciAd'),email:val('ciEm'),hours:val('ciHr'),instagram:val('ciIG'),telegram:val('ciTG')});alert('✅');R()};
W._thm=(id:string)=>{sv('siteTheme',id);const ts:{[k:string]:{[k:string]:string}}={coffee:{c4:'#c08b52',c5:'#a0714a',c6:'#7a5636',c7:'#5c3d28',c8:'#3d281a',c9:'#1e140d'},dark:{c4:'#9ca3af',c5:'#6b7280',c6:'#4b5563',c7:'#374151',c8:'#1f2937',c9:'#111827'},green:{c4:'#34d399',c5:'#059669',c6:'#047857',c7:'#065f46',c8:'#064e3b',c9:'#022c22'},blue:{c4:'#60a5fa',c5:'#3b82f6',c6:'#2563eb',c7:'#1d4ed8',c8:'#1e3a5f',c9:'#0f172a'},red:{c4:'#f87171',c5:'#dc2626',c6:'#b91c1c',c7:'#991b1b',c8:'#7f1d1d',c9:'#450a0a'},purple:{c4:'#c084fc',c5:'#9333ea',c6:'#7e22ce',c7:'#6b21a8',c8:'#581c87',c9:'#3b0764'}};const t=ts[id]||ts.coffee;const r=document.documentElement;Object.entries(t).forEach(([k,v])=>r.style.setProperty('--'+k.replace('c','c'),v));document.body.style.background=t.c9;R()};
W._spm=(m:string)=>{py.m=m;R()};
W._cfmPy=()=>{const o=orders.find(x=>x.id===py.oid);if(o){o.status='paid';archive.push(o);orders=orders.filter(x=>x.id!==py.oid);sv('orders',orders);sv('archive',archive)}addN(`پرداخت ${fp(py.amt)}`,'payment');pyMod=false;R()};

// Apply theme
requestAnimationFrame(()=>{const t:string=ld('siteTheme','coffee');if(t!=='coffee')W._thm(t)});

// ── Init ──────────────────────────────────────
R();
