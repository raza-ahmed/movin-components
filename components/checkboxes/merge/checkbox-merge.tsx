"use client";

const css = `
  .cb-merge { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-merge__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-merge__graph { position: relative; width: 66px; height: 32px; border-radius: 6px; }
  .cb-merge__input:focus-visible + .cb-merge__graph { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-merge__graph svg { width: 66px; height: 32px; overflow: visible; }
  .cb-merge__main { fill: none; stroke: light-dark(#cbced3, #393c41); stroke-width: 2; stroke-linecap: round; }
  .cb-merge__branch { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 2; stroke-linecap: round; transition: stroke 0.3s; }
  .cb-merge__join {
    fill: none;
    stroke: light-dark(#50535b, #c6c8cd);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    transition: stroke-dashoffset 0.25s ease-in;
  }
  .cb-merge__commit { fill: light-dark(#6d7179, #7d8087); }
  .cb-merge__commit--branch { fill: light-dark(#5f626a, #a7abb2); transition: fill 0.3s; }
  .cb-merge__node { fill: light-dark(#f3f4f7, #1a1c1f); stroke: light-dark(#6d7179, #7d8087); stroke-width: 1.8; transition: fill 0.2s, stroke 0.2s; }
  .cb-merge__tick { fill: none; stroke: light-dark(#f3f4f7, #1a1c1f); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 0.15s; }
  .cb-merge__pulse { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 1; opacity: 0; transform-box: fill-box; transform-origin: center; }
  .cb-merge__input:checked + .cb-merge__graph .cb-merge__join { stroke-dashoffset: 0; transition: stroke-dashoffset 0.4s cubic-bezier(0.6, 0, 0.4, 1); }
  .cb-merge__input:checked + .cb-merge__graph .cb-merge__branch { stroke: light-dark(#50535b, #c6c8cd); }
  .cb-merge__input:checked + .cb-merge__graph .cb-merge__commit--branch { fill: light-dark(#42454c, #e5e6e9); }
  .cb-merge__input:checked + .cb-merge__graph .cb-merge__node { fill: light-dark(#373a40, #f1f2f3); stroke: light-dark(#373a40, #f1f2f3); transition-delay: 0.38s; }
  .cb-merge__input:checked + .cb-merge__graph .cb-merge__tick { stroke-dashoffset: 0; transition: stroke-dashoffset 0.2s ease 0.45s; }
  .cb-merge__input:checked + .cb-merge__graph .cb-merge__pulse { animation: cb-merge-pulse 0.6s ease-out 0.38s; }
  @keyframes cb-merge-pulse { 0% { opacity: 0.8; transform: scale(1); } 100% { opacity: 0; transform: scale(2.4); } }
  @media (prefers-reduced-motion: reduce) {
    .cb-merge__graph * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function MergeCheckbox() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-merge">
        <input className="cb-merge__input" type="checkbox" />
        <span className="cb-merge__graph" aria-hidden="true">
          <svg viewBox="0 0 66 32">
            <path className="cb-merge__main" d="M2 24H64" />
            <path className="cb-merge__branch" d="M12 24C18 24 18 8 24 8H40" />
            <path className="cb-merge__join" pathLength={1} d="M40 8C48 8 48 24 54 24" />
            <circle className="cb-merge__commit" cx="6" cy="24" r="2.6" />
            <circle className="cb-merge__commit" cx="30" cy="24" r="2.6" />
            <circle className="cb-merge__commit cb-merge__commit--branch" cx="28" cy="8" r="2.4" />
            <circle className="cb-merge__commit cb-merge__commit--branch" cx="39" cy="8" r="2.4" />
            <circle className="cb-merge__pulse" cx="54" cy="24" r="5" />
            <circle className="cb-merge__node" cx="54" cy="24" r="5" />
            <path className="cb-merge__tick" pathLength={1} d="M51.6 24.2L53.3 25.9L56.6 22.2" />
          </svg>
        </span>
        Auto-merge
      </label>
    </>
  );
}
