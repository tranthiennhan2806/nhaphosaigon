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
  description: 'Nhà Phố Sài Gòn - Chuyên mua bán bất động sản tại khu vực Sài Gòn.',
  // KHÔNG set openGraph ở đây để không override trang detail
  // Chỉ set các meta cơ bản
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        {/* Meta tags mặc định cho toàn site */}
        <meta property="og:site_name" content="Nhà Phố Sài Gòn" />
        <meta property="og:locale" content="vi_VN" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}