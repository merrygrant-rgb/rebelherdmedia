// Rebel Herd Media — shared form plumbing: consent stamping, Netlify Forms forwarding,
// Brevo double opt-in and transactional email, retry de-duplication, and error pages.
// Runs only inside Netlify Functions on the Rebel Herd Media account. Secrets come from
// Netlify environment variables (BREVO_API_KEY, BREVO_LIST_ID, BREVO_DOI_TEMPLATE_ID,
// BREVO_SENDER_EMAIL, BREVO_SENDER_NAME). If they are absent, Brevo steps are skipped and
// reported as skipped — consent is always recorded with the submission in Netlify Forms.
// Marketing enrollment is double opt-in ONLY: nobody is added to a list without clicking a
// confirmation email. There is no direct-enrollment fallback.

export const CONSENT_VERSION = "2026-11-v1";
export const CONSENT_TEXT = "Yes, I'd like to receive occasional emails from Rebel Herd Media, including Knowledge Center articles, practical business tips, company news, educational resources, and special offers. I understand I can unsubscribe at any time.";
export const RECOGNITION_VERSION = "2026-11-v2"; // v2: "selected for the Rebel Herd Initiative" wording

/**
 * Operational log line for Netlify function logs. Never include names, email addresses or form answers:
 * the timestamp lets an administrator match the line to the stored submission in Netlify Forms.
 */
export function log(event, detail = {}) {
  try { console.error(JSON.stringify({ rhm: event, at: new Date().toISOString(), ...detail })); } catch (e) { /* logging must never break a submission */ }
}

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e ?? "").trim());

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Fields that record what the person agreed to, when, and under which wording. */
export async function consentStamp(get) {
  const yes = (get("marketing_consent") || "").toString().toLowerCase() === "yes";
  return {
    marketing_consent: yes ? "yes" : "no",
    consent_version: CONSENT_VERSION,
    consent_text_sha256: await sha256(CONSENT_TEXT),
    submitted_at: new Date().toISOString(),
  };
}

/** Forward a submission to Netlify Forms on the same deploy so storage + notifications stay as configured. Returns true on success; never throws. */
export async function forwardToNetlifyForms(req, formName, fields) {
  try {
    const body = new URLSearchParams();
    body.set("form-name", formName);
    for (const [k, v] of Object.entries(fields)) body.set(k, v ?? "");
    const res = await fetch(new URL("/", req.url), { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body });
    const ok = res.ok || res.status === 303 || res.status === 302;
    if (!ok) log("form-storage-failed", { form: formName, status: res.status });
    return ok;
  } catch (e) { log("form-storage-failed", { form: formName, status: "network" }); return false; }
}

/**
 * Best-effort duplicate guard — NOT persistent deduplication.
 * The map lives in the memory of one warm function instance and is lost on cold start or
 * when Netlify runs several instances; a second submission can therefore be stored.
 * Reviewers de-duplicate by email in Netlify Forms before selection. Do not rely on this
 * for eligibility ("one application per organization") — that is enforced at review.
 * (per warm function instance, short window)
 * seenRecently() only READS; call markSeen() after storage succeeds, so a submission that
 * failed to store can be retried immediately without being treated as a duplicate.
 */
const recent = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const key = (formName, email) => `${formName}:${String(email).trim().toLowerCase()}`;
export function seenRecently(formName, email) {
  const now = Date.now();
  for (const [k, t] of recent) if (now - t > WINDOW_MS) recent.delete(k);
  return recent.has(key(formName, email));
}
export function markSeen(formName, email) { recent.set(key(formName, email), Date.now()); }

const brevo = (path, payload) => fetch(`https://api.brevo.com/v3${path}`, {
  method: "POST",
  headers: { "api-key": process.env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
  body: JSON.stringify(payload),
});

/**
 * Start double opt-in for a person who ticked the marketing box. Returns:
 *   "doi-sent"                  confirmation email requested from Brevo
 *   "skipped:not-configured"    Brevo key/list/DOI template missing — nothing sent, nobody enrolled
 *   "error:<status>" / "error:network"
 * Never enrolls directly. Never throws.
 */
export async function brevoOptIn({ email, firstName = "", source = "", topics = [], req }) {
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_LIST_ID || !process.env.BREVO_DOI_TEMPLATE_ID) { log("doi-skipped-not-configured", { source }); return "skipped:not-configured"; }
  try {
    const r = await brevo("/contacts/doubleOptinConfirmation", {
      email,
      attributes: { FIRSTNAME: firstName, SOURCE: source, TOPICS: topics.join("|"), CONSENT_VERSION },
      includeListIds: [Number(process.env.BREVO_LIST_ID)],
      templateId: Number(process.env.BREVO_DOI_TEMPLATE_ID),
      redirectionUrl: new URL("/knowledge-center/subscribed/?confirmed=1", req.url).toString(),
    });
    if (r.ok || r.status === 204) return "doi-sent";
    log("doi-failed", { source, status: r.status });
    return `error:${r.status}`;
  } catch (e) { log("doi-failed", { source, status: "network" }); return "error:network"; }
}

/** Plain transactional email (confirmations). `html` is optional; omit it to send text/plain only. Callers must esc() any user-supplied text in `html`. Never throws. */
export async function sendTransactional({ to, toName = "", subject, text, html }) {
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) { log("confirmation-email-skipped-not-configured", {}); return "skipped:not-configured"; }
  try {
    const r = await brevo("/smtp/email", {
      sender: { email: process.env.BREVO_SENDER_EMAIL, name: process.env.BREVO_SENDER_NAME || "Rebel Herd Media" },
      // contactPixelTrackingConsent:false = never attribute opens or clicks to this person.
      to: [{ email: to, name: toName || undefined, contactPixelTrackingConsent: false }],
      replyTo: { email: "info@rebelherdmedia.com", name: "Rebel Herd Media" },
      subject, textContent: text, ...(html ? { htmlContent: html } : {}),
    });
    if (r.ok) return "sent";
    log("confirmation-email-failed", { status: r.status });
    return `error:${r.status}`;
  } catch (e) { log("confirmation-email-failed", { status: "network" }); return "error:network"; }
}

function shell(title, inner) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(title)} — Rebel Herd Media</title><link rel="stylesheet" href="/css/site.css?v=20261112"></head><body><main id="main" style="max-width:640px;margin:0 auto;padding:48px 20px"><h1 style="font-size:32px">${esc(title)}</h1>${inner}</main></body></html>`;
}

/** Validation error page (400): a list of problems linking back to the fields. */
export function errorPage(title, lede, items, backHref) {
  const list = items.map(([k, m]) => `<li><a href="${esc(backHref)}#${esc(k)}">${esc(m)}</a></li>`).join("");
  return new Response(shell(title, `<p class="lede" style="margin-top:12px">${esc(lede)}</p><ul style="margin:18px 0 0 20px">${list}</ul><p style="margin-top:24px">Use your browser's Back button to return to the form; your entries are usually still there. Or <a href="${esc(backHref)}">start again</a>. You can also email <a href="mailto:info@rebelherdmedia.com">info@rebelherdmedia.com</a>.</p>`),
    { status: 400, headers: { "content-type": "text/html; charset=utf-8" } });
}

/** Storage failure page (503 + Retry-After): nothing was recorded; the person can go Back and resubmit. */
export function failurePage(what, backHref) {
  return new Response(shell("We couldn't save that just now", `<p class="lede" style="margin-top:12px">Something went wrong on our side and your ${esc(what)} was <strong>not</strong> recorded. Nothing you entered was lost from your browser.</p><p style="margin-top:18px">Please use your browser's Back button and submit again in a moment. If it fails twice, email <a href="mailto:info@rebelherdmedia.com">info@rebelherdmedia.com</a> with the same details and we'll take it by hand.</p><p style="margin-top:18px"><a href="${esc(backHref)}">Return to the form</a></p>`),
    { status: 503, headers: { "content-type": "text/html; charset=utf-8", "retry-after": "60", "cache-control": "no-store" } });
}

/** Informational page (e.g. applications not open / closed). */
export function noticePage(title, lede, extraHtml = "", status = 403) {
  return new Response(shell(title, `<p class="lede" style="margin-top:12px">${esc(lede)}</p>${extraHtml}<p style="margin-top:24px"><a href="/herd/">Back to the Rebel Herd Initiative</a> · <a href="/">Homepage</a></p>`),
    { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}
