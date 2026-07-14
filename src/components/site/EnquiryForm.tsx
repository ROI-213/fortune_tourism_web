import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { buildWhatsAppUrl } from "@/lib/contact";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().regex(/^[+0-9\s-]{7,15}$/, "Enter a valid phone number"),
  service: z.string().min(1, "Choose a service"),
  pickup: z.string().trim().max(80).optional().or(z.literal("")),
  destination: z.string().trim().max(80).optional().or(z.literal("")),
  date: z.string().max(20).optional().or(z.literal("")),
  passengers: z.string().max(3).optional().or(z.literal("")),
  notes: z.string().max(400).optional().or(z.literal("")),
});

type FormState = z.infer<typeof schema>;

const initial: FormState = {
  name: "",
  phone: "",
  service: "Car Rental",
  pickup: "Bengaluru",
  destination: "",
  date: "",
  passengers: "",
  notes: "",
};

export function EnquiryForm({
  compact = false,
  presetService,
  presetPackage,
  presetVehicle,
}: {
  compact?: boolean;
  presetService?: string;
  presetPackage?: string;
  presetVehicle?: string;
}) {
  const [form, setForm] = useState<FormState>({
    ...initial,
    service: presetService ?? initial.service,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (mode: "quote" | "whatsapp") => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      for (const issue of parsed.error.issues) e[issue.path[0] as string] = issue.message;
      setErrors(e);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    if (loading) return;
    setLoading(true);
    try {
      if (mode === "whatsapp") {
        const url = buildWhatsAppUrl({
          ...parsed.data,
          package: presetPackage,
          vehicle: presetVehicle,
        });
        window.open(url, "_blank", "noopener");
      } else {
        // TODO: wire to backend when available
        await new Promise((r) => setTimeout(r, 700));
        toast.success("Thanks! We'll send your quote within 15 minutes.");
        setForm({ ...initial, service: presetService ?? initial.service });
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground shadow-sm outline-none focus:border-[color:var(--color-navy)] focus:ring-2 focus:ring-[color:var(--color-navy)]/20";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit("quote");
      }}
      className={
        "grid gap-4 " +
        (compact
          ? "grid-cols-1 sm:grid-cols-2"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4")
      }
    >
      <div className={compact ? "" : "lg:col-span-1"}>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service</label>
        <select value={form.service} onChange={update("service")} className={fieldClass}>
          <option>Car Rental</option>
          <option>Tour Package</option>
          <option>Airport Transfer</option>
          <option>Outstation</option>
          <option>Corporate Travel</option>
          <option>Group Travel</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pickup</label>
        <input value={form.pickup} onChange={update("pickup")} placeholder="Bengaluru" className={fieldClass} />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Destination</label>
        <input value={form.destination} onChange={update("destination")} placeholder="Coorg, Munnar…" className={fieldClass} />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Travel date</label>
        <input type="date" value={form.date} onChange={update("date")} className={fieldClass} />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Passengers</label>
        <input type="number" min={1} value={form.passengers} onChange={update("passengers")} placeholder="4" className={fieldClass} />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your name</label>
        <input value={form.name} onChange={update("name")} placeholder="Full name" className={fieldClass} />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mobile</label>
        <input value={form.phone} onChange={update("phone")} placeholder="+91 …" className={fieldClass} />
        {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
      </div>
      {!compact && (
        <div className="md:col-span-2 lg:col-span-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes (optional)</label>
          <textarea rows={3} value={form.notes} onChange={update("notes")} className={fieldClass} />
        </div>
      )}
      <div className={"flex flex-col gap-2 sm:flex-row " + (compact ? "sm:col-span-2" : "md:col-span-2 lg:col-span-4")}>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-[color:var(--color-navy)] px-6 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "Sending…" : "Get Quote"}
        </button>
        <button
          type="button"
          onClick={() => submit("whatsapp")}
          disabled={loading}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-[color:var(--color-emerald)] px-6 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:brightness-110 disabled:opacity-60"
        >
          Continue on WhatsApp
        </button>
      </div>
    </form>
  );
}