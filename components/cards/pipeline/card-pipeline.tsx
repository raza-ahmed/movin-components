"use client";

import { useEffect, useState } from 'react';

const css = `
  @keyframes card-pipeline-spin { to { transform: rotate(360deg); } }
  .card-pipeline {
    width: 240px;
    padding: 14px;
    border-radius: 16px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .card-pipeline__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .card-pipeline__head b { color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 600; }
  .card-pipeline__status { padding: 2px 8px; border-radius: 999px; background: light-dark(#ebedf0, #232529); color: light-dark(#42454c, #e5e6e9); font-size: 10px; font-weight: 600; transition: background-color 0.3s ease, color 0.3s ease; }
  .card-pipeline[data-done] .card-pipeline__status { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .card-pipeline__track { display: flex; align-items: center; }
  .card-pipeline__stage { display: grid; justify-items: center; gap: 6px; width: 44px; }
  .card-pipeline__node {
    position: relative;
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1.5px solid light-dark(#cbced3, #393c41);
    background: light-dark(#fbfcfd, #121417);
    color: light-dark(#fbfcfd, #121417);
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }
  .card-pipeline__node[data-s='run'] { border-color: transparent; }
  .card-pipeline__node[data-s='run']::before {
    content: '';
    position: absolute;
    inset: -1.5px;
    border-radius: 50%;
    border: 1.5px solid light-dark(#dbdde1, #2e3035);
    border-top-color: light-dark(#373a40, #f1f2f3);
    animation: card-pipeline-spin 0.7s linear infinite;
  }
  .card-pipeline__node[data-s='ok'] { background: light-dark(#373a40, #f1f2f3); border-color: light-dark(#373a40, #f1f2f3); }
  .card-pipeline__node svg { width: 14px; height: 14px; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 0.3s ease 0.1s; }
  .card-pipeline__node[data-s='ok'] svg { stroke-dashoffset: 0; }
  .card-pipeline__name { color: light-dark(#5f626a, #a7abb2); font-size: 10px; }
  .card-pipeline__stage[data-s='ok'] .card-pipeline__name, .card-pipeline__stage[data-s='run'] .card-pipeline__name { color: light-dark(#373a40, #f1f2f3); }
  .card-pipeline__link { flex: 1; height: 2px; margin-bottom: 18px; border-radius: 1px; background: light-dark(#dbdde1, #2e3035); overflow: hidden; }
  .card-pipeline__link span { display: block; height: 100%; background: light-dark(#373a40, #f1f2f3); transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease; }
  .card-pipeline__link[data-on] span { transform: scaleX(1); }
  .card-pipeline__log { margin-top: 12px; color: light-dark(#5f626a, #a7abb2); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; }
`;

const STAGES = ['Build', 'Test', 'Deploy'];
// One line per step: queued, build running/done, test running/done, deploy running/done.
const LOG = ['queued', 'compiling 214 modules', 'build ok', 'running 86 tests', '86 passed', 'uploading to edge', 'live in 41s'];

export function PipelineCard() {
  // Step 0 = queued; 2n+1 = stage n running; 2n+2 = stage n done.
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setStep(6);
    const id = window.setInterval(() => setStep((s) => (s >= 8 ? 0 : s + 1)), 750);
    return () => clearInterval(id);
  }, []);

  const state = (n: number) => (step >= 2 * n + 2 ? 'ok' : step === 2 * n + 1 ? 'run' : 'idle');
  const done = step >= 6;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-pipeline" data-done={done || undefined} role="group" aria-label="Deploy pipeline">
        <div className="card-pipeline__head">
          <b>main · a4f2c1e</b>
          <span className="card-pipeline__status" aria-live="polite">
            {done ? 'Deployed' : step === 0 ? 'Queued' : 'Running'}
          </span>
        </div>
        <div className="card-pipeline__track">
          {STAGES.map((name, n) => (
            <div key={name} style={{ display: 'contents' }}>
              {n > 0 && (
                <span className="card-pipeline__link" data-on={step >= 2 * n || undefined} aria-hidden="true">
                  <span />
                </span>
              )}
              <div className="card-pipeline__stage" data-s={state(n)}>
                <span className="card-pipeline__node" data-s={state(n)} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
                  </svg>
                </span>
                <span className="card-pipeline__name">{name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="card-pipeline__log" aria-hidden="true">
          &gt; {LOG[Math.min(LOG.length - 1, step)]}
        </div>
      </div>
    </>
  );
}
