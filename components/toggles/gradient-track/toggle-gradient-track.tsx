"use client";

import * as React from "react";
export function GradientTrackToggle() {
  const [on, setOn] = React.useState(false);
  return (
    <>
      <style>{`
        @keyframes track-drift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        .gt-track[data-on] {
          background: linear-gradient(90deg, #7c7c7c, #7c7c7c, #7c7c7c, #c9c9c9);
          background-size: 300% 100%;
          animation: track-drift 2.5s ease infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .gt-track[data-on] { animation: none; background: #7c7c7c; }
        }
      `}</style>
      <button
        type="button"
        role="switch" aria-label="Notifications"
        aria-checked={on}
        {...(on ? { 'data-on': '' } : {})}
        onClick={() => setOn((v) => !v)}
        className="gt-track flex cursor-pointer items-center rounded-full border-none p-1"
        style={{
          width: 52, height: 30,
          background: on ? undefined : 'rgba(246,246,246,0.12)',
          transition: on ? 'none' : 'background 300ms ease',
        }}
      >
        <span
          className="block rounded-full bg-[#f6f6f6] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            width: 22, height: 22,
            transform: on ? 'translateX(22px)' : 'translateX(0)',
            boxShadow: on ? '0 0 8px rgba(246,246,246,0.5)' : 'none',
          }}
        />
      </button>
    </>
  );
}
