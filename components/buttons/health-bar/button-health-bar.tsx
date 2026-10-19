"use client";

import * as React from "react";
const MAX_HP = 1000;
const DAMAGED_HP = 280;

export function HealthBarButton({ name = 'BOSS' }: { name?: string }) {
  const [hovered, setHovered] = React.useState(false);

  const hp = hovered ? DAMAGED_HP : MAX_HP;
  const pct = (hp / MAX_HP) * 100;
  const barColor = pct > 60 ? '#ededed' : pct > 30 ? '#a7a7a7' : '#4d4d4d';

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex min-w-[180px] cursor-pointer flex-col gap-1.5 rounded-md border border-[#3a3a3a] bg-[#111111] p-3 font-mono font-semibold text-sm text-[#ededed] tracking-wider"
    >
      <span className="flex w-full justify-between">
        <span>{name}</span>
        <span style={{ color: barColor, transition: 'color 600ms ease' }}>
          {hp} / {MAX_HP} HP
        </span>
      </span>
      <div className="h-2 w-full overflow-hidden rounded border border-[#3a3a3a] bg-[#282828]">
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
      <span className="self-end text-xs text-[#7c7c7c]">
        {hovered ? 'ATTACK!' : '[ HOVER TO ATTACK ]'}
      </span>
    </button>
  );
}
