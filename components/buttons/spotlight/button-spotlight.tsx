"use client";

import * as React from "react";
export function SpotlightButton({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = React.useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty('--sx', `${e.clientX - rect.left}px`);
    btn.style.setProperty('--sy', `${e.clientY - rect.top}px`);
  }

  return (
    <button
      ref={ref}
      type="button"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer overflow-hidden rounded-lg border bg-[#202020] px-8 py-3 font-medium tracking-wide text-[#f6f6f6] transition-colors duration-[250ms]"
      style={{ borderColor: hovered ? 'rgba(246,246,246,0.28)' : 'rgba(246,246,246,0.12)' }}
    >
      {/* The light: centred on the cursor, faded in on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-[250ms]"
        style={{
          background: 'radial-gradient(70px circle at var(--sx, 50%) var(--sy, 50%), rgba(246,246,246,0.26), transparent 70%)',
          opacity: hovered ? 1 : 0,
        }}
      />
      <span className="relative">{children}</span>
    </button>
  );
}
