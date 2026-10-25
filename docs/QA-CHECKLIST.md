# QA checklist — 2026-10-24 late build (11 pages)

| Check | Result |
|---|---|
| Production build (static generation) completes without errors | PASS |
| All 11 pages valid HTML, one H1 each, ordered headings | PASS |
| Internal links resolve, including new footer policy links | PASS |
| Portfolio links return 200 (ourfurlife.com, corporatewitch.media) | PASS |
| No stale preview/localhost URLs; no mgrant@; no former-employer references | PASS |
| Flagged phrases from the corrections brief absent | PASS |
| WCAG contrast: body AAA; links/buttons/promise panels/feature section AA; large copper accents AA-large | PASS |
| No horizontal overflow at 1280 or 390 px, all pages | PASS |
| Keyboard: skip link, visible focus, logical order | PASS |
| Form: Netlify attributes, hidden form-name, honeypot, required-field validation blocks empty submit (5 invalid fields reported), labels tied to inputs | PASS (markup + browser validation) |
| Form: Netlify detection, live submission, success redirect, notification to info@ | NOT YET TESTABLE — requires first deploy (see below) |
| Titles, descriptions, canonicals, OG, JSON-LD on every page | PASS |
| Sitemap (9 URLs) / robots (disallow /thanks/) / 404 / thanks noindex | PASS |
| Cookies, storage, analytics, pixels, embeds, third-party scripts | NONE PRESENT — no consent mechanism needed |
| Policy pages describe actual site behavior | PASS (reviewed against build) |
| Unverified legal-compliance claims | NONE — terms marked draft/not attorney-reviewed; accessibility page claims no conformance |

## Deployment status
- **Not deployed.** I have no access to a Netlify or GitHub account for Rebel Herd Media and cannot create the repo, run the preview deploy, or test the live form from here. DEPLOY.md has the exact commands; the first deploy is about ten minutes of Merry's time, after which steps 5–9 of the brief's QA list can be completed on the preview URL.
- DNS, MX, SPF, DKIM, DMARC: untouched. No production change made.

## Open items needing Merry
1. **info@rebelherdmedia.com** must exist in Google Workspace and receive mail before launch.
2. **Credential wording** — confirm: (a) the Biamp Cambridge certification's exact name and whether it covers design only or design and commissioning; (b) whether the 70V training was manufacturer-delivered (the site now says only "Training"); (c) whether "Google AI Professional coursework" is the correct course title.
3. **Terms of Use** governing-law clause and the professional services disclaimer should get a legal read before the first client agreement is signed.
4. **Google Fonts** makes a request to Google when a page loads; this is disclosed in the privacy policy. If EU visitors become a concern, self-hosting the fonts is a small change.
5. (resolved) Reviews are paid; the page now explains the value logic without a price.
