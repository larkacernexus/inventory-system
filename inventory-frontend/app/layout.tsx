import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Inventory System',
  description: 'Inventory management with Laravel + Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}