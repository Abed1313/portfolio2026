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
  await page.click('#mobile-menu [data-menu-link][data-nav-link="skills"]');
  await page.waitForTimeout(1800);
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
    as.map((a) => new URL(a.href).hash).filter((h) => !h || !document.querySelector(h)),
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

  /* ---------- command palette ---------- */
  await page.evaluate(() => scrollTo(0, 0));
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(300);
  check('Ctrl+K opens palette', await page.$eval('#command-palette', (d) => d.open));
  check('palette input focused', await page.evaluate(() => document.activeElement?.matches('[data-palette-input]')));
  await page.keyboard.type('certif');
  const shown = await page.$$eval('#command-palette [role="option"]', (os) => os.filter((o) => !o.hidden).length);
  check('palette filters', shown === 1, `${shown} visible`);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1800);
  check('palette Enter jumps to section', await page.evaluate(() => {
    const r = document.getElementById('certifications').getBoundingClientRect();
    return r.top < 200 && r.bottom > 0;
  }));
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(200);
  await page.keyboard.type('terminal');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(350);
  check('palette opens terminal', await page.$eval('#terminal', (d) => d.open));

  /* ---------- terminal ---------- */
  const term = async (cmd) => {
    await page.fill('[data-term-input]', cmd);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(80);
    return page.$eval('[data-term-output]', (o) => o.textContent);
  };
  let outText = await term('help');
  check('terminal help lists commands', ['about', 'skills', 'experience', 'projects', 'certs', 'cv', 'contact', 'theme', 'clear'].every((c) => outText.includes(c)));
  outText = await term('experience');
  check('terminal experience shows current role', outText.includes('RPA Support Engineer'));
  outText = await term('certs');
  check('terminal certs shows PDEV01', outText.includes('PDEV01'));
  outText = await term('foo');
  check('unknown command message', outText.includes('foo: command not found'));
  const before = await page.getAttribute('html', 'data-theme');
  await term('theme');
  check('terminal theme toggles', (await page.getAttribute('html', 'data-theme')) !== before);
  await term('theme');
  await term('clear');
  check('terminal clear', (await page.$eval('[data-term-output]', (o) => o.children.length)) === 0);
  await page.fill('[data-term-input]', 'exp');
  await page.keyboard.press('Tab');
  check('terminal Tab autocomplete', (await page.inputValue('[data-term-input]')) === 'experience');
  await page.screenshot({ path: `${out}/interaction-terminal.png` });
  await term('exit');
  check('terminal exit closes', !(await page.$eval('#terminal', (d) => d.open)));

  /* ---------- contact form ---------- */
  await page.evaluate(() => document.getElementById('contact').scrollIntoView());
  await page.click('[data-contact-form] [data-submit]');
  check('empty submit shows 3 errors', (await page.$$eval('[data-error-for]:not([hidden])', (e) => e.length)) === 3);
  check('focus moves to first invalid field', await page.evaluate(() => document.activeElement?.id === 'cf-name'));
  await page.fill('#cf-name', 'Test Recruiter');
  await page.fill('#cf-email', 'recruiter@example.com');
  await page.fill('#cf-message', 'Hello, we have an RPA role for you.');
  check('errors clear when fixed', (await page.$$eval('[data-error-for]:not([hidden])', (e) => e.length)) === 0);
  await page.click('[data-contact-form] [data-submit]');
  await page.waitForTimeout(200);
  const statusText = await page.$eval('[data-form-status]', (s) => s.textContent);
  check('unconfigured provider → friendly message', /not configured/i.test(statusText), statusText);
  check('phone shown in contact', (await page.$eval('#contact', (s) => s.textContent)).includes('+962 79 602 6511'));
  check('WhatsApp link', !!(await page.$('#contact a[href="https://wa.me/962796026511"]')));
  check('phone ONLY in contact section', await page.evaluate(() => {
    const clone = document.body.cloneNode(true);
    clone.querySelector('#contact')?.remove();
    clone.querySelectorAll('script, dialog').forEach((s) => s.remove());
    return !clone.textContent.includes('602 6511') && !clone.innerHTML.includes('796026511');
  }));
  await page.click('#contact [data-copy]');
  await page.waitForTimeout(200);
  check('copy email shows toast', ((await page.$eval('#toast-root', (t) => t.textContent)) || '').includes('copied'));

  // light system preference on first visit
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const p2 = await ctx2.newPage();
  await p2.goto(base + '/', { waitUntil: 'networkidle' });
  check('first visit respects light system preference', (await p2.getAttribute('html', 'data-theme')) === 'light');
  await ctx2.close();
  await ctx.close();
}

/* ---------- Arabic / RTL + language switch + SEO + 404 ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark', permissions: [] });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  // Immediately after load (sections not yet rendered): nav links must still land exactly.
  for (const id of ['certifications', 'projects']) {
    await page.click(`nav [data-nav-link="${id}"]`);
    await page.waitForTimeout(1800);
    const top = await page.evaluate((id) => Math.round(document.getElementById(id).getBoundingClientRect().top), id);
    check(`nav link lands on #${id}`, Math.abs(top - 96) <= 4, `top=${top}px`);
  }
  await page.click('nav [data-lang-switch]');
  await page.waitForLoadState('networkidle');
  check('language switch → /ar/ keeps section', page.url().endsWith('/ar/#projects'), page.url());
  check('Arabic page is rtl', (await page.getAttribute('html', 'dir')) === 'rtl' && (await page.getAttribute('html', 'lang')) === 'ar');
  check('Arabic nav labels', (await page.textContent('nav')).includes('المشاريع'));
  const ff = await page.$eval('body', (b) => getComputedStyle(b).fontFamily);
  check('Arabic font applied', ff.includes('IBM Plex Sans Arabic'), ff);
  const headLinks = await page.$$eval('link[rel="alternate"][hreflang]', (ls) => ls.map((l) => l.hreflang).sort().join(','));
  check('hreflang alternates', headLinks === 'ar,en,x-default', headLinks);
  const ld = await page.$eval('script[type="application/ld+json"]', (s) => JSON.parse(s.textContent));
  check('JSON-LD Person', ld['@type'] === 'Person' && ld.jobTitle === 'RPA Support Engineer', ld.jobTitle);
  check('og:image present', !!(await page.$('meta[property="og:image"]')));
  await page.screenshot({ path: `${out}/interaction-ar-desktop.png` });

  const r404 = await page.goto(base + '/this/does-not-exist', { waitUntil: 'networkidle' });
  check('404 status', r404.status() === 404, String(r404.status()));
  check('404 shows path', (await page.textContent('[data-path]')).includes('/this/does-not-exist'));
  check('404 noindex', !!(await page.$('meta[name="robots"][content*="noindex"]')));
  await page.click('main a[href="/"]');
  await page.waitForLoadState('networkidle');
  check('404 go home works', new URL(page.url()).pathname === '/');

  const robots = await (await page.request.get(base + '/robots.txt')).text();
  check('robots.txt has sitemap', /Sitemap: https?:\/\/.+\/sitemap-index\.xml/.test(robots));
  await ctx.close();
}

await browser.close();
console.log(results.join('\n'));
process.exit(results.some((r) => r.startsWith('FAIL')) ? 1 : 0);
