"use client";

import * as React from "react";
export function NeonPulseButton({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @keyframes neon-pulse-glow {
          0%, 100% { box-shadow: 0 0 6px rgba(167,167,167,0.4), 0 0 18px rgba(167,167,167,0.12); }
          50% { box-shadow: 0 0 14px rgba(167,167,167,0.8), 0 0 36px rgba(167,167,167,0.28), 0 0 56px rgba(167,167,167,0.08); }
        }
        .neon-pulse-btn { animation: neon-pulse-glow 2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .neon-pulse-btn { animation: none; box-shadow: 0 0 6px rgba(167,167,167,0.4); }
        }
      `}</style>
      <button
        type="button"
        className="neon-pulse-btn rounded-lg border px-8 py-3 font-medium tracking-wide cursor-pointer"
        style={{
          color: '#a7a7a7',
          background: 'rgba(167,167,167,0.08)',
          borderColor: 'rgba(167,167,167,0.45)',
        }}
      >
        {children}
      </button>
    </>
  );
}
