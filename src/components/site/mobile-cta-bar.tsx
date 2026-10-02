import { getSiteSettings } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { MessageCircle, Phone, UserRound } from "lucide-react";
import Link from "next/link";

// Mobile sticky bottom CTA bar — appears only on mobile.
export async function MobileCtaBar() {
  const settings = await getSiteSettings();
  const waHref = await whatsappUrl("apply");

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-3 divide-x divide-slate-200">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 py-2.5 text-[0.7rem] font-semibold text-teal"
        >
          <MessageCircle className="h-5 w-5" />
          WhatsApp
        </a>
        <a
          href={`tel:${settings.phone}`}
          className="flex flex-col items-center gap-0.5 py-2.5 text-[0.7rem] font-semibold text-navy"
        >
          <Phone className="h-5 w-5" />
          Call
        </a>
        <Link
          href="/apply"
          className="flex flex-col items-center gap-0.5 py-2.5 text-[0.7rem] font-semibold text-navy"
        >
          <UserRound className="h-5 w-5" />
          Counsellor
        </Link>
      </div>
    </div>
  );
}
