"use client";

import * as React from "react";
function getStrength(pw: string) {
  if (!pw) return { score: 0, label: '', color: 'rgba(246,246,246,0.55)' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: 1, label: 'Weak', color: '#4d4d4d' };
  if (s <= 2) return { score: 2, label: 'Fair', color: '#7c7c7c' };
  if (s <= 3) return { score: 3, label: 'Good', color: '#c9c9c9' };
  return { score: 4, label: 'Strong', color: '#f6f6f6' };
}

export function StrengthInput({ placeholder = 'Password…' }: { placeholder?: string }) {
  const [value, setValue] = React.useState('');
  const str = getStrength(value);

  return (
    <div className="w-full">
      <style>{`@media(prefers-reduced-motion:reduce){.str-seg{transition:none!important}}`}</style>
      <input
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border bg-[#f6f6f6]/[0.06] px-3.5 py-2.5 text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none focus:ring-1 focus:ring-[#a7a7a7]"
        style={{ borderColor: 'rgba(246,246,246,0.15)' }}
      />
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className="str-seg h-0.5 flex-1 rounded-full transition-colors duration-300"
            style={{ background: value && seg <= str.score ? str.color : 'rgba(246,246,246,0.55)' }}
          />
        ))}
      </div>
      <p className="mt-1 h-3.5 text-[11px] transition-colors duration-300" style={{ color: str.color }}>
        {str.label}
      </p>
    </div>
  );
}
