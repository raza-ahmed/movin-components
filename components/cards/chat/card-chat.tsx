"use client";

import { useEffect, useState } from 'react';

const css = `
  @keyframes card-chat-in { from { opacity: 0; transform: translateY(8px) scale(0.92); } to { opacity: 1; transform: none; } }
  @keyframes card-chat-dot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-3px); opacity: 1; } }
  .card-chat {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 6px;
    width: 236px;
    height: 186px;
    padding: 12px;
    border-radius: 18px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
  }
  .card-chat__msg {
    max-width: 78%;
    padding: 7px 10px;
    border-radius: 14px;
    font-size: 12px;
    line-height: 1.35;
    animation: card-chat-in 0.35s cubic-bezier(0.34, 1.4, 0.64, 1) both;
  }
  .card-chat__msg[data-me] { align-self: flex-end; border-bottom-right-radius: 4px; background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); transform-origin: right bottom; }
  .card-chat__msg:not([data-me]) { align-self: flex-start; border-bottom-left-radius: 4px; background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); transform-origin: left bottom; }
  .card-chat__typing { align-self: flex-start; display: flex; gap: 3px; padding: 9px 11px; border-radius: 14px; border-bottom-left-radius: 4px; background: light-dark(#ebedf0, #232529); animation: card-chat-in 0.25s ease both; }
  .card-chat__typing i { width: 5px; height: 5px; border-radius: 50%; background: light-dark(#42454c, #e5e6e9); animation: card-chat-dot 1s ease-in-out infinite; }
  .card-chat__typing i:nth-child(2) { animation-delay: 0.15s; }
  .card-chat__typing i:nth-child(3) { animation-delay: 0.3s; }
  @media (prefers-reduced-motion: reduce) {
    .card-chat__msg, .card-chat__typing, .card-chat__typing i { animation: none; }
  }
`;

const SCRIPT = [
  { me: false, text: 'Did the new build land?' },
  { me: true, text: 'Deployed 2 min ago' },
  { me: false, text: 'The loader is so smooth now' },
  { me: true, text: 'Shipping the cards next' },
];

export function ChatCard() {
  // Each message takes two beats: a typing beat (for theirs) and the bubble.
  const [beat, setBeat] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setBeat((b) => (b >= SCRIPT.length * 2 + 2 ? 0 : b + 1)), 850);
    return () => clearInterval(id);
  }, []);

  const shown = SCRIPT.slice(0, Math.floor(beat / 2));
  const next = SCRIPT[Math.floor(beat / 2)];
  const typing = beat % 2 === 1 && next && !next.me;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-chat" role="log" aria-label="Chat with Jordan" aria-live="polite">
        {shown.map((m) => (
          <div key={m.text} className="card-chat__msg" data-me={m.me || undefined}>
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="card-chat__typing" aria-label="Jordan is typing">
            <i />
            <i />
            <i />
          </div>
        )}
      </div>
    </>
  );
}
