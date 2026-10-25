"use client";

import * as React from "react";
export function GradientBorderButton({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @property --gb-angle { syntax: '<angle>'; initial-value: 0deg; inherits: true; }
        @property --gb-hi { syntax: '<color>'; initial-value: transparent; inherits: true; }
        @keyframes gb-spin { to { --gb-angle: 360deg; } }
        .gb-wrap {
          --gb-hi: light-dark(#5f626a, #a7abb2);
          position: relative;
          isolation: isolate;
          display: inline-block;
          padding: 1px;
          border-radius: 10px;
          background: conic-gradient(from var(--gb-angle), light-dark(#cbced3, #393c41), var(--gb-hi) 15%, light-dark(#cbced3, #393c41) 35%, light-dark(#cbced3, #393c41));
          animation: gb-spin 3s linear infinite;
          transition: --gb-hi 300ms ease;
        }
        /* The halo: the same highlight, blurred, behind the button. */
        .gb-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: inherit;
          background: conic-gradient(from var(--gb-angle), transparent, var(--gb-hi) 15%, transparent 35%);
          filter: blur(10px);
          opacity: 0;
          transition: opacity 300ms ease;
        }
        .gb-wrap:hover { --gb-hi: light-dark(#373a40, #f1f2f3); }
        .gb-wrap:hover::before { opacity: 0.75; }
        .gb-wrap > button { transition: transform 150ms ease; }
        .gb-wrap > button:active { transform: scale(0.97); }
        @media (prefers-reduced-motion: reduce) { .gb-wrap { animation: none; } }
      `}</style>
      <div className="gb-wrap">
        <button
          type="button"
          className="block cursor-pointer rounded-[9px] px-8 py-3 font-medium tracking-wide text-[color:light-dark(#373a40,#f1f2f3)]"
          style={{ background: 'light-dark(#fbfcfd, #121417)' }}
        >
          {children}
        </button>
      </div>
    </>
  );
}
