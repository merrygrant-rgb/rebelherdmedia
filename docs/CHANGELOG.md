# Change log

## 2026-10-24 (late) — Final copy corrections, featured review service, policies

**Acoustic page**
- New featured section "Already have an audio system quote? Get an independent second opinion." placed after the capabilities list and before the educational content. Ocean-teal treatment matching the homepage promise panel; copy verbatim from the brief, plus one sentence stating reviews are a scoped, quoted service and the introductory conversation is where fit is decided. CTA links to Contact. The existing "Proposal & BOM reviews, purchasing advisory" listing is preserved.
- Sound masking explanation now says masking "can improve speech privacy and reduce distraction when appropriately designed and implemented" and explicitly does not isolate sound or make conversations confidential. Treatment-vs-masking distinction retained.

**Homepage** — acoustic teaser: "people can't be overheard where they shouldn't be" → "systems designed to improve speech privacy and reduce unwanted distractions." Nothing else on the homepage changed; the hero area is untouched.

**AI page** — "pilot that quietly dies" and "hours a tool can reliably give back" replaced with the approved wording; Scope & fees now "Fees, deliverables, and project scope are agreed in writing before work begins" with training, advisory, and project engagements all named.

**Digital media** — "What you receive" → "What a project may include … depending on the agreed scope"; fee language no longer locks to fixed-fee or retainer only. Both portfolio links retained.

**About** — "Listed in three groups on purpose" paragraph removed. Credential wording tightened to what is verifiable: Biamp Cambridge certification listed without an inferred scope description; "Manufacturer training" → "Training" for 70V systems. See open items.

**Contact** — hint now discourages confidential drawings, architectural plans, or restricted business information in the initial form. No phone number published.

**Policies (new)**
- `/privacy/` expanded: providers named (Netlify, Google Workspace, Google Fonts), retention described without inventing a period, request/deletion route via info@, children's note, explicit "no cookies / no consent banner needed and why."
- `/terms/` new: permitted use, content ownership, third-party links, informational nature, client agreements govern, limitations, Georgia governing law (subject to legal review), and a Professional Services Disclaimer section covering every point in the addendum. Marked as a working draft not reviewed by an attorney.
- `/accessibility/` new: what's been checked, what isn't claimed (no ADA/WCAG conformance claim), contact route.
- Footer gains a legal row: Privacy · Terms of use & professional services disclaimer · Accessibility. Sitemap updated (9 indexable pages).

**Cookie / tracking audit** — no cookies, no local/session storage, no analytics, no pixels, no embedded media, no third-party scripts anywhere in the build. Only external requests: Google Fonts (stylesheet + font files) and outbound links. No consent mechanism is required; none was added.

**Docs** — MIGRATION.md corrected: email is Google Workspace (records at GoDaddy DNS), not GoDaddy email. Notification target is info@.


## 2026-10-24 (evening) — Consolidated handoff implementation

**Sitewide**
- Public email changed to info@rebelherdmedia.com everywhere (footer, contact, thanks, privacy, JSON-LD, CTAs). mgrant@ no longer appears on any page.
- "Engineer/engineering" removed from public copy; founder described as independent commercial audio designer and consultant. Remaining uses are only in the explicit "no engineering licensure" disclaimers.
- Former employer not identified or described anywhere; employer timeline, internal systems, e-commerce history, and internal AI policy references removed. Houses of worship / sanctuaries removed from sectors and examples.
- Footer independence line: "Independent consulting. Equipment recommendations are based on project requirements, not product sales."
- No prices, guaranteed savings, hours-saved promises, compliance guarantees, or "scoping is free" language anywhere.

**Homepage**
- Spectrum graphic and caption removed from hero. Replaced with a restrained abstract Open Water gradient panel (deep water → ocean → lagoon, faint depth lines, one copper point). No waves, no photography.
- New promise panel immediately after the hero, ocean-teal ground, exact sentence: "Your knowledge decides how we talk; it never decides how much you matter." plus the approved supporting paragraph.
- "Three practices. One engineer at the table" → "One person at the table."
- Acoustic teaser now names 70V/distributed audio, schools/athletic venues, independent reviews, and sound masking. AI teaser leads with adoption, responsible use, training, outcomes. Digital teaser unchanged.
- "Customer service leads. Expertise follows." placed in the Expertise-without-gatekeeping column. Hero lede: "commercial audio design, technical sales, and customer service."

**Acoustic page — rewritten**
- Positioning line: "Independent expertise. Practical solutions. No equipment sales pitch."
- Practice promise panel (teal treatment) with the approved sentence.
- Six capabilities as the facts list: commercial audio & paging; education & athletics; sound masking & speech privacy; acoustic treatment; assistive listening (no compliance guarantee); proposal/BOM review & purchasing advisory. Plus "How we're independent" and "Deliverables & scope."
- Removed: 40-to-15-foot example, "insist on controlling commissioning," one-revision promise, included bid support, remote commissioning promise, flat-rate review, "hundreds of rooms." Masking/direct-field material condensed. "Loud is not the same as clear" and "Treatment is a different job" added.

**AI page — rewritten**
- Three pillars: adoption & education; responsible practices; workflow strategy & implementation. Practice promise panel with the approved paragraph.
- Multi-model corrected: evaluated/designed where appropriate; integrations, API, custom software, maintenance, security require separate feasibility review and explicit scope. No compliance certification or security audit claims.
- Removed: live employer sales-role references, "guardrails before policy required them," multiweek audit, hours-saved promise, subscription-billing claim.

**Digital media — light edits only**
- Practice promise panel added. Owned brands described as projects where the approach is developed, tested, refined; "shown as working examples, not proof of commercial results." Products described as concepts to scope and test. "Search usually produces first measurable results" removed. Structure and "Own the house, rent the billboard" preserved.

**About — biography replaced** with the approved text verbatim. H1 "Experience matters. How you treat people matters more." Credentials split into Certification / Completed training / Education; OpenAI Champions noted as a community membership, not a credential. Promise sentence closes the bio.

**Contact**
- Inquiry categories updated to the eleven in the brief; "I'm not sure" first.
- Confidential-drawings warning in the message hint; plan-sharing language keeps "we'll send a private way to share."
- Response expectation: "a person, usually within two business days."

**Privacy** — now states Netlify processes and stores submissions, honeypot only (no CAPTCHA/tracking), deletion covers Netlify form records, and the drawings/files guidance.

**Not changed** (per brief): navigation, five-step process, hero headline and CTA, accountability/gatekeeping content, typography, palette, static architecture, brand assets.


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

## 2026-10-25 — Client intake forms (unlisted)
- Added `/intake/audio/`, `/intake/ai/`, `/intake/brand/` — plain-language intake questionnaires, one per practice. Netlify Forms (`intake-audio`, `intake-ai`, `intake-brand`); same honeypot; post to `/thanks/`.
- Not in the nav, footer, or sitemap; `noindex, nofollow`. Send the link to a prospect after first contact.
- Each form opens with a "Where are you starting from?" self-rating (new / some / pro) so the first call uses the right vocabulary.
- CSS: `.intake`, `.intake-h`, `.levels`, `.lvl`.
- After pushing: Netlify needs a redeploy to detect the three new forms, then add email notifications for each (Forms → Form notifications → Email → info@) — the `inquiry` notification does not cover them.

## 2026-10-27 — Founder headshot
- About page: headshot beside the founder bio (two columns on desktop, stacked on phone). Responsive WebP + JPG at 600/900/1200 px in `img/`.
- Person JSON-LD now includes `image`.
- `brand/social/merry-grant-headshot-square-1000.jpg` for LinkedIn, Google Business Profile, etc.; full-size original alongside it.
- About: photo caption is Merry Grant / Founder & Principal / Acoustic design · AI workflow · Digital media. JSON-LD jobTitle "Founder & Principal, Rebel Herd Media LLC".
