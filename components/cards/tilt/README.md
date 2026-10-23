# Tilt card

Card tilts in 3D toward the cursor using CSS perspective and rotateX/Y driven by mouse position. Springs back to flat on leave.

Live preview: https://movin.design/components/cards/tilt/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/card-tilt
```

Or copy [`card-tilt.tsx`](./card-tilt.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`card-tilt.html`](./card-tilt.html) where it goes and include [`card-tilt.css`](./card-tilt.css). [`card-tilt.js`](./card-tilt.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
