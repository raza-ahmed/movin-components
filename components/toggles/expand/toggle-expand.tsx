"use client";

import * as React from "react";
export function ExpandToggle() {
  const [on, setOn] = React.useState(false);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Toggle"
      onClick={() => setOn((v) => !v)}
      className="relative cursor-pointer overflow-hidden rounded-full border-none p-0 motion-reduce:[&_span]:transition-none"
      style={{
        width: 56,
        height: 30,
        background: on ? 'light-dark(rgba(109,113,121,0.12), rgba(125,128,135,0.12))' : 'light-dark(rgba(55,58,64,0.08), rgba(241,242,243,0.08))',
        border: `1.5px solid ${on ? 'light-dark(rgba(109,113,121,0.4), rgba(125,128,135,0.4))' : 'light-dark(rgba(55,58,64,0.14), rgba(241,242,243,0.14))'}`,
        transition: 'background 300ms ease, border-color 300ms ease',
      }}
    >
      <span
        className="absolute rounded-full"
        style={{
          top: on ? 0 : 3,
          left: on ? 0 : 3,
          width: on ? '100%' : 22,
          height: on ? '100%' : 22,
          background: on ? 'light-dark(#6d7179, #7d8087)' : 'light-dark(rgba(55,58,64,0.5), rgba(241,242,243,0.5))',
          transition: 'top 350ms cubic-bezier(0.4,0,0.2,1), left 350ms cubic-bezier(0.4,0,0.2,1), width 350ms cubic-bezier(0.4,0,0.2,1), height 350ms cubic-bezier(0.4,0,0.2,1), background 300ms ease',
        }}
      />
    </button>
  );
}
