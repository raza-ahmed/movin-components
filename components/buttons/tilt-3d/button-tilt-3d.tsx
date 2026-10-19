"use client";

import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

export function Tilt3DButton({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = React.useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [14, -14]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-14, 14]), { stiffness: 200, damping: 20 });
  const sheenX = useTransform(rawX, [-0.5, 0.5], ['-60%', '160%']);
  const sheenY = useTransform(rawY, [-0.5, 0.5], ['-60%', '160%']);

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
    setHovered(false);
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden rounded-xl px-8 py-3 font-semibold text-[#f6f6f6] cursor-pointer border-none"
      style={{
        background: '#4d4d4d',
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        transformPerspective: 600,
        transformStyle: 'preserve-3d',
        boxShadow: hovered
          ? '0 20px 40px rgba(124,124,124,0.45),0 8px 16px rgba(0,0,0,0.3)'
          : '0 4px 12px rgba(124,124,124,0.25)',
        transition: 'box-shadow 300ms',
      }}
    >
      <motion.span
        className="pointer-events-none absolute h-20 w-20 rounded-full blur-xl"
        style={{
          background: 'rgba(246,246,246,0.18)',
          left: sheenX,
          top: sheenY,
          transform: 'translate(-50%,-50%)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 200ms',
        }}
      />
      <span className="relative">{children}</span>
    </motion.button>
  );
}
