"use client";

import * as React from "react";
export function BrutalistInput({ placeholder = "Neo-brutal input…" }: { placeholder?: string }) {
  const [focused, setFocused] = React.useState(false);

  return (
    <input
      type="text"
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="w-full bg-[color:light-dark(#373a40,#f1f2f3)] font-semibold text-[color:light-dark(#fbfcfd,#121417)] placeholder:text-[color:light-dark(#fbfcfd,#121417)]/40 outline-none"
      style={{
        border: focused ? '3px solid light-dark(#fbfcfd, #121417)' : '2px solid light-dark(#fbfcfd, #121417)',
        borderRadius: 0,
        fontSize: 15,
        padding: focused ? '9px 13px' : '10px 14px',
        boxShadow: focused ? '4px 4px 0 #000' : '8px 8px 0 #000',
        transform: focused ? 'translate(4px,4px)' : 'translate(0,0)',
        transition: 'box-shadow 120ms cubic-bezier(0.22,1,0.36,1),transform 120ms cubic-bezier(0.22,1,0.36,1),border 120ms cubic-bezier(0.22,1,0.36,1),padding 120ms cubic-bezier(0.22,1,0.36,1)',
      }}
    />
  );
}
