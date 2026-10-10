import Link from "next/link";
import Image from "next/image";

export function Logo({ className = "" }: { className?: string; showText?: boolean }) {
  return (
    <Link href="/" className={`group inline-flex items-center ${className}`} aria-label="VertexIT home">
      <Image
        src="/vertexit-logo-transparent.png"
        alt="VertexIT logo"
        width={160}
        height={120}
        className="h-14 w-auto object-contain transition-transform group-hover:scale-[1.02]"
        priority
      />
    </Link>
  );
}
