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
          background: 'conic-gradient(from 0deg, light-dark(#6d7179, #7d8087), light-dark(#5f626a, #a7abb2), light-dark(#5f626a, #a7abb2), light-dark(#5f626a, #a7abb2), light-dark(#6d7179, #7d8087), light-dark(#6d7179, #7d8087), light-dark(#6d7179, #7d8087))',
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black 0)',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black 0)',
        }}
      />
    </>
  );
}
