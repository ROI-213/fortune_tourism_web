import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, buildWhatsAppUrl } from "@/lib/contact";
import { NAV } from "@/data/site";
import { destinations } from "@/data/destinations";
import { WhatsAppIcon } from "./Header";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 bg-[color:var(--color-navy)] text-[color:var(--color-cream)]">
      <div className="container-fortune grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--color-gold)] font-heading text-lg font-bold text-[color:var(--color-navy)]">F</span>
            <span className="font-heading text-lg">Fortune Tourism</span>
          </div>
          <p className="mt-4 max-w-xs text-sm opacity-80">
            Chauffeur-driven cars and curated tour packages across Karnataka, Andhra Pradesh, Tamil Nadu, Kerala and Puducherry — starting from Bengaluru.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={CONTACT.phoneHref} className="rounded-full border border-white/25 p-2" aria-label="Call">
              <Phone className="h-4 w-4" />
            </a>
            <a href={buildWhatsAppUrl()} target="_blank" rel="noreferrer noopener" className="rounded-full bg-[color:var(--color-emerald)] p-2" aria-label="WhatsApp">
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            <a href={`mailto:${CONTACT.email}`} className="rounded-full border border-white/25 p-2" aria-label="Email">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-[color:var(--color-gold)]">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="opacity-80 hover:opacity-100 hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-[color:var(--color-gold)]">Destinations</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {destinations.map((d) => (
              <li key={d.slug} className="opacity-80">
                {d.state}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-[color:var(--color-gold)]">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm opacity-90">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0" /> <span>{CONTACT.phone}</span></li>
            <li className="flex items-start gap-2"><WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0" /> <span>WhatsApp bookings</span></li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0" /> <span>{CONTACT.email}</span></li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> <span>{CONTACT.address}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-fortune flex flex-col items-start justify-between gap-2 py-5 text-xs opacity-70 md:flex-row md:items-center">
          <p>© {year} Fortune Tourism. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}