"use client";

const css = `
  .toggle-seesaw {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: light-dark(#42454c, #e5e6e9);
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .toggle-seesaw__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .toggle-seesaw__rig {
    position: relative;
    display: block;
    width: 84px;
    height: 52px;
    border-radius: 8px;
  }

  .toggle-seesaw__input:focus-visible + .toggle-seesaw__rig {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 2px;
  }

  /* The beam tips about its middle; left end down when off, right when on. */
  .toggle-seesaw__beam {
    position: absolute;
    top: 26px;
    left: 4px;
    width: 76px;
    height: 8px;
    border-radius: 4px;
    background: light-dark(#cbced3, #393c41);
    transform: rotate(-9deg);
    transition: transform 0.3s cubic-bezier(0.3, 1.5, 0.5, 1), background-color 0.3s;
  }

  .toggle-seesaw__pivot {
    position: absolute;
    top: 30px;
    left: 50%;
    width: 18px;
    height: 18px;
    margin-left: -9px;
    background: light-dark(#dbdde1, #2e3035);
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
  }

  /* The ball rides the beam. Rolling 56px on a radius of 8px turns it 56 / 8
     radians (about 401deg), so the stripe really rolls. */
  .toggle-seesaw__ball {
    position: absolute;
    bottom: 8px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(90deg, transparent 6px, light-dark(#6d7179, #7d8087) 6px 10px, transparent 10px), radial-gradient(circle at 35% 30%, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd));
    transition: transform 0.6s cubic-bezier(0.5, 0, 0.6, 1.2) 0.08s;
  }

  .toggle-seesaw__input:checked + .toggle-seesaw__rig .toggle-seesaw__beam {
    background: light-dark(#50535b, #c6c8cd);
    transform: rotate(9deg);
  }

  .toggle-seesaw__input:checked + .toggle-seesaw__rig .toggle-seesaw__ball {
    transform: translateX(56px) rotate(401deg);
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-seesaw__beam,
    .toggle-seesaw__ball {
      transition: none;
    }
  }
`;
export function SeesawToggle() {
  return (
    <>
      <style>{css}</style>
      <label className="toggle-seesaw">
        <input className="toggle-seesaw__input" type="checkbox" role="switch" />
        <span className="toggle-seesaw__rig" aria-hidden="true">
          <span className="toggle-seesaw__beam"><span className="toggle-seesaw__ball" /></span>
          <span className="toggle-seesaw__pivot" />
        </span>
        <span className="toggle-seesaw__label">Balance</span>
      </label>
    </>
  );
}
