# Deploying and editing — rebelherdmedia

Same setup as ourfurlife: plain HTML and one CSS file, no build step, GitHub → Netlify auto-deploys on every push. Use **Git Bash**, not PowerShell.

## First time

```bash
# 1. Put this folder at Documents/rebelherdmedia, then:
cd ~/Documents/rebelherdmedia
git init
git add .
git commit -m "Rebel Herd Media site — initial build"
git branch -M main
# 2. Create an empty repo named rebelherdmedia on GitHub (merrygrant-rgb), then:
git remote add origin https://github.com/merrygrant-rgb/rebelherdmedia.git
git push -u origin main
```

Then in Netlify: Add new site → Import an existing project → GitHub → `rebelherdmedia`. Leave build command blank, publish directory `.`, deploy. Netlify gives you a preview URL immediately.

## Every edit after that

```bash
git add .
git commit -m "what you changed"
git push
```
Netlify redeploys in about 30 seconds.

## Where things live

```
index.html                         homepage
about/index.html                   About the founder + credentials
services/acoustic-design/index.html
services/ai-strategy/index.html
services/digital-media/index.html
contact/index.html                 inquiry form (Netlify Forms)
intake/audio|ai|brand/index.html   client intake questionnaires (unlisted, noindex; Netlify Forms)
thanks/index.html                  form success page (noindex)
404.html                           not-found page
css/site.css                       all styles; colors/fonts are the tokens at the top
img/favicon.svg                    tab icon (rh. short mark)
brand/                             logo files, PNG exports, font, brand README
netlify.toml                       publish dir, www→apex redirect, security headers
robots.txt, sitemap.xml            search engine files — add new pages to sitemap.xml
docs/                              these notes (not linked from the site)
```

Clean URLs come from the folder structure: `/about/` serves `about/index.html`. New page = new folder with an `index.html`.

## Editing conventions

- Header and footer are copied into every page (no templating). When you change the nav or footer, change it in all 9 HTML files — a find-and-replace across the folder in VS Code does it in one pass.
- Page titles are `Page name — Rebel Herd Media`. Keep descriptions under ~160 characters.
- Colors: the Open Water tokens are at the top of `css/site.css`; see `brand/README.md` for what each is for.
- Fonts load from Google Fonts: Fraunces (wordmark only), Bricolage Grotesque (headings) and IBM Plex Sans (body). Swap the `<link>` in each page head and the `font-family` lines in the CSS to change them.

## Contact form

The form posts to Netlify Forms (`data-netlify="true"`, form name `inquiry`). Netlify must have **form detection enabled** (Site configuration → Forms → Enable form detection) followed by a redeploy; it is off by default on new sites and the form 404s until it's on. Spam protection is a hidden honeypot field; no reCAPTCHA needed. Submissions appear in Netlify → Forms, and you set the email notification there (see MIGRATION.md step 3). If you ever rename the form, change both the `name` attribute and the hidden `form-name` input.

The three intake forms (`intake-audio`, `intake-ai`, `intake-brand`) work the same way. Netlify only detects a new form on a deploy, so after they first go live, check Netlify → Forms lists all four, then add an email notification for each new one — notifications are per form.

## Things to add before or shortly after launch

- (done) `img/og-default.png` social-share image is in place.
- A headshot on the About page if you want one (it works without).
- Google Search Console verification and sitemap submission (MIGRATION.md step 8).
