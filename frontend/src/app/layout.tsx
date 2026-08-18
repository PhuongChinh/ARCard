import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ARCard - Augmented Reality Card System',
  description: 'Create and manage AR experiences with QR codes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
