"use client";

import * as React from "react";
const PARTICLES = [
  { x: -1, y: -1, dx: -12, dy: -12 },{ x: -1, y: -1, dx: -18, dy: -6 },
  { x: 1, y: -1, dx: 12, dy: -12 },  { x: 1, y: -1, dx: 18, dy: -6 },
  { x: -1, y: 1, dx: -12, dy: 12 },  { x: -1, y: 1, dx: -18, dy: 6 },
  { x: 1, y: 1, dx: 12, dy: 12 },    { x: 1, y: 1, dx: 18, dy: 6 },
];
const COLORS = ['light-dark(#5f626a, #a7abb2)','light-dark(#5f626a, #a7abb2)','light-dark(#5f626a, #a7abb2)','light-dark(#5f626a, #a7abb2)','light-dark(#5f626a, #a7abb2)'];

export function ParticleBurstInput({ placeholder = 'Focus to burst…' }: { placeholder?: string }) {
  const [burstKey, setBurstKey] = React.useState(0);

  return (
    <div className="relative w-full overflow-visible">
      <style>{`
        @keyframes p-fly{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}}
        @media(prefers-reduced-motion:reduce){.p-dot{display:none!important}}
      `}</style>
      <input
        type="text"
        placeholder={placeholder}
        onFocus={() => setBurstKey((k) => k + 1)}
        className="w-full rounded-lg border bg-[color:light-dark(#373a40,#f1f2f3)]/[0.06] px-3.5 py-2.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none"
        style={{ borderColor: 'light-dark(rgba(55,58,64,0.15), rgba(241,242,243,0.15))' }}
      />
      {burstKey > 0 && PARTICLES.map((p, i) => (
        <div
          key={`${burstKey}-${i}`}
          className="p-dot pointer-events-none absolute h-1.5 w-1.5 rounded-full"
          style={{
            background: COLORS[i % COLORS.length],
            left: p.x < 0 ? 4 : 'auto', right: p.x > 0 ? 4 : 'auto',
            top: p.y < 0 ? 4 : 'auto', bottom: p.y > 0 ? 4 : 'auto',
            ['--dx' as string]: `${p.dx}px`, ['--dy' as string]: `${p.dy}px`,
            animation: `p-fly 500ms ease-out ${i * 30}ms both`,
          }}
        />
      ))}
    </div>
  );
}
