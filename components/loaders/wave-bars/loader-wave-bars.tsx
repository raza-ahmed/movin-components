"use client";

const BARS = [
  { color: 'light-dark(#6d7179, #7d8087)', delay: '0ms' },
  { color: 'light-dark(#5f626a, #a7abb2)', delay: '100ms' },
  { color: 'light-dark(#373a40, #f1f2f3)', delay: '200ms' },
  { color: 'light-dark(#5f626a, #a7abb2)', delay: '300ms' },
  { color: 'light-dark(#6d7179, #7d8087)', delay: '400ms' },
];

export function WaveBars({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes wave-bar {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
        .wave-bar {
          width: 5px;
          border-radius: 3px;
          height: 32px;
          transform-origin: center;
          animation: wave-bar 1s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .wave-bar { animation: none; transform: scaleY(0.6); }
        }
      `}</style>
      <div role="status" aria-label={label} className="flex items-center gap-1">
        {BARS.map(({ color, delay }, i) => (
          <span key={i} className="wave-bar" style={{ background: color, animationDelay: delay }} />
        ))}
      </div>
    </>
  );
}
