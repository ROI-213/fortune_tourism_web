import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { CONTACT, buildWhatsAppUrl } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/site/Header";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Fortune Tourism | Bengaluru South India Travel" },
      { name: "description", content: "Talk to the Fortune Tourism team — phone, WhatsApp, email and Bengaluru office address." },
      { property: "og:title", content: "Contact Fortune Tourism" },
      { property: "og:description", content: "Reach us for car rentals, tours and airport transfers." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title="Let's plan your next trip"
        blurb="Reach us on WhatsApp for the fastest response, or fill in the form below for a written quote."
      />
      <section className="py-14 md:py-20">
        <div className="container-fortune grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            <ContactCard icon={<Phone className="h-5 w-5" />} label="Call anytime" value={CONTACT.phone} href={CONTACT.phoneHref} />
            <ContactCard icon={<WhatsAppIcon className="h-5 w-5" />} label="WhatsApp bookings" value="Chat with us" href={buildWhatsAppUrl()} target="_blank" />
            <ContactCard icon={<Mail className="h-5 w-5" />} label="Email" value={CONTACT.email} href={`mailto:${CONTACT.email}`} />
            <ContactCard icon={<MapPin className="h-5 w-5" />} label="Office" value={CONTACT.address} />
            <p className="text-sm text-muted-foreground">{CONTACT.hours}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <h2 className="font-heading text-2xl">Send an enquiry</h2>
            <p className="mt-1 text-sm text-muted-foreground">We reply within 15 minutes during business hours.</p>
            <div className="mt-6">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function ContactCard({ icon, label, value, href, target }: { icon: React.ReactNode; label: string; value: string; href?: string; target?: string }) {
  const inner = (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--color-navy)]/10 text-[color:var(--color-navy)]">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-heading text-base">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target={target} rel={target ? "noreferrer noopener" : undefined} className="block hover:border-[color:var(--color-navy)]/40">
      {inner}
    </a>
  ) : (
    inner
  );
}