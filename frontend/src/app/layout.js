import './globals.css';
import { PortalProvider } from '@/context/PortalContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageLoader from '@/components/PageLoader';
import MoneyIntro from '@/components/MoneyIntro';
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

/* Runs before the browser paints anything, which is the only way to stop the
   MATRIX PageLoader flashing for a frame on a first visit. Blacks the page out
   and hides the body (see globals.css) so the intro is the first thing seen.
   The timeout is a failsafe: if the bundle never boots, the page still appears. */
const INTRO_BOOT = `try{if(location.pathname==='/'&&sessionStorage.getItem('matrix_intro_seen')!=='1'){var d=document.documentElement;d.classList.add('money-intro-ran','money-intro-active');setTimeout(function(){d.classList.remove('money-intro-active')},6000)}}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT }} />
        <PortalProvider>
          <MoneyIntro />
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
