"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  .slider-curl { display: grid; justify-items: center; gap: 12px; width: 220px; }
  .slider-curl__book { --s: calc(var(--slider-curl-v) * 210px + 14px); position: relative; width: 150px; height: 108px; }
  .slider-curl__under, .slider-curl__page { position: absolute; inset: 0; padding: 14px 16px; border-radius: 3px; }
  .slider-curl__under { background: light-dark(#ebedf0, #232529); box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41); color: light-dark(#42454c, #e5e6e9); }
  .slider-curl__page { background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41); color: light-dark(#373a40, #f1f2f3); clip-path: polygon(0 0, 100% 0, 100% calc(100% - var(--s)), calc(100% - var(--s)) 100%, 0 100%); }
  .slider-curl__under small, .slider-curl__page small { display: block; margin-bottom: 6px; color: light-dark(#5f626a, #a7abb2); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; }
  .slider-curl__under b, .slider-curl__page b { font-family: Georgia, 'Times New Roman', serif; font-size: 16px; font-weight: 400; font-style: italic; }
  .slider-curl__lines { margin-top: 10px; height: 34px; background: repeating-linear-gradient(light-dark(#cbced3, #393c41) 0 1px, transparent 1px 7px); opacity: 0.7; }
  /* The turned corner: the removed triangle mirrored over the fold, shaded like the back of the page. */
  .slider-curl__flap { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to top left, light-dark(#6d7179, #7d8087), light-dark(#dbdde1, #2e3035) 40%, light-dark(#cbced3, #393c41)); clip-path: polygon(calc(100% - var(--s)) 100%, 100% calc(100% - var(--s)), calc(100% - var(--s)) calc(100% - var(--s))); filter: drop-shadow(-2px -2px 3px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4))); }
  .slider-curl__shadow { position: absolute; inset: 0; pointer-events: none; clip-path: polygon(calc(100% - var(--s) - 8px) 100%, 100% calc(100% - var(--s) - 8px), 100% 100%); background: linear-gradient(to top left, transparent 60%, color-mix(in oklab, light-dark(#fbfcfd, #121417) 45%, transparent)); }
  .slider-curl__read { color: light-dark(#50535b, #c6c8cd); font-size: 12px; font-variant-numeric: tabular-nums; }
  .slider-curl__read b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  .slider-curl__track { position: relative; width: 100%; height: 24px; }
  .slider-curl__rail { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-curl__fill { position: absolute; left: 0; top: 10px; height: 4px; border-radius: 2px; width: calc(10px + var(--slider-curl-v) * (100% - 20px)); background: light-dark(#50535b, #c6c8cd); }
  .slider-curl__thumb { position: absolute; top: 2px; left: calc(var(--slider-curl-v) * (100% - 20px)); width: 20px; height: 20px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-curl:has(.slider-curl__input:focus-visible) .slider-curl__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-curl__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-curl__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; }
  .slider-curl__input::-moz-range-thumb { width: 20px; height: 20px; border: 0; }
`;

export function CurlSlider() {
  const [v, setV] = useState(25);
  const t = (v - 0) / (100 - 0);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-curl" style={{ '--slider-curl-v': t } as React.CSSProperties}>
        <div className="slider-curl__book" aria-hidden="true">
          <div className="slider-curl__under">
            <small>Chapter two</small>
            <b>The long way home</b>
            <div className="slider-curl__lines" />
          </div>
          <div className="slider-curl__page">
            <small>Chapter one</small>
            <b>An early start</b>
            <div className="slider-curl__lines" />
          </div>
          <span className="slider-curl__shadow" />
          <span className="slider-curl__flap" />
        </div>
        <span className="slider-curl__read" aria-hidden="true">
          {v < 85 ? 'Chapter one' : 'Chapter two'} · <b>{v}%</b> turned
        </span>
        <div className="slider-curl__track">
          <span className="slider-curl__rail" />
          <span className="slider-curl__fill" />
          <span className="slider-curl__thumb" />
          <input
            className="slider-curl__input"
            type="range"
            min={0}
            max={100}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Turn the page"
            aria-valuetext={`Page ${v} percent turned`}
          />
        </div>
      </div>
    </>
  );
}
