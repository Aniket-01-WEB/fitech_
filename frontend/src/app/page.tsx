'use client';

import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import DomainsSection from '@/components/home/DomainsSection';
import ActivitiesSection from '@/components/home/ActivitiesSection';
import ShowcaseSection from '@/components/home/ShowcaseSection';
import TeamSection from '@/components/home/TeamSection';
import CommunitiesSection from '@/components/home/CommunitiesSection';
import GallerySection from '@/components/home/GallerySection';
import CtaSection from '@/components/home/CtaSection';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="relative w-full bg-[#FFFFFF] text-[#111111] selection:bg-[#111111] selection:text-[#FFFFFF]">
      {/* 01: Hero Section */}
      <HeroSection />

      {/* 02: Mandate & Foundational Thesis (About) */}
      <AboutSection />

      {/* 03: Six Operational Dimensions (Domains Index Table) */}
      <DomainsSection />

      {/* 04: Research Bulletin & Schedule of Activities */}
      <ActivitiesSection />

      {/* 05: Applied Research & Lab Repositories (Lab Builds) */}
      <ShowcaseSection />

      {/* 06: Personnel Index & Leadership Roster */}
      <TeamSection />

      {/* 07: Institutional Advantage & Guild Matrix */}
      <CommunitiesSection />

      {/* 08: Field Notes & Photographic Contact Sheet */}
      <GallerySection />

      {/* 09: Typographic Accession Statement & Join CTA */}
      <CtaSection />

      {/* 10: Editorial Colophon & Directory Footer */}
      <Footer />
    </div>
  );
}
