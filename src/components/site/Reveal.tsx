import { useEffect, useRef, type ReactNode } from "react";

type RevealVariant = "up" | "down" | "left" | "right" | "scale" | "blur" | "fade";

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  variant = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  variant?: RevealVariant;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const t = window.setTimeout(() => el.classList.add("in"), delay);
            io.unobserve(el);
            return () => window.clearTimeout(t);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  const Component = Tag as unknown as React.ElementType;
  return (
    <Component
      ref={ref}
      data-reveal={variant}
      className={className}
    >
      {children}
    </Component>
  );
}