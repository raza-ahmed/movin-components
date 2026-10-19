"use client";

export function OrbitLoader({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes orbit-spin { to { transform: rotate(360deg); } }
        .orbit-arm { animation: orbit-spin 1.2s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .orbit-arm { animation: none; }
        }
      `}</style>
      <div
        role="status"
        aria-label={label}
        className="relative flex h-12 w-12 items-center justify-center"
      >
        <div className="absolute inset-0 rounded-full border-2 border-current/10" />
        <div className="absolute h-2 w-2 rounded-full bg-current/30" />
        <div className="orbit-arm absolute">
          <div className="h-2.5 w-2.5 -translate-y-5 rounded-full bg-current" />
        </div>
      </div>
    </>
  );
}
