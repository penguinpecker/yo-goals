import type { Metadata } from 'next';
import { Barlow } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-barlow',
});

export const metadata: Metadata = {
  title: 'YO Goals — DeFi Savings, Goal-Based',
  description: 'AI-optimized multi-vault savings strategies on Base. Powered by YO Protocol.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={barlow.variable}>
      <body style={{
        fontFamily: "var(--font-barlow), system-ui, sans-serif",
        background: '#D9D9D9',
        margin: 0,
      }}>
        <Providers>
          <div style={{
            maxWidth: 480,
            margin: '0 auto',
            position: 'relative',
            minHeight: '100vh',
            background: '#D9D9D9',
          }}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
