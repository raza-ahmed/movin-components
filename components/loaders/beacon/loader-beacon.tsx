"use client";

const css = `
  /* The beam turning: wide to one side, a flare as it faces you, wide to the other, gone behind. */
  @keyframes loader-beacon-sweep {
    0% { transform: scaleX(1); opacity: 0.9; }
    40% { transform: scaleX(0.08); opacity: 0.4; }
    50% { transform: scaleX(-0.6); opacity: 0.8; }
    85% { transform: scaleX(-1); opacity: 0.9; }
    92% { transform: scaleX(-1); opacity: 0; }
    96% { transform: scaleX(1); opacity: 0; }
    100% { transform: scaleX(1); opacity: 0.9; }
  }
  @keyframes loader-beacon-flare { 0%, 30%, 60%, 100% { opacity: 0.2; transform: scale(0.6); } 45% { opacity: 1; transform: scale(1.4); } }
  @keyframes loader-beacon-swell { from { transform: translateX(0); } to { transform: translateX(-24px); } }
  .loader-beacon { position: relative; width: 150px; height: 96px; overflow: hidden; }
  .loader-beacon__beam { position: absolute; left: 75px; top: 14px; width: 74px; height: 22px; transform-origin: 0 50%; clip-path: polygon(0 45%, 100% 0, 100% 100%, 0 55%); background: linear-gradient(90deg, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 75%, transparent), transparent); animation: loader-beacon-sweep 3s linear infinite; }
  .loader-beacon__flare { position: absolute; left: 68px; top: 18px; width: 14px; height: 14px; border-radius: 50%; background: radial-gradient(circle, light-dark(#373a40, #f1f2f3), transparent 70%); animation: loader-beacon-flare 3s linear infinite; }
  .loader-beacon svg { position: absolute; left: 0; bottom: 0; width: 150px; height: 80px; overflow: visible; }
  .loader-beacon__tower { fill: light-dark(#cbced3, #393c41); }
  .loader-beacon__band { fill: light-dark(#ebedf0, #232529); }
  .loader-beacon__lamp { fill: light-dark(#42454c, #e5e6e9); }
  .loader-beacon__roof { fill: light-dark(#6d7179, #7d8087); }
  .loader-beacon__rock { fill: light-dark(#ebedf0, #232529); }
  .loader-beacon__sea { position: absolute; left: 0; bottom: 0; width: 174px; height: 10px; background: radial-gradient(ellipse 6px 3px at 6px 0, transparent 92%, light-dark(#dbdde1, #2e3035) 100%) 0 0 / 12px 10px repeat-x; animation: loader-beacon-swell 2.4s linear infinite; }
  .loader-beacon__sea::after { content: ''; position: absolute; left: 0; right: 0; top: 3px; bottom: 0; background: light-dark(#dbdde1, #2e3035); }
  @media (prefers-reduced-motion: reduce) {
    .loader-beacon__beam, .loader-beacon__flare, .loader-beacon__sea { animation: none; }
  }
`;

export function BeaconLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-beacon" role="status" aria-label="Loading">
        <span className="loader-beacon__beam" aria-hidden="true" />
        <svg viewBox="0 0 150 80" aria-hidden="true">
          <path className="loader-beacon__rock" d="M44 80C48 70 58 64 66 66C72 60 84 62 90 68C98 66 106 72 108 80Z" />
          <path className="loader-beacon__tower" d="M70 66L72 20H78L80 66Z" />
          <path className="loader-beacon__band" d="M71.3 44H78.7L79 52H71Z M71.9 28H78.1L78.3 34H71.7Z" />
          <rect className="loader-beacon__lamp" x="70.5" y="12" width="9" height="8" rx="1" />
          <path className="loader-beacon__roof" d="M69 12L75 6L81 12Z" />
        </svg>
        <span className="loader-beacon__flare" aria-hidden="true" />
        <span className="loader-beacon__sea" aria-hidden="true" />
      </div>
    </>
  );
}
