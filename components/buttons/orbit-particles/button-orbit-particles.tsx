"use client";

import * as React from "react";
const ORBIT_DOTS = Array.from({ length: 6 }, (_, i) => ({
  id: `orbit-${i}`,
  delay: `${-((i / 6) * 1.8).toFixed(3)}s`,
  large: i === 0,
}));

export function OrbitParticlesButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <>
      <style>{`
        @keyframes btn-orbit {
          from { transform: rotate(0deg) translateX(46px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(46px) rotate(-360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-orbit-dot] { animation: none !important; opacity: 0 !important; }
        }
      `}</style>
      <div className="relative inline-flex items-center justify-center">
        {ORBIT_DOTS.map(({ id, delay, large }) => (
          <span
            key={id}
            data-orbit-dot
            className="pointer-events-none absolute rounded-full"
            style={{
              left: '50%',
              top: '50%',
              width: large ? 8 : 5,
              height: large ? 8 : 5,
              marginLeft: large ? -4 : -2.5,
              marginTop: large ? -4 : -2.5,
              background: large ? '#a7a7a7' : 'rgba(167,167,167,0.65)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 250ms ease',
              animation: hovered ? `btn-orbit 1.8s linear ${delay} infinite` : 'none',
            }}
          />
        ))}
        <button
          type="button"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative z-10 rounded-lg border border-[#7c7c7c] bg-[#282828] px-8 py-3 font-semibold tracking-wider text-[#c9c9c9] cursor-pointer"
        >
          {children}
        </button>
      </div>
    </>
  );
}
