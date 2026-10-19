"use client";

import * as React from "react";
export function LiquidFillInput({ placeholder = 'Focus for liquid…' }: { placeholder?: string }) {
  const [focused, setFocused] = React.useState(false);
  const phaseRef = React.useRef(0);
  const fillRef = React.useRef(100);
  const [clipPath, setClipPath] = React.useState('polygon(0% 100%,100% 100%,100% 100%,0% 100%)');
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const target = focused ? 65 : 100;
    if (prefersReduced) { setClipPath(`polygon(0% 100%,100% 100%,100% ${target}%,0% ${target}%)`); return; }
    const animate = () => {
      phaseRef.current += 0.06;
      fillRef.current += (target - fillRef.current) * 0.04;
      const f = fillRef.current, n = 20;
      const pts = [`0% 100%`,`100% 100%`,`100% ${f.toFixed(1)}%`];
      for (let i = n; i >= 0; i--) {
        const x = (i/n)*100, y = f - 4*Math.sin((x/100)*Math.PI*4 + phaseRef.current);
        pts.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
      }
      pts.push(`0% ${f.toFixed(1)}%`);
      setClipPath(`polygon(${pts.join(',')})`);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [focused]);

  return (
    <div className="relative w-full">
      <div
        className="pointer-events-none absolute inset-px rounded-[7px]"
        style={{
          background: 'linear-gradient(to top,rgba(167,167,167,0.3),rgba(167,167,167,0.1))',
          clipPath,
        }}
      />
      <input
        type="text"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="relative w-full rounded-lg border bg-transparent px-3.5 py-2.5 text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none transition-[border-color] duration-200"
        style={{ borderColor: focused ? 'rgba(167,167,167,0.5)' : 'rgba(246,246,246,0.15)' }}
      />
    </div>
  );
}
