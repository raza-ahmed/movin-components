"use client";

const css = `
  .cb-popup { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-popup__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-popup__box { position: relative; width: 50px; height: 42px; border-radius: 4px; perspective: 160px; perspective-origin: 50% -60%; }
  .cb-popup__input:focus-visible + .cb-popup__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-popup__book {
    position: absolute;
    left: 2px;
    right: 2px;
    bottom: 2px;
    height: 34px;
    transform: rotateX(68deg);
    transform-origin: 50% 100%;
    transform-style: preserve-3d;
  }
  .cb-popup__page {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50%;
    box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087);
  }
  .cb-popup__page--l { left: 0; border-radius: 3px 0 0 3px; background: linear-gradient(90deg, light-dark(#dbdde1, #2e3035) 65%, light-dark(#cbced3, #393c41)); }
  .cb-popup__page--r { right: 0; border-radius: 0 3px 3px 0; background: linear-gradient(270deg, light-dark(#dbdde1, #2e3035) 65%, light-dark(#cbced3, #393c41)); }
  .cb-popup__shadow {
    position: absolute;
    left: 8px;
    right: 8px;
    top: 10px;
    height: 10px;
    border-radius: 50%;
    background: radial-gradient(closest-side, color-mix(in oklab, light-dark(#fbfcfd, #121417) 70%, transparent), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .cb-popup__pop {
    position: absolute;
    left: 50%;
    top: 2px;
    width: 26px;
    height: 20px;
    margin-left: -13px;
    transform-origin: 50% 100%;
    transform: translateY(0) rotateX(0deg);
    transition: transform 0.3s cubic-bezier(0.5, 0, 0.75, 0);
  }
  .cb-popup__pop svg { width: 26px; height: 20px; overflow: visible; }
  .cb-popup__pop path { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; transition: stroke 0.3s; }
  .cb-popup__input:checked + .cb-popup__box .cb-popup__pop { transform: rotateX(-80deg); transition: transform 0.55s cubic-bezier(0.3, 1.7, 0.5, 1) 0.05s; }
  .cb-popup__input:checked + .cb-popup__box .cb-popup__pop path { stroke: light-dark(#373a40, #f1f2f3); filter: drop-shadow(0 1px 0 light-dark(#5f626a, #a7abb2)); }
  .cb-popup__input:checked + .cb-popup__box .cb-popup__shadow { opacity: 1; }
  @media (prefers-reduced-motion: reduce) {
    .cb-popup__box * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function PopupCheckbox() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-popup">
        <input className="cb-popup__input" type="checkbox" />
        <span className="cb-popup__box" aria-hidden="true">
          <span className="cb-popup__book">
            <span className="cb-popup__page cb-popup__page--l" />
            <span className="cb-popup__page cb-popup__page--r" />
            <span className="cb-popup__shadow" />
            <span className="cb-popup__pop">
              <svg viewBox="0 0 26 20">
                <path d="M4 10.5L10 16.5L22 3.5" />
              </svg>
            </span>
          </span>
        </span>
        Add to reading list
      </label>
    </>
  );
}
