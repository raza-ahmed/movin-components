"use client";

import * as React from "react";
const SCALE = 0.8;
const LIFT = -36;
const STAGGER = 45;

export function SplitLabelInput({ label = 'Your name' }: { label?: string }) {
  const id = React.useId();
  const [focused, setFocused] = React.useState(false);
  const [value, setValue] = React.useState('');
  const active = focused || value.length > 0;
  const words = label.split(' ');

  // Each word shrinks about its own left edge, so pull it left by the share of
  // its offset the shrink removes; the floated label then keeps even spacing.
  const wordRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const [shifts, setShifts] = React.useState<number[]>([]);
  React.useLayoutEffect(() => {
    setShifts(wordRefs.current.map((w) => (w ? -w.offsetLeft * (1 - SCALE) : 0)));
  }, [label]);

  return (
    <div className="relative w-full pt-[22px]">
      <style>{`@media(prefers-reduced-motion:reduce){.split-word{transition:none!important}}`}</style>
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-[15px] top-[22px] flex h-[46px] items-center gap-[5px] whitespace-nowrap text-sm"
      >
        {words.map((word, i) => (
          <span
            key={i}
            ref={(el) => { wordRefs.current[i] = el; }}
            className="split-word inline-block origin-left"
            style={{
              transform: active ? `translate(${shifts[i] ?? 0}px, ${LIFT}px) scale(${SCALE})` : 'none',
              color: active ? '#ededed' : '#a7a7a7',
              fontWeight: active ? 500 : 400,
              transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), color 250ms ease',
              // Rise left to right; settle back right to left.
              transitionDelay: `${(active ? i : words.length - 1 - i) * STAGGER}ms`,
            }}
          >
            {word}
          </span>
        ))}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-[46px] w-full rounded-[10px] border bg-[#f6f6f6]/[0.04] px-3.5 text-sm text-[#f6f6f6] outline-none transition-[border-color] duration-[250ms]"
        style={{ borderColor: active ? '#a7a7a7' : '#3a3a3a' }}
      />
    </div>
  );
}
