"use client";

import * as React from "react";
import { useState } from "react";

export function WipeRevealCard({
  front,
  revealed,
}: {
  front: React.ReactNode;
  revealed: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer overflow-hidden rounded-xl border border-[#f6f6f6]/10 bg-[#111111]"
    >
      {/* Revealed content — wipes in from bottom */}
      <div
        style={{
          clipPath: hovered ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          transition: "clip-path 380ms cubic-bezier(0.76,0,0.24,1)",
        }}
      >
        {revealed}
      </div>

      {/* Placeholder — fades out */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: hovered ? 0 : 1,
          transition: "opacity 180ms ease",
        }}
      >
        {front}
      </div>
    </div>
  );
}
