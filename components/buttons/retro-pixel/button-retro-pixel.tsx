"use client";

import * as React from "react";
export function RetroPixelButton({ children }: { children: React.ReactNode }) {
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const [pressed, setPressed] = React.useState(false);

  function handleMouseDown() {
    const btn = btnRef.current;
    if (!btn) return;
    setPressed(true);
    btn.removeAttribute('data-pressing');
    void btn.offsetWidth;
    btn.setAttribute('data-pressing', '');
  }

  function handleMouseUp() {
    setPressed(false);
    btnRef.current?.removeAttribute('data-pressing');
  }

  return (
    <>
      <style>{`
        @keyframes pixel-shake {
          0%   { transform: translateY(3px); }
          20%  { transform: translate(-3px,3px); }
          40%  { transform: translate(3px,3px); }
          60%  { transform: translate(-2px,3px); }
          80%  { transform: translate(2px,3px); }
          100% { transform: translateY(3px); }
        }
        .pixel-btn[data-pressing] { animation: pixel-shake 220ms steps(1) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .pixel-btn[data-pressing] { animation: none; transform: translateY(3px); }
        }
      `}</style>
      <div className="inline-block bg-[color:light-dark(#fbfcfd,#121417)] p-1">
        <button
          ref={btnRef}
          type="button"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="pixel-btn relative block cursor-pointer select-none border-[3px] border-[color:light-dark(#fbfcfd,#121417)] px-7 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-[color:light-dark(#373a40,#f1f2f3)]"
          style={{
            borderRadius: 0,
            background: 'light-dark(#6d7179, #7d8087)',
            outline: '3px solid light-dark(#fbfcfd, #121417)',
            outlineOffset: '3px',
            boxShadow: pressed
              ? 'inset 2px 2px 0 light-dark(rgba(0, 0, 0, 0.15), rgba(0,0,0,0.5))'
              : '4px 4px 0 light-dark(#dbdde1, #2e3035), inset 0 2px 0 light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))',
            transition: 'box-shadow 60ms steps(1)',
          }}
        >
          <span className="pointer-events-none absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,light-dark(rgba(251,252,253,0.1), rgba(18,20,23,0.1)) 3px,light-dark(rgba(251,252,253,0.1), rgba(18,20,23,0.1)) 4px)' }} />
          <span className="relative">▶ {children}</span>
        </button>
      </div>
    </>
  );
}
