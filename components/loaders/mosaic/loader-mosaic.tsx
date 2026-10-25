"use client";

const CELLS = [
  { color: 'light-dark(#373a40, #f1f2f3)', delay: '0ms' },
  { color: 'light-dark(#50535b, #c6c8cd)', delay: '100ms' },
  { color: 'light-dark(#5f626a, #a7abb2)', delay: '200ms' },
  { color: 'light-dark(#6d7179, #7d8087)', delay: '300ms' },
  { color: 'light-dark(#cbced3, #393c41)', delay: '400ms' },
  { color: 'light-dark(#6d7179, #7d8087)', delay: '300ms' },
  { color: 'light-dark(#5f626a, #a7abb2)', delay: '200ms' },
  { color: 'light-dark(#50535b, #c6c8cd)', delay: '100ms' },
  { color: 'light-dark(#373a40, #f1f2f3)', delay: '0ms' },
];

export function Mosaic({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes mosaic-cell {
          0%, 100% { opacity: 0.15; transform: scale(0.75); }
          50% { opacity: 1; transform: scale(1); }
        }
        .mosaic-cell {
          border-radius: 3px;
          animation: mosaic-cell 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .mosaic-cell { animation: none; opacity: 0.7; transform: scale(1); }
        }
      `}</style>
      <div
        role="status"
        aria-label={label}
        className="grid"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, width: 44, height: 44 }}
      >
        {CELLS.map(({ color, delay }, i) => (
          <span
            key={i}
            className="mosaic-cell"
            style={{ background: color, animationDelay: delay }}
          />
        ))}
      </div>
    </>
  );
}
