import './globals.css';
import { Instrument_Serif, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { PortalProvider } from '@/context/PortalContext';
import Navbar from '@/components/layout/Navbar';
import PageLoader from '@/components/layout/PageLoader';
import JoinModal from '@/components/modals/JoinModal';
import EventDetailModal from '@/components/modals/EventDetailModal';
import RecordingPlayerModal from '@/components/modals/RecordingPlayerModal';
import SmoothScroll from '@/components/layout/SmoothScroll';
import { ToastProvider } from '@/components/layout/Toast';
import ScrollReveal from '@/components/layout/ScrollReveal';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'FITECH | Quantitative Finance & Financial Engineering Society',
  description: 'Adamas University FinTech & Quantitative Engineering Society. Engineering the future of algorithmic trading, decentralized protocols, risk engines, and AI in finance.',
  keywords: ['FITECH', 'FinTech', 'Quantitative Finance', 'Algo Trading', 'DeFi', 'Financial Engineering', 'Adamas University'],
  openGraph: {
    title: 'FITECH FinTech Society',
    description: 'Engineering the Future of Financial Technology & Quantitative Systems.',
    url: 'https://fitech.club',
    siteName: 'FITECH FinTech Society',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased overflow-x-hidden">
        <ToastProvider>
        <PortalProvider>
          <SmoothScroll>
            <PageLoader />
            <ScrollReveal />
            <Navbar />
            <main className="w-full overflow-x-hidden">{children}</main>
            <JoinModal />
            <EventDetailModal />
            <RecordingPlayerModal />
          </SmoothScroll>
        </PortalProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
