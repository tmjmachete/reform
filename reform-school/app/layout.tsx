import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SessionRefresh from '@/components/SessionRefresh';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reformpod.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 're:form — Faith, life, and finding our way back to God',
    template: '%s — re:form',
  },
  description:
    'A Seventh-day Adventist ministry: an honest conversation about faith and life, with a Bible journal, study notes on the 28 beliefs, and a Bible school.',
  icons: {
    icon: '/assets/favicon.ico',
    apple: '/assets/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 're:form',
    url: siteUrl,
    title: 're:form — Faith, life, and finding our way back to God',
    description:
      'A Seventh-day Adventist ministry: an honest conversation about faith and life, with a Bible journal, study notes on the 28 beliefs, and a Bible school.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 're:form' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 're:form — Faith, life, and finding our way back to God',
    description:
      'A Seventh-day Adventist ministry: podcast, journal, 28 beliefs study, and a Bible school.',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SessionRefresh />
        <Nav />
        <div className="page-body" id="main">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
