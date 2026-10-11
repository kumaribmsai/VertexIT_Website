"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/site/buttons";
import { Logo } from "@/components/site/logo";

export function MobileNav({
  nav,
  waHref,
  phone,
}: {
  nav: { label: string; href: string }[];
  waHref: string;
  phone: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scrolling when the menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const drawerContent = (
    <div
      className={cn(
        "fixed inset-0 z-[100] xl:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-navy/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          "absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-3 text-[0.95rem] font-medium text-slate-800 transition-colors hover:bg-teal/5 hover:text-teal"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t border-slate-200 p-4">
          <WhatsAppButton href={waHref} className="w-full" />
          <a
            href={`tel:${phone}`}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-navy/20 font-semibold text-navy hover:border-teal hover:text-teal"
          >
            <Phone className="h-4 w-4" /> Call {phone}
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy hover:bg-navy/5 xl:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted ? createPortal(drawerContent, document.body) : null}
    </>
  );
}
