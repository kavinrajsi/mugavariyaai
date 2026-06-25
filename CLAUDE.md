@AGENTS.md

## Project: Mugavariyai

Tamil community launch landing page with countdown to July 4, 2026.

### Identity
- Pre-launch waitlist collecting meaningful words from community members
- Displays live submission counter ("N curious minds joined")
- Countdown timer to opening day

### Environment Setup
```bash
# Required environment variables in .env.local:
ZOHO_ZEPTO_API_KEY=your_zepto_api_key
ADMIN_EMAIL=your_admin_email@example.com

# Dev server
npm run dev  # http://localhost:3000
```

See `.env.local.example` for template.

### Critical Files
- `submission_counter.json` — Live counter persisting submissions (do NOT delete)
- `public/og-image.png` — Missing, referenced in OG metadata (1200×630px needed for social cards)
- `src/app/page.js` — Main page (TaglineRotator, CountdownTimer, SignupForm)
- `src/app/api/submit-form/route.js` — Form handler with rate limiting, validation, email
- `.env.local` — Must be present for local dev (not committed)

### Conventions
- **Styling**: CSS Modules only (`page.module.css`); design tokens in `globals.css` `:root`; no Tailwind, no inline styles except GSAP animations
- **No TypeScript** — all `.js` files
- **Form validation**: Mirror client-side rules (`page.js`) in server-side validation (`route.js`)
- **Email security**: All user data must pass through `escapeHtml()` before HTML email body

### What to Avoid
- ❌ Don't add npm packages without checking bundle impact (GSAP ~130KB already)
- ❌ Don't change GTM `strategy="afterInteractive"` back to `beforeInteractive` (blocks hydration)
- ❌ Don't log email, IP, referrer to console (removed for privacy)
- ❌ Don't modify or delete `submission_counter.json` outside the API handler
- ❌ Don't add Tailwind, UI component libraries, or TypeScript

### Key Implementation Details
- **Typewriter animation**: GSAP TextPlugin, 7 Tamil taglines, 3.5s type + 6.5s rotation
- **Submission counter**: Starts at 101, in-memory with file persistence (serverless cold-start note: migrates to DB/KV for scale)
- **Rate limiting**: 3 per IP per 10 minutes, returns 429
- **Tracking**: UTM params, referrer, GA/FB IDs, IP, all URL params, timestamp
- **Email service**: Zoho ZeptoMail (escapes all user data for security)

### Reference
- Full details: `README.md`
- Implementation plans: `.claude/plans/`
- Next.js notes: `AGENTS.md`
