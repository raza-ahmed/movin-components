"use client";

import * as React from "react";
const shakeCss = `
  @keyframes input-shake {
    0%, 100% { transform: translateX(0); }
    15%       { transform: translateX(-6px); }
    30%       { transform: translateX(6px); }
    45%       { transform: translateX(-4px); }
    60%       { transform: translateX(4px); }
    75%       { transform: translateX(-2px); }
    90%       { transform: translateX(2px); }
  }
  [data-shake="true"] { animation: input-shake 450ms ease; }
  @media (prefers-reduced-motion: reduce) {
    [data-shake="true"] { animation: none; }
  }
`;

export function ShakeInput() {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState("");
  const [shakeKey, setShakeKey] = React.useState(0);

  React.useEffect(() => {
    const id = "shake-input-styles";
    if (document.getElementById(id)) return;
    const el = Object.assign(document.createElement("style"), { id, textContent: shakeCss });
    document.head.appendChild(el);
  }, []);

  const handleSubmit = () => {
    if (!value.trim()) {
      setError("This field is required");
      setShakeKey((k) => k + 1);
    } else {
      setError("");
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div
        key={shakeKey}
        data-shake={shakeKey > 0 ? "true" : "false"}
        className="flex flex-col gap-1"
      >
        <input
          type="text"
          placeholder="Required field"
          value={value}
          onChange={(e) => { setValue(e.target.value); if (error) setError(""); }}
          className={[
            "w-full rounded-lg border bg-[#f6f6f6]/5 px-3.5 py-2.5 text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none focus:ring-1 focus:ring-[#a7a7a7] transition-colors duration-150",
            error ? "border-[#f6f6f6]" : "border-[#f6f6f6]/15",
          ].join(" ")}
        />
        {error && <span className="pl-0.5 text-xs text-[#ededed]">{error}</span>}
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className="rounded-lg border border-[#f6f6f6]/15 bg-[#f6f6f6]/10 px-3.5 py-2 text-sm text-[#f6f6f6] cursor-pointer"
      >
        Submit
      </button>
    </div>
  );
}
