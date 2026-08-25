(()=>{
 const app=document.querySelector('.dashboard-app'); if(!app)return;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const email=localStorage.getItem('stacklyUserEmail');
 const role=app.dataset.role;
 const storedRole=localStorage.getItem('stacklyRole');
 if(!email || !storedRole){ window.location.replace('../auth/login.html'); return; }
 const expectedRole = role==='admin' ? 'provider' : 'patient';
 if(storedRole!==expectedRole){ window.location.replace(storedRole==='provider' ? 'admin.html' : 'client.html'); return; }
 const initials=(email.trim().charAt(0).toUpperCase()||'S');
 document.querySelectorAll('[data-user-email]').forEach(el=>el.textContent=email);
 document.querySelectorAll('[data-user-initials]').forEach(el=>el.textContent=initials);
 document.querySelectorAll('[data-user-role]').forEach(el=>el.textContent=role==='admin'?'Care professional':'Patient account');
 if(window.gsap&&!reduce){
   gsap.from('.dashboard-page-intro',{y:20,opacity:0,duration:.65,ease:'power3.out',delay:.05});
   gsap.from('.dash-section',{y:16,opacity:0,duration:.55,stagger:.07,ease:'power2.out',delay:.14});
   gsap.utils.toArray('[data-progress]').forEach(el=>gsap.fromTo(el,{scaleX:0},{scaleX:Number(el.dataset.progress||0)/100,duration:1,ease:'power3.out',delay:.35}));
   gsap.utils.toArray('[data-bar]').forEach(el=>gsap.fromTo(el,{scaleY:0},{scaleY:1,duration:.8,ease:'power3.out',delay:.25}));
 }else{
   document.querySelectorAll('[data-progress]').forEach(el=>el.style.transform=`scaleX(${Number(el.dataset.progress||0)/100})`);
   document.querySelectorAll('[data-bar]').forEach(el=>el.style.transform='scaleY(1)');
 }
 const sidebar=document.querySelector('.dashboard-sidebar'), overlay=document.querySelector('.dashboard-overlay');
 const menu=document.querySelector('[data-menu-toggle]'), closeSidebar=()=>app.classList.remove('sidebar-open');
 menu?.addEventListener('click',()=>app.classList.toggle('sidebar-open'));
 overlay?.addEventListener('click',closeSidebar);
 document.querySelector('[data-sidebar-close]')?.addEventListener('click',()=>{
   closeSidebar();
 });
 window.addEventListener('resize',()=>{if(window.innerWidth>820)app.classList.remove('sidebar-open')});
 document.querySelectorAll('.dashboard-nav a').forEach(a=>a.addEventListener('click',()=>{closeSidebar();}));
 const toast=document.querySelector('.dashboard-toast'); let timer;
 const show=m=>{if(!toast)return;toast.textContent=m;toast.classList.add('is-visible');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('is-visible'),2800)};
 document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.action)));
 document.querySelectorAll('[data-toast]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.toast)));
 document.querySelector('[data-logout]')?.addEventListener('click',()=>{localStorage.removeItem('stacklyUserEmail');localStorage.removeItem('stacklySignupEmail');localStorage.removeItem('stacklyRole');localStorage.removeItem('stacklyUserName');window.location.replace('../auth/login.html')});
 document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
   document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('is-active'));btn.classList.add('is-active');
   const value=btn.dataset.filter.toLowerCase();
   document.querySelectorAll('[data-category]').forEach(item=>{item.hidden=value!=='all'&&item.dataset.category.toLowerCase()!==value});
 }));
 const modal=document.querySelector('[data-dashboard-modal]');
 const openModal=()=>modal?.classList.add('is-open'),closeModal=()=>modal?.classList.remove('is-open');
 document.querySelectorAll('[data-open-modal]').forEach(b=>b.addEventListener('click',openModal));
 document.querySelectorAll('[data-close-modal]').forEach(b=>b.addEventListener('click',closeModal));
 modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});
 document.querySelector('[data-modal-form]')?.addEventListener('submit',e=>{e.preventDefault();closeModal();show('Your request has been added successfully.');e.target.reset()});
 document.querySelectorAll('[data-accordion]').forEach(item=>item.addEventListener('click',()=>item.classList.toggle('is-open')));
})();
