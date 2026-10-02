import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type BlogCardData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  author: string;
  publishedAt: string | Date | null;
  category?: { name: string; slug: string } | null;
};

export function BlogCard({ post, className }: { post: BlogCardData; className?: string }) {
  const date = post.publishedAt ? new Date(post.publishedAt) : null;
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-teal/40 hover:shadow-[0_14px_30px_-14px_rgba(11,37,69,0.2)]",
        className,
      )}
    >
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-navy">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            className="object-cover opacity-95 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-gradient text-white/80">
            <span className="font-heading text-2xl font-bold">VertexIT</span>
          </div>
        )}
        {post.category && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-navy backdrop-blur">
            {post.category.name}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-[0.7rem] text-slate-500">
          {date && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3" /> {format(date, "d MMM yyyy")}
            </span>
          )}
          <Link
            href={`/blog/author/${encodeURIComponent(post.author)}`}
            className="relative z-10 inline-flex items-center gap-1 transition-colors hover:text-teal"
          >
            <User className="h-3 w-3" /> {post.author}
          </Link>
        </div>
        <h3 className="mt-2 font-heading text-base font-bold leading-snug text-navy line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal group-hover:gap-1.5 transition-all">
            Read article <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
