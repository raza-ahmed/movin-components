"use client";

import * as React from "react";
export function HoverLiftCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="cursor-pointer overflow-hidden rounded-xl border border-[color:light-dark(#373a40,#f1f2f3)]/10 bg-[color:light-dark(#373a40,#f1f2f3)]/5 shadow-[0_2px_8px_light-dark(rgba(251,252,253,0.2), rgba(18,20,23,0.2))] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.2,0.64,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_light-dark(rgba(251,252,253,0.5), rgba(18,20,23,0.5)),0_8px_16px_light-dark(rgba(251,252,253,0.3), rgba(18,20,23,0.3))] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {children}
    </div>
  );
}
