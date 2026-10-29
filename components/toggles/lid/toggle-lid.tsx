"use client";

const css = `
  .toggle-lid { position: relative; display: inline-flex; align-items: center; gap: 14px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-lid__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-lid__scene { position: relative; flex: none; }
  .toggle-lid__input:focus-visible + .toggle-lid__scene { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; border-radius: 8px; }
  .toggle-lid__scene { width: 80px; height: 56px; perspective: 220px; }
  /* The lid is hinged at the base: flat and edge-on when shut, upright with the screen lit when open. */
  .toggle-lid__lid { position: absolute; left: 10px; right: 10px; bottom: 8px; height: 44px; padding: 4px; border-radius: 5px 5px 1px 1px; background: light-dark(#6d7179, #7d8087); transform-origin: 50% 100%; transform: rotateX(-86deg); transition: transform 0.6s cubic-bezier(0.3, 1.25, 0.5, 1); }
  .toggle-lid__screen { position: relative; height: 100%; border-radius: 2px; background: light-dark(#fbfcfd, #121417); overflow: hidden; }
  .toggle-lid__screen::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 40%, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 30%, transparent), transparent 70%); opacity: 0; transition: opacity 0.4s; }
  .toggle-lid__ui { position: absolute; left: 8px; right: 8px; top: 9px; height: 18px; background: repeating-linear-gradient(light-dark(#50535b, #c6c8cd) 0 2px, transparent 2px 6px); opacity: 0; transition: opacity 0.4s; }
  .toggle-lid__base { position: absolute; left: 2px; right: 2px; bottom: 2px; height: 7px; border-radius: 1px 1px 5px 5px; background: linear-gradient(light-dark(#5f626a, #a7abb2), light-dark(#cbced3, #393c41)); box-shadow: 0 4px 8px -4px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6)); }
  .toggle-lid__base::after { content: ''; position: absolute; left: 50%; top: 0; width: 14px; height: 2px; margin-left: -7px; border-radius: 0 0 2px 2px; background: light-dark(#dbdde1, #2e3035); }
  .toggle-lid__input:checked + .toggle-lid__scene .toggle-lid__lid { transform: rotateX(-8deg); }
  .toggle-lid__input:checked + .toggle-lid__scene .toggle-lid__screen::before { opacity: 1; transition-delay: 0.45s; }
  .toggle-lid__input:checked + .toggle-lid__scene .toggle-lid__ui { opacity: 0.7; transition-delay: 0.6s; }
  @media (prefers-reduced-motion: reduce) {
    .toggle-lid * { transition: none !important; }
  }
`;

export function LidToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-lid">
        <input className="toggle-lid__input" type="checkbox" role="switch" />
        <span className="toggle-lid__scene" aria-hidden="true">
          <span className="toggle-lid__lid">
            <span className="toggle-lid__screen">
              <span className="toggle-lid__ui" />
            </span>
          </span>
          <span className="toggle-lid__base" />
        </span>
        Wake
      </label>
    </>
  );
}
