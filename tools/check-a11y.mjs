/**
 * Accessibility audit with axe-core (WCAG 2.0/2.1/2.2 A + AA), both themes, both languages,
 * including the open states of dialogs (palette, terminal, project modal, mobile menu).
 *   node tools/check-a11y.mjs
 */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.BASE_URL ?? 'http://localhost:4321';
const browser = await chromium.launch({ channel: 'chrome' });
let total = 0;

async function audit(page, label) {
  const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  total += res.violations.length;
  console.log(`${res.violations.length ? 'FAIL' : 'PASS'}  ${label}  (${res.passes.length} rules passed)`);
  for (const v of res.violations) {
    console.log(`   ✗ ${v.id} [${v.impact}] ${v.help}`);
    v.nodes.slice(0, 4).forEach((n) => console.log(`       ${n.target.join(' ')}  ${n.failureSummary?.split('\n')[1]?.trim() ?? ''}`));
  }
}

for (const path of ['/', '/ar/']) {
  for (const theme of ['dark', 'light']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(base + path, { waitUntil: 'networkidle' });
    // render everything (reveal + content-visibility) so axe sees final colours
    await page.addStyleTag({ content: '.section{content-visibility:visible!important}' });
    await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-visible')));
    await audit(page, `${path} ${theme} page`);

    if (theme === 'dark') {
      await page.keyboard.press('Control+k');
      await page.waitForTimeout(250);
      await audit(page, `${path} ${theme} command palette`);
      await page.keyboard.press('Escape');

      await page.evaluate(() => document.dispatchEvent(new CustomEvent('terminal:open')));
      await page.fill('[data-term-input]', 'help');
      await page.keyboard.press('Enter');
      await audit(page, `${path} ${theme} terminal`);
      await page.keyboard.press('Escape');

      await page.evaluate(() => document.querySelector('[data-dialog-open^="project-"]')?.click());
      await page.waitForTimeout(250);
      await audit(page, `${path} ${theme} project modal`);
      await page.keyboard.press('Escape');
    }
    await ctx.close();
  }
  const m = await browser.newContext({ viewport: { width: 375, height: 800 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const mp = await m.newPage();
  await mp.goto(base + path, { waitUntil: 'networkidle' });
  await mp.click('[data-menu-open]');
  await mp.waitForTimeout(300);
  await audit(mp, `${path} mobile menu`);
  await m.close();
}

const c404 = await browser.newContext();
const p404 = await c404.newPage();
await p404.goto(base + '/missing-page', { waitUntil: 'networkidle' });
await audit(p404, '404 page');

await browser.close();
console.log(total ? `\n${total} violation group(s)` : '\nNo accessibility violations.');
process.exit(total ? 1 : 0);
