"use client";

import * as React from "react";
const COLORS = ['light-dark(#373a40, #f1f2f3)','light-dark(#42454c, #e5e6e9)','light-dark(#50535b, #c6c8cd)','light-dark(#5f626a, #a7abb2)','light-dark(#6d7179, #7d8087)','light-dark(#373a40, #f1f2f3)','light-dark(#cbced3, #393c41)'];

export function ConfettiButton({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  function spawnParticles(e: React.MouseEvent<HTMLButtonElement>) {
    const container = containerRef.current;
    if (!container) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ox = e.clientX - rect.left;
    const oy = e.clientY - rect.top;

    for (let i = 0; i < 22; i++) {
      const angle = (Math.PI * 2 * i) / 22 + (Math.random() - 0.5) * 0.4;
      const speed = 55 + Math.random() * 80;
      const dur = 500 + Math.random() * 400;
      const tx = Math.cos(angle) * speed;
      const ty = Math.sin(angle) * speed - 30;
      const rot = (Math.random() - 0.5) * 720;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const w = 5 + Math.random() * 5;
      const h = 4 + Math.random() * 4;

      const el = document.createElement('div');
      el.setAttribute('data-confetti', '');
      el.style.cssText = `position:absolute;width:${w}px;height:${h}px;background:${color};border-radius:1px;left:${ox}px;top:${oy}px;pointer-events:none;--tx:${tx}px;--ty:${ty}px;--rot:${rot}deg;--dur:${dur}ms;transform-origin:center;`;
      container.appendChild(el);
      setTimeout(() => el.remove(), dur + 50);
    }
  }

  return (
    <>
      <style>{`
        @keyframes confetti-fly { to { transform: translate(var(--tx),var(--ty)) rotate(var(--rot)); opacity: 0; } }
        [data-confetti] { animation: confetti-fly var(--dur) ease-out forwards; }
        @media (prefers-reduced-motion: reduce) { [data-confetti] { animation: none; opacity: 0; } }
      `}</style>
      <div ref={containerRef} className="relative inline-block" style={{ overflow: 'visible' }}>
        <button
          type="button"
          onClick={spawnParticles}
          className="relative rounded-lg px-8 py-3 font-semibold text-[color:light-dark(#373a40,#f1f2f3)] cursor-pointer border-none"
          style={{ background: 'linear-gradient(135deg,light-dark(#5f626a, #a7abb2),light-dark(#6d7179, #7d8087))' }}
        >
          {children}
        </button>
      </div>
    </>
  );
}
