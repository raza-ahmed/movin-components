# Glitch Error input

On failed validation the input briefly glitches — a CSS invert/brightness flicker plus translateX jitter keyframe over 500ms — then snaps to a bright border. Unsettling, memorable error feedback.

Live preview: https://movin.design/components/inputs/glitch-error/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-glitch-error
```

Or copy [`input-glitch-error.tsx`](./input-glitch-error.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-glitch-error.html`](./input-glitch-error.html) where it goes and include [`input-glitch-error.css`](./input-glitch-error.css). [`input-glitch-error.js`](./input-glitch-error.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
