"use client";

const css = `
  .card-folder {
    position: relative;
    width: 200px;
    height: 170px;
    perspective: 600px;
    cursor: pointer;
  }
  .card-folder:focus-visible { outline: none; }
  .card-folder__back {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 128px;
    border-radius: 6px 14px 14px 14px;
    background: light-dark(#dbdde1, #2e3035);
  }
  .card-folder__back::before {
    content: '';
    position: absolute;
    left: 0;
    top: -14px;
    width: 76px;
    height: 18px;
    border-radius: 8px 8px 0 0;
    background: light-dark(#dbdde1, #2e3035);
  }
  .card-folder__paper {
    position: absolute;
    left: 50%;
    bottom: 16px;
    width: 150px;
    height: 104px;
    margin-left: -75px;
    padding: 12px;
    border-radius: 6px;
    background: light-dark(#42454c, #e5e6e9);
    transform-origin: 50% 100%;
    transition: transform 0.55s cubic-bezier(0.34, 1.35, 0.64, 1);
  }
  /* Lines of "text" on each sheet. */
  .card-folder__paper::before {
    content: '';
    display: block;
    height: 40px;
    background: repeating-linear-gradient(light-dark(#6d7179, #7d8087) 0 2px, transparent 2px 8px);
    width: 70%;
  }
  .card-folder__paper:nth-child(3) { background: light-dark(#50535b, #c6c8cd); }
  .card-folder__paper:nth-child(4) { background: light-dark(#5f626a, #a7abb2); }
  .card-folder__front {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 104px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 12px 14px;
    border-radius: 14px;
    background: linear-gradient(light-dark(#cbced3, #393c41), light-dark(#ebedf0, #232529));
    box-shadow: inset 0 1px 0 color-mix(in oklab, light-dark(#373a40, #f1f2f3) 20%, transparent);
    transform-origin: 50% 100%;
    transition: transform 0.55s cubic-bezier(0.34, 1.2, 0.64, 1);
  }
  .card-folder__front b { color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 600; }
  .card-folder__front span { color: light-dark(#50535b, #c6c8cd); font-size: 11px; }
  .card-folder:hover .card-folder__front, .card-folder:focus-visible .card-folder__front { transform: rotateX(-32deg); }
  .card-folder:hover .card-folder__paper:nth-child(2), .card-folder:focus-visible .card-folder__paper:nth-child(2) { transform: translate(-30px, -36px) rotate(-12deg); }
  .card-folder:hover .card-folder__paper:nth-child(3), .card-folder:focus-visible .card-folder__paper:nth-child(3) { transform: translate(0, -46px) rotate(2deg); transition-delay: 0.05s; }
  .card-folder:hover .card-folder__paper:nth-child(4), .card-folder:focus-visible .card-folder__paper:nth-child(4) { transform: translate(30px, -34px) rotate(12deg); transition-delay: 0.1s; }
  @media (prefers-reduced-motion: reduce) {
    .card-folder__paper, .card-folder__front { transition-duration: 0.01s; }
  }
`;

export function FolderCard() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-folder" tabIndex={0} role="group" aria-label="Q4 proposals, 12 files">
        <span className="card-folder__back" aria-hidden="true" />
        <span className="card-folder__paper" aria-hidden="true" />
        <span className="card-folder__paper" aria-hidden="true" />
        <span className="card-folder__paper" aria-hidden="true" />
        <div className="card-folder__front">
          <b>Q4 proposals</b>
          <span>12 files · edited today</span>
        </div>
      </div>
    </>
  );
}
