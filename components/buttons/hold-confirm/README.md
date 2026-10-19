# Hold to Confirm button

Hold the mouse button down to fill a circular SVG progress ring. Progress is driven by requestAnimationFrame over a 1.5-second duration. Releasing early resets to zero. When the ring completes, the button enters a confirmed state with a checkmark and colour change for 1.8 seconds.

Live preview: https://movin.design/components/buttons/hold-confirm/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/button-hold-confirm.json
```

Or copy [`button-hold-confirm.tsx`](./button-hold-confirm.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-hold-confirm.html`](./button-hold-confirm.html) where it goes and include [`button-hold-confirm.css`](./button-hold-confirm.css). [`button-hold-confirm.js`](./button-hold-confirm.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
