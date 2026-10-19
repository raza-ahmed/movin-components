"use client";

import * as React from "react";
export function InkStampButton({ children }: { children: React.ReactNode }) {
  const stampRef = React.useRef<HTMLSpanElement>(null);

  function handleClick() {
    const el = stampRef.current;
    if (!el) return;
    el.removeAttribute('data-stamping');
    void el.offsetWidth;
    el.setAttribute('data-stamping', '');
    setTimeout(() => el.removeAttribute('data-stamping'), 700);
  }

  return (
    <>
      <style>{`
        @keyframes btn-ink-stamp {
          0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.9; }
          40%  { transform: translate(-50%,-50%) scale(1.3); opacity: 0.6; }
          100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
        }
        [data-stamping] { animation: btn-ink-stamp 620ms ease-out forwards; }
        @media (prefers-reduced-motion: reduce) { [data-stamping] { animation: none; opacity: 0; } }
      `}</style>
      <button
        type="button"
        onClick={handleClick}
        className="relative overflow-hidden rounded-lg border border-[#7c7c7c] bg-[#282828] px-8 py-3 font-semibold tracking-widest text-[#f6f6f6] cursor-pointer"
      >
        <span
          ref={stampRef}
          className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 rounded-full opacity-0"
          style={{ background: 'radial-gradient(circle, rgba(124,124,124,0.7) 0%, rgba(124,124,124,0.3) 60%, transparent 100%)' }}
        />
        <span className="relative z-10">{children}</span>
      </button>
    </>
  );
}
