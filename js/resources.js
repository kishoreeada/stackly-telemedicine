(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.AOS) {
    AOS.init({
      duration: 760,
      easing: 'ease-out-cubic',
      once: true,
      offset: 70,
      disable: reduceMotion
    });
  }

  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Deliberately transform-only: AOS owns visibility so there is no opacity conflict.
    gsap.utils.toArray('.resource-hero-visual .hero-orbit').forEach((orbit, i) => {
      gsap.to(orbit, {
        rotation: i ? -12 : 9,
        x: i ? -16 : 12,
        y: i ? 12 : -10,
        duration: 7 + i,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    });

    gsap.to('.hero-image-frame', {
      y: -16,
      rotation: -1,
      ease: 'none',
      scrollTrigger: { trigger: '.resources-hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
    });

    gsap.utils.toArray('.library-art').forEach((art) => {
      gsap.to(art, {
        y: -8,
        ease: 'none',
        scrollTrigger: { trigger: art, start: 'top 90%', end: 'bottom 20%', scrub: 1.4 }
      });
    });

    gsap.to('.cta-orbit-a', { rotation: 360, duration: 34, repeat: -1, ease: 'none' });
    gsap.to('.cta-orbit-b', { rotation: -360, duration: 48, repeat: -1, ease: 'none' });
  }

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.library-card')];
  const count = document.querySelector('#library-count');
  const empty = document.querySelector('#library-empty');
  const search = document.querySelector('#resource-search');

  const applyFilter = (filter = 'all', query = '') => {
    const term = query.trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const matchesFilter = filter === 'all' || card.dataset.category === filter;
      const matchesSearch = !term || card.dataset.search.includes(term) || card.textContent.toLowerCase().includes(term);
      const show = matchesFilter && matchesSearch;
      card.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });
    if (count) count.textContent = `${String(visible).padStart(2, '0')} resources`;
    if (empty) empty.hidden = visible !== 0;
    if (window.AOS) AOS.refreshHard();
  };

  let activeFilter = 'all';
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach(btn => {
        const active = btn === button;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      applyFilter(activeFilter, search?.value || '');
    });
  });

  search?.addEventListener('input', () => applyFilter(activeFilter, search.value));
  document.querySelector('#hero-search-button')?.addEventListener('click', () => {
    document.querySelector('#library')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    search?.focus();
  });

  document.querySelectorAll('[data-filter-jump]').forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.filterJump;
      const filter = filterButtons.find(btn => btn.dataset.filter === target);
      filter?.click();
      document.querySelector('#library')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const answerItems = [...document.querySelectorAll('.answer-item')];
  const setAnswerState = (item, open) => {
    const panel = item.querySelector('.answer-panel');
    item.classList.toggle('is-open', open);
    item.setAttribute('aria-expanded', String(open));
    if (window.gsap && !reduceMotion && panel) {
      gsap.killTweensOf(panel);
      gsap.to(panel, {
        height: open ? 'auto' : 0,
        opacity: open ? 1 : 0,
        paddingTop: open ? 13 : 0,
        duration: .42,
        ease: 'power2.out'
      });
    } else if (panel) {
      panel.style.height = open ? 'auto' : '0px';
      panel.style.opacity = open ? '1' : '0';
      panel.style.paddingTop = open ? '13px' : '0';
    }
  };

  answerItems.forEach(item => {
    item.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      answerItems.forEach(other => setAnswerState(other, false));
      if (!open) setAnswerState(item, true);
    });
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        item.click();
      }
    });
  });
  answerItems.forEach(item => setAnswerState(item, item.classList.contains('is-open')));

  document.querySelectorAll('.featured-main-media button').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('is-saved');
      const icon = button.querySelector('i');
      icon?.classList.toggle('fa-regular', !button.classList.contains('is-saved'));
      icon?.classList.toggle('fa-solid', button.classList.contains('is-saved'));
    });
  });

})();
