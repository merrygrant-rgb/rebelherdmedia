// Rebel Herd Media — Knowledge Center updates signup.
import { consentStamp, forwardToNetlifyForms, seenRecently, markSeen, brevoOptIn, errorPage, failurePage, isEmail } from "../lib/consent.mjs";
const TOPICS = ["acoustic", "ai", "digital", "all"];
export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const data = await req.formData();
  const get = (k) => (data.get(k) ?? "").toString();
  if (get("company-website").trim() !== "") return Response.redirect(new URL("/knowledge-center/subscribed/", req.url), 303);
  const email = get("email").trim(), first = get("first_name").trim();
  const topics = data.getAll("topics").map(String).filter((t) => TOPICS.includes(t));
  const e = [];
  if (!isEmail(email)) e.push(["sub-email", "Please enter a valid email address, like name@example.com."]);
  if (get("marketing_consent") !== "yes") e.push(["sub-consent", "Please tick the box so we know you'd like the emails."]);
  if (first.length > 100 || email.length > 254) e.push(["sub-email", "That entry is longer than the form accepts."]);
  if (e.length) return errorPage("Please check the signup", "One or two things need attention.", e, "/knowledge-center/");
  if (seenRecently("subscribe", email)) return Response.redirect(new URL("/knowledge-center/subscribed/?dup=1", req.url), 303);
  const stamp = await consentStamp(get);
  // The consent record is the system of record; store it first. If that fails, nothing is sent and the person can retry.
  const ok = await forwardToNetlifyForms(req, "subscribe", { email, first_name: first, topics: topics.join("|") || "all", ...stamp });
  if (!ok) return failurePage("signup", "/knowledge-center/#subscribe");
  markSeen("subscribe", email);
  // Double opt-in only. Until the person clicks the confirmation email they are NOT subscribed.
  const r = await brevoOptIn({ email, firstName: first, source: "knowledge-center", topics: topics.length ? topics : ["all"], req });
  // confirm=1: confirmation email requested. pending=1: request recorded but no confirmation email could be sent (not configured or Brevo error) — page says so honestly.
  return Response.redirect(new URL(`/knowledge-center/subscribed/${r === "doi-sent" ? "?confirm=1" : "?pending=1"}`, req.url), 303);
};
export const config = { path: "/.netlify/functions/subscribe" };
