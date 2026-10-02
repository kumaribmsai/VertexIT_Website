import Image from "next/image";
import { Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

export type TrainerCardData = {
  id: string;
  name: string;
  photo: string | null;
  designation: string;
  experience: string | null;
  specialization: string;
  bio: string;
  linkedinUrl: string | null;
};

export function TrainerCard({ t, className }: { t: TrainerCardData; className?: string }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-center transition-all hover:border-teal/40 hover:shadow-[0_14px_30px_-14px_rgba(11,37,69,0.2)]",
        className,
      )}
    >
      <div className="relative mx-auto mt-6 h-28 w-28 overflow-hidden rounded-full bg-navy/10 ring-4 ring-white">
        {t.photo ? (
          <Image src={t.photo} alt={t.name} fill sizes="112px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-gradient text-3xl font-bold text-white">
            {t.name.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-base font-bold text-navy">{t.name}</h3>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-teal">{t.designation}</p>
        <p className="mt-2 text-xs text-muted-foreground">{t.specialization}</p>
        {t.experience && (
          <p className="mt-1 text-[0.7rem] text-slate-500">{t.experience} experience</p>
        )}
        <p className="mt-3 line-clamp-3 text-[0.8rem] leading-relaxed text-slate-600">{t.bio}</p>
        {t.linkedinUrl && (
          <a
            href={t.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 mx-auto mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-navy transition-colors hover:border-teal hover:text-teal"
            aria-label={`${t.name} on LinkedIn`}
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}
