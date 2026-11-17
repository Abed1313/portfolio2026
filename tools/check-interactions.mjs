/**
 * Interaction smoke test (Playwright + local Chrome). Run against `astro preview`.
 *   node tools/check-interactions.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4321';
const out = 'test-results/screens';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome' });
const results = [];
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`);

/* ---------- mobile ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 800 }, hasTouch: true, isMobile: true, colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });

  await page.click('[data-menu-open]');
  await page.waitForTimeout(400);
  check('mobile menu opens', await page.$eval('#mobile-menu', (d) => d.open));
  check('menu button aria-expanded=true', (await page.getAttribute('[data-menu-open]', 'aria-expanded')) === 'true');
  check('focus moved into menu', await page.evaluate(() => !!document.activeElement?.closest('#mobile-menu')));
  await page.screenshot({ path: `${out}/interaction-mobile-menu.png` });

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  check('Esc closes menu', !(await page.$eval('#mobile-menu', (d) => d.open)));

  await page.click('[data-menu-open]');
  await page.waitForTimeout(350);
  await page.click('#mobile-menu [data-menu-link][href="#skills"]');
  await page.waitForTimeout(900);
  check('menu link closes menu + scrolls', !(await page.$eval('#mobile-menu', (d) => d.open)) && (await page.evaluate(() => scrollY)) > 300);
  await ctx.close();
}

/* ---------- desktop ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });

  check('initial theme follows system (dark)', (await page.getAttribute('html', 'data-theme')) === 'dark');
  await page.click('nav [data-theme-toggle]');
  check('toggle → light', (await page.getAttribute('html', 'data-theme')) === 'light');
  await page.reload({ waitUntil: 'networkidle' });
  check('theme remembered after reload', (await page.getAttribute('html', 'data-theme')) === 'light');
  await page.click('nav [data-theme-toggle]');

  await page.click('[data-ide-tab="workflow"]');
  await page.waitForTimeout(2600);
  check('IDE tab switches to workflow', (await page.getAttribute('[data-ide-tab="workflow"]', 'aria-selected')) === 'true');
  check('inactive panel is inert', await page.$eval('#ide-panel-profile', (p) => p.inert));
  await page.locator('[data-ide]').screenshot({ path: `${out}/interaction-ide-workflow.png` });

  await page.focus('[data-ide-tab="workflow"]');
  await page.keyboard.press('ArrowLeft');
  check('IDE arrow-key navigation', (await page.getAttribute('[data-ide-tab="profile"]', 'aria-selected')) === 'true');

  await page.evaluate(() => document.getElementById('skills')?.scrollIntoView());
  await page.waitForTimeout(600);
  check('active nav link on scroll', (await page.getAttribute('nav [data-nav-link="skills"]', 'aria-current')) === 'true');
  check('back-to-top visible after scroll', (await page.getAttribute('[data-back-to-top]', 'data-visible')) === 'true');

  /* ---------- section anchors all exist ---------- */
  const missing = await page.$$eval('nav [data-nav-link]', (as) =>
    as.map((a) => a.getAttribute('href')).filter((h) => !document.querySelector(h)),
  );
  check('every navbar link has a target section', missing.length === 0, missing.join(', '));

  /* ---------- projects ---------- */
  await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
  await page.waitForTimeout(400);
  const visibleCards = () => page.$$eval('[data-project-card]', (cs) => cs.filter((c) => !c.hidden).length);
  const total = await visibleCards();
  await page.click('[data-filter="react"]');
  const reactCount = await visibleCards();
  check('React filter narrows cards', reactCount > 0 && reactCount < total, `${reactCount}/${total}`);
  await page.click('[data-filter=""]');
  check('All filter restores cards', (await visibleCards()) === total);

  await page.click('[data-proj-tab="rpa"]');
  check('RPA tab shows RPA panel', await page.$eval('#proj-panel-rpa', (p) => getComputedStyle(p).display !== 'none'));
  check('full-stack panel hidden on RPA tab', await page.$eval('#proj-panel-fullstack', (p) => getComputedStyle(p).display === 'none'));
  await page.screenshot({ path: `${out}/interaction-rpa-tab.png` });
  await page.click('[data-proj-tab="fullstack"]');

  // open modal by clicking the card body (stretched button)
  const card = page.locator('[data-project-card]').nth(1);
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await card.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + 60);
  await page.waitForTimeout(350);
  const openId = await page.evaluate(() => document.querySelector('dialog[open]')?.id);
  check('card click opens detail modal', !!openId?.startsWith('project-'), openId);
  await page.screenshot({ path: `${out}/interaction-project-modal.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(350);
  check('Esc closes modal', !(await page.$('dialog[open]')));
  check('focus returns to card after close', await page.evaluate(() => !!document.activeElement?.closest('[data-project-card]')));

  await page.click('[data-project-card] [data-dialog-open]');
  await page.waitForTimeout(350);
  await page.mouse.click(10, 10); // backdrop
  await page.waitForTimeout(350);
  check('backdrop click closes modal', !(await page.$('dialog[open]')));

  /* ---------- certifications ---------- */
  const visibleCerts = () => page.$$eval('[data-cert-card]', (cs) => cs.filter((c) => !c.hidden).length);
  const certTotal = await visibleCerts();
  await page.click('[data-cert-filter="project-management"]');
  check('cert category filter', (await visibleCerts()) === 3, `${await visibleCerts()}/${certTotal}`);
  await page.click('[data-cert-filter=""]');

  /* ---------- no empty buttons / dead links ---------- */
  const dead = await page.$$eval('a[href]', (as) =>
    as.filter((a) => { const h = a.getAttribute('href'); return h === '#' || h === '' || /\[.*\]/.test(h); }).map((a) => a.outerHTML.slice(0, 80)),
  );
  check('no "#" or placeholder links', dead.length === 0, dead.join(' | '));
  const pmp = await page.content();
  check('never says "PMP Certified"', !/PMP\s*®?\s*Certified/i.test(pmp));

  // light system preference on first visit
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const p2 = await ctx2.newPage();
  await p2.goto(base + '/', { waitUntil: 'networkidle' });
  check('first visit respects light system preference', (await p2.getAttribute('html', 'data-theme')) === 'light');
  await ctx2.close();
  await ctx.close();
}

await browser.close();
console.log(results.join('\n'));
process.exit(results.some((r) => r.startsWith('FAIL')) ? 1 : 0);
