"use client";

const CELLS = [
  { color: '#f6f6f6', delay: '0ms' },
  { color: '#c9c9c9', delay: '100ms' },
  { color: '#a7a7a7', delay: '200ms' },
  { color: '#7c7c7c', delay: '300ms' },
  { color: '#4d4d4d', delay: '400ms' },
  { color: '#7c7c7c', delay: '300ms' },
  { color: '#a7a7a7', delay: '200ms' },
  { color: '#c9c9c9', delay: '100ms' },
  { color: '#f6f6f6', delay: '0ms' },
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
