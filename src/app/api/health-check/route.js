import sql from '@/lib/db';

const escapeHtml = (str) => String(str ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

async function logHealthCheck(status, errorMessage) {
  try {
    await sql`
      INSERT INTO submissions (
        status, error_message, client_timestamp
      ) VALUES (
        ${status},
        ${errorMessage},
        ${new Date().toISOString()}
      )
    `;
  } catch (err) {
    console.error('Failed to log health check to database:', err);
  }
}

async function sendFailureAlert(errorMessage) {
  try {
    const apiKey = process.env.ZOHO_ZEPTO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL;
    const senderName = process.env.SENDER_NAME || 'Visvas';
    const bccEmails = process.env.BCC_EMAILS?.split(',').map(e => e.trim()) || [];
    const emailSubject = 'Health Check Alert: Form Submission Failed';

    if (!apiKey || !senderEmail || bccEmails.length === 0) {
      console.error('Missing email configuration for health check alert');
      return;
    }

    const zepto_url = 'https://api.zeptomail.com/v1.1/email';

    const emailResponse = await fetch(zepto_url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Zoho-enczapikey ${apiKey}`,
      },
      body: JSON.stringify({
        from: {
          address: senderEmail,
          name: senderName,
        },
        to: bccEmails.map(addr => ({
          email_address: { address: addr },
        })),
        subject: emailSubject,
        htmlbody: `
          <p><strong>Health Check Failed at ${new Date().toISOString()}</strong></p>
          <p><strong>Error:</strong> ${escapeHtml(errorMessage)}</p>
          <p>The form submission health check did not complete successfully.</p>
          <p>Please investigate the API and email service immediately.</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      console.error('Failed to send health check alert email:', await emailResponse.text());
    }
  } catch (err) {
    console.error('Failed to send health check alert:', err);
  }
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      console.warn('Unauthorized health check request');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mugavariyai.com';

    const response = await fetch(`${baseUrl}/api/submit-form`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        word: 'TestWord',
        name: 'HealthCheck',
        email: 'healthcheck@mugavariyai.com',
        referrer_source: 'health_check',
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorMsg = `HTTP ${response.status}: ${errorText.substring(0, 200)}`;
      console.error('Health check failed:', errorMsg);

      await logHealthCheck('health_check_fail', errorMsg);
      await sendFailureAlert(errorMsg);

      return Response.json(
        { ok: false, error: `HTTP ${response.status}` },
        { status: 200 }
      );
    }

    const data = await response.json();
    console.log('Health check passed. Submission count:', data.submission_count);

    await logHealthCheck('health_check_pass', null);

    return Response.json(
      { ok: true, submission_count: data.submission_count },
      { status: 200 }
    );
  } catch (err) {
    console.error('Health check error:', err.message);

    await logHealthCheck('health_check_fail', err.message.substring(0, 255));
    await sendFailureAlert(err.message);

    return Response.json(
      { ok: false, error: err.message },
      { status: 200 }
    );
  }
}
