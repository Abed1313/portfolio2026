/**
 * Contact-form validation shared by the browser (src/scripts/contact.ts)
 * and the Cloudflare Pages Function (functions/api/contact.ts).
 * No DOM or Node APIs here, so it runs in both environments.
 */
export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  /** Honeypot: must stay empty. Bots fill every field. */
  website?: string;
}

export type ContactField = 'name' | 'email' | 'message';

export const LIMITS = {
  name: { min: 2, max: 100 },
  message: { min: 10, max: 5000 },
  email: { max: 254 },
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalize(input: Partial<Record<keyof ContactPayload, unknown>>): ContactPayload {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  return { name: str(input.name), email: str(input.email), message: str(input.message), website: str(input.website) };
}

/** Returns the list of invalid fields (empty array = valid). */
export function validate(p: ContactPayload): ContactField[] {
  const errors: ContactField[] = [];
  if (p.name.length < LIMITS.name.min || p.name.length > LIMITS.name.max) errors.push('name');
  if (!EMAIL_RE.test(p.email) || p.email.length > LIMITS.email.max) errors.push('email');
  if (p.message.length < LIMITS.message.min || p.message.length > LIMITS.message.max) errors.push('message');
  return errors;
}

/** True when the honeypot was filled → silently accept and drop. */
export const isBot = (p: ContactPayload) => !!p.website;
