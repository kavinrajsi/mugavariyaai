import { Geist_Mono, Raleway, Arima } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

const arima = Arima({
  variable: "--font-arima",
  subsets: ["latin", "tamil"],
  weight: ["400", "600", "700"],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://mugavariyai.com'),
  title: 'Mugavariyai - Home Awaits',
  description: 'Every home has a story. We\'re getting ready to share ours.',
  keywords: 'mugavariyai, home, community, tamil',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mugavariyai - Home Awaits',
    description: 'Every home has a story. We\'re getting ready to share ours.',
    url: '/',
    siteName: 'Mugavariyai',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        secureUrl: '/og-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Mugavariyai - Home Awaits',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mugavariyai - Home Awaits',
    description: 'Every home has a story. We\'re getting ready to share ours.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mugavariyai - Home Awaits',
      },
    ],
  },
  other: {
    'color-scheme': 'light',
  },
};

export default function RootLayout({ children }) {
  const GTM_ID = "GTM-WFT3JSDX";

  return (
    <html lang="en" className={`${raleway.variable} ${geistMono.variable} ${arima.variable}`}>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
