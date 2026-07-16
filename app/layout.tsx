// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Nhà Phố Sài Gòn - Bất động sản uy tín',
    template: '%s | Nhà Phố Sài Gòn'
  },
  description: 'Nhà Phố Sài Gòn - Chuyên mua bán bất động sản tại khu vực Sài Gòn. Căn hộ, nhà phố, biệt thự với giá tốt nhất.',
  keywords: 'bất động sản, nhà đất, mua bán nhà, căn hộ, Sài Gòn, nhà phố',
  authors: [{ name: 'Nhà Phố Sài Gòn' }],
  creator: 'Nhà Phố Sài Gòn',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://nhaphosaigon.com',
    siteName: 'Nhà Phố Sài Gòn',
    title: 'Nhà Phố Sài Gòn - Bất động sản uy tín',
    description: 'Chuyên mua bán bất động sản tại khu vực Sài Gòn.',
    images: [
      {
        url: 'https://nhaphosaigon.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nhà Phố Sài Gòn'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nhà Phố Sài Gòn - Bất động sản uy tín',
    description: 'Chuyên mua bán bất động sản tại khu vực Sài Gòn.',
    images: ['https://nhaphosaigon.com/og-image.jpg']
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
  verification: {
    google: 'your-google-verification-code', // Thay bằng code của bạn
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}