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
            color: isActive ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))',
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
          className="w-full rounded-lg border bg-[color:light-dark(#373a40,#f1f2f3)]/[0.04] px-3.5 py-2.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] outline-none transition-[border-color] duration-[250ms]"
          style={{ borderColor: isActive ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.12), rgba(241,242,243,0.12))' }}
        />
      </div>
    </div>
  );
}
