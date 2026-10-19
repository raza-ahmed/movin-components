"use client";

import * as React from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";

export function SpringToggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = React.useState(defaultOn);
  const prefersReducedMotion = useReducedMotion();

  const x = useSpring(on ? 22 : 0, {
    stiffness: 500,
    damping: prefersReducedMotion ? 100 : 20,
    mass: 0.6,
  });
  // useSpring takes a plain number as its INITIAL value only; retarget it on toggle.
  React.useEffect(() => {
    x.set(on ? 22 : 0);
  }, [on, x]);

  const bg = useTransform(x, [0, 22], ["rgba(246,246,246,0.15)", "#a7a7a7"]);

  return (
    <motion.button
      type="button"
      role="switch" aria-label="Notifications"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className="flex h-[30px] w-[52px] cursor-pointer items-center rounded-full border-none p-1"
      style={{ background: bg }}
    >
      <motion.span
        className="block h-[22px] w-[22px] rounded-full bg-[#f6f6f6]"
        style={{ x }}
      />
    </motion.button>
  );
}
