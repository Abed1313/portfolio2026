# Abed Al-Rahman Radwan: Portfolio

Personal portfolio for an **RPA Support Engineer (Blue Prism) with a .NET full-stack background**.
Single page, English + Arabic (full RTL), dark/light themes, built to deploy on **Cloudflare Pages**.

- **Stack:** Astro 7 (static output) · TypeScript (strict) · Tailwind CSS v4 · a few small vanilla-TS scripts (no UI framework)
- **Pages:** `/` (English), `/ar/` (Arabic), custom `404`
- **Content:** all personal content lives in typed files in [`src/data/`](src/data/). Components contain no personal text.

---

## 1. Run it locally

Requirements: **Node.js 22.12+** (24 LTS recommended) and npm.

```powershell
npm install
npm run dev        # http://localhost:4321  (Arabic: http://localhost:4321/ar/)
```

> **Windows note: use PowerShell, CMD or the VS Code terminal, not Git Bash.**
> Building from Git Bash (`/c/Users/...`) makes Vite drop the stylesheet, so the site renders unstyled.
> A post-build check (`tools/verify-build.mjs`) fails the build loudly if that happens.
> Cloudflare builds on Linux and is not affected.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check (`astro check`), build to `dist/`, then verify the output |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run brand` | Regenerate favicons + the default link-preview image from your data |
| `npm run serve:dist` | Serve `dist/` like Cloudflare (compression, 404) on port 4322 |
| `npm run check:layout` | Playwright: no horizontal scroll at 360–1920 px, both themes, tap targets ≥ 44 px |
| `npm run check:ui` | Playwright: 61 interaction tests (menu, theme, tabs, modals, palette, terminal, form, RTL, SEO, 404) |
| `npm run check:a11y` | axe-core WCAG 2.2 AA audit (pages + open dialogs, both themes, both languages) |
| `npm run check:lighthouse` | Lighthouse, mobile + desktop, median of 3 runs, HTML reports in `.lighthouse/` |

The `check:*` scripts use your installed **Google Chrome** and need a running server first:
`npm run build`, then `npm run preview` (port 4321) or `npm run serve:dist` with `BASE_URL=http://localhost:4322`.

---

## 2. Edit your content

Everything you would want to change is in **`src/data/`**:

| File | Contents |
| --- | --- |
| [`site.config.ts`](src/data/site.config.ts) | Site URL, LinkedIn/GitHub, **availableForWork** badge, CV path, analytics token, contact-form provider |
| [`profile.ts`](src/data/profile.ts) | Name, headline, summary, location, email, **phone**, languages, "currently working on" |
| [`skills.ts`](src/data/skills.ts) | Skill groups + icons |
| [`experience.ts`](src/data/experience.ts) | Jobs (git-log timeline). `current: true` marks the active role |
| [`projects.ts`](src/data/projects.ts) | Full-stack projects + confidential RPA projects (with their flow diagrams) |
| [`certifications.ts`](src/data/certifications.ts) | Official certifications + training (filter categories) |
| [`education.ts`](src/data/education.ts), [`volunteering.ts`](src/data/volunteering.ts) | Education, volunteering |
| [`i18n/en.ts`](src/data/i18n/en.ts), [`i18n/ar.ts`](src/data/i18n/ar.ts) | Interface text. TypeScript makes sure Arabic has every key |
| [`sections.ts`](src/data/sections.ts) | Section order + the code-style labels (`01. // about`) |

**Translations.** Text fields accept either a plain string (same in both languages) or `{ en: '…', ar: '…' }`.
If `ar` is missing, English is shown.

**Placeholders are safe.** Any value that is empty or still looks like `[SOMETHING]` is treated as missing:
its button or line is hidden, so the site never shows `#` links or "[ISSUER]".

### Common edits

- **Turn off the "Open to opportunities" badge:** `availableForWork: false` in `site.config.ts`.
- **Aura Neurology goes live:** in `projects.ts` set `status: 'live'` and `liveUrl: 'https://…'`.
  The badge changes from **In Testing** to **Live** and a **Visit Website** button appears.
- **Add a GitHub repo link:** replace `[GITHUB_URL_…]` with the URL. The **View on GitHub** button appears.
- **Add a "Live Demo":** fill `liveUrl` on any project.
- **Certificate verification link:** fill `credentialUrl`. A **Verify** button appears.
- **Hide the phone number:** set `phone: ''` in `profile.ts`. It is only ever shown in the Contact section.
- **After changing your name or title:** run `npm run brand` to refresh the favicon and preview image.

### Still to fill in (TODO)

- [ ] `site.config.ts` → `url` (your real domain, used for canonical links, sitemap, Open Graph)
- [ ] `site.config.ts` → `social.linkedin`, `social.github`
- [ ] `projects.ts` → 6 GitHub URLs (`[GITHUB_URL_SMART_HOME]`, `[GITHUB_URL_RED_TRIANGLE]`, `[GITHUB_URL_EV_API]`, `[GITHUB_URL_DERN]`, `[GITHUB_URL_MOVIE_LIBRARY]`, `[GITHUB_URL_ADVENTURE_QUEST]`)
- [ ] `education.ts` → TÖMER diploma `year`
- [ ] `certifications.ts` → `issuer` for .NET Full-Stack, PMP® Preparation, Scrum/Agile/Kanban, GenAI in PM
- [ ] `site.config.ts` → contact form key (see section 4) and `analytics.cloudflareToken`
- [ ] Images: see [IMAGES.md](IMAGES.md)
- [ ] Have the Arabic text reviewed by a native speaker

---

## 3. Add images

See **[IMAGES.md](IMAGES.md)** for the full checklist with exact file names. In short:
drop `me.webp`, project `cover.webp` / `1.webp`…, certificate images and logos into `src/assets/images/…`,
and the CV + certificate PDFs into `public/`. Missing images never break the build.

---

## 4. Contact form

The form validates input in the browser and on the server (same rules, `src/lib/contact-validation.ts`)
and includes a hidden **honeypot** field against bots. Choose a provider in `site.config.ts → contact.provider`.
Until a provider is configured, visitors see a friendly "please email me directly" message.

### Option A: Web3Forms (simplest, the default)

The form posts **directly from the browser** to Web3Forms. Nothing runs on your server.

1. Go to <https://web3forms.com>, enter the inbox that should receive messages, and copy the **Access Key**.
2. In `site.config.ts` set:

   ```ts
   provider: 'web3forms',
   web3formsAccessKey: 'your-access-key',
   ```

3. Rebuild and deploy. The access key is designed to be public, so it is fine in the code.

### Option B: Resend via a Cloudflare Pages Function

The form posts to **`/api/contact`** ([`functions/api/contact.ts`](functions/api/contact.ts)), which validates
the message again, checks the honeypot, and sends the email with Resend. Your API key stays secret on Cloudflare.

1. Create an account at <https://resend.com> and an **API key**. To send from your own address, verify your domain in Resend.
   For a quick test, the default sender `onboarding@resend.dev` only delivers to your own Resend account email.
2. In `site.config.ts` set `provider: 'resend'`.
3. In Cloudflare → your Pages project → **Settings → Variables and Secrets**, add:

   | Name | Value | Type |
   | --- | --- | --- |
   | `RESEND_API_KEY` | `re_…` | **Secret** |
   | `CONTACT_TO_EMAIL` | inbox that receives the messages | Text |
   | `CONTACT_FROM_EMAIL` | e.g. `Portfolio <hello@yourdomain.com>` (optional) | Text |

4. Redeploy. To test the Function locally: put the same variables in a `.dev.vars` file (git-ignored), then run
   `npm run build` and `npx wrangler pages dev dist`.

---

## 5. Deploy to Cloudflare Pages

1. **Push to GitHub.** Create an empty repository, then:

   ```powershell
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```

2. **Create the project.** Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. **Build settings:**

   | Setting | Value |
   | --- | --- |
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Environment variable | `NODE_VERSION` = `24` (also pinned in `.nvmrc`) |

4. **Deploy.** The `functions/` folder is detected automatically, so `/api/contact` works with no extra setup.
5. **Set your real URL.** Put the final domain (e.g. `https://abed.pages.dev` or a custom domain) in
   `site.config.ts → url`, commit and push. Canonical links, sitemap, hreflang and preview images use it.
6. **Optional, Web Analytics:** Cloudflare → **Analytics & Logs → Web Analytics → Add a site**.
   Copy the token into `site.config.ts → analytics.cloudflareToken`. The privacy-friendly beacon is only added when a token is set.
7. **Optional, custom domain:** Pages project → **Custom domains**.

Every push to `main` redeploys automatically. Pull requests get preview URLs.

---

## 6. Project structure

```text
functions/api/contact.ts      Cloudflare Pages Function (Resend)
public/                       CV, certificate PDFs, favicons (served as-is)
src/
  assets/images/              Your images (auto-discovered, see IMAGES.md)
  components/
    layout/                   Navbar, footer status bar, theme/language switch, scroll chrome
    sections/                 Hero, About, Skills, Experience, Projects, Certifications, Education, Volunteering, Contact
    projects/ certs/ hero/    Cards, modals, lightbox, IDE window
    overlays/                 Command palette, terminal
    ui/                       Shared bits (section header, flow diagram, logos, buttons)
  data/                       ← all content + settings
  layouts/BaseLayout.astro    <head>, SEO, JSON-LD, theme bootstrap
  lib/                        i18n, image resolver, link helpers, validation
  pages/                      index (en), ar/index, 404, robots.txt
  scripts/                    Small client scripts (theme, nav, palette, terminal, form, dialogs…)
  styles/global.css           Design tokens (both themes), components, motion
tools/                        Build check, brand generator, Playwright/axe/Lighthouse checks, local server
```

### Built-in features

- **Command palette:** `Ctrl`/`⌘` + `K`, or the search button / mobile menu.
- **Terminal easter egg:** the `>_ terminal` button in the footer, or from the palette.
  Commands: `help about skills experience projects certs cv contact theme clear exit`.
- **SEO:** titles/descriptions per language, canonical + hreflang, Open Graph/Twitter cards,
  JSON-LD `Person`, `sitemap-index.xml`, `robots.txt`.
- **Accessibility:** keyboard navigation everywhere, visible focus, native `<dialog>` focus trapping,
  `prefers-reduced-motion` respected, WCAG AA contrast in both themes.
- **Performance:** static HTML, inlined CSS, self-hosted fonts (Arabic subset only on `/ar/`),
  GPU-only animations paused when off-screen, `content-visibility` for below-the-fold sections.

---

## 7. Notes

- **`npm audit`** reports high-severity issues in `picomatch`, which comes in through Astro/Vite build tooling.
  It only runs at build time on this project's own fixed glob patterns, so the live site is not affected.
  npm's suggested "fix" is a downgrade to Astro 5, so it is not applied. Update Astro when a patched release is out.
- **Lighthouse locally vs. production:** desktop scores 100 in every category. Mobile Performance is
  ~89 (English) / ~84 (Arabic) on the development laptop, because Lighthouse multiplies local CPU time by 4.
  Accessibility, Best Practices and SEO are 100 everywhere. Re-check after deploying with
  <https://pagespeed.web.dev>, which runs on Google's hardware.
