import Link from "next/link";
import Image from "next/image";

export function Logo({ className = "", showText = true }: { className?: string; showText?: boolean }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="VertexIT home">
      <span className="relative inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-lg ring-1 ring-navy/10">
        <Image
          src="/vertexit-logo.jpeg"
          alt="VertexIT logo"
          fill
          sizes="36px"
          className="object-cover"
          priority
        />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="font-heading text-[1.05rem] font-extrabold tracking-tight text-navy">
            Vertex<span className="text-teal">IT</span>
          </span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Learn • Apply
          </span>
        </span>
      )}
    </Link>
  );
}
