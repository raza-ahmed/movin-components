"use client";

export function SpinningRing({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      className="h-10 w-10 animate-spin rounded-full border-2 border-current/20 border-t-current motion-reduce:animate-none motion-reduce:opacity-50"
    />
  );
}
