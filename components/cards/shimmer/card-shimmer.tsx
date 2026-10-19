"use client";

import * as React from "react";
export function ShimmerCard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .shimmer-card {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(246,246,246,0.1);
          transition: border-color 300ms ease;
        }
        .shimmer-card:hover { border-color: rgba(246,246,246,0.24); }
        .shimmer-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(246,246,246,0.35) 50%, transparent 70%);
          transform: translateX(-100%) skewX(-10deg);
          transition: none;
          pointer-events: none;
        }
        .shimmer-card:hover::after {
          transform: translateX(200%) skewX(-10deg);
          transition: transform 800ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          .shimmer-card::after { display: none; }
        }
      `}</style>
      <div className="shimmer-card cursor-pointer rounded-xl bg-[#f6f6f6]/[0.06]">
        {children}
      </div>
    </>
  );
}
