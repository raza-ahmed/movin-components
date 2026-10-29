"use client";

const css = `
  @keyframes btn-hologram-flicker {
    0%, 88%, 100% { opacity: 1; }
    89% { opacity: 0.45; }
    90% { opacity: 0.95; }
    92% { opacity: 0.6; }
    93% { opacity: 1; }
  }
  @keyframes btn-hologram-scan {
    from { transform: translateY(-140%); }
    to { transform: translateY(260%); }
  }
  @keyframes btn-hologram-float {
    0%, 100% { transform: translateY(-6px); }
    50% { transform: translateY(-10px); }
  }
  .btn-hologram {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 12px;
  }
  .btn-hologram__btn {
    position: relative;
    z-index: 1;
    overflow: hidden;
    padding: 0.8rem 2.1rem;
    border: 1px solid color-mix(in oklab, light-dark(#373a40, #f1f2f3) 40%, transparent);
    border-radius: 10px;
    background: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 7%, transparent);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    text-shadow: 0 0 10px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 60%, transparent);
    box-shadow: 0 0 22px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 14%, transparent), inset 0 0 18px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 10%, transparent);
    cursor: pointer;
    animation: btn-hologram-flicker 3.8s linear infinite;
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease;
  }
  /* Scanlines over the whole face. */
  .btn-hologram__btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(to bottom, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 12%, transparent) 0 1px, transparent 1px 3px);
    pointer-events: none;
  }
  /* A brighter band rolling down the projection. */
  .btn-hologram__btn::after {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 40%;
    background: linear-gradient(to bottom, transparent, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 16%, transparent), transparent);
    animation: btn-hologram-scan 2.6s linear infinite;
    pointer-events: none;
  }
  .btn-hologram__cone {
    position: absolute;
    bottom: 6px;
    width: 190px;
    height: 74px;
    clip-path: polygon(38% 100%, 62% 100%, 100% 0, 0 0);
    background: linear-gradient(to top, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 30%, transparent), transparent 85%);
    opacity: 0.45;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  .btn-hologram__base {
    position: relative;
    margin-top: 26px;
    width: 74px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid light-dark(#cbced3, #393c41);
    background: radial-gradient(closest-side, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 55%, transparent), transparent);
    transition: box-shadow 0.4s ease;
  }
  .btn-hologram:hover .btn-hologram__btn,
  .btn-hologram__btn:focus-visible {
    animation: btn-hologram-float 2.4s ease-in-out infinite;
    box-shadow: 0 0 34px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 26%, transparent), inset 0 0 22px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 16%, transparent);
  }
  .btn-hologram:hover .btn-hologram__cone,
  .btn-hologram:focus-within .btn-hologram__cone { opacity: 0.95; }
  .btn-hologram:hover .btn-hologram__base,
  .btn-hologram:focus-within .btn-hologram__base { box-shadow: 0 0 18px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 40%, transparent); }
  .btn-hologram__btn:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 4px; }
  @media (prefers-reduced-motion: reduce) {
    .btn-hologram__btn,
    .btn-hologram__btn::after,
    .btn-hologram:hover .btn-hologram__btn { animation: none; }
  }
`;

export function HologramButton() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="btn-hologram">
        <button type="button" className="btn-hologram__btn">
          Project
        </button>
        <span className="btn-hologram__cone" aria-hidden="true" />
        <span className="btn-hologram__base" aria-hidden="true" />
      </div>
    </>
  );
}
