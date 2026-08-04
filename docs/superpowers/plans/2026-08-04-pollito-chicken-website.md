# Pollito Chicken Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, mobile-first, single-page French-language website for Pollito Chicken (Salé) matching `docs/superpowers/specs/2026-08-04-pollito-chicken-website-design.md`.

**Architecture:** Plain HTML5 + hand-authored CSS (custom-property design tokens) + vanilla JS. No framework, no build step, no backend. Ordering is click-to-call only (`tel:+212538107053`). A single inline SVG icon sprite (defined once in `index.html`) is reused via `<use>` across all sections to avoid duplicating icon markup.

**Tech Stack:** HTML5, CSS3 (custom properties, Grid/Flexbox), vanilla JavaScript (ES6, `IntersectionObserver`), Google Fonts (Fredoka + Nunito), Google Maps no-API-key embed.

## Global Constraints

- Language: French only. All copy in the site must be French.
- Ordering: `tel:+212538107053` only. No WhatsApp link, no Glovo link, no cart/checkout — confirmed explicitly by user.
- Colors: `--color-primary:#E31E24` `--color-primary-dark:#A81419` `--color-cream:#FFF8F0` `--color-ink:#1A1A1A` `--color-gold:#F5A623` `--color-white:#FFFFFF`
- Fonts: Fredoka (headings), Nunito (body), base 16px, line-height 1.5
- Breakpoints: 375 / 768 / 1024 / 1440, mobile-first (`min-width` media queries), no horizontal scroll at any width
- Accessibility: 4.5:1 text contrast minimum, visible focus states, keyboard-navigable nav/tabs, `alt` text on every `<img>`, respects `prefers-reduced-motion`
- Touch targets ≥ 44×44px
- No emoji as icons — inline SVG only
- Hours: tous les jours, 12h00–01h00. Address: Salé 11000, Maroc (coords `34.0656571,-6.8019299`)
- All menu items/prices must exactly match the tables in the spec — do not invent, rename, or reprice items

## File Structure

```
polito website/
├── index.html          # all sections, single page
├── css/
│   └── styles.css       # design tokens + all styles
├── js/
│   └── main.js           # nav toggle, menu tabs, smooth scroll, scroll-reveal
├── assets/images/        # web-ready copies of brand assets (already populated)
│   ├── logo.jpg
│   ├── menu-bokka.png
│   ├── menu-burgers.png
│   ├── menu-crunchy.png
│   ├── menu-tacos.png
│   └── menu-plats.jpeg
└── media/                 # original source flyers (untouched, reference only)
```

Note on the flyer images: rather than physically cropping them (no image-processing
tool is available in this environment), each is used as a supplementary "poster" visual
inside its menu tab AND in the gallery — real, accessible HTML text/price cards carry
the actual menu data alongside it, so screen readers and text-resize never depend on
the baked-in flyer text. This satisfies the spec's accessibility goal via a simpler
mechanism than cropping.

---

### Task 1: Scaffold — HTML skeleton, icon sprite, design tokens, base CSS

**Files:**
- Create: `index.html`
- Create: `css/styles.css`
- Create: `js/main.js` (empty stub, populated in later tasks)

**Interfaces:**
- Produces: CSS custom properties (`--color-primary`, `--color-primary-dark`, `--color-cream`, `--color-ink`, `--color-gold`, `--color-white`, `--font-heading`, `--font-body`, `--space-xs/sm/md/lg/xl`, `--radius-sm/md/lg`, `--shadow-card`, `--transition-base`) that every later task's CSS relies on.
- Produces: `.container`, `.btn`/`.btn-primary`/`.btn-secondary`/`.btn-call`, `.section-title`, `.section-subtitle`, `.reveal`/`.reveal.is-visible` utility classes used by every later section.
- Produces: SVG icon sprite with symbol ids `icon-phone`, `icon-clock`, `icon-flame`, `icon-star`, `icon-pin`, `icon-instagram`, `icon-menu`, `icon-close` — later tasks reference these via `<svg class="icon"><use href="#icon-x"/></svg>`.

- [ ] **Step 1: Create `index.html` with document head, icon sprite, and empty section shells**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pollito Chicken — Salé | Poulet Frit & Fast-Food</title>
  <meta name="description" content="Pollito Chicken à Salé : bokka, burgers, tacos, crunchy et plats de poulet frit croustillant. Ouvert tous les jours de 12h à 1h. Commandez par téléphone au 05 38 10 70 53.">
  <link rel="icon" type="image/jpeg" href="assets/images/logo.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <!-- Reusable icon sprite: referenced via <use href="#icon-x"/> throughout the page -->
  <svg style="display:none" aria-hidden="true">
    <symbol id="icon-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </symbol>
    <symbol id="icon-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </symbol>
    <symbol id="icon-flame" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17a2.5 2.5 0 0 0 2.5-2.5c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7.5 7.5 0 1 1-15 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </symbol>
    <symbol id="icon-star" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </symbol>
    <symbol id="icon-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </symbol>
    <symbol id="icon-instagram" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </symbol>
    <symbol id="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </symbol>
    <symbol id="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </symbol>
  </svg>

  <header class="site-header" id="top"><!-- Task 2 --></header>

  <main>
    <section class="hero" id="accueil"><!-- Task 3 --></section>
    <div class="trust-strip"><!-- Task 3 --></div>
    <section class="menu" id="menu"><!-- Task 4 --></section>
    <section class="histoire" id="histoire"><!-- Task 5 --></section>
    <section class="galerie" id="galerie"><!-- Task 6 --></section>
    <section class="offres" id="offres"><!-- Task 7 --></section>
    <section class="contact" id="contact"><!-- Task 8 --></section>
  </main>

  <footer class="site-footer"><!-- Task 9 --></footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `css/styles.css` with tokens, reset, and shared utility classes**

```css
/* ===== Design Tokens ===== */
:root {
  --color-primary: #E31E24;
  --color-primary-dark: #A81419;
  --color-cream: #FFF8F0;
  --color-ink: #1A1A1A;
  --color-gold: #F5A623;
  --color-white: #FFFFFF;

  --font-heading: 'Fredoka', sans-serif;
  --font-body: 'Nunito', sans-serif;

  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 48px;
  --space-xl: 80px;

  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;

  --shadow-card: 0 4px 16px rgba(26, 26, 26, 0.08);
  --transition-base: 200ms ease;
}

/* ===== Reset ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  background: var(--color-cream);
  color: var(--color-ink);
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }
h1, h2, h3, h4 { font-family: var(--font-heading); line-height: 1.2; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }
.icon { width: 22px; height: 22px; flex-shrink: 0; }

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-sm);
}

section { padding: var(--space-xl) 0; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

a:focus-visible, button:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 2px;
}

/* ===== Buttons ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: 14px 28px;
  border-radius: var(--radius-md);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 1rem;
  min-height: 44px;
  transition: transform var(--transition-base), box-shadow var(--transition-base), background var(--transition-base);
}
.btn-primary { background: var(--color-white); color: var(--color-primary); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-card); }
.btn-secondary { background: transparent; color: var(--color-white); border: 2px solid var(--color-white); }
.btn-secondary:hover { background: rgba(255, 255, 255, 0.15); }
.btn-call { background: var(--color-primary); color: var(--color-white); }
.btn-call:hover { background: var(--color-primary-dark); transform: translateY(-2px); }

/* ===== Section headings ===== */
.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: var(--color-primary);
  text-align: center;
  margin-bottom: var(--space-sm);
}
.section-subtitle {
  text-align: center;
  max-width: 560px;
  margin: 0 auto var(--space-lg);
  color: #555;
}

/* ===== Scroll reveal ===== */
.reveal { opacity: 0; transform: translateY(24px); transition: opacity 500ms ease, transform 500ms ease; }
.reveal.is-visible { opacity: 1; transform: translateY(0); }
```

- [ ] **Step 3: Create empty `js/main.js` stub**

```js
// Populated in Tasks 2, 4, and 10 (nav toggle, menu tabs, scroll reveal)
```

- [ ] **Step 4: Verify in browser**

Open `index.html` directly in the Browser pane (`mcp__Claude_Browser__preview_start` with the file path, or `navigate` to `file:///C:/Users/ayman/polito website/index.html`). Confirm:
- Page loads with cream background, no console errors
- `read_console_messages` shows no 404s for the Google Fonts request or `css/styles.css`

- [ ] **Step 5: Commit**

Not a git repo yet — skip commit for this task (see plan note below). If the user initializes git before/after this task, commit with:

```bash
git add index.html css/styles.css js/main.js
git commit -m "scaffold: HTML skeleton, icon sprite, design tokens"
```

---

### Task 2: Header + mobile navigation

**Files:**
- Modify: `index.html` (replace `<header class="site-header" id="top"><!-- Task 2 --></header>`)
- Modify: `css/styles.css` (append header styles)
- Modify: `js/main.js` (append nav toggle logic)

**Interfaces:**
- Consumes: `.icon` class and `#icon-menu`/`#icon-close` symbols from Task 1; `--color-*`/`--space-*` tokens from Task 1.
- Produces: `#main-nav` (nav element toggled by `.is-open`), `#nav-toggle` (button toggled by `.is-active`) — no later task depends on these directly, but they must keep these exact ids since this step's JS binds to them.

- [ ] **Step 1: Replace the header placeholder in `index.html`**

```html
<header class="site-header" id="top">
  <div class="container header-inner">
    <a href="#top" class="logo-link" aria-label="Pollito Chicken — Accueil">
      <img src="assets/images/logo.jpg" alt="Pollito Chicken" class="logo-img">
    </a>

    <nav class="main-nav" id="main-nav" aria-label="Navigation principale">
      <ul>
        <li><a href="#menu">Menu</a></li>
        <li><a href="#histoire">Notre Histoire</a></li>
        <li><a href="#galerie">Galerie</a></li>
        <li><a href="#offres">Offres</a></li>
        <li><a href="#contact">Nous Trouver</a></li>
      </ul>
    </nav>

    <div class="header-actions">
      <a href="tel:+212538107053" class="btn btn-call header-call-btn">
        <svg class="icon"><use href="#icon-phone"/></svg>
        <span>05 38 10 70 53</span>
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="main-nav">
        <svg class="icon nav-toggle-icon-open"><use href="#icon-menu"/></svg>
        <svg class="icon nav-toggle-icon-close"><use href="#icon-close"/></svg>
      </button>
    </div>
  </div>
</header>
```

- [ ] **Step 2: Append header CSS to `css/styles.css`**

```css
/* ===== Header ===== */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-white);
  box-shadow: var(--shadow-card);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding-top: var(--space-xs);
  padding-bottom: var(--space-xs);
}
.logo-img { width: 56px; height: 56px; border-radius: var(--radius-sm); object-fit: cover; }

.main-nav ul { display: flex; gap: var(--space-md); }
.main-nav a {
  font-family: var(--font-heading);
  font-weight: 600;
  padding: var(--space-xs) 0;
  transition: color var(--transition-base);
}
.main-nav a:hover { color: var(--color-primary); }

.header-actions { display: flex; align-items: center; gap: var(--space-sm); }
.header-call-btn span { display: none; }
.nav-toggle {
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  position: relative;
}
.nav-toggle-icon-close { display: none; }
.nav-toggle.is-active .nav-toggle-icon-open { display: none; }
.nav-toggle.is-active .nav-toggle-icon-close { display: block; }

@media (min-width: 768px) {
  .header-call-btn span { display: inline; }
}

@media (max-width: 767px) {
  .nav-toggle { display: inline-flex; }
  .main-nav {
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    background: var(--color-white);
    box-shadow: var(--shadow-card);
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--transition-base);
  }
  .main-nav.is-open { max-height: 400px; }
  .main-nav ul { flex-direction: column; gap: 0; padding: var(--space-sm); }
  .main-nav a { display: block; padding: var(--space-sm); }
}
```

- [ ] **Step 3: Append nav toggle logic to `js/main.js`**

```js
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Ouvrir le menu');
    });
  });
}
```

- [ ] **Step 4: Verify in browser**

Reload the page. Resize to 375px width (`resize_window` with `preset: mobile`): confirm the hamburger button appears and the nav links are hidden. Click the hamburger (`computer` `left_click`) and confirm the nav drops open; click a link and confirm it closes. Resize to 1280px (`preset: desktop`) and confirm the nav shows inline with no hamburger. Use `read_page` to confirm the call button's `href` is exactly `tel:+212538107053`.

- [ ] **Step 5: Commit** (once git is initialized)

```bash
git add index.html css/styles.css js/main.js
git commit -m "feat: sticky header with mobile nav toggle"
```

---

### Task 3: Hero + trust strip

**Files:**
- Modify: `index.html` (replace hero and trust-strip placeholders)
- Modify: `css/styles.css` (append hero/trust styles)

**Interfaces:**
- Consumes: `.btn`, `.btn-primary`, `.btn-secondary`, `.icon`, `#icon-clock`/`#icon-flame`/`#icon-star`/`#icon-pin`, `.reveal` from Task 1.

- [ ] **Step 1: Replace hero and trust-strip placeholders in `index.html`**

```html
<section class="hero" id="accueil">
  <div class="container hero-inner">
    <div class="hero-content reveal">
      <p class="hero-eyebrow">Salé · Poulet Frit</p>
      <h1>Du poulet croustillant,<br>livré avec passion.</h1>
      <p class="hero-text">Bokka, burgers, tacos, crunchy et plats généreux — fait minute, tous les jours de 12h à 1h.</p>
      <div class="hero-actions">
        <a href="tel:+212538107053" class="btn btn-primary">Commander Maintenant</a>
        <a href="#menu" class="btn btn-secondary">Voir le Menu</a>
      </div>
    </div>
    <div class="hero-media reveal">
      <img src="assets/images/logo.jpg" alt="Pollito Chicken" class="hero-img">
    </div>
  </div>
</section>

<div class="trust-strip">
  <div class="container trust-inner">
    <div class="trust-item"><svg class="icon"><use href="#icon-clock"/></svg><span>Ouvert jusqu'à 1h</span></div>
    <div class="trust-item"><svg class="icon"><use href="#icon-flame"/></svg><span>Fait minute</span></div>
    <div class="trust-item"><svg class="icon"><use href="#icon-star"/></svg><span>4.3★ sur Google</span></div>
    <div class="trust-item"><svg class="icon"><use href="#icon-pin"/></svg><span>Salé 11000</span></div>
  </div>
</div>
```

- [ ] **Step 2: Append hero/trust CSS to `css/styles.css`**

```css
/* ===== Hero ===== */
.hero {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: var(--color-white);
  padding-top: var(--space-xl);
  padding-bottom: var(--space-xl);
}
.hero-inner {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: var(--space-lg);
}
.hero-eyebrow {
  font-family: var(--font-heading);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: var(--space-xs);
}
.hero-content h1 { font-size: clamp(2rem, 6vw, 3.25rem); margin-bottom: var(--space-sm); }
.hero-text { max-width: 480px; margin-bottom: var(--space-md); font-size: 1.125rem; }
.hero-actions { display: flex; flex-wrap: wrap; gap: var(--space-sm); }
.hero-media { width: 220px; }
.hero-img { border-radius: var(--radius-lg); box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25); }

@media (min-width: 768px) {
  .hero-inner { flex-direction: row; justify-content: space-between; text-align: left; }
  .hero-media { width: 320px; }
}

/* ===== Trust strip ===== */
.trust-strip { background: var(--color-white); border-bottom: 1px solid #F0E4DB; }
.trust-inner {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  padding: var(--space-md) 0;
}
.trust-item { display: flex; align-items: center; gap: var(--space-xs); font-family: var(--font-heading); font-weight: 600; color: var(--color-ink); }
.trust-item .icon { color: var(--color-primary); }

@media (min-width: 768px) {
  .trust-inner { grid-template-columns: repeat(4, 1fr); justify-items: center; }
}
```

- [ ] **Step 3: Verify in browser**

At 375px and 1280px widths, confirm the hero renders with no horizontal scroll, both CTA buttons are visible and ≥44px tall, and clicking "Voir le Menu" scrolls to the (still-empty) `#menu` section. Confirm the trust strip shows 2 columns on mobile and 4 on desktop.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: hero section and trust strip"
```

---

### Task 4: Menu section — tabs (JS) and all 5 categories' content

**Files:**
- Modify: `index.html` (replace menu placeholder)
- Modify: `css/styles.css` (append menu styles)
- Modify: `js/main.js` (append tab-switching logic)

**Interfaces:**
- Consumes: `.section-title`, `.section-subtitle`, `.reveal` from Task 1.
- Produces: `.menu-tab[data-target]` / `.menu-panel[id]` pattern — no later task depends on this, but keep ids/classes consistent since this task's own JS binds `data-target` to panel `id`.

This is the largest task: one shell + tab-switcher, then five categories of real menu data transcribed from `docs/superpowers/specs/2026-08-04-pollito-chicken-website-design.md`. Prices and item names must match that table exactly.

- [ ] **Step 1: Replace the menu placeholder in `index.html`**

```html
<section class="menu" id="menu">
  <div class="container">
    <h2 class="section-title reveal">Notre Menu</h2>
    <p class="section-subtitle reveal">Cinq façons de se régaler, tous les jours de 12h à 1h.</p>

    <div class="menu-tabs" role="tablist" aria-label="Catégories du menu">
      <button class="menu-tab is-active" role="tab" id="tab-bokka" aria-selected="true" aria-controls="panel-bokka" data-target="panel-bokka">Bokka</button>
      <button class="menu-tab" role="tab" id="tab-burgers" aria-selected="false" aria-controls="panel-burgers" data-target="panel-burgers">Burgers</button>
      <button class="menu-tab" role="tab" id="tab-tacos" aria-selected="false" aria-controls="panel-tacos" data-target="panel-tacos">Tacos</button>
      <button class="menu-tab" role="tab" id="tab-crunchy" aria-selected="false" aria-controls="panel-crunchy" data-target="panel-crunchy">Crunchy</button>
      <button class="menu-tab" role="tab" id="tab-plats" aria-selected="false" aria-controls="panel-plats" data-target="panel-plats">Plats</button>
    </div>

    <div class="menu-panels">
      <div class="menu-panel is-active" id="panel-bokka" role="tabpanel" aria-labelledby="tab-bokka">
        <img src="assets/images/menu-bokka.png" alt="Affiche du menu Nos Bokka" class="menu-poster" loading="lazy">
        <div class="menu-grid">
          <article class="menu-item featured">
            <div class="menu-item-head"><h3>Bokka Spicy</h3><span class="price">39 DH</span></div>
            <p>Pain spicy, strips, dinde fumée, cheddar, laitue, sauce algérienne</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Pizza</h3><span class="price">39 DH</span></div>
            <p>Pain méga en thym, strips, pepperoni, cheddar, mozzarella, olives noires, ketchup & mayo</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Original</h3><span class="price">39 DH</span></div>
            <p>Pain original, strips, dinde fumée, laitue, fromage, mayo & ketchup</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Jalapiño</h3><span class="price">39 DH</span></div>
            <p>Strips, dinde fumée, cheddar, sauce samouraï</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Chilli</h3><span class="price">39 DH</span></div>
            <p>Pain spicy, strips, dinde fumée, cheddar, laitue, sauce chilli thaï</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Mini Bokka</h3><span class="price">33 DH</span></div>
            <p>Pain original, strips, dinde fumée, cheddar, mayo & ketchup</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Swiss</h3><span class="price">50 DH</span></div>
            <p>Pain original, strips, dinde fumée, cheddar, sautée champignons, creamy fromager swiss</p>
          </article>
        </div>
      </div>

      <div class="menu-panel" id="panel-burgers" role="tabpanel" aria-labelledby="tab-burgers" hidden>
        <img src="assets/images/menu-burgers.png" alt="Affiche du menu Nos Burgers" class="menu-poster" loading="lazy">
        <div class="menu-grid">
          <article class="menu-item featured">
            <div class="menu-item-head"><h3>El Capo Spicy</h3><span class="price">42 DH</span></div>
            <p>Double steak, cheddar, sauce algérienne</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>El Pollo</h3><span class="price">28 DH</span></div>
            <p>2 strips crispy, cheddar, sauce biggy</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Suprimo</h3><span class="price">28 DH</span></div>
            <p>Double steak, cheddar, sauce biggy</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>El Classico</h3><span class="price">42 DH</span></div>
            <p>4 strips crispy, cheddar, sauce biggy</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>El Capo</h3><span class="price">42 DH</span></div>
            <p>Steak, cheddar, sauce biggy</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Jalapiño</h3><span class="price">45 DH</span></div>
            <p>Double steak, jalapeños, spicy special</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Swiss</h3><span class="price">50 DH</span></div>
            <p>Double steak, sautée champignons, creamy fromager swiss</p>
          </article>
        </div>
      </div>

      <div class="menu-panel" id="panel-tacos" role="tabpanel" aria-labelledby="tab-tacos" hidden>
        <img src="assets/images/menu-tacos.png" alt="Affiche du menu Nos Tacos" class="menu-poster" loading="lazy">
        <div class="menu-grid">
          <article class="menu-item featured">
            <div class="menu-item-head"><h3>Tacos Boursin</h3><span class="price">42 DH</span></div>
            <p>Steak poulet, cheddar, sauce biggy, fromage Boursin</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Viande Hachée</h3><span class="price">40 DH</span></div>
            <p>Viande hachée, cheddar, sauce au choix</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Poulet</h3><span class="price">37 DH</span></div>
            <p>Steak poulet, cheddar, sauce au choix</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Tacos Crispé</h3><span class="price">38 DH</span></div>
            <p>Strips crispy, cheddar, sauce biggy</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Cordon Bleu</h3><span class="price">38 DH</span></div>
            <p>Cordon bleu, cheddar, sauce au choix</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Jalapiño</h3><span class="price">45 DH</span></div>
            <p>Viande hachée et poulet, jalapeños, spicy algérien</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Swiss</h3><span class="price">50 DH</span></div>
            <p>Steak poulet, sautée champignons, creamy fromager swiss</p>
          </article>
        </div>
      </div>

      <div class="menu-panel" id="panel-crunchy" role="tabpanel" aria-labelledby="tab-crunchy" hidden>
        <img src="assets/images/menu-crunchy.png" alt="Affiche du menu Nos Crunchy" class="menu-poster" loading="lazy">
        <div class="menu-grid">
          <article class="menu-item featured">
            <div class="menu-item-head"><h3>Crunchy Box</h3><span class="price">45 DH</span></div>
            <p>Notre box croustillante généreuse : tenders, onion rings, nuggets et sauce</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Chili Cheese</h3><span class="price">25 DH</span></div>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Mozzastick</h3><span class="price">25 DH</span></div>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Onion Ring</h3><span class="price">15 DH</span></div>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Nugget</h3><span class="price">15 DH</span></div>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Potatos Crispe</h3><span class="price">15 DH</span></div>
          </article>
        </div>
      </div>

      <div class="menu-panel" id="panel-plats" role="tabpanel" aria-labelledby="tab-plats" hidden>
        <img src="assets/images/menu-plats.jpeg" alt="Affiche du menu Plats" class="menu-poster" loading="lazy">
        <div class="menu-grid">
          <article class="menu-item">
            <div class="menu-item-head"><h3>Tenders x5</h3><span class="price">35 DH</span></div>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Chicken Box</h3><span class="price">45 DH</span></div>
          </article>
          <article class="menu-item featured">
            <div class="menu-item-head"><h3>King Strips</h3><span class="price">49 DH</span></div>
            <p>Combo : strips, burger, frites et boisson</p>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Mac & Cheese</h3><span class="price">35 DH</span></div>
            <span class="badge-limited">Quantité limitée</span>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Kabsa</h3><span class="price">29 DH</span></div>
            <span class="badge-limited">Quantité limitée</span>
          </article>
          <article class="menu-item">
            <div class="menu-item-head"><h3>Tiramisu</h3><span class="price">20 DH</span></div>
            <p>Dessert</p>
          </article>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append menu CSS to `css/styles.css`**

```css
/* ===== Menu ===== */
.menu-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
}
.menu-tab {
  padding: 10px 20px;
  min-height: 44px;
  border-radius: var(--radius-md);
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-white);
  border: 2px solid var(--color-primary);
  transition: background var(--transition-base), color var(--transition-base);
}
.menu-tab:hover { background: #FCE8E8; }
.menu-tab.is-active { background: var(--color-primary); color: var(--color-white); }

.menu-poster {
  width: 100%;
  max-width: 320px;
  margin: 0 auto var(--space-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.menu-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-sm);
}
.menu-item {
  background: var(--color-white);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-shadow: var(--shadow-card);
}
.menu-item.featured { border: 2px solid var(--color-gold); }
.menu-item-head { display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-sm); margin-bottom: var(--space-xs); }
.menu-item-head h3 { font-size: 1.125rem; }
.menu-item .price {
  font-family: var(--font-heading);
  font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
}
.menu-item p { color: #555; font-size: 0.95rem; }
.badge-limited {
  display: inline-block;
  margin-top: var(--space-xs);
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--color-gold);
  color: var(--color-ink);
  font-size: 0.75rem;
  font-weight: 700;
}

@media (min-width: 768px) {
  .menu-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .menu-grid { grid-template-columns: repeat(3, 1fr); }
}
```

- [ ] **Step 3: Append tab-switching logic to `js/main.js`**

```js
const menuTabs = document.querySelectorAll('.menu-tab');
const menuPanels = document.querySelectorAll('.menu-panel');

menuTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    menuTabs.forEach((t) => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
    menuPanels.forEach((p) => { p.classList.remove('is-active'); p.hidden = true; });

    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    const targetPanel = document.getElementById(tab.dataset.target);
    targetPanel.classList.add('is-active');
    targetPanel.hidden = false;
  });
});
```

- [ ] **Step 4: Verify in browser**

Navigate to `#menu`. Confirm the Bokka panel is visible by default with 7 items and correct prices. Click each tab (`Burgers`, `Tacos`, `Crunchy`, `Plats`) and confirm the corresponding panel shows and others hide, using `get_page_text` to spot-check that "Crunchy Box" and "45 DH" appear only when the Crunchy tab is active. Confirm "Mac & Cheese" and "Kabsa" both show the "Quantité limitée" badge. Check at 375px that cards stack in a single column with no overflow.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "feat: tabbed menu section with full 5-category catalog"
```

---

### Task 5: Notre Histoire section

**Files:**
- Modify: `index.html` (replace histoire placeholder)
- Modify: `css/styles.css` (append histoire styles)

**Interfaces:**
- Consumes: `.section-title`, `.reveal` from Task 1.

- [ ] **Step 1: Replace the histoire placeholder in `index.html`**

```html
<section class="histoire" id="histoire">
  <div class="container histoire-inner">
    <div class="histoire-media reveal">
      <img src="assets/images/logo.jpg" alt="Le coq mascotte de Pollito Chicken" class="histoire-img">
    </div>
    <div class="histoire-content reveal">
      <h2 class="section-title histoire-title">Notre Histoire</h2>
      <p>Pollito Chicken est né à Salé avec une idée simple : servir du poulet frit vraiment croustillant, généreux, et toujours fait minute. Pas de raccourcis, pas de compromis sur le goût.</p>
      <p>De nos bokka signature à nos burgers doubles steak, chaque recette est pensée pour un seul objectif : vous faire kiffer chaque bouchée. Aujourd'hui, on est fiers de nourrir tout un quartier, un poulet à la fois.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append histoire CSS to `css/styles.css`**

```css
/* ===== Notre Histoire ===== */
.histoire-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  text-align: center;
}
.histoire-media { width: 200px; }
.histoire-img { border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
.histoire-title { text-align: center; }
.histoire-content p { margin-bottom: var(--space-sm); color: #444; }

@media (min-width: 768px) {
  .histoire-inner { flex-direction: row; text-align: left; }
  .histoire-media { width: 280px; flex-shrink: 0; }
  .histoire-title { text-align: left; }
}
```

- [ ] **Step 3: Verify in browser**

Navigate to `#histoire`. Confirm the logo image and two paragraphs render, stacked on mobile (375px) and side-by-side on desktop (1280px), with no horizontal scroll.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: Notre Histoire section"
```

---

### Task 6: Galerie section

**Files:**
- Modify: `index.html` (replace galerie placeholder)
- Modify: `css/styles.css` (append galerie styles)

**Interfaces:**
- Consumes: `.section-title`, `.section-subtitle`, `.icon`, `#icon-instagram`, `.reveal` from Task 1.

- [ ] **Step 1: Replace the galerie placeholder in `index.html`**

```html
<section class="galerie" id="galerie">
  <div class="container">
    <h2 class="section-title reveal">Galerie</h2>
    <p class="section-subtitle reveal">Un aperçu de ce qui vous attend.</p>
    <div class="gallery-grid reveal">
      <img src="assets/images/menu-bokka.png" alt="Menu Nos Bokka" class="gallery-img" loading="lazy">
      <img src="assets/images/menu-burgers.png" alt="Menu Nos Burgers" class="gallery-img" loading="lazy">
      <img src="assets/images/menu-tacos.png" alt="Menu Nos Tacos" class="gallery-img" loading="lazy">
      <img src="assets/images/menu-crunchy.png" alt="Menu Nos Crunchy" class="gallery-img" loading="lazy">
      <img src="assets/images/menu-plats.jpeg" alt="Menu Plats" class="gallery-img" loading="lazy">
    </div>
    <a href="https://www.instagram.com/pollito_chicken_sale" target="_blank" rel="noopener noreferrer" class="instagram-callout reveal">
      <svg class="icon"><use href="#icon-instagram"/></svg>
      <span>Suivez-nous @pollito_chicken_sale</span>
    </a>
  </div>
</section>
```

- [ ] **Step 2: Append galerie CSS to `css/styles.css`**

```css
/* ===== Galerie ===== */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}
.gallery-img { border-radius: var(--radius-md); box-shadow: var(--shadow-card); aspect-ratio: 3 / 4; object-fit: cover; }
.instagram-callout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  max-width: 360px;
  margin: 0 auto;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  background: var(--color-white);
  box-shadow: var(--shadow-card);
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--color-primary);
  transition: transform var(--transition-base);
}
.instagram-callout:hover { transform: translateY(-2px); }

@media (min-width: 768px) {
  .gallery-grid { grid-template-columns: repeat(3, 1fr); }
}
```

- [ ] **Step 3: Verify in browser**

Navigate to `#galerie`. Confirm 5 images render in a 2-column grid on mobile and 3-column on desktop, all with non-empty `alt` attributes (use `read_page` to check), and the Instagram link opens `https://www.instagram.com/pollito_chicken_sale` in a new tab (`target="_blank"` + `rel="noopener noreferrer"` present).

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: Galerie section with Instagram callout"
```

---

### Task 7: Offres section

**Files:**
- Modify: `index.html` (replace offres placeholder)
- Modify: `css/styles.css` (append offres styles)

**Interfaces:**
- Consumes: `.section-title`, `.section-subtitle`, `.reveal` from Task 1.

- [ ] **Step 1: Replace the offres placeholder in `index.html`**

```html
<section class="offres" id="offres">
  <div class="container">
    <h2 class="section-title reveal">Offres du Moment</h2>
    <p class="section-subtitle reveal">Nos best-sellers, à ne pas manquer.</p>
    <div class="offres-grid">
      <article class="offre-card reveal">
        <span class="offre-badge">Best-seller</span>
        <h3>Crunchy Box</h3>
        <p>Notre box croustillante généreuse : tenders, onion rings, nuggets et sauce.</p>
        <span class="price">45 DH</span>
      </article>
      <article class="offre-card reveal">
        <span class="offre-badge">Combo</span>
        <h3>King Strips</h3>
        <p>Strips croustillants, burger, frites et boisson. Le combo complet.</p>
        <span class="price">49 DH</span>
      </article>
      <article class="offre-card reveal">
        <span class="offre-badge">Signature</span>
        <h3>Bokka Spicy</h3>
        <p>Notre sandwich signature : pain spicy, strips, dinde fumée, cheddar, sauce algérienne.</p>
        <span class="price">39 DH</span>
      </article>
    </div>
    <p class="offres-note reveal">Mac &amp; Cheese et Kabsa sont disponibles en quantité limitée — premier arrivé, premier servi.</p>
  </div>
</section>
```

- [ ] **Step 2: Append offres CSS to `css/styles.css`**

```css
/* ===== Offres ===== */
.offres { background: var(--color-white); }
.offres-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}
.offre-card {
  position: relative;
  background: var(--color-cream);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) var(--space-md) var(--space-md);
  text-align: center;
}
.offre-badge {
  position: absolute;
  top: var(--space-sm);
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-primary);
  color: var(--color-white);
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.offre-card h3 { font-size: 1.25rem; margin-bottom: var(--space-xs); }
.offre-card p { color: #555; margin-bottom: var(--space-sm); }
.offre-card .price { font-family: var(--font-heading); font-weight: 700; font-size: 1.25rem; color: var(--color-primary); }
.offres-note { text-align: center; color: #777; font-size: 0.9rem; }

@media (min-width: 768px) {
  .offres-grid { grid-template-columns: repeat(3, 1fr); }
}
```

- [ ] **Step 3: Verify in browser**

Navigate to `#offres`. Confirm 3 cards render (stacked on mobile, 3-across on desktop) with correct badges/names/prices matching the spec, and the limited-quantity note is visible below.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: Offres section with featured combos"
```

---

### Task 8: Nous Trouver (contact + map) section

**Files:**
- Modify: `index.html` (replace contact placeholder)
- Modify: `css/styles.css` (append contact styles)

**Interfaces:**
- Consumes: `.section-title`, `.btn-call`, `.icon`, `#icon-pin`/`#icon-clock`/`#icon-phone`/`#icon-instagram`, `.reveal` from Task 1.

- [ ] **Step 1: Replace the contact placeholder in `index.html`**

```html
<section class="contact" id="contact">
  <div class="container contact-inner">
    <div class="contact-info reveal">
      <h2 class="section-title contact-title">Nous Trouver</h2>
      <ul class="contact-list">
        <li><svg class="icon"><use href="#icon-pin"/></svg><span>Salé 11000, Maroc</span></li>
        <li><svg class="icon"><use href="#icon-clock"/></svg><span>Tous les jours · 12h00 – 01h00</span></li>
        <li><svg class="icon"><use href="#icon-phone"/></svg><a href="tel:+212538107053">05 38 10 70 53</a></li>
        <li><svg class="icon"><use href="#icon-instagram"/></svg><a href="https://www.instagram.com/pollito_chicken_sale" target="_blank" rel="noopener noreferrer">@pollito_chicken_sale</a></li>
      </ul>
      <a href="tel:+212538107053" class="btn btn-call">Appeler pour commander</a>
    </div>
    <div class="contact-map reveal">
      <iframe
        src="https://www.google.com/maps?q=34.0656571,-6.8019299&z=17&output=embed"
        title="Localisation de Pollito Chicken à Salé"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append contact CSS to `css/styles.css`**

```css
/* ===== Nous Trouver ===== */
.contact-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}
.contact-title { text-align: center; }
.contact-list { margin-bottom: var(--space-md); }
.contact-list li { display: flex; align-items: center; gap: var(--space-xs); padding: var(--space-xs) 0; }
.contact-list .icon { color: var(--color-primary); }
.contact-list a:hover { color: var(--color-primary); }
.contact-map { width: 100%; }
.contact-map iframe { width: 100%; height: 320px; border: 0; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }

@media (min-width: 768px) {
  .contact-inner { flex-direction: row; align-items: flex-start; }
  .contact-info { flex: 1; }
  .contact-map { flex: 1; }
  .contact-title { text-align: left; }
}
```

- [ ] **Step 3: Verify in browser**

Navigate to `#contact`. Confirm the map iframe loads (check `read_network_requests` for a successful request to `google.com/maps`), the address/hours/phone/Instagram list renders, and the "Appeler pour commander" button's `href` is `tel:+212538107053`.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: Nous Trouver section with map embed"
```

---

### Task 9: Footer

**Files:**
- Modify: `index.html` (replace footer placeholder)
- Modify: `css/styles.css` (append footer styles)

**Interfaces:**
- Consumes: `--color-*`/`--space-*` tokens from Task 1.

- [ ] **Step 1: Replace the footer placeholder in `index.html`**

```html
<footer class="site-footer">
  <div class="container footer-inner">
    <img src="assets/images/logo.jpg" alt="Pollito Chicken" class="footer-logo">
    <nav class="footer-nav" aria-label="Liens du pied de page">
      <a href="#menu">Menu</a>
      <a href="#histoire">Notre Histoire</a>
      <a href="#galerie">Galerie</a>
      <a href="#offres">Offres</a>
      <a href="#contact">Nous Trouver</a>
    </nav>
    <div class="footer-contact">
      <a href="tel:+212538107053">05 38 10 70 53</a>
      <a href="https://www.instagram.com/pollito_chicken_sale" target="_blank" rel="noopener noreferrer">@pollito_chicken_sale</a>
    </div>
    <p class="footer-hours">Salé 11000 · Tous les jours 12h–01h</p>
    <p class="footer-copyright">&copy; 2026 Pollito Chicken. Tous droits réservés.</p>
  </div>
</footer>
```

- [ ] **Step 2: Append footer CSS to `css/styles.css`**

```css
/* ===== Footer ===== */
.site-footer { background: var(--color-ink); color: var(--color-white); padding: var(--space-lg) 0; }
.footer-inner { display: flex; flex-direction: column; align-items: center; gap: var(--space-sm); text-align: center; }
.footer-logo { width: 48px; height: 48px; border-radius: var(--radius-sm); }
.footer-nav { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-sm); }
.footer-nav a:hover { color: var(--color-gold); }
.footer-contact { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-sm); }
.footer-contact a:hover { color: var(--color-gold); }
.footer-hours, .footer-copyright { color: #B5B0AC; font-size: 0.875rem; }
```

- [ ] **Step 3: Verify in browser**

Scroll to the bottom. Confirm logo, nav links, phone, Instagram, hours, and copyright all render and links have correct `href`s.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: footer"
```

---

### Task 10: Scroll-reveal animation + full-site responsive/accessibility audit

**Files:**
- Modify: `js/main.js` (append `IntersectionObserver` reveal logic)

**Interfaces:**
- Consumes: `.reveal`/`.reveal.is-visible` classes already applied to elements across every section (Tasks 3, 4 partially via `menu-item` — see Step 1 note, 5, 6, 7, 8).

- [ ] **Step 1: Append scroll-reveal logic to `js/main.js`**

```js
const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (revealEls.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}
```

- [ ] **Step 2: Add `.reveal` to menu category panels in `index.html`**

The menu grids from Task 4 were not given `.reveal` (they're tab-switched, not scroll-triggered, since they start `hidden`). No change needed here — this step is a no-op confirmation, not a code change. Skip to Step 3.

- [ ] **Step 3: Full responsive + accessibility verification pass in the browser**

Run through each of the following using the Browser tools and record results:

1. `resize_window` to 375×812 (mobile): scroll the full page top to bottom via `computer scroll`, confirm no horizontal scrollbar appears at any section (check via `javascript_tool` running `document.documentElement.scrollWidth <= document.documentElement.clientWidth`).
2. `resize_window` to 768×1024 (tablet) and 1280×800 (desktop): repeat the same overflow check.
3. Scroll slowly down the page at desktop width and confirm `.reveal` elements fade/slide in as they enter the viewport (not all at once on load).
4. `read_console_messages` with `onlyErrors: true`: confirm zero errors on load and after interacting with nav, tabs, and scroll.
5. `read_page` with `filter: "all"` on the full page: grep the output for every `<img>` and confirm none have an empty or missing `alt`.
6. Tab through the page using `computer key Tab` repeatedly from the top: confirm focus visibly outlines the logo link, each nav link, the header call button, the nav toggle, each menu tab, and every link in the contact/footer sections, in a sensible order.
7. Confirm every `tel:` link across header, hero (via the "Commander Maintenant" primary button — note: this links to `#top`'s call button conceptually but the actual href is the hero's own CTA, verify it directly), contact, and footer resolves to exactly `tel:+212538107053` — search the rendered HTML for `tel:` and confirm no typos or inconsistent formatting.
8. Confirm `prefers-reduced-motion` is respected: `resize_window` doesn't control this, so instead re-check via `javascript_tool` executing `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is `false` in the default test environment (expected), and re-read the CSS reduced-motion block from Task 1 to confirm it's present and unchanged.

- [ ] **Step 4: Fix any issues found in Step 3, then re-verify**

If any check fails, fix the specific file/line and re-run only the failed check.

- [ ] **Step 5: Commit**

```bash
git add js/main.js
git commit -m "feat: scroll-reveal animation and final accessibility pass"
```

---

## Post-Plan Note

This directory is not yet a git repository, so every "Commit" step above is written
for when/if the user initializes one (`git init`) — until then, treat each commit step
as "save the files" (already done by the Write/Edit tool) and skip the `git` commands.
