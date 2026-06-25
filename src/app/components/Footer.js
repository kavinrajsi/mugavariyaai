'use client';

import Link from 'next/link';
import styles from '../page.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <p className={styles.footerCopyright}>
            © {new Date().getFullYear()}{' '}
            <a
              href="https://visvas.in?utm_source=mugavariyai&utm_medium=footer&utm_campaign=landing"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerBrandLink}
            >
              Visvas
            </a>
            . All rights reserved.
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

      <div className={styles.footerCredit}>
        <p className={styles.footerMadeBy}>
          Made by{' '}
          <a
            href="https://madarth.com?utm_source=mugavariyai&utm_medium=footer&utm_campaign=credit"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerMadarth}
          >
            Madarth
          </a>
        </p>
      </div>
    </footer>
  );
}
