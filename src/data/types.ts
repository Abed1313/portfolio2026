/**
 * Shared content types for the portfolio.
 * Every personal fact on the site lives in src/data/*.ts and is typed here.
 */

export type Locale = 'en' | 'ar';

/**
 * A translatable string. English is required; Arabic is optional and
 * falls back to English when missing (see `tr()` in src/lib/i18n.ts).
 */
export interface L10n {
  en: string;
  ar?: string;
}

/** Plain strings are allowed where text is identical in every language (names, tech terms). */
export type Text = string | L10n;

/**
 * Icon reference for astro-icon.
 *  - "lucide:<name>"        → UI / generic icons
 *  - "simple-icons:<name>"  → official tech & brand logos
 */
export type IconName = `lucide:${string}` | `simple-icons:${string}`;

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

export interface SpokenLanguage {
  name: Text;
  level: Text;
}

export interface Profile {
  name: Text;
  /** Short name used for initials avatar + logo, e.g. "AR". */
  initials: string;
  title: Text;
  /** Positioning line shown in the hero. */
  headline: Text;
  /** One-line value statement shown under the hero title. */
  valueStatement: Text;
  location: Text;
  email: string;
  /**
   * Phone in international format, digits only after "+" (e.g. "+962791234567").
   * Shown ONLY in the Contact section (call + WhatsApp buttons). Remove/empty to hide.
   */
  phone?: string;
  summary: Text;
  languages: SpokenLanguage[];
  currentRole: Text;
  /** Short tech list shown in the hero `profile.ts` code window. */
  heroStack: string[];
  /** Items in the About → "currently working on" card. */
  currentlyWorkingOn: Text[];
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export interface Skill {
  name: Text;
  icon?: IconName;
}

export interface SkillCategory {
  id: string;
  title: Text;
  icon: IconName;
  skills: Skill[];
}

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export interface ExperienceItem {
  id: string;
  role: Text;
  company: Text;
  /** Matches src/assets/images/logos/<logoId>.* (optional). */
  logoId?: string;
  start: Text;
  /** Leave undefined for a current role. */
  end?: Text;
  current?: boolean;
  /** Short note shown on the commit, e.g. "Promoted from RPA Developer". */
  promotion?: Text;
  location?: Text;
  bullets: Text[];
  tags?: string[];
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type ProjectStatus = 'in-progress' | 'live' | 'archived';

export interface ProjectBadge {
  label: Text;
  tone?: 'accent' | 'violet' | 'neutral' | 'success' | 'warning';
}

/** Full-stack development project. Images resolve from src/assets/images/projects/<id>/. */
export interface Project {
  id: string;
  title: Text;
  /** Short line under the title (the "| React · …" part). */
  subtitle: Text;
  description: Text;
  /** Longer copy shown in the detail modal (optional, falls back to description). */
  details?: Text[];
  tags: string[];
  /** Empty string or "[PLACEHOLDER]" = treated as missing → button hidden. */
  githubUrl?: string;
  /** When set (and valid), a "Live Demo" / "Visit Website" button appears. */
  liveUrl?: string;
  status?: ProjectStatus;
  featured?: boolean;
  badges?: ProjectBadge[];
  role?: Text;
  type?: Text;
  date?: Text;
  /** Placeholder style when no cover image exists. */
  placeholder?: 'gradient' | 'code';
  /** Extra note shown in the modal (e.g. privacy notice). */
  note?: Text;
}

/** One node of an animated RPA process-flow diagram. */
export interface FlowStep {
  label: Text;
  icon: IconName;
  /** Visual role of the node in the diagram. */
  kind?: 'trigger' | 'queue' | 'process' | 'exception' | 'notify' | 'done';
}

/** Confidential enterprise RPA project: no images, no links. */
export interface RpaProject {
  id: string;
  title: Text;
  subtitle: string;
  description: Text;
  tags: string[];
  flow: FlowStep[];
}

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */

export interface EducationItem {
  id: string;
  title: Text;
  institution: Text;
  location?: Text;
  logoId?: string;
  /** "[YEAR]" placeholder is hidden automatically. */
  year: string;
  note?: Text;
}

/* ------------------------------------------------------------------ */
/* Certifications                                                      */
/* ------------------------------------------------------------------ */

export type CertificationCategory = 'rpa' | 'software' | 'ai' | 'project-management';

export interface Certification {
  /** Matches src/assets/images/certificates/<id>.* and public/certificates/<id>.pdf. */
  id: string;
  title: Text;
  issuer: Text;
  /** Matches src/assets/images/logos/<issuerLogoId>.* (optional, monogram fallback). */
  issuerLogoId?: string;
  date: Text;
  category: CertificationCategory;
  type: 'certification' | 'training';
  credentialUrl?: string;
  featured?: boolean;
  /** Short qualifier shown under the title, e.g. "Preparation course, not the PMP exam". */
  note?: Text;
}

/* ------------------------------------------------------------------ */
/* Volunteering                                                        */
/* ------------------------------------------------------------------ */

export interface VolunteeringItem {
  id: string;
  text: Text;
  icon: IconName;
}
