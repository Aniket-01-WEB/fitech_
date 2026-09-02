import './globals.css';
import { PortalProvider } from '@/context/PortalContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
   page flashing for a frame before the intro can cover it. Blacks the page out
   and hides the body (see globals.css) so the intro is the first thing seen.
   The intro is the site's loading screen now, so this runs on every page load
   and every route: no pathname test, no once-per-session key.
   The timeout is a failsafe: if the bundle never boots, the page still appears. */
const INTRO_BOOT = `try{var d=document.documentElement;d.classList.add('money-intro-active');setTimeout(function(){d.classList.remove('money-intro-active')},6000)}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT }} />
        <PortalProvider>
          <MoneyIntro />
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
