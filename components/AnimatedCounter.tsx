"use client"

import { useEffect, useState, useRef } from 'react';

type AnimatedCounterProps = {
  from?: number;
  to: number;
  duration?: number; // in ms
  className?: string;
  suffix?: string;
};

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 800,
  className = '',
  suffix = ''
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          animateCount();
          hasAnimated.current = true;
          observer.unobserve(element);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const animateCount = () => {
    const start = performance.now();

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const value = Math.floor(from + (to - from) * progress);
      setCount(value);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <div ref={ref} className={className}>
      {count.toLocaleString()}{suffix}
    </div>
  );
}
