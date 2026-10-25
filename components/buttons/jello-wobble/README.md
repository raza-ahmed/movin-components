# Jello Wobble button

On hover, the button squishes and stretches with a decaying scaleX/scaleY oscillation that simulates rubber or jello physics, starting with a large deformation and settling back to rest over 600ms. Re-triggers cleanly on every mouseenter. No dependencies.

Live preview: https://movin.design/components/buttons/jello-wobble/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-jello-wobble
```

Or copy [`button-jello-wobble.tsx`](./button-jello-wobble.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-jello-wobble.html`](./button-jello-wobble.html) where it goes and include [`button-jello-wobble.css`](./button-jello-wobble.css). [`button-jello-wobble.js`](./button-jello-wobble.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
