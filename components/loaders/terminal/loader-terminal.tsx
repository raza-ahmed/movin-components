"use client";

const css = `
  .loader-terminal {
    --loader-terminal-step: 1.4s;
    box-sizing: border-box;
    width: 240px;
    padding: 10px 14px 12px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#5f626a, #a7abb2);
    font-family: ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace;
    font-size: 12px;
    line-height: 1.5;
  }

  .loader-terminal__bar {
    display: flex;
    gap: 5px;
    margin-bottom: 8px;
  }

  .loader-terminal__bar span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: light-dark(#dbdde1, #2e3035);
  }

  .loader-terminal__line {
    display: flex;
    gap: 8px;
    white-space: nowrap;
  }

  .loader-terminal__prompt {
    color: light-dark(#6d7179, #7d8087);
  }

  /* One-line windows over vertical strips. */
  .loader-terminal__window {
    display: block;
    height: 1.5em;
    overflow: hidden;
  }

  .loader-terminal__window--spin {
    width: 1ch;
    color: light-dark(#42454c, #e5e6e9);
  }

  .loader-terminal__frames,
  .loader-terminal__steps {
    display: flex;
    flex-direction: column;
  }

  .loader-terminal__frames {
    animation: loader-terminal-spin 0.8s steps(10) infinite;
  }

  /* The last step repeats the first, so the roll back to the top is invisible. */
  .loader-terminal__steps {
    animation: loader-terminal-steps calc(var(--loader-terminal-step) * 4) cubic-bezier(0.6, 0, 0.2, 1) infinite;
  }

  @keyframes loader-terminal-spin {
    to {
      transform: translateY(-15em);
    }
  }

  @keyframes loader-terminal-steps {
    0%,
    20% {
      transform: translateY(0);
    }
    25%,
    45% {
      transform: translateY(-1.5em);
    }
    50%,
    70% {
      transform: translateY(-3em);
    }
    75%,
    95% {
      transform: translateY(-4.5em);
    }
    100% {
      transform: translateY(-6em);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-terminal__frames,
    .loader-terminal__steps {
      animation: none;
    }
  }
`;
const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const STEPS = ['resolving packages', 'fetching 214 packages', 'linking dependencies', 'building fresh packages'];

export function TerminalLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-terminal" role="status" aria-label="Loading">
        <div className="loader-terminal__bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="loader-terminal__line" aria-hidden="true">
          <span className="loader-terminal__prompt">$</span> npm install
        </div>
        <div className="loader-terminal__line" aria-hidden="true">
          <span className="loader-terminal__window loader-terminal__window--spin">
            <span className="loader-terminal__frames">
              {FRAMES.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </span>
          </span>
          <span className="loader-terminal__window">
            <span className="loader-terminal__steps">
              {/* The first step repeats at the end so the roll back to the top is invisible. */}
              {[...STEPS, STEPS[0]].map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </span>
          </span>
        </div>
      </div>
    </>
  );
}
