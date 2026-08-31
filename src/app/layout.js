import './globals.css';
import { PortalProvider } from '@/context/PortalContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageLoader from '@/components/PageLoader';
import JoinModal from '@/components/JoinModal';
import EventDetailModal from '@/components/EventDetailModal';
import RecordingPlayerModal from '@/components/RecordingPlayerModal';

export const metadata = {
  title: 'MATRIX FinTech Club | Quantitative Finance & Financial Engineering Society',
  description: 'The premier quantitative finance and financial engineering research society. Engineering the future of algorithmic trading, DeFi protocols, risk engines, and AI in finance.',
  keywords: ['FinTech', 'Quantitative Finance', 'Algo Trading', 'DeFi', 'Financial Engineering', 'MATRIX Club'],
  openGraph: {
    title: 'MATRIX FinTech Club',
    description: 'Engineering the Future of Financial Tech.',
    url: 'https://matrix.club',
    siteName: 'MATRIX FinTech Club',
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
          <Footer />
          <JoinModal />
          <EventDetailModal />
          <RecordingPlayerModal />
        </PortalProvider>
      </body>
    </html>
  );
}
