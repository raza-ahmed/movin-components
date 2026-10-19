"use client";

export function BouncingBallLoader({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes ball-bounce {
          0%   { transform: translateY(0) scaleX(1) scaleY(1); }
          30%  { transform: translateY(-22px) scaleX(0.9) scaleY(1.1); }
          60%  { transform: translateY(0) scaleX(1.15) scaleY(0.88); }
          75%  { transform: translateY(-8px) scaleX(0.95) scaleY(1.05); }
          90%  { transform: translateY(0) scaleX(1.05) scaleY(0.95); }
          100% { transform: translateY(0) scaleX(1) scaleY(1); }
        }
        @keyframes ball-shadow {
          0%, 100% { transform: scaleX(1); opacity: 0.35; }
          30%  { transform: scaleX(0.55); opacity: 0.12; }
          60%  { transform: scaleX(1.2); opacity: 0.45; }
          75%  { transform: scaleX(0.8); opacity: 0.25; }
          90%  { transform: scaleX(1.1); opacity: 0.4; }
        }
        .ball {
          display: block;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #a7a7a7, #7c7c7c);
          animation: ball-bounce 0.75s ease-in-out infinite;
        }
        .ball-shadow {
          display: block;
          width: 26px;
          height: 5px;
          border-radius: 50%;
          background: rgba(124,124,124,0.35);
          animation: ball-shadow 0.75s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ball, .ball-shadow { animation: none; }
        }
      `}</style>
      <div role="status" aria-label={label} className="flex flex-col items-center gap-1.5">
        <span className="ball" />
        <span className="ball-shadow" />
      </div>
    </>
  );
}
