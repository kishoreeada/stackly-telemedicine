(function(){
  'use strict';
  const root=document.querySelector('.doctors-page');
  if(!root)return;

  if(window.AOS){AOS.init({duration:760,easing:'ease-out-cubic',once:true,offset:70,disable:()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches});}

  const filters=[...root.querySelectorAll('.doc-filter')];
  const cards=[...root.querySelectorAll('.doctor-card')];
  const status=root.querySelector('#doctor-status');
  filters.forEach(btn=>btn.addEventListener('click',()=>{
    const value=btn.dataset.filter;
    filters.forEach(b=>b.classList.toggle('is-active',b===btn));
    let visible=0;
    cards.forEach(card=>{
      const show=value==='all'||card.dataset.specialty===value;
      card.classList.toggle('is-hidden',!show);
      if(show) visible++;
    });
    if(status) status.textContent=`Showing ${visible} specialist${visible===1?'':'s'}${value==='all'?'':' in '+btn.textContent.trim()}`;
    if(window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      const visibleCards=cards.filter(c=>!c.classList.contains('is-hidden'));
      gsap.fromTo(visibleCards,{y:12,opacity:.65},{y:0,opacity:1,duration:.45,stagger:.055,ease:'power2.out',overwrite:true});
    }
  }));

  root.querySelectorAll('.doctor-save').forEach(btn=>btn.addEventListener('click',()=>{
    btn.classList.toggle('is-saved');
    const icon=btn.querySelector('i');
    if(icon){icon.classList.toggle('fa-regular');icon.classList.toggle('fa-solid');}
    btn.setAttribute('aria-pressed',btn.classList.contains('is-saved')?'true':'false');
  }));

  root.querySelectorAll('.doctor-book').forEach(btn=>btn.addEventListener('click',()=>{
    const name=btn.dataset.doctor||'your selected doctor';
    const target=root.querySelector('.doc-close');
    if(target){target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
    btn.blur();
    const heading=root.querySelector('.doc-close-copy h2');
    if(heading){heading.dataset.original=heading.dataset.original||heading.innerHTML; heading.innerHTML=`Book with <em>${name.replace(/^Dr\. /,'Dr. ')}</em>`; setTimeout(()=>{if(heading.dataset.original)heading.innerHTML=heading.dataset.original;},2600);}
  }));

  if(window.gsap){
    gsap.registerPlugin(ScrollTrigger);
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reduce){
      gsap.to('.doc-hero-image-wrap img',{scale:1.05,duration:7,ease:'sine.inOut',repeat:-1,yoyo:true});
      gsap.to('.doc-floating-top',{y:-10,duration:2.8,ease:'sine.inOut',repeat:-1,yoyo:true});
      gsap.to('.doc-floating-bottom',{y:8,duration:3.4,ease:'sine.inOut',repeat:-1,yoyo:true,delay:.4});
      gsap.to('.spotlight-orbit',{rotation:360,duration:30,ease:'none',repeat:-1});
      gsap.to('.close-panel-orbit .close-dot',{rotation:360,duration:14,ease:'none',repeat:-1,transformOrigin:'120px 120px',stagger:.7});
      gsap.utils.toArray('.doctor-card').forEach(card=>{
        const media=card.querySelector('.doctor-card-media');
        card.addEventListener('pointermove',e=>{
          const r=card.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5; const y=(e.clientY-r.top)/r.height-.5;
          gsap.to(card,{rotationY:x*2.2,rotationX:-y*1.8,duration:.35,overwrite:true});
          if(media)gsap.to(media,{x:x*5,y:y*4,duration:.45,overwrite:true});
        });
        card.addEventListener('pointerleave',()=>{gsap.to(card,{rotationY:0,rotationX:0,duration:.5});if(media)gsap.to(media,{x:0,y:0,duration:.5});});
      });
      gsap.fromTo('.doc-hero-label',{y:15,opacity:.5},{y:0,opacity:1,duration:.9,ease:'power3.out',delay:.25});
      ScrollTrigger.refresh();
    }
  }
})();
