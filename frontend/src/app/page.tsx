'use client';

import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import ShowcaseSection from '@/components/home/ShowcaseSection';
import CommunitiesSection from '@/components/home/CommunitiesSection';
import DomainsSection from '@/components/home/DomainsSection';
import ActivitiesSection from '@/components/home/ActivitiesSection';
import TrustedBySection from '@/components/home/TrustedBySection';
import QuoteSection from '@/components/home/QuoteSection';
import TeamSection from '@/components/home/TeamSection';
import GallerySection from '@/components/home/GallerySection';
import FaqSection from '@/components/home/FaqSection';
import CtaSection from '@/components/home/CtaSection';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="relative w-full max-w-full overflow-x-hidden bg-[#FFFFFF] text-[#0A0A0A] selection:bg-[#0A0A0A] selection:text-[#FFFFFF]">
      {/* 01: Hero Section (From code to capital. Expanding aperture.) */}
      <HeroSection />

      {/* 02: Mandate & Composition (A guild is a composition + 4 floating plates) */}
      <AboutSection />

      {/* 03: Flagship Systems (Apartment-style interactive codebases) */}
      <ShowcaseSection />

      {/* 04: Controlled Delivery (4 large stat cards + 4 pillars) */}
      <CommunitiesSection />

      {/* 05: Architectural Thinking (6 Operational disciplines) */}
      <DomainsSection />

      {/* 06: Symposia Bulletin & Calendar */}
      <ActivitiesSection />

      {/* 07: Consortium Marquee (Built together with) */}
      <TrustedBySection />

      {/* 08: Keynote Editorial Quote */}
      <QuoteSection />

      {/* 09: People Index & Leadership Directory */}
      <TeamSection />

      {/* 10: Moments from the Lab (Photographic archive) */}
      <GallerySection />

      {/* 11: Frequently Asked Questions (Stanzza accordion) */}
      <FaqSection />

      {/* 12: Accession & Conversation CTA (Start with a conversation) */}
      <CtaSection />

      {/* 13: Editorial Colophon & Footer */}
      <Footer />
    </div>
  );
}
