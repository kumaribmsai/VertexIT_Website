"use client";

import { Phone, MessageCircle } from "lucide-react";

export function LeadDetailActions({
  phone,
  waHref,
}: {
  leadId: string;
  phone: string;
  waHref: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <a
        href={`tel:${phone}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-navy hover:border-teal hover:text-teal"
        aria-label="Call"
      >
        <Phone className="h-4 w-4" />
      </a>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-teal hover:border-teal hover:bg-teal/5"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </a>
    </div>
  );
}
