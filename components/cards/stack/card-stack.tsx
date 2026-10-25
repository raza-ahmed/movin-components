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
        className="absolute inset-0 rounded-xl border border-[color:light-dark(#373a40,#f1f2f3)]/[0.06] bg-gradient-to-br from-[color:light-dark(#ebedf0,#232529)] to-[color:light-dark(#dbdde1,#2e3035)] will-change-transform"
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
        className="absolute inset-0 rounded-xl border border-[color:light-dark(#373a40,#f1f2f3)]/[0.08] bg-gradient-to-br from-[color:light-dark(#ebedf0,#232529)] to-[color:light-dark(#cbced3,#393c41)] will-change-transform"
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
        className="absolute inset-0 flex flex-col justify-end rounded-xl border border-[color:light-dark(#373a40,#f1f2f3)]/10 bg-gradient-to-br from-[color:light-dark(#fbfcfd,#121417)] to-[color:light-dark(#f3f4f7,#1a1c1f)] p-5 will-change-transform"
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
