# Wheel radio button

A what's-for-dinner picker on a prize wheel: pick a dish and the wheel spins forward, always at least two turns, and slows to stop with it under the pointer, which ticks as it passes the segments.

Live preview: https://movin.design/components/radios/wheel/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/radio-wheel
```

Or copy [`radio-wheel.tsx`](./radio-wheel.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`radio-wheel.html`](./radio-wheel.html) where it goes and include [`radio-wheel.css`](./radio-wheel.css). [`radio-wheel.js`](./radio-wheel.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
