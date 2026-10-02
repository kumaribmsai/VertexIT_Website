import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, MessageCircle } from "lucide-react";

// A simple teal "WhatsApp Us" link-button.
export function WhatsAppButton({
  href,
  children = "WhatsApp Us",
  className,
  size = "default",
  variant = "default",
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}) {
  const sizes: Record<string, string> = {
    sm: "h-9 px-4 text-sm",
    default: "h-11 px-6 text-sm",
    lg: "h-12 px-7 text-base",
  };
  const variants: Record<string, string> = {
    default: "bg-teal text-white shadow-sm hover:bg-teal/90 focus-visible:ring-teal",
    outline: "border border-teal bg-white text-teal hover:bg-teal/5 focus-visible:ring-teal",
    ghost: "text-teal hover:bg-teal/5 focus-visible:ring-teal",
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        sizes[size],
        variants[variant],
        className,
      )}
    >
      <MessageCircle className="h-4 w-4" aria-hidden />
      {children}
    </a>
  );
}

// Secondary outline link button.
export function LinkButton({
  href,
  children,
  className,
  size = "default",
  variant = "default",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost" | "navy";
}) {
  const sizes: Record<string, string> = {
    sm: "h-9 px-4 text-sm",
    default: "h-11 px-6 text-sm",
    lg: "h-12 px-7 text-base",
  };
  const variants: Record<string, string> = {
    default: "bg-teal text-white shadow-sm hover:bg-teal/90 focus-visible:ring-teal",
    navy: "bg-navy text-white shadow-sm hover:bg-navy-light focus-visible:ring-navy",
    outline:
      "border border-navy/20 bg-white text-navy hover:border-teal hover:text-teal focus-visible:ring-teal",
    ghost: "text-navy hover:bg-navy/5 focus-visible:ring-navy",
  };
  const isExternal = href.startsWith("http");
  return (
    <Link
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        sizes[size],
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal/80",
        className,
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}
