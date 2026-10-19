"use client";

export function TextShimmerLoader({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes text-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-text {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: linear-gradient(
            90deg,
            rgba(246,246,246,0.25) 0%,
            rgba(246,246,246,0.25) 30%,
            rgba(246,246,246,1)    50%,
            rgba(246,246,246,0.25) 70%,
            rgba(246,246,246,0.25) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: text-shimmer 1.8s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .shimmer-text {
            animation: none;
            background: none;
            -webkit-text-fill-color: rgba(246,246,246,0.45);
          }
        }
      `}</style>
      <div role="status" aria-label={label}>
        <span className="shimmer-text" aria-hidden="true">Loading</span>
      </div>
    </>
  );
}
