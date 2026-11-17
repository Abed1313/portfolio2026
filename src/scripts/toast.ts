/**
 * Tiny toast system. Renders into #toast-root (an aria-live region in BaseLayout).
 *   import { showToast } from './toast';
 *   showToast('Copied!', 'success');
 */
export type ToastTone = 'success' | 'error' | 'info';

export function showToast(message: string, tone: ToastTone = 'info', ms = 2800) {
  const root = document.getElementById('toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = `toast toast-${tone}`;
  el.setAttribute('role', tone === 'error' ? 'alert' : 'status');
  el.textContent = message;
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-in'));
  window.setTimeout(() => {
    el.classList.remove('is-in');
    window.setTimeout(() => el.remove(), 300);
  }, ms);
}

/** Copy text to the clipboard with a fallback for older browsers / insecure contexts. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Any [data-copy="text"] button copies its value and shows a toast (messages from data attributes). */
document.addEventListener('click', async (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-copy]');
  if (!btn) return;
  const ok = await copyText(btn.dataset.copy ?? '');
  showToast(ok ? (btn.dataset.copyOk ?? 'Copied') : (btn.dataset.copyFail ?? 'Copy failed'), ok ? 'success' : 'error');
});
