"use client";

import * as React from "react";
export function TagLabelInput({ label = 'Username' }: { label?: string }) {
  const [focused, setFocused] = React.useState(false);
  const [value, setValue] = React.useState('');
  const isActive = focused || value.length > 0;

  return (
    <div className="w-full">
      <style>{`@media(prefers-reduced-motion:reduce){.tag-pill-bg,.tag-label-txt{transition:none!important}}`}</style>
      <div className="mb-1.5 inline-flex items-center" style={{ position: 'relative' }}>
        <div
          className="tag-pill-bg absolute inset-0 rounded"
          style={{
            background: 'rgba(167,167,167,0.15)',
            transformOrigin: 'left center',
            transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 200ms cubic-bezier(0.22,1,0.36,1)',
          }}
        />
        <span
          className="tag-label-txt relative font-inherit transition-all duration-200"
          style={{
            fontSize: isActive ? 11 : 13,
            fontWeight: isActive ? 600 : 400,
            color: isActive ? '#a7a7a7' : 'rgba(246,246,246,0.55)',
            letterSpacing: isActive ? '0.06em' : 0,
            padding: isActive ? '2px 6px' : '1px 2px',
            textTransform: isActive ? 'uppercase' : 'none',
          }}
        >
          {label}
        </span>
      </div>
      <input aria-label="Username"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="block w-full rounded-lg border bg-[#f6f6f6]/[0.04] px-3.5 py-2.5 text-[15px] text-[#f6f6f6] outline-none transition-[border-color] duration-200"
        style={{ borderColor: isActive ? 'rgba(167,167,167,0.4)' : 'rgba(246,246,246,0.12)' }}
      />
    </div>
  );
}
