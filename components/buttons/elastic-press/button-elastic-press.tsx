"use client";

import * as React from "react";
export function ElasticPressButton({ children }: { children: React.ReactNode }) {
  const btnRef = React.useRef<HTMLButtonElement>(null);

  function handleClick() {
    const btn = btnRef.current;
    if (!btn) return;
    btn.removeAttribute('data-pressing');
    void btn.offsetWidth;
    btn.setAttribute('data-pressing', '');
    setTimeout(() => btn.removeAttribute('data-pressing'), 510);
  }

  return (
    <>
      <style>{`
        @keyframes elastic-press {
          0%   { transform: scale(1); }
          15%  { transform: scaleX(0.90) scaleY(0.92); }
          35%  { transform: scaleX(1.08) scaleY(0.96); }
          55%  { transform: scaleX(0.97) scaleY(1.04); }
          70%  { transform: scaleX(1.03) scaleY(0.98); }
          85%  { transform: scaleX(0.99) scaleY(1.01); }
          100% { transform: scale(1); }
        }
        .elastic-btn[data-pressing] { animation: elastic-press 500ms cubic-bezier(0.4,0,0.2,1) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .elastic-btn[data-pressing] { animation: none; transform: scale(0.96); }
        }
      `}</style>
      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        className="elastic-btn rounded-full bg-[color:light-dark(#373a40,#f1f2f3)] px-8 py-3 font-semibold text-[color:light-dark(#f3f4f7,#1a1c1f)] shadow-lg cursor-pointer border-none origin-center"
      >
        {children}
      </button>
    </>
  );
}
