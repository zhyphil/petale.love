import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://petale.app'),
  title: {
    default: 'petale — Portraits IA pour votre animal',
    template: '%s · petale',
  },
  description:
    'Transformez la photo de votre compagnon en portraits artistiques uniques. Essayez 3 portraits gratuits avant de payer. Satisfait ou remboursé 7 jours.',
  keywords: [
    'portrait animal IA',
    'photo animal IA',
    'IA pet portrait',
    'pet memorial',
    'chat chien portrait',
    'cadeau animal',
    'photo souvenir animal',
  ],
  authors: [{ name: 'petale' }],
  creator: 'petale',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    title: 'petale — Portraits IA pour votre animal',
    description:
      'Transformez la photo de votre compagnon en portraits artistiques uniques. 3 portraits gratuits avant de payer.',
    siteName: 'petale',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'petale — Portraits IA pour votre animal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'petale — Portraits IA pour votre animal',
    description: '3 portraits gratuits avant de payer. Satisfait ou remboursé.',
    creator: '@petale_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}