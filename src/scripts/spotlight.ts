/**
 * Cursor-follow spotlight for `.card-hover` (desktop pointers only).
 * One delegated listener; writes --mx / --my on the hovered card.
 */
const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

let frame = 0;
let last: PointerEvent | null = null;

function update() {
  frame = 0;
  if (!last) return;
  const target = last.target as Element | null;
  const card = target?.closest?.<HTMLElement>('.card-hover');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${last.clientX - r.left}px`);
  card.style.setProperty('--my', `${last.clientY - r.top}px`);
}

document.addEventListener(
  'pointermove',
  (e) => {
    if (!fine.matches || reduce.matches || e.pointerType !== 'mouse') return;
    last = e;
    if (!frame) frame = requestAnimationFrame(update);
  },
  { passive: true },
);

export {};
