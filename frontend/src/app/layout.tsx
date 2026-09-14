import './globals.css';
import { PortalProvider } from '@/context/PortalContext';
import Navbar from '@/components/layout/Navbar';
import PageLoader from '@/components/layout/PageLoader';
import JoinModal from '@/components/modals/JoinModal';
import EventDetailModal from '@/components/modals/EventDetailModal';
import RecordingPlayerModal from '@/components/modals/RecordingPlayerModal';

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PortalProvider>
          <PageLoader />
          <Navbar />
          <main>{children}</main>
          <JoinModal />
          <EventDetailModal />
          <RecordingPlayerModal />
        </PortalProvider>
      </body>
    </html>
  );
}
