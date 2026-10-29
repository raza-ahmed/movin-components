"use client";

import { useId } from 'react';

const css = `
  .radio-tone { display: grid; justify-items: center; gap: 14px; }
  .radio-tone__bubble {
    position: relative;
    width: 210px;
    height: 54px;
    border-radius: 4px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41);
    transition: border-radius 0.5s cubic-bezier(0.3, 1.3, 0.5, 1), transform 0.5s cubic-bezier(0.3, 1.6, 0.5, 1), background-color 0.4s;
  }
  .radio-tone__bubble::after {
    content: '';
    position: absolute;
    left: 18px;
    bottom: -7px;
    width: 14px;
    height: 8px;
    background: inherit;
    clip-path: polygon(0 0, 100% 0, 15% 100%);
  }
  .radio-tone:has(.radio-tone__input[value='casual']:checked) .radio-tone__bubble { border-radius: 16px; }
  .radio-tone:has(.radio-tone__input[value='playful']:checked) .radio-tone__bubble { border-radius: 26px 26px 26px 8px; transform: rotate(-3deg) scale(1.04); background: light-dark(#dbdde1, #2e3035); }
  .radio-tone__line {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: light-dark(#373a40, #f1f2f3);
    font-size: 14px;
    opacity: 0;
    filter: blur(4px);
    transform: translateY(6px);
    transition: opacity 0.25s, filter 0.25s, transform 0.25s;
  }
  .radio-tone__line--formal { font-family: Georgia, 'Times New Roman', serif; }
  .radio-tone__line--playful { font-weight: 600; }
  .radio-tone:has(.radio-tone__input[value='formal']:checked) .radio-tone__line--formal,
  .radio-tone:has(.radio-tone__input[value='casual']:checked) .radio-tone__line--casual,
  .radio-tone:has(.radio-tone__input[value='playful']:checked) .radio-tone__line--playful {
    opacity: 1;
    filter: blur(0);
    transform: none;
    transition-delay: 0.12s;
  }
  .radio-tone__opts { display: flex; gap: 4px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-tone__opt {
    position: relative;
    padding: 5px 12px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-tone__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-tone__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-tone__opt:has(.radio-tone__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-tone__opt:has(.radio-tone__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .radio-tone * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const TONES = [
  { value: 'formal', label: 'Formal', text: 'Dear team, please review.' },
  { value: 'casual', label: 'Casual', text: 'Hey all, got a sec to look?' },
  { value: 'playful', label: 'Playful', text: 'Yo crew, peep this!' },
];

export function ToneRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-tone">
        <span className="radio-tone__bubble" aria-hidden="true">
          {TONES.map((t) => (
            <span key={t.value} className={`radio-tone__line radio-tone__line--${t.value}`}>
              {t.text}
            </span>
          ))}
        </span>
        <div className="radio-tone__opts" role="radiogroup" aria-label="Tone">
          {TONES.map((t, i) => (
            <label key={t.value} className="radio-tone__opt">
              <input className="radio-tone__input" type="radio" name={name} value={t.value} defaultChecked={i === 1} />
              {t.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
