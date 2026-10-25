"use client";

import * as React from "react";
import { useEffect, useState } from "react";

const css = `
  @keyframes glitch-a {
    0%,100% { clip-path:inset(0 0 92% 0); transform:translateX(-4px); }
    20%      { clip-path:inset(55% 0 33% 0); transform:translateX(4px); }
    40%      { clip-path:inset(15% 0 72% 0); transform:translateX(-3px); }
    60%      { clip-path:inset(78% 0 10% 0); transform:translateX(3px); }
    80%      { clip-path:inset(38% 0 48% 0); transform:translateX(-4px); }
  }
  @keyframes glitch-b {
    0%,100% { clip-path:inset(80% 0 8% 0); transform:translateX(4px); }
    25%     { clip-path:inset(22% 0 62% 0); transform:translateX(-4px); }
    50%     { clip-path:inset(60% 0 28% 0); transform:translateX(3px); }
    75%     { clip-path:inset(5% 0 85% 0); transform:translateX(-3px); }
  }
  .cg-root:hover .cg-a { animation: glitch-a 0.35s steps(1) infinite; }
  .cg-root:hover .cg-b { animation: glitch-b 0.35s steps(1) 0.05s infinite; }
  @media (prefers-reduced-motion: reduce) {
    .cg-root:hover .cg-a, .cg-root:hover .cg-b { animation: none; }
  }
`;

export function GlitchCard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const id = 'glitch-card-styles';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = css;
    document.head.appendChild(el);
  }, []);

  const [hovered, setHovered] = useState(false);

  const sharedClass =
    "absolute inset-0 rounded-xl border border-[color:light-dark(#373a40,#f1f2f3)]/10 bg-[color:light-dark(#fbfcfd,#121417)] overflow-hidden";

  return (
    <div
      className="cg-root relative cursor-pointer"
      style={{ width: 280, height: 180 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={sharedClass}>{children}</div>

      <div
        className={`cg-a pointer-events-none ${sharedClass}`}
        style={{
          filter: "invert(1)",
          opacity: hovered ? 0.85 : 0,
          clipPath: "inset(0 0 100% 0)",
        }}
      >
        {children}
      </div>

      <div
        className={`cg-b pointer-events-none ${sharedClass}`}
        style={{
          filter: "brightness(1.8) contrast(1.4)",
          opacity: hovered ? 0.7 : 0,
          clipPath: "inset(100% 0 0 0)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
