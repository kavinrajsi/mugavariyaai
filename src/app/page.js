'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import styles from './page.module.css';

gsap.registerPlugin(TextPlugin);

const TAGLINES = [
  'நிம்மதியின் முகவரியாய் ...',
  'மகிழ்ச்சியின் முகவரியாய் ...',
  'அன்பின் முகவரியாய் ...',
  'கனவுகளின் முகவரியாய் ...',
  'அக்கறையின் முகவரியாய் ...',
  'ஒற்றுமையின் முகவரியாய் ...',
  'மதுரையின் முகவரியாய் ...',
];

function TaglineRotator() {
  const containerRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const typeText = (index) => {
        const tagline = TAGLINES[index];
        el.innerHTML = `<h1 class="${styles.tagline}"></h1>`;
        const heading = el.querySelector('h1');

        if (prefersReduced) {
          heading.textContent = tagline;
          return;
        }

        gsap.fromTo(heading,
          { text: '' },
          {
            text: tagline,
            duration: 3.5,
            ease: 'none'
          }
        );
      };

      typeText(0);

      const interval = setInterval(() => {
        const heading = el.querySelector('h1');
        if (prefersReduced) {
          indexRef.current = (indexRef.current + 1) % TAGLINES.length;
          typeText(indexRef.current);
          return;
        }

        gsap.to(heading, {
          opacity: 0, y: -10, duration: 0.3, ease: 'power2.in',
          onComplete: () => {
            indexRef.current = (indexRef.current + 1) % TAGLINES.length;
            typeText(indexRef.current);
          }
        });
      }, 6500);

      return () => clearInterval(interval);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return <div className={styles.taglineContainer} ref={containerRef} />;
}

function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(2026, 6, 4); // July 4th, 2026

    const tick = () => {
      const now = new Date();
      const diff = target - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTime({ days, hours, minutes, seconds });
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div className={styles.countdownSection}>
      <div className={styles.countdown}>
        {pad(time.days)} : {pad(time.hours)} : {pad(time.minutes)} : {pad(time.seconds)}
      </div>
      <p className={styles.countdownLabel}>Until the doors open</p>
    </div>
  );
}

function SignupForm({ onSuccess }) {
  const [state, setState] = useState('form');
  const [word, setWord] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submissionCount, setSubmissionCount] = useState(0);

  const validateWord = (value) => {
    if (!value.trim()) return 'Required';
    if (!/^[a-zA-Z\s]+$/.test(value)) return 'Answer must contain only letters and spaces';
    const words = value.trim().split(/\s+/);
    if (words.length > 2) return 'Maximum 2 words allowed';
    if (words.some(w => w.length < 2)) return 'Each word must be at least 2 characters';
    return '';
  };

  const validateName = (value) => {
    if (!value.trim()) return 'Required';
    if (value.trim().length < 4) return 'Name must be at least 4 characters';
    if (value.trim().length > 50) return 'Name must be less than 50 characters';
    if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name must contain only letters and spaces';
    return '';
  };

  const validateEmail = (value) => {
    if (!value.trim()) return 'Required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  };

  const getUTMParams = () => {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || null,
      utm_medium: params.get('utm_medium') || null,
      utm_campaign: params.get('utm_campaign') || null,
      utm_content: params.get('utm_content') || null,
      utm_term: params.get('utm_term') || null,
    };
  };

  const getAllURLParams = () => {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    const allParams = {};
    params.forEach((value, key) => {
      allParams[key] = value;
    });
    return allParams;
  };

  const getReferrerInfo = () => {
    if (typeof window === 'undefined') return { referrer: null, is_organic: false, source: null };

    const referrer = document.referrer;
    if (!referrer) return { referrer: null, is_organic: false, source: null };

    const referrerUrl = new URL(referrer);
    const hostname = referrerUrl.hostname.toLowerCase();

    let source = null;
    let isOrganic = false;

    if (hostname.includes('google')) {
      source = 'google_organic';
      isOrganic = true;
    } else if (hostname.includes('bing')) {
      source = 'bing_organic';
      isOrganic = true;
    } else if (hostname.includes('duckduckgo')) {
      source = 'duckduckgo_organic';
      isOrganic = true;
    } else if (hostname.includes('yahoo')) {
      source = 'yahoo_organic';
      isOrganic = true;
    } else if (hostname.includes('facebook')) {
      source = 'facebook_referral';
    } else if (hostname.includes('twitter') || hostname.includes('x.com')) {
      source = 'twitter_referral';
    } else if (hostname.includes('linkedin')) {
      source = 'linkedin_referral';
    } else if (hostname.includes('instagram')) {
      source = 'instagram_referral';
    } else if (hostname.includes('reddit')) {
      source = 'reddit_referral';
    } else {
      source = 'referral';
    }

    return {
      referrer: referrer,
      is_organic: isOrganic,
      source: source,
      hostname: hostname,
    };
  };

  const getIPAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return null;
    }
  };

  const getTrackingIds = () => {
    if (typeof window === 'undefined') return { google_analytics_id: null, facebook_pixel_id: null };

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const getLocalStorage = (key) => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    };

    return {
      google_analytics_id: getCookie('_ga') || getLocalStorage('ga_id') || null,
      facebook_pixel_id: getCookie('_fbp') || getCookie('_fbc') || getLocalStorage('fb_pixel_id') || null,
    };
  };

  const handleFieldChange = (field, value) => {
    if (field === 'word') {
      const sanitized = value.replace(/[^a-zA-Z\s]/g, '');
      setWord(sanitized);
    }
    if (field === 'name') {
      const sanitized = value.replace(/[^a-zA-Z\s]/g, '');
      setName(sanitized);
    }
    if (field === 'email') setEmail(value);

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (honeypot) {
      setState('success');
      onSuccess(word);
      return;
    }

    const newErrors = {};

    const wordError = validateWord(word);
    if (wordError) newErrors.word = wordError;

    const nameError = validateName(name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const utmParams = getUTMParams();
      const allURLParams = getAllURLParams();
      const ipAddress = await getIPAddress();
      const trackingIds = getTrackingIds();
      const referrerInfo = getReferrerInfo();

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word,
          name,
          email,
          ip_address: ipAddress,
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
          utm_content: utmParams.utm_content,
          utm_term: utmParams.utm_term,
          google_analytics_id: trackingIds.google_analytics_id,
          facebook_pixel_id: trackingIds.facebook_pixel_id,
          referrer: referrerInfo.referrer,
          referrer_source: referrerInfo.source,
          is_organic_traffic: referrerInfo.is_organic,
          referrer_hostname: referrerInfo.hostname,
          all_url_params: allURLParams,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissionCount(data.submission_count || 101);
        setState('success');
        onSuccess(word);
      } else {
        const data = await response.json().catch(() => ({}));
        setErrors({ submit: data.message || 'Failed to submit. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state === 'success') {
    return (
      <div className={styles.successMessage}>
        <h2 className={styles.successHeading}>உங்கள் வார்த்தை பதிவாகிவிட்டது</h2>
        <p className={styles.successSubtitle}>
          Your word has been noted. We'll open the door soon.
        </p>
        <p className={styles.successCount}>
          {submissionCount} curious minds joined
        </p>
      </div>
    );
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>வீடுன்னா என்ன?</h2>
      {errors.submit && <div className={styles.errorAlert}>{errors.submit}</div>}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: 'none' }}
        tabIndex="-1"
        autoComplete="off"
        aria-hidden="true"
      />
      <div className={styles.formGroup}>
        <div className={styles.inputWrapper}>
          <label className={styles.inputLabel}>Your answer (1-2 words)</label>
          <input
            className={`${styles.input} ${errors.word ? styles.inputError : ''}`}
            type="text"
            placeholder="e.g., நிம்மதி, அன்பு, கனவு"
            value={word}
            onChange={(e) => handleFieldChange('word', e.target.value)}
            aria-invalid={!!errors.word}
          />
          {errors.word && <p className={styles.errorText}>{errors.word}</p>}
        </div>
        <div className={styles.inputWrapper}>
          <label className={styles.inputLabel}>Your name</label>
          <input
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className={styles.errorText}>{errors.name}</p>}
        </div>
        <div className={styles.inputWrapper}>
          <label className={styles.inputLabel}>Email</label>
          <input
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
        </div>
      </div>
      <button className={styles.submitBtn} type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Joining...' : <>Join the journey <ArrowRight size={20} /></>}
      </button>
    </form>
  );
}

export default function Home() {
  const [submittedWord, setSubmittedWord] = useState(null);

  const handleScroll = (e) => {
    e.preventDefault();
    document.querySelector(`.${styles.formSection}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <TaglineRotator />
        <div className={styles.subtitle}>
          Every home has a story. We're getting ready to share ours.
        </div>
        <button className={styles.ctaScroll} onClick={handleScroll}>
          Join the journey <ArrowDown size={20} />
        </button>
        <CountdownTimer />
      </section>

      {/* Form */}
      <section className={styles.formSection}>
        <SignupForm onSuccess={setSubmittedWord} />
      </section>
    </>
  );
}
