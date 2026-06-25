'use client';

import Link from 'next/link';
import styles from '../page.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerBrand}>
          <h3 className={styles.footerBrandName}>Mugavariyai</h3>
          <p className={styles.footerTagline}>Every home has a story. We're getting ready to share ours.</p>
        </div>

        <nav className={styles.footerNav}>
          <div className={styles.footerLinks}>
            <h4 className={styles.footerSectionTitle}>Policies</h4>
            <ul className={styles.footerLinksList}>
              <li><Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link></li>
              <li><Link href="/terms" className={styles.footerLink}>Terms & Conditions</Link></li>
              <li><Link href="/cookies" className={styles.footerLink}>Cookie Policy</Link></li>
            </ul>
          </div>
        </nav>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.footerCopyright}>
          © {new Date().getFullYear()} Mugavariyai. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
