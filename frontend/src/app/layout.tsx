import "./globals.css";
import type { Metadata, Viewport } from "next";
import {
  SITE_DESCRIPTION as SUMMARY,
  SITE_TAGLINE as TAGLINE,
  SITE_URL,
} from "@/lib/site";
import {
  Instrument_Serif,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from "next/font/google";
import { PortalProvider } from "@/context/PortalContext";
import Navbar from "@/components/layout/Navbar";
import PageLoader from "@/components/layout/PageLoader";
import JoinModal from "@/components/modals/JoinModal";
import EventDetailModal from "@/components/modals/EventDetailModal";
import RecordingPlayerModal from "@/components/modals/RecordingPlayerModal";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { ToastProvider } from "@/components/layout/Toast";
import ScrollReveal from "@/components/layout/ScrollReveal";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Fincoders | ${TAGLINE}`,
    // Child routes set just their own name, e.g. "Events | Fincoders".
    template: "%s | Fincoders",
  },
  description: SUMMARY,
  applicationName: "Fincoders",
  category: "education",
  keywords: [
    "Fincoders",
    "FinTech",
    "Quantitative Finance",
    "Algorithmic Trading",
    "Financial Engineering",
    "Risk Modelling",
    "DeFi",
    "Decentralized Protocols",
    "Student Research Society",
    "Adamas University",
    "SOET",
    "Kolkata",
  ],
  authors: [{ name: "Fincoders", url: SITE_URL }],
  creator: "Fincoders",
  publisher: "Fincoders",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Fincoders",
    title: `Fincoders | ${TAGLINE}`,
    description: SUMMARY,
    url: SITE_URL,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `Fincoders | ${TAGLINE}`,
    description: SUMMARY,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased overflow-x-clip">
        <ToastProvider>
          <PortalProvider>
            <SmoothScroll>
              <PageLoader />
              <ScrollReveal />
              <Navbar />
              <main className="w-full overflow-x-clip">{children}</main>
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
