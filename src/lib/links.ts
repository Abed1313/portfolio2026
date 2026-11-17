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
