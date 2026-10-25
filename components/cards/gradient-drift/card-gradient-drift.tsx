"use client";

import * as React from "react";
export function GradientDriftCard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @keyframes gradient-drift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .drift-header {
          background: linear-gradient(270deg, light-dark(#6d7179, #7d8087), light-dark(#5f626a, #a7abb2), light-dark(#5f626a, #a7abb2), light-dark(#5f626a, #a7abb2), light-dark(#6d7179, #7d8087), light-dark(#6d7179, #7d8087));
          background-size: 500% 500%;
          animation: gradient-drift 8s ease infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .drift-header { animation: none; background-position: 0% 50%; }
        }
      `}</style>
      <div className="cursor-pointer overflow-hidden rounded-xl border border-[color:light-dark(#373a40,#f1f2f3)]/10 bg-[color:light-dark(#373a40,#f1f2f3)]/5">
        <div className="drift-header h-16" />
        {children}
      </div>
    </>
  );
}
