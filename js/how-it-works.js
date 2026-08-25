(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.AOS) {
    AOS.init({duration:720, easing:'ease-out-cubic', once:true, offset:80, disable:reduce});
  }

  const stepCards = [...document.querySelectorAll('.step-card')];
  const rail = document.querySelector('.steps-rail span');
  const activateStep = (card) => {
    stepCards.forEach(c => c.classList.toggle('is-active', c === card));
    if (rail) rail.style.width = `${(Number(card.dataset.step) / stepCards.length) * 100}%`;
  };
  stepCards.forEach(card => {
    card.addEventListener('mouseenter', () => activateStep(card));
    card.addEventListener('focus', () => activateStep(card));
    card.addEventListener('click', () => activateStep(card));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateStep(card); } });
  });

  const panelCopy = {
    prepare: ['PREPARE','Bring the context, not a pile of tabs.','Add a short note, your main question or anything you want the doctor to know before the visit.'],
    confirm: ['CONFIRM','Know exactly when and where to join.','Your appointment details, secure link and practical timing stay together instead of getting lost in messages.'],
    ready: ['READY','Start the visit with less friction.','Open the secure consultation from the same care path and move straight into the conversation.']
  };
  const panel = document.querySelector('#timeline-panel');
  document.querySelectorAll('.timeline-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.timeline-tab').forEach(t => {t.classList.remove('is-active');t.setAttribute('aria-selected','false');});
    tab.classList.add('is-active'); tab.setAttribute('aria-selected','true');
    const data = panelCopy[tab.dataset.panel];
    if (!panel || !data) return;
    if (window.gsap && !reduce) {
      gsap.to(panel,{opacity:0,y:8,duration:.16,onComplete:()=>{
        panel.querySelector('p').textContent=data[0]; panel.querySelector('h3').textContent=data[1]; panel.querySelector('span').textContent=data[2];
        gsap.to(panel,{opacity:1,y:0,duration:.32,ease:'power2.out'});
      }});
    } else {panel.querySelector('p').textContent=data[0];panel.querySelector('h3').textContent=data[1];panel.querySelector('span').textContent=data[2];}
  }));

  const consultItems = [...document.querySelectorAll('.consult-item')];
  consultItems.forEach(item => item.addEventListener('click', () => {
    consultItems.forEach(i => i.classList.remove('is-active')); item.classList.add('is-active');
    if (window.gsap && !reduce) gsap.fromTo('.scene-ring',{scale:.92,opacity:.35},{scale:1,opacity:1,duration:.55,ease:'power2.out'});
  }));

  if (window.gsap && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo('.stage-phone',{y:22,rotate:4},{y:-12,rotate:0,ease:'none',scrollTrigger:{trigger:'.how-hero',start:'top top',end:'bottom top',scrub:1}});
    gsap.to('.orbit-a',{rotation:20,ease:'none',scrollTrigger:{trigger:'.how-hero',start:'top top',end:'bottom top',scrub:1.4}});
    gsap.to('.orbit-b',{rotation:-28,ease:'none',scrollTrigger:{trigger:'.how-hero',start:'top top',end:'bottom top',scrub:1.8}});
    // Section 02 uses AOS for reveal; avoid competing GSAP opacity/transform on the cards.
    // This keeps the cards visible even when AOS/CDN loading is delayed.
    gsap.from('.timeline-window',{x:45,rotate:1.5,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.timeline-window',start:'top 78%',once:true}});
    gsap.to('.ring-one',{rotation:360,ease:'none',scrollTrigger:{trigger:'.how-after',start:'top bottom',end:'bottom top',scrub:2}});
    gsap.to('.ring-two',{rotation:-360,ease:'none',scrollTrigger:{trigger:'.how-after',start:'top bottom',end:'bottom top',scrub:2.5}});
    gsap.to('.loop-node',{y:-7,stagger:.18,repeat:-1,yoyo:true,duration:1.7,ease:'sine.inOut'});
  }

  document.querySelectorAll('.video-controls button').forEach(btn => btn.addEventListener('click', () => {
    btn.animate([{transform:'scale(1)'},{transform:'scale(.9)'},{transform:'scale(1)'}],{duration:220});
  }));
})();
