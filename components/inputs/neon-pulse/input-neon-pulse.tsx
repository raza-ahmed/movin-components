"use client";

import * as React from "react";
export function NeonPulseInput({ placeholder = 'Focus for neon glow…' }: { placeholder?: string }) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="w-full">
      <style>{`
        @keyframes neon-breathe{
          0%,100%{box-shadow:0 0 4px light-dark(rgba(95,98,106,0.5), rgba(167,171,178,0.5)),0 0 12px light-dark(rgba(95,98,106,0.3), rgba(167,171,178,0.3)),0 0 24px light-dark(rgba(95,98,106,0.15), rgba(167,171,178,0.15))}
          50%{box-shadow:0 0 8px light-dark(rgba(95,98,106,0.8), rgba(167,171,178,0.8)),0 0 20px light-dark(rgba(95,98,106,0.5), rgba(167,171,178,0.5)),0 0 40px light-dark(rgba(95,98,106,0.25), rgba(167,171,178,0.25))}
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
          background: focused ? 'light-dark(rgba(95,98,106,0.06), rgba(167,171,178,0.06))' : 'light-dark(rgba(55,58,64,0.04), rgba(241,242,243,0.04))',
          borderColor: focused ? 'light-dark(rgba(95,98,106,0.6), rgba(167,171,178,0.6))' : 'light-dark(rgba(55,58,64,0.12), rgba(241,242,243,0.12))',
          color: focused ? 'light-dark(#42454c, #e5e6e9)' : 'light-dark(#373a40, #f1f2f3)',
          animation: focused ? 'neon-breathe 1.8s ease-in-out infinite' : 'none',
        }}
      />
    </div>
  );
}
