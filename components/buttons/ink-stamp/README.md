# Ink Stamp button

On click, a circular ink-blot radial gradient expands from the center of the button and fades out via a CSS keyframe animation. The effect is re-triggered on every click using the removeAttribute/offsetWidth/setAttribute pattern.

Live preview: https://movin.design/components/buttons/ink-stamp/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-ink-stamp
```

Or copy [`button-ink-stamp.tsx`](./button-ink-stamp.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-ink-stamp.html`](./button-ink-stamp.html) where it goes and include [`button-ink-stamp.css`](./button-ink-stamp.css). [`button-ink-stamp.js`](./button-ink-stamp.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
