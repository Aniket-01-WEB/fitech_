'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePortal } from '@/context/PortalContext';
import { splitEvents, bannerUrl } from '@/lib/events';

export default function ActivitiesSection() {
  const { events, eventsError, openDetailModal } = usePortal();
  // The scroll target must exist on first render, so it's the section —
  // the featured image is conditional (no events -> no image).
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.0]);

  const { upcoming: upcomingEvents } = splitEvents(events);

  const featuredUpcoming = upcomingEvents[0] || null;
  const secondaryUpcoming = upcomingEvents.slice(1);

  return (
    <section ref={sectionRef} id="events" className="relative w-full bg-[#FFFFFF] py-14 md:py-20 lg:py-24 border-b border-[#DADADA]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Marker */}
        <div className="flex items-center justify-between pb-4 mb-8 sm:mb-10 border-b border-[#DADADA] font-mono text-[11px] text-[#6B6B6B] tracking-wider uppercase">
          <span>RESEARCH BULLETIN & CALENDAR</span>
          <span>{upcomingEvents.length} UPCOMING</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 sm:mb-8">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#EAEAEA] text-[#0A0A0A] font-mono text-[10px] uppercase tracking-wider inline-block mb-4">
              BULLETIN
            </span>
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#0A0A0A] tracking-tight leading-[0.92]">
              Symposia &
              <br />
              <span className="italic">Masterclasses.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4A4A4A] font-sans-body max-w-md leading-relaxed font-light">
            Institutional research seminars, algorithmic workshops, and quantitative development sessions at Adamas University.
          </p>
        </div>

        {/* Featured Upcoming Symposium Plate */}
        {featuredUpcoming ? (
          <div 
            className="relative bg-[#F2F2F2] rounded-3xl border border-[#DADADA] p-6 sm:p-10 md:p-12 mb-8 overflow-hidden group"
            style={{ boxShadow: '0 20px 50px rgba(30,30,30,0.05)' }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#DADADA] font-mono text-xs text-[#6B6B6B]">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#059669]"></span>
                <span className="font-bold text-[#0A0A0A] uppercase tracking-wider">
                  NEXT UP{featuredUpcoming.type ? ` // ${featuredUpcoming.type}` : ''}
                </span>
              </div>
              {featuredUpcoming.venue && <span className="uppercase">VENUE: {featuredUpcoming.venue}</span>}
            </div>

            {/* Media plate */}
            <div 
              className="relative w-full aspect-[16/7] md:aspect-[21/8] rounded-2xl overflow-hidden bg-[#0A0A0A] mb-8 border border-[#DADADA]"
            >
              <motion.img
                style={{ scale: imageScale }}
                src={bannerUrl(featuredUpcoming.banner)}
                alt={featuredUpcoming.title}
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#0A0A0A]/80 text-[#FFFFFF] font-mono text-[10px] uppercase tracking-wider backdrop-blur-md">
                {featuredUpcoming.type || 'Event'}
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8">
                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0A0A0A] leading-tight mb-4">
                  {featuredUpcoming.title}
                </h3>
                {featuredUpcoming.description && (
                  <p className="font-sans-body text-sm sm:text-base text-[#4A4A4A] leading-relaxed max-w-2xl font-light">
                    {featuredUpcoming.description}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-6 font-mono text-xs text-[#6B6B6B]">
                  {featuredUpcoming.time && (
                    <div>
                      <span className="text-[10px] text-[#8A8A8A] block uppercase">WHEN:</span>
                      <span className="font-bold text-[#0A0A0A]">{featuredUpcoming.time}</span>
                    </div>
                  )}
                  {featuredUpcoming.venue && (
                    <div>
                      <span className="text-[10px] text-[#8A8A8A] block uppercase">LOCATION:</span>
                      <span className="font-bold text-[#0A0A0A]">{featuredUpcoming.venue}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <button
                  type="button"
                  onClick={() => openDetailModal(featuredUpcoming)}
                  className="stanzza-btn-pill stanzza-btn-dark px-8 py-4"
                >
                  <span>View Event Details</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#DADADA] p-8 sm:p-12 text-center mb-8">
            <p className="font-mono text-xs uppercase tracking-wider text-[#6B6B6B]">
              {eventsError ? 'Events could not be loaded right now.' : 'No upcoming events'}
            </p>
          </div>
        )}

        {/* Secondary Sessions List */}
        {secondaryUpcoming.length > 0 && (
          <div className="space-y-4 mb-8">
            <h4 className="font-mono text-xs font-bold text-[#6B6B6B] uppercase tracking-wider mb-4">
              ADDITIONAL SCHEDULED SESSIONS
            </h4>
            <div className="divide-y divide-[#DADADA] border-t border-b border-[#DADADA]">
              {secondaryUpcoming.map((event) => (
                <div
                  key={event.id}
                  onClick={() => openDetailModal(event)}
                  className="group py-6 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl hover:bg-[#F2F2F2] transition-all cursor-pointer"
                >
                  <div className="flex items-baseline gap-4">
                    {event.time && (
                      <span className="font-mono text-xs font-bold text-[#6B6B6B]">
                        {event.time} {"//"}
                      </span>
                    )}
                    <h5 className="font-serif text-2xl text-[#0A0A0A] group-hover:underline">
                      {event.title}
                    </h5>
                  </div>
                  <span className="font-mono text-xs text-[#0A0A0A] font-semibold flex items-center gap-1 transition-transform">
                    <span>VIEW DETAILS</span>
                    <span>→</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
