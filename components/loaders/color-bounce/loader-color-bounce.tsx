"use client";

const DOTS = [
  { color: '#4d4d4d', delay: '0ms' },
  { color: '#7c7c7c', delay: '120ms' },
  { color: '#a7a7a7', delay: '240ms' },
  { color: '#c9c9c9', delay: '360ms' },
  { color: '#f6f6f6', delay: '480ms' },
];

export function ColorBounce({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes color-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-12px); }
        }
        .color-dot { animation: color-bounce 1.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .color-dot { animation: none; }
        }
      `}</style>
      <div role="status" aria-label={label} className="flex items-center gap-1.5">
        {DOTS.map(({ color, delay }, i) => (
          <span
            key={i}
            className="color-dot block h-2.5 w-2.5 rounded-full"
            style={{ background: color, animationDelay: delay }}
          />
        ))}
      </div>
    </>
  );
}
