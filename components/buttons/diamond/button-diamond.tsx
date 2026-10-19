"use client";

import * as React from "react";
export function DiamondButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <>
      <style>{`
        @keyframes btn-diamond-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,124,124,0.5); }
          50%       { box-shadow: 0 0 0 14px rgba(124,124,124,0); }
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
          className="w-full h-full rounded-lg border-2 border-[#7c7c7c] cursor-pointer flex items-center justify-center"
          style={{
            background: hovered
              ? 'linear-gradient(135deg,#7c7c7c,#4d4d4d)'
              : '#282828',
            transition: 'background 300ms ease',
            animation: hovered ? 'btn-diamond-pulse 1s ease-out infinite' : 'none',
          }}
        >
          <span
            className="font-semibold text-[#ededed] tracking-wider text-sm leading-none text-center"
            style={{ transform: 'rotate(-45deg)' }}
          >
            {children}
          </span>
        </button>
      </div>
    </>
  );
}
