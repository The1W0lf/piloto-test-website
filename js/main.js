// Populated in Tasks 2, 4, and 10 (nav toggle, menu tabs, scroll reveal)

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

const expandContainers = document.querySelectorAll('[data-menu-expand]');

expandContainers.forEach((container) => {
  const items = Array.from(container.children);

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const willActivate = !item.classList.contains('is-active');
      items.forEach((i) => i.classList.remove('is-active'));
      if (willActivate) item.classList.add('is-active');
    });
  });
});

const callButtons = document.querySelectorAll('.btn-call');
const isDesktop = window.matchMedia('(min-width: 768px)');

callButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    if (isDesktop.matches) e.preventDefault();
  });
});

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
