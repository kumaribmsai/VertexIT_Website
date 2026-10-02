import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AdminPageHeader({
  title,
  description,
  actions,
  backHref,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backHref?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-teal"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
        )}
        <h1 className="font-heading text-2xl font-bold text-navy">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function AdminCard({
  children,
  className,
  title,
  description,
  actions,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
          <div>
            {title && <h2 className="font-heading text-sm font-semibold text-navy">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function AdminEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function AdminBadge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "teal" | "navy" | "amber" | "red" | "green" }) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    teal: "bg-teal/10 text-teal",
    navy: "bg-navy/10 text-navy",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    green: "bg-green-100 text-green-700",
  };
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[0.7rem] font-semibold", tones[tone])}>
      {children}
    </span>
  );
}
