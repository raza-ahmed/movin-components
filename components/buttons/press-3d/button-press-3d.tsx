"use client";

import * as React from "react";
export function Press3DButton({ children }: { children: React.ReactNode }) {
  const [pressed, setPressed] = React.useState(false);

  return (
    <button
      type="button"
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      className="relative select-none rounded-xl px-10 py-3 text-sm font-semibold uppercase tracking-widest text-[#f6f6f6] border-none cursor-pointer"
      style={{
        background: 'linear-gradient(180deg,#a7a7a7 0%,#7c7c7c 50%,#4d4d4d 100%)',
        transform: pressed ? 'translateY(5px)' : 'translateY(0)',
        boxShadow: pressed
          ? '0 1px 0 #282828, inset 0 1px 0 rgba(246,246,246,0.1)'
          : '0 6px 0 #282828, 0 9px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(246,246,246,0.2)',
        transition: 'transform 60ms ease, box-shadow 60ms ease',
      }}
    >
      {children}
    </button>
  );
}
