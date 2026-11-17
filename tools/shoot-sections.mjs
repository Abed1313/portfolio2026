/**
 * Screenshot individual sections for visual review.
 *   node tools/shoot-sections.mjs [ids=top,projects] [widths=1440,375] [theme=dark] [path=/]
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [ids = 'top,about,skills,experience,projects,certifications,education,volunteering', widths = '1440,768,375', theme = 'dark', path = '/'] =
  process.argv.slice(2);
const base = process.env.BASE_URL ?? 'http://localhost:4321';
mkdirSync('test-results/screens', { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
for (const w of widths.split(',').map(Number)) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: w < 768 ? 800 : 900 },
    colorScheme: theme,
    reducedMotion: 'reduce',
    isMobile: w < 768,
    hasTouch: w < 1024,
  });
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-visible')));
  for (const id of ids.split(',')) {
    const el = page.locator(`#${id}`);
    if (!(await el.count())) continue;
    const file = `test-results/screens/sec-${path.replace(/\W+/g, '') || 'en'}-${id}-${theme}-${w}.png`;
    await el.screenshot({ path: file });
    console.log(file);
  }
  await ctx.close();
}
await browser.close();
