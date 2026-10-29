"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  @keyframes field-shell-line { from { opacity: 0; transform: translateY(6px); } }
  .field-shell {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 256px;
    height: 170px;
    padding: 10px 12px;
    border-radius: 10px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    font: 12px/18px ui-monospace, SFMono-Regular, Menlo, monospace;
    overflow: hidden;
    cursor: text;
  }
  .field-shell:focus-within { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-shell__log { margin: 0; padding: 0; list-style: none; }
  .field-shell__log li { color: light-dark(#50535b, #c6c8cd); white-space: pre-wrap; animation: field-shell-line 0.2s ease-out both; }
  .field-shell__log li[data-cmd] { color: light-dark(#373a40, #f1f2f3); }
  .field-shell__log li[data-cmd]::before, .field-shell__prompt::before { content: '› '; color: light-dark(#5f626a, #a7abb2); }
  .field-shell__log li[data-err] { color: light-dark(#5f626a, #a7abb2); font-style: italic; }
  .field-shell__prompt { display: flex; color: light-dark(#373a40, #f1f2f3); }
  .field-shell__input { flex: 1; min-width: 0; padding: 0; border: 0; outline: 0; background: none; color: light-dark(#373a40, #f1f2f3); font: inherit; caret-color: light-dark(#373a40, #f1f2f3); }
  .field-shell__ghost { color: light-dark(#6d7179, #7d8087); }
  @media (prefers-reduced-motion: reduce) { .field-shell__log li { animation: none; } }
`;

type Line = { id: number; text: string; kind?: 'cmd' | 'err' };
const COMMANDS = ['help', 'ls', 'date', 'whoami', 'echo', 'theme', 'clear'];

function run(cmd: string): string[] | 'clear' {
  const [name, ...rest] = cmd.trim().split(/\s+/);
  switch (name) {
    case 'help':
      return [`commands: ${COMMANDS.join(' ')}`];
    case 'ls':
      return ['buttons/  cards/  inputs/  loaders/  toggles/'];
    case 'date':
      return [new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })];
    case 'whoami':
      return ['guest@movin.design'];
    case 'echo':
      return [rest.join(' ')];
    case 'theme':
      return [`${matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'} (follows your system)`];
    case 'clear':
      return 'clear';
    default:
      return [`command not found: ${name}`];
  }
}

export function ShellInput() {
  const seq = useRef(0);
  const [log, setLog] = useState<Line[]>([
    { id: -2, text: 'movin shell, type help', kind: 'err' },
  ]);
  const [value, setValue] = useState('');
  const history = useRef<string[]>([]);
  const at = useRef(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    at.current = history.current.length;
  }, [log]);

  const completion = value && !value.includes(' ') ? COMMANDS.find((c) => c.startsWith(value) && c !== value) : undefined;

  const submit = () => {
    const cmd = value.trim();
    setValue('');
    if (!cmd) return;
    history.current.push(cmd);
    const out = run(cmd);
    if (out === 'clear') return setLog([]);
    const err = out[0].startsWith('command not found');
    setLog((l) => [...l, { id: seq.current++, text: cmd, kind: 'cmd' as const }, ...out.map((t) => ({ id: seq.current++, text: t, kind: err ? ('err' as const) : undefined }))].slice(-7));
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-shell" onClick={() => input.current?.focus()}>
        <ul className="field-shell__log" aria-live="polite">
          {log.map((l, i) => (
            <li key={l.id} data-cmd={l.kind === 'cmd' || undefined} data-err={l.kind === 'err' || undefined} style={{ animationDelay: `${(i % 2) * 40}ms` }}>
              {l.text}
            </li>
          ))}
        </ul>
        <div className="field-shell__prompt">
          <input
            ref={input}
            className="field-shell__input"
            value={value}
            aria-label="Command"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
              if (e.key === 'Tab' && completion) {
                e.preventDefault();
                setValue(completion + ' ');
              }
              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                const h = history.current;
                at.current = Math.max(0, Math.min(h.length, at.current + (e.key === 'ArrowUp' ? -1 : 1)));
                setValue(h[at.current] ?? '');
              }
            }}
            style={{ width: completion ? `${value.length + 0.5}ch` : undefined, flex: completion ? 'none' : 1 }}
          />
          {completion && (
            <span className="field-shell__ghost" aria-hidden="true">
              {completion.slice(value.length)}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
