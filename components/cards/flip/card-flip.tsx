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
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl overflow-hidden border border-[#f6f6f6]/10 bg-[#f6f6f6]/5">
          {front}
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl overflow-hidden border border-[#7c7c7c]/40 bg-[#282828]">
          {back}
        </div>
      </div>
    </div>
  );
}
