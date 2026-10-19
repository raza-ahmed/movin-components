"use client";

import * as React from "react";
export function AuroraCard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @keyframes aurora-1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(26px,-12px); } }
        @keyframes aurora-2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-22px,16px); } }
        @keyframes aurora-3 { 0%,100% { transform: translate(0,0); } 40% { transform: translate(16px,10px); } 80% { transform: translate(-12px,-8px); } }
        .aurora-blob-1 { animation: aurora-1 5s ease-in-out infinite; }
        .aurora-blob-2 { animation: aurora-2 7s ease-in-out infinite; }
        .aurora-blob-3 { animation: aurora-3 6s ease-in-out infinite; }
        .aurora-card { border: 1px solid rgba(246,246,246,0.07); transition: border-color 400ms ease; }
        .aurora-card:hover { border-color: rgba(246,246,246,0.2); }
        .aurora-field { opacity: 0.6; transition: opacity 500ms ease, transform 700ms cubic-bezier(0.22,1,0.36,1); }
        .aurora-card:hover .aurora-field { opacity: 1; transform: scale(1.3); }
        @media (prefers-reduced-motion: reduce) {
          .aurora-blob-1, .aurora-blob-2, .aurora-blob-3 { animation: none; }
          .aurora-field { transition: opacity 500ms ease; }
          .aurora-card:hover .aurora-field { transform: none; }
        }
      `}</style>
      <div className="aurora-card relative cursor-pointer overflow-hidden rounded-xl" style={{ background: '#111111' }}>
        <div className="aurora-field absolute inset-0">
          <div className="aurora-blob-1 absolute -left-4 -top-6 h-[90px] w-[90px] rounded-full" style={{ background: '#c9c9c9', filter: 'blur(30px)', opacity: 0.55 }} />
          <div className="aurora-blob-2 absolute -right-[18px] top-2 h-[75px] w-[75px] rounded-full" style={{ background: '#a7a7a7', filter: 'blur(26px)', opacity: 0.5 }} />
          <div className="aurora-blob-3 absolute bottom-4 left-7 h-[65px] w-[65px] rounded-full" style={{ background: '#7c7c7c', filter: 'blur(22px)', opacity: 0.5 }} />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    </>
  );
}
