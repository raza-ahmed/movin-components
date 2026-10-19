"use client";

import * as React from "react";
export function CountUpButton({ children }: { children: React.ReactNode }) {
  const [count, setCount] = React.useState(0);
  const numRef = React.useRef<HTMLSpanElement>(null);

  function handleClick() {
    setCount((c) => c + 1);
    const el = numRef.current;
    if (!el) return;
    el.removeAttribute('data-pop');
    void el.offsetWidth;
    el.setAttribute('data-pop', '');
  }

  return (
    <>
      <style>{`
        @keyframes btn-count-pop {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.55); }
          60%  { transform: scale(0.88); }
          100% { transform: scale(1); }
        }
        [data-pop] { animation: btn-count-pop 380ms cubic-bezier(0.34,1.56,0.64,1) forwards; }
        @media (prefers-reduced-motion: reduce) { [data-pop] { animation: none; } }
      `}</style>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2.5 rounded-lg bg-gradient-to-br from-[#4d4d4d] to-[#7c7c7c] px-7 py-3 font-semibold text-[#f6f6f6] cursor-pointer border-none"
      >
        <span>{children}</span>
        <span
          ref={numRef}
          className="inline-flex items-center justify-center min-w-[28px] h-7 rounded-md bg-[#f6f6f6]/20 px-1.5 text-sm font-semibold tabular-nums"
        >
          {count}
        </span>
      </button>
    </>
  );
}
