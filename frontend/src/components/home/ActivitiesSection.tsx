'use client';

import React from 'react';
import { usePortal } from '@/context/PortalContext';

export default function ActivitiesSection() {
  const { events, openDetailModal } = usePortal();

  // Filter real Super-Admin approved events
  const approvedEvents = events.filter((evt) => (evt.status || 'approved') === 'approved');
  const upcomingEvents = approvedEvents.filter(
    (evt) => !evt.title?.toLowerCase().includes('2025') && !evt.title?.toLowerCase().includes('past')
  );
  const pastEvents = approvedEvents.filter(
    (evt) => evt.title?.toLowerCase().includes('2025') || evt.title?.toLowerCase().includes('past')
  );

  const featuredUpcoming = upcomingEvents[0] || null;
  const secondaryUpcoming = upcomingEvents.slice(1);

  return (
    <section id="events" className="relative w-full bg-[#F7F7F5] py-24 md:py-36 lg:py-44 border-b border-[#DCDCD8]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Index Marker */}
        <div className="flex items-center justify-between pb-4 mb-14 sm:mb-20 border-b border-[#DCDCD8] font-mono text-[11px] text-[#707070] tracking-wider uppercase">
          <span>[ SECTION 03 // RESEARCH BULLETIN & CALENDAR ]</span>
          <span>SCHEDULE OF ACTIVITIES // 2026</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div>
            <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider block mb-2">
              03 / BULLETIN
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#111111] uppercase tracking-tight leading-none">
              SCHEDULE
              <br />
              OF ACTIVITIES
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#555555] font-sans max-w-md leading-relaxed">
            Institutional research seminars, algorithmic workshops, and quantitative development sessions at Adamas University.
          </p>
        </div>

        {/* FEATURED UPCOMING EVENT: Large Editorial Visual Block */}
        {featuredUpcoming ? (
          <div 
            className="relative border border-[#DCDCD8] bg-[#FFFFFF] p-8 sm:p-12 md:p-16 mb-16"
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}
          >
            {/* Corner Registration Marks */}
            <span className="absolute -top-2.5 -left-2.5 font-mono text-xs text-[#999999] select-none">┼</span>
            <span className="absolute -top-2.5 -right-2.5 font-mono text-xs text-[#999999] select-none">┼</span>
            <span className="absolute -bottom-2.5 -left-2.5 font-mono text-xs text-[#999999] select-none">┼</span>
            <span className="absolute -bottom-2.5 -right-2.5 font-mono text-xs text-[#999999] select-none">┼</span>

            {/* Top Metadata Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-8 border-b border-[#ECECE8] font-mono text-xs text-[#555555]">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 bg-[#059669]"></span>
                <span className="font-bold text-[#111111] uppercase tracking-wider">
                  {featuredUpcoming.type || 'FLAGSHIP EVENT'}
                </span>
              </div>
              <span>BULLETIN REF: 2026.FT-EVT</span>
            </div>

            {/* Event Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-8">
                <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] leading-tight tracking-tight uppercase">
                  {featuredUpcoming.title}
                </h3>

                <p className="mt-6 text-sm sm:text-base text-[#555555] font-sans leading-relaxed max-w-3xl">
                  {featuredUpcoming.description}
                </p>

                {/* Structured Metadata Ledger */}
                <div className="mt-10 pt-8 border-t border-[#ECECE8] grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono text-xs">
                  <div>
                    <span className="text-[#707070] text-[10px] block uppercase tracking-wide">DATE</span>
                    <span className="font-bold text-[#111111] mt-1 block text-sm">
                      {featuredUpcoming.time?.split('•')[0] || 'TBA'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#707070] text-[10px] block uppercase tracking-wide">TIME</span>
                    <span className="font-bold text-[#111111] mt-1 block text-sm">
                      {featuredUpcoming.time?.split('•')[1] || '10:00 AM IST'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#707070] text-[10px] block uppercase tracking-wide">LOCATION</span>
                    <span className="font-bold text-[#111111] mt-1 block text-sm truncate">
                      {featuredUpcoming.venue || 'Adamas University'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#707070] text-[10px] block uppercase tracking-wide">DOMAIN</span>
                    <span className="font-bold text-[#111111] mt-1 block text-sm truncate">
                      {featuredUpcoming.domain || 'QUANT × TECH'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right CTA Column */}
              <div className="lg:col-span-4 flex flex-col justify-between h-full pt-4 lg:pt-0">
                <div className="hidden lg:block font-mono text-[11px] text-[#707070] space-y-1.5 mb-8">
                  <div>ADMISSIONS: OPEN TO MEMBERS</div>
                  <div>SEATING: RESERVED CAPACITY</div>
                  <div>ACCESS: STUDENT CHAPTER</div>
                </div>

                <button
                  type="button"
                  onClick={() => openDetailModal(featuredUpcoming)}
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#111111] text-[#FFFFFF] font-mono text-xs font-bold uppercase tracking-wider border border-[#111111] shadow-[4px_4px_0px_#707070] hover:shadow-[6px_6px_0px_#111111] hover:-translate-y-0.5 active:translate-y-0.5 transition-all text-center"
                >
                  <span>[ VIEW DETAILS & REGISTER ]</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State for Upcoming Events */
          <div className="border border-[#DCDCD8] bg-[#FFFFFF] p-12 text-center mb-16 font-mono">
            <span className="inline-block w-2 h-2 bg-[#707070] mb-3"></span>
            <h3 className="font-heading font-black text-xl text-[#111111] uppercase tracking-tight">
              NO PUBLIC SYMPOSIUM SCHEDULED AT THIS TIME
            </h3>
            <p className="mt-2 text-xs text-[#555555] max-w-md mx-auto leading-relaxed">
              Internal research groups and algorithmic development cohorts are actively in session. Check back for upcoming flagship announcements.
            </p>
          </div>
        )}

        {/* Secondary Upcoming Events (if any) */}
        {secondaryUpcoming.length > 0 && (
          <div className="mb-14">
            <div className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider mb-4 pb-2 border-b border-[#DCDCD8]">
              ADDITIONAL SCHEDULED SESSIONS [{secondaryUpcoming.length}]
            </div>
            <div className="border border-[#DCDCD8] bg-[#FFFFFF] divide-y divide-[#ECECE8]">
              {secondaryUpcoming.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => openDetailModal(evt)}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFAF8] cursor-pointer transition-colors"
                >
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[#111111] bg-[#F1F2F0] px-2 py-0.5 border border-[#DCDCD8] uppercase">
                      {evt.type || 'SESSION'}
                    </span>
                    <h4 className="font-heading font-bold text-base sm:text-lg text-[#111111] mt-1.5">
                      {evt.title}
                    </h4>
                    <span className="font-mono text-xs text-[#555555] mt-1 block">
                      {evt.time} • {evt.venue}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#111111] hover:underline shrink-0">
                    VIEW DETAILS →
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAST EVENTS: Compact Rows Below */}
        <div className="pt-8 border-t border-[#DCDCD8]">
          <div className="flex items-center justify-between font-mono text-xs text-[#707070] uppercase tracking-wider mb-4 pb-2 border-b border-[#DCDCD8]">
            <span>ARCHIVE RECORD [{pastEvents.length}]</span>
            <span>COMPLETED WORKING SESSIONS</span>
          </div>

          {pastEvents.length > 0 ? (
            <div className="border border-[#DCDCD8] bg-[#FFFFFF] divide-y divide-[#ECECE8]">
              {pastEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => openDetailModal(evt)}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFAF8] cursor-pointer transition-colors group"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <span className="font-mono text-xs font-bold text-[#707070] group-hover:text-[#111111]">
                      ARCHIVED
                    </span>
                    <div>
                      <h4 className="font-heading font-bold text-base text-[#111111] group-hover:underline">
                        {evt.title}
                      </h4>
                      <span className="font-mono text-xs text-[#555555]">
                        {evt.time} • {evt.venue}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#707070] group-hover:text-[#111111] shrink-0">
                    ACCESS TRANSCRIPT →
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-[#DCDCD8] bg-[#FFFFFF] p-8 text-center font-mono text-xs text-[#707070]">
              NO ARCHIVED EVENTS DOCUMENTED YET.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
