"use client";

const css = `
  .toggle-neon-sign {
    display: inline-block;
    cursor: pointer;
    user-select: none;
  }

  .toggle-neon-sign__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .toggle-neon-sign__board {
    display: grid;
    place-items: center;
    width: 132px;
    height: 60px;
    border: 2px solid light-dark(#ebedf0, #232529);
    border-radius: 12px;
    background: light-dark(#fbfcfd, #121417);
    transition: box-shadow 0.4s;
  }

  .toggle-neon-sign__input:focus-visible + .toggle-neon-sign__board {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 3px;
  }

  /* Unlit tubes: dark glass. */
  .toggle-neon-sign__word {
    display: flex;
    gap: 0.12em;
    color: light-dark(#dbdde1, #2e3035);
    font-size: 28px;
    font-weight: 300;
    letter-spacing: 0.06em;
    transition: color 0.25s, text-shadow 0.25s;
  }

  /* Lit: a stutter, then a steady glow on the letters and the board. */
  .toggle-neon-sign__input:checked + .toggle-neon-sign__board {
    box-shadow: inset 0 0 22px light-dark(rgba(66, 69, 76, 0.12), rgba(229, 230, 233, 0.12)), 0 0 18px light-dark(rgba(66, 69, 76, 0.08), rgba(229, 230, 233, 0.08));
  }

  .toggle-neon-sign__input:checked + .toggle-neon-sign__board .toggle-neon-sign__word {
    color: light-dark(#373a40, #f1f2f3);
    text-shadow: 0 0 3px light-dark(#373a40, #f1f2f3), 0 0 10px light-dark(rgba(66, 69, 76, 0.8), rgba(229, 230, 233, 0.8)), 0 0 22px light-dark(rgba(66, 69, 76, 0.45), rgba(229, 230, 233, 0.45));
    animation: toggle-neon-sign-strike 0.9s steps(1);
  }

  .toggle-neon-sign__input:checked + .toggle-neon-sign__board .toggle-neon-sign__weak {
    animation: toggle-neon-sign-catch 4.2s steps(1) 1.4s infinite;
  }

  @keyframes toggle-neon-sign-strike {
    0%,
    12%,
    30%,
    52% {
      color: light-dark(#dbdde1, #2e3035);
      text-shadow: none;
    }
    8%,
    22%,
    40% {
      color: light-dark(#50535b, #c6c8cd);
      text-shadow: 0 0 8px light-dark(rgba(66, 69, 76, 0.5), rgba(229, 230, 233, 0.5));
    }
  }

  @keyframes toggle-neon-sign-catch {
    0%,
    6%,
    9% {
      opacity: 1;
    }
    4%,
    8% {
      opacity: 0.25;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-neon-sign__input:checked + .toggle-neon-sign__board .toggle-neon-sign__word,
    .toggle-neon-sign__input:checked + .toggle-neon-sign__board .toggle-neon-sign__weak {
      animation: none;
    }
  }
`;
export function NeonSignToggle() {
  return (
    <>
      <style>{css}</style>
      <label className="toggle-neon-sign">
        <input className="toggle-neon-sign__input" type="checkbox" role="switch" aria-label="Open sign" />
        <span className="toggle-neon-sign__board" aria-hidden="true">
          <span className="toggle-neon-sign__word"><span>O</span><span>P</span><span className="toggle-neon-sign__weak">E</span><span>N</span></span>
        </span>
      </label>
    </>
  );
}
