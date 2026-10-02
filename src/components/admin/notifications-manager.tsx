"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCheck, Bell, BellOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { AdminPageHeader, AdminEmpty, AdminBadge } from "@/components/admin/primitives";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

export function NotificationsManager({ initial }: { initial: Notification[] }) {
  const [items, setItems] = useState<Notification[]>(initial);
  const [markingAll, setMarkingAll] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  async function markAllRead() {
    setMarkingAll(true);
    try {
      const res = await fetch("/api/admin/notifications/read-all", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error("Failed");
      toast.success("All marked as read");
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      startTransition(() => router.refresh());
    } catch {
      toast.error("Couldn't mark all as read.");
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleClick(n: Notification) {
    // Optimistically mark as read
    if (!n.isRead) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
      try {
        await fetch(`/api/admin/notifications/${n.id}`, { method: "PATCH" });
        startTransition(() => router.refresh());
      } catch {
        // silent
      }
    }
    if (n.link) {
      router.push(n.link);
    }
  }

  const unreadCount = items.filter((n) => !n.isRead).length;

  return (
    <div>
      <AdminPageHeader
        title="Notifications"
        description={unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.` : "All caught up."}
        actions={
          <Button onClick={markAllRead} disabled={markingAll || unreadCount === 0} variant="outline">
            <CheckCheck className="h-4 w-4" />
            {markingAll ? "Marking…" : "Mark all as read"}
          </Button>
        }
      />

      {items.length === 0 ? (
        <AdminEmpty message="No notifications yet." />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-100">
            {items.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => handleClick(n)}
                  className={`flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50 ${
                    n.isRead ? "" : "bg-teal/[0.04]"
                  }`}
                >
                  <span
                    className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      n.isRead ? "bg-slate-100 text-slate-400" : "bg-teal/10 text-teal"
                    }`}
                  >
                    {n.isRead ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className={`text-sm ${n.isRead ? "font-medium text-slate-700" : "font-semibold text-navy"}`}>
                        {n.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        {!n.isRead && <AdminBadge tone="teal">New</AdminBadge>}
                        <span className="text-[0.7rem] text-slate-400 whitespace-nowrap">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-600">{n.message}</p>
                    {n.link && (
                      <p className="mt-1 text-xs text-teal hover:underline">Open →</p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
