export async function POST(request) {
  try {
    const { word, name, email } = await request.json();

    // Validation
    if (!word?.trim() || !name?.trim() || !email?.trim()) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }

    const apiKey = process.env.ZOHO_ZEPTO_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!apiKey || !adminEmail) {
      console.error('Missing Zoho Zepto credentials in environment variables');
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const zepto_url = 'https://api.zeptomail.com/v1.1/email';

    // Send confirmation email to user
    const userEmailResponse = await fetch(zepto_url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Zoho-enczapikey ${apiKey}`,
      },
      body: JSON.stringify({
        from: {
          address: adminEmail,
          name: 'Visvas',
        },
        to: [
          {
            email_address: {
              address: email,
              name: name,
            },
          },
        ],
        subject: 'process.env.EMAIL_SUBJECT',
        htmlbody: `<p>Hi ${name},</p><p>We received your answer: <strong>${word}</strong></p><p>Thank you for joining our journey.</p>`,
      }),
    });

    if (!userEmailResponse.ok) {
      console.error('User email failed:', await userEmailResponse.text());
      throw new Error('Failed to send user confirmation email');
    }

    // Send notification email to admin
    const adminEmailResponse = await fetch(zepto_url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Zoho-enczapikey ${apiKey}`,
      },
      body: JSON.stringify({
        from: {
          address: adminEmail,
          name: 'Visvas Form',
        },
        to: [
          {
            email_address: {
              address: adminEmail,
            },
          },
        ],
        subject: `New submission: ${word}`,
        htmlbody: `<p><strong>New form submission:</strong></p><p>Word: <strong>${word}</strong><br/>Name: ${name}<br/>Email: ${email}</p>`,
      }),
    });

    if (!adminEmailResponse.ok) {
      console.error('Admin email failed:', await adminEmailResponse.text());
      throw new Error('Failed to send admin notification email');
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Form submission error:', error);
    return Response.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
