"use client";

import * as React from "react";
import { motion } from 'framer-motion';

const OPTIONS = ['Liquid', 'Fluid', 'Viscous'];

export function BlobRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[0]);

  return (
    <div className="flex w-52 flex-col gap-1.5">
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label key={opt} className="relative flex cursor-pointer items-center gap-2.5 rounded-full px-3.5 py-2.5">
            {checked && (
              <motion.div
                layoutId="blob-indicator"
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'light-dark(rgba(109,113,121,0.8), rgba(125,128,135,0.8))',
                  boxShadow: '0 4px 20px light-dark(rgba(109,113,121,0.4), rgba(125,128,135,0.4))',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 1 }}
              />
            )}
            <input
              type="radio" name="blob-radio" value={opt} checked={checked}
              onChange={() => setSelected(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span
              className="relative z-10 h-2.5 w-2.5 flex-shrink-0 rounded-full transition-colors duration-200"
              style={{ background: checked ? 'light-dark(rgba(55,58,64,0.9), rgba(241,242,243,0.9))' : 'light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))' }}
            />
            <span
              className="relative z-10 select-none text-sm transition-colors duration-200"
              style={{
                fontWeight: checked ? 600 : 400,
                color: checked ? 'light-dark(#373a40, #f1f2f3)' : 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))',
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
