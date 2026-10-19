"use client";

export function CometLoader({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes comet-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .comet-ring {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 0%, #7c7c7c 70%, #f6f6f6 100%);
          animation: comet-spin 0.9s linear infinite;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #f6f6f6 calc(100% - 3px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #f6f6f6 calc(100% - 3px));
        }
        @media (prefers-reduced-motion: reduce) {
          .comet-ring { animation: none; }
        }
      `}</style>
      <div role="status" aria-label={label} className="comet-ring" />
    </>
  );
}
