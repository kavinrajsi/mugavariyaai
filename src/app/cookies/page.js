'use client';

import styles from '../page.module.css';

export default function CookiePolicy() {
  return (
    <section className={styles.policySection}>
      <div className={styles.policyContainer}>
        <h1 className={styles.policyTitle}>Cookie Policy</h1>
        <div className={styles.policyContent}>
          <p className={styles.lastUpdated}>Last updated: June 25, 2026</p>

          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small data files stored on your device (computer, tablet, or mobile phone) when you visit a website.
            They contain information that is stored on your browser or device and sent to us when you visit our site.
            Cookies help us remember your preferences and improve your browsing experience.
          </p>

          <h2>2. Types of Cookies We Use</h2>

          <h3>Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable core functionality such as security,
            network management, and accessibility. Without these cookies, the website may not work as intended.
          </p>

          <h3>Analytical Cookies</h3>
          <p>
            We use Google Analytics to understand how visitors interact with our website. These cookies collect information about
            how you use the site, including pages visited, time spent, and interactions. This helps us improve our website and services.
          </p>

          <h3>Marketing and Tracking Cookies</h3>
          <p>
            We use marketing cookies to understand your interests and display relevant content. This includes Google Tag Manager
            and other tracking technologies to measure campaign performance and user behavior.
          </p>

          <h3>Third-Party Cookies</h3>
          <p>
            Some cookies are set by third-party services embedded on our website, such as analytics providers and advertising partners.
            These third parties have their own cookie policies.
          </p>

          <h2>3. Specific Cookies We Use</h2>
          <ul>
            <li><strong>Google Analytics:</strong> Tracks website usage and user behavior</li>
            <li><strong>Google Tag Manager:</strong> Manages analytics and tracking tags (GTM-WFT3JSDX)</li>
            <li><strong>Session Cookies:</strong> Maintain your session while browsing</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
          </ul>

          <h2>4. How Long Do Cookies Last?</h2>
          <p>
            Cookies can be either "session" cookies (deleted when you close your browser) or
            "persistent" cookies (stored on your device until they expire or you delete them).
          </p>

          <h2>5. Your Cookie Choices</h2>
          <p>
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul>
            <li>Accept all cookies</li>
            <li>Reject all cookies</li>
            <li>Delete existing cookies</li>
            <li>Disable cookies for specific sites</li>
          </ul>
          <p>
            Please note that disabling essential cookies may affect the functionality of our website.
          </p>

          <h2>6. Do Not Track (DNT)</h2>
          <p>
            Some browsers include a "Do Not Track" feature. Currently, there is no industry standard for recognizing DNT signals.
            We do not respond to DNT browser signals, but you can use other tools to control cookie collection.
          </p>

          <h2>7. Third-Party Cookie Policies</h2>
          <p>
            Our website includes links to third-party services that have their own cookie policies:
          </p>
          <ul>
            <li><strong>Google Analytics:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
            <li><strong>Google Tag Manager:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
          </ul>

          <h2>8. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational,
            legal, or regulatory reasons. We will notify you by updating the "Last updated" date above.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> privacy@mugavariyai.com<br />
            <strong>Address:</strong> Madurai, Tamil Nadu, India
          </p>
        </div>
      </div>
    </section>
  );
}
