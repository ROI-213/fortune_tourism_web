import { useEffect, useRef } from "react";

/**
 * Scroll-linked parallax. Sets `--py` (in px) on the returned ref based on
 * how far the element is from the viewport centre, throttled via rAF.
 * Respects prefers-reduced-motion.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  strength = 0.15,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    let ticking = false;
    let visible = false;

    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const centre = rect.top + rect.height / 2;
      const delta = centre - vh / 2;
      el.style.setProperty("--py", `${(-delta * strength).toFixed(1)}px`);
    };

    const onScroll = () => {
      if (!visible || ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible = e.isIntersecting;
        if (visible) onScroll();
      },
      { threshold: 0 },
    );
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [strength]);

  return ref;
}