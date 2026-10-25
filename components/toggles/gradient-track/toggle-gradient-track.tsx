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
          background: linear-gradient(90deg, light-dark(#6d7179, #7d8087), light-dark(#6d7179, #7d8087), light-dark(#6d7179, #7d8087), light-dark(#50535b, #c6c8cd));
          background-size: 300% 100%;
          animation: track-drift 2.5s ease infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .gt-track[data-on] { animation: none; background: light-dark(#6d7179, #7d8087); }
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
          background: on ? undefined : 'light-dark(rgba(55,58,64,0.12), rgba(241,242,243,0.12))',
          transition: on ? 'none' : 'background 300ms ease',
        }}
      >
        <span
          className="block rounded-full bg-[color:light-dark(#373a40,#f1f2f3)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            width: 22, height: 22,
            transform: on ? 'translateX(22px)' : 'translateX(0)',
            boxShadow: on ? '0 0 8px light-dark(rgba(55,58,64,0.5), rgba(241,242,243,0.5))' : 'none',
          }}
        />
      </button>
    </>
  );
}
