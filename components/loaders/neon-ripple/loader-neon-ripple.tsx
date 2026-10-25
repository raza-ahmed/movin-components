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
          border: 2px solid light-dark(#5f626a, #a7abb2);
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
        <span className="ripple-ring" style={{ borderColor: 'light-dark(#5f626a, #a7abb2)' }} />
        <span className="ripple-ring" style={{ borderColor: 'light-dark(#5f626a, #a7abb2)', animationDelay: '0.6s' }} />
        <span className="ripple-ring" style={{ borderColor: 'light-dark(#5f626a, #a7abb2)', animationDelay: '1.2s' }} />
        <div
          className="rounded-full"
          style={{
            width: 10,
            height: 10,
            background: 'light-dark(#5f626a, #a7abb2)',
            boxShadow: '0 0 10px 3px light-dark(#5f626a60, #a7abb260)',
          }}
        />
      </div>
    </>
  );
}
