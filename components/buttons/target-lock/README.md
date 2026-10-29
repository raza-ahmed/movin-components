# Target Lock button

HUD targeting brackets drift loosely outside the button. On hover or focus they snap onto it with a springy lock, crosshair ticks appear, and a readout above retypes itself from ACQUIRING to LOCKED.

Live preview: https://movin.design/components/buttons/target-lock/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-target-lock
```

Or copy [`button-target-lock.tsx`](./button-target-lock.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-target-lock.html`](./button-target-lock.html) where it goes and include [`button-target-lock.css`](./button-target-lock.css). [`button-target-lock.js`](./button-target-lock.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
