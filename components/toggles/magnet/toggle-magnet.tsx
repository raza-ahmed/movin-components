"use client";

const css = `
  @keyframes toggle-magnet-field { to { stroke-dashoffset: -10; } }
  @keyframes toggle-magnet-hum { to { transform: translateX(0.6px); } }
  .toggle-magnet { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-magnet__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-magnet__track {
    position: relative;
    width: 80px;
    height: 32px;
    border-radius: 999px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .toggle-magnet__input:focus-visible + .toggle-magnet__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-magnet__art { position: absolute; inset: 0; width: 80px; height: 32px; overflow: visible; }
  .toggle-magnet__body { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 5; stroke-linecap: butt; transition: stroke 0.3s; }
  .toggle-magnet__pole { fill: light-dark(#50535b, #c6c8cd); }
  .toggle-magnet__field {
    fill: none;
    stroke: light-dark(#50535b, #c6c8cd);
    stroke-width: 1;
    stroke-dasharray: 2 3;
    opacity: 0;
    transition: opacity 0.3s;
    animation: toggle-magnet-field 0.6s linear infinite paused;
  }
  .toggle-magnet__ball {
    position: absolute;
    left: 5px;
    top: 6px;
    width: 20px;
    height: 20px;
    /* Off: pushed away, decelerating. */
    transition: transform 0.5s cubic-bezier(0, 0.6, 0.3, 1);
  }
  .toggle-magnet__ball span {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, light-dark(#373a40, #f1f2f3), light-dark(#6d7179, #7d8087) 75%);
  }
  .toggle-magnet__input:checked + .toggle-magnet__track .toggle-magnet__body { stroke: light-dark(#50535b, #c6c8cd); }
  .toggle-magnet__input:checked + .toggle-magnet__track .toggle-magnet__field { opacity: 0.8; animation-play-state: running; }
  /* On: pulled in, accelerating, until it hits the poles. */
  .toggle-magnet__input:checked + .toggle-magnet__track .toggle-magnet__ball { transform: translateX(29px); transition: transform 0.4s cubic-bezier(0.7, 0, 1, 0.6); }
  .toggle-magnet__input:checked + .toggle-magnet__track .toggle-magnet__ball span { animation: toggle-magnet-hum 0.06s linear 0.4s infinite alternate; }
  @media (prefers-reduced-motion: reduce) {
    .toggle-magnet__track * { transition-duration: 0.01s !important; animation: none !important; }
  }
`;

export function MagnetToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-magnet">
        <input className="toggle-magnet__input" type="checkbox" role="switch" />
        <span className="toggle-magnet__track" aria-hidden="true">
          <svg className="toggle-magnet__art" viewBox="0 0 80 32">
            <path className="toggle-magnet__field" d="M56 8 C 44 6, 44 26, 56 24" />
            <path className="toggle-magnet__field" d="M56 8 C 36 2, 36 30, 56 24" />
            <path className="toggle-magnet__field" d="M56 8 C 28 -3, 28 35, 56 24" />
            <path className="toggle-magnet__body" d="M56 8 H66 a8 8 0 0 1 0 16 H56" />
            <rect className="toggle-magnet__pole" x="54" y="5.5" width="5" height="5" rx="1" />
            <rect className="toggle-magnet__pole" x="54" y="21.5" width="5" height="5" rx="1" />
          </svg>
          <span className="toggle-magnet__ball">
            <span />
          </span>
        </span>
        Magnetic lock
      </label>
    </>
  );
}
