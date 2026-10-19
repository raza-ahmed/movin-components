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
        background: '#202020',
        boxShadow: on
          ? 'inset 3px 3px 7px rgba(0,0,0,0.7), inset -2px -2px 5px rgba(246,246,246,0.04), 0 0 0 1px rgba(124,124,124,0.3)'
          : 'inset 3px 3px 7px rgba(0,0,0,0.7), inset -2px -2px 5px rgba(246,246,246,0.04)',
      }}
    >
      <span
        className="absolute inset-0 rounded-full transition-colors duration-300"
        style={{
          background: on
            ? 'linear-gradient(135deg, rgba(124,124,124,0.18) 0%, rgba(124,124,124,0.1) 100%)'
            : 'transparent',
        }}
      />
      <span
        className="absolute top-[5px] h-[22px] w-[22px] rounded-full transition-all duration-300"
        style={{
          left: on ? 33 : 5,
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          background: on
            ? 'linear-gradient(135deg, #a7a7a7 0%, #7c7c7c 100%)'
            : 'linear-gradient(145deg, #282828 0%, #202020 100%)',
          boxShadow: on
            ? '3px 3px 6px rgba(0,0,0,0.5), -1px -1px 4px rgba(246,246,246,0.06), 0 0 10px rgba(124,124,124,0.5)'
            : '3px 3px 6px rgba(0,0,0,0.5), -1px -1px 4px rgba(246,246,246,0.06)',
        }}
      />
    </button>
  );
}
