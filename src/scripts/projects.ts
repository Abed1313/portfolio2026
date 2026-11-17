/** Projects section: tabs (click + arrow keys) and technology filter chips. */
const root = document.querySelector<HTMLElement>('[data-projects]');

if (root) {
  /* ---------- tabs ---------- */
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-proj-tab]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-proj-panel]')];

  const select = (i: number, focus = false) => {
    const idx = (i + tabs.length) % tabs.length;
    tabs.forEach((t, n) => {
      t.setAttribute('aria-selected', String(n === idx));
      t.tabIndex = n === idx ? 0 : -1;
    });
    panels.forEach((p, n) => {
      p.toggleAttribute('data-inactive', n !== idx);
      // newly shown cards must be visible even though they were never observed in view
      if (n === idx) p.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    });
    if (focus) tabs[idx]?.focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (e) => {
      const current = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
      const map: Record<string, number> = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: tabs.length - 1 };
      let next = map[e.key];
      if (next === undefined) return;
      // In RTL, the visual direction of the arrow keys is reversed.
      if (document.dir === 'rtl' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) next = current * 2 - next;
      e.preventDefault();
      select(next, true);
    });
  });

  /* ---------- filters ---------- */
  const chips = [...root.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const cards = [...root.querySelectorAll<HTMLElement>('[data-project-card]')];
  const empty = root.querySelector<HTMLElement>('[data-no-results]');
  const status = root.querySelector<HTMLElement>('[data-filter-status]');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const tag = chip.dataset.filter ?? '';
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      let shown = 0;
      cards.forEach((card) => {
        const match = !tag || (card.dataset.tags ?? '').split('|').includes(tag);
        card.hidden = !match;
        if (match) {
          shown++;
          card.classList.add('is-visible');
        }
      });
      if (empty) empty.hidden = shown > 0;
      if (status) status.textContent = `${shown} / ${cards.length}`;
    });
  });
}

export {};
