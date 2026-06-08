import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import cors from 'cors';

const RESEND_API_KEY = defineSecret('RESEND_API_KEY');

/** Where the inquiry lands. Must be the address tied to the Resend account
 *  when sending from the shared onboarding@resend.dev sender. */
const RECIPIENT = 'mdanielcruz66@gmail.com';

const corsHandler = cors({
  origin: [
    'http://localhost:4200',
    'https://moises-portfolio-mdcc.web.app',
    'https://moises-portfolio-mdcc.firebaseapp.com',
    'https://moisescruz.dev',
    'https://www.moisescruz.dev',
  ],
  methods: ['POST', 'OPTIONS'],
});

const BUDGET_TIERS = ['< $500', '$500 - $1k', '$1k - $3k', '$3k - $10k', '$10k+'];

interface ContactPayload {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}

const escapeHtml = (value: string): string =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const initialsOf = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '•';

/** Plain-text alternative — multipart emails land in the inbox far more reliably. */
function buildEmailText(data: ContactPayload): string {
  return [
    'NEW PROJECT INQUIRY',
    '',
    `From:    ${data.name} <${data.email}>`,
    `Project: ${data.projectType}`,
    `Budget:  ${data.budget}`,
    '',
    'Message:',
    data.message,
    '',
    '—',
    `Reply directly to this email to respond to ${data.name}.`,
    'Sent from your portfolio contact form.',
  ].join('\n');
}

/** Builds the responsive, brand-styled HTML email (inline styles for client support). */
function buildEmailHtml(data: ContactPayload): string {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const projectType = escapeHtml(data.projectType);
  const budget = escapeHtml(data.budget);
  const message = escapeHtml(data.message).replace(/\r?\n/g, '<br />');
  const initials = escapeHtml(initialsOf(data.name));
  const sentAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // Creative budget strip — all tiers shown, the selected one lit up in gold.
  const budgetStrip = BUDGET_TIERS.map((tier) => {
    const active = tier === data.budget;
    return `<td style="padding:0 3px;width:20%;">
      <div style="background:${active ? '#f5c400' : '#ece9f1'};color:${active ? '#1c1b1b' : '#a6a1b0'};font-weight:${active ? '700' : '500'};font-size:11px;line-height:1.2;text-align:center;padding:9px 2px;border-radius:8px;font-family:'JetBrains Mono',monospace;border:1px solid ${active ? '#e0b400' : 'transparent'};">${escapeHtml(tier)}</div>
    </td>`;
  }).join('');

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#eceaf0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eceaf0;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 12px 40px rgba(20,18,30,0.14);font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

            <!-- Accent header -->
            <tr>
              <td style="background:linear-gradient(135deg,#f5c400 0%,#f1c100 60%,#e8c426 100%);padding:30px 34px;">
                <div style="font:700 11px/1 'JetBrains Mono',monospace;letter-spacing:2px;color:#6a5400;text-transform:uppercase;">New Project Inquiry</div>
                <div style="font-size:25px;font-weight:800;color:#1c1b1b;margin-top:8px;letter-spacing:-0.4px;">${name}</div>
                <div style="font-size:13px;color:#6a5400;margin-top:3px;">is interested in a <strong>${projectType}</strong></div>
              </td>
            </tr>

            <!-- Sender -->
            <tr>
              <td style="padding:24px 34px 6px 34px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="46" valign="middle">
                      <div style="width:46px;height:46px;border-radius:50%;background:#1c1b1b;color:#f5c400;font-weight:700;font-size:16px;text-align:center;line-height:46px;font-family:'JetBrains Mono',monospace;">${initials}</div>
                    </td>
                    <td valign="middle" style="padding-left:14px;">
                      <div style="font-size:15px;font-weight:700;color:#1c1b1b;">${name}</div>
                      <a href="mailto:${email}" style="font-size:13px;color:#0a7ea4;text-decoration:none;">${email}</a>
                    </td>
                    <td valign="middle" align="right">
                      <a href="mailto:${email}?subject=Re:%20Your%20project%20inquiry" style="display:inline-block;background:#1c1b1b;color:#ffffff;font-size:12px;font-weight:600;text-decoration:none;padding:9px 16px;border-radius:8px;">Reply ↩</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Project type chip -->
            <tr>
              <td style="padding:14px 34px 0 34px;">
                <span style="display:inline-block;background:#f4f2f7;border:1px solid #e6e2ee;border-radius:999px;padding:6px 14px;font-size:12px;color:#4e4632;font-family:'JetBrains Mono',monospace;">
                  <span style="color:#a6a1b0;">Project&nbsp;·&nbsp;</span><strong style="color:#1c1b1b;">${projectType}</strong>
                </span>
              </td>
            </tr>

            <!-- Budget strip -->
            <tr>
              <td style="padding:22px 34px 6px 34px;">
                <div style="font:700 11px/1 'JetBrains Mono',monospace;letter-spacing:1.5px;color:#8a8694;text-transform:uppercase;margin-bottom:10px;">Estimated Budget · <span style="color:#1c1b1b;">${budget}</span></div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${budgetStrip}</tr></table>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding:22px 34px 8px 34px;">
                <div style="border-left:4px solid #f5c400;background:#faf9fc;border-radius:0 12px 12px 0;padding:16px 20px;">
                  <div style="font:700 11px/1 'JetBrains Mono',monospace;letter-spacing:1.5px;color:#8a8694;text-transform:uppercase;margin-bottom:10px;">Message</div>
                  <div style="font-size:15px;line-height:1.65;color:#2b2a30;">${message}</div>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 34px 30px 34px;">
                <div style="border-top:1px solid #efedf3;padding-top:16px;font-size:12px;color:#a6a1b0;">
                  Sent from your portfolio contact form · ${sentAt}
                </div>
              </td>
            </tr>

          </table>
          <div style="font-size:11px;color:#b8b4c0;margin-top:16px;font-family:'JetBrains Mono',monospace;">Moises D. Cruz — Full Stack &amp; DevSecOps</div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export const sendContactEmail = onRequest({ secrets: [RESEND_API_KEY] }, (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const apiKey = RESEND_API_KEY.value();
    if (!apiKey) {
      console.error('Missing RESEND_API_KEY');
      res.status(500).json({ error: 'Server misconfigured.' });
      return;
    }

    const body = (req.body || {}) as Partial<ContactPayload>;
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const projectType = (body.projectType || '').trim();
    const budget = (body.budget || '').trim();
    const message = (body.message || '').trim();

    if (!name || !email || !projectType || !budget || !message) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      res.status(400).json({ error: 'Invalid email address.' });
      return;
    }

    const payload: ContactPayload = { name, email, projectType, budget, message };

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portfolio Inquiry <noreply@dinofeedback.app>',
          to: [RECIPIENT],
          reply_to: email,
          subject: `${name} — ${projectType}`,
          html: buildEmailHtml(payload),
          text: buildEmailText(payload),
        }),
      });

      if (!response.ok) {
        console.error('Resend error:', await response.text());
        res.status(502).json({ error: 'Failed to send email.' });
        return;
      }

      res.status(200).json({ success: true });
    } catch (err) {
      console.error('Unexpected error sending email:', err);
      res.status(500).json({ error: 'Failed to send email.' });
    }
  });
});
