"use client";

import * as React from "react";
export function GlitchButton({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @keyframes glitch-clip1 {
          0%,100% { clip-path: inset(0 0 88% 0); transform: translate(-4px,0); color: #7c7c7c; }
          20% { clip-path: inset(20% 0 55% 0); transform: translate(4px,0); color: #7c7c7c; }
          40% { clip-path: inset(45% 0 30% 0); transform: translate(-3px,0); color: #7c7c7c; }
          60% { clip-path: inset(65% 0 10% 0); transform: translate(3px,0); color: #7c7c7c; }
          80% { clip-path: inset(10% 0 70% 0); transform: translate(-2px,0); color: #7c7c7c; }
        }
        @keyframes glitch-clip2 {
          0%,100% { clip-path: inset(75% 0 0 0); transform: translate(4px,0); color: #f6f6f6; }
          20% { clip-path: inset(40% 0 40% 0); transform: translate(-4px,0); color: #f6f6f6; }
          40% { clip-path: inset(10% 0 65% 0); transform: translate(3px,0); color: #f6f6f6; }
          60% { clip-path: inset(5% 0 75% 0); transform: translate(-3px,0); color: #f6f6f6; }
          80% { clip-path: inset(55% 0 20% 0); transform: translate(2px,0); color: #f6f6f6; }
        }
        .glitch-btn:hover .glitch-r { animation: glitch-clip1 0.35s steps(1) infinite; }
        .glitch-btn:hover .glitch-c { animation: glitch-clip2 0.35s steps(1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .glitch-btn:hover .glitch-r,
          .glitch-btn:hover .glitch-c { animation: none; opacity: 0; }
        }
      `}</style>
      <button
        type="button"
        className="glitch-btn relative overflow-hidden rounded-md border border-[#f6f6f6]/15 bg-[#111111] px-9 py-3 text-sm font-medium uppercase tracking-widest text-[#f6f6f6] cursor-pointer"
      >
        <span className="relative z-10">{children}</span>
        <span aria-hidden className="glitch-r pointer-events-none absolute inset-0 flex items-center justify-center font-medium uppercase tracking-widest">{children}</span>
        <span aria-hidden className="glitch-c pointer-events-none absolute inset-0 flex items-center justify-center font-medium uppercase tracking-widest">{children}</span>
      </button>
    </>
  );
}
