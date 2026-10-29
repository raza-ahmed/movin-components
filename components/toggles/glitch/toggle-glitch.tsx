"use client";

import { useState } from 'react';

const css = `
  @keyframes toggle-glitch-go {
    0% { transform: translateX(0); }
    18% { transform: translateX(11px); }
    30% { transform: translateX(5px); }
    46% { transform: translateX(24px); }
    58% { transform: translateX(19px); }
    74% { transform: translateX(31px); }
    86% { transform: translateX(36px); }
    100% { transform: translateX(34px); }
  }
  @keyframes toggle-glitch-back {
    0% { transform: translateX(34px); }
    18% { transform: translateX(23px); }
    30% { transform: translateX(29px); }
    46% { transform: translateX(10px); }
    58% { transform: translateX(15px); }
    74% { transform: translateX(3px); }
    86% { transform: translateX(-2px); }
    100% { transform: translateX(0); }
  }
  @keyframes toggle-glitch-ghost-a { 0%, 85% { opacity: 0.8; transform: translateX(-5px); } 40% { transform: translateX(4px); } 100% { opacity: 0; transform: none; } }
  @keyframes toggle-glitch-ghost-b { 0%, 85% { opacity: 0.8; transform: translateX(-5px); } 40% { transform: translateX(4px); } 100% { opacity: 0; transform: none; } }
  @keyframes toggle-glitch-slice-a {
    0%, 100% { clip-path: inset(0); transform: none; }
    20% { clip-path: inset(0 0 60% 0); transform: translateX(3px); }
    40% { clip-path: inset(40% 0 0 0); transform: translateX(-3px); }
    60% { clip-path: inset(20% 0 30% 0); transform: translateX(2px); }
  }
  @keyframes toggle-glitch-slice-b {
    0%, 100% { clip-path: inset(0); transform: none; }
    20% { clip-path: inset(50% 0 0 0); transform: translateX(-3px); }
    40% { clip-path: inset(0 0 45% 0); transform: translateX(3px); }
    60% { clip-path: inset(30% 0 20% 0); transform: translateX(-2px); }
  }
  .toggle-glitch { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-glitch__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-glitch__track { position: relative; width: 64px; height: 30px; border-radius: 999px; }
  .toggle-glitch__input:focus-visible + .toggle-glitch__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-glitch__bg {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: repeating-linear-gradient(0deg, transparent 0 2px, color-mix(in oklab, light-dark(#fbfcfd, #121417) 35%, transparent) 2px 3px), light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    transition: background-color 0.2s;
  }
  .toggle-glitch__thumb { position: absolute; left: 4px; top: 4px; width: 22px; height: 22px; }
  .toggle-glitch__thumb i, .toggle-glitch__thumb::before, .toggle-glitch__thumb::after { position: absolute; inset: 0; border-radius: 50%; }
  .toggle-glitch__thumb i { background: light-dark(#42454c, #e5e6e9); transition: background-color 0.2s; }
  .toggle-glitch__thumb::before, .toggle-glitch__thumb::after { content: ''; opacity: 0; }
  .toggle-glitch__thumb::before { background: light-dark(#5f626a, #a7abb2); }
  .toggle-glitch__thumb::after { background: light-dark(#cbced3, #393c41); }
  .toggle-glitch__input:checked + .toggle-glitch__track .toggle-glitch__bg { background-color: light-dark(#cbced3, #393c41); }
  .toggle-glitch__input:checked + .toggle-glitch__track .toggle-glitch__thumb { transform: translateX(34px); }
  .toggle-glitch__input:checked + .toggle-glitch__track .toggle-glitch__thumb i { background: light-dark(#373a40, #f1f2f3); }
  /* The thumb teleports in jumps, trailed by offset ghosts, while the track tears into slices. */
  .toggle-glitch[data-armed] .toggle-glitch__input:checked + .toggle-glitch__track .toggle-glitch__thumb { animation: toggle-glitch-go 0.42s steps(1); }
  .toggle-glitch[data-armed] .toggle-glitch__input:not(:checked) + .toggle-glitch__track .toggle-glitch__thumb { animation: toggle-glitch-back 0.42s steps(1); }
  .toggle-glitch[data-armed] .toggle-glitch__input:checked + .toggle-glitch__track .toggle-glitch__thumb::before { animation: toggle-glitch-ghost-a 0.42s steps(2); }
  .toggle-glitch[data-armed] .toggle-glitch__input:checked + .toggle-glitch__track .toggle-glitch__thumb::after { animation: toggle-glitch-ghost-a 0.42s steps(3) reverse; }
  .toggle-glitch[data-armed] .toggle-glitch__input:not(:checked) + .toggle-glitch__track .toggle-glitch__thumb::before { animation: toggle-glitch-ghost-b 0.42s steps(2); }
  .toggle-glitch[data-armed] .toggle-glitch__input:not(:checked) + .toggle-glitch__track .toggle-glitch__thumb::after { animation: toggle-glitch-ghost-b 0.42s steps(3) reverse; }
  .toggle-glitch[data-armed] .toggle-glitch__input:checked + .toggle-glitch__track .toggle-glitch__bg { animation: toggle-glitch-slice-a 0.42s steps(1); }
  .toggle-glitch[data-armed] .toggle-glitch__input:not(:checked) + .toggle-glitch__track .toggle-glitch__bg { animation: toggle-glitch-slice-b 0.42s steps(1); }
  @media (prefers-reduced-motion: reduce) {
    .toggle-glitch__track *, .toggle-glitch__track *::before, .toggle-glitch__track *::after { animation: none !important; }
  }
`;

export function GlitchToggle() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-glitch" data-armed={armed || undefined}>
        <input className="toggle-glitch__input" type="checkbox" role="switch" onChange={() => setArmed(true)} />
        <span className="toggle-glitch__track" aria-hidden="true">
          <span className="toggle-glitch__bg" />
          <span className="toggle-glitch__thumb">
            <i />
          </span>
        </span>
        Glitch effects
      </label>
    </>
  );
}
