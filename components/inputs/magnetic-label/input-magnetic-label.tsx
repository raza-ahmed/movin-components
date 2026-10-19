"use client";

import * as React from "react";
import { motion } from 'framer-motion';

export function MagneticLabelInput({ label = 'Email address' }: { label?: string }) {
  const [focused, setFocused] = React.useState(false);
  const [value, setValue] = React.useState('');
  const isActive = focused || value.length > 0;

  return (
    <div className="w-full">
      <div className="relative pt-6">
        <motion.label
          layout
          className="pointer-events-none absolute font-inherit"
          style={{
            left: isActive ? 2 : 14,
            top: isActive ? 0 : 22,
            fontSize: isActive ? 11 : 15,
            color: isActive ? '#a7a7a7' : 'rgba(246,246,246,0.55)',
            fontWeight: isActive ? 600 : 400,
            letterSpacing: isActive ? '0.04em' : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          {label}
        </motion.label>
        <input
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-lg border bg-[#f6f6f6]/[0.04] px-3.5 py-2.5 text-[15px] text-[#f6f6f6] outline-none transition-[border-color] duration-[250ms]"
          style={{ borderColor: isActive ? '#a7a7a7' : 'rgba(246,246,246,0.12)' }}
        />
      </div>
    </div>
  );
}
