"use client";

import * as React from "react";
export function NeonPulseInput({ placeholder = 'Focus for neon glow…' }: { placeholder?: string }) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="w-full">
      <style>{`
        @keyframes neon-breathe{
          0%,100%{box-shadow:0 0 4px rgba(167,167,167,0.5),0 0 12px rgba(167,167,167,0.3),0 0 24px rgba(167,167,167,0.15)}
          50%{box-shadow:0 0 8px rgba(167,167,167,0.8),0 0 20px rgba(167,167,167,0.5),0 0 40px rgba(167,167,167,0.25)}
        }
        @media(prefers-reduced-motion:reduce){.neon-inp{animation-play-state:paused!important}}
      `}</style>
      <input
        type="text"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="neon-inp w-full rounded-lg border px-3.5 py-2.5 text-[15px] outline-none transition-[background,border-color,color] duration-300"
        style={{
          background: focused ? 'rgba(167,167,167,0.06)' : 'rgba(246,246,246,0.04)',
          borderColor: focused ? 'rgba(167,167,167,0.6)' : 'rgba(246,246,246,0.12)',
          color: focused ? '#ededed' : '#f6f6f6',
          animation: focused ? 'neon-breathe 1.8s ease-in-out infinite' : 'none',
        }}
      />
    </div>
  );
}
