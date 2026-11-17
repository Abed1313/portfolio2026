/**
 * Cloudflare Pages Function: POST /api/contact
 * Used when siteConfig.contact.provider === "resend".
 *
 * Environment variables (Cloudflare dashboard → your Pages project → Settings →
 * Variables and Secrets; locally in a `.dev.vars` file, which is git-ignored):
 *   RESEND_API_KEY      (secret)   API key from https://resend.com
 *   CONTACT_TO_EMAIL               inbox that receives the messages
 *   CONTACT_FROM_EMAIL  (optional) verified sender, e.g. "Portfolio <hello@yourdomain.com>".
 *                                  Defaults to Resend's test sender "onboarding@resend.dev",
 *                                  which can only deliver to your own Resend account email.
 */
import { isBot, normalize, validate } from '../../src/lib/contact-validation';

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

interface Context {
  request: Request;
  env: Env;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

/** Single entry point: dispatch by method (avoids relying on handler precedence). */
export async function onRequest(context: Context): Promise<Response> {
  if (context.request.method === 'POST') return handlePost(context);
  return json({ ok: false, error: 'method_not_allowed' }, 405);
}

async function handlePost({ request, env }: Context): Promise<Response> {
  // Same-origin only (blocks other sites from posting to this endpoint from a browser).
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ ok: false, error: 'forbidden' }, 403);
  }

  if (!(request.headers.get('content-type') ?? '').includes('application/json')) {
    return json({ ok: false, error: 'unsupported_media_type' }, 415);
  }
  if (Number(request.headers.get('content-length') ?? 0) > 20_000) {
    return json({ ok: false, error: 'too_large' }, 413);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const payload = normalize((raw ?? {}) as Record<string, unknown>);

  // Honeypot filled → pretend success so bots learn nothing.
  if (isBot(payload)) return json({ ok: true });

  const fields = validate(payload);
  if (fields.length) return json({ ok: false, error: 'validation', fields }, 422);

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
      to: [env.CONTACT_TO_EMAIL],
      reply_to: payload.email,
      subject: `Portfolio message from ${payload.name}`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
    }),
  });

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text().catch(() => ''));
    return json({ ok: false, error: 'send_failed' }, 502);
  }
  return json({ ok: true });
}
