/**
 * Theme helpers. Initial theme is applied by the inline script in BaseLayout (before paint).
 * Any element with [data-theme-toggle] toggles light/dark and remembers the choice.
 */
export type Theme = 'light' | 'dark';

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* storage blocked: theme still applies for this visit */
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'light' ? '#f6f8fb' : '#0b0f17');
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(theme === 'light'));
  });
}

export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

function init() {
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(getTheme() === 'light'));
    btn.addEventListener('click', toggleTheme);
  });

  // Follow the OS setting live, but only until the visitor picks a theme.
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('theme');
    } catch {
      /* ignore */
    }
    if (!saved) document.documentElement.dataset.theme = e.matches ? 'light' : 'dark';
  });
}

init();
