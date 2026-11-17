/** Scroll progress bar + back-to-top button. */
const bar = document.querySelector<HTMLElement>('[data-scroll-progress]');
const toTop = document.querySelector<HTMLButtonElement>('[data-back-to-top]');

let ticking = false;

function update() {
  ticking = false;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = window.scrollY;
  const p = max > 0 ? Math.min(1, y / max) : 0;
  if (bar) {
    bar.style.transform = `scaleX(${p})`;
    bar.parentElement?.setAttribute('aria-valuenow', String(Math.round(p * 100)));
  }
  if (toTop) toTop.dataset.visible = String(y > 700);
}

window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  },
  { passive: true },
);
window.addEventListener('resize', update, { passive: true });
update();

toTop?.addEventListener('click', () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  // Move focus to the top so keyboard users continue from the start.
  document.querySelector<HTMLElement>('#top')?.focus({ preventScroll: true });
});

export {};
