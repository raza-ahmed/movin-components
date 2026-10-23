# Power toggle

A standalone 56px circular power button with no track. Off: dark neumorphic inset. On: radial white gradient with a multi-layer glow. Every click spins the power icon 360° and fires an outward ripple ring.

Live preview: https://movin.design/components/toggles/power/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/toggle-power
```

Or copy [`toggle-power.tsx`](./toggle-power.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`toggle-power.html`](./toggle-power.html) where it goes and include [`toggle-power.css`](./toggle-power.css). [`toggle-power.js`](./toggle-power.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
