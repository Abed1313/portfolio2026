/** Certifications: category filter chips for the training grid. */
const root = document.querySelector<HTMLElement>('[data-certs]');

if (root) {
  const chips = [...root.querySelectorAll<HTMLButtonElement>('[data-cert-filter]')];
  const cards = [...root.querySelectorAll<HTMLElement>('[data-cert-card]')];

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cat = chip.dataset.certFilter ?? '';
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      cards.forEach((card) => {
        const match = !cat || card.dataset.category === cat;
        card.hidden = !match;
        if (match) card.classList.add('is-visible');
      });
    });
  });
}

export {};
