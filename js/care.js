(() => {
  const root = document.querySelector('.care-page');
  if (!root) return;

  if (window.AOS) {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80, disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches });
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.gsap) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    const hero = root.querySelector('.care-dashboard');
    const heroFloatTop = root.querySelector('.care-float-top');
    const heroFloatBottom = root.querySelector('.care-float-bottom');
    if (!reduce && hero) {
      gsap.fromTo(hero, { y: 24, rotate: -4 }, { y: 0, rotate: -4, duration: 1.2, ease: 'power3.out' });
      gsap.to(hero, { y: -10, rotate: -2.8, duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.15 });
      if (heroFloatTop) gsap.to(heroFloatTop, { y: -8, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      if (heroFloatBottom) gsap.to(heroFloatBottom, { y: 8, duration: 3.1, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: .2 });
    }

    const pathCards = root.querySelectorAll('.care-path-card');
    pathCards.forEach((card, index) => {
      card.addEventListener('pointermove', e => {
        if (reduce || window.innerWidth < 821) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        gsap.to(card, { rotateY: x * 3, rotateX: y * -3, transformPerspective: 900, duration: .35, ease: 'power2.out' });
      });
      card.addEventListener('pointerleave', () => {
        if (reduce || window.innerWidth < 821) return;
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: .45, ease: 'power3.out' });
      });
      const activate = () => {
        pathCards.forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
      };
      card.addEventListener('click', activate);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    });

    const journeySteps = [...root.querySelectorAll('.journey-step')];
    const journeyLine = root.querySelector('.journey-line span');
    const detail = root.querySelector('.journey-detail');
    const details = [
      ['01','START','THE FIRST MOMENT','Start with the closest fit.','Search by specialty, availability or the kind of support you are looking for. You don’t need the perfect words.','Simple by design'],
      ['02','BOOK','THE RIGHT TIME','Choose a time that works around you.','Pick an available slot and keep your day intact. Your appointment details stay in one clear place.','Flexible scheduling'],
      ['03','CONNECT','THE CONVERSATION','Meet securely, wherever you are.','Join a private video consultation and focus on the conversation instead of the logistics.','Private by design'],
      ['04','CONTINUE','AFTER THE CALL','Leave with a clearer next step.','Prescriptions, follow-ups and useful context stay connected so you know what happens next.','Care stays connected']
    ];
    const updateJourney = index => {
      journeySteps.forEach((step, i) => step.classList.toggle('is-active', i === index));
      const d = details[index];
      if (journeyLine) {
        if (window.innerWidth <= 720) journeyLine.style.height = `${((index + 1) / 4) * 100}%`;
        else journeyLine.style.width = `${((index + 1) / 4) * 100}%`;
      }
      if (detail) {
        const parts = detail.querySelectorAll('.journey-detail-index span, .journey-detail-index b, .journey-detail-copy>p, .journey-detail-copy h3, .journey-detail-copy>span, .journey-detail-signal span');
        const values = [d[0],d[1],d[2],d[3],d[4],d[5]];
        const set = () => parts.forEach((el,i) => { if (values[i] !== undefined) el.textContent = values[i]; });
        if (!reduce && window.gsap) gsap.timeline().to(parts,{opacity:0,y:6,duration:.16,stagger:.02}).add(set).to(parts,{opacity:1,y:0,duration:.32,stagger:.03,ease:'power2.out'});
        else set();
      }
    };
    journeySteps.forEach((step,index) => step.addEventListener('click', () => updateJourney(index)));
    updateJourney(0);

    const plannerOptions = root.querySelectorAll('.planner-option');
    const result = root.querySelector('[data-planner-result]');
    const resultCopy = root.querySelector('[data-planner-copy]');
    const plannerData = {
      everyday:['General care','Start with a general consultation and let the conversation shape the next step.'],
      ongoing:['Chronic care','Choose ongoing support for conditions that benefit from a connected plan and follow-up.'],
      wellbeing:['Mental wellness','Start with a supportive conversation focused on practical wellbeing and what you need now.'],
      prevention:['Preventive care','Begin with a preventive conversation and build a clearer plan for staying ahead.']
    };
    plannerOptions.forEach(option => option.addEventListener('click', () => {
      plannerOptions.forEach(o => o.classList.remove('is-selected'));
      option.classList.add('is-selected');
      const data = plannerData[option.dataset.option] || plannerData.everyday;
      if (!reduce && window.gsap) gsap.timeline().to([result,resultCopy],{opacity:0,y:5,duration:.15}).add(()=>{result.textContent=data[0];resultCopy.textContent=data[1]}).to([result,resultCopy],{opacity:1,y:0,duration:.3,ease:'power2.out'});
      else { result.textContent=data[0]; resultCopy.textContent=data[1]; }
    }));

    if (!reduce && window.ScrollTrigger) {
      gsap.utils.toArray('.care-path-card').forEach((card, i) => {
        gsap.fromTo(card,{y:35,opacity:0},{y:0,opacity:1,duration:.8,delay:i*.07,ease:'power3.out',scrollTrigger:{trigger:card,start:'top 84%',once:true}});
      });
      gsap.fromTo('.planner-panel',{x:40,opacity:0},{x:0,opacity:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.planner-panel',start:'top 82%',once:true}});
      gsap.fromTo('.close-core',{scale:.82,opacity:.5},{scale:1,opacity:1,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'.close-visual',start:'top 82%',once:true}});
    }
  }
})();
