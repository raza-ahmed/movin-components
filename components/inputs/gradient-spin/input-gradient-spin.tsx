"use client";

import * as React from "react";
const W = 320, H = 44;
const DIAG = Math.ceil(Math.sqrt(W * W + H * H));

export function GradientSpinInput({ placeholder = 'Focus for spin…' }: { placeholder?: string }) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="w-full">
      <style>{`
        @keyframes grad-spin{to{transform:translate(-50%,-50%) rotate(360deg)}}
        @media(prefers-reduced-motion:reduce){.grad-spin-bg{animation-play-state:paused!important}}
      `}</style>
      <div
        className="relative overflow-hidden rounded-lg"
        style={{ height: H, background: focused ? 'transparent' : 'rgba(246,246,246,0.04)', border: focused ? 'none' : '1px solid rgba(246,246,246,0.12)' }}
      >
        <div
          className="grad-spin-bg absolute"
          style={{
            width: DIAG, height: DIAG,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            background: 'conic-gradient(from 0deg,#7c7c7c,#a7a7a7,#7c7c7c,#a7a7a7,#7c7c7c)',
            opacity: focused ? 1 : 0,
            transition: 'opacity 300ms ease',
            animation: 'grad-spin 2s linear infinite',
            animationPlayState: focused ? 'running' : 'paused',
          }}
        />
        <div
          className="absolute rounded-[6px] flex items-center"
          style={{ inset: focused ? 2 : 1, background: '#111111', transition: 'inset 300ms ease' }}
        >
          <input
            type="text"
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent border-none text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none px-3.5"
          />
        </div>
      </div>
    </div>
  );
}
