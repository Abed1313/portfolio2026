/**
 * Responsive layout check (Playwright + the locally installed Chrome).
 *
 *   npm run build && npx astro preview      # in one terminal
 *   node tools/check-layout.mjs [path] [--widths=375,768,1440] [--themes=dark,light]
 *
 * For each width/theme it:
 *   - saves a full-page screenshot to test-results/screens/
 *   - fails if the page scrolls horizontally, and lists the overflowing elements
 *   - reports console errors and failed requests
 *   - lists interactive elements smaller than 44x44 px (tap targets)
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const path = args.find((a) => !a.startsWith('--')) ?? '/';
const opt = (name, def) => (args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? def).split(',');
const widths = opt('widths', '360,375,390,768,1024,1280,1440,1920').map(Number);
const themes = opt('themes', 'dark,light');
const base = process.env.BASE_URL ?? 'http://localhost:4321';
const outDir = 'test-results/screens';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome' });
let failures = 0;

for (const theme of themes) {
  for (const width of widths) {
    const height = width < 768 ? 800 : 900;
    const ctx = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      colorScheme: theme,
      hasTouch: width < 1024,
      isMobile: width < 768,
      reducedMotion: 'reduce', // final state of animations, deterministic screenshots
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('requestfailed', (r) => errors.push(`request failed: ${r.url()}`));
    page.on('response', (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));

    await page.goto(base + path, { waitUntil: 'networkidle' });
    // reveal everything that animates in on scroll
    await page.evaluate(() => document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible')));
    await page.waitForTimeout(150);

    const result = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const overflow = document.documentElement.scrollWidth - vw;
      const offenders = [];
      if (overflow > 0) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width && (r.right > vw + 1 || r.left < -1)) {
            // skip elements inside a scroll container (intended)
            let p = el.parentElement, clipped = false;
            while (p && p !== document.body) {
              const s = getComputedStyle(p);
              if (/(auto|scroll|hidden|clip)/.test(s.overflowX)) { clipped = true; break; }
              p = p.parentElement;
            }
            if (!clipped) offenders.push(`${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join('.')} right=${Math.round(r.right)}`);
          }
        }
      }
      const small = [];
      for (const el of document.querySelectorAll('a[href], button, [role="tab"], input, select, textarea, summary')) {
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || el.closest('[inert], dialog:not([open]), .sr-only')) continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (el.closest('p, li > span, dd') && el.tagName === 'A' && !el.className) continue; // inline text links
        if (r.width < 44 || r.height < 44) small.push(`${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
      return { overflow, offenders: offenders.slice(0, 10), small: [...new Set(small)].slice(0, 15) };
    });

    const file = `${outDir}/${path.replace(/\W+/g, '_') || 'home'}-${theme}-${width}.png`;
    await page.screenshot({ path: file, fullPage: true });

    const ok = result.overflow <= 0 && errors.length === 0;
    if (!ok) failures++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${theme.padEnd(5)} ${String(width).padStart(4)}px  overflow=${result.overflow}px  errors=${errors.length}  → ${file}`);
    result.offenders.forEach((o) => console.log(`        overflow: ${o}`));
    errors.forEach((e) => console.log(`        error: ${e}`));
    if (result.small.length) console.log(`        small tap targets: ${result.small.join(' | ')}`);
    await ctx.close();
  }
}

await browser.close();
process.exit(failures ? 1 : 0);
