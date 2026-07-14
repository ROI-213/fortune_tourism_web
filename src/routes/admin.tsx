import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard (Demo) | Fortune Tourism" },
      { name: "description", content: "Fortune Tourism admin dashboard preview — mock data only." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const stats = [
  { label: "New enquiries (7d)", value: "48" },
  { label: "Confirmed bookings (7d)", value: "22" },
  { label: "Cars on trip today", value: "9" },
  { label: "Revenue (30d)", value: "₹ 6.4 L" },
];

const enquiries = [
  { id: "#F-1042", name: "Ananya Rao", service: "Tour Package", route: "BLR → Coorg", when: "Today · 9:24 AM", status: "New" },
  { id: "#F-1041", name: "Vikram Menon", service: "Airport Transfer", route: "BLR pickup", when: "Today · 8:02 AM", status: "Quoted" },
  { id: "#F-1040", name: "Rajesh Kumar", service: "Tour Package", route: "BLR → Tirupati", when: "Yesterday", status: "Confirmed" },
  { id: "#F-1039", name: "Priya Iyer", service: "Car Rental", route: "Whitefield local", when: "Yesterday", status: "Confirmed" },
];

function AdminPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Internal · Demo" title="Admin dashboard" blurb="A preview of what your operations dashboard will look like. Connect a backend to make this live." />
      <section className="py-14 md:py-20">
        <div className="container-fortune">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="mt-2 font-heading text-3xl text-[color:var(--color-navy)]">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-heading text-xl">Recent enquiries</h2>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Demo data</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[color:var(--color-lightgrey)] text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Service</th>
                    <th className="px-5 py-3">Route</th>
                    <th className="px-5 py-3">When</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((e) => (
                    <tr key={e.id} className="border-t border-border">
                      <td className="px-5 py-3 font-medium">{e.id}</td>
                      <td className="px-5 py-3">{e.name}</td>
                      <td className="px-5 py-3">{e.service}</td>
                      <td className="px-5 py-3">{e.route}</td>
                      <td className="px-5 py-3 text-muted-foreground">{e.when}</td>
                      <td className="px-5 py-3">
                        <span className={
                          "rounded-full px-2 py-1 text-xs " +
                          (e.status === "New"
                            ? "bg-[color:var(--color-emerald)]/15 text-[color:var(--color-emerald)]"
                            : e.status === "Quoted"
                              ? "bg-[color:var(--color-gold)]/20 text-[color:var(--color-navy)]"
                              : "bg-[color:var(--color-navy)]/10 text-[color:var(--color-navy)]")
                        }>
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}