'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

const TAGLINES = [
  'நிம்மதியின் முகவரியாய்…',
  'மகிழ்ச்சியின் முகவரியாய்…',
  'அன்பின் முகவரியாய்…',
  'கனவுகளின் முகவரியாய்…',
  'அக்கறையின் முகவரியாய்…',
  'ஒற்றுமையின் முகவரியாய்…',
  'மதுரையின் முகவரியாய்…',
];

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
    </div>
  );
}

function SignupForm({ onSuccess }) {
  const [state, setState] = useState('form');
  const [word, setWord] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!word.trim()) newErrors.word = 'Required';
    if (!name.trim()) newErrors.name = 'Required';
    if (!email.trim()) {
      newErrors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setState('success');
    onSuccess(word);
  };

  if (state === 'success') {
    return (
      <div className={styles.successMessage}>
        <h2 className={styles.successHeading}>உங்கள் வார்த்தை பதிவாகிவிட்டது</h2>
        <p className={styles.successSubtitle}>
          Your word has been noted. We'll open the door soon.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>வீடுன்னா என்ன?</h2>
      <div className={styles.formGroup}>
        <div className={styles.inputWrapper}>
          <label className={styles.inputLabel}>Your answer (1-2 words)</label>
          <input
            className={styles.input}
            type="text"
            placeholder="e.g., நிம்மதி, அன்பு, கனவு"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
        </div>
        <div className={styles.inputWrapper}>
          <label className={styles.inputLabel}>Your name</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.inputWrapper}>
          <label className={styles.inputLabel}>Email</label>
          <input
            className={styles.input}
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <button className={styles.submitBtn} type="submit">
        Join the journey →
      </button>
    </form>
  );
}

export default function Home() {
  const [submittedWord, setSubmittedWord] = useState(null);
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScroll = (e) => {
    e.preventDefault();
    document.querySelector(`.${styles.formSection}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.taglineContainer}>
          {TAGLINES.map((tagline, i) => (
            <div
              key={i}
              className={styles.tagline}
              style={{
                opacity: i === taglineIndex ? 1 : 0,
                transitionDuration: '0.6s',
              }}
            >
              {tagline}
            </div>
          ))}
        </div>
        <div className={styles.subtitle}>
          Every home has a story. We're getting ready to share ours.
        </div>
        <button className={styles.ctaScroll} onClick={handleScroll}>
          Join the journey ↓
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
