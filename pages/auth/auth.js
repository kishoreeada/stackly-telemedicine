(() => {
  const page = document.querySelector('.auth-page');
  const form = document.querySelector('[data-auth-form]');
  if (!page || !form) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.AOS) {
    AOS.init({
      duration: 680,
      easing: 'ease-out-cubic',
      once: true,
      offset: 35,
      disable: reduceMotion
    });
  }

  if (window.gsap && !reduceMotion) {
    gsap.from('.auth-form-head > *', { y: 18, opacity: 0, duration: .62, stagger: .07, ease: 'power3.out', delay: .05 });
    gsap.from('.auth-form-card', { y: 24, opacity: 0, duration: .72, ease: 'power3.out', delay: .14 });
    gsap.from('.auth-orbit-card', { y: 22, opacity: 0, scale: .98, duration: .8, ease: 'power3.out', delay: .24 });
    gsap.to('.auth-orbit-card', { y: -5, duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  // Intentionally simple validation for this static mentor/demo project.
  // No duplicate-account check, password verification, hashing or complex
  // password rules are required by the requested UX.
  const emailValid = value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
  const passwordValid = value => value.length >= 6;

  const setError = (field, message) => {
    if (!field) return;
    field.setAttribute('aria-invalid', 'true');
    const error = field.closest('.auth-field')?.querySelector('.auth-field-error');
    if (error) error.textContent = message;
  };

  const clearError = field => {
    if (!field) return;
    field.removeAttribute('aria-invalid');
    const error = field.closest('.auth-field')?.querySelector('.auth-field-error');
    if (error) error.textContent = '';
  };

  const setMessage = (message, state = '') => {
    const el = document.querySelector('.auth-message');
    if (!el) return;
    el.textContent = message;
    if (state) el.dataset.state = state;
    else delete el.dataset.state;
  };

  const clearMessage = () => setMessage('');

  const shakeInvalid = () => {
    if (!window.gsap || reduceMotion) return;
    const invalid = form.querySelectorAll('[aria-invalid="true"]');
    if (invalid.length) gsap.fromTo(invalid, { x: -5 }, { x: 0, duration: .32, ease: 'power2.out', stagger: .025 });
  };

  const focusFirstInvalid = () => form.querySelector('[aria-invalid="true"]')?.focus({ preventScroll: true });

  // Password visibility.
  document.querySelectorAll('[data-password-toggle]').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = document.getElementById(toggle.dataset.passwordToggle);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      const icon = toggle.querySelector('i');
      if (icon) icon.className = show ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
    });
  });

  // Remove stale validation immediately when the user edits a field.
  form.querySelectorAll('input').forEach(field => {
    field.addEventListener('input', () => {
      clearError(field);
      clearMessage();
      if (field.id === 'password' || field.id === 'confirm-password') {
        const password = document.querySelector('#password');
        const confirm = document.querySelector('#confirm-password');
        if (confirm?.value && password?.value && confirm.value === password.value) clearError(confirm);
      }
    });
    field.addEventListener('change', () => clearError(field));
  });

  const submitButton = form.querySelector('.auth-submit');
  const setSubmitting = (isSubmitting, label) => {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    submitButton.innerHTML = isSubmitting
      ? `<i class="fa-solid fa-circle-notch fa-spin"></i> ${label}`
      : (page.dataset.authMode === 'signup' ? 'Create account <span>↗</span>' : 'Log in <span>↗</span>');
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    clearMessage();

    const mode = page.dataset.authMode;
    const email = document.querySelector('#email');
    const pass = document.querySelector('#password');
    const emailValue = email?.value.trim() || '';
    let valid = true;

    if (!emailValid(emailValue)) {
      setError(email, 'Enter a valid email address.');
      valid = false;
    }

    if (!passwordValid(pass?.value || '')) {
      setError(pass, 'Password must be at least 6 characters.');
      valid = false;
    }

    if (mode === 'signup') {
      const name = document.querySelector('#name');
      const confirm = document.querySelector('#confirm-password');

      if (!(name?.value.trim())) {
        setError(name, 'Enter your full name.');
        valid = false;
      }

      if ((confirm?.value || '') !== (pass?.value || '')) {
        setError(confirm, 'Passwords do not match.');
        valid = false;
      }

      if (!valid) {
        setMessage('Please fix the highlighted fields.', 'error');
        focusFirstInvalid();
        shakeInvalid();
        return;
      }

      setSubmitting(true, 'Creating account');

      // Store only the display information needed by the static dashboard.
      localStorage.setItem('stacklyUserEmail', emailValue);
      localStorage.setItem('stacklyUserName', name.value.trim());
      localStorage.setItem('stacklySignupEmail', emailValue);

      window.setTimeout(() => {
        window.location.replace(`login.html?email=${encodeURIComponent(emailValue)}`);
      }, 300);
      return;
    }

    const role = document.querySelector('input[name="role"]:checked');
    const roleGrid = document.querySelector('.auth-role-grid');
    const roleError = document.querySelector('.auth-role-error');

    if (!role) {
      roleGrid?.setAttribute('aria-invalid', 'true');
      if (roleError) roleError.textContent = 'Select a role to continue.';
      valid = false;
    } else {
      roleGrid?.removeAttribute('aria-invalid');
      if (roleError) roleError.textContent = '';
    }

    if (!valid) {
      setMessage('Please fix the highlighted fields.', 'error');
      focusFirstInvalid();
      shakeInvalid();
      return;
    }

    setSubmitting(true, 'Opening dashboard');

    // Requested demo flow: once the email is valid, the password is 6+
    // characters and a role is selected, open the corresponding dashboard.
    localStorage.setItem('stacklyUserEmail', emailValue);
    localStorage.setItem('stacklyUserName', localStorage.getItem('stacklyUserName') || emailValue.split('@')[0]);
    localStorage.setItem('stacklyRole', role.value);
    localStorage.setItem('stacklyAuthSession', JSON.stringify({ email: emailValue, role: role.value }));

    const destination = role.value === 'provider'
      ? '../dashboard/admin.html'
      : '../dashboard/client.html';

    window.setTimeout(() => window.location.assign(destination), 250);
  });

  // Carry signup email into login.
  if (page.dataset.authMode === 'login') {
    const queryEmail = new URLSearchParams(window.location.search).get('email');
    const savedEmail = localStorage.getItem('stacklySignupEmail');
    const emailInput = document.querySelector('#email');
    if (emailInput && !emailInput.value) emailInput.value = queryEmail || savedEmail || '';
  }
})();
