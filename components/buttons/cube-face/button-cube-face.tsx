"use client";

import * as React from "react";
export function CubeFaceButton({ children, doneLabel = '✓ DONE' }: { children: React.ReactNode; doneLabel?: string }) {
  const [flipped, setFlipped] = React.useState(false);

  function handleClick() {
    if (flipped) return;
    setFlipped(true);
    setTimeout(() => setFlipped(false), 1800);
  }

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: reduce) { [data-cube] { transition: none !important; } }
      `}</style>
      <div className="inline-block" style={{ perspective: 500 }}>
        <div
          data-cube
          style={{
            position: 'relative',
            width: 148,
            height: 48,
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateX(90deg)' : 'rotateX(0deg)',
            transition: 'transform 420ms cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <button
            type="button"
            onClick={handleClick}
            className="absolute inset-0 rounded-lg border-none font-semibold text-[#f6f6f6] cursor-pointer bg-gradient-to-br from-[#4d4d4d] to-[#7c7c7c] tracking-wide"
            style={{ backfaceVisibility: 'hidden', transform: 'translateZ(24px)' }}
          >
            {children}
          </button>
          <div
            className="absolute inset-0 rounded-lg font-semibold text-[#f6f6f6] flex items-center justify-center bg-gradient-to-br from-[#7c7c7c] to-[#a7a7a7] tracking-wide"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateX(-90deg) translateZ(24px)' }}
          >
            {doneLabel}
          </div>
        </div>
      </div>
    </>
  );
}
