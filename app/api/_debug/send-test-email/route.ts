import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Debug endpoint to test server-side Resend sending using process.env.RESEND_API_KEY
// Safety: only enabled in development or when DEBUG_SEND_TEST === 'true'

export async function POST(req: Request) {
  try {
    const isDev = (process.env.NODE_ENV || 'development') === 'development';
    const debugAllow = process.env.DEBUG_SEND_TEST === 'true';

    if (!isDev && !debugAllow) {
      return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const to = body.to || process.env.DEBUG_TEST_RECIPIENT;
    if (!to) {
      return NextResponse.json({ error: 'Provide recipient in body { "to": "you@domain.com" } or set DEBUG_TEST_RECIPIENT env var' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'RESEND_API_KEY not configured on server' }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    // Minimal test payload
    const resp = await resend.emails.send({
      from: 'iScholar <onboarding@resend.dev>',
      to,
      subject: 'iScholar test email',
      html: `<p>This is a test email triggered from local debug endpoint at ${new Date().toISOString()}</p>`,
    });

    // Log to server console for debugging
    console.log('Resend debug send response:', resp);

    // Return limited info to client (avoid echoing API key)
    return NextResponse.json({ success: true, id: resp.id, status: resp.status });
  } catch (err: any) {
    console.error('Debug send-test-email error:', err);
    // If Resend returns a structured error, include its message
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
