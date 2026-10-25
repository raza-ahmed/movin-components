"use client";

import { useEffect, useRef } from 'react';

const css = `
  .card-scratch {
    position: relative;
    width: 184px;
    height: 120px;
    overflow: hidden;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 14px;
    background: light-dark(#f3f4f7, #1a1c1f);
    touch-action: none;
  }

  .card-scratch__prize {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
  }

  .card-scratch__title {
    color: light-dark(#5f626a, #a7abb2);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .card-scratch__amount {
    color: light-dark(#42454c, #e5e6e9);
    font-size: 20px;
    font-weight: 600;
  }

  .card-scratch--won .card-scratch__amount {
    animation: card-scratch-pop 0.6s cubic-bezier(0.3, 1.6, 0.5, 1);
  }

  /* The foil's three tones are read from these colour properties by the
     script (a canvas cannot read CSS), so they live with the rest of the theme. */
  .card-scratch__foil {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    color: light-dark(#cbced3, #a7abb2);
    border-top-color: light-dark(#f3f4f7, #e5e6e9);
    outline-color: light-dark(#50535b, #393c41);
    cursor: crosshair;
    transition: opacity 0.5s;
  }

  .card-scratch--won .card-scratch__foil {
    opacity: 0;
    pointer-events: none;
  }

  .card-scratch__flake {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 1px;
    background: light-dark(#50535b, #c6c8cd);
    pointer-events: none;
  }

  /* Hidden until focused (keyboard) or until there is a prize to reset. */
  .card-scratch__action {
    position: absolute;
    right: 8px;
    bottom: 8px;
    padding: 4px 10px;
    border: 1px solid light-dark(#cbced3, #393c41);
    border-radius: 999px;
    background: light-dark(#fbfcfd, #121417);
    color: light-dark(#42454c, #e5e6e9);
    font: inherit;
    font-size: 11px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.25s;
  }

  .card-scratch__action:focus-visible,
  .card-scratch--won .card-scratch__action {
    opacity: 1;
  }

  .card-scratch__action:focus-visible {
    outline: 2px solid light-dark(#42454c, #e5e6e9);
    outline-offset: 2px;
  }

  @keyframes card-scratch-pop {
    0% {
      transform: scale(0.8);
    }
    100% {
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .card-scratch__foil,
    .card-scratch__action {
      transition: none;
    }
    .card-scratch--won .card-scratch__amount {
      animation: none;
    }
  }
`;

export function ScratchCard() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initScratch(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="card-scratch">
        <div className="card-scratch__prize">
          <span className="card-scratch__title">You won</span>
          <span className="card-scratch__amount">A free month</span>
        </div>
        <canvas className="card-scratch__foil" aria-hidden="true" />
        <button className="card-scratch__action" type="button">
          Reveal
        </button>
      </div>
    </>
  );
}

// The foil is a canvas; scratching erases it with destination-out strokes.
// Its colours come from the canvas element's own CSS colour properties.
function initScratch(root: HTMLElement): (() => void) | undefined {
  const canvas = root.querySelector<HTMLCanvasElement>('.card-scratch__foil');
  const action = root.querySelector<HTMLButtonElement>('.card-scratch__action');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !action || !ctx) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dpr = 1;
  let last: { x: number; y: number } | null = null;
  let strokes = 0;
  let won = false;

  const paint = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const cs = getComputedStyle(canvas);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, cs.color);
    g.addColorStop(0.45, cs.borderTopColor);
    g.addColorStop(1, cs.color);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // Speckle, so it reads as foil rather than a flat grey.
    ctx.fillStyle = cs.outlineColor;
    for (let i = 0; i < 260; i++) {
      ctx.globalAlpha = Math.random() * 0.35;
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }
    ctx.globalAlpha = 1;
    ctx.font = `600 11px ${getComputedStyle(root).fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH HERE', w / 2, h / 2);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 24;
  };

  const local = (e: PointerEvent) => {
    const box = canvas.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };

  const flake = (x: number, y: number) => {
    if (reduce) return;
    const f = document.createElement('span');
    f.className = 'card-scratch__flake';
    f.style.left = `${x}px`;
    f.style.top = `${y}px`;
    root.appendChild(f);
    const a = f.animate(
      [
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${(Math.random() * 30 - 15).toFixed(0)}px, ${(30 + Math.random() * 40).toFixed(0)}px) rotate(${(Math.random() * 360).toFixed(0)}deg)`, opacity: 0 },
      ],
      { duration: 600 + Math.random() * 400, easing: 'cubic-bezier(0.4, 0, 1, 1)' },
    );
    a.onfinish = () => f.remove();
  };

  // Share of the foil scratched away, sampled on a coarse grid.
  const cleared = () => {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const step = 8 * dpr;
    let gone = 0;
    let all = 0;
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        all++;
        if (data[(Math.floor(y) * canvas.width + Math.floor(x)) * 4 + 3] < 40) gone++;
      }
    }
    return gone / all;
  };

  const win = () => {
    won = true;
    root.classList.add('card-scratch--won');
    action.textContent = 'Scratch again';
  };
  const reset = () => {
    won = false;
    strokes = 0;
    root.classList.remove('card-scratch--won');
    action.textContent = 'Reveal';
    paint();
  };

  const move = (e: PointerEvent) => {
    if (!last || won) return;
    const at = local(e);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(at.x + 0.01, at.y);
    ctx.stroke();
    if (Math.random() < 0.35) flake(at.x, at.y);
    last = at;
    if (++strokes % 10 === 0 && cleared() > 0.5) win();
  };
  const down = (e: PointerEvent) => {
    if (won) return;
    last = local(e);
    canvas.setPointerCapture(e.pointerId);
    move(e);
  };
  const up = () => {
    last = null;
  };
  const act = () => (won ? reset() : win());

  const ro = new ResizeObserver(() => {
    if (!won) paint();
  });
  ro.observe(canvas);
  paint();
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  action.addEventListener('click', act);

  return () => {
    ro.disconnect();
    canvas.removeEventListener('pointerdown', down);
    canvas.removeEventListener('pointermove', move);
    canvas.removeEventListener('pointerup', up);
    canvas.removeEventListener('pointercancel', up);
    action.removeEventListener('click', act);
    root.classList.remove('card-scratch--won');
  };
}
