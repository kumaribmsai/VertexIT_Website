"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, GraduationCap, Briefcase, FileText, UserCog,
  Star, Trophy, HelpCircle, Settings, Image as ImageIcon, Shield, ScrollText, CalendarDays,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site/logo";
import { ADMIN_NAV } from "@/components/admin/nav-config";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, Users, GraduationCap, Briefcase, FileText, UserCog,
  Star, Trophy, HelpCircle, Settings, Image: ImageIcon, Shield, ScrollText, CalendarDays,
};

export function AdminSidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();

  const filtered = ADMIN_NAV.filter((item) => {
    if (item.href === "/admin/users") return userRole === "SUPER_ADMIN";
    return true;
  });

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-navy lg:flex">
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Logo className="[&_span]:text-white" />
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {filtered.map((item) => {
          const Icon = ICONS[item.icon] ?? LayoutDashboard;
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-teal text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3 text-[0.7rem] text-slate-400">
        VertexIT Admin · LEARN • APPLY
      </div>
    </aside>
  );
}
