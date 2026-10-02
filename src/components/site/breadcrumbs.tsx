import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="inline-flex items-center gap-1">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-teal">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-navy" : ""}>{item.label}</span>
              )}
              {!isLast && <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
