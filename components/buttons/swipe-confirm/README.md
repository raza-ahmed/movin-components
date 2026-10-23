# Swipe to Confirm button

A slide-to-confirm track for actions that should not happen by accident. Drag the knob to the end and the track floods light while the arrow redraws as a check; let go early and it springs home. One registered custom property drives the knob, the fill and the hint, so a single transition animates all three.

Live preview: https://movin.design/components/buttons/swipe-confirm/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-swipe-confirm
```

Or copy [`button-swipe-confirm.tsx`](./button-swipe-confirm.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-swipe-confirm.html`](./button-swipe-confirm.html) where it goes and include [`button-swipe-confirm.css`](./button-swipe-confirm.css). [`button-swipe-confirm.js`](./button-swipe-confirm.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
