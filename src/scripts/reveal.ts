/**
 * Fade/slide-up on scroll for elements with `.reveal`.
 * Stagger: set `style="--i: n"` on siblings.
 * CSS only hides `.reveal` when <html> has the `js` class, so content is visible without JS.
 */
const els = document.querySelectorAll<HTMLElement>('.reveal');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduce || !('IntersectionObserver' in window)) {
  els.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  els.forEach((el) => io.observe(el));
}

export {};
