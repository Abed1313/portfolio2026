/**
 * Hero IDE tabs: accessible tablist (click, ←/→/Home/End) + slow auto-rotation.
 * Auto-rotation pauses on hover/focus, stops for good once the visitor
 * clicks a tab, and never runs with prefers-reduced-motion.
 */
const ROTATE_MS = 8000;

const root = document.querySelector<HTMLElement>('[data-ide]');
if (root) {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-ide-tab]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-ide-panel]')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let timer: number | undefined;
  let stopped = reduce;
  let paused = false;

  const select = (i: number, focus = false) => {
    index = (i + tabs.length) % tabs.length;
    tabs.forEach((t, n) => {
      const on = n === index;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p, n) => {
      const on = n === index;
      p.toggleAttribute('data-inactive', !on);
      p.inert = !on;
    });
    if (focus) tabs[index]?.focus();
  };

  const schedule = () => {
    window.clearInterval(timer);
    if (stopped) return;
    timer = window.setInterval(() => {
      if (!paused && !document.hidden) select(index + 1);
    }, ROTATE_MS);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      stopped = true;
      window.clearInterval(timer);
      select(i);
    });
    tab.addEventListener('keydown', (e) => {
      const map: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 };
      const next = map[e.key];
      if (next === undefined) return;
      e.preventDefault();
      stopped = true;
      window.clearInterval(timer);
      select(next, true);
    });
  });

  root.addEventListener('pointerenter', () => (paused = true));
  root.addEventListener('pointerleave', () => (paused = false));
  root.addEventListener('focusin', () => (paused = true));
  root.addEventListener('focusout', () => (paused = false));

  schedule();
}

export {};
