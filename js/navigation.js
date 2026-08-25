(() => {
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector(".mobile-navigation");
  const openButton = document.querySelector(".menu-button");
  const closeButton = document.querySelector(".close-button");
  const page = document.body.dataset.page || "home";

  document
    .querySelectorAll(`[data-nav="${page}"]`)
    .forEach((link) => link.classList.add("is-active"));

  const onScroll = () =>
    header?.classList.toggle("is-scrolled", window.scrollY > 14);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggleMenu = (open) => {
    if (!menu || !openButton) return;
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    openButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  };

  openButton?.addEventListener("click", () => toggleMenu(true));
  closeButton?.addEventListener("click", () => toggleMenu(false));
  menu
    ?.querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleMenu(false);
  });

  // Published-site safety: never leave a user on a dead '#' placeholder.
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.href =
      (window.location.pathname.includes("/pages/") ? "../" : "") + "404.html";
  });

  // Newsletter forms: only a valid email is accepted. Invalid input is
  // clearly highlighted; valid input intentionally routes to the single 404 page.
  document.querySelectorAll(".newsletter").forEach((form) => {
    const email = form.querySelector('input[type="email"]');
    if (!email) return;

    // Keep the error message physically inside the form so it can never be
    // lost behind the footer/CTA layout or pushed outside the form flow.
    let message = form.querySelector(".newsletter-message");
    if (!message) {
      message = document.createElement("p");
      message.className = "newsletter-message";
      message.setAttribute("aria-live", "polite");
      message.setAttribute("role", "alert");
      form.appendChild(message);
    } else {
      message.setAttribute("role", "alert");
    }

    const setError = (text) => {
      form.classList.add("has-error");
      email.setAttribute("aria-invalid", "true");
      if (!message.id) {
        message.id = `newsletter-error-${Math.random().toString(36).slice(2, 9)}`;
      }
      email.setAttribute("aria-describedby", message.id);
      message.textContent = text;
      message.hidden = false;
    };

    const clearError = () => {
      form.classList.remove("has-error");
      email.removeAttribute("aria-invalid");
      email.removeAttribute("aria-describedby");
      if (message) {
        message.textContent = "";
        message.hidden = true;
      }
    };

    clearError();

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = email.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);

      if (!valid) {
        setError(
          value
            ? "Please enter a valid email address."
            : "Please enter your email address.",
        );
        email.focus({ preventScroll: true });
        return;
      }

      clearError();

      // Clear newsletter input before navigation
      form.reset();

      const target = window.location.pathname.includes("/pages/")
        ? "../404.html"
        : "404.html";
      window.location.assign(target);
    });

    email.addEventListener("input", () => {
      if (form.classList.contains("has-error")) clearError();
    });

    email.addEventListener("blur", () => {
      const value = email.value.trim();
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value)) {
        setError("Please enter a valid email address.");
      }
    });
  });
})();
