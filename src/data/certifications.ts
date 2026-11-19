import type { Certification, CertificationCategory, L10n } from './types';

/*
 * Files picked up automatically (all optional):
 *   src/assets/images/certificates/<id>.(webp|jpg|jpeg|png) → "View Certificate" (lightbox)
 *   public/certificates/<id>.pdf                            → "Open PDF"
 *   credentialUrl                                           → "Verify" (new tab)
 *   src/assets/images/logos/<issuerLogoId>.*                → issuer logo (monogram fallback)
 *
 * "[ISSUER]" placeholders are hidden on the site until replaced.
 * NOTE: the PMP item is a PREPARATION COURSE, not the PMP certification.
 */
export const certifications: Certification[] = [
  /* ---------------- Official certifications (featured) ---------------- */
  {
    id: 'blue-prism-pdev01',
    title: 'Blue Prism® Professional Developer Certification (PDEV01)',
    issuer: 'Blue Prism',
    issuerLogoId: 'blue-prism',
    date: { en: 'Jul 2025', ar: 'تموز 2025' },
    category: 'rpa',
    type: 'certification',
    featured: true,
    credentialUrl: '',
  },
  {
    id: 'blue-prism-ad01',
    title: 'Blue Prism Certified Developer (AD01)',
    issuer: 'Blue Prism',
    issuerLogoId: 'blue-prism',
    date: { en: 'Jul 2025', ar: 'تموز 2025' },
    category: 'rpa',
    type: 'certification',
    featured: true,
    credentialUrl: '',
  },

  /* ---------------- Training & courses ---------------- */
  {
    id: 'blue-prism-foundation',
    title: 'Blue Prism Foundation Training',
    issuer: 'Blue Prism',
    issuerLogoId: 'blue-prism',
    date: { en: 'Jan 2025', ar: 'كانون الثاني 2025' },
    category: 'rpa',
    type: 'training',
  },
  {
    id: 'dotnet-full-stack',
    title: '.NET Full-Stack Developer Certification',
    /** TODO: issuer */
    issuer: '[ISSUER]',
    date: { en: 'Jan 2024', ar: 'كانون الثاني 2024' },
    category: 'software',
    type: 'training',
  },
  {
    id: 'btec',
    title: 'BTEC Certification',
    issuer: 'Pearson BTEC',
    issuerLogoId: 'pearson-btec',
    date: { en: 'Jan 2024', ar: 'كانون الثاني 2024' },
    category: 'software',
    type: 'training',
  },
  {
    id: 'applied-ai-executive',
    title: 'Executive Certificate in Applied Artificial Intelligence',
    issuer: 'Cyborg Academy',
    issuerLogoId: 'cyborg-academy',
    date: { en: 'Jun 2026', ar: 'حزيران 2026' },
    category: 'ai',
    type: 'training',
  },
  {
    id: 'appian-app-development',
    title: 'Appian Application Development Training',
    issuer: 'Cyborg Academy',
    issuerLogoId: 'cyborg-academy',
    date: { en: 'Jul 2026', ar: 'تموز 2026' },
    category: 'rpa',
    type: 'training',
  },
  {
    id: 'pmp-prep-35-pdus',
    title: 'PMP® Preparation Course (35 PDUs)',
    issuer: 'Gaza Phoenix (PMI® Authorized Training Partner)',
    date: { en: 'Mar 2026', ar: 'آذار 2026' },
    category: 'project-management',
    type: 'training',
    note: {
      en: 'Preparation course for the PMP® exam',
      ar: 'دورة تحضيرية لامتحان PMP®',
    },
  },
  {
    id: 'scrum-agile-kanban',
    title: 'Scrum, Agile & Kanban Mastery (PMI®-aligned)',
    /** TODO: issuer */
    issuer: '[ISSUER]',
    date: { en: 'Jan 2026', ar: 'كانون الثاني 2026' },
    category: 'project-management',
    type: 'training',
  },
  {
    id: 'genai-project-management',
    title: 'Generative AI in Project Management: PMBOK® 8-Aligned',
    issuer: 'Udemy',
    date: { en: 'Jan 2026', ar: 'كانون الثاني 2026' },
    category: 'project-management',
    type: 'training',
    credentialUrl: 'https://ude.my/UC-6acbf75f-a293-4e0e-aaf6-a5cbbd112283',
  },
];

/** Display order + labels for the filter chips. */
export const certificationCategories: { id: CertificationCategory; label: L10n }[] = [
  { id: 'rpa', label: { en: 'RPA', ar: 'RPA' } },
  { id: 'software', label: { en: 'Software Development', ar: 'تطوير البرمجيات' } },
  { id: 'ai', label: { en: 'Artificial Intelligence', ar: 'الذكاء الاصطناعي' } },
  { id: 'project-management', label: { en: 'Project Management', ar: 'إدارة المشاريع' } },
];
