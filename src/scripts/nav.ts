/** Navbar: active-section highlight + mobile drawer. */

/* ---------- active section ---------- */
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')];
const ids = [...new Set(navLinks.map((a) => a.dataset.navLink!))];
const targets = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);

function setActive(id: string | null) {
  for (const a of navLinks) {
    if (a.dataset.navLink === id) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  }
}

if (targets.length && 'IntersectionObserver' in window) {
  const visible = new Map<string, boolean>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) visible.set(e.target.id, e.isIntersecting);
      // First section (in page order) crossing the middle band of the viewport wins.
      const current = targets.find((t) => visible.get(t.id));
      setActive(current?.id ?? null);
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  targets.forEach((t) => io.observe(t));
}

/* ---------- mobile drawer ---------- */
const menu = document.querySelector<HTMLDialogElement>('#mobile-menu');
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');

function closeMenu() {
  menu?.close();
}

openBtn?.addEventListener('click', () => {
  if (!menu) return;
  menu.showModal();
  openBtn.setAttribute('aria-expanded', 'true');
});

menu?.addEventListener('close', () => {
  openBtn?.setAttribute('aria-expanded', 'false');
});

// Click on the backdrop (outside the panel) closes the menu.
menu?.addEventListener('click', (e) => {
  if (e.target === menu) closeMenu();
});

menu?.querySelector('[data-menu-close]')?.addEventListener('click', closeMenu);

// Link click: close first, then let the browser follow the #anchor.
menu?.querySelectorAll<HTMLAnchorElement>('[data-menu-link]').forEach((a) => {
  a.addEventListener('click', () => closeMenu());
});

// Palette / terminal buttons inside the drawer: close the drawer first.
menu?.querySelectorAll<HTMLElement>('[data-menu-action]').forEach((b) => {
  b.addEventListener('click', () => closeMenu(), { capture: true });
});

// Language switch keeps the current section: /#projects → /ar/#projects
document.querySelectorAll<HTMLAnchorElement>('[data-lang-switch]').forEach((a) => {
  a.addEventListener('click', () => {
    const current = document.querySelector('[data-nav-link][aria-current="true"]')?.getAttribute('data-nav-link');
    const hash = current ? `#${current}` : location.hash;
    if (hash) a.href = a.href.split('#')[0] + hash;
  });
});

// Close the drawer if the viewport grows to desktop size.
window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
  if (e.matches) closeMenu();
});

export {};
