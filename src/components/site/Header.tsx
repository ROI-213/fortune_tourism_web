import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, Phone, X } from "lucide-react";
import { NAV } from "@/data/site";
import { CONTACT, buildWhatsAppUrl } from "@/lib/contact";
import logoAsset from "@/assets/fortune-tourism-logo.png";

const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.4 0 .04 5.36.04 11.98a11.94 11.94 0 0 0 1.6 5.98L0 24l6.2-1.62a11.98 11.98 0 0 0 5.82 1.48h.01c6.62 0 11.99-5.37 11.99-11.99 0-3.2-1.25-6.21-3.5-8.39ZM12.02 21.3h-.01a9.32 9.32 0 0 1-4.75-1.3l-.34-.2-3.68.96.98-3.58-.22-.37a9.32 9.32 0 0 1-1.43-4.83c0-5.15 4.19-9.34 9.35-9.34 2.5 0 4.85.97 6.62 2.74a9.29 9.29 0 0 1 2.74 6.61c0 5.16-4.19 9.35-9.26 9.35Zm5.35-7c-.29-.15-1.73-.85-2-.95-.27-.1-.47-.15-.66.15s-.76.95-.93 1.15c-.17.2-.34.22-.63.07-.29-.15-1.23-.45-2.35-1.44a8.87 8.87 0 0 1-1.64-2.02c-.17-.29 0-.44.13-.59.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.19-.24-.58-.48-.5-.66-.51h-.56c-.19 0-.5.07-.76.37s-1 .98-1 2.38 1.03 2.76 1.17 2.95c.15.2 2.02 3.08 4.9 4.32.68.29 1.22.47 1.63.6.68.22 1.3.19 1.79.11.55-.08 1.73-.71 1.97-1.4.24-.68.24-1.27.17-1.39-.07-.12-.26-.19-.55-.34Z"/>
  </svg>
);

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const wa = buildWhatsAppUrl({ service: "General enquiry" });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f7f1e7]">
      <div className="mx-auto w-[calc(100%-24px)] max-w-[1440px] px-0 py-2 md:w-[calc(100%-32px)] md:py-3">
        <nav
          className="flex items-center flex-nowrap gap-4 rounded-[28px] border border-white/80 bg-[rgba(255,253,248,0.98)] px-4 py-2 shadow-[0_18px_40px_rgba(68,45,15,0.10),0_4px_12px_rgba(68,45,15,0.06)] md:px-7 md:py-2.5"
          style={{ minHeight: 64 }}
          aria-label="Primary"
        >
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 md:gap-3 shrink-0">
            <span className="grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-white h-11 w-11 md:h-[56px] md:w-[56px]">
              <img
                src={logoAsset}
                alt="Fortune Tourism logo"
                className="h-full w-full object-contain"
              />
            </span>
            <span
              className="whitespace-nowrap font-heading"
              style={{ fontSize: "clamp(17px,1.4vw,24px)", fontWeight: 600, lineHeight: 1 }}
            >
              <span style={{ color: "#063f2d" }}>Fortune</span>{" "}
              <span style={{ color: "#d79a17" }}>Tourism</span>
            </span>
          </Link>

          {/* Center menu */}
          <div
            className="hidden min-w-0 flex-1 items-center justify-center whitespace-nowrap lg:flex"
            style={{ gap: "clamp(14px,1.8vw,28px)" }}
          >
            {NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative text-[14px] font-medium text-[#191919] transition-colors hover:text-[#c98d12] xl:text-[15px]"
                  style={
                    active
                      ? { color: "#d28f00", fontWeight: 600 }
                      : undefined
                  }
                >
                  {item.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 -translate-x-1/2 rounded-full"
                      style={{
                        bottom: -8,
                        width: 32,
                        height: 2.5,
                        background: "#d59a0a",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-auto">
            <a
              href={CONTACT.phoneHref}
              className="hidden items-center gap-1.5 whitespace-nowrap text-[14px] font-medium text-[#151515] hover:text-[#063f2d] md:inline-flex"
            >
              <Phone className="h-4 w-4" style={{ color: "#063f2d" }} />
              <span className="hidden xl:inline">Call Now</span>
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-medium text-white shadow-[0_8px_18px_rgba(4,83,55,0.16)] transition-transform hover:-translate-y-0.5 md:inline-flex"
              style={{ background: "linear-gradient(135deg,#086a46,#07583d)" }}
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>

            {/* Mobile icons */}
            <a
              href={wa}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="WhatsApp"
              className="grid h-10 w-10 place-items-center rounded-full text-white md:hidden"
              style={{ background: "linear-gradient(135deg,#086a46,#07583d)" }}
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-[color:rgba(6,63,45,0.2)] text-[#063f2d] lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </nav>
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