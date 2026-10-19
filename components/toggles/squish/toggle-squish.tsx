"use client";

import * as React from "react";
const squishCss = `
  @keyframes toggle-squish-on {
    0%   { transform: translateX(0)    scaleX(1);   }
    40%  { transform: translateX(11px) scaleX(1.5); }
    100% { transform: translateX(22px) scaleX(1);   }
  }
  @keyframes toggle-squish-off {
    0%   { transform: translateX(22px) scaleX(1);   }
    40%  { transform: translateX(11px) scaleX(1.5); }
    100% { transform: translateX(0)    scaleX(1);   }
  }
  @media (prefers-reduced-motion: reduce) {
    [data-toggle-thumb] { animation: none !important; }
  }
`;

export function SquishToggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = React.useState(defaultOn);
  const [animKey, setAnimKey] = React.useState(0);
  const [direction, setDirection] = React.useState<"on" | "off" | null>(null);

  React.useEffect(() => {
    const id = "squish-toggle-styles";
    if (document.getElementById(id)) return;
    const el = Object.assign(document.createElement("style"), { id, textContent: squishCss });
    document.head.appendChild(el);
  }, []);

  const toggle = () => {
    setOn((v) => !v);
    setDirection(on ? "off" : "on");
    setAnimKey((k) => k + 1);
  };

  return (
    <button
      type="button"
      role="switch" aria-label="Notifications"
      aria-checked={on}
      onClick={toggle}
      className={[
        "flex h-[30px] w-[52px] cursor-pointer items-center rounded-full border-none p-1 transition-colors duration-200 ease-in-out motion-reduce:transition-none",
        on ? "bg-[#a7a7a7]" : "bg-[#f6f6f6]/15",
      ].join(" ")}
    >
      <span
        key={animKey}
        data-toggle-thumb=""
        className="block h-[22px] w-[22px] origin-center bg-[#f6f6f6]"
        style={{
          borderRadius: "30%",
          animation: direction
            ? `toggle-squish-${direction} 320ms cubic-bezier(0.4,0,0.2,1) forwards`
            : undefined,
          transform: direction ? undefined : on ? "translateX(22px)" : "translateX(0)",
        }}
      />
    </button>
  );
}
