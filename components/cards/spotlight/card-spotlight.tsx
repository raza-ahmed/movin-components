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
      className="relative cursor-pointer overflow-hidden rounded-xl border bg-[#f6f6f6]/[0.04] transition-colors duration-300"
      style={{ borderColor: hovered ? "rgba(246,246,246,0.22)" : "rgba(246,246,246,0.1)" }}
    >
      {children}
      {/* The light: a soft radial gradient centred on the cursor, faded in on hover. */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-[250ms]"
        style={{
          background: `radial-gradient(140px circle at ${pos.x}px ${pos.y}px, rgba(246,246,246,0.16), transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }}
      />
    </div>
  );
}
