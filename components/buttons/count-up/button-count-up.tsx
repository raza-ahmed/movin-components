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
        className="inline-flex items-center gap-2.5 rounded-lg bg-gradient-to-br from-[color:light-dark(#cbced3,#393c41)] to-[color:light-dark(#6d7179,#7d8087)] px-7 py-3 font-semibold text-[color:light-dark(#373a40,#f1f2f3)] cursor-pointer border-none"
      >
        <span>{children}</span>
        <span
          ref={numRef}
          className="inline-flex items-center justify-center min-w-[28px] h-7 rounded-md bg-[color:light-dark(#373a40,#f1f2f3)]/20 px-1.5 text-sm font-semibold tabular-nums"
        >
          {count}
        </span>
      </button>
    </>
  );
}
