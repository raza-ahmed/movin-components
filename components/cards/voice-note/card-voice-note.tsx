"use client";

import { useEffect, useMemo, useRef, useState } from 'react';

const css = `
  .card-voice-note {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 252px;
    padding: 10px 14px 10px 10px;
    border-radius: 22px 22px 22px 6px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .card-voice-note__play {
    display: grid;
    place-items: center;
    flex: none;
    width: 38px;
    height: 38px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.34, 1.6, 0.64, 1);
  }
  .card-voice-note__play:active { transform: scale(0.9); }
  .card-voice-note__play:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .card-voice-note__play svg { width: 16px; height: 16px; fill: currentColor; }
  .card-voice-note__wave { flex: 1; display: flex; align-items: center; gap: 2px; height: 30px; cursor: pointer; }
  .card-voice-note__bar { flex: 1; border-radius: 2px; background: light-dark(#cbced3, #393c41); transition: background-color 0.15s ease; }
  .card-voice-note__bar[data-on] { background: light-dark(#373a40, #f1f2f3); }
  .card-voice-note__time { width: 30px; color: light-dark(#5f626a, #a7abb2); font-size: 11px; font-variant-numeric: tabular-nums; text-align: right; }  @media (prefers-reduced-motion: reduce) {
    .card-voice-note__play, .card-voice-note__bar { transition: none; }
  }
`;

const LEN = 9; // seconds
const BARS = 34;

export function VoiceNoteCard() {
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0); // 0–1
  const raf = useRef(0);
  const heights = useMemo(() => {
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    // Speech-like envelope: louder in phrases, quiet between them.
    return Array.from({ length: BARS }, (_, i) => 0.18 + Math.abs(Math.sin(i * 0.42)) * 0.6 * (0.5 + rand() * 0.5));
  }, []);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPos((p) => {
        const next = p + dt / LEN;
        if (next >= 1) {
          setPlaying(false);
          return 0;
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  const secs = Math.floor((playing || pos > 0 ? pos : 1) * LEN);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-voice-note" role="group" aria-label="Voice note, 9 seconds">
        <button type="button" className="card-voice-note__play" aria-label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying((p) => !p)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {playing ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
          </svg>
        </button>
        {/* Click the waveform to seek. */}
        <div
          className="card-voice-note__wave"
          aria-hidden="true"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setPos(Math.min(0.999, Math.max(0, (e.clientX - r.left) / r.width)));
          }}
        >
          {heights.map((h, i) => (
            <span key={i} className="card-voice-note__bar" data-on={i / BARS < pos || undefined} style={{ height: `${(h * 100).toFixed(0)}%` }} />
          ))}
        </div>
        <span className="card-voice-note__time" aria-hidden="true">
          0:{String(secs).padStart(2, '0')}
        </span>
      </div>
    </>
  );
}
