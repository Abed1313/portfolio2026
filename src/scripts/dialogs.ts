/**
 * Generic <dialog> wiring for project modals and certificate lightboxes.
 *   <button data-dialog-open="some-id">   opens <dialog id="some-id">
 *   [data-dialog-close] inside a dialog     closes it
 *   click on the backdrop                   closes it
 *   Esc                                     closes it (native)
 * Native showModal() traps focus and makes the page inert; focus returns
 * to the opener on close (we also restore it explicitly for older browsers).
 */
const openers = new WeakMap<HTMLDialogElement, HTMLElement>();

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

  // A click anywhere on a project card (not on one of its links/buttons) opens its modal.
  const card = target.closest<HTMLElement>('[data-project-card]');
  if (card && !target.closest('a, button')) {
    card.querySelector<HTMLElement>('[data-dialog-open]')?.click();
    return;
  }

  const opener = target.closest<HTMLElement>('[data-dialog-open]');
  if (opener) {
    const dialog = document.getElementById(opener.dataset.dialogOpen!) as HTMLDialogElement | null;
    if (dialog && !dialog.open) {
      e.preventDefault();
      openers.set(dialog, opener);
      dialog.showModal();
      dialog.querySelector<HTMLElement>('[data-dialog-close]')?.focus();
    }
    return;
  }

  const closer = target.closest<HTMLElement>('[data-dialog-close]');
  if (closer) {
    closer.closest('dialog')?.close();
    return;
  }

  // Backdrop click: every dialog's content wrapper fills the panel, so a click
  // whose target is the <dialog> element itself can only be on the backdrop.
  if (target instanceof HTMLDialogElement && target.open && target.matches('.modal')) {
    target.close();
  }
});

document.addEventListener(
  'close',
  (e) => {
    const dialog = e.target as HTMLDialogElement;
    const opener = openers.get(dialog);
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  },
  true,
);

/* ---------- gallery prev/next buttons ---------- */
document.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-gallery-step]');
  if (!btn) return;
  const track = btn.closest('[data-gallery]')?.querySelector<HTMLElement>('.gallery');
  if (!track) return;
  const rtl = getComputedStyle(track).direction === 'rtl';
  const step = Number(btn.dataset.galleryStep) * track.clientWidth * (rtl ? -1 : 1);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  track.scrollBy({ left: step, behavior: reduce ? 'auto' : 'smooth' });
});

export {};
