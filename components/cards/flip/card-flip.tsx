"use client";

import * as React from "react";
import { useState } from "react";

export function FlipCard({
  front,
  back,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="[perspective:800px] w-64 h-40">
      <div
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        className="relative w-full h-full [transform-style:preserve-3d] cursor-pointer transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl overflow-hidden border border-[color:light-dark(#373a40,#f1f2f3)]/10 bg-[color:light-dark(#373a40,#f1f2f3)]/5">
          {front}
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl overflow-hidden border border-[color:light-dark(#6d7179,#7d8087)]/40 bg-[color:light-dark(#ebedf0,#232529)]">
          {back}
        </div>
      </div>
    </div>
  );
}
