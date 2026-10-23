# Fan toggle

A desk fan with its own switch. Switching on, the blades spin up with real momentum (and a motion-blur disc fades in as they get fast); switching off, they coast down and come to rest wherever they happen to stop, rather than snapping back.

Live preview: https://movin.design/components/toggles/fan/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/toggle-fan
```

Or copy [`toggle-fan.tsx`](./toggle-fan.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`toggle-fan.html`](./toggle-fan.html) where it goes and include [`toggle-fan.css`](./toggle-fan.css). [`toggle-fan.js`](./toggle-fan.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
