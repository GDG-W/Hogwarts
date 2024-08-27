import React from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import ReactQueryProvider from '@/lib/reactQuery/providers';
import { classNames } from '@/utils/classNames';
import localFont from 'next/font/local';
import { GeistSans } from 'geist/font/sans';
import '../styles/index.scss';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "DevFest Lagos'24 | Tickets",
  description: 'Get Early Bird Tickets',
  keywords: [
    'devfest',
    'devfest lagos',
    'tickets',
    'devfest 2024',
    'early bird tickets',
    'date',
    'venue',
  ],
  openGraph: {
    images: 'https://i.postimg.cc/q7GyC82C/opengraph-image.png',
  },
  // metadataBase: new URL('https://tickets.devfestlagos.com'),
};

const GeneralSans = localFont({
  src: [
    {
      path: '../fonts/GeneralSans-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/GeneralSans-Medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/GeneralSans-Semibold.woff',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/GeneralSans-Bold.woff',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--generalSans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={classNames(GeneralSans.variable, GeistSans.className)}>
      <body>
        <ReactQueryProvider>
          {/* Your layout content, including header, main content, footer, etc goes here. */}
          {children}
        </ReactQueryProvider>
      </body>
      <GoogleAnalytics gaId={`${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
    </html>
  );
}
