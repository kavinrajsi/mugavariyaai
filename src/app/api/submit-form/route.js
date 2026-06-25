import sql from '@/lib/db';

// Rate limiting: store timestamps per IP
const requestLog = new Map();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 3; // 3 submissions per window

// HTML escape function for security
const escapeHtml = (str) => String(str ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

function checkRateLimit(ip) {
  const now = Date.now();
  if (!requestLog.has(ip)) {
    requestLog.set(ip, []);
  }

  const timestamps = requestLog.get(ip);
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

  if (recent.length >= RATE_LIMIT_MAX) {
    return false;
  }

  recent.push(now);
  requestLog.set(ip, recent);
  return true;
}

function getClientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
         request.headers.get('x-real-ip') ||
         '127.0.0.1';
}

async function logAttempt(fields) {
  try {
    await sql`
      INSERT INTO submissions (
        ip_address, word, name, email,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        ga_id, fb_pixel_id, referrer, referrer_source,
        is_organic, referrer_hostname, all_url_params, client_timestamp,
        status, error_message
      ) VALUES (
        ${fields.ip_address || null},
        ${fields.word || null},
        ${fields.name || null},
        ${fields.email || null},
        ${fields.utm_source || null},
        ${fields.utm_medium || null},
        ${fields.utm_campaign || null},
        ${fields.utm_content || null},
        ${fields.utm_term || null},
        ${fields.google_analytics_id || null},
        ${fields.facebook_pixel_id || null},
        ${fields.referrer || null},
        ${fields.referrer_source || null},
        ${fields.is_organic_traffic || null},
        ${fields.referrer_hostname || null},
        ${fields.all_url_params ? JSON.stringify(fields.all_url_params) : null},
        ${fields.timestamp || null},
        ${fields.status || 'success'},
        ${fields.error_message || null}
      )
    `;
  } catch (err) {
    console.error('Failed to log attempt to database:', err);
  }
}

export async function POST(request) {
  try {
    const clientIp = getClientIp(request);

    // Rate limiting check
    if (!checkRateLimit(clientIp)) {
      await logAttempt({
        ip_address: clientIp,
        status: 'rate_limited',
        error_message: 'Too many submissions. Please try again later.'
      });
      return Response.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
    }

    const formData = await request.json();
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

    // Validation
    if (!word?.trim() || !name?.trim() || !email?.trim()) {
      await logAttempt({
        ip_address: clientIp,
        word, name, email,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        google_analytics_id, facebook_pixel_id, referrer,
        referrer_source, is_organic_traffic, referrer_hostname,
        all_url_params, timestamp,
        status: 'validation_error',
        error_message: 'Missing fields'
      });
      return Response.json({ message: 'Missing fields' }, { status: 400 });
    }

    if (!/^[a-zA-Z\s]+$/.test(word)) {
      await logAttempt({
        ip_address: clientIp,
        word, name, email,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        google_analytics_id, facebook_pixel_id, referrer,
        referrer_source, is_organic_traffic, referrer_hostname,
        all_url_params, timestamp,
        status: 'validation_error',
        error_message: 'Answer must contain only letters and spaces'
      });
      return Response.json({ message: 'Answer must contain only letters and spaces' }, { status: 400 });
    }

    if (name.trim().length < 4) {
      await logAttempt({
        ip_address: clientIp,
        word, name, email,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        google_analytics_id, facebook_pixel_id, referrer,
        referrer_source, is_organic_traffic, referrer_hostname,
        all_url_params, timestamp,
        status: 'validation_error',
        error_message: 'Name must be at least 4 characters'
      });
      return Response.json({ message: 'Name must be at least 4 characters' }, { status: 400 });
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      await logAttempt({
        ip_address: clientIp,
        word, name, email,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        google_analytics_id, facebook_pixel_id, referrer,
        referrer_source, is_organic_traffic, referrer_hostname,
        all_url_params, timestamp,
        status: 'validation_error',
        error_message: 'Name must contain only letters and spaces'
      });
      return Response.json({ message: 'Name must contain only letters and spaces' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      await logAttempt({
        ip_address: clientIp,
        word, name, email,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        google_analytics_id, facebook_pixel_id, referrer,
        referrer_source, is_organic_traffic, referrer_hostname,
        all_url_params, timestamp,
        status: 'validation_error',
        error_message: 'Please enter a valid email address'
      });
      return Response.json({ message: 'Please enter a valid email address' }, { status: 400 });
    }

    // Insert into database and get count
    const inserted = await sql`
      INSERT INTO submissions (
        word, name, email, ip_address,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        ga_id, fb_pixel_id, referrer, referrer_source,
        is_organic, referrer_hostname, all_url_params, client_timestamp,
        status
      ) VALUES (
        ${word}, ${name}, ${email}, ${clientIp},
        ${utm_source || null}, ${utm_medium || null}, ${utm_campaign || null},
        ${utm_content || null}, ${utm_term || null},
        ${google_analytics_id || null}, ${facebook_pixel_id || null},
        ${referrer || null}, ${referrer_source || null},
        ${is_organic_traffic || null}, ${referrer_hostname || null},
        ${all_url_params ? JSON.stringify(all_url_params) : null},
        ${timestamp || null},
        'success'
      ) RETURNING id
    `;

    const countResult = await sql`SELECT COUNT(*) AS count FROM submissions`;
    const submissionCount = 100 + parseInt(countResult[0].count);

    // Log form data (redacted for privacy)
    console.log('=== FORM SUBMISSION ===');
    console.log('Submission #:', submissionCount);
    console.log('Timestamp:', timestamp || new Date().toISOString());
    console.log('Word:', word);
    console.log('Name:', name);
    console.log('Traffic Source:', referrer_source || 'direct');
    console.log('--- UTM Parameters ---');
    console.log('utm_source:', utm_source);
    console.log('utm_medium:', utm_medium);
    console.log('utm_campaign:', utm_campaign);
    console.log('utm_content:', utm_content);
    console.log('utm_term:', utm_term);
    console.log('=======================\n');

    const apiKey = process.env.ZOHO_ZEPTO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL;
    const senderName = process.env.SENDER_NAME || 'Visvas';
    const bccEmails = process.env.BCC_EMAILS?.split(',').map(e => e.trim()) || [];
    const emailSubject = process.env.EMAIL_SUBJECT || '[mugavariyai.com] New form submission';

    if (!apiKey || !senderEmail || bccEmails.length === 0) {
      console.error('Missing required environment variables:', {
        apiKey: !!apiKey,
        senderEmail: !!senderEmail,
        bccEmails: bccEmails.length,
      });
      await logAttempt({
        ip_address: clientIp,
        word, name, email,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        google_analytics_id, facebook_pixel_id, referrer,
        referrer_source, is_organic_traffic, referrer_hostname,
        all_url_params, timestamp,
        status: 'server_error',
        error_message: 'Missing required environment variables'
      });
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const zepto_url = 'https://api.zeptomail.com/v1.1/email';

    // Send email to customer with BCC to admins
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
        to: [
          {
            email_address: {
              address: email,
              name: name,
            },
          },
        ],
        bcc: bccEmails.map(addr => ({
          email_address: {
            address: addr,
          },
        })),
        subject: emailSubject,
        htmlbody: `
          <p>Hi ${escapeHtml(name)},</p>
          <p>We received your answer: <strong>${escapeHtml(word)}</strong></p>
          <p>Thank you for joining our journey.</p>
          <hr/>
          <p><strong>Submission Details:</strong></p>
          <p>
            <strong>Word:</strong> ${escapeHtml(word)}<br/>
            <strong>Name:</strong> ${escapeHtml(name)}<br/>
            <strong>Email:</strong> ${escapeHtml(email)}<br/>
            <strong>Timestamp:</strong> ${escapeHtml(timestamp || new Date().toISOString())}<br/>
          </p>
          <p>
            <strong>Traffic Source:</strong><br/>
            Referrer Source: ${escapeHtml(referrer_source || 'direct')}<br/>
            Is Organic: ${is_organic_traffic ? 'Yes' : 'No'}<br/>
            Referrer: ${escapeHtml(referrer || 'Direct')}<br/>
          </p>
          <p>
            <strong>Tracking IDs:</strong><br/>
            Google Analytics ID: ${escapeHtml(google_analytics_id || 'N/A')}<br/>
            Facebook Pixel ID: ${escapeHtml(facebook_pixel_id || 'N/A')}<br/>
          </p>
          <p>
            <strong>UTM Parameters:</strong><br/>
            utm_source: ${escapeHtml(utm_source || 'N/A')}<br/>
            utm_medium: ${escapeHtml(utm_medium || 'N/A')}<br/>
            utm_campaign: ${escapeHtml(utm_campaign || 'N/A')}<br/>
            utm_content: ${escapeHtml(utm_content || 'N/A')}<br/>
            utm_term: ${escapeHtml(utm_term || 'N/A')}<br/>
          </p>
          ${all_url_params && Object.keys(all_url_params).length > 0 ? `
          <p>
            <strong>All URL Parameters:</strong><br/>
            ${Object.entries(all_url_params).map(([key, value]) => `${escapeHtml(String(key))}: ${escapeHtml(String(value))}`).join('<br/>')}
          </p>
          ` : ''}
        `,
      }),
    });

    if (!emailResponse.ok) {
      const emailErrorMsg = await emailResponse.text();
      console.error('Email failed:', emailErrorMsg);
      await logAttempt({
        ip_address: clientIp,
        word, name, email,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        google_analytics_id, facebook_pixel_id, referrer,
        referrer_source, is_organic_traffic, referrer_hostname,
        all_url_params, timestamp,
        status: 'email_failed',
        error_message: `Email service error: ${emailErrorMsg.substring(0, 255)}`
      });
      throw new Error('Failed to send submission email');
    }

    return Response.json({ success: true, submission_count: submissionCount }, { status: 200 });
  } catch (error) {
    console.error('Form submission error:', error);
    await logAttempt({
      ip_address: getClientIp(request),
      status: 'server_error',
      error_message: error.message.substring(0, 255)
    });
    return Response.json({ message: 'Failed to process submission' }, { status: 500 });
  }
}
