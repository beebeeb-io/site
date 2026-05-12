import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

// In-memory rate limiting: max 3 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Periodically clean up stale entries to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 5 * 60_000);

export const POST: APIRoute = async ({ request }) => {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again in a minute.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } },
    );
  }

  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const { name, email, subject, message } = body;

  // Validate required fields
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return new Response(
      JSON.stringify({ error: 'All fields are required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return new Response(
      JSON.stringify({ error: 'Please provide a valid email address.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Sanitize inputs (basic length limits)
  if (name.length > 200 || email.length > 320 || subject.length > 200 || message.length > 5000) {
    return new Response(
      JSON.stringify({ error: 'One or more fields exceed the maximum length.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const supportEmail = process.env.SUPPORT_EMAIL || 'hello@beebeeb.io';

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error('[contact] SMTP not configured — SMTP_HOST, SMTP_USER, or SMTP_PASS missing');
    return new Response(
      JSON.stringify({ error: 'Contact form is temporarily unavailable. Please email us directly at hello@beebeeb.io.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const subjectLabels: Record<string, string> = {
    account: 'Account & billing',
    technical: 'Technical issue',
    security: 'Security concern',
    feature: 'Feature request',
    other: 'Other',
  };

  const subjectLabel = subjectLabels[subject.trim()] || subject.trim();

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"Beebeeb Support Form" <${smtpUser}>`,
      replyTo: `"${name.trim()}" <${email.trim()}>`,
      to: supportEmail,
      subject: `[Support] ${subjectLabel}: ${name.trim()}`,
      text: [
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Subject: ${subjectLabel}`,
        '',
        'Message:',
        message.trim(),
      ].join('\n'),
    });

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[contact] Failed to send email:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to send message. Please try again or email us directly at hello@beebeeb.io.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
