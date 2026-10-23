# Segment loader

A seven-segment display digit where a lit segment chases a figure-eight round the 8 (top, right, middle, left, bottom, right, middle, left), leaving a glowing trail that fades behind it. The middle bar is visited twice per loop, so it has its own keyframes. Pure CSS.

Live preview: https://movin.design/components/loaders/segment/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/loader-segment
```

Or copy [`loader-segment.tsx`](./loader-segment.tsx) into your project. Dependencies: none.

## Plain HTML + CSS

No framework and no dependencies. Paste [`loader-segment.html`](./loader-segment.html) where it goes and include [`loader-segment.css`](./loader-segment.css). It is pure CSS, so there is no script.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
