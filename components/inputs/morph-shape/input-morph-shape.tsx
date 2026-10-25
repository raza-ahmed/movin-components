"use client";

import * as React from "react";
const MORPH: Keyframe[] = [{ borderRadius: '2px' }, { borderRadius: '50px', offset: 0.3 }, { borderRadius: '10px' }];

export function MorphShapeInput({ placeholder = 'Focus to morph…', label = 'Your message' }: { placeholder?: string; label?: string }) {
  const ref = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);

  const handleFocus = () => {
    setFocused(true);
    // Replay the morph on the SAME element: remounting it (a changing key) would drop focus and the text.
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ref.current?.animate(MORPH, { duration: 500, easing: 'cubic-bezier(0.22,1,0.36,1)' });
    }
  };

  return (
    <input
      ref={ref}
      type="text"
      aria-label={label}
      placeholder={placeholder}
      onFocus={handleFocus}
      onBlur={() => setFocused(false)}
      className="w-full border bg-[color:light-dark(#373a40,#f1f2f3)]/[0.06] px-3.5 py-2.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none transition-[border-color,border-radius] duration-300"
      style={{
        borderColor: focused ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.15), rgba(241,242,243,0.15))',
        borderRadius: focused ? 10 : 2,
      }}
    />
  );
}
