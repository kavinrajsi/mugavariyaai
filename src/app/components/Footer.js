'use client';

import Link from 'next/link';
import styles from '../page.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <p className={styles.footerCopyright}>
            © {new Date().getFullYear()} Visvas. All rights reserved.
          </p>
        </div>

        <nav className={styles.footerRight}>
          <ul className={styles.footerPoliciesList}>
            <li><Link href="/privacy" className={styles.footerPolicyLink}>Privacy Policy</Link></li>
            <li><Link href="/terms" className={styles.footerPolicyLink}>Terms & Conditions</Link></li>
            <li><Link href="/cookies" className={styles.footerPolicyLink}>Cookie Policy</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
