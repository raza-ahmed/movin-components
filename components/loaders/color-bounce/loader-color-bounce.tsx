"use client";

const DOTS = [
  { color: 'light-dark(#cbced3, #393c41)', delay: '0ms' },
  { color: 'light-dark(#6d7179, #7d8087)', delay: '120ms' },
  { color: 'light-dark(#5f626a, #a7abb2)', delay: '240ms' },
  { color: 'light-dark(#50535b, #c6c8cd)', delay: '360ms' },
  { color: 'light-dark(#373a40, #f1f2f3)', delay: '480ms' },
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
