"use client";

export function ProgressBarLoader({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes progress-slide {
          0% { left: -60%; }
          100% { left: 120%; }
        }
        .progress-track {
          position: relative;
          width: 180px;
          height: 6px;
          border-radius: 9999px;
          background: light-dark(rgba(55,58,64,0.15), rgba(241,242,243,0.15));
          overflow: hidden;
        }
        .progress-bar {
          position: absolute;
          top: 0;
          left: -60%;
          width: 55%;
          height: 100%;
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent, light-dark(#6d7179, #7d8087), light-dark(#6d7179, #7d8087), transparent);
          animation: progress-slide 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .progress-bar { animation: none; left: 20%; width: 60%; background: light-dark(#6d7179, #7d8087); }
        }
      `}</style>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        className="progress-track"
      >
        <span className="progress-bar" />
      </div>
    </>
  );
}
