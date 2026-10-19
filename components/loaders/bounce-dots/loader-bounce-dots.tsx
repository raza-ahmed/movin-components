"use client";

export function BounceDots({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
        }
        .bounce-dot { animation: bounce-dot 1.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .bounce-dot { animation: none; }
        }
      `}</style>
      <div role="status" aria-label={label} className="flex items-center gap-2">
        <span className="bounce-dot block h-2.5 w-2.5 rounded-full bg-current" style={{ animationDelay: '0ms' }} />
        <span className="bounce-dot block h-2.5 w-2.5 rounded-full bg-current" style={{ animationDelay: '150ms' }} />
        <span className="bounce-dot block h-2.5 w-2.5 rounded-full bg-current" style={{ animationDelay: '300ms' }} />
      </div>
    </>
  );
}
