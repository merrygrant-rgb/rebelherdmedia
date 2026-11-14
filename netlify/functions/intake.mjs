// Rebel Herd Media — pass-through for the three intake forms. Adds consent stamping and optional
// Brevo opt-in; otherwise forwards every field unchanged so storage, routing and notifications stay as before.
import { consentStamp, forwardToNetlifyForms, brevoOptIn, failurePage } from "../lib/consent.mjs";
const FORMS = new Set(["intake-audio", "intake-ai", "intake-brand"]);
export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const data = await req.formData();
  const get = (k) => (data.get(k) ?? "").toString();
  const formName = get("form-name");
  if (!FORMS.has(formName)) return new Response("Unknown form", { status: 400 });
  if (get("company-website").trim() !== "") return Response.redirect(new URL("/thanks/", req.url), 303);
  const fields = {};
  for (const [k, v] of data.entries()) if (k !== "form-name" && k !== "company-website") fields[k] = fields[k] ? `${fields[k]}, ${v}` : String(v);
  const stamp = await consentStamp(get);
  const ok = await forwardToNetlifyForms(req, formName, { ...fields, ...stamp });
  if (!ok) return failurePage("answers", `/intake/${formName.replace("intake-", "")}/`);
  if (stamp.marketing_consent === "yes" && fields.email) await brevoOptIn({ email: fields.email.trim(), firstName: (fields.name || "").split(/\s+/)[0] || "", source: formName, req });
  return Response.redirect(new URL("/thanks/", req.url), 303);
};
export const config = { path: "/.netlify/functions/intake" };
