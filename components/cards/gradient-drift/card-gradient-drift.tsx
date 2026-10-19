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
          background: linear-gradient(270deg, #7c7c7c, #a7a7a7, #a7a7a7, #a7a7a7, #7c7c7c, #7c7c7c);
          background-size: 500% 500%;
          animation: gradient-drift 8s ease infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .drift-header { animation: none; background-position: 0% 50%; }
        }
      `}</style>
      <div className="cursor-pointer overflow-hidden rounded-xl border border-[#f6f6f6]/10 bg-[#f6f6f6]/5">
        <div className="drift-header h-16" />
        {children}
      </div>
    </>
  );
}
