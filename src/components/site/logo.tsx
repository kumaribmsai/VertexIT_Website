import Link from "next/link";
import Image from "next/image";

export function Logo({ className = "" }: { className?: string; showText?: boolean }) {
  return (
    <Link href="/" className={`group inline-flex items-center ${className}`} aria-label="VertexIT home">
      <span className="relative inline-flex h-12 w-48 shrink-0 overflow-hidden rounded-md">
        <Image
          src="/vertexit-logo.png"
          alt="VertexIT logo"
          fill
          sizes="192px"
          className="object-contain object-left"
          priority
        />
      </span>
    </Link>
  );
}
