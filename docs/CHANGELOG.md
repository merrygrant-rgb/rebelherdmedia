# Change log

## 2026-10-24 — Project Open Water (identity implementation)

**Identity**
- Palette replaced with Open Water tokens in `css/site.css`: charcoal `#1B2227`, ivory `#F6F1E7`, ocean `#0E5F6B`, lagoon `#4CC3BC` (dark grounds only), copper `#B5673C`, deep water `#14262B` for dark bands. Slate text darkened to `#56626B` to clear WCAG AA on the ivory band.
- Header mark is now the `rebel herd.` wordmark (Fraunces, ocean on light, copper period) with the small MEDIA descriptor. The five-bar spectrum icon is retired.
- Dark band (founder section) uses deep water; lagoon reserved for the wordmark and links on dark.
- Hero spectrum graphic recolored ocean/copper.
- Favicon is the `rh.` short mark on ocean. OG image (`img/og-default.png`) added, 1200×630, deep-water ground.
- `brand/` folder added: outlined SVG wordmarks (light, dark, no-descriptor, mono), avatars (teal, deep, ivory), favicon, PNG exports at platform sizes, the exact static instance of Fraunces used (`Fraunces-RebelHerd-static.ttf`, OFL), and a README.

**Homepage**
- Hero is the defining promise. The former headline moves to open the practices section.
- New "How we work" section: Listen, Clarify, Design, Collaborate, Deliver (numbered; this is the one true sequence on the site).
- "Why Rebel Herd" row: Expertise without gatekeeping, What you will not get, Accountability. Replaces the earlier "How engagements start" column.
- Closing section headline is "Tell us what you're trying to accomplish."

**Service pages**
- Acoustic: scope language now states we design and advise, do not sell or install equipment, and are not a licensed engineering firm; stamped drawings/formal acoustical reports are outside scope. Certification statement limited to Biamp Cambridge sound masking; no other manufacturer authorizations claimed.
- AI: added the line that tools draft/sort/summarize and judgment stays with people.
- Digital media: names ourfurlife.com and corporatewitch.media as owned properties, explicitly not client work.

**About**
- "built on the way out" → "founded on that experience" (removes the grievance note).

**Contact**
- H1 is "Tell us what you're trying to accomplish." Lede states no budget, spec, or plan needed and sets the expectation at "a person, usually within two business days" (was "within one business day").
- Topic list keeps "I'm not sure — I'll describe it" first.

**New page**
- `/privacy/` — plain-language privacy statement covering the form, Netlify processing, no cookies, no analytics. Linked in footer. Added to sitemap.

**QA performed**
- Contrast computed for every token pair in use; all body text AA or better, large accents AA-large or better.
- HTML tag balance valid on all 9 pages; one `<h1>` per page; no broken internal links.
- No horizontal overflow at 1280px or 390px on any page. Mobile menu opens; keyboard focus lands on the brand link first and is visible.
- Netlify form attributes present (`data-netlify`, hidden `form-name`, honeypot). Live submission can only be tested after first deploy (MIGRATION.md step 3).

**Rollback**
- The old GoDaddy site is untouched and stays live until the DNS step in MIGRATION.md. Its full content is recorded in AUDIT.md (there was one page). The previous version of this build (pre-Open Water) is in `rebelherdmedia-site.zip` delivered the morning of 2026-10-24; keep that zip as the rollback copy, or rely on git history once the repo exists.
