# Audit — current rebelherdmedia.com (GoDaddy Website Builder)

Reviewed 2026-10-24.

## What is there now

- Platform: GoDaddy Website Builder 8 ("Starfield" generator tag in the page head).
- One page. Content in full: the name "Rebel Herd Media", the tagline **"Create. Engage. Inspire."**, a contact block ("Drop us a line!" — name, email, a newsletter opt-in checkbox, Send), a cookie banner, and a "Powered by GoDaddy" link in the footer.
- Hero/OG image: a Getty stock photo served from GoDaddy's CDN (`img1.wsimg.com/isteam/getty/1150347057`). Licensed through GoDaddy — it does not travel with the site.
- Page `<title>` is just "Rebel Herd Media". No meta description. Social-card description is the tagline.
- Theme color `#969696` (mid grey). No brand palette, no logo, no favicon.

## Findings

**Messaging**
- "Create. Engage. Inspire." says nothing about what the company does, who it is for, or why anyone should write in. It is interchangeable with any media-production template.
- No mention of the founder, the engineering background, or any of the three practice areas. A visitor from LinkedIn or a referral cannot confirm they are in the right place.
- No credibility signals at all: no bio, no credentials, no description of the work.

**Design**
- Stock-photo hero, grey theme, builder chrome ("Powered by GoDaddy") — reads as a placeholder site, which it is.
- Cookie banner on a site with no analytics is friction with no purpose.

**Conversion**
- The only form asks for name and email and pushes a newsletter signup. There is no way to describe a project, no indication of what happens after sending, and no direct email address shown.
- No navigation, so no path from "what do you do" to "how do I start."
- No service pages means no search landing pages; the site cannot rank for anything but the brand name.

**Technical / SEO**
- No meta description, no structured data, no sitemap, no canonical.
- Builder-generated markup duplicates the headline four times in the DOM (visible in the fetched text) — harmless but sloppy.

## Worth preserving

- The **domain** (rebelherdmedia.com) and its **email** (mgrant@rebelherdmedia.com, hosted via GoDaddy — see MIGRATION.md).
- Nothing else. No copy, image, or form logic carries forward. The contact form's intent (an easy way to write in) is replaced by the new inquiry form.

## What the rebuild changes

| Area | Old | New |
|---|---|---|
| Positioning | Tagline only | Named founder, three practice areas, who each is for, what you receive, what we don't do |
| Pages | 1 | Home, 3 service pages, About the founder (with credentials), Contact, Thanks, 404 |
| CTA | "Send" (newsletter) | "Start a conversation" → inquiry form with topic selector and a stated one-business-day reply |
| Credibility | None | Bio, certification vs. completed-training split, vendor-neutral disclaimer, hand-tuned masking spectrum as the hero graphic |
| SEO | Title only | Per-page titles/descriptions, canonical, OG tags, JSON-LD (ProfessionalService, Service ×3, Person), sitemap, robots |
| Hosting | GoDaddy builder | Static HTML on Netlify via GitHub, same as ourfurlife.com |
