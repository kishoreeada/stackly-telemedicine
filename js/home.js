document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 70,
      disable: () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".hero h1", {
      y: 35,
      opacity: 0,
      duration: 1.05,
      ease: "power3.out",
      delay: 0.1,
    });
    gsap.to(".orbit-a", {
      rotation: 360,
      duration: 34,
      repeat: -1,
      ease: "none",
    });
    gsap.to(".orbit-b", {
      rotation: -360,
      duration: 26,
      repeat: -1,
      ease: "none",
    });
    gsap.utils.toArray(".care-card-art").forEach((art, i) => {
      const core = art.querySelector(".care-art-core");
      if (core)
        gsap.to(core, {
          y: -6,
          duration: 2.8 + i * 0.15,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.12,
        });
    });
    gsap.utils.toArray(".care-ring").forEach((ring, i) => {
      gsap.to(ring, {
        scale: 1.035,
        opacity: 0.72,
        duration: 2.8 + i * 0.15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.1,
      });
    });
    gsap.to(".route-line:after", {
      x: 260,
      duration: 2.6,
      repeat: -1,
      ease: "none",
    });
    gsap.utils.toArray(".route-node").forEach((node, i) => {
      const icon = node.querySelector("i");
      if (icon)
        gsap.to(icon, {
          y: -4,
          duration: 2.2 + i * 0.12,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.12,
        });
    });
    gsap.utils.toArray(".memory-people span").forEach((el, i) => {
      gsap.to(el, {
        y: -8,
        duration: 1.7 + i * 0.15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.12,
      });
    });
    const hw05Cards = gsap.utils.toArray(".hw05-card");
    const hw05Rail = document.querySelector(".hw05-rail");
    const hw05Dots = hw05Rail ? gsap.utils.toArray(".hw05-rail span") : [];

    if (hw05Cards.length) {
      // Robust reveal: content is never left invisible if ScrollTrigger/AOS timing changes.
      // Keep the cards visible by default; animate only after the section actually enters view.
      hw05Cards.forEach((card) => card.classList.add("hw05-js-ready"));
      const revealHw05 = () => {
        if (revealHw05.done) return;
        revealHw05.done = true;
        gsap.fromTo(
          hw05Cards,
          { opacity: 0, y: 28, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform",
          },
        );
      };
      ScrollTrigger.create({
        trigger: ".hw05-grid",
        start: "top 88%",
        once: true,
        onEnter: revealHw05,
        onEnterBack: revealHw05,
      });
      // Safety fallback: visual content must never remain hidden because of a third-party animation load issue.
      window.setTimeout(() => {
        if (!revealHw05.done) {
          revealHw05.done = true;
          gsap.set(hw05Cards, {
            opacity: 1,
            y: 0,
            scale: 1,
            clearProps: "transform",
          });
        }
      }, 1400);

      const activateStep = (card, animate = true) => {
        const step = Number(card.dataset.step || 1);
        hw05Cards.forEach((item) =>
          item.classList.toggle("is-active", item === card),
        );
        hw05Dots.forEach((dot, index) =>
          dot.classList.toggle("is-active", index + 1 === step),
        );
        if (hw05Rail) hw05Rail.dataset.active = String(step);

        if (
          animate &&
          window.gsap &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          const icon = card.querySelector(".hw05-icon");
          const tags = card.querySelectorAll(".hw05-meta span");
          if (icon)
            gsap.fromTo(
              icon,
              { scale: 0.92, rotate: -4 },
              { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" },
            );
          if (tags.length)
            gsap.fromTo(
              tags,
              { y: 7, opacity: 0.45 },
              {
                y: 0,
                opacity: 1,
                duration: 0.35,
                stagger: 0.05,
                ease: "power2.out",
              },
            );
        }
      };

      activateStep(hw05Cards[0], false);

      hw05Cards.forEach((card) => {
        card.addEventListener("mouseenter", () => activateStep(card));
        card.addEventListener("focus", () => activateStep(card));
        card.addEventListener("click", () => activateStep(card));
        card.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activateStep(card);
          }
        });

        // Premium pointer-light interaction inside each card.
        card.addEventListener("pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty(
            "--mx",
            `${((event.clientX - rect.left) / rect.width) * 100}%`,
          );
          card.style.setProperty(
            "--my",
            `${((event.clientY - rect.top) / rect.height) * 100}%`,
          );
        });
      });

      if (hw05Dots.length) {
        hw05Dots.forEach((dot, index) => {
          dot.classList.toggle("is-active", index === 0);
          dot.addEventListener("click", () => activateStep(hw05Cards[index]));
        });
      }
    }
  }
});
