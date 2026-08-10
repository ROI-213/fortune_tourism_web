import { Phone, Home, Car, MapPinned } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { CONTACT, buildWhatsAppUrl } from "@/lib/contact";
import { WhatsAppIcon } from "./Header";

/**
 * Fixed bottom navigation bar for mobile — app-like UI with icons + labels,
 * 48px+ touch targets, safe-area padding, and smooth active transitions.
 * Hidden on md and up.
 */
export function FloatingContact() {
  const { pathname } = useLocation();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/90 backdrop-blur-xl shadow-[0_-8px_24px_-8px_rgba(11,31,58,0.15)] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 items-stretch">
        <BottomTab
          to="/"
          label="Home"
          icon={<Home className="h-5 w-5" />}
          active={isActive("/")}
        />
        <BottomTab
          to="/tour-packages"
          label="Tours"
          icon={<MapPinned className="h-5 w-5" />}
          active={isActive("/tour-packages")}
        />
        <BottomTab
          to="/car-rentals"
          label="Cars"
          icon={<Car className="h-5 w-5" />}
          active={isActive("/car-rentals")}
        />
        <BottomTabExternal
          href={CONTACT.phoneHref}
          label="Call"
          icon={<Phone className="h-5 w-5" />}
          tone="navy"
        />
        <BottomTabExternal
          href={buildWhatsAppUrl()}
          label="WhatsApp"
          icon={<WhatsAppIcon className="h-5 w-5" />}
          tone="emerald"
          external
        />
      </ul>
    </nav>
  );
}

function BottomTab({
  to,
  label,
  icon,
  active,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <li className="contents">
      <Link
        to={to}
        className={`group relative flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-medium transition-colors duration-300 active:scale-95 ${
          active
            ? "text-[color:var(--color-navy)]"
            : "text-muted-foreground hover:text-[color:var(--color-navy)]"
        }`}
      >
        <span
          className={`transition-transform duration-300 ${active ? "scale-110" : "group-active:scale-95"}`}
        >
          {icon}
        </span>
        <span className="leading-none">{label}</span>
        <span
          className={`absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[color:var(--color-gold)] transition-all duration-300 ${active ? "opacity-100" : "opacity-0"}`}
        />
      </Link>
    </li>
  );
}

function BottomTabExternal({
  href,
  label,
  icon,
  tone,
  external = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  tone: "navy" | "emerald";
  external?: boolean;
}) {
  const bg =
    tone === "emerald"
      ? "bg-[color:var(--color-emerald)]"
      : "bg-[color:var(--color-navy)]";
  return (
    <li className="contents">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        aria-label={label}
        className="flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-1.5 text-[11px] font-semibold text-[color:var(--color-navy)] transition active:scale-95"
      >
        <span
          className={`grid h-10 w-10 place-items-center rounded-full ${bg} text-[color:var(--color-cream)] shadow-md transition-transform duration-300 group-active:scale-95`}
        >
          {icon}
        </span>
        <span className="leading-none">{label}</span>
      </a>
    </li>
  );
}