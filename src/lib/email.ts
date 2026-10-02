// Email notification utility.
// Uses Resend when RESEND_API_KEY is configured; otherwise fails gracefully
// (logs a safe server-side warning but never breaks the user flow).

export type LeadEmailPayload = {
  name: string;
  phone: string;
  email?: string | null;
  course?: string | null;
  education?: string | null;
  experience?: string | null;
  trainingMode?: string | null;
  message?: string | null;
  source?: string | null;
  timestamp: string;
};

export type JobApplicationEmailPayload = {
  candidateName: string;
  phone: string;
  email?: string | null;
  jobTitle: string;
  company?: string | null;
  message?: string | null;
  timestamp: string;
};

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function isConfigured() {
  return Boolean(RESEND_API_KEY && ADMIN_EMAIL);
}

async function sendWithResend(payload: {
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      console.warn("[email] Resend error:", res.status, text);
      return { ok: false, error: text };
    }
    return { ok: true };
  } catch (e) {
    console.warn("[email] Resend send failed:", e);
    return { ok: false, error: String(e) };
  }
}

export async function sendLeadNotificationEmail(lead: LeadEmailPayload) {
  if (!isConfigured()) {
    console.warn(
      "[email] Skipping lead notification — RESEND_API_KEY / ADMIN_NOTIFICATION_EMAIL not configured. Lead still saved to DB.",
    );
    return { ok: false, skipped: true as const };
  }
  const subject = `New VertexIT Enquiry — ${lead.course || "General"}`;
  const rows: [string, string | undefined | null][] = [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Course", lead.course],
    ["Education", lead.education],
    ["Experience", lead.experience],
    ["Training mode", lead.trainingMode],
    ["Message", lead.message],
    ["Source", lead.source],
    ["Timestamp", lead.timestamp],
  ];
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
      <div style="background:#0B2545;color:#fff;padding:20px 24px">
        <h2 style="margin:0;font-size:18px">New VertexIT Enquiry</h2>
        <p style="margin:4px 0 0;font-size:13px;color:#94a3b8">${lead.course || "General course enquiry"}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([k, v]) => `
          <tr>
            <td style="padding:10px 24px;border-bottom:1px solid #f1f5f9;color:#64748b;width:160px">${k}</td>
            <td style="padding:10px 24px;border-bottom:1px solid #f1f5f9;color:#0f172a">${v ?? "—"}</td>
          </tr>`,
          )
          .join("")}
      </table>
      <div style="padding:14px 24px;background:#f8fafc;font-size:12px;color:#64748b">
        Review this lead in the VertexIT admin panel.
      </div>
    </div>`;
  return sendWithResend({
    from: "VertexIT <noreply@vertexit.in>",
    to: ADMIN_EMAIL!,
    subject,
    html,
  });
}

export async function sendCandidateConfirmationEmail(
  candidateEmail: string,
  candidateName: string,
) {
  if (!isConfigured()) {
    return { ok: false, skipped: true as const };
  }
  const subject = "We've received your VertexIT enquiry";
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
      <div style="background:#0B2545;color:#fff;padding:24px">
        <h2 style="margin:0;font-size:20px">Thank you, ${candidateName}</h2>
        <p style="margin:6px 0 0;color:#94a3b8;font-size:14px">Your enquiry has been received</p>
      </div>
      <div style="padding:24px;color:#0f172a;font-size:14px;line-height:1.6">
        <p>Hi ${candidateName},</p>
        <p>Thank you for reaching out to VertexIT. Our counsellor will contact you shortly to understand your career goals and recommend the right training path.</p>
        <p>If you'd like to speak with us sooner, you can reach us on WhatsApp:
          <a href="https://wa.me/919703686514" style="color:#0E9E8E;font-weight:600">+91 97036 86514</a>
        </p>
        <p style="color:#64748b;font-size:13px;margin-top:24px">— Team VertexIT<br/>LEARN • APPLY</p>
      </div>
    </div>`;
  return sendWithResend({
    from: "VertexIT <noreply@vertexit.in>",
    to: candidateEmail,
    subject,
    html,
  });
}

export async function sendJobApplicationNotificationEmail(
  app: JobApplicationEmailPayload,
) {
  if (!isConfigured()) {
    return { ok: false, skipped: true as const };
  }
  const subject = `New Job Application — ${app.jobTitle}`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
      <div style="background:#0B2545;color:#fff;padding:20px 24px">
        <h2 style="margin:0;font-size:18px">New Job Application</h2>
        <p style="margin:4px 0 0;font-size:13px;color:#94a3b8">${app.jobTitle}${app.company ? " · " + app.company : ""}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${[
          ["Candidate", app.candidateName],
          ["Phone", app.phone],
          ["Email", app.email],
          ["Message", app.message],
          ["Received", app.timestamp],
        ]
          .map(
            ([k, v]) => `
          <tr>
            <td style="padding:10px 24px;border-bottom:1px solid #f1f5f9;color:#64748b;width:160px">${k}</td>
            <td style="padding:10px 24px;border-bottom:1px solid #f1f5f9;color:#0f172a">${v ?? "—"}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>`;
  return sendWithResend({
    from: "VertexIT <noreply@vertexit.in>",
    to: ADMIN_EMAIL!,
    subject,
    html,
  });
}
