/**
 * Pauses flow-diagram animations when they are off-screen or inside a hidden
 * tab/panel, so infinite animations never cost CPU while nobody can see them.
 * Uses only IntersectionObserver data + attribute checks (no getComputedStyle,
 * which would force a synchronous style/layout pass).
 */
const flows = [...document.querySelectorAll<HTMLElement>('[data-flow]')];

if (flows.length && 'IntersectionObserver' in window) {
  flows.forEach((f) => f.setAttribute('data-paused', ''));

  const isHidden = (el: Element, entry?: IntersectionObserverEntry) =>
    !!el.closest('[data-inactive], [hidden]') || (entry ? !entry.isIntersecting || entry.boundingClientRect.width === 0 : false);

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) e.target.toggleAttribute('data-paused', isHidden(e.target, e));
    },
    { rootMargin: '100px' },
  );
  flows.forEach((f) => io.observe(f));

  // Tabs/panels toggling: re-observe so the observer reports fresh visibility.
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      flows.forEach((f) => {
        io.unobserve(f);
        io.observe(f);
      });
    });
  }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['data-inactive'] });
}

export {};
