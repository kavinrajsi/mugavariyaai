import { promises as fs } from 'fs';
import path from 'path';

const COUNTER_FILE = path.join(process.cwd(), 'submission_counter.json');

async function getAndIncrementCounter() {
  try {
    const data = await fs.readFile(COUNTER_FILE, 'utf-8');
    const counter = JSON.parse(data);
    counter.count += 1;
    await fs.writeFile(COUNTER_FILE, JSON.stringify(counter, null, 2));
    return counter.count;
  } catch (error) {
    const initialCount = { count: 101 };
    await fs.writeFile(COUNTER_FILE, JSON.stringify(initialCount, null, 2));
    return 101;
  }
}

export async function POST(request) {
  try {
    const formData = await request.json();
    const submissionCount = await getAndIncrementCounter();
    const {
      word,
      name,
      email,
      ip_address,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      google_analytics_id,
      facebook_pixel_id,
      referrer,
      referrer_source,
      is_organic_traffic,
      referrer_hostname,
      all_url_params,
      timestamp,
    } = formData;

    // Log all form data to console
    console.log('=== FORM SUBMISSION ===');
    console.log('Submission #:', submissionCount);
    console.log('Timestamp:', timestamp || new Date().toISOString());
    console.log('--- User Info ---');
    console.log('Word:', word);
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('IP Address:', ip_address);
    console.log('--- Traffic Source ---');
    console.log('Referrer:', referrer || 'Direct');
    console.log('Referrer Source:', referrer_source || 'direct');
    console.log('Is Organic:', is_organic_traffic);
    console.log('Referrer Hostname:', referrer_hostname || 'N/A');
    console.log('--- Tracking IDs ---');
    console.log('Google Analytics ID:', google_analytics_id);
    console.log('Facebook Pixel ID:', facebook_pixel_id);
    console.log('--- UTM Parameters ---');
    console.log('utm_source:', utm_source);
    console.log('utm_medium:', utm_medium);
    console.log('utm_campaign:', utm_campaign);
    console.log('utm_content:', utm_content);
    console.log('utm_term:', utm_term);
    if (all_url_params && Object.keys(all_url_params).length > 0) {
      console.log('--- All URL Parameters ---');
      console.log(JSON.stringify(all_url_params, null, 2));
    }
    console.log('--- Full Data ---');
    console.log(JSON.stringify(formData, null, 2));
    console.log('=======================\n');

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
        htmlbody: `
          <p><strong>New form submission:</strong></p>
          <p>
            <strong>Word:</strong> ${word}<br/>
            <strong>Name:</strong> ${name}<br/>
            <strong>Email:</strong> ${email}<br/>
            <strong>IP Address:</strong> ${ip_address || 'N/A'}<br/>
            <strong>Timestamp:</strong> ${timestamp || new Date().toISOString()}<br/>
          </p>
          <p>
            <strong>Traffic Source:</strong><br/>
            Referrer Source: ${referrer_source || 'direct'}<br/>
            Is Organic: ${is_organic_traffic ? 'Yes' : 'No'}<br/>
            Referrer: ${referrer || 'Direct'}<br/>
          </p>
          <p>
            <strong>Tracking IDs:</strong><br/>
            Google Analytics ID: ${google_analytics_id || 'N/A'}<br/>
            Facebook Pixel ID: ${facebook_pixel_id || 'N/A'}<br/>
          </p>
          <p>
            <strong>UTM Parameters:</strong><br/>
            utm_source: ${utm_source || 'N/A'}<br/>
            utm_medium: ${utm_medium || 'N/A'}<br/>
            utm_campaign: ${utm_campaign || 'N/A'}<br/>
            utm_content: ${utm_content || 'N/A'}<br/>
            utm_term: ${utm_term || 'N/A'}<br/>
          </p>
          ${all_url_params && Object.keys(all_url_params).length > 0 ? `
          <p>
            <strong>All URL Parameters:</strong><br/>
            ${Object.entries(all_url_params).map(([key, value]) => `${key}: ${value}`).join('<br/>')}
          </p>
          ` : ''}
        `,
      }),
    });

    if (!adminEmailResponse.ok) {
      console.error('Admin email failed:', await adminEmailResponse.text());
      throw new Error('Failed to send admin notification email');
    }

    return Response.json({ success: true, submission_count: submissionCount }, { status: 200 });
  } catch (error) {
    console.error('Form submission error:', error);
    return Response.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
