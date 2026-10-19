"use client";

export function HelixLoader({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes helix-a {
          0%, 100% { transform: translateY(-12px) scaleX(0.5); opacity: 0.6; }
          50% { transform: translateY(12px) scaleX(1); opacity: 1; }
        }
        @keyframes helix-b {
          0%, 100% { transform: translateY(12px) scaleX(1); opacity: 1; }
          50% { transform: translateY(-12px) scaleX(0.5); opacity: 0.6; }
        }
        .helix-dot { display: block; width: 14px; height: 14px; border-radius: 50%; }
        .helix-dot-a { background: #f6f6f6; animation: helix-a 1s ease-in-out infinite; }
        .helix-dot-b { background: #7c7c7c; animation: helix-b 1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .helix-dot-a, .helix-dot-b { animation: none; }
        }
      `}</style>
      <div role="status" aria-label={label} className="flex items-center gap-2">
        <span className="helix-dot helix-dot-a" />
        <span className="helix-dot helix-dot-b" />
      </div>
    </>
  );
}
