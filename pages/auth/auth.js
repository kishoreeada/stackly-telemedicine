(() => {
  const page = document.querySelector('.auth-page');
  const form = document.querySelector('[data-auth-form]');
  if (!page || !form) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.AOS) {
    AOS.init({ duration: 720, easing: 'ease-out-cubic', once: true, offset: 45, disable: reduceMotion });
  }

  if (window.gsap && !reduceMotion) {
    gsap.from('.auth-form-card', { y: 28, opacity: 0, duration: .8, ease: 'power3.out', delay: .12 });
    gsap.from('.auth-form-head > *', { y: 18, opacity: 0, duration: .65, stagger: .07, ease: 'power3.out', delay: .05 });
    gsap.from('.auth-orbit-card', { y: 28, opacity: 0, scale: .97, duration: .9, ease: 'power3.out', delay: .25 });
    gsap.to('.auth-orbit-card', { y: -5, duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

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

  const password = document.querySelector('#password');
  const strength = document.querySelector('[data-password-strength]');
  const strengthLabel = document.querySelector('[data-strength-label]');
  const updateStrength = () => {
    if (!password || !strength) return;
    const value = password.value;
    let score = 0;
    if (value.length >= 6) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    strength.dataset.level = String(score);
    if (strengthLabel) strengthLabel.textContent = ['','Weak','Fair','Good','Strong'][score] || '';
  };
  password?.addEventListener('input', updateStrength);
  updateStrength();

  const setError = (field, message) => {
    field?.setAttribute('aria-invalid', 'true');
    const error = field?.closest('.auth-field')?.querySelector('.auth-field-error');
    if (error) error.textContent = message;
  };
  const clearError = field => {
    field?.removeAttribute('aria-invalid');
    const error = field?.closest('.auth-field')?.querySelector('.auth-field-error');
    if (error) error.textContent = '';
  };
  const emailValid = value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
  const passwordValid = value => value.length >= 6 && /[A-Z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
  const nameValid = value => /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(value);

  form.querySelectorAll('input,select').forEach(field => {
    field.addEventListener('input', () => { clearError(field); if (field.id === 'terms') { field.removeAttribute('aria-invalid'); const e=document.querySelector('.auth-terms-error'); if(e)e.textContent=''; } });
    field.addEventListener('change', () => { clearError(field); if (field.name === 'role') document.querySelector('.auth-role-grid')?.removeAttribute('aria-invalid'); if (field.id === 'terms') { field.removeAttribute('aria-invalid'); const e=document.querySelector('.auth-terms-error'); if(e)e.textContent=''; } });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const mode = page.dataset.authMode;
    let valid = true;
    const email = document.querySelector('#email');
    const pass = document.querySelector('#password');
    const role = document.querySelector('input[name="role"]:checked');
    const message = document.querySelector('.auth-message');

    if (mode === 'signup') {
      const name = document.querySelector('#name');
      const confirm = document.querySelector('#confirm-password');
      const terms = document.querySelector('#terms');
      if (!nameValid(name?.value.trim() || '')) { setError(name, 'Use letters, spaces, apostrophes or hyphens only.'); valid = false; }
      if (!emailValid(email?.value.trim() || '')) { setError(email, 'Enter a valid email address.'); valid = false; }
      if (!passwordValid(pass?.value || '')) { setError(pass, 'Use 6+ characters with 1 uppercase letter, 1 number and 1 special character.'); valid = false; }
      if ((confirm?.value || '') !== (pass?.value || '')) { setError(confirm, 'Passwords do not match.'); valid = false; }
      if (!terms?.checked) {
        terms?.setAttribute('aria-invalid','true');
        const termsError = document.querySelector('.auth-terms-error');
        if (termsError) termsError.textContent='Please accept the Terms and Privacy Policy to continue.';
        valid = false;
      }
    } else {
      if (!emailValid(email?.value.trim() || '')) { setError(email, 'Enter a valid email address.'); valid = false; }
      if (!pass?.value) { setError(pass, 'Enter your password.'); valid = false; }
      if (!role) {
        document.querySelector('.auth-role-grid')?.setAttribute('aria-invalid','true');
        if (message) { message.dataset.state='error'; message.textContent='Choose your account type to continue.'; }
        valid = false;
      }
    }

    if (!valid) {
      if (message && !message.textContent) { message.dataset.state='error'; message.textContent='Please review the highlighted fields.'; }
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      firstInvalid?.focus({ preventScroll: true });
      if (window.gsap && !reduceMotion) gsap.fromTo(form.querySelectorAll('[aria-invalid="true"]'), { x: -4 }, { x: 0, duration: .32, ease: 'power2.out', stagger: .03 });
      return;
    }

    if (message) { message.dataset.state='success'; message.textContent = mode === 'signup' ? 'Account created. Taking you to secure sign in…' : 'Signed in successfully. Opening your dashboard…'; }
    const submit = form.querySelector('.auth-submit');
    if (submit) {
      submit.disabled = true;
      const original = submit.innerHTML;
      submit.innerHTML = '<i class="fa-solid fa-check"></i> ' + (mode === 'signup' ? 'Account created' : 'Signed in');
      if (mode === 'signup') {
        localStorage.setItem('stacklySignupEmail', email.value.trim());
        window.setTimeout(() => { localStorage.setItem('stacklyUserName', name?.value.trim() || '');
        window.location.href = 'login.html?email=' + encodeURIComponent(email.value.trim()); }, 850);
      } else {
        const destination = role.value === 'provider' ? '../dashboard/admin.html' : '../dashboard/client.html';
        localStorage.setItem('stacklyUserEmail', email.value.trim());
        localStorage.setItem('stacklyRole', role.value);
        window.setTimeout(() => { window.location.href = destination; }, 850);
      }
    }
  });

  const queryEmail = new URLSearchParams(window.location.search).get('email');
  if (page.dataset.authMode === 'login' && queryEmail) { const emailInput=document.querySelector('#email'); if(emailInput) emailInput.value=queryEmail; }

  const recoveryDialog = document.querySelector('[data-recovery-dialog]');
  const recoveryOpen = document.querySelector('[data-recovery-open]');
  const recoveryClose = document.querySelector('[data-recovery-close]');
  recoveryOpen?.addEventListener('click', () => {
    if (typeof recoveryDialog?.showModal === 'function') recoveryDialog.showModal();
  });
  recoveryClose?.addEventListener('click', () => recoveryDialog?.close());
  recoveryDialog?.addEventListener('click', event => {
    if (event.target === recoveryDialog) recoveryDialog.close();
  });
  document.querySelector('[data-recovery-form]')?.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.querySelector('#recovery-email');
    const msg = document.querySelector('[data-recovery-message]');
    if (!emailValid(input?.value.trim() || '')) {
      input?.setAttribute('aria-invalid','true');
      if (msg) { msg.dataset.state='error'; msg.textContent='Enter a valid email address.'; }
      input?.focus();
      return;
    }
    input?.removeAttribute('aria-invalid');
    if (msg) { msg.dataset.state='success'; msg.textContent='Recovery request ready. Check your inbox for the next step.'; }
  });


  document.querySelectorAll('[data-legal-open]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const dialog = document.querySelector(`[data-legal-dialog="${trigger.dataset.legalOpen}"]`);
      if (typeof dialog?.showModal === 'function') dialog.showModal();
    });
  });
  document.querySelectorAll('[data-legal-dialog]').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target === dialog || event.target.closest('[data-legal-close]')) dialog.close();
    });
  });

})();
