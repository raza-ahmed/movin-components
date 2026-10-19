"use client";

export function DualRingLoader({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes dual-ring-cw  { to { transform: rotate(360deg); } }
        @keyframes dual-ring-ccw { to { transform: rotate(-360deg); } }
        .dual-ring-root { position: relative; width: 48px; height: 48px; }
        .dual-ring-outer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top-color: #f6f6f6;
          border-bottom-color: #f6f6f6;
          animation: dual-ring-cw 1s linear infinite;
        }
        .dual-ring-inner {
          position: absolute;
          inset: 9px;
          border-radius: 50%;
          border: 3px solid transparent;
          border-left-color: #7c7c7c;
          border-right-color: #7c7c7c;
          animation: dual-ring-ccw 0.65s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .dual-ring-outer, .dual-ring-inner { animation: none; }
        }
      `}</style>
      <div role="status" aria-label={label} className="dual-ring-root">
        <span className="dual-ring-outer" />
        <span className="dual-ring-inner" />
      </div>
    </>
  );
}
