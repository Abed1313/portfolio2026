/**
 * Automatic image resolver.
 *
 * Drop a file into src/assets/images/** with the right name and it appears on the
 * site at the next build/dev reload. Missing files return `undefined` (or [])
 * so components render a fallback. A missing image never breaks the build.
 *
 * Accepted extensions: .webp, .jpg, .jpeg, .png (any case).
 * If several exist for the same name, the first in EXT_PRIORITY wins.
 */
import type { ImageMetadata } from 'astro';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{webp,jpg,jpeg,png,WEBP,JPG,JPEG,PNG}',
  { eager: true },
);

const EXT_PRIORITY = ['webp', 'png', 'jpg', 'jpeg'];
const ROOT = '/src/assets/images/';

/** Map of "folder/name" (lower-case, no extension) → image. */
const index = new Map<string, { ext: string; img: ImageMetadata }>();

for (const [path, mod] of Object.entries(files)) {
  const rel = path.slice(ROOT.length);
  const dot = rel.lastIndexOf('.');
  const key = rel.slice(0, dot).toLowerCase();
  const ext = rel.slice(dot + 1).toLowerCase();
  const existing = index.get(key);
  if (!existing || EXT_PRIORITY.indexOf(ext) < EXT_PRIORITY.indexOf(existing.ext)) {
    index.set(key, { ext, img: mod.default });
  }
}

function find(key: string): ImageMetadata | undefined {
  return index.get(key.toLowerCase())?.img;
}

/** src/assets/images/profile/me.* */
export const getProfilePhoto = () => find('profile/me');

/** src/assets/images/og/og-image.* */
export const getOgImage = () => find('og/og-image');

/** src/assets/images/logos/<id>.* */
export const getLogo = (id: string | undefined) => (id ? find(`logos/${id}`) : undefined);

/** src/assets/images/projects/<id>/cover.* */
export const getProjectCover = (id: string) => find(`projects/${id}/cover`);

/** src/assets/images/projects/<id>/1.*, 2.*, … sorted numerically. */
export function getProjectGallery(id: string): ImageMetadata[] {
  const prefix = `projects/${id.toLowerCase()}/`;
  return [...index.entries()]
    .filter(([key]) => key.startsWith(prefix) && /^\d+$/.test(key.slice(prefix.length)))
    .sort(([a], [b]) => Number(a.slice(prefix.length)) - Number(b.slice(prefix.length)))
    .map(([, v]) => v.img);
}

/** src/assets/images/certificates/<id>.* */
export const getCertificateImage = (id: string) => find(`certificates/${id}`);

/* ------------------------------------------------------------------ */
/* Files in /public (checked at build time)                            */
/* ------------------------------------------------------------------ */

/** True if public/<relativePath> exists. `relativePath` may start with "/". */
export function hasPublicFile(relativePath: string): boolean {
  return existsSync(join(process.cwd(), 'public', relativePath.replace(/^\/+/, '')));
}

/** public/certificates/<id>.pdf → "/certificates/<id>.pdf" or undefined. */
export function getCertificatePdf(id: string): string | undefined {
  const p = `/certificates/${id}.pdf`;
  return hasPublicFile(p) ? p : undefined;
}
