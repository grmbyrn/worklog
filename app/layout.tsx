import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Nav from './components/Nav';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXTAUTH_URL ??
  "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "Worklog",
    template: "%s | Worklog",
  },
  description: "Track Your Billable Hours",

  metadataBase: new URL(siteUrl),

  openGraph: {
    title: "Worklog",
    description: "Track Your Billable Hours",
    siteName: "Worklog",
    type: "website",
    locale: "en_US",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Worklog — Track Your Billable Hours",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Worklog",
    description: "Track Your Billable Hours",
    images: [`${siteUrl}/og-image.png`],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  alternates: {
    canonical: "/",
  },
};

// ----------------------
// Structured Data (JSON-LD)
// ----------------------
function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Worklog",
    url: siteUrl,
    publisher: {
      "@type": "Organization",
      name: "Worklog",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image.png`,
      },
      sameAs: [
        "https://www.linkedin.com/in/your-profile",
        "https://github.com/your-profile",
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}

// ----------------------
// Root Layout
// ----------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Nav />
          {children}
          <JsonLd />
        </Providers>
      </body>
    </html>
  );
}
