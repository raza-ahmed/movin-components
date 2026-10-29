"use client";

const css = `
  .toggle-cradle { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-cradle__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-cradle__track { position: relative; width: 100px; height: 50px; border-radius: 6px; }
  .toggle-cradle__input:focus-visible + .toggle-cradle__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-cradle__bar { position: absolute; left: 18px; right: 18px; top: 0; height: 3px; border-radius: 2px; background: light-dark(#6d7179, #7d8087); }
  .toggle-cradle__bob { position: absolute; top: 2px; width: 12px; height: 44px; transform-origin: 50% 0; }
  .toggle-cradle__bob::before { content: ''; position: absolute; left: 5.5px; top: 0; width: 1px; height: 33px; background: light-dark(#6d7179, #7d8087); }
  .toggle-cradle__bob::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, light-dark(#42454c, #e5e6e9), light-dark(#6d7179, #7d8087) 75%);
  }
  .toggle-cradle__bob:nth-child(2) { left: 26px; }
  .toggle-cradle__bob:nth-child(3) { left: 38px; }
  .toggle-cradle__bob:nth-child(4) { left: 50px; }
  .toggle-cradle__bob:nth-child(5) { left: 62px; }
  /* Off: the left ball is raised. Turning off swings the right ball down first, then the left one up. */
  .toggle-cradle__bob:nth-child(2) { transform: rotate(38deg); transition: transform 0.4s cubic-bezier(0, 0, 0.4, 1) 0.28s; }
  .toggle-cradle__bob:nth-child(5) { transform: rotate(0deg); transition: transform 0.28s cubic-bezier(0.5, 0, 1, 1); }
  .toggle-cradle__input:checked + .toggle-cradle__track .toggle-cradle__bob:nth-child(2) { transform: rotate(0deg); transition: transform 0.28s cubic-bezier(0.5, 0, 1, 1); }
  .toggle-cradle__input:checked + .toggle-cradle__track .toggle-cradle__bob:nth-child(5) { transform: rotate(-38deg); transition: transform 0.4s cubic-bezier(0, 0, 0.4, 1) 0.28s; }
  .toggle-cradle__input:checked + .toggle-cradle__track .toggle-cradle__bob:nth-child(5)::after { background: radial-gradient(circle at 35% 30%, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd) 75%); }
  @media (prefers-reduced-motion: reduce) {
    .toggle-cradle__track .toggle-cradle__bob { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function CradleToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-cradle">
        <input className="toggle-cradle__input" type="checkbox" role="switch" />
        <span className="toggle-cradle__track" aria-hidden="true">
          <span className="toggle-cradle__bar" />
          <span className="toggle-cradle__bob" />
          <span className="toggle-cradle__bob" />
          <span className="toggle-cradle__bob" />
          <span className="toggle-cradle__bob" />
        </span>
        Momentum
      </label>
    </>
  );
}
