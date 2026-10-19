"use client";

import * as React from "react";
type LockState = 'idle' | 'loading' | 'done';

export function LoadingLockButton({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<LockState>('idle');

  function handleClick() {
    if (state !== 'idle') return;
    setState('loading');
    setTimeout(() => {
      setState('done');
      setTimeout(() => setState('idle'), 2000);
    }, 1600);
  }

  return (
    <>
      <style>{`
        @keyframes btn-spin { to { transform: rotate(360deg); } }
        [data-spinning] { animation: btn-spin 700ms linear infinite; }
        @media (prefers-reduced-motion: reduce) { [data-spinning] { animation: none; } }
      `}</style>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex min-w-[180px] items-center justify-center gap-2.5 rounded-lg border px-7 py-3 font-semibold tracking-wider transition-all duration-400"
        style={{
          background: state === 'done' ? 'linear-gradient(135deg,#282828,#3a3a3a)' : 'linear-gradient(135deg,#282828,#3a3a3a)',
          color: state === 'done' ? '#c9c9c9' : '#c9c9c9',
          borderColor: state === 'done' ? '#a7a7a7' : '#7c7c7c',
          cursor: state === 'idle' ? 'pointer' : 'default',
        }}
      >
        {state === 'loading' && (
          <svg data-spinning width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="#7c7c7c" strokeWidth="2" strokeDasharray="20 18" strokeLinecap="round" />
          </svg>
        )}
        {state === 'done' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l4 4 6-6" stroke="#c9c9c9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {state === 'idle' && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="#a7a7a7" strokeWidth="1.5" />
            <path d="M4.5 6V4a2.5 2.5 0 015 0v2" stroke="#a7a7a7" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
        {state === 'idle' && children}
        {state === 'loading' && 'UNLOCKING…'}
        {state === 'done' && 'UNLOCKED'}
      </button>
    </>
  );
}
