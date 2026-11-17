/**
 * A link counts as "set" only when it is a non-empty string that is not a
 * "[PLACEHOLDER]" token. Use this everywhere before rendering a button/link,
 * so unfinished data never produces broken links or "#" hrefs.
 */
export function isSet(value: string | undefined | null): value is string {
  if (!value) return false;
  const v = value.trim();
  if (v === '' || v === '#') return false;
  if (/^\[.*\]$/.test(v)) return false;
  return true;
}

/** Same rule for plain text fields such as "[YEAR]" or "[ISSUER]". */
export const isFilled = isSet;

/* ---------- phone ---------- */

const digits = (phone: string) => phone.replace(/[^\d]/g, '');

/** "tel:+962796026511" */
export const telHref = (phone: string) => `tel:+${digits(phone)}`;

/** "https://wa.me/962796026511" (WhatsApp wants digits only, no "+"). */
export const whatsappHref = (phone: string) => `https://wa.me/${digits(phone)}`;

/**
 * Human-readable phone. Jordanian mobiles get "+962 79 602 6511";
 * other numbers are shown as "+<digits>".
 */
export function formatPhone(phone: string): string {
  const d = digits(phone);
  const jo = d.match(/^962(7\d)(\d{3})(\d{4})$/);
  return jo ? `+962 ${jo[1]} ${jo[2]} ${jo[3]}` : `+${d}`;
}
