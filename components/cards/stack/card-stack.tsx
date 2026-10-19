"use client";

import * as React from "react";
import { useState } from "react";

export function StackCard({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);

  const spring = "transform 380ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 380ms ease";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer"
      style={{ width: 280, height: 180 }}
    >
      {/* Back card */}
      <div
        className="absolute inset-0 rounded-xl border border-[#f6f6f6]/[0.06] bg-gradient-to-br from-[#282828] to-[#3a3a3a] will-change-transform"
        style={{
          transform: hovered
            ? "translate(-16px, 10px) rotate(-6deg)"
            : "translate(-6px, 6px) rotate(-3deg)",
          boxShadow: hovered ? "0 12px 28px rgba(0,0,0,0.35)" : "0 4px 10px rgba(0,0,0,0.2)",
          transition: spring,
        }}
      />
      {/* Middle card */}
      <div
        className="absolute inset-0 rounded-xl border border-[#f6f6f6]/[0.08] bg-gradient-to-br from-[#282828] to-[#4d4d4d] will-change-transform"
        style={{
          transform: hovered
            ? "translate(14px, 8px) rotate(5deg)"
            : "translate(4px, 4px) rotate(2deg)",
          boxShadow: hovered ? "0 12px 28px rgba(0,0,0,0.3)" : "0 4px 10px rgba(0,0,0,0.18)",
          transition: spring,
        }}
      />
      {/* Front card */}
      <div
        className="absolute inset-0 flex flex-col justify-end rounded-xl border border-[#f6f6f6]/10 bg-gradient-to-br from-[#111111] to-[#202020] p-5 will-change-transform"
        style={{
          transform: hovered ? "translate(0, -6px)" : "translate(0, 0)",
          boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.5)" : "0 6px 16px rgba(0,0,0,0.25)",
          transition: spring,
        }}
      >
        {children}
      </div>
    </div>
  );
}
