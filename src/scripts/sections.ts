/**
 * `content-visibility: auto` on .section makes the first load much cheaper, but
 * off-screen sections only have an estimated height. Jumping to an #anchor
 * would then land in the wrong place as sections above it get their real size.
 *
 * So: (1) after load, render sections one by one in idle time (small tasks);
 *     (2) before any in-page jump, render everything synchronously first.
 */
const sections = () => [...document.querySelectorAll<HTMLElement>('.section:not(.cv-done)')];

/** Give every section its real size now (call before scrolling to an anchor). */
export function renderAllSections() {
  sections().forEach((s) => s.classList.add('cv-done'));
}

/** Scroll to an in-page target reliably (renders sections first). */
export function scrollToTarget(target: HTMLElement, smooth = true) {
  renderAllSections();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // wait one frame so the new layout is applied before measuring the scroll target
  requestAnimationFrame(() => target.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'instant' }));
}

// (1) progressive rendering in idle time
const idle: (cb: () => void) => void =
  'requestIdleCallback' in window ? (cb) => requestIdleCallback(cb, { timeout: 2000 }) : (cb) => setTimeout(cb, 200);

function step() {
  const next = sections()[0];
  if (!next) return;
  next.classList.add('cv-done');
  idle(step);
}
window.addEventListener('load', () => setTimeout(() => idle(step), 1500), { once: true });

// (2a) in-page anchor clicks (navbar, mobile menu, hero buttons, …)
document.addEventListener(
  'click',
  (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    history.pushState(null, '', url.hash);
    scrollToTarget(target);
  },
  true,
);

// (2b) deep links like /ar/#projects on first load
if (location.hash.length > 1) {
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) {
    renderAllSections();
    let userScrolled = false;
    const markUser = () => (userScrolled = true);
    ['wheel', 'touchstart', 'keydown'].forEach((t) => window.addEventListener(t, markUser, { once: true, passive: true }));
    const jump = () => {
      if (!userScrolled) target.scrollIntoView({ behavior: 'instant' });
    };
    requestAnimationFrame(jump);
    // Fonts/images can change heights after the first jump: correct once more.
    window.addEventListener('load', () => {
      jump();
      document.fonts?.ready.then(() => requestAnimationFrame(jump));
    }, { once: true });
  }
}
