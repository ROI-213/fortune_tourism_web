import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { NAV } from "@/data/site";
import { CONTACT, buildWhatsAppUrl } from "@/lib/contact";

const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.4 0 .04 5.36.04 11.98a11.94 11.94 0 0 0 1.6 5.98L0 24l6.2-1.62a11.98 11.98 0 0 0 5.82 1.48h.01c6.62 0 11.99-5.37 11.99-11.99 0-3.2-1.25-6.21-3.5-8.39ZM12.02 21.3h-.01a9.32 9.32 0 0 1-4.75-1.3l-.34-.2-3.68.96.98-3.58-.22-.37a9.32 9.32 0 0 1-1.43-4.83c0-5.15 4.19-9.34 9.35-9.34 2.5 0 4.85.97 6.62 2.74a9.29 9.29 0 0 1 2.74 6.61c0 5.16-4.19 9.35-9.26 9.35Zm5.35-7c-.29-.15-1.73-.85-2-.95-.27-.1-.47-.15-.66.15s-.76.95-.93 1.15c-.17.2-.34.22-.63.07-.29-.15-1.23-.45-2.35-1.44a8.87 8.87 0 0 1-1.64-2.02c-.17-.29 0-.44.13-.59.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.19-.24-.58-.48-.5-.66-.51h-.56c-.19 0-.5.07-.76.37s-1 .98-1 2.38 1.03 2.76 1.17 2.95c.15.2 2.02 3.08 4.9 4.32.68.29 1.22.47 1.63.6.68.22 1.3.19 1.79.11.55-.08 1.73-.71 1.97-1.4.24-.68.24-1.27.17-1.39-.07-.12-.26-.19-.55-.34Z"/>
  </svg>
);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const wa = buildWhatsAppUrl({ service: "General enquiry" });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = true;
  void scrolled;
  void isHome;

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 " +
        (solid
          ? "bg-primary text-primary-foreground shadow-md/40 backdrop-blur"
          : "bg-transparent text-primary-foreground")
      }
    >
      <div className="container-fortune flex h-14 flex-nowrap items-center justify-between gap-3 md:h-[72px]">
        <Link to="/" className="flex min-w-0 items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color:var(--color-gold)] font-heading text-base font-bold text-[color:var(--color-navy)]">
            F
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="font-heading text-base font-semibold tracking-tight whitespace-nowrap md:text-lg">Fortune Tourism</span>
            <span className="hidden text-[10px] uppercase tracking-[0.2em] opacity-80 sm:block">South India Travel</span>
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-6 whitespace-nowrap lg:flex xl:gap-8">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-underline text-sm font-medium opacity-90 hover:opacity-100"
              data-active={pathname === item.to}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={CONTACT.phoneHref}
            className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-white/25 px-3 py-1.5 text-sm font-medium hover:bg-white/10 md:inline-flex"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden items-center gap-2 whitespace-nowrap rounded-full bg-[color:var(--color-emerald)] px-3 py-1.5 text-sm font-medium text-[color:var(--color-cream)] hover:brightness-110 md:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
          <a href={CONTACT.phoneHref} className="rounded-full border border-white/25 p-2 md:hidden" aria-label="Call">
            <Phone className="h-5 w-5" />
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full bg-[color:var(--color-emerald)] p-2 text-[color:var(--color-cream)] md:hidden"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-full border border-white/25 p-2 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-[color:var(--color-navy)] text-[color:var(--color-cream)] lg:hidden">
          <div className="container-fortune flex h-16 items-center justify-between md:h-20">
            <span className="font-heading text-lg font-semibold">Menu</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-full border border-white/25 p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="container-fortune flex flex-col divide-y divide-white/10 border-t border-white/10">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-5 font-heading text-2xl"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="container-fortune mt-6 flex flex-col gap-3">
            <a href={CONTACT.phoneHref} className="flex items-center justify-center gap-2 rounded-full border border-white/30 py-3">
              <Phone className="h-4 w-4" /> {CONTACT.phone}
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-emerald)] py-3"
            >
              <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export { WhatsAppIcon };