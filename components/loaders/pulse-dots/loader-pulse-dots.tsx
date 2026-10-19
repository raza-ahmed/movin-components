"use client";

export function PulseDots({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes pulse-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .pulse-dot { animation: pulse-dot 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pulse-dot { animation: none; opacity: 0.7; }
        }
      `}</style>
      <div role="status" aria-label={label} className="flex items-center gap-2">
        <span className="pulse-dot block h-2.5 w-2.5 rounded-full bg-current" style={{ animationDelay: '0ms' }} />
        <span className="pulse-dot block h-2.5 w-2.5 rounded-full bg-current" style={{ animationDelay: '160ms' }} />
        <span className="pulse-dot block h-2.5 w-2.5 rounded-full bg-current" style={{ animationDelay: '320ms' }} />
      </div>
    </>
  );
}
