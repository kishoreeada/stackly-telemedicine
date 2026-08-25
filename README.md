# Stackly — Phase 01 Revised Production Foundation

This revision addresses the visual issues identified in the first review:
- Desktop header now has controlled, intentional outer spacing.
- At <=820px the header becomes full viewport width with no side gaps.
- Mobile navigation is a true full-screen surface.
- Footer spacing, column balance and visual hierarchy were redesigned.
- Footer retains all five primary navigation links and active-state behavior.
- Footer contact/newsletter area has stronger editorial hierarchy.
- Newsletter validation remains functional.
- Responsive layouts are explicitly handled at desktop, tablet and mobile widths.

Open `index.html` with VS Code Live Server.

This is still only the foundation milestone; the landing page, auth and dashboards are intentionally not included yet.


## Review revision — logo, icons, typography and active states

- Replaced the CSS-made placeholder lightning/wordmark with a dedicated Stackly SVG lockup.
- Footer logo uses the supplied reference direction with theme-adaptive color.
- Added Font Awesome brand icons for social links and solid icons for phone/location.
- Primary navigation active state is now a background highlight with a restrained underline.
- Footer active state is now a filled highlight row rather than a loose line.
- Updated typography to DM Sans for body/UI and Manrope for display treatment.


## Final foundation review
Status: READY FOR PHASE 02 — LANDING PAGE.

## Auth flow — final review

The signup/login pages use the Stackly reference wordmark supplied for this project and are isolated under `pages/auth/`.

- Signup has no role selector.
- Login requires a role selection.
- Signup validates name, email, password, confirmation and Terms/Privacy acceptance.
- Successful signup stores a demo account in browser storage and redirects to login.
- Login validates the stored demo account and redirects to the selected dashboard.
- Patient → `pages/dashboard/client.html`.
- Care professional → `pages/dashboard/admin.html`.
- Invalid fields receive visible error styling and inline messages.
- Logout remains controlled by the existing dashboard authentication flow.
- The auth UI is responsive across desktop, tablet and mobile widths.
- AOS and GSAP remain enabled with reduced-motion handling.

**Static-demo limitation:** browser storage is used only because this project is a frontend/static submission. Real production authentication must move credential handling, sessions and password recovery to a secure backend.

## Authentication / Branding QA Update — 25 Aug 2026

- Signup does not expose role selection.
- Login requires Patient or Care professional selection and routes to the matching dashboard.
- Login supports accounts created by the current and earlier static-auth versions.
- If the static demo is opened directly on Login without a stored account, a valid email/password entry provisions a local demo account so the mentor workflow remains testable.
- Successful authentication stores the selected role/session and opens the appropriate dashboard.
- The supplied Stackly reference was used only as the logo structure. The mark/wordmark was converted into local SVG artwork and recolored to the Stackly healthcare palette.
- Light-background headers/auth use the teal gradient logo; dark footer/dashboard surfaces use the white version.
- The reference raster is not used by any page.


## Dashboard UI QA — August 2026
- Desktop/laptop: sidebar close control is hidden; sidebar stays fixed.
- Mobile: hamburger opens the sidebar and the close control is available only there.
- Header profile is intentionally static: circular first initial + signed-in email only; no profile dropdown.
- Dashboard sidebar contains navigation and logout only; no help/account card.
- Shared dashboard spacing/alignment is controlled from `pages/dashboard/dashboard.css` across all 12 dashboard pages.
