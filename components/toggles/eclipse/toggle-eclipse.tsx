"use client";

const css = `
  @keyframes toggle-eclipse-corona { to { transform: rotate(360deg); } }
  .toggle-eclipse { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-eclipse__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-eclipse__track {
    position: relative;
    width: 74px;
    height: 36px;
    border-radius: 999px;
    background: light-dark(#dbdde1, #2e3035);
    box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41);
    transition: background-color 0.6s 0.2s;
  }
  .toggle-eclipse__input:focus-visible + .toggle-eclipse__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-eclipse__sun { position: absolute; right: 6px; top: 6px; width: 24px; height: 24px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); }
  /* The corona: a soft ring plus rays, only visible once the moon covers the disc. */
  .toggle-eclipse__corona {
    position: absolute;
    inset: -7px;
    border-radius: 50%;
    background:
      radial-gradient(circle, transparent 52%, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 70%, transparent) 56%, transparent 70%),
      repeating-conic-gradient(color-mix(in oklab, light-dark(#373a40, #f1f2f3) 45%, transparent) 0 3deg, transparent 3deg 20deg);
    mask-image: radial-gradient(circle, #000 45%, transparent 72%);
    opacity: 0;
    transform: scale(0.6);
    transition: opacity 0.4s, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    animation: toggle-eclipse-corona 14s linear infinite;
  }
  .toggle-eclipse__moon {
    position: absolute;
    left: 6px;
    top: 6px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset -3px -2px 0 light-dark(#f3f4f7, #1a1c1f), inset 0 0 0 1px light-dark(#cbced3, #393c41);
    transition: transform 0.7s cubic-bezier(0.6, 0, 0.3, 1), background-color 0.4s, box-shadow 0.4s;
  }
  .toggle-eclipse__input:checked + .toggle-eclipse__track { background: light-dark(#fbfcfd, #121417); }
  .toggle-eclipse__input:checked + .toggle-eclipse__track .toggle-eclipse__moon {
    transform: translateX(38px);
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#fbfcfd, #121417);
  }
  .toggle-eclipse__input:checked + .toggle-eclipse__track .toggle-eclipse__corona { opacity: 1; transform: none; transition-delay: 0.5s; }
  @media (prefers-reduced-motion: reduce) {
    .toggle-eclipse__track *, .toggle-eclipse__track { transition-duration: 0.01s !important; transition-delay: 0s !important; animation: none !important; }
  }
`;

export function EclipseToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-eclipse">
        <input className="toggle-eclipse__input" type="checkbox" role="switch" />
        <span className="toggle-eclipse__track" aria-hidden="true">
          <span className="toggle-eclipse__sun">
            <span className="toggle-eclipse__corona" />
          </span>
          <span className="toggle-eclipse__moon" />
        </span>
        Dark mode
      </label>
    </>
  );
}
