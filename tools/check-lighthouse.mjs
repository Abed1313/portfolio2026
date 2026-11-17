/**
 * Lighthouse audit (local Chrome) for the built site served by `astro preview`.
 *   node tools/check-lighthouse.mjs [paths=/,/ar/]
 * Writes HTML reports to .lighthouse/ and prints scores + audits that need attention.
 * Note: `astro preview` serves without HTTP/2 or Brotli; Cloudflare adds both, so
 * real-world performance is usually a bit better than the local numbers.
 */
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import * as chromeLauncher from 'chrome-launcher';
import { mkdirSync, writeFileSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4321';
const paths = (process.argv[2] ?? '/,/ar/').split(',');
/** Lighthouse varies a lot run-to-run on a busy PC; report the median of N runs. */
const RUNS = Number(process.env.LH_RUNS ?? 3);
mkdirSync('.lighthouse', { recursive: true });

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-first-run'] });
const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
let worst = 100;

for (const path of paths) {
  for (const formFactor of ['mobile', 'desktop']) {
    // Official desktop preset (desktop throttling + screen); default config = mobile.
    const config = formFactor === 'desktop' ? desktopConfig : undefined;
    const results = [];
    for (let r = 0; r < RUNS; r++) {
      results.push(await lighthouse(base + path, { port: chrome.port, output: 'html', onlyCategories: categories, logLevel: 'error' }, config));
    }
    results.sort((a, b) => a.lhr.categories.performance.score - b.lhr.categories.performance.score);
    const result = results[Math.floor(results.length / 2)];
    const lhr = result.lhr;
    if (RUNS > 1) console.log(`\n   performance over ${RUNS} runs: ${results.map((x) => Math.round(x.lhr.categories.performance.score * 100)).join(', ')} → median`);
    const name = `${path.replace(/\W+/g, '') || 'en'}-${formFactor}`;
    writeFileSync(`.lighthouse/${name}.html`, result.report);

    const scores = categories.map((c) => Math.round((lhr.categories[c]?.score ?? 0) * 100));
    worst = Math.min(worst, ...scores);
    console.log(`\n${path} [${formFactor}]  perf ${scores[0]} · a11y ${scores[1]} · best ${scores[2]} · seo ${scores[3]}`);
    const m = (id) => lhr.audits[id]?.displayValue ?? '-';
    console.log(`   LCP ${m('largest-contentful-paint')} · CLS ${m('cumulative-layout-shift')} · TBT ${m('total-blocking-time')} · FCP ${m('first-contentful-paint')}`);

    for (const cat of categories) {
      for (const ref of lhr.categories[cat].auditRefs) {
        const a = lhr.audits[ref.id];
        if (!a || a.score === null || a.score >= 0.9 || a.scoreDisplayMode === 'informative' || a.scoreDisplayMode === 'notApplicable') continue;
        if (ref.weight === 0 && cat === 'performance' && a.scoreDisplayMode !== 'binary') continue;
        console.log(`   ✗ [${cat}] ${a.id}: ${a.title}${a.displayValue ? ` (${a.displayValue})` : ''}`);
      }
    }
  }
}

await chrome.kill();
console.log(`\nLowest score: ${worst}. Reports: .lighthouse/*.html`);
