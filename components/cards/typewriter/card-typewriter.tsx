"use client";

import { useEffect, useRef, useState } from "react";

const css = `
  @keyframes tw-blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
  .tw-cursor { animation: tw-blink 0.8s step-start infinite; }
  @media (prefers-reduced-motion: reduce) { .tw-cursor { animation: none; } }
`;

export function TypewriterCard({
  title,
  description,
  hoverTitle,
  hoverDescription,
}: {
  title: string;
  description: string;
  hoverTitle: string;
  hoverDescription: string;
}) {
  const [displayTitle, setDisplayTitle] = useState(title);
  const [displayDesc, setDisplayDesc] = useState(description);
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = "tw-card-styles";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = css;
    document.head.appendChild(el);
  }, []);

  const erase = (
    current: string, target: string,
    setter: (v: string) => void, onDone: () => void,
  ) => {
    if (current.length > 0) {
      const next = current.slice(0, -1);
      setter(next);
      timer.current = setTimeout(() => erase(next, target, setter, onDone), 30);
    } else {
      let i = 0;
      const type = () => {
        setter(target.slice(0, ++i));
        if (i < target.length) timer.current = setTimeout(type, 45);
        else onDone();
      };
      timer.current = setTimeout(type, 80);
    }
  };

  const run = (t: string, d: string) => {
    if (timer.current) clearTimeout(timer.current);
    setTyping(true);
    erase(displayTitle, t, setDisplayTitle, () =>
      erase(displayDesc, d, setDisplayDesc, () => setTyping(false)),
    );
  };

  return (
    <div
      onMouseEnter={() => run(hoverTitle, hoverDescription)}
      onMouseLeave={() => run(title, description)}
      className="cursor-pointer overflow-hidden rounded-xl border border-[#f6f6f6]/10 bg-[#f6f6f6]/[0.04] font-mono"
    >
      <div className="flex h-16 items-center justify-center gap-1 bg-gradient-to-br from-[#111111] to-[#202020] text-xs text-[#c9c9c9]">
        <span>&gt; run</span>
        <span className="tw-cursor">_</span>
      </div>
      <div className="p-4">
        <p className="mb-1 text-sm font-semibold text-[#c9c9c9]">
          {displayTitle}
          {typing && <span className="tw-cursor ml-0.5">|</span>}
        </p>
        <p className="text-xs text-[#f6f6f6]/[0.55]">{displayDesc}</p>
      </div>
    </div>
  );
}
