import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingContact } from "./FloatingContact";

export function SiteLayout({
  children,
  transparentHeader = false,
}: {
  children: ReactNode;
  transparentHeader?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="pb-[calc(72px+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
      <Footer />
      <FloatingContact />
    </div>
  );
}