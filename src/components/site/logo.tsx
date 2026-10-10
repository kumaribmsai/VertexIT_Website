import Link from "next/link";
import Image from "next/image";

export function Logo({ className = "" }: { className?: string; showText?: boolean }) {
  return (
    <Link href="/" className={`group inline-flex items-center ${className}`} aria-label="VertexIT home">
      <Image
        src="/vertexit-logo-new.jpg"
        alt="VertexIT logo"
        width={160}
        height={120}
        className="h-16 w-auto rounded-xl bg-white p-2 ring-1 ring-slate-900/5 transition-transform group-hover:scale-[1.02]"
        priority
      />
    </Link>
  );
}
