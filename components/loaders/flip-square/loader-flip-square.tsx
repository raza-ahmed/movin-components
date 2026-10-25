"use client";

export function FlipSquareLoader({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes flip-square-y {
          0%   { transform: perspective(240px) rotateY(0deg); }
          50%  { transform: perspective(240px) rotateY(180deg); }
          100% { transform: perspective(240px) rotateY(360deg); }
        }
        .flip-square {
          display: block;
          width: 30px;
          height: 30px;
          border-radius: 6px;
          background: light-dark(#6d7179, #7d8087);
          animation: flip-square-y 1.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .flip-square { animation: none; }
        }
      `}</style>
      <div role="status" aria-label={label}>
        <span className="flip-square" />
      </div>
    </>
  );
}
