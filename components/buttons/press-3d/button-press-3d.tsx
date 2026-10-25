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
      className="relative select-none rounded-xl px-10 py-3 text-sm font-semibold uppercase tracking-widest text-[color:light-dark(#373a40,#f1f2f3)] border-none cursor-pointer"
      style={{
        background: 'linear-gradient(180deg,light-dark(#5f626a, #a7abb2) 0%,light-dark(#6d7179, #7d8087) 50%,light-dark(#cbced3, #393c41) 100%)',
        transform: pressed ? 'translateY(5px)' : 'translateY(0)',
        boxShadow: pressed
          ? '0 1px 0 light-dark(#ebedf0, #232529), inset 0 1px 0 light-dark(rgba(55,58,64,0.1), rgba(241,242,243,0.1))'
          : '0 6px 0 light-dark(#ebedf0, #232529), 0 9px 14px rgba(0,0,0,0.4), inset 0 1px 0 light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))',
        transition: 'transform 60ms ease, box-shadow 60ms ease',
      }}
    >
      {children}
    </button>
  );
}
