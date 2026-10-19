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
          --gb-hi: #a7a7a7;
          position: relative;
          isolation: isolate;
          display: inline-block;
          padding: 1px;
          border-radius: 10px;
          background: conic-gradient(from var(--gb-angle), #4d4d4d, var(--gb-hi) 15%, #4d4d4d 35%, #4d4d4d);
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
        .gb-wrap:hover { --gb-hi: #f6f6f6; }
        .gb-wrap:hover::before { opacity: 0.75; }
        .gb-wrap > button { transition: transform 150ms ease; }
        .gb-wrap > button:active { transform: scale(0.97); }
        @media (prefers-reduced-motion: reduce) { .gb-wrap { animation: none; } }
      `}</style>
      <div className="gb-wrap">
        <button
          type="button"
          className="block cursor-pointer rounded-[9px] px-8 py-3 font-medium tracking-wide text-[#f6f6f6]"
          style={{ background: '#111111' }}
        >
          {children}
        </button>
      </div>
    </>
  );
}
