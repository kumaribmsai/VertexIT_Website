"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Menu, X, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site/logo";
import { ADMIN_NAV } from "@/components/admin/nav-config";
import {
  LayoutDashboard, Users, GraduationCap, Briefcase, FileText, UserCog,
  Star, Trophy, HelpCircle, Settings, Image as ImageIcon, Shield, ScrollText, CalendarDays,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, Users, GraduationCap, Briefcase, FileText, UserCog,
  Star, Trophy, HelpCircle, Settings, Image: ImageIcon, Shield, ScrollText, CalendarDays,
};

export function AdminTopbar({
  user,
  unreadNotifications,
}: {
  user: { name: string; email: string; role: string };
  unreadNotifications: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-heading text-base font-bold text-navy sm:text-lg">
          VertexIT <span className="text-teal">Admin</span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/admin/notifications"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadNotifications > 0 && (
            <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[0.6rem] font-bold text-white">
              {unreadNotifications}
            </span>
          )}
        </Link>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-navy">{user.name}</p>
          <p className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">{user.role}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-navy hover:border-red-300 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", mobileOpen ? "" : "pointer-events-none")}>
        <div
          className={cn("absolute inset-0 bg-navy/40 transition-opacity", mobileOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute left-0 top-0 flex h-full w-72 flex-col bg-navy transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
            <Logo className="[&_span]:text-white" />
            <button
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
            {ADMIN_NAV.map((item) => {
              const Icon = ICONS[item.icon] ?? LayoutDashboard;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
