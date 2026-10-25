"use client";

import * as React from "react";
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';

export function ScrambleButton({ children }: { children: React.ReactNode }) {
  const label = typeof children === 'string' ? children.toUpperCase() : 'DECRYPT';
  const [text, setText] = React.useState(label);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const iterRef = React.useRef(0);

  function start() {
    iterRef.current = 0;
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      iterRef.current += 0.5;
      setText(
        label.split('').map((char, i) => {
          if (i < iterRef.current) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join(''),
      );
      if (iterRef.current >= label.length) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setText(label);
      }
    }, 40);
  }

  function stop() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setText(label);
  }

  return (
    <button
      type="button"
      onMouseEnter={start}
      onMouseLeave={stop}
      className="min-w-[148px] rounded-md border border-[color:light-dark(#6d7179,#7d8087)] bg-[color:light-dark(#fbfcfd,#121417)] px-8 py-3 font-mono font-semibold tracking-[0.15em] text-[color:light-dark(#50535b,#c6c8cd)] cursor-pointer"
      style={{ textShadow: '0 0 8px light-dark(rgba(80,83,91,0.5), rgba(198,200,205,0.5))', boxShadow: '0 0 12px light-dark(rgba(95,98,106,0.15), rgba(167,171,178,0.15))' }}
    >
      {text}
    </button>
  );
}
