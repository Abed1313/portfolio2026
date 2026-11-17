/**
 * Global site settings. Edit this file to change site-wide behaviour.
 *
 * Any URL that is empty ("") or still a placeholder like "[GITHUB_URL]"
 * is treated as missing: its button/link is hidden automatically.
 */

export type ContactProvider = 'web3forms' | 'resend';

export const siteConfig = {
  /** TODO: replace with your real domain (used for canonical URLs, sitemap, Open Graph). */
  url: 'https://example.pages.dev',

  /** Shows the "Open to opportunities" badge in the hero + footer status bar. */
  availableForWork: true,

  /** CV file in /public. The Download CV buttons use the `download` attribute. */
  cv: {
    path: '/cv/Abed_Al_Rahman_Radwan_CV.pdf',
    fileName: 'Abed_Al_Rahman_Radwan_CV.pdf',
  },

  social: {
    /** TODO: your LinkedIn profile URL */
    linkedin: '[LINKEDIN_URL]',
    /** TODO: your GitHub profile URL */
    github: '[GITHUB_URL]',
  },

  analytics: {
    /**
     * TODO: Cloudflare Web Analytics token
     * (Cloudflare dashboard → Analytics & Logs → Web Analytics → Add a site).
     * Leave empty to disable the analytics snippet.
     */
    cloudflareToken: '',
  },

  contact: {
    /**
     * "web3forms" → the form posts straight from the browser to Web3Forms
     *               (simplest; the access key is public by design).
     * "resend"    → the form posts to the Cloudflare Pages Function
     *               functions/api/contact.ts, which sends the email via Resend
     *               using the RESEND_API_KEY environment variable (kept secret).
     * See README.md → "Contact form".
     */
    provider: 'web3forms' as ContactProvider,
    /** TODO: Web3Forms access key (https://web3forms.com). Only used when provider = "web3forms". */
    web3formsAccessKey: '',
    /** Endpoint of the Pages Function. Only used when provider = "resend". */
    functionEndpoint: '/api/contact',
  },

  /** Year shown in the footer. */
  copyrightYear: 2026,
} as const;

export type SiteConfig = typeof siteConfig;
