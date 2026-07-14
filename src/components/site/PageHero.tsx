import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  blurb,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-[color:var(--color-navy)] text-[color:var(--color-cream)]">
      {image && (
        <>
          <img src={image} alt="" loading="eager" width={1600} height={900} className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--color-navy)] via-[color:var(--color-navy)]/80 to-transparent" />
        </>
      )}
      <div className="relative container-fortune py-20 md:py-28">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-gold)]">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-heading text-4xl md:text-6xl">{title}</h1>
        {blurb && <p className="mt-4 max-w-2xl text-base opacity-90 md:text-lg">{blurb}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}