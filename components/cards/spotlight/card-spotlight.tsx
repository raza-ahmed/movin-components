"use client";

import * as React from "react";
import { useRef, useState } from "react";

export function SpotlightCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer overflow-hidden rounded-xl border bg-[color:light-dark(#373a40,#f1f2f3)]/[0.04] transition-colors duration-300"
      style={{ borderColor: hovered ? "light-dark(rgba(55,58,64,0.22), rgba(241,242,243,0.22))" : "light-dark(rgba(55,58,64,0.1), rgba(241,242,243,0.1))" }}
    >
      {children}
      {/* The light: a soft radial gradient centred on the cursor, faded in on hover. */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-[250ms]"
        style={{
          background: `radial-gradient(140px circle at ${pos.x}px ${pos.y}px, light-dark(rgba(55,58,64,0.16), rgba(241,242,243,0.16)), transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }}
      />
    </div>
  );
}
