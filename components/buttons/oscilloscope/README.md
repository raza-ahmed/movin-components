# Oscilloscope button

A button with a live oscilloscope screen. The trace runs as a sine at rest, bends into a square wave and speeds up on hover, and a click fires a pulse that travels along the line.

Live preview: https://movin.design/components/buttons/oscilloscope/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-oscilloscope
```

Or copy [`button-oscilloscope.tsx`](./button-oscilloscope.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-oscilloscope.html`](./button-oscilloscope.html) where it goes and include [`button-oscilloscope.css`](./button-oscilloscope.css). [`button-oscilloscope.js`](./button-oscilloscope.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
