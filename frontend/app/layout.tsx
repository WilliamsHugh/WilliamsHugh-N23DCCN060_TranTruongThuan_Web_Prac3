import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from './providers';
import Header from '@/components/Header';

const geist = Geist({ subsets: ['latin'] });
export const metadata: Metadata = { title: 'Fullstack Shop' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={geist.className}>
        <Providers>
          <Header />
          <main className="max-w-2xl mx-auto px-6 py-6">
            {children}
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '8px', fontSize: '14px' },
              success: {
                duration: 2500,
                style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' },
                iconTheme: { primary: '#16a34a', secondary: '#f0fdf4' },
              },
              error: {
                duration: 4000,
                style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
                iconTheme: { primary: '#dc2626', secondary: '#fef2f2' },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}