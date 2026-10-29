"use client";

const css = `
  @keyframes btn-foil-sweep { from { --btn-foil-x: -20%; } to { --btn-foil-x: 120%; } }
  @property --btn-foil-x { syntax: '<percentage>'; inherits: true; initial-value: 30%; }
  .btn-foil {
    --btn-foil-x: 30%;
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 13px 34px 12px;
    border: none;
    border-radius: 6px;
    background: linear-gradient(light-dark(#f3f4f7, #1a1c1f), light-dark(#fbfcfd, #121417));
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), inset 0 0 0 4px light-dark(#fbfcfd, #121417), inset 0 0 0 5px color-mix(in oklab, light-dark(#6d7179, #7d8087) 40%, transparent), 0 10px 22px -12px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7));
    font: inherit;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .btn-foil:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; animation: btn-foil-sweep 1.2s ease-in-out; }
  .btn-foil__word, .btn-foil__small {
    /* The foil: a pale band at --btn-foil-x across darker metal, clipped to the letters. */
    background: linear-gradient(100deg, light-dark(#6d7179, #7d8087) calc(var(--btn-foil-x) - 30%), light-dark(#373a40, #f1f2f3) var(--btn-foil-x), light-dark(#6d7179, #7d8087) calc(var(--btn-foil-x) + 30%));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .btn-foil__word { font-size: 15px; font-weight: 600; letter-spacing: 0.32em; margin-right: -0.32em; text-transform: uppercase; }
  .btn-foil__small { font-size: 9px; letter-spacing: 0.4em; margin-right: -0.4em; text-transform: uppercase; }
  .btn-foil__rule { width: 28px; height: 1px; background: color-mix(in oklab, light-dark(#6d7179, #7d8087) 60%, transparent); }
  .btn-foil:active { transform: translateY(1px); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), inset 0 0 0 4px light-dark(#fbfcfd, #121417), inset 0 0 0 5px color-mix(in oklab, light-dark(#6d7179, #7d8087) 40%, transparent), inset 0 3px 8px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5)); }
  @media (prefers-reduced-motion: reduce) {
    .btn-foil:focus-visible { animation: none; }
  }
`;

export function FoilButton() {
  return (
    <>
      <style>
        {css}
      </style>
      <button
        type="button"
        className="btn-foil"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--btn-foil-x', `${Math.round(((e.clientX - r.left) / r.width) * 100)}%`);
        }}
      >
        <span className="btn-foil__small" aria-hidden="true">
          Est. 2026
        </span>
        <span className="btn-foil__word">Members</span>
        <span className="btn-foil__rule" aria-hidden="true" />
      </button>
    </>
  );
}
