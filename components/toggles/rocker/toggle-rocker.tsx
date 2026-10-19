"use client";

const css = `
  .toggle-rocker {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: #ededed;
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
    border: 1px solid #3a3a3a;
    border-radius: 10px;
    background:
      radial-gradient(circle at 50% 8px, #4d4d4d 0 2px, transparent 2.5px),
      radial-gradient(circle at 50% calc(100% - 8px), #4d4d4d 0 2px, transparent 2.5px),
      #282828;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.45);
    perspective: 160px;
  }

  .toggle-rocker__input:focus-visible + .toggle-rocker__plate {
    outline: 2px solid #a7a7a7;
    outline-offset: 3px;
  }

  .toggle-rocker__led {
    position: absolute;
    top: 16px;
    right: 9px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #3a3a3a;
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
    background: linear-gradient(#202020, #4d4d4d 50%, #7c7c7c);
    box-shadow: inset 0 0 0 1px rgba(246, 246, 246, 0.08), 0 4px 6px rgba(0, 0, 0, 0.4);
    transform: rotateX(24deg);
    transition: transform 0.18s cubic-bezier(0.5, 0, 0.3, 1.6), background 0.18s;
  }

  .toggle-rocker__mark {
    color: #a7a7a7;
    font-size: 9px;
    font-weight: 700;
    line-height: 1;
  }

  .toggle-rocker__input:checked + .toggle-rocker__plate .toggle-rocker__paddle {
    background: linear-gradient(#7c7c7c, #4d4d4d 50%, #202020);
    transform: rotateX(-24deg);
  }

  .toggle-rocker__input:checked + .toggle-rocker__plate .toggle-rocker__led {
    background: #f6f6f6;
    box-shadow: 0 0 6px 2px rgba(246, 246, 246, 0.6);
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
