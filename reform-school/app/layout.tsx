import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://reformpod.vercel.app'),
  title: 're:form School — Study the Word, deeply',
  description:
    'A Bible school from re:form. Guided courses, video lessons, written notes, downloadable studies, and live sessions — rooted in Scripture and the Seventh-day Adventist message.',
  icons: {
    icon: '/school/assets/favicon.ico',
    apple: '/school/assets/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 're:form',
    title: 're:form School — Study the Word, deeply',
    description:
      'Guided Bible courses, video lessons, written notes, and live sessions — rooted in Scripture.',
    url: 'https://reformpod.vercel.app/school',
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
