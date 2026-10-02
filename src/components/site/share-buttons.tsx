"use client";

import { useState } from "react";
import { Share2, Link2, Check, Facebook, Twitter, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShareButtons({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]",
    },
    {
      icon: Twitter,
      label: "Twitter / X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-slate-900 hover:text-white hover:border-slate-900",
    },
    {
      icon: Facebook,
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
    },
  ];

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Share2 className="h-3.5 w-3.5" />
        Share
      </span>
      <div className="flex items-center gap-1.5">
        {shareLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.label}`}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all",
              link.color,
            )}
          >
            <link.icon className="h-4 w-4" />
          </a>
        ))}
        <button
          onClick={copyLink}
          aria-label="Copy link"
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white transition-all",
            copied
              ? "border-teal bg-teal/10 text-teal"
              : "text-slate-500 hover:border-teal hover:text-teal",
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
