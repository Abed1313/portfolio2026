/**
 * Terminal easter egg. Commands: help, about, skills, experience, projects,
 * certs, cv, contact, theme, clear, exit (+ whoami, sudo).
 * Output is built with DOM APIs (textContent), never innerHTML with data.
 */
import { toggleTheme, getTheme } from './theme';

interface TermData {
  strings: {
    welcome: string;
    notFound: string;
    help: string;
    tip: string;
    downloading: string;
    themeNow: string;
    sudo: string;
    official: string;
    training: string;
    fullStack: string;
    rpa: string;
    commands: Record<string, string>;
  };
  about: { name: string; headline: string; location: string; summary: string; languages: string[] };
  skills: { title: string; items: string[] }[];
  experience: { role: string; company: string; dates: string; current: boolean }[];
  projects: { fullStack: { title: string; subtitle: string; url: string }[]; rpa: string[] };
  certs: { official: string[]; training: string[] };
  contact: { email: string; phone: string; github: string; linkedin: string };
}

const dialog = document.querySelector<HTMLDialogElement>('#terminal');

if (dialog) {
  const data = JSON.parse(dialog.querySelector('[data-term-data]')?.textContent ?? '{}') as TermData;
  const S = data.strings;
  const out = dialog.querySelector<HTMLElement>('[data-term-output]')!;
  const scroller = dialog.querySelector<HTMLElement>('[data-term-scroll]')!;
  const form = dialog.querySelector<HTMLFormElement>('[data-term-form]')!;
  const input = dialog.querySelector<HTMLInputElement>('[data-term-input]')!;
  const rtl = document.documentElement.dir === 'rtl';
  const history: string[] = [];
  let hIndex = 0;
  let greeted = false;

  type Part = string | [cls: string, text: string] | { href: string; text: string };

  const line = (...parts: Part[]) => {
    const p = document.createElement('div');
    p.className = 't-line';
    for (const part of parts) {
      if (typeof part === 'string') p.append(part);
      else if (Array.isArray(part)) {
        const s = document.createElement('span');
        s.className = part[0];
        s.textContent = part[1];
        p.append(s);
      } else {
        const a = document.createElement('a');
        a.href = part.href;
        a.textContent = part.text;
        if (!part.href.startsWith('mailto:') && !part.href.startsWith('tel:')) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
        p.append(a);
      }
    }
    out.append(p);
    return p;
  };
  /** Localized prose line (Arabic content flows RTL inside the LTR terminal). */
  const prose = (text: string, cls = '') => {
    const p = line(cls ? [cls, text] : text);
    if (rtl) p.dir = 'rtl';
  };
  const blank = () => line(' ');

  const commands: Record<string, () => void> = {
    help() {
      line(['t-acc', `${S.help}:`]);
      for (const [name, desc] of Object.entries(S.commands)) line('  ', ['t-cmd', name.padEnd(12)], ['t-dim', desc]);
      line(['t-dim', S.tip]);
    },
    about() {
      line(['t-acc', data.about.name]);
      prose(data.about.headline, 't-vio');
      prose(`📍 ${data.about.location}`, 't-dim');
      blank();
      prose(data.about.summary);
      blank();
      prose(`🗣  ${data.about.languages.join(' · ')}`, 't-dim');
    },
    skills() {
      for (const cat of data.skills) {
        prose(`▸ ${cat.title}`, 't-acc');
        prose(`  ${cat.items.join(' · ')}`);
      }
    },
    experience() {
      for (const e of data.experience) {
        const p = line(['t-warn', e.current ? '* ' : '| '], ['t-cmd', e.role], ['t-dim', ' @ '], e.company);
        if (rtl) p.dir = 'rtl';
        prose(`  ${e.dates}`, 't-dim');
      }
    },
    projects() {
      line(['t-acc', `${S.fullStack}:`]);
      for (const pr of data.projects.fullStack) {
        if (pr.url) line('  ▸ ', ['t-cmd', pr.title], '  ', { href: pr.url, text: '↗' });
        else line('  ▸ ', ['t-cmd', pr.title]);
        prose(`    ${pr.subtitle}`, 't-dim');
      }
      blank();
      line(['t-acc', `${S.rpa}:`]);
      for (const title of data.projects.rpa) prose(`  ▸ ${title}`);
    },
    certs() {
      line(['t-acc', `${S.official}:`]);
      for (const c of data.certs.official) line('  ', ['t-ok', '✓ '], c);
      blank();
      line(['t-acc', `${S.training}:`]);
      for (const c of data.certs.training) line('  ▸ ', c);
    },
    cv() {
      line(['t-ok', S.downloading]);
      document.querySelector<HTMLAnchorElement>('[data-cv-link]')?.click();
    },
    contact() {
      const c = data.contact;
      line(['t-dim', 'email     '], { href: `mailto:${c.email}`, text: c.email });
      if (c.phone) line(['t-dim', 'phone     '], { href: `tel:${c.phone.replace(/\s/g, '')}`, text: c.phone });
      if (c.linkedin) line(['t-dim', 'linkedin  '], { href: c.linkedin, text: c.linkedin.replace(/^https?:\/\//, '') });
      if (c.github) line(['t-dim', 'github    '], { href: c.github, text: c.github.replace(/^https?:\/\//, '') });
    },
    theme() {
      toggleTheme();
      line(['t-ok', `${S.themeNow} ${getTheme()}`]);
    },
    clear() {
      out.replaceChildren();
    },
    exit() {
      dialog.close();
    },
    whoami() {
      line('guest, ', ['t-dim', 'visiting '], ['t-acc', data.about.name]);
    },
    sudo() {
      line(['t-err', S.sudo]);
    },
  };

  const exec = (raw: string) => {
    const cmdline = raw.trim();
    line(['t-ok', 'guest@abed:~$ '], ['t-cmd', cmdline]);
    if (!cmdline) return;
    history.push(cmdline);
    hIndex = history.length;
    const name = cmdline.split(/\s+/)[0]!.toLowerCase();
    const alias: Record<string, string> = { certifications: 'certs', resume: 'cv', ls: 'help', '?': 'help', cls: 'clear', quit: 'exit' };
    const fn = commands[alias[name] ?? name];
    if (fn) fn();
    else line(['t-err', `${name}: ${S.notFound}. `], ['t-dim', "Type 'help'."]);
  };

  const scroll = () => (scroller.scrollTop = scroller.scrollHeight);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    exec(input.value);
    input.value = '';
    scroll();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      hIndex = Math.max(0, hIndex - 1);
      input.value = history[hIndex] ?? '';
    } else if (e.key === 'ArrowDown' && history.length) {
      e.preventDefault();
      hIndex = Math.min(history.length, hIndex + 1);
      input.value = history[hIndex] ?? '';
    } else if (e.key === 'Tab' && input.value.trim()) {
      const v = input.value.trim().toLowerCase();
      const matches = Object.keys(S.commands).filter((c) => c.startsWith(v));
      if (matches.length === 1) {
        e.preventDefault();
        input.value = matches[0]!;
      } else if (matches.length > 1) {
        e.preventDefault();
        line(['t-dim', matches.join('  ')]);
        scroll();
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      commands.clear!();
    }
  });

  // Clicking anywhere in the terminal focuses the prompt (unless selecting text / clicking a link).
  scroller.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('a') && !window.getSelection()?.toString()) input.focus();
  });

  const open = () => {
    document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach((d) => d.close());
    if (!greeted) {
      greeted = true;
      prose(S.welcome, 't-acc');
      blank();
    }
    dialog.showModal();
    input.focus();
    scroll();
  };

  document.addEventListener('terminal:open', open);
  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('[data-terminal-open]')) open();
  });
}

export {};
