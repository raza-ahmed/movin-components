"use client";

import * as React from "react";
import { motion } from 'framer-motion';

const OPTIONS = ['Glacier', 'Tundra', 'Arctic'];

export function FrostRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[0]);

  return (
    <div className="flex w-56 flex-col gap-1">
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label
            key={opt}
            className="relative flex cursor-pointer items-center gap-2.5 rounded-[10px] border border-transparent px-3.5 py-[11px]"
          >
            {checked && (
              <motion.div
                layoutId="frost-pill"
                className="absolute inset-0 rounded-[10px]"
                style={{
                  background: 'rgba(246,246,246,0.10)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(246,246,246,0.18)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(246,246,246,0.15)',
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
              />
            )}
            <input
              type="radio"
              name="frost-radio"
              value={opt}
              checked={checked}
              onChange={() => setSelected(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span
              className="relative z-10 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200"
              style={{ borderColor: checked ? 'rgba(246,246,246,0.7)' : 'rgba(246,246,246,0.2)' }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: 'rgba(246,246,246,0.9)',
                transform: checked ? 'scale(1)' : 'scale(0)',
                transition: 'transform 240ms cubic-bezier(0.34,1.56,0.64,1)',
              }} />
            </span>
            <span
              className="relative z-10 select-none text-sm transition-colors duration-200"
              style={{
                fontWeight: checked ? 500 : 400,
                color: checked ? 'rgba(246,246,246,0.92)' : 'rgba(246,246,246,0.55)',
              }}
            >
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}
