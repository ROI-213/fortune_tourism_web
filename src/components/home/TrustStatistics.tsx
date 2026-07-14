import { useEffect, useRef, useState } from "react";
import { Award, Users, Globe2, Headset } from "lucide-react";

type Stat = {
  value: number;
  suffix: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  display?: string; // override formatted display (e.g. "24/7")
};

const STATS: Stat[] = [
  { value: 10, suffix: "+", label: "Years of Experience", icon: Award },
  { value: 5000, suffix: "+", label: "Happy Travellers", icon: Users },
  { value: 100, suffix: "+", label: "Destinations", icon: Globe2 },
  { value: 0, suffix: "", label: "Customer Support", icon: Headset, display: "24/7" },
];

function useInView<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function CountUp({ target, active, format }: { target: number; active: boolean; format: (n: number) => string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return <>{format(n)}</>;
}

export default function TrustStatistics() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      aria-label="Trust statistics"
      className="relative py-12 md:py-16"
      style={{ background: "#F8F3E8" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(215,233,220,0.55) 0%, rgba(248,243,232,0) 70%)",
        }}
      />
      <div ref={ref} className="container relative mx-auto px-6 md:px-10 max-w-[1320px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="group rounded-[26px] bg-white border text-center px-6 py-7 md:py-8 shadow-[0_2px_10px_rgba(23,76,54,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(23,76,54,0.12)]"
                style={{
                  borderColor: "rgba(212,166,58,0.28)",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(18px)",
                  transition: `opacity 600ms ease ${i * 120}ms, transform 600ms ease ${i * 120}ms, box-shadow 300ms ease, translate 300ms ease`,
                }}
              >
                <div
                  className="mx-auto mb-4 flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105"
                  style={{ width: 50, height: 50, background: "#D7E9DC" }}
                >
                  <Icon className="h-6 w-6" style={{ color: "#174C36" }} />
                </div>
                <div
                  className="font-serif font-semibold leading-none"
                  style={{ color: "#0E3A29", fontSize: "clamp(30px, 3.4vw, 44px)" }}
                >
                  {s.display ? (
                    s.display
                  ) : (
                    <>
                      <CountUp
                        target={s.value}
                        active={inView}
                        format={(n) => n.toLocaleString("en-IN")}
                      />
                      <span style={{ color: "#D4A63A" }}>{s.suffix}</span>
                    </>
                  )}
                </div>
                <div
                  className="mt-2 text-[15px] md:text-base"
                  style={{ color: "#63736B" }}
                >
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}