"use client";

import { useEffect, useState } from "react";

// Reveal-on-scroll wrapper using IntersectionObserver.
// Respects prefers-reduced-motion (handled in globals.css .reveal).
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.transitionDelay = `${delay}ms`;
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.08 },
    );
    io.observe(ref);
    return () => io.disconnect();
  }, [ref, delay]);

  return (
    <Tag ref={setRef} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
