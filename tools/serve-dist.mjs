/**
 * Minimal static server for dist/ that behaves like Cloudflare Pages for testing:
 * gzip/brotli compression, long cache for hashed assets, /path → /path/index.html,
 * and dist/404.html with status 404. (No Pages Functions; use `wrangler pages dev` for those.)
 *   node tools/serve-dist.mjs [port=4322]
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';

const root = join(process.cwd(), 'dist');
const port = Number(process.argv[2] ?? 4322);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf',
};
const compressible = /text|javascript|json|xml|svg/;

async function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  for (const candidate of [clean, join(clean, 'index.html'), `${clean}.html`]) {
    const file = join(root, candidate);
    if (!file.startsWith(root)) return null;
    try { if ((await stat(file)).isFile()) return file; } catch { /* next */ }
  }
  return null;
}

createServer(async (req, res) => {
  let file = await resolve(req.url ?? '/');
  let status = 200;
  if (!file) { file = join(root, '404.html'); status = 404; }
  const type = types[extname(file)] ?? 'application/octet-stream';
  let body = await readFile(file);
  const headers = { 'content-type': type, 'cache-control': file.includes('_astro') ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate' };
  const accept = String(req.headers['accept-encoding'] ?? '');
  if (compressible.test(type)) {
    if (accept.includes('br')) { body = brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 9 } }); headers['content-encoding'] = 'br'; }
    else if (accept.includes('gzip')) { body = gzipSync(body); headers['content-encoding'] = 'gzip'; }
    headers['vary'] = 'accept-encoding';
  }
  res.writeHead(status, headers).end(body);
}).listen(port, () => console.log(`serving dist/ on http://localhost:${port} (compressed, Cloudflare-like)`));
