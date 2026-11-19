/**
 * Generates brand assets from src/data (re-run after changing your name/title):
 *   node tools/generate-brand.mjs
 *
 *   public/favicon.svg            "AR" monogram (scalable favicon)
 *   public/favicon.ico            32x32 fallback for old browsers / crawlers
 *   public/apple-touch-icon.png   180x180 (iOS home screen)
 *   public/icon-512.png           512x512 (PWA / Android)
 *   src/assets/og-default.png     1200x630 default link-preview image
 *                                 (used only when src/assets/images/og/og-image.* is missing)
 *
 * Requires Node 22.18+ / 24 (imports the .ts data files directly via type stripping).
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { profile } from '../src/data/profile.ts';
import { certifications } from '../src/data/certifications.ts';

const en = (t) => (typeof t === 'string' ? t : t.en);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const initials = profile.initials;

/* ---------- favicon (SVG) ---------- */
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#14b8a6"/><stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#0b0f17"/>
  <rect x="1.5" y="1.5" width="61" height="61" rx="12.5" fill="none" stroke="url(#g)" stroke-width="3"/>
  <text x="32" y="42" text-anchor="middle" font-family="Consolas, 'JetBrains Mono', 'Courier New', monospace" font-size="27" font-weight="700" fill="url(#g)">${initials}</text>
</svg>`;
writeFileSync('public/favicon.svg', faviconSvg);

/* ---------- PNG icons ---------- */
const png = (size) => sharp(Buffer.from(faviconSvg), { density: Math.ceil((72 * size) / 64) }).resize(size, size).png().toBuffer();
writeFileSync('public/apple-touch-icon.png', await png(180));
writeFileSync('public/icon-512.png', await png(512));

/* ---------- favicon.ico (single 32x32 PNG inside an ICO container) ---------- */
const ico32 = await png(32);
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // count
const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0); // width
entry.writeUInt8(32, 1); // height
entry.writeUInt8(0, 2); // palette
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(1, 4); // color planes
entry.writeUInt16LE(32, 6); // bits per pixel
entry.writeUInt32LE(ico32.length, 8); // size
entry.writeUInt32LE(22, 12); // offset
writeFileSync('public/favicon.ico', Buffer.concat([header, entry, ico32]));

/* ---------- default Open Graph image ---------- */
const name = esc(en(profile.name));
const [lead, rest] = en(profile.headline).split('|').map((s) => esc(s.trim()));
const location = esc(en(profile.location));
const certCodes = certifications
  .filter((c) => c.featured)
  .map((c) => en(c.title).match(/\(([A-Z0-9]+)\)/)?.[1])
  .filter(Boolean);
const chips = [`Blue Prism ${certCodes.join(' · ')}`.trim(), '.NET full-stack', location];

let x = 80;
const chipSvg = chips
  .map((label) => {
    const w = 28 + label.length * 13.2;
    const s = `<g transform="translate(${x},468)">
      <rect width="${w}" height="52" rx="26" fill="#111826" stroke="#2c3b55"/>
      <text x="${w / 2}" y="34" text-anchor="middle" font-family="Consolas, monospace" font-size="22" fill="#9aa8bd">${esc(label)}</text>
    </g>`;
    x += w + 16;
    return s;
  })
  .join('');

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow1" cx="0.2" cy="0.15" r="0.6"><stop offset="0" stop-color="#14b8a6" stop-opacity="0.35"/><stop offset="1" stop-color="#14b8a6" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow2" cx="0.9" cy="0.9" r="0.55"><stop offset="0" stop-color="#8b5cf6" stop-opacity="0.25"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient>
    <linearGradient id="txt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2dd4bf"/><stop offset="1" stop-color="#67e8f9"/></linearGradient>
    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" fill="#94a3b8" fill-opacity="0.12"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="#0b0f17"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  <text x="80" y="118" font-family="Consolas, monospace" font-size="30" font-weight="700" fill="#e6edf7"><tspan fill="#2dd4bf">&lt;</tspan>${initials}<tspan fill="#2dd4bf"> /&gt;</tspan></text>
  <text x="80" y="200" font-family="Consolas, monospace" font-size="26" fill="#2dd4bf">&gt; hello world, I'm</text>
  <text x="80" y="290" font-family="'Segoe UI', Inter, Arial, sans-serif" font-size="78" font-weight="800" fill="#e6edf7" letter-spacing="-1.5">${name}</text>
  <text x="80" y="368" font-family="'Segoe UI', Inter, Arial, sans-serif" font-size="40" font-weight="600"><tspan fill="url(#txt)">${lead}</tspan>${rest ? `<tspan fill="#64748b"> | </tspan><tspan fill="#e6edf7">${rest}</tspan>` : ''}</text>
  ${chipSvg}
  <rect x="0" y="606" width="1200" height="24" fill="#0e1420"/>
</svg>`;
await sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9 }).toFile('src/assets/og-default.png');

console.log('✔ generated favicon.svg, favicon.ico, apple-touch-icon.png, icon-512.png, src/assets/og-default.png');
