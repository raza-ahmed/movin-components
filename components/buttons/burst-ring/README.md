# Burst Ring button

On click, a single transparent ring (border only, no fill) expands outward from the exact click point and fades — different from ripple which fills. Multiple rings can overlap. Uses React useState to track active rings and removes them after 540ms. No dependencies.

Live preview: https://movin.design/components/buttons/burst-ring/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/button-burst-ring.json
```

Or copy [`button-burst-ring.tsx`](./button-burst-ring.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-burst-ring.html`](./button-burst-ring.html) where it goes and include [`button-burst-ring.css`](./button-burst-ring.css). [`button-burst-ring.js`](./button-burst-ring.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
