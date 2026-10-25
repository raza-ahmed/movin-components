"use client";

import * as React from "react";
export function StaggerLettersButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);
  const label = typeof children === 'string' ? children : 'LAUNCH';

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          [data-stagger-letter] { transition: none !important; transform: none !important; }
        }
      `}</style>
      <button
        type="button"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="inline-flex gap-px rounded-lg border-none bg-gradient-to-br from-[color:light-dark(#6d7179,#7d8087)] to-[color:light-dark(#cbced3,#393c41)] px-8 py-3 font-semibold tracking-widest text-[color:light-dark(#373a40,#f1f2f3)] cursor-pointer"
      >
        {label.split('').map((char, i) => (
          <span
            key={i}
            data-stagger-letter
            className="inline-block"
            style={{
              transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
              transition: `transform 300ms cubic-bezier(0.34,1.56,0.64,1) ${i * 38}ms`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </button>
    </>
  );
}
