"use client";

import * as React from "react";
const MAX_HP = 1000;
const DAMAGED_HP = 280;

export function HealthBarButton({ name = 'BOSS' }: { name?: string }) {
  const [hovered, setHovered] = React.useState(false);

  const hp = hovered ? DAMAGED_HP : MAX_HP;
  const pct = (hp / MAX_HP) * 100;
  const barColor = pct > 60 ? 'light-dark(#42454c, #e5e6e9)' : pct > 30 ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(#cbced3, #393c41)';

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex min-w-[180px] cursor-pointer flex-col gap-1.5 rounded-md border border-[color:light-dark(#dbdde1,#2e3035)] bg-[color:light-dark(#fbfcfd,#121417)] p-3 font-mono font-semibold text-sm text-[color:light-dark(#42454c,#e5e6e9)] tracking-wider"
    >
      <span className="flex w-full justify-between">
        <span>{name}</span>
        <span style={{ color: barColor, transition: 'color 600ms ease' }}>
          {hp} / {MAX_HP} HP
        </span>
      </span>
      <div className="h-2 w-full overflow-hidden rounded border border-[color:light-dark(#dbdde1,#2e3035)] bg-[color:light-dark(#ebedf0,#232529)]">
        <div
          className="h-full rounded"
          style={{
            width: `${pct}%`,
            background: barColor,
            boxShadow: `0 0 6px ${barColor}88`,
            transition: 'width 800ms ease, background 600ms ease',
          }}
        />
      </div>
      <span className="self-end text-xs text-[color:light-dark(#6d7179,#7d8087)]">
        {hovered ? 'ATTACK!' : '[ HOVER TO ATTACK ]'}
      </span>
    </button>
  );
}
