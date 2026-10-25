"use client";

import { useState } from 'react';

export function NeumorphicToggle() {
  const [on, setOn] = useState(false);

  return (
    <button
      type="button"
      role="switch" aria-label="Notifications"
      aria-checked={on}
      onClick={() => setOn(v => !v)}
      className="relative h-8 w-[60px] cursor-pointer rounded-full border-none transition-shadow duration-300"
      style={{
        background: 'light-dark(#f3f4f7, #1a1c1f)',
        boxShadow: on
          ? 'inset 3px 3px 7px rgba(0,0,0,0.7), inset -2px -2px 5px light-dark(rgba(55,58,64,0.04), rgba(241,242,243,0.04)), 0 0 0 1px light-dark(rgba(109,113,121,0.3), rgba(125,128,135,0.3))'
          : 'inset 3px 3px 7px rgba(0,0,0,0.7), inset -2px -2px 5px light-dark(rgba(55,58,64,0.04), rgba(241,242,243,0.04))',
      }}
    >
      <span
        className="absolute inset-0 rounded-full transition-colors duration-300"
        style={{
          background: on
            ? 'linear-gradient(135deg, light-dark(rgba(109,113,121,0.18), rgba(125,128,135,0.18)) 0%, light-dark(rgba(109,113,121,0.1), rgba(125,128,135,0.1)) 100%)'
            : 'transparent',
        }}
      />
      <span
        className="absolute top-[5px] h-[22px] w-[22px] rounded-full transition-all duration-300"
        style={{
          left: on ? 33 : 5,
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          background: on
            ? 'linear-gradient(135deg, light-dark(#5f626a, #a7abb2) 0%, light-dark(#6d7179, #7d8087) 100%)'
            : 'linear-gradient(145deg, light-dark(#ebedf0, #232529) 0%, light-dark(#f3f4f7, #1a1c1f) 100%)',
          boxShadow: on
            ? '3px 3px 6px rgba(0,0,0,0.5), -1px -1px 4px light-dark(rgba(55,58,64,0.06), rgba(241,242,243,0.06)), 0 0 10px light-dark(rgba(109,113,121,0.5), rgba(125,128,135,0.5))'
            : '3px 3px 6px rgba(0,0,0,0.5), -1px -1px 4px light-dark(rgba(55,58,64,0.06), rgba(241,242,243,0.06))',
        }}
      />
    </button>
  );
}
