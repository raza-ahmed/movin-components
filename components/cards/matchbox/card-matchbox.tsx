"use client";

const HEADS = Array.from({ length: 9 }, (_, i) => i);

const css = `
  .card-matchbox { position: relative; width: 220px; height: 176px; outline: none; }
  .card-matchbox__drawer {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 14px;
    height: 92px;
    padding: 12px 14px;
    border-radius: 6px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), inset 0 -10px 16px -10px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5));
    transition: transform 0.6s cubic-bezier(0.3, 1.25, 0.5, 1);
  }
  .card-matchbox__heads { display: flex; gap: 6px; }
  .card-matchbox__head { width: 11px; height: 14px; border-radius: 50% 50% 40% 40%; background: radial-gradient(circle at 40% 35%, light-dark(#50535b, #c6c8cd), light-dark(#6d7179, #7d8087)); box-shadow: 0 9px 0 -3px light-dark(#dbdde1, #2e3035); }
  .card-matchbox__note { margin-top: 18px; display: flex; justify-content: space-between; align-items: baseline; color: light-dark(#373a40, #f1f2f3); font-size: 12px; font-weight: 500; }
  .card-matchbox__note span { color: light-dark(#5f626a, #a7abb2); font-size: 11px; font-weight: 400; }
  .card-matchbox__sleeve {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 104px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border-radius: 8px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41), 0 14px 26px -14px light-dark(rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.75));
    color: light-dark(#373a40, #f1f2f3);
    overflow: hidden;
  }
  .card-matchbox__sleeve::before, .card-matchbox__sleeve::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 7px;
    background: repeating-linear-gradient(90deg, light-dark(#cbced3, #393c41) 0 1px, light-dark(#dbdde1, #2e3035) 1px 3px);
    opacity: 0.8;
  }
  .card-matchbox__sleeve::before { top: 0; }
  .card-matchbox__sleeve::after { bottom: 0; }
  .card-matchbox__small { color: light-dark(#5f626a, #a7abb2); font-size: 9px; letter-spacing: 0.3em; margin-right: -0.3em; text-transform: uppercase; }
  .card-matchbox__name { font-size: 19px; font-weight: 600; letter-spacing: 0.02em; }
  .card-matchbox__flame { width: 14px; height: 18px; color: light-dark(#50535b, #c6c8cd); }
  .card-matchbox:is(:hover, :focus-visible) .card-matchbox__drawer { transform: translateY(70px); }
  .card-matchbox:focus-visible .card-matchbox__sleeve { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) {
    .card-matchbox__drawer { transition-duration: 0.01s; }
  }
`;

export function MatchboxCard() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-matchbox" tabIndex={0} role="group" aria-label="Ember, table for two, Friday at 8:30 pm">
        <div className="card-matchbox__drawer" aria-hidden="true">
          <div className="card-matchbox__heads">
            {HEADS.map((k) => (
              <span key={k} className="card-matchbox__head" />
            ))}
          </div>
          <div className="card-matchbox__note">
            Table for two <span>Fri · 8:30 pm</span>
          </div>
        </div>
        <div className="card-matchbox__sleeve" aria-hidden="true">
          <svg className="card-matchbox__flame" viewBox="0 0 14 18" fill="currentColor">
            <path d="M7 0C9 4 13 6 13 11a6 6 0 0 1-12 0C1 8 3 7 4 4c1 2 2 3 3 3C7 5 6 3 7 0Z" />
          </svg>
          <span className="card-matchbox__name">Ember</span>
          <span className="card-matchbox__small">Kitchen · Since 1962</span>
        </div>
      </div>
    </>
  );
}
