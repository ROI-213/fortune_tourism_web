import { Phone } from "lucide-react";
import { CONTACT, buildWhatsAppUrl } from "@/lib/contact";
import { WhatsAppIcon } from "./Header";

export function FloatingContact() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 md:hidden">
      <a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noreferrer noopener"
        className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--color-emerald)] text-[color:var(--color-cream)] shadow-lg"
        aria-label="WhatsApp"
      >
        <WhatsAppIcon className="h-5 w-5" />
      </a>
      <a
        href={CONTACT.phoneHref}
        className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--color-navy)] text-[color:var(--color-cream)] shadow-lg"
        aria-label="Call"
      >
        <Phone className="h-5 w-5" />
      </a>
    </div>
  );
}