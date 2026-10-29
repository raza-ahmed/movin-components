"use client";

const css = `
  .cb-spotlight { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-spotlight__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-spotlight__stage { position: relative; width: 60px; height: 56px; }
  .cb-spotlight__pool {
    position: absolute;
    left: 14px;
    bottom: 0;
    width: 44px;
    height: 12px;
    border-radius: 50%;
    background: radial-gradient(closest-side, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 30%, transparent), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .cb-spotlight__box {
    position: absolute;
    left: 24px;
    bottom: 5px;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1.5px light-dark(#cbced3, #393c41);
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  .cb-spotlight__input:focus-visible + .cb-spotlight__stage .cb-spotlight__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-spotlight__box svg { position: absolute; inset: 0; width: 24px; height: 24px; }
  .cb-spotlight__box path { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; opacity: 0; transition: opacity 0.2s; }
  /* The lamp hangs top left; the beam hangs from it and turns on the lamp's pivot. */
  .cb-spotlight__rig {
    position: absolute;
    left: 6px;
    top: 4px;
    width: 0;
    height: 0;
    transform: rotate(60deg);
    transition: transform 0.4s cubic-bezier(0.5, 0, 0.75, 0);
  }
  .cb-spotlight__lamp { position: absolute; left: -5px; top: -3px; width: 10px; height: 9px; border-radius: 2px 2px 4px 4px; background: linear-gradient(light-dark(#5f626a, #a7abb2), light-dark(#cbced3, #393c41)); }
  .cb-spotlight__beam {
    position: absolute;
    left: -16px;
    top: 5px;
    width: 32px;
    height: 50px;
    clip-path: polygon(38% 0, 62% 0, 100% 100%, 0 100%);
    background: linear-gradient(color-mix(in oklab, light-dark(#373a40, #f1f2f3) 40%, transparent), color-mix(in oklab, light-dark(#373a40, #f1f2f3) 4%, transparent));
    opacity: 0;
    transition: opacity 0.25s ease;
  }
  .cb-spotlight__input:checked + .cb-spotlight__stage .cb-spotlight__rig { transform: rotate(-40deg); transition: transform 0.6s cubic-bezier(0.3, 1.4, 0.5, 1); }
  .cb-spotlight__input:checked + .cb-spotlight__stage .cb-spotlight__beam { opacity: 1; transition-duration: 0.15s; }
  .cb-spotlight__input:checked + .cb-spotlight__stage .cb-spotlight__pool { opacity: 1; transition-delay: 0.35s; }
  .cb-spotlight__input:checked + .cb-spotlight__stage .cb-spotlight__box { background: light-dark(#dbdde1, #2e3035); box-shadow: inset 0 0 0 1.5px light-dark(#50535b, #c6c8cd); transition-delay: 0.35s; }
  .cb-spotlight__input:checked + .cb-spotlight__stage .cb-spotlight__box path { opacity: 1; transition-delay: 0.35s; }
  @media (prefers-reduced-motion: reduce) {
    .cb-spotlight__stage * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function SpotlightCheckbox() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-spotlight">
        <input className="cb-spotlight__input" type="checkbox" />
        <span className="cb-spotlight__stage" aria-hidden="true">
          <span className="cb-spotlight__pool" />
          <span className="cb-spotlight__box">
            <svg viewBox="0 0 24 24">
              <path d="M6.5 12.5L10.2 16L17.5 8" />
            </svg>
          </span>
          <span className="cb-spotlight__rig">
            <span className="cb-spotlight__beam" />
            <span className="cb-spotlight__lamp" />
          </span>
        </span>
        Feature this
      </label>
    </>
  );
}
