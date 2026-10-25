"use client";

import * as React from "react";
export function PopForwardButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div className="inline-block" style={{ perspective: 600 }}>
      <button
        type="button"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="rounded-xl border border-[color:light-dark(#6d7179,#7d8087)] bg-[color:light-dark(#ebedf0,#232529)] px-9 py-3 font-semibold tracking-wide text-[color:light-dark(#50535b,#c6c8cd)] cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          transform: hovered ? 'translateZ(28px) scale(1.06)' : 'translateZ(0px) scale(1)',
          transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 300ms ease',
          boxShadow: hovered
            ? '0 24px 48px light-dark(rgba(109,113,121,0.45), rgba(125,128,135,0.45)), 0 8px 16px light-dark(rgba(0, 0, 0, 0.12), rgba(0,0,0,0.4))'
            : '0 4px 12px light-dark(rgba(0, 0, 0, 0.09), rgba(0,0,0,0.3))',
        }}
      >
        {children}
      </button>
    </div>
  );
}
