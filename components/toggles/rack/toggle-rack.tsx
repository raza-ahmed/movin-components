"use client";

const css = `
  .toggle-rack { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-rack__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-rack__track { position: relative; width: 86px; height: 40px; border-radius: 6px; }
  .toggle-rack__input:focus-visible + .toggle-rack__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  /* A toothed rack; the gear's teeth mesh with it as it rolls. */
  .toggle-rack__rack {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 9px;
    border-radius: 0 0 3px 3px;
    background:
      linear-gradient(light-dark(#cbced3, #393c41), light-dark(#cbced3, #393c41)) 0 100% / 100% 5px no-repeat,
      conic-gradient(from 135deg at 50% 0, light-dark(#cbced3, #393c41) 0 90deg, transparent 90deg) 0 0 / 6px 4px repeat-x;
  }
  .toggle-rack__gear {
    position: absolute;
    left: 2px;
    bottom: 7px;
    width: 30px;
    height: 30px;
    transition: transform 0.75s cubic-bezier(0.65, 0, 0.35, 1);
  }
  .toggle-rack__gear svg { display: block; width: 30px; height: 30px; }
  .toggle-rack__teeth { fill: light-dark(#5f626a, #a7abb2); transition: fill 0.3s; }
  .toggle-rack__hub { fill: light-dark(#f3f4f7, #1a1c1f); }
  .toggle-rack__spoke { fill: none; stroke: light-dark(#cbced3, #393c41); stroke-width: 2; }
  .toggle-rack__end { position: absolute; right: 2px; bottom: 10px; width: 4px; height: 14px; border-radius: 2px; background: light-dark(#dbdde1, #2e3035); transition: background-color 0.3s; }
  /* 52px of travel on a 15px radius is 199 degrees of roll. */
  .toggle-rack__input:checked + .toggle-rack__track .toggle-rack__gear { transform: translateX(52px) rotate(199deg); }
  .toggle-rack__input:checked + .toggle-rack__track .toggle-rack__teeth { fill: light-dark(#373a40, #f1f2f3); }
  .toggle-rack__input:checked + .toggle-rack__track .toggle-rack__end { background: light-dark(#373a40, #f1f2f3); transition-delay: 0.6s; }
  @media (prefers-reduced-motion: reduce) {
    .toggle-rack__track * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

// Ten teeth around a 15px gear, as one closed path.
const GEAR = (() => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i * 36 * Math.PI) / 180;
    [[-13, 11.6], [-6, 15], [6, 15], [13, 11.6]].forEach(([da, r]) => {
      const t = a + (da * Math.PI) / 180;
      pts.push(`${(15 + Math.cos(t) * r).toFixed(2)} ${(15 + Math.sin(t) * r).toFixed(2)}`);
    });
  }
  return `M${pts.join('L')}Z`;
})();

export function RackToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-rack">
        <input className="toggle-rack__input" type="checkbox" role="switch" />
        <span className="toggle-rack__track" aria-hidden="true">
          <span className="toggle-rack__rack" />
          <span className="toggle-rack__end" />
          <span className="toggle-rack__gear">
            <svg viewBox="0 0 30 30">
              <path className="toggle-rack__teeth" d={GEAR} />
              <circle className="toggle-rack__hub" cx="15" cy="15" r="7" />
              <path className="toggle-rack__spoke" d="M15 9.5v11M9.5 15h11" />
            </svg>
          </span>
        </span>
        Drive gear
      </label>
    </>
  );
}
