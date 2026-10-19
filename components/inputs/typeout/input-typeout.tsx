"use client";

import * as React from "react";
const FULL_TEXT = 'Type something amazing…';

export function TypeoutInput() {
  const [focused, setFocused] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [typed, setTyped] = React.useState('');
  const indexRef = React.useRef(0);

  React.useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (focused || value.length > 0) return;
    if (prefersReduced) { setTyped(FULL_TEXT); return; }
    indexRef.current = 0;
    setTyped('');
    const id = setInterval(() => {
      indexRef.current += 1;
      setTyped(FULL_TEXT.slice(0, indexRef.current));
      if (indexRef.current >= FULL_TEXT.length) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, [focused, value]);

  const showPlaceholder = !focused && value.length === 0;

  return (
    <div className="relative w-full">
      <input aria-label="Your message"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-lg border bg-[#f6f6f6]/[0.06] px-3.5 py-2.5 text-[15px] text-[#f6f6f6] outline-none transition-[border-color] duration-200"
        style={{ borderColor: focused ? 'rgba(167,167,167,0.5)' : 'rgba(246,246,246,0.15)' }}
      />
      {showPlaceholder && (
        <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center gap-0.5 text-[15px] text-[#f6f6f6]/[0.55]">
          <span>{typed}</span>
          {typed.length < FULL_TEXT.length && (
            <span className="inline-block h-4 w-px bg-[#f6f6f6]/50" />
          )}
        </div>
      )}
    </div>
  );
}
