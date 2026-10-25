"use client";

import * as React from "react";
export function SpotlightInput({ placeholder = 'Hover to illuminate…' }: { placeholder?: string }) {
  const [focused, setFocused] = React.useState(false);
  const [spotX, setSpotX] = React.useState(50);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setSpotX(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <div ref={wrapRef} className="relative w-full" onMouseMove={handleMouseMove}>
      <div
        className="pointer-events-none absolute inset-px rounded-[7px] transition-opacity duration-200"
        style={{
          opacity: focused ? 1 : 0,
          background: `radial-gradient(ellipse 60px 100% at ${spotX}% 50%, light-dark(rgba(95,98,106,0.15), rgba(167,171,178,0.15)) 0%, transparent 80%)`,
        }}
      />
      <input
        type="text"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-lg border bg-[color:light-dark(#373a40,#f1f2f3)]/[0.04] px-3.5 py-2.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none transition-[border-color] duration-200"
        style={{ borderColor: focused ? 'light-dark(rgba(95,98,106,0.4), rgba(167,171,178,0.4))' : 'light-dark(rgba(55,58,64,0.12), rgba(241,242,243,0.12))' }}
      />
    </div>
  );
}
