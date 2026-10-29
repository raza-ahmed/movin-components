"use client";

const css = `
  .cb-paperclip { position: relative; display: inline-flex; align-items: center; gap: 14px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-paperclip__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-paperclip__box { position: relative; width: 30px; height: 38px; }
  .cb-paperclip__input:focus-visible + .cb-paperclip__box { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; border-radius: 4px; }
  .cb-paperclip__paper {
    position: absolute;
    inset: 4px 0 0;
    padding: 7px 5px;
    border-radius: 2px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41), 0 6px 12px -8px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
    transform: rotate(-7deg);
    transition: transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .cb-paperclip__paper span { display: block; height: 2px; margin-bottom: 4px; border-radius: 1px; background: light-dark(#6d7179, #7d8087); }
  .cb-paperclip__paper span:nth-child(2) { width: 70%; }
  .cb-paperclip__paper span:nth-child(3) { width: 85%; }
  .cb-paperclip__clip { position: absolute; left: 8px; top: -14px; width: 10px; height: 26px; overflow: visible; opacity: 0; transform: translateY(-10px); transition: transform 0.3s, opacity 0.2s; }
  .cb-paperclip__clip path { fill: none; stroke: light-dark(#42454c, #e5e6e9); stroke-width: 1.6; stroke-linecap: round; }
  /* The clip comes down, grips, and the paper straightens under it. */
  .cb-paperclip__input:checked + .cb-paperclip__box .cb-paperclip__clip { opacity: 1; transform: none; transition: transform 0.35s cubic-bezier(0.5, 0, 0.3, 1.4), opacity 0.15s; }
  .cb-paperclip__input:checked + .cb-paperclip__box .cb-paperclip__paper { transform: rotate(0deg); transition-delay: 0.22s; }
  @media (prefers-reduced-motion: reduce) {
    .cb-paperclip * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function PaperclipCheckbox() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-paperclip">
        <input className="cb-paperclip__input" type="checkbox" />
        <span className="cb-paperclip__box" aria-hidden="true">
          <span className="cb-paperclip__paper">
            <span />
            <span />
            <span />
          </span>
          <svg className="cb-paperclip__clip" viewBox="0 0 10 26">
            <path d="M3 8V20a2.5 2.5 0 0 0 5 0V5a4 4 0 0 0-8 0v15" />
          </svg>
        </span>
        Attach receipt
      </label>
    </>
  );
}
