"use client";

import * as React from "react";
export function HudBracketsInput({ placeholder = "Targeting…" }: { placeholder?: string }) {
  const [focused, setFocused] = React.useState(false);

  const bracket = (corner: 'tl' | 'tr' | 'bl' | 'br'): React.CSSProperties => {
    const isTop = corner.startsWith('t');
    const isLeft = corner.endsWith('l');
    const gap = focused ? -4 : 4;
    return {
      position: 'absolute',
      width: 10, height: 10,
      borderColor: focused ? '#a7a7a7' : 'rgba(167,167,167,0.3)',
      borderStyle: 'solid',
      borderTopWidth: isTop ? 2 : 0,
      borderBottomWidth: isTop ? 0 : 2,
      borderLeftWidth: isLeft ? 2 : 0,
      borderRightWidth: isLeft ? 0 : 2,
      top: isTop ? gap : undefined,
      bottom: isTop ? undefined : gap,
      left: isLeft ? gap : undefined,
      right: isLeft ? undefined : gap,
      transition: 'all 220ms cubic-bezier(0.22,1,0.36,1)',
    };
  };

  return (
    <div className="w-full">
      <style>{`@media(prefers-reduced-motion:reduce){.hud-br{transition:none!important}}`}</style>
      <div className="relative p-1">
        {(['tl','tr','bl','br'] as const).map((c) => (
          <span key={c} className="hud-br" style={bracket(c)} />
        ))}
        <input
          type="text"
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded border px-3 py-2 text-sm font-mono outline-none transition-all duration-[220ms]"
          style={{
            background: focused ? 'rgba(167,167,167,0.04)' : 'rgba(246,246,246,0.04)',
            borderColor: focused ? 'rgba(167,167,167,0.4)' : 'rgba(246,246,246,0.12)',
            color: focused ? '#c9c9c9' : '#f6f6f6',
            letterSpacing: focused ? '0.05em' : '0',
          }}
        />
      </div>
    </div>
  );
}
