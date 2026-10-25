"use client";

const css = `
  .toggle-rocker {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: light-dark(#42454c, #e5e6e9);
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .toggle-rocker__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  /* The wall plate, with screw dots top and bottom. */
  .toggle-rocker__plate {
    position: relative;
    display: grid;
    place-items: center;
    width: 56px;
    height: 84px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 10px;
    background:
      radial-gradient(circle at 50% 8px, light-dark(#cbced3, #393c41) 0 2px, transparent 2.5px),
      radial-gradient(circle at 50% calc(100% - 8px), light-dark(#cbced3, #393c41) 0 2px, transparent 2.5px),
      light-dark(#ebedf0, #232529);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.45);
    perspective: 160px;
  }

  .toggle-rocker__input:focus-visible + .toggle-rocker__plate {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 3px;
  }

  .toggle-rocker__led {
    position: absolute;
    top: 16px;
    right: 9px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: light-dark(#dbdde1, #2e3035);
    transition: background-color 0.2s, box-shadow 0.3s;
  }

  /* The paddle tips about its middle: top in when off, bottom in when on. Its
     gradient puts the light on whichever half faces up. */
  .toggle-rocker__paddle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    width: 28px;
    height: 50px;
    padding: 6px 0;
    border-radius: 6px;
    background: linear-gradient(light-dark(#f3f4f7, #1a1c1f), light-dark(#cbced3, #393c41) 50%, light-dark(#6d7179, #7d8087));
    box-shadow: inset 0 0 0 1px light-dark(rgba(55, 58, 64, 0.08), rgba(241, 242, 243, 0.08)), 0 4px 6px rgba(0, 0, 0, 0.4);
    transform: rotateX(24deg);
    transition: transform 0.18s cubic-bezier(0.5, 0, 0.3, 1.6), background 0.18s;
  }

  .toggle-rocker__mark {
    color: light-dark(#5f626a, #a7abb2);
    font-size: 9px;
    font-weight: 700;
    line-height: 1;
  }

  .toggle-rocker__input:checked + .toggle-rocker__plate .toggle-rocker__paddle {
    background: linear-gradient(light-dark(#6d7179, #7d8087), light-dark(#cbced3, #393c41) 50%, light-dark(#f3f4f7, #1a1c1f));
    transform: rotateX(-24deg);
  }

  .toggle-rocker__input:checked + .toggle-rocker__plate .toggle-rocker__led {
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 6px 2px light-dark(rgba(55, 58, 64, 0.6), rgba(241, 242, 243, 0.6));
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-rocker__paddle,
    .toggle-rocker__led {
      transition: none;
    }
  }
`;
export function RockerToggle() {
  return (
    <>
      <style>{css}</style>
      <label className="toggle-rocker">
        <input className="toggle-rocker__input" type="checkbox" role="switch" />
        <span className="toggle-rocker__plate" aria-hidden="true">
          <span className="toggle-rocker__led" />
          <span className="toggle-rocker__paddle"><span className="toggle-rocker__mark">I</span><span className="toggle-rocker__mark">O</span></span>
        </span>
        <span className="toggle-rocker__label">Lights</span>
      </label>
    </>
  );
}
