import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://reformpod.vercel.app'),
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
    url: 'https://reformpod.vercel.app',
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
        <Nav />
        <div className="page-body" id="main">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
