(() => {
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector(".mobile-navigation");
  const openButton = document.querySelector(".menu-button");
  const closeButton = document.querySelector(".close-button");
  const page = document.body.dataset.page || "home";

  document.querySelectorAll(`[data-nav="${page}"]`).forEach(link => link.classList.add("is-active"));

  const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 14);
  onScroll();
  window.addEventListener("scroll", onScroll, {passive:true});

  const toggleMenu = (open) => {
    if (!menu || !openButton) return;
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    openButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  };

  openButton?.addEventListener("click", () => toggleMenu(true));
  closeButton?.addEventListener("click", () => toggleMenu(false));
  menu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => toggleMenu(false)));

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") toggleMenu(false);
  });


  // Published-site safety: never leave a user on a dead '#' placeholder.
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.href = (window.location.pathname.includes('/pages/') ? '../' : '') + '404.html';
  });

  const newsletter = document.querySelector(".newsletter");
  const email = document.querySelector("#email");
  const message = document.querySelector(".newsletter-message");

  newsletter?.addEventListener("submit", e => {
    e.preventDefault();
    const value = email.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
    if (!valid) {
      email.setAttribute("aria-invalid","true");
      message.textContent = "Please enter a valid email address.";
      return;
    }
    email.removeAttribute("aria-invalid");
    message.textContent = "Thank you — you're connected.";
    newsletter.reset();
  });

  email?.addEventListener("input", () => {
    email.removeAttribute("aria-invalid");
    if (message) message.textContent = "";
  });
})();
