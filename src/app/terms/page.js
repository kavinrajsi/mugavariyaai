'use client';

import styles from '../page.module.css';
import Footer from '../components/Footer';

export default function TermsAndConditions() {
  return (
    <>
      <section className={styles.policySection}>
      <div className={styles.policyContainer}>
        <h1 className={styles.policyTitle}>Terms and Conditions</h1>
        <div className={styles.policyContent}>
          <p className={styles.lastUpdated}>Last updated: June 25, 2026</p>

          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and
            provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software)
            on Mugavariyai&apos;s website for personal, non-commercial transitory viewing only.
            This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to decompile or reverse engineer any software contained on the website</li>
            <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
            <li>Attempt to gain unauthorized access to any portion or feature of the website</li>
          </ul>

          <h2>3. Disclaimer</h2>
          <p>
            The materials on Mugavariyai&apos;s website are provided on an &apos;as is&apos; basis. Mugavariyai makes no warranties,
            expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
            implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2>4. Limitations</h2>
          <p>
            In no event shall Mugavariyai or its suppliers be liable for any damages (including, without limitation,
            damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use
            the materials on Mugavariyai&apos;s website.
          </p>

          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on Mugavariyai&apos;s website could include technical, typographical, or photographic errors.
            Mugavariyai does not warrant that any of the materials on the website are accurate, complete, or current.
            Mugavariyai may make changes to the materials contained on the website at any time without notice.
          </p>

          <h2>6. Materials and Content Ownership</h2>
          <p>
            The materials on Mugavariyai&apos;s website are owned or controlled by Mugavariyai. Unauthorized use of any materials may violate copyright, trademark, and other applicable laws.
          </p>

          <h2>7. Links</h2>
          <p>
            Mugavariyai has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site.
            The inclusion of any link does not imply endorsement by Mugavariyai of the site. Use of any such linked website is at the user&apos;s own risk.
          </p>

          <h2>8. Modifications</h2>
          <p>
            Mugavariyai may revise these terms of service for the website at any time without notice. By using this website,
            you are agreeing to be bound by the then current version of these terms of service.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India,
            and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>

          <h2>10. Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> legal@mugavariyai.com<br />
            <strong>Address:</strong> Madurai, Tamil Nadu, India
          </p>
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
}
