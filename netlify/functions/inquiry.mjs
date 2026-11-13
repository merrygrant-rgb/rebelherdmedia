// Rebel Herd Media — server-side validation for the public inquiry form.
// Receives the POST from /contact/, validates, and forwards valid submissions
// to Netlify Forms (form "inquiry"), so storage and email notifications are unchanged.
import { consentStamp, brevoOptIn, failurePage } from "../lib/consent.mjs";
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export default async (req, context) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/x-www-form-urlencoded") && !ct.includes("multipart/form-data")) {
    return new Response("Unsupported content type", { status: 415 });
  }
  const data = await req.formData();
  const get = (k) => (data.get(k) ?? "").toString();

  // Honeypot: bots fill it; silently drop and pretend success.
  if (get("company-website").trim() !== "") return Response.redirect(new URL("/thanks/", req.url), 303);

  const name = get("name"), email = get("email"), message = get("message");
  const errors = [];
  if (name.trim().length === 0) errors.push(["name", "Please enter your name."]);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) errors.push(["email", "Please enter a valid email address, like name@example.com."]);
  if (message.replace(/\s/g, "").length < 20) errors.push(["message", "Please tell us a little more — at least a sentence (20 characters or more)."]);
  if (name.length > 200 || email.length > 254 || message.length > 5000) errors.push(["message", "That entry is longer than the form accepts."]);

  if (errors.length) {
    const items = errors.map(([k, m]) => `<li><a href="/contact/#${k}">${esc(m)}</a></li>`).join("");
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Please check your inquiry — Rebel Herd Media</title><link rel="stylesheet" href="/css/site.css"></head><body><main id="main" style="max-width:640px;margin:0 auto;padding:48px 20px"><h1 style="font-size:32px">Please check your inquiry</h1><p class="lede" style="margin-top:12px">A few things need attention before we can receive it.</p><ul style="margin:18px 0 0 20px">${items}</ul><p style="margin-top:24px">Use your browser's Back button to return to the form; your entries are usually still there. Or <a href="/contact/">start the form again</a>. You can also email <a href="mailto:info@rebelherdmedia.com">info@rebelherdmedia.com</a> directly.</p></main></body></html>`;
    return new Response(html, { status: 400, headers: { "content-type": "text/html; charset=utf-8" } });
  }

  // Forward to Netlify Forms on this same deploy (form-name routes it; notifications fire as configured).
  const body = new URLSearchParams();
  body.set("form-name", "inquiry");
  for (const k of ["name", "email", "organization", "topic", "message"]) body.set(k, get(k));
  const stamp = await consentStamp(get);
  for (const [k, v] of Object.entries(stamp)) body.set(k, v);
  const target = new URL("/", req.url);
  let res;
  try { res = await fetch(target, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body }); }
  catch (e) { return failurePage("inquiry", "/contact/"); }
  if (!res.ok && res.status !== 303 && res.status !== 302) return failurePage("inquiry", "/contact/");
  if (stamp.marketing_consent === "yes") await brevoOptIn({ email: email.trim(), firstName: name.trim().split(/\s+/)[0], source: "inquiry", req });
  return Response.redirect(new URL("/thanks/", req.url), 303);
};

export const config = { path: "/.netlify/functions/inquiry" };
