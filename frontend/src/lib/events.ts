import type { PortalEvent } from '@/context/PortalContext';

// Upcoming vs past is decided by the event's real date. An event with no
// date yet is treated as upcoming (it was announced, not archived).
export function isApproved(evt: PortalEvent): boolean {
  return (evt.status || 'approved') === 'approved';
}

export function splitEvents(events: PortalEvent[], now = Date.now()) {
  const approved = events.filter(isApproved);
  const upcoming = approved
    .filter((e) => e.eventTime == null || e.eventTime >= now)
    .sort((a, b) => (a.eventTime ?? Infinity) - (b.eventTime ?? Infinity));
  const past = approved
    .filter((e) => e.eventTime != null && e.eventTime < now)
    .sort((a, b) => (b.eventTime ?? 0) - (a.eventTime ?? 0));
  return { approved, upcoming, past };
}

// `banner` is free text an admin typed: an image URL, a CSS gradient, or
// nothing. Only a real URL is usable as an <img> source.
export function bannerUrl(banner: string | null | undefined, fallback = '/images/event-summit.jpg'): string {
  return banner && /^(https?:\/\/|\/)/.test(banner) ? banner : fallback;
}
