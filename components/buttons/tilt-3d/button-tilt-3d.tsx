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
      className="relative overflow-hidden rounded-xl px-8 py-3 font-semibold text-[color:light-dark(#373a40,#f1f2f3)] cursor-pointer border-none"
      style={{
        background: 'light-dark(#cbced3, #393c41)',
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        transformPerspective: 600,
        transformStyle: 'preserve-3d',
        boxShadow: hovered
          ? '0 20px 40px light-dark(rgba(109,113,121,0.45), rgba(125,128,135,0.45)),0 8px 16px light-dark(rgba(0, 0, 0, 0.09), rgba(0,0,0,0.3))'
          : '0 4px 12px light-dark(rgba(109,113,121,0.25), rgba(125,128,135,0.25))',
        transition: 'box-shadow 300ms',
      }}
    >
      <motion.span
        className="pointer-events-none absolute h-20 w-20 rounded-full blur-xl"
        style={{
          background: 'light-dark(rgba(55,58,64,0.18), rgba(241,242,243,0.18))',
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
