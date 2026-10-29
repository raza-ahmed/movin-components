"use client";

const css = `
  .toggle-earbuds { position: relative; display: inline-flex; align-items: center; gap: 14px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-earbuds__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-earbuds__scene { position: relative; flex: none; }
  .toggle-earbuds__input:focus-visible + .toggle-earbuds__scene { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; border-radius: 8px; }
  .toggle-earbuds__scene { width: 64px; height: 60px; perspective: 260px; }
  .toggle-earbuds__case { position: absolute; left: 4px; right: 4px; bottom: 2px; height: 30px; border-radius: 6px 6px 16px 16px; background: linear-gradient(light-dark(#50535b, #c6c8cd), light-dark(#6d7179, #7d8087)); box-shadow: 0 6px 12px -6px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6)); }
  .toggle-earbuds__case::after { content: ''; position: absolute; left: 50%; top: 10px; width: 4px; height: 4px; margin-left: -2px; border-radius: 50%; background: light-dark(#dbdde1, #2e3035); transition: background-color 0.2s 0.5s, box-shadow 0.2s 0.5s; }
  /* The lid is hinged at the back: it flips up and the buds rise out on their stems. */
  .toggle-earbuds__lid { position: absolute; left: 4px; right: 4px; bottom: 32px; height: 16px; border-radius: 16px 16px 4px 4px; background: linear-gradient(light-dark(#42454c, #e5e6e9), light-dark(#5f626a, #a7abb2)); transform-origin: 50% 100%; transition: transform 0.5s cubic-bezier(0.3, 1.3, 0.5, 1); }
  .toggle-earbuds__bud { position: absolute; bottom: 20px; width: 12px; height: 22px; transform: translateY(10px); opacity: 0; transition: transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1), opacity 0.2s; }
  .toggle-earbuds__bud::before { content: ''; position: absolute; left: 0; top: 0; width: 12px; height: 12px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); }
  .toggle-earbuds__bud::after { content: ''; position: absolute; left: 4px; top: 8px; width: 4px; height: 14px; border-radius: 2px; background: light-dark(#373a40, #f1f2f3); }
  .toggle-earbuds__bud--l { left: 16px; }
  .toggle-earbuds__bud--r { right: 16px; }
  .toggle-earbuds__input:checked + .toggle-earbuds__scene .toggle-earbuds__lid { transform: rotateX(-110deg); }
  .toggle-earbuds__input:checked + .toggle-earbuds__scene .toggle-earbuds__bud { transform: none; opacity: 1; transition-delay: 0.3s; }
  .toggle-earbuds__input:checked + .toggle-earbuds__scene .toggle-earbuds__bud--r { transition-delay: 0.38s; }
  .toggle-earbuds__input:checked + .toggle-earbuds__scene .toggle-earbuds__case::after { background: light-dark(#fbfcfd, #121417); box-shadow: 0 0 6px light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .toggle-earbuds * { transition: none !important; }
  }
`;

export function EarbudsToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-earbuds">
        <input className="toggle-earbuds__input" type="checkbox" role="switch" />
        <span className="toggle-earbuds__scene" aria-hidden="true">
          <span className="toggle-earbuds__bud toggle-earbuds__bud--l" />
          <span className="toggle-earbuds__bud toggle-earbuds__bud--r" />
          <span className="toggle-earbuds__case" />
          <span className="toggle-earbuds__lid" />
        </span>
        Connect
      </label>
    </>
  );
}
