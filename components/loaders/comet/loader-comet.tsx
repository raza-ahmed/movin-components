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
          background: conic-gradient(from 0deg, transparent 0%, light-dark(#6d7179, #7d8087) 70%, light-dark(#373a40, #f1f2f3) 100%);
          animation: comet-spin 0.9s linear infinite;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), light-dark(#373a40, #f1f2f3) calc(100% - 3px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 4px), light-dark(#373a40, #f1f2f3) calc(100% - 3px));
        }
        @media (prefers-reduced-motion: reduce) {
          .comet-ring { animation: none; }
        }
      `}</style>
      <div role="status" aria-label={label} className="comet-ring" />
    </>
  );
}
