// Vercel Node Function — replaces the Axum `POST /api/contact` handler.
// Validates the contact form and, when SMTP is configured, delivers it by email.
// Env: SMTP_URL (smtps://user:pass@host:465), CONTACT_TO, CONTACT_FROM (optional).
// With no SMTP_URL it runs in "mock" mode (202, no mail) — same as the old server.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method not allowed" });
  }

  const body =
    typeof req.body === "string" ? safeParse(req.body) : (req.body ?? {});
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || message.length < 5 || !email.includes("@") || email.length > 254) {
    return res.status(422).json({
      error: "name, a valid email, and a 5+ char message are required",
    });
  }

  const smtpUrl = (process.env.SMTP_URL ?? "").trim();
  if (!smtpUrl) {
    console.log(`contact (mock): ${name} <${email}> — ${message.length} chars`);
    return res.status(202).json({ status: "mock" });
  }

  try {
    const to = process.env.CONTACT_TO;
    if (!to) throw new Error("CONTACT_TO is not set");
    const from = process.env.CONTACT_FROM || to;

    const transport = nodemailer.createTransport(smtpUrl);
    await transport.sendMail({
      from,
      to,
      replyTo: `${name} <${email}>`,
      subject: `Portfolio contact — ${name}`,
      text: `From: ${name} <${email}>\n\n${message}\n`,
    });
    return res.status(202).json({ status: "sent" });
  } catch (e) {
    console.error("contact email failed:", e);
    return res.status(502).json({ error: "mail delivery failed" });
  }
}

function safeParse(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
