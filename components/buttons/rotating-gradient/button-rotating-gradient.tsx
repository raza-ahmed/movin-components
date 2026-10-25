"use client";

import * as React from "react";
export function RotatingGradientButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <>
      <style>{`
        @keyframes btn-gradient-spin { to { transform: rotate(360deg); } }
        .rot-grad-btn[data-hovered] .spin-layer { animation: btn-gradient-spin 3s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .rot-grad-btn[data-hovered] .spin-layer { animation: none; }
        }
      `}</style>
      <button
        type="button"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...(hovered ? { 'data-hovered': '' } : {})}
        className="rot-grad-btn relative overflow-hidden rounded-full border-none px-9 py-3 font-semibold text-[color:light-dark(#373a40,#f1f2f3)] cursor-pointer"
        style={{ background: 'light-dark(#fbfcfd, #121417)' }}
      >
        <span className="absolute inset-0 rounded-full" style={{ background: 'light-dark(#fbfcfd, #121417)' }} />
        <span
          className="spin-layer absolute"
          style={{
            top: '50%', left: '50%',
            width: '400px', height: '400px',
            marginLeft: '-200px', marginTop: '-200px',
            background: 'conic-gradient(from 0deg,light-dark(#6d7179, #7d8087),light-dark(#6d7179, #7d8087),light-dark(#6d7179, #7d8087),light-dark(#5f626a, #a7abb2),light-dark(#5f626a, #a7abb2),light-dark(#6d7179, #7d8087))',
            opacity: hovered ? 0.9 : 0,
            transition: 'opacity 300ms ease',
          }}
        />
        <span className="pointer-events-none absolute inset-0" style={{ background: 'light-dark(rgba(251,252,253,0.25), rgba(18,20,23,0.25))' }} />
        <span className="relative z-10" style={{ textShadow: '0 1px 4px light-dark(rgba(0, 0, 0, 0.18), rgba(0,0,0,0.6))' }}>{children}</span>
      </button>
    </>
  );
}
