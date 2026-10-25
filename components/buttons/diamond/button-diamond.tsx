"use client";

import * as React from "react";
export function DiamondButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <>
      <style>{`
        @keyframes btn-diamond-pulse {
          0%, 100% { box-shadow: 0 0 0 0 light-dark(rgba(109,113,121,0.5), rgba(125,128,135,0.5)); }
          50%       { box-shadow: 0 0 0 14px light-dark(rgba(109,113,121,0), rgba(125,128,135,0)); }
        }
        @media (prefers-reduced-motion: reduce) { [data-diamond-pulse] { animation: none !important; } }
      `}</style>
      <div
        className="inline-block"
        style={{
          width: 120,
          height: 120,
          transform: `rotate(45deg) scale(${hovered ? 1.08 : 1})`,
          transition: 'transform 280ms cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <button
          type="button"
          data-diamond-pulse={hovered ? '' : undefined}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="w-full h-full rounded-lg border-2 border-[color:light-dark(#6d7179,#7d8087)] cursor-pointer flex items-center justify-center"
          style={{
            background: hovered
              ? 'linear-gradient(135deg,light-dark(#6d7179, #7d8087),light-dark(#cbced3, #393c41))'
              : 'light-dark(#ebedf0, #232529)',
            transition: 'background 300ms ease',
            animation: hovered ? 'btn-diamond-pulse 1s ease-out infinite' : 'none',
          }}
        >
          <span
            className="font-semibold text-[color:light-dark(#42454c,#e5e6e9)] tracking-wider text-sm leading-none text-center"
            style={{ transform: 'rotate(-45deg)' }}
          >
            {children}
          </span>
        </button>
      </div>
    </>
  );
}
