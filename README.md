# Mugavariyai — Home Awaits

A Tamil community launch landing page with a live countdown to July 4, 2026. Collect meaningful words from visitors as they join the journey.

## Tech Stack

- **Next.js 16.2.9** (App Router)
- **React 19.2.4**
- **GSAP 3.15.0** + TextPlugin (typewriter animations)
- **Lucide React** (icon library)
- **CSS Modules** + CSS custom properties (design tokens)
- **Zoho ZeptoMail** (transactional email)
- **Google Tag Manager** (GTM-WFT3JSDX)

## Getting Started

### Prerequisites
- Node.js 24 LTS or later
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Copy environment template and fill in your values
cp .env.local.example .env.local
# Edit .env.local with your ZeptoMail API key and admin email

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Required for local development and production:

| Variable | Description |
|---|---|
| `ZOHO_ZEPTO_API_KEY` | Zoho ZeptoMail API key for sending emails |
| `ADMIN_EMAIL` | Email address to receive submission notifications |

See `.env.local.example` for a template.

## Project Structure

```
src/app/
├── page.js                    # Main landing page
├── layout.js                  # Root layout, fonts, GTM, metadata
├── globals.css                # CSS reset + design tokens
├── page.module.css            # Component styles
└── api/
    └── submit-form/
        └── route.js           # Form submission API

public/
├── robots.txt                 # Allow all bots
├── sitemap.xml                # Homepage sitemap
├── llms.txt                   # LLM-friendly site info
├── llms-full.txt              # AI bot documentation
└── ai.txt                     # AI access policy

submission_counter.json        # Live submission count (starts at 101)
next.config.mjs                # Next.js configuration
```

## Key Features

### Animated Taglines
- GSAP typewriter effect cycles through 7 Tamil taglines
- 3.5 seconds per tagline, 6.5 second rotation
- Respects `prefers-reduced-motion` accessibility preference

### Live Countdown
- Real-time countdown to July 4, 2026
- Accessible with `role="timer"` and ARIA labels

### Community Signup Form
- Collects: 1-2 word answer, name, email
- Honeypot spam prevention
- Real-time validation (letters + spaces)
- Server-side validation + rate limiting (3 per IP per 10 min)
- Submission counter: "N curious minds joined"

### Advanced Tracking
- UTM parameters (source, medium, campaign, content, term)
- Referrer attribution (URL, source type, organic/referral flag)
- Analytics IDs (Google Analytics, Facebook Pixel from cookies)
- IP address (via ipify.org)
- All URL query parameters
- ISO timestamp

### Email Notifications
- Confirmation to user
- Admin notification with full data
- HTML-escaped user input (XSS prevention)
- Powered by Zoho ZeptoMail

### Security
- Per-IP rate limiting (429 on excess)
- HTML-escaped user data in emails
- No PII in console logs
- Security headers configured
- Honeypot anti-bot field

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

## Important Notes

### Submission Counter
- Stored in `submission_counter.json` (starts at 101)
- **On serverless**: In-memory counter resets on cold starts — migrate to persistent storage for production

### OG Image
- Referenced as `public/og-image.png` (1200×630px)
- **Currently missing** — add this file for social card previews

### Development Guidelines
- Use CSS Modules only (no Tailwind)
- Design tokens in `globals.css`
- Plain `.js` files (no TypeScript)
- Form validation: mirror client-side rules server-side
- Escape all user input before HTML emails

## Deployment

### Vercel (Recommended)
```bash
vercel deploy         # Deploy to staging
vercel --prod         # Deploy to production
```

Set environment variables in Vercel dashboard.

### Other Platforms
Ensure Node.js 24+ runtime and set environment variables.
