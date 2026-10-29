"use client";

import * as React from "react";
const CARDS = [
  { name: 'Everyday', last: '4242', bg: 'light-dark(#cbced3, #393c41)', fan: { x: -46, y: -64, r: -14 } },
  { name: 'Travel', last: '0937', bg: 'light-dark(#5f626a, #a7abb2)', fan: { x: 0, y: -78, r: 0 } },
  { name: 'Studio', last: '8810', bg: 'light-dark(#42454c, #e5e6e9)', fan: { x: 46, y: -64, r: 14 } },
];

const css = `
  .card-wallet { position: relative; width: 230px; height: 190px; outline: none; }
  .card-wallet__back { position: absolute; left: 20px; right: 20px; bottom: 6px; height: 104px; border-radius: 14px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-wallet__card {
    position: absolute;
    left: 50%;
    bottom: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 132px;
    height: 84px;
    margin-left: -66px;
    padding: 9px 11px;
    border-radius: 9px;
    background: var(--c);
    box-shadow: 0 6px 14px -8px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
    color: light-dark(#fbfcfd, #121417);
    font-size: 10px;
    font-weight: 600;
    transform: translateY(calc(var(--k) * -9px));
    transition: transform 0.6s cubic-bezier(0.3, 1.3, 0.5, 1);
    transition-delay: calc(var(--k) * 40ms);
  }
  .card-wallet__card span:last-child { align-self: flex-end; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 0.08em; opacity: 0.8; }
  .card-wallet__chip { width: 16px; height: 12px; border-radius: 3px; background: color-mix(in oklab, light-dark(#fbfcfd, #121417) 35%, transparent); }
  .card-wallet__pocket {
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 6px;
    height: 74px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 16px 13px;
    border-radius: 6px 6px 14px 14px;
    background: linear-gradient(light-dark(#dbdde1, #2e3035), light-dark(#ebedf0, #232529));
    box-shadow: inset 0 1px 0 light-dark(#cbced3, #393c41), 0 -6px 12px -8px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5)), 0 14px 24px -14px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7));
    color: light-dark(#373a40, #f1f2f3);
    font-size: 12px;
    font-weight: 500;
  }
  .card-wallet__pocket::before { content: ''; position: absolute; inset: 5px; border: 1px dashed color-mix(in oklab, light-dark(#5f626a, #a7abb2) 55%, transparent); border-radius: 3px 3px 10px 10px; pointer-events: none; }
  .card-wallet__pocket small { color: light-dark(#5f626a, #a7abb2); font-size: 11px; font-weight: 400; }
  .card-wallet:is(:hover, :focus-visible) .card-wallet__card { transform: translate(var(--fx), var(--fy)) rotate(var(--fr)); }
  .card-wallet:focus-visible .card-wallet__pocket { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) {
    .card-wallet__card { transition-duration: 0.01s; }
  }
`;

export function WalletCard() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-wallet" tabIndex={0} role="group" aria-label="Wallet with three cards: Everyday ending 4242, Travel ending 0937, Studio ending 8810">
        <div className="card-wallet__back" aria-hidden="true" />
        {CARDS.map((c, k) => (
          <div
            key={c.name}
            className="card-wallet__card"
            aria-hidden="true"
            style={{ '--c': c.bg, '--k': k, '--fx': `${c.fan.x}px`, '--fy': `${c.fan.y}px`, '--fr': `${c.fan.r}deg` } as React.CSSProperties}
          >
            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              {c.name}
              <span className="card-wallet__chip" />
            </span>
            <span>•• {c.last}</span>
          </div>
        ))}
        <div className="card-wallet__pocket" aria-hidden="true">
          Wallet <small>3 cards</small>
        </div>
      </div>
    </>
  );
}
