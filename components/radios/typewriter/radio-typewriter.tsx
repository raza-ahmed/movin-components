"use client";

import * as React from "react";
const OPTIONS = ['Option Alpha', 'Option Beta', 'Option Gamma'];

export function TypewriterRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[0]);
  const [typedText, setTypedText] = React.useState(OPTIONS[0]);
  const [typing, setTyping] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleSelect = (opt: string) => {
    if (opt === selected) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(opt);
    setTypedText('');
    setTyping(true);
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setTypedText(opt.slice(0, i));
      if (i >= opt.length) {
        clearInterval(timerRef.current);
        setTyping(false);
      }
    }, 50);
  };

  React.useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return (
    <div className="flex flex-col gap-1">
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}.tw-cur{animation:blink 700ms step-end infinite}`}</style>
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 transition-all duration-200"
            style={{
              background: checked ? 'light-dark(rgba(55,58,64,0.04), rgba(241,242,243,0.04))' : 'transparent',
              borderColor: checked ? 'light-dark(rgba(55,58,64,0.12), rgba(241,242,243,0.12))' : 'transparent',
            }}
          >
            <input
              type="radio"
              name="typewriter-radio"
              value={opt}
              checked={checked}
              onChange={() => handleSelect(opt)}
              aria-label={opt}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span
              className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200"
              style={{ borderColor: checked ? 'light-dark(#42454c, #e5e6e9)' : 'light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))' }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: 'light-dark(#42454c, #e5e6e9)',
                transform: checked ? 'scale(1)' : 'scale(0)',
                transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1)',
              }} />
            </span>
            <span
              className="select-none text-[13px] transition-colors duration-150"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                color: checked ? 'light-dark(rgba(55,58,64,0.9), rgba(241,242,243,0.9))' : 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))',
                minWidth: 120,
              }}
            >
              {checked ? (<>{typedText}{typing && <span className="tw-cur">_</span>}</>) : opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}
