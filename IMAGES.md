# Images & files checklist

Drop a file with the **exact name** into the right folder and it appears on the site at the next
`npm run dev` reload or `npm run build`. **Nothing here is required for the build**: every missing
slot shows a designed fallback (initials, gradient/code placeholder, monogram, or no button).

- **Formats:** `.webp`, `.jpg`, `.jpeg`, `.png` (any letter case). If two exist for the same name: webp > png > jpg > jpeg.
- **Optimisation:** images in `src/assets/images/` are resized and converted automatically by Astro (responsive `srcset`), so upload the best quality you have.
- **Privacy:** Aura Neurology is a real client. Only add screenshots that contain **no patient data**.
- Every folder also contains a `README.txt` with the same names.

## Checklist

| ✓ | Item | Exact path & filename | Recommended size | Required / Optional |
| --- | --- | --- | --- | --- |
| ☐ | **CV (PDF)** | `public/cv/Abed_Al_Rahman_Radwan_CV.pdf` | PDF | **Required** (Download CV buttons) |
| ☐ | Profile photo | `src/assets/images/profile/me.webp` | Square, ≥ 800×800 | Recommended (fallback: "AR" avatar) |
| ☐ | Link-preview image | `src/assets/images/og/og-image.png` | Exactly 1200×630 | Optional (a default is generated) |
| ☐ | Logo: Cyborg Automation Hub | `src/assets/images/logos/cyborg-automation-hub.png` | Square, ≥ 128×128, transparent | Optional (fallback: monogram) |
| ☐ | Logo: Luminus | `src/assets/images/logos/luminus.png` | Square, ≥ 128×128, transparent | Optional |
| ☐ | Logo: Blue Prism | `src/assets/images/logos/blue-prism.png` | Square, ≥ 128×128, transparent | Optional |
| ☐ | Logo: Karabük University | `src/assets/images/logos/karabuk-university.png` | Square, ≥ 128×128, transparent | Optional |
| ☐ | Logo: Cyborg Academy | `src/assets/images/logos/cyborg-academy.png` | Square, ≥ 128×128, transparent | Optional |
| ☐ | Logo: Pearson BTEC | `src/assets/images/logos/pearson-btec.png` | Square, ≥ 128×128, transparent | Optional |
| ☐ | Cover: Aura Neurology | `src/assets/images/projects/aura-neurology/cover.webp` | 1600×900 (16:9) | Recommended (featured card) |
| ☐ | Screenshots: Aura Neurology | `src/assets/images/projects/aura-neurology/1.webp`, `2.webp`, `3.webp` … | 1600×900 | Optional (modal gallery) |
| ☐ | Cover: Smart Home System | `src/assets/images/projects/smart-home-system/cover.webp` | 1600×900 | Optional (fallback: gradient) |
| ☐ | Screenshots: Smart Home System | `src/assets/images/projects/smart-home-system/1.webp`, `2.webp` … | 1600×900 | Optional |
| ☐ | Cover: Red-Triangle Property Marketplace | `src/assets/images/projects/red-triangle-property-marketplace/cover.webp` | 1600×900 | Optional (fallback: gradient) |
| ☐ | Screenshots: Red-Triangle | `src/assets/images/projects/red-triangle-property-marketplace/1.webp`, `2.webp` … | 1600×900 | Optional |
| ☐ | Cover: EV Management System API | `src/assets/images/projects/ev-management-system-api/cover.webp` | 1600×900 | Optional (fallback: code-style) |
| ☐ | Screenshots: EV Management System API | `src/assets/images/projects/ev-management-system-api/1.webp`, `2.webp` … | 1600×900 (e.g. Swagger UI) | Optional |
| ☐ | Cover: Dern-Support System | `src/assets/images/projects/dern-support-system/cover.webp` | 1600×900 | Optional (fallback: gradient) |
| ☐ | Screenshots: Dern-Support System | `src/assets/images/projects/dern-support-system/1.webp`, `2.webp` … | 1600×900 | Optional |
| ☐ | Cover: Movie Library | `src/assets/images/projects/movie-library/cover.webp` | 1600×900 | Optional (fallback: gradient) |
| ☐ | Screenshots: Movie Library | `src/assets/images/projects/movie-library/1.webp`, `2.webp` … | 1600×900 | Optional |
| ☐ | Cover: AdventureQuestRPG | `src/assets/images/projects/adventure-quest-rpg/cover.webp` | 1600×900 | Optional (fallback: code-style) |
| ☐ | Screenshots: AdventureQuestRPG | `src/assets/images/projects/adventure-quest-rpg/1.webp`, `2.webp` … | 1600×900 (console output) | Optional |
| ☐ | Certificate: Blue Prism PDEV01 | `src/assets/images/certificates/blue-prism-pdev01.webp` | ~1600 px wide | Recommended ("View Certificate") |
| ☐ | Certificate: Blue Prism AD01 | `src/assets/images/certificates/blue-prism-ad01.webp` | ~1600 px wide | Recommended |
| ☐ | Certificate: Blue Prism Foundation | `src/assets/images/certificates/blue-prism-foundation.webp` | ~1600 px wide | Optional |
| ☐ | Certificate: .NET Full-Stack | `src/assets/images/certificates/dotnet-full-stack.webp` | ~1600 px wide | Optional |
| ☐ | Certificate: BTEC | `src/assets/images/certificates/btec.webp` | ~1600 px wide | Optional |
| ☐ | Certificate: Applied AI (Executive) | `src/assets/images/certificates/applied-ai-executive.webp` | ~1600 px wide | Optional |
| ☐ | Certificate: Appian Application Development | `src/assets/images/certificates/appian-app-development.webp` | ~1600 px wide | Optional |
| ☐ | Certificate: PMP® Preparation Course | `src/assets/images/certificates/pmp-prep-35-pdus.webp` | ~1600 px wide | Optional |
| ☐ | Certificate: Scrum, Agile & Kanban | `src/assets/images/certificates/scrum-agile-kanban.webp` | ~1600 px wide | Optional |
| ☐ | Certificate: GenAI in Project Management | `src/assets/images/certificates/genai-project-management.webp` | ~1600 px wide | Optional |
| ☐ | Certificate PDFs (any of the 10 ids above) | `public/certificates/<certificate-id>.pdf` (e.g. `public/certificates/blue-prism-pdev01.pdf`) | PDF | Optional ("Open PDF") |

`.webp` is shown for brevity; `.jpg`, `.jpeg` or `.png` with the same name work the same.

## What each file does

- **Project `cover.*`**: the card image (16:9). Projects without a cover keep their placeholder. Aura Neurology's cover fills the large featured card.
- **Project `1.*`, `2.*`, `3.*`…**: screenshots in the detail modal (swipeable gallery with ‹ › buttons). Any number, sorted by number. Without screenshots the modal shows the cover, or text only.
- **Certificate image**: adds a **View Certificate** button that opens an accessible lightbox (Esc / click outside to close).
- **Certificate PDF**: adds an **Open PDF** button. A **Verify** button appears when you fill `credentialUrl` in `src/data/certifications.ts`.
- **Logos**: replace the monogram badges in Experience, Education and Certifications. Transparent PNG/WebP looks best (shown on a white tile).
- **`og-image.*`**: the preview image shown when your link is shared (LinkedIn, WhatsApp, Slack…). Without it, `src/assets/og-default.png` is used. Regenerate that default after changing your name or title with `npm run brand`.

## Tips

- Convert screenshots to WebP for smaller files, e.g. with <https://squoosh.app>.
- Use lower-case, hyphenated file names exactly as above. `Cover.PNG` also works, but `cover-image.png` does not.
- After adding images, run `npm run build` once to confirm everything is picked up.
