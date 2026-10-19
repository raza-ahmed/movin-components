"use client";

import * as React from "react";
export function ShockwaveButton({ children }: { children: React.ReactNode }) {
  const btnRef = React.useRef<HTMLButtonElement>(null);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const waves = [
      { delay: '0ms',   dur: '500ms', color: 'rgba(246,246,246,0.85)' },
      { delay: '120ms', dur: '520ms', color: 'rgba(246,246,246,0.6)' },
      { delay: '240ms', dur: '540ms', color: 'rgba(246,246,246,0.4)' },
    ];

    for (const wave of waves) {
      const el = document.createElement('span');
      el.setAttribute('data-shock', '');
      el.style.cssText = `position:absolute;width:36px;height:36px;border-radius:50%;border:2px solid ${wave.color};background:transparent;left:${x}px;top:${y}px;pointer-events:none;--delay:${wave.delay};--dur:${wave.dur};`;
      btn.appendChild(el);
      setTimeout(() => el.remove(), 900);
    }
  }

  return (
    <>
      <style>{`
        @keyframes btn-shockwave {
          from { transform: translate(-50%,-50%) scale(0.1); opacity: 0.9; }
          to   { transform: translate(-50%,-50%) scale(6); opacity: 0; }
        }
        [data-shock] { opacity: 0; animation: btn-shockwave var(--dur) ease-out var(--delay) forwards; }
        .shockwave-btn { transition: transform 150ms ease, filter 200ms ease; }
        .shockwave-btn:hover { filter: brightness(1.12); }
        .shockwave-btn:active { transform: scale(0.96); }
        @media (prefers-reduced-motion: reduce) { [data-shock] { animation: none; opacity: 0; } }
      `}</style>
      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        className="shockwave-btn relative overflow-hidden rounded-lg border-none px-8 py-3 font-semibold text-[#f6f6f6] cursor-pointer"
        style={{ background: 'linear-gradient(135deg,#4d4d4d,#7c7c7c)' }}
      >
        <span className="relative z-10">{children}</span>
      </button>
    </>
  );
}
