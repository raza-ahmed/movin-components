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
            className="absolute inset-0 rounded-lg border-none font-semibold text-[color:light-dark(#373a40,#f1f2f3)] cursor-pointer bg-gradient-to-br from-[color:light-dark(#cbced3,#393c41)] to-[color:light-dark(#6d7179,#7d8087)] tracking-wide"
            style={{ backfaceVisibility: 'hidden', transform: 'translateZ(24px)' }}
          >
            {children}
          </button>
          <div
            className="absolute inset-0 rounded-lg font-semibold text-[color:light-dark(#373a40,#f1f2f3)] flex items-center justify-center bg-gradient-to-br from-[color:light-dark(#6d7179,#7d8087)] to-[color:light-dark(#5f626a,#a7abb2)] tracking-wide"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateX(-90deg) translateZ(24px)' }}
          >
            {doneLabel}
          </div>
        </div>
      </div>
    </>
  );
}
