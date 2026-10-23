# Shockwave button

On click, 3 bright rings burst from the click point with staggered delays (0ms, 120ms, 240ms), each expanding and fading for a shockwave effect. Rings are spawned as DOM elements with CSS custom properties (--delay, --dur) and removed when done. No dependencies.

Live preview: https://movin.design/components/buttons/shockwave/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-shockwave
```

Or copy [`button-shockwave.tsx`](./button-shockwave.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-shockwave.html`](./button-shockwave.html) where it goes and include [`button-shockwave.css`](./button-shockwave.css). [`button-shockwave.js`](./button-shockwave.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
