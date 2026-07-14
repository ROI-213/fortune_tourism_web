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
      <main className={transparentHeader ? "" : "pt-16 md:pt-20"}>{children}</main>
      <Footer />
      <FloatingContact />
    </div>
  );
}