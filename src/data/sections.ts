/**
 * Page sections in display order.
 * `code` is the decorative code-style label shown above each section title
 * (e.g. "01. // about"). `nav` controls visibility in the desktop navbar
 * ("lg" = always on desktop, "xl" = only on wide screens; the mobile menu shows all).
 */
export const sections = [
  { id: 'about', code: '// about', nav: 'lg' },
  { id: 'skills', code: '<skills />', nav: 'lg' },
  { id: 'experience', code: 'git log --experience', nav: 'lg' },
  { id: 'projects', code: 'ls ./projects', nav: 'lg' },
  { id: 'certifications', code: 'cat certifications.json', nav: 'lg' },
  { id: 'education', code: 'import { education }', nav: 'xl' },
  { id: 'volunteering', code: '/* volunteering */', nav: 'xl' },
  { id: 'contact', code: './contact.sh', nav: 'lg' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

/** "01", "02", … for a section id. */
export function sectionNumber(id: SectionId): string {
  return String(sections.findIndex((s) => s.id === id) + 1).padStart(2, '0');
}
