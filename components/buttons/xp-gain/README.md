# XP Gain button

On each click, a "+100 XP" label floats upward from the click position and fades out over 860ms via CSS keyframes. A running total increments in the button label. Click position is captured from the mouse event and used to place the floating element.

Live preview: https://movin.design/components/buttons/xp-gain/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-xp-gain
```

Or copy [`button-xp-gain.tsx`](./button-xp-gain.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-xp-gain.html`](./button-xp-gain.html) where it goes and include [`button-xp-gain.css`](./button-xp-gain.css). [`button-xp-gain.js`](./button-xp-gain.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
