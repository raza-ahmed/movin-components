"use client";

const css = `
  .cb-calendar { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-calendar__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-calendar__pad { position: relative; width: 34px; height: 38px; perspective: 140px; }
  .cb-calendar__input:focus-visible + .cb-calendar__pad { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; border-radius: 6px; }
  .cb-calendar__sheet {
    position: absolute;
    left: 0;
    right: 0;
    top: 6px;
    bottom: 0;
    display: grid;
    place-items: center;
    border-radius: 0 0 6px 6px;
    font-weight: 600;
    line-height: 1;
  }
  .cb-calendar__sheet--under { align-content: start; padding-top: 5px; background: light-dark(#ebedf0, #232529); box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41); color: light-dark(#5f626a, #a7abb2); font-size: 7px; letter-spacing: 0.12em; }
  .cb-calendar__sheet--page {
    align-content: center;
    gap: 2px;
    background: light-dark(#dbdde1, #2e3035);
    box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087);
    color: light-dark(#373a40, #f1f2f3);
    font-size: 14px;
    transform-origin: 50% 0;
    backface-visibility: hidden;
    transition: transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1), opacity 0s linear 0s;
  }
  .cb-calendar__month { color: light-dark(#50535b, #c6c8cd); font-size: 7px; letter-spacing: 0.12em; }
  .cb-calendar__stamp { position: absolute; left: 0; top: 6px; width: 34px; height: 26px; transform: scale(0.4); opacity: 0; transition: transform 0.15s, opacity 0.15s; }
  .cb-calendar__stamp path { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
  .cb-calendar__bind {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 8px;
    border-radius: 5px 5px 1px 1px;
    background: light-dark(#6d7179, #7d8087);
    z-index: 1;
  }
  .cb-calendar__ring { position: absolute; top: -3px; width: 3px; height: 7px; border-radius: 2px; background: light-dark(#50535b, #c6c8cd); }
  .cb-calendar__input:checked + .cb-calendar__pad .cb-calendar__sheet--page { transform: rotateX(130deg); transition: transform 0.45s cubic-bezier(0.5, 0, 0.3, 1); }
  .cb-calendar__input:checked + .cb-calendar__pad .cb-calendar__stamp { transform: none; opacity: 1; transition: transform 0.35s cubic-bezier(0.3, 1.8, 0.5, 1) 0.25s, opacity 0.1s ease 0.25s; }
  @media (prefers-reduced-motion: reduce) {
    .cb-calendar__pad * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function CalendarCheckbox() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-calendar">
        <input className="cb-calendar__input" type="checkbox" />
        <span className="cb-calendar__pad" aria-hidden="true">
          <span className="cb-calendar__sheet cb-calendar__sheet--under">
            OCT 26
            <svg className="cb-calendar__stamp" viewBox="0 0 34 26">
              <path d="M10 13.5L15 18.5L24.5 7.5" />
            </svg>
          </span>
          <span className="cb-calendar__sheet cb-calendar__sheet--page">
            <span className="cb-calendar__month">OCT</span>
            26
          </span>
          <span className="cb-calendar__bind">
            <span className="cb-calendar__ring" style={{ left: 8 }} />
            <span className="cb-calendar__ring" style={{ right: 8 }} />
          </span>
        </span>
        Mark today done
      </label>
    </>
  );
}
