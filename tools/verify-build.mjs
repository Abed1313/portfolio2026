/**
 * Post-build sanity check (runs automatically after `npm run build`).
 *
 * Guards against a known Windows issue: building from a shell whose current
 * directory uses a lower-case drive letter (e.g. Git Bash "/c/Users/...")
 * makes Vite drop the stylesheet <link> from the HTML. Build from PowerShell,
 * CMD or VS Code's terminal (C:\...) instead. Cloudflare (Linux) is unaffected.
 */
import { readFileSync, readdirSync } from 'node:fs';

const pages = ['dist/index.html'];
for (const f of ['dist/ar/index.html', 'dist/404.html']) {
  try { readFileSync(f); pages.push(f); } catch { /* not built yet */ }
}

let failed = false;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const hasCss = /<link[^>]+rel="stylesheet"/.test(html) || /<style[\s>]/.test(html);
  if (!hasCss) {
    failed = true;
    console.error(`\n✖ ${page} has no stylesheet. The site would render unstyled.`);
  }
}

if (failed) {
  console.error(
    '  Likely cause (Windows): the build ran from a path with a lower-case drive letter\n' +
      '  (e.g. Git Bash "/c/..."). Run `npm run build` from PowerShell / CMD / VS Code instead.\n',
  );
  process.exit(1);
}

const css = readdirSync('dist/_astro').filter((f) => f.endsWith('.css'));
console.log(`✔ build verified: ${pages.length} page(s) with stylesheets, ${css.length} CSS file(s)`);
