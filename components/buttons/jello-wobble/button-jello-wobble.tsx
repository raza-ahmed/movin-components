"use client";

import * as React from "react";
export function JelloWobbleButton({ children }: { children: React.ReactNode }) {
  const btnRef = React.useRef<HTMLButtonElement>(null);

  function handleMouseEnter() {
    const btn = btnRef.current;
    if (!btn) return;
    btn.removeAttribute('data-wobbling');
    void btn.offsetWidth;
    btn.setAttribute('data-wobbling', '');
  }

  return (
    <>
      <style>{`
        @keyframes btn-jello {
          0%   { transform: scale(1); }
          10%  { transform: scaleX(1.18) scaleY(0.82); }
          22%  { transform: scaleX(0.88) scaleY(1.12); }
          36%  { transform: scaleX(1.10) scaleY(0.90); }
          50%  { transform: scaleX(0.95) scaleY(1.05); }
          64%  { transform: scaleX(1.04) scaleY(0.96); }
          78%  { transform: scaleX(0.98) scaleY(1.02); }
          90%  { transform: scaleX(1.01) scaleY(0.99); }
          100% { transform: scale(1); }
        }
        .jello-btn[data-wobbling] { animation: btn-jello 600ms cubic-bezier(0.36,0.07,0.19,0.97) forwards; }
        @media (prefers-reduced-motion: reduce) { .jello-btn[data-wobbling] { animation: none; } }
      `}</style>
      <button
        ref={btnRef}
        type="button"
        onMouseEnter={handleMouseEnter}
        className="jello-btn inline-block rounded-full border-none bg-[#c9c9c9] px-8 py-3 font-semibold text-[#202020] cursor-pointer origin-center"
      >
        {children}
      </button>
    </>
  );
}
