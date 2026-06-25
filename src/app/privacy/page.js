'use client';

import styles from '../page.module.css';

export default function PrivacyPolicy() {
  return (
    <section className={styles.policySection}>
      <div className={styles.policyContainer}>
        <h1 className={styles.policyTitle}>Privacy Policy</h1>
        <div className={styles.policyContent}>
          <p className={styles.lastUpdated}>Last updated: June 25, 2026</p>

          <h2>1. Introduction</h2>
          <p>
            Mugavariyai ("we," "us," "our," or "Company") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you visit our website.
          </p>

          <h2>2. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect on the site includes:</p>
          <ul>
            <li><strong>Personal Data:</strong> Name, email address, and any other information you voluntarily provide through our form submissions.</li>
            <li><strong>Automatic Data:</strong> IP address, browser type, operating system, referral source, and usage patterns through analytics.</li>
            <li><strong>Cookies:</strong> Small data files stored on your device to enhance your experience.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Send you confirmations and updates about your submissions</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Improve and optimize our website experience</li>
            <li>Analyze usage patterns and trends</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Disclosure of Your Information</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share
            information only in the following circumstances:
          </p>
          <ul>
            <li>With service providers who assist us in operating our website</li>
            <li>When required by law or to protect our rights</li>
            <li>With your explicit consent</li>
          </ul>

          <h2>5. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to protect your personal information.
            However, no method of transmission over the internet is 100% secure. We strive to protect your information
            but cannot guarantee absolute security.
          </p>

          <h2>6. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of data processing</li>
          </ul>

          <h2>7. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> privacy@mugavariyai.com<br />
            <strong>Address:</strong> Madurai, Tamil Nadu, India
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes
            by updating the "Last updated" date above.
          </p>
        </div>
      </div>
    </section>
  );
}
