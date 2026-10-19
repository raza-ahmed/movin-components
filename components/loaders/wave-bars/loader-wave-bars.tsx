"use client";

const BARS = [
  { color: '#7c7c7c', delay: '0ms' },
  { color: '#a7a7a7', delay: '100ms' },
  { color: '#f6f6f6', delay: '200ms' },
  { color: '#a7a7a7', delay: '300ms' },
  { color: '#7c7c7c', delay: '400ms' },
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
