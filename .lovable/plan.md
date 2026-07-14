
# Fortune Tourism — Rebuild Plan

Full redesign of the current project into a premium South India tourism + car-rental site. No backend enabled; all data as typed mock modules ready to swap for Lovable Cloud later.

## Design system (src/styles.css)
- Palette tokens (oklch): navy `#0B1F3A` (primary), emerald `#0E6B50` (accent-nature), gold `#D6A84B` (accent-premium, sparingly), cream `#F8F5EF` (background), charcoal `#20242A` (foreground), light grey `#EEF1F4` (muted), white.
- Fonts via `<link>` in `__root.tsx`: Playfair Display (headings), Manrope (body).
- Utilities: `.story-link` underline, `.hover-lift`, `.reveal-up` (fade + translate), reduced-motion guard.
- Keep shadcn tokens mapped in `@theme inline`.

## Global layout
- `src/components/site/Header.tsx` — transparent → solid on scroll, sticky, desktop nav + Call/WhatsApp buttons, mobile slide-in menu with large touch targets, active route indicator, hover underline.
- `src/components/site/Footer.tsx` — multi-column: brand, quick links, services, destinations, contact, socials, legal, copyright. Optional single-line enquiry field.
- `src/components/site/FloatingContact.tsx` — sticky Call + WhatsApp on mobile, non-blocking.
- `src/components/site/WhatsAppButton.tsx` — helper that builds structured pre-filled messages from `{vehicle, package, pickup, destination, date, pax}`.
- `src/routes/__root.tsx` — head metadata, fonts, Header/Footer wrapper, `<Outlet />`, reduced-motion respect.

## Routes (TanStack file-based)
```
src/routes/
  __root.tsx
  index.tsx                      -> Home
  car-rentals.tsx                -> /car-rentals (list + filters)
  car-rentals.$vehicleId.tsx     -> Vehicle Details
  tour-packages.tsx              -> /tour-packages (list + filters)
  tour-packages.$packageId.tsx   -> Package Details
  airport-transfer.tsx           -> /airport-transfer
  services.tsx                   -> /services
  contact.tsx                    -> /contact
  admin.tsx                      -> /admin (mock dashboard, no auth yet)
  sitemap[.]xml.ts               -> keep, extend with new routes
```
Each route has its own `head()` with unique title / description / og:title / og:description. Leaf pages set `og:image` from their hero.

## Home page sections
1. Hero carousel — 5 slides (Karnataka, AP, TN, Kerala, Puducherry). Cross-fade + subtle ken-burns zoom, staggered label→heading→quote→buttons reveal. ~7s per slide, pause on interaction, swipe on mobile, arrows + progress bar + slide number. Only slide 1 hero image is preloaded.
2. Quick enquiry form overlapping hero bottom — horizontal desktop / stacked mobile; validated with zod; WhatsApp + Get Quote actions.
3. Services overview — 6 refined icon cards.
4. Explore South India — 5 destination cards, staggered/asymmetric grid (card 1 and 4 larger).
5. Featured tour packages — 6 image-first cards with View Details + WhatsApp.
6. Fleet preview — 7 vehicle categories, horizontal snap slider on mobile.
7. Animated route — stylised SVG route line Bengaluru → Mysuru → Coorg → Ooty → Tirupati → Munnar → Puducherry with markers, `stroke-dasharray` draw-in on scroll.
8. Why choose us — split image + 6 trust points.
9. How booking works — 4-step animated timeline.
10. Testimonials — manual slider, no aggressive autoplay.
11. FAQ — single-open accordion.
12. Final CTA — scenic background, WhatsApp + Call.

## Other pages
- **Car Rentals**: category chips, vehicle grid, mobile filter drawer, each card → Vehicle Details.
- **Vehicle Details**: gallery, specs, use cases, pricing note, enquiry + WhatsApp with vehicle pre-filled.
- **Tour Packages**: destination filter chips (5 states), package grid, mobile filter drawer.
- **Package Details**: hero, day-wise itinerary accordion, inclusions/exclusions, vehicle options, enquiry + WhatsApp.
- **Airport Transfer**: pickup/drop form, vehicle options, fixed-route highlights, FAQ subset.
- **Services**: expanded version of the 10 service offerings with icons + descriptions.
- **Contact Us**: contact cards (phone/WhatsApp/email/address), enquiry form, embedded static map image (no heavy interactive map).
- **Admin Dashboard**: mock-only. Stats cards (enquiries, bookings, revenue), recent enquiries table, quick links. No auth, clearly labelled "Demo".

## Data (mock, typed, Cloud-ready)
```
src/data/
  destinations.ts   // 5 states + highlights + images
  packages.ts       // 6+ tour packages
  vehicles.ts       // 7 fleet items
  services.ts
  testimonials.ts
  faqs.ts
```
Each module exports typed arrays; page components import and render. Later swap importers for `createServerFn` / Supabase queries without changing UI.

## Forms
- All forms use `react-hook-form` + `zod`.
- Client-side validation, inline errors, loading state, success toast, submit-disabled while pending (duplicate protection), mobile-friendly input sizes.
- Submissions currently `console.log` + success state; hook point marked `// TODO: wire to backend`.

## Imagery
- Generate premium hero + destination + vehicle images into `public/images/` (state hero collages, 7 vehicles, 1 driver/why-us shot, 1 final-CTA road shot). Use existing generated destination images where possible; add missing ones.

## Animation rules
- Pure CSS transforms/opacity, respect `prefers-reduced-motion`, disable parallax under `md`, content visible without JS, no scroll-jacking, staggered reveals via CSS delays.

## SEO
- Unique `head()` per route; single H1 per page; semantic sections; alt text on all images; JSON-LD `TravelAgency` on Home and `TouristTrip` on package detail pages; canonical set via meta; sitemap updated.

## Out of scope for this pass
- Real backend, auth, payments, real map integration, i18n. Interfaces are structured so these can be added later without redesign.

## Deliverables order
1. Design tokens + fonts + Header/Footer/floating contact.
2. Root route + Home (all 12 sections) + mock data.
3. Car Rentals + Vehicle Details.
4. Tour Packages + Package Details.
5. Airport Transfer, Services, Contact.
6. Admin mock dashboard.
7. Sitemap + SEO polish + build verification.

Confirm and I'll start with step 1.
