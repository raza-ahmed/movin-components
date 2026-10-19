"use client";

import * as React from "react";
export function BorderBeamButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <>
      <style>{`
        @keyframes btn-border-beam-spin { to { transform: rotate(360deg); } }
        .border-beam-wrap[data-hovered] .beam-spin { animation: btn-border-beam-spin 1.8s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .border-beam-wrap[data-hovered] .beam-spin { animation: none; }
        }
      `}</style>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...(hovered ? { 'data-hovered': '' } : {})}
        className="border-beam-wrap inline-block relative overflow-hidden"
        style={{ padding: '2px', borderRadius: '10px' }}
      >
        <span
          className="beam-spin absolute"
          style={{
            top: '50%', left: '50%',
            width: '400px', height: '400px',
            marginLeft: '-200px', marginTop: '-200px',
            background: 'conic-gradient(from 0deg,transparent 0%,#7c7c7c 8%,#a7a7a7 12%,transparent 18%)',
          }}
        />
        <button
          type="button"
          className="relative border-none px-8 py-3 font-semibold text-[#f6f6f6] cursor-pointer"
          style={{ background: '#202020', borderRadius: '8px' }}
        >
          {children}
        </button>
      </div>
    </>
  );
}
