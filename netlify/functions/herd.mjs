// Rebel Herd Media — Rebel Herd Initiative application handler (/herd/).
import { consentStamp, forwardToNetlifyForms, seenRecently, markSeen, brevoOptIn, sendTransactional, errorPage, failurePage, noticePage, esc, isEmail, RECOGNITION_VERSION } from "../lib/consent.mjs";

// Application window, enforced here regardless of what the page shows.
// Eastern Standard Time applies throughout (DST ended Nov 1, 2026): ET = UTC-5.
export const OPENS_AT = Date.parse("2026-11-16T00:00:00-05:00");           // Mon Nov 16, 12:00 AM ET
export const CLOSES_AFTER = Date.parse("2026-11-29T00:00:00-05:00");       // Sat Nov 28, 11:59:59 PM ET is the last accepted instant
// Non-production deploys (Deploy Previews, branch deploys) may set HERD_WINDOW=open to test outside the window.
export function windowState(now = Date.now()) {
  if (process.env.HERD_WINDOW === "open" && process.env.CONTEXT !== "production") return "open";
  if (now < OPENS_AT) return "not-yet";
  if (now >= CLOSES_AFTER) return "closed";
  return "open";
}

const STATES = "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" ");
const ORG = ["Small business (for-profit)", "501(c)(3) nonprofit", "Other / not sure"];
const READY = ["Ready now — words and photos are available", "Ready by mid-January 2027", "Ready by February 2027", "Not sure yet"];

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/x-www-form-urlencoded") && !ct.includes("multipart/form-data")) return new Response("Unsupported content type", { status: 415 });
  const state = windowState();
  if (state === "not-yet") return noticePage("Applications open Monday, November 16", "The Rebel Herd Initiative application isn't accepting submissions yet. It opens Monday, November 16, 2026 and closes Saturday, November 28, 2026 at 11:59 PM Eastern.");
  if (state === "closed") return noticePage("Applications are closed", "The application period ended Saturday, November 28, 2026 at 11:59 PM Eastern. Applications are reviewed on November 29 and selected organizations are contacted privately. Thank you to everyone who applied.");
  const data = await req.formData();
  const get = (k) => (data.get(k) ?? "").toString();
  if (get("company-website").trim() !== "") return Response.redirect(new URL("/herd/thanks/", req.url), 303);

  const f = {
    applicant_name: get("applicant_name").trim(), business_name: get("business_name").trim(), email: get("email").trim(),
    city: get("city").trim(), state: get("state").trim(), org_type: get("org_type").trim(), website_url: get("website_url").trim(),
    mission_story: get("mission_story").trim(), how_helps: get("how_helps").trim(), readiness: get("readiness").trim(),
    terms_accept: get("terms_accept") === "yes" ? "yes" : "no",
    recognition_permission: get("recognition_permission") === "yes" ? "yes" : "no",
  };
  const e = [];
  if (!f.applicant_name) e.push(["applicant_name", "Please enter your name."]);
  if (!f.business_name) e.push(["business_name", "Please enter the business or nonprofit name."]);
  if (!isEmail(f.email)) e.push(["email", "Please enter a valid email address, like name@example.com."]);
  if (!f.city) e.push(["city", "Please enter your city."]);
  if (!STATES.includes(f.state)) e.push(["state", "Please choose your state."]);
  if (!ORG.includes(f.org_type)) e.push(["org_type", "Please choose an organization type."]);
  if (f.website_url && !/^https?:\/\/\S+\.\S+/.test(f.website_url) && !/^\S+\.\S+$/.test(f.website_url)) e.push(["website_url", "That doesn't look like a web address. Leave it blank if you don't have one."]);
  if (f.mission_story.replace(/\s/g, "").length < 50) e.push(["mission_story", "Please tell us a little more about what you do and why you started — a few sentences (50 characters or more)."]);
  if (f.how_helps.replace(/\s/g, "").length < 20) e.push(["how_helps", "Please tell us how a website would help — at least a sentence."]);
  if (!READY.includes(f.readiness)) e.push(["readiness", "Please tell us when you could supply your text and photos."]);
  if (f.terms_accept !== "yes") e.push(["terms_accept", "Please read and accept the application terms to apply."]);
  for (const [k, max] of [["applicant_name", 200], ["business_name", 200], ["email", 254], ["city", 120], ["website_url", 300], ["mission_story", 4000], ["how_helps", 2000]]) if (f[k].length > max) e.push([k, "That entry is longer than the form accepts."]);
  if (e.length) return errorPage("Please check your application", "A few things need attention before we can receive it.", e, "/herd/");

  // Duplicate guard reads only; the email is marked as seen after storage succeeds, so a failed store can be retried.
  if (seenRecently("herd-application", f.email)) return Response.redirect(new URL("/herd/thanks/?dup=1", req.url), 303);

  const stamp = await consentStamp(get);
  const ok = await forwardToNetlifyForms(req, "herd-application", { ...f, ...stamp, recognition_version: RECOGNITION_VERSION });
  if (!ok) return failurePage("application", "/herd/#apply");
  markSeen("herd-application", f.email);

  const first = f.applicant_name.split(/\s+/)[0];
  // Plain text only, with no links: nothing for the email provider to rewrite into a tracking redirect, and no place for an open-tracking pixel.
  const confirm = await sendTransactional({
    to: f.email, toName: f.applicant_name,
    subject: "We received your application — The Rebel Herd Initiative",
    text: `Hi ${first},\n\nWe received your application to the Rebel Herd Initiative for ${f.business_name}. Thank you for telling us what you're building.\n\nWhat happens next:\n- Applications close Saturday, November 28, 2026 at 11:59 PM Eastern.\n- On Sunday, November 29 we review every application against the published criteria and contact the selected organizations privately.\n- From Monday, November 30 we introduce selected organizations publicly, each only after it has accepted and given permission.\n- Websites are built and handed over in the first quarter of 2027.\n\nEvery applicant hears back from us either way. You don't need to do anything else right now. If you have a question, reply to this email.\n\nMerry Grant\nFounder & Principal\nRebel Herd Media`,
  });
  // Marketing opt-in is separate from the application and is double opt-in only; its outcome never affects the application.
  if (stamp.marketing_consent === "yes") await brevoOptIn({ email: f.email, firstName: first, source: "herd-initiative", req });

  // Application is stored at this point. mail=0 only tells the page not to promise a confirmation email.
  return Response.redirect(new URL(`/herd/thanks/${confirm === "sent" ? "" : "?mail=0"}`, req.url), 303);
};
export const config = { path: "/.netlify/functions/herd" };
