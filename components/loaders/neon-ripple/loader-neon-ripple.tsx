"use client";

export function NeonRipple({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes neon-ripple {
          0% { transform: scale(0.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        .ripple-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid #a7a7a7;
          animation: neon-ripple 1.8s cubic-bezier(0, 0.5, 0.5, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ripple-ring { animation: none; opacity: 0.25; transform: scale(0.5); }
        }
      `}</style>
      <div
        role="status"
        aria-label={label}
        className="relative flex items-center justify-center"
        style={{ width: 52, height: 52 }}
      >
        <span className="ripple-ring" style={{ borderColor: '#a7a7a7' }} />
        <span className="ripple-ring" style={{ borderColor: '#a7a7a7', animationDelay: '0.6s' }} />
        <span className="ripple-ring" style={{ borderColor: '#a7a7a7', animationDelay: '1.2s' }} />
        <div
          className="rounded-full"
          style={{
            width: 10,
            height: 10,
            background: '#a7a7a7',
            boxShadow: '0 0 10px 3px #a7a7a760',
          }}
        />
      </div>
    </>
  );
}
