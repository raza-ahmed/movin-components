"use client";

const css = `
  @keyframes toggle-waveform-run { to { transform: translateX(-20px); } }
  .toggle-waveform { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-waveform__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-waveform__track {
    position: relative;
    width: 84px;
    height: 32px;
    border-radius: 999px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
  }
  .toggle-waveform__input:focus-visible + .toggle-waveform__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-waveform__icon { position: absolute; left: 9px; top: 9px; width: 14px; height: 14px; color: light-dark(#5f626a, #a7abb2); transition: color 0.3s; }
  .toggle-waveform__icon path:last-child { opacity: 1; transition: opacity 0.2s; }
  .toggle-waveform__icon path:nth-child(2) { opacity: 0; transition: opacity 0.2s; }
  .toggle-waveform__window { position: absolute; left: 26px; right: 8px; top: 0; bottom: 0; overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 25%, #000 75%, transparent); }
  .toggle-waveform__amp { position: absolute; left: 0; top: 0; width: 100px; height: 32px; transform: scaleY(0.05); transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .toggle-waveform__amp svg { display: block; width: 100px; height: 32px; animation: toggle-waveform-run 0.7s linear infinite paused; }
  .toggle-waveform__amp path { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 1.8; vector-effect: non-scaling-stroke; transition: stroke 0.3s; }
  .toggle-waveform__input:checked + .toggle-waveform__track .toggle-waveform__icon { color: light-dark(#373a40, #f1f2f3); }
  .toggle-waveform__input:checked + .toggle-waveform__track .toggle-waveform__icon path:nth-child(2) { opacity: 1; }
  .toggle-waveform__input:checked + .toggle-waveform__track .toggle-waveform__icon path:last-child { opacity: 0; }
  .toggle-waveform__input:checked + .toggle-waveform__track .toggle-waveform__amp { transform: scaleY(1); }
  .toggle-waveform__input:checked + .toggle-waveform__track .toggle-waveform__amp svg { animation-play-state: running; }
  .toggle-waveform__input:checked + .toggle-waveform__track .toggle-waveform__amp path { stroke: light-dark(#373a40, #f1f2f3); }
  @media (prefers-reduced-motion: reduce) {
    .toggle-waveform__amp { transition-duration: 0.01s; }
    .toggle-waveform__amp svg { animation: none !important; }
  }
`;

// A sine with a 20px period, long enough to scroll one period without a seam.
const WAVE = (() => {
  let d = '';
  for (let x = 0; x <= 100; x += 2) {
    const env = 0.55 + 0.45 * Math.sin((x / 100) * Math.PI * 3);
    d += `${x ? 'L' : 'M'}${x} ${(16 - Math.sin((x / 20) * Math.PI * 2) * 11 * env).toFixed(2)}`;
  }
  return d;
})();

export function WaveformToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-waveform">
        <input className="toggle-waveform__input" type="checkbox" role="switch" />
        <span className="toggle-waveform__track" aria-hidden="true">
          <svg className="toggle-waveform__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
            <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
            <path d="M17 9.5l5 5M22 9.5l-5 5" />
          </svg>
          <span className="toggle-waveform__window">
            <span className="toggle-waveform__amp">
              <svg viewBox="0 0 100 32" preserveAspectRatio="none">
                <path d={WAVE} />
              </svg>
            </span>
          </span>
        </span>
        Sound
      </label>
    </>
  );
}
