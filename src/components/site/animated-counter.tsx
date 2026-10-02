"use client";

import { useEffect, useRef, useState } from "react";

// Animated counter that counts up from 0 to `value` when scrolled into view.
// Only animates on first intersection; respects prefers-reduced-motion via CSS.
export function AnimatedCounter({
  value,
  duration = 1500,
  suffix = "",
  prefix = "",
  className = "",
}: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const start = performance.now();
            const animate = (now: number) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // easeOutQuart for a premium feel
              const eased = 1 - Math.pow(1 - progress, 4);
              setDisplay(Math.round(eased * value));
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display.toLocaleString("en-IN")}{suffix}
    </span>
  );
}
