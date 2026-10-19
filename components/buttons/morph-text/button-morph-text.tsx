"use client";

const css = `
  .btn-morph-text {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: 172px;
    height: 56px;
    padding: 0;
    border: 1px solid #3a3a3a;
    border-radius: 999px;
    background: #202020;
    color: #ededed;
    font: inherit;
    font-size: 19px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.3s, background-color 0.3s;
    -webkit-tap-highlight-color: transparent;
  }

  .btn-morph-text:hover {
    border-color: #7c7c7c;
    background: #282828;
  }

  .btn-morph-text:focus-visible {
    outline: 2px solid #ededed;
    outline-offset: 4px;
  }

  /* Blurred words + a hard alpha threshold = letters that melt into each other. */
  .btn-morph-text__words {
    display: grid;
    filter: url(#btn-morph-text-threshold);
  }

  .btn-morph-text__word {
    grid-area: 1 / 1;
    text-align: center;
    white-space: nowrap;
    transition: filter 0.75s cubic-bezier(0.5, 0, 0.3, 1), opacity 0.75s cubic-bezier(0.5, 0, 0.3, 1), letter-spacing 0.75s cubic-bezier(0.5, 0, 0.3, 1);
  }

  .btn-morph-text__word--b {
    opacity: 0;
    filter: blur(7px);
    letter-spacing: 0.12em;
  }

  .btn-morph-text:hover .btn-morph-text__word--a,
  .btn-morph-text:focus-visible .btn-morph-text__word--a {
    opacity: 0;
    filter: blur(7px);
    letter-spacing: 0.12em;
  }

  .btn-morph-text:hover .btn-morph-text__word--b,
  .btn-morph-text:focus-visible .btn-morph-text__word--b {
    opacity: 1;
    filter: blur(0);
    letter-spacing: 0;
  }

  .btn-morph-text__defs {
    position: absolute;
    width: 0;
    height: 0;
  }

  /* A plain crossfade, no melting. */
  @media (prefers-reduced-motion: reduce) {
    .btn-morph-text,
    .btn-morph-text__word {
      transition: none;
    }
    .btn-morph-text__words {
      filter: none;
    }
  }
`;
// Pure CSS: both words blur through each other inside an SVG alpha threshold,
// so the overlap reads as melting letterforms rather than a crossfade.
export function MorphTextButton({ label = 'Explore', next = "Let's go" }: { label?: string; next?: string }) {
  return (
    <>
      <style>{css}</style>
      <button className="btn-morph-text" type="button" aria-label={label}>
        <span className="btn-morph-text__words" aria-hidden="true">
          <span className="btn-morph-text__word btn-morph-text__word--a">{label}</span>
          <span className="btn-morph-text__word btn-morph-text__word--b">{next}</span>
        </span>
        <svg className="btn-morph-text__defs" aria-hidden="true" focusable="false">
          <filter id="btn-morph-text-threshold" x="-20%" y="-60%" width="140%" height="220%">
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -4" />
          </filter>
        </svg>
      </button>
    </>
  );
}
