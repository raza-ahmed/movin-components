"use client";

export function GradientRing({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes gradient-ring-spin { to { transform: rotate(360deg); } }
        .gradient-ring { animation: gradient-ring-spin 1s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .gradient-ring { animation: none; opacity: 0.5; }
        }
      `}</style>
      <div
        role="status"
        aria-label={label}
        className="gradient-ring"
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #7c7c7c, #a7a7a7, #a7a7a7, #a7a7a7, #7c7c7c, #7c7c7c, #7c7c7c)',
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black 0)',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black 0)',
        }}
      />
    </>
  );
}
