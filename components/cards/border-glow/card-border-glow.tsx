"use client";

import * as React from "react";
export function BorderGlowCard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @property --border-angle { syntax: '<angle>'; initial-value: 0deg; inherits: true; }
        @property --border-hi { syntax: '<color>'; initial-value: transparent; inherits: true; }
        @keyframes border-spin { to { --border-angle: 360deg; } }
        .border-glow-card {
          --border-hi: light-dark(#5f626a, #a7abb2);
          position: relative;
          isolation: isolate;
          padding: 1px;
          border-radius: 12px;
          background: conic-gradient(from var(--border-angle), light-dark(#cbced3, #393c41), var(--border-hi) 12%, light-dark(#cbced3, #393c41) 30%, light-dark(#cbced3, #393c41));
          animation: border-spin 4s linear infinite;
          transition: --border-hi 350ms ease;
        }
        /* The halo: the same highlight, blurred, behind the card. */
        .border-glow-card::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: inherit;
          background: conic-gradient(from var(--border-angle), transparent, var(--border-hi) 12%, transparent 30%);
          filter: blur(12px);
          opacity: 0;
          transition: opacity 350ms ease;
        }
        .border-glow-card:hover { --border-hi: light-dark(#373a40, #f1f2f3); }
        .border-glow-card:hover::before { opacity: 0.7; }
        @media (prefers-reduced-motion: reduce) {
          .border-glow-card { animation: none; }
        }
      `}</style>
      <div className="border-glow-card cursor-pointer">
        <div className="overflow-hidden rounded-[11px] bg-[color:light-dark(#fbfcfd,#121417)]">{children}</div>
      </div>
    </>
  );
}
