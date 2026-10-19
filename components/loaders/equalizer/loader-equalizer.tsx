"use client";

export function EqualizerLoader({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes eq-a { 0%, 100% { height: 8px;  } 50% { height: 34px; } }
        @keyframes eq-b { 0%, 100% { height: 22px; } 50% { height: 10px; } }
        @keyframes eq-c { 0%, 100% { height: 30px; } 50% { height: 8px;  } }
        @keyframes eq-d { 0%, 100% { height: 14px; } 50% { height: 26px; } }
        @keyframes eq-e { 0%, 100% { height: 20px; } 50% { height: 6px;  } }
        .eq-bar {
          display: block;
          width: 5px;
          border-radius: 3px;
        }
        .eq-bar:nth-child(1) { background: #4d4d4d; animation: eq-a 0.9s  ease-in-out infinite; }
        .eq-bar:nth-child(2) { background: #7c7c7c; animation: eq-b 0.7s  ease-in-out infinite; }
        .eq-bar:nth-child(3) { background: #a7a7a7; animation: eq-c 1.1s  ease-in-out infinite; }
        .eq-bar:nth-child(4) { background: #c9c9c9; animation: eq-d 0.8s  ease-in-out infinite; }
        .eq-bar:nth-child(5) { background: #f6f6f6; animation: eq-e 0.95s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .eq-bar { animation: none; height: 16px; }
        }
      `}</style>
      <div
        role="status"
        aria-label={label}
        className="flex items-end gap-1"
        style={{ height: 38 }}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className="eq-bar" />
        ))}
      </div>
    </>
  );
}
