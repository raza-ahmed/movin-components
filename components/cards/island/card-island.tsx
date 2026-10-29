"use client";

const css = `
  @keyframes card-island-eq { 0%, 100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
  .card-island {
    position: relative;
    width: 156px;
    height: 40px;
    border-radius: 20px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: 0 0 0 1px light-dark(#dbdde1, #2e3035), 0 12px 28px -12px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
    overflow: hidden;
    cursor: pointer;
    transition:
      width 0.55s cubic-bezier(0.34, 1.35, 0.64, 1),
      height 0.55s cubic-bezier(0.34, 1.35, 0.64, 1),
      border-radius 0.55s cubic-bezier(0.34, 1.35, 0.64, 1);
  }
  .card-island:hover, .card-island:focus-within { width: 260px; height: 156px; border-radius: 28px; }
  .card-island:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  /* Compact view: art dot + title + live bars. Fades as the island grows. */
  .card-island__compact {
    position: absolute;
    left: 8px;
    right: 12px;
    top: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: light-dark(#42454c, #e5e6e9);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    transition: opacity 0.2s ease;
  }
  .card-island__dot { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, light-dark(#50535b, #c6c8cd), light-dark(#cbced3, #393c41)); }
  .card-island__eq { display: flex; gap: 2px; align-items: center; height: 14px; margin-left: auto; }
  .card-island__eq i { width: 2px; height: 14px; border-radius: 1px; background: light-dark(#42454c, #e5e6e9); animation: card-island-eq 0.8s ease-in-out infinite; }
  .card-island__eq i:nth-child(2) { animation-delay: -0.2s; }
  .card-island__eq i:nth-child(3) { animation-delay: -0.5s; }
  .card-island__eq i:nth-child(4) { animation-delay: -0.35s; }
  .card-island:hover .card-island__compact, .card-island:focus-within .card-island__compact { opacity: 0; }
  /* Expanded view: everything staggers in once there is room for it. */
  .card-island__full { position: absolute; inset: 0; padding: 16px; display: grid; gap: 12px; }
  .card-island__full > * { opacity: 0; transform: translateY(6px); transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1); }
  .card-island:hover .card-island__full > *, .card-island:focus-within .card-island__full > * { opacity: 1; transform: none; }
  .card-island:hover .card-island__full > :nth-child(1) { transition-delay: 0.18s; }
  .card-island:hover .card-island__full > :nth-child(2) { transition-delay: 0.24s; }
  .card-island:hover .card-island__full > :nth-child(3) { transition-delay: 0.3s; }
  .card-island__head { display: flex; gap: 12px; align-items: center; }
  .card-island__art { width: 48px; height: 48px; border-radius: 12px; background: radial-gradient(circle at 30% 30%, light-dark(#42454c, #e5e6e9), light-dark(#cbced3, #393c41) 60%, light-dark(#ebedf0, #232529)); }
  .card-island__title { color: light-dark(#373a40, #f1f2f3); font-size: 14px; font-weight: 600; }
  .card-island__artist { color: light-dark(#5f626a, #a7abb2); font-size: 12px; }
  .card-island__bar { height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); overflow: hidden; }
  .card-island__bar span { display: block; width: 38%; height: 100%; background: light-dark(#373a40, #f1f2f3); }
  .card-island__time { display: flex; justify-content: space-between; margin-top: 4px; color: light-dark(#5f626a, #a7abb2); font-size: 10px; font-variant-numeric: tabular-nums; }
  .card-island__controls { display: flex; justify-content: center; gap: 22px; }
  .card-island__controls button {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: none;
    color: light-dark(#373a40, #f1f2f3);
    cursor: pointer;
  }
  .card-island__controls button:hover { background: light-dark(#ebedf0, #232529); }
  .card-island__controls svg { width: 16px; height: 16px; fill: currentColor; }
  @media (prefers-reduced-motion: reduce) {
    .card-island, .card-island__full > * { transition-duration: 0.01s; }
    .card-island__eq i { animation: none; }
  }
`;

export function IslandCard() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-island" tabIndex={0} role="group" aria-label="Now playing: Midnight Drive">
        <div className="card-island__compact" aria-hidden="true">
          <span className="card-island__dot" />
          Midnight Drive
          <span className="card-island__eq">
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="card-island__full">
          <div className="card-island__head">
            <span className="card-island__art" aria-hidden="true" />
            <div>
              <div className="card-island__title">Midnight Drive</div>
              <div className="card-island__artist">Neon Coast</div>
            </div>
          </div>
          <div>
            <div className="card-island__bar">
              <span />
            </div>
            <div className="card-island__time">
              <span>1:24</span>
              <span>3:41</span>
            </div>
          </div>
          <div className="card-island__controls">
            <button type="button" aria-label="Previous">
              <svg viewBox="0 0 24 24"><path d="M7 6h2v12H7zM10 12l9-6v12z" /></svg>
            </button>
            <button type="button" aria-label="Pause">
              <svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
            </button>
            <button type="button" aria-label="Next">
              <svg viewBox="0 0 24 24"><path d="M15 6h2v12h-2zM14 12 5 18V6z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
