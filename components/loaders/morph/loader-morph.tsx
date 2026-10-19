"use client";

export function MorphLoader({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes morph-shape {
          0%, 100% {
            border-radius: 50%;
            background: #7c7c7c;
            transform: rotate(0deg);
          }
          33% {
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            background: #7c7c7c;
            transform: rotate(120deg);
          }
          66% {
            border-radius: 8px;
            background: #7c7c7c;
            transform: rotate(240deg);
          }
        }
        .morph-el {
          display: block;
          width: 34px;
          height: 34px;
          animation: morph-shape 2.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .morph-el { animation: none; border-radius: 50%; background: #7c7c7c; }
        }
      `}</style>
      <div role="status" aria-label={label}>
        <span className="morph-el" />
      </div>
    </>
  );
}
