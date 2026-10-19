"use client";

export function DotsCircleLoader({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes dots-circle-fade {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 1; }
        }
        .dots-circle-root {
          position: relative;
          width: 48px;
          height: 48px;
        }
        .dots-circle-root > span {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          top: 50%;
          left: 50%;
          animation: dots-circle-fade 1s ease-in-out infinite;
        }
        .dots-circle-root > span:nth-child(1) { transform: translate(-50%,-50%) rotate(0deg)   translateY(-19px); animation-delay: 0ms; }
        .dots-circle-root > span:nth-child(2) { transform: translate(-50%,-50%) rotate(45deg)  translateY(-19px); animation-delay: 125ms; }
        .dots-circle-root > span:nth-child(3) { transform: translate(-50%,-50%) rotate(90deg)  translateY(-19px); animation-delay: 250ms; }
        .dots-circle-root > span:nth-child(4) { transform: translate(-50%,-50%) rotate(135deg) translateY(-19px); animation-delay: 375ms; }
        .dots-circle-root > span:nth-child(5) { transform: translate(-50%,-50%) rotate(180deg) translateY(-19px); animation-delay: 500ms; }
        .dots-circle-root > span:nth-child(6) { transform: translate(-50%,-50%) rotate(225deg) translateY(-19px); animation-delay: 625ms; }
        .dots-circle-root > span:nth-child(7) { transform: translate(-50%,-50%) rotate(270deg) translateY(-19px); animation-delay: 750ms; }
        .dots-circle-root > span:nth-child(8) { transform: translate(-50%,-50%) rotate(315deg) translateY(-19px); animation-delay: 875ms; }
        @media (prefers-reduced-motion: reduce) {
          .dots-circle-root > span { animation: none; opacity: 0.4; }
        }
      `}</style>
      <div role="status" aria-label={label} className="dots-circle-root">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>
    </>
  );
}
