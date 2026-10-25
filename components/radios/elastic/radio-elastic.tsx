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
            style={{ borderColor: checked ? 'transparent' : 'light-dark(rgba(55,58,64,0.07), rgba(241,242,243,0.07))' }}
          >
            {checked && (
              <motion.div
                layoutId="elastic-pill"
                className="absolute inset-0 rounded-md"
                style={{
                  background: 'light-dark(rgba(95,98,106,0.12), rgba(167,171,178,0.12))',
                  border: '1px solid light-dark(rgba(95,98,106,0.4), rgba(167,171,178,0.4))',
                  boxShadow: '0 0 12px light-dark(rgba(95,98,106,0.15), rgba(167,171,178,0.15))',
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
              style={{ borderColor: checked ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))' }}
            >
              <span style={{
                width:7,height:7,borderRadius:'50%',background:'light-dark(#5f626a, #a7abb2)',
                transform:checked?'scale(1)':'scale(0)',
                transition:'transform 300ms cubic-bezier(0.34,1.56,0.64,1)',
              }}/>
            </span>
            <span
              className="relative z-10 select-none text-sm transition-colors duration-200"
              style={{
                fontWeight: checked ? 600 : 400,
                color: checked ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))',
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
