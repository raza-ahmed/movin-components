"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-current/10 ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading content" className="flex w-56 flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-[70%]" />
          <Skeleton className="h-2.5 w-[45%]" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-[80%]" />
    </div>
  );
}
