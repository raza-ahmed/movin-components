"use client";

import { useEffect, useState } from 'react';

const KEYFRAMES = `
@keyframes liquid-on {
  0%   { left: 4px;  width: 22px; border-radius: 9999px; }
  40%  { left: 4px;  width: 44px; border-radius: 12px;   }
  100% { left: 26px; width: 22px; border-radius: 9999px; }
}
@keyframes liquid-off {
  0%   { left: 26px; width: 22px; border-radius: 9999px; }
  40%  { left: 6px;  width: 44px; border-radius: 12px;   }
  100% { left: 4px;  width: 22px; border-radius: 9999px; }
}
@media (prefers-reduced-motion: reduce) {
  [data-liquid-knob] { animation-duration: 0ms !important; }
}
`;

export function LiquidToggle() {
  const [on, setOn] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState<'on' | 'off' | null>(null);

  useEffect(() => {
    const id = 'anim-toggle-liquid';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    setDirection(next ? 'on' : 'off');
    setAnimKey(k => k + 1);
  };

  return (
    <button
      type="button"
      role="switch" aria-label="Notifications"
      aria-checked={on}
      onClick={toggle}
      className="relative h-[30px] w-[52px] cursor-pointer rounded-full border-2 transition-all duration-300"
      style={{
        background: on ? 'rgba(167,167,167,0.25)' : 'rgba(246,246,246,0.1)',
        borderColor: on ? 'rgba(167,167,167,0.6)' : 'rgba(246,246,246,0.15)',
      }}
    >
      <span
        key={animKey}
        data-liquid-knob
        className="absolute top-1 h-[18px]"
        style={{
          background: on ? 'linear-gradient(90deg, #a7a7a7 0%, #c9c9c9 100%)' : 'rgba(246,246,246,0.7)',
          boxShadow: on ? '0 0 8px rgba(167,167,167,0.5)' : 'none',
          animation: direction ? `liquid-${direction} 420ms cubic-bezier(0.4,0,0.2,1) forwards` : undefined,
          left: direction ? undefined : on ? 26 : 4,
          width: direction ? undefined : 22,
          borderRadius: direction ? undefined : 9999,
        }}
      />
    </button>
  );
}
