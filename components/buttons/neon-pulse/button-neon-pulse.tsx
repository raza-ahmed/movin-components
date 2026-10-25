"use client";

import * as React from "react";
export function NeonPulseButton({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @keyframes neon-pulse-glow {
          0%, 100% { box-shadow: 0 0 6px light-dark(rgba(95,98,106,0.4), rgba(167,171,178,0.4)), 0 0 18px light-dark(rgba(95,98,106,0.12), rgba(167,171,178,0.12)); }
          50% { box-shadow: 0 0 14px light-dark(rgba(95,98,106,0.8), rgba(167,171,178,0.8)), 0 0 36px light-dark(rgba(95,98,106,0.28), rgba(167,171,178,0.28)), 0 0 56px light-dark(rgba(95,98,106,0.08), rgba(167,171,178,0.08)); }
        }
        .neon-pulse-btn { animation: neon-pulse-glow 2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .neon-pulse-btn { animation: none; box-shadow: 0 0 6px light-dark(rgba(95,98,106,0.4), rgba(167,171,178,0.4)); }
        }
      `}</style>
      <button
        type="button"
        className="neon-pulse-btn rounded-lg border px-8 py-3 font-medium tracking-wide cursor-pointer"
        style={{
          color: 'light-dark(#5f626a, #a7abb2)',
          background: 'light-dark(rgba(95,98,106,0.08), rgba(167,171,178,0.08))',
          borderColor: 'light-dark(rgba(95,98,106,0.45), rgba(167,171,178,0.45))',
        }}
      >
        {children}
      </button>
    </>
  );
}
