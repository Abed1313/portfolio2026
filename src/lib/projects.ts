import type { Locale, Project, ProjectBadge } from '../data/types';
import { isSet } from './links';
import { useUi } from './i18n';

export interface ProjectLinks {
  github?: string;
  live?: { href: string; label: string };
}

/**
 * Button rules:
 *  - GitHub: only if githubUrl is a real URL.
 *  - Live:   only if liveUrl is a real URL AND (no status set OR status === "live").
 *            Featured client projects say "Visit Website", others "Live Demo".
 */
export function projectLinks(p: Project, locale: Locale): ProjectLinks {
  const ui = useUi(locale);
  const links: ProjectLinks = {};
  if (isSet(p.githubUrl)) links.github = p.githubUrl;
  const liveAllowed = p.status === undefined || p.status === 'live';
  if (isSet(p.liveUrl) && liveAllowed) {
    links.live = { href: p.liveUrl, label: p.featured ? ui.actions.visitWebsite : ui.actions.liveDemo };
  }
  return links;
}

/** Status badge ("In Testing" → "Live") derived from `status`. */
export function statusBadge(p: Project, locale: Locale): (ProjectBadge & { pulse?: boolean }) | undefined {
  if (!p.status) return undefined;
  const ui = useUi(locale);
  const tone = p.status === 'live' ? 'success' : p.status === 'in-progress' ? 'warning' : 'neutral';
  return { label: ui.projects.status[p.status], tone, pulse: p.status === 'in-progress' };
}

export const badgeTone: Record<NonNullable<ProjectBadge['tone']>, string> = {
  accent: 'border-accent/35 bg-accent/10 text-accent',
  violet: 'border-violet/35 bg-violet/10 text-violet',
  neutral: 'border-line bg-surface-2 text-muted',
  success: 'border-success/35 bg-success/10 text-success',
  warning: 'border-warning/35 bg-warning/10 text-warning',
};
