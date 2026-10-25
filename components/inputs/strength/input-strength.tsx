"use client";

import * as React from "react";
function getStrength(pw: string) {
  if (!pw) return { score: 0, label: '', color: 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: 1, label: 'Weak', color: 'light-dark(#cbced3, #393c41)' };
  if (s <= 2) return { score: 2, label: 'Fair', color: 'light-dark(#6d7179, #7d8087)' };
  if (s <= 3) return { score: 3, label: 'Good', color: 'light-dark(#50535b, #c6c8cd)' };
  return { score: 4, label: 'Strong', color: 'light-dark(#373a40, #f1f2f3)' };
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
        className="w-full rounded-lg border bg-[color:light-dark(#373a40,#f1f2f3)]/[0.06] px-3.5 py-2.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none focus:ring-1 focus:ring-[color:light-dark(#5f626a,#a7abb2)]"
        style={{ borderColor: 'light-dark(rgba(55,58,64,0.15), rgba(241,242,243,0.15))' }}
      />
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className="str-seg h-0.5 flex-1 rounded-full transition-colors duration-300"
            style={{ background: value && seg <= str.score ? str.color : 'light-dark(rgba(55,58,64,0.55), rgba(241,242,243,0.55))' }}
          />
        ))}
      </div>
      <p className="mt-1 h-3.5 text-[11px] transition-colors duration-300" style={{ color: str.color }}>
        {str.label}
      </p>
    </div>
  );
}
