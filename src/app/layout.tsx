import type { Metadata, Viewport } from 'next';
import { NestWorthProvider } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'NestWorth',
  description:
    'Household net worth tracker built for couples. Full transparency, shared goals, smart savings.',
  applicationName: 'NestWorth',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NestWorth',
  },
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/icon-192.png',
  },
  referrer: 'no-referrer',
  other: {
    'Permissions-Policy':
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#1a5e3a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="emerald" suppressHydrationWarning>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'"
        />
      </head>
      <body className="min-h-dvh">
        <NestWorthProvider>{children}</NestWorthProvider>
      </body>
    </html>
  );
}
