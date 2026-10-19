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
        className="rot-grad-btn relative overflow-hidden rounded-full border-none px-9 py-3 font-semibold text-[#f6f6f6] cursor-pointer"
        style={{ background: '#111111' }}
      >
        <span className="absolute inset-0 rounded-full" style={{ background: '#111111' }} />
        <span
          className="spin-layer absolute"
          style={{
            top: '50%', left: '50%',
            width: '400px', height: '400px',
            marginLeft: '-200px', marginTop: '-200px',
            background: 'conic-gradient(from 0deg,#7c7c7c,#7c7c7c,#7c7c7c,#a7a7a7,#a7a7a7,#7c7c7c)',
            opacity: hovered ? 0.9 : 0,
            transition: 'opacity 300ms ease',
          }}
        />
        <span className="pointer-events-none absolute inset-0" style={{ background: 'rgba(17,17,17,0.25)' }} />
        <span className="relative z-10" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{children}</span>
      </button>
    </>
  );
}
