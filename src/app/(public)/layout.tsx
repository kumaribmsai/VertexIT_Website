import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { MobileCtaBar } from "@/components/site/mobile-cta-bar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <MobileCtaBar />
      {/* Spacer so mobile sticky bar doesn't cover footer content */}
      <div className="h-14 lg:hidden" aria-hidden />
    </>
  );
}
