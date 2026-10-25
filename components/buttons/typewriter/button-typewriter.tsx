"use client";

import * as React from "react";
const LABEL_A = 'Hover Me';
const LABEL_B = 'Hello!';

export function TypewriterButton() {
  const [displayed, setDisplayed] = React.useState(LABEL_A);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const currentRef = React.useRef(LABEL_A);

  function clearTimer() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function animateTo(target: string) {
    clearTimer();
    let chars = currentRef.current.split('');
    intervalRef.current = setInterval(() => {
      if (chars.length > 0) {
        chars = chars.slice(0, -1);
        currentRef.current = chars.join('');
        setDisplayed(currentRef.current);
      } else {
        clearTimer();
        let i = 0;
        intervalRef.current = setInterval(() => {
          if (i <= target.length) {
            currentRef.current = target.slice(0, i);
            setDisplayed(currentRef.current);
            i++;
          } else {
            clearTimer();
          }
        }, 55);
      }
    }, 45);
  }

  return (
    <button
      type="button"
      onMouseEnter={() => animateTo(LABEL_B)}
      onMouseLeave={() => animateTo(LABEL_A)}
      className="min-w-[140px] rounded-lg border border-[color:light-dark(#cbced3,#393c41)] bg-[color:light-dark(#f3f4f7,#1a1c1f)] px-8 py-3 font-mono font-semibold tracking-wider text-[color:light-dark(#42454c,#e5e6e9)] cursor-pointer"
    >
      {displayed}
      <span className="opacity-50">|</span>
    </button>
  );
}
