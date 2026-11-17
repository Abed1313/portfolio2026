/** Command palette: open (Ctrl/⌘+K or [data-palette-open]), filter, keyboard navigation, run. */
import { toggleTheme } from './theme';
import { copyText, showToast } from './toast';

const dialog = document.querySelector<HTMLDialogElement>('#command-palette');

if (dialog) {
  const input = dialog.querySelector<HTMLInputElement>('[data-palette-input]')!;
  const options = [...dialog.querySelectorAll<HTMLElement>('[role="option"]')];
  const groups = [...dialog.querySelectorAll<HTMLElement>('[data-palette-group]')];
  const empty = dialog.querySelector<HTMLElement>('[data-palette-empty]')!;
  let active = -1;

  const visible = () => options.filter((o) => !o.hidden);

  const setActive = (i: number) => {
    const list = visible();
    if (!list.length) {
      active = -1;
      input.removeAttribute('aria-activedescendant');
      return;
    }
    active = (i + list.length) % list.length;
    options.forEach((o) => o.setAttribute('aria-selected', 'false'));
    const el = list[active]!;
    el.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', el.id);
    el.scrollIntoView({ block: 'nearest' });
  };

  const filter = () => {
    const terms = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    options.forEach((o) => {
      const hay = o.dataset.search ?? '';
      o.hidden = !terms.every((t) => hay.includes(t));
    });
    groups.forEach((g) => (g.hidden = !g.querySelector('[role="option"]:not([hidden])')));
    empty.hidden = visible().length > 0;
    setActive(0);
  };

  const open = () => {
    if (dialog.open) return;
    document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach((d) => d.close());
    input.value = '';
    filter();
    dialog.showModal();
    input.focus();
  };

  const run = async (el: HTMLElement) => {
    const cmd = el.dataset.run ?? '';
    dialog.close();
    if (cmd.startsWith('goto:')) {
      const target = document.querySelector<HTMLElement>(cmd.slice(5));
      if (target) {
        history.pushState(null, '', cmd.slice(5));
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
        target.querySelector<HTMLElement>('h2')?.setAttribute('tabindex', '-1');
        target.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
      }
    } else if (cmd === 'theme') {
      toggleTheme();
    } else if (cmd.startsWith('lang:')) {
      location.href = cmd.slice(5);
    } else if (cmd === 'cv') {
      document.querySelector<HTMLAnchorElement>('[data-cv-link]')?.click();
    } else if (cmd === 'copy-email') {
      const ok = await copyText(dialog.dataset.email ?? '');
      showToast(ok ? (dialog.dataset.msgCopied ?? '') : (dialog.dataset.msgCopyFailed ?? ''), ok ? 'success' : 'error');
    } else if (cmd === 'terminal') {
      document.dispatchEvent(new CustomEvent('terminal:open'));
    } else if (cmd.startsWith('open:')) {
      const url = cmd.slice(5);
      if (url.startsWith('mailto:')) location.href = url;
      else window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  input.addEventListener('input', filter);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(active + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(active - 1);
    } else if (e.key === 'Home' && !input.value) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End' && !input.value) {
      e.preventDefault();
      setActive(visible().length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const el = visible()[active];
      if (el) void run(el);
    }
  });

  options.forEach((o) => {
    o.addEventListener('click', () => void run(o));
    o.addEventListener('pointermove', () => {
      const i = visible().indexOf(o);
      if (i !== active) setActive(i);
    });
  });

  // Global shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dialog.open) dialog.close();
      else open();
    }
  });

  // Visible buttons (navbar, mobile menu, footer)
  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('[data-palette-open]')) open();
  });

  // Show ⌘K on Apple devices
  if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
    document.querySelectorAll('[data-kbd-hint]').forEach((k) => (k.textContent = '⌘ K'));
  }
}

export {};
