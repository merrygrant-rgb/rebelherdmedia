# Migration plan — GoDaddy Website Builder → Netlify

Nothing in this plan changes DNS, cancels anything, or takes the old site down until the marked approval step. Steps 1–4 are safe to do any time.

## What stays at GoDaddy (do not cancel)

| GoDaddy product | Keep? | Why |
|---|---|---|
| **Domain registration** (rebelherdmedia.com) | **Yes — keep** | Netlify will host the site, not the domain. Renewals continue at GoDaddy. |
| **Email** — Google Workspace (info@ and mgrant@rebelherdmedia.com) | **Keep — not a GoDaddy product, but its DNS records live at GoDaddy** | Google Workspace MX, SPF (TXT), DKIM (TXT/CNAME), DMARC (TXT), and any Google site-verification TXT record must survive the move untouched. |
| **DNS hosting** at GoDaddy | Keep (recommended) | Simplest path: leave DNS at GoDaddy and only change the two web records. Do *not* switch nameservers to Netlify — that would require recreating every email record by hand and is the easiest way to break mail. |
| **Website Builder** subscription | Cancel **after** cutover is verified | Keep it until the new site has been live for a few days. Export nothing — there's nothing to export. |

## Before touching anything: capture the current DNS

In GoDaddy → Domain → DNS, screenshot or copy every record. Expected:
- `A @` → a GoDaddy builder IP (web — this one will change)
- `CNAME www` → the builder hostname (web — this one will change)
- `MX @` records (mail — **do not change**)
- `MX @` → the five Google Workspace MX hosts (mail — **do not change**)
- `TXT @` SPF (`v=spf1 include:_spf.google.com ~all` or similar), `google._domainkey` DKIM TXT, `_dmarc` TXT, any `google-site-verification` TXT (mail/verification — **do not change**)

Save this as `docs/dns-before.txt` in the repo.

## Step-by-step

### 1. Repo (safe)
Create a new GitHub repo `merrygrant-rgb/rebelherdmedia`, push this folder to it. Same workflow as ourfurlife. See DEPLOY.md.

### 2. Netlify site on a preview URL (safe)
Netlify → Add new site → Import from GitHub → pick the repo. Build command: none. Publish directory: `.` (netlify.toml already says so). Netlify assigns a `something-random.netlify.app` URL. **This is the preview.** Review every page on phone and desktop there.

### 3. Verify the contact form on the preview (safe)
**First enable form detection** — it is off by default on new Netlify sites: Site configuration → Forms → Enable form detection, then Deploys → Trigger deploy so Netlify re-scans the HTML. Until this is done, submitting the form returns a 404. Then Netlify detects the form from the HTML. Submit a test from the preview URL, confirm it appears under Netlify → Forms → `inquiry`. Then set the notification: Forms → Form notifications → Add → Email → `info@rebelherdmedia.com`. (Free tier: 100 submissions/month, plenty.)

### 4. Add the custom domain in Netlify, but don't point DNS yet (safe)
Netlify → Domain management → Add domain → `rebelherdmedia.com`. Netlify will show it as "awaiting external DNS" and tell you the records it wants. Also add `www.rebelherdmedia.com` as an alias and set the apex as primary. Nothing is live yet.

### 5. ⚠️ APPROVAL GATE — change the two web records at GoDaddy
Only after the preview is approved. In GoDaddy DNS, change **only**:
- `A @` → `75.2.60.5` (Netlify's load balancer — confirm the exact IP from Netlify's domain panel at the time; use what Netlify shows)
- `CNAME www` → `<your-site>.netlify.app`

Leave every MX / TXT / DKIM / autodiscover record exactly as it is. Set TTL low (600s) if GoDaddy lets you, so a rollback is fast.

Rollback: put the old A and CNAME values back from `dns-before.txt`. The old builder site is still there until you cancel it.

### 6. SSL
Once DNS propagates (minutes to a few hours), Netlify → Domain management → HTTPS → Verify DNS → Provision certificate (Let's Encrypt, free, auto-renewing). Then turn on "Force HTTPS". Until the cert provisions, visitors may see a warning for a short window — do the cutover at a quiet hour.

### 7. Redirects
- `www` → apex is already in `netlify.toml`.
- The old site had only `/`, so there are no legacy paths to redirect. The custom `404.html` catches anything else.

### 8. Verify after cutover
- `https://rebelherdmedia.com` and `https://www.rebelherdmedia.com` both load the new site over HTTPS.
- Send yourself an email at info@rebelherdmedia.com and reply from it — confirms Google Workspace MX survived.
- Submit the live contact form; confirm the notification email arrives.
- Google Search Console: add the property (DNS TXT verification — one more record at GoDaddy, harmless) and submit `https://rebelherdmedia.com/sitemap.xml`.

### 9. Clean up (after a few days)
Cancel the GoDaddy Website Builder subscription. Keep domain and email.
