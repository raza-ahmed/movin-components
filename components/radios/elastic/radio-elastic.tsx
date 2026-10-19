"use client";

import * as React from "react";
import { motion } from 'framer-motion';

const OPTIONS = ['Stretch', 'Snap', 'Recoil'];

export function ElasticRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[0]);

  return (
    <div className="flex w-52 flex-col gap-1.5">
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label
            key={opt}
            className="relative flex cursor-pointer items-center gap-2.5 rounded-md border px-3.5 py-2.5"
            style={{ borderColor: checked ? 'transparent' : 'rgba(246,246,246,0.07)' }}
          >
            {checked && (
              <motion.div
                layoutId="elastic-pill"
                className="absolute inset-0 rounded-md"
                style={{
                  background: 'rgba(167,167,167,0.12)',
                  border: '1px solid rgba(167,167,167,0.4)',
                  boxShadow: '0 0 12px rgba(167,167,167,0.15)',
                }}
                transition={{ type: 'spring', stiffness: 600, damping: 20, mass: 0.8 }}
              />
            )}
            <input
              type="radio" name="elastic-radio" value={opt} checked={checked}
              onChange={() => setSelected(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span
              className="relative z-10 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200"
              style={{ borderColor: checked ? '#a7a7a7' : 'rgba(246,246,246,0.2)' }}
            >
              <span style={{
                width:7,height:7,borderRadius:'50%',background:'#a7a7a7',
                transform:checked?'scale(1)':'scale(0)',
                transition:'transform 300ms cubic-bezier(0.34,1.56,0.64,1)',
              }}/>
            </span>
            <span
              className="relative z-10 select-none text-sm transition-colors duration-200"
              style={{
                fontWeight: checked ? 600 : 400,
                color: checked ? '#a7a7a7' : 'rgba(246,246,246,0.55)',
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
