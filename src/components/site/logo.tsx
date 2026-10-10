import Link from "next/link";
import Image from "next/image";

export function Logo({ className = "" }: { className?: string; showText?: boolean }) {
  return (
    <Link href="/" className={`group inline-flex items-center ${className}`} aria-label="VertexIT home">
      <Image
        src="/vertexit-logo-transparent.png"
        alt="VertexIT logo"
        width={240}
        height={180}
        className="h-[52px] sm:h-[60px] lg:h-[68px] w-auto object-contain transition-transform group-hover:scale-[1.02]"
        priority
      />
    </Link>
  );
}
