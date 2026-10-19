# Cube Face button

On click, a 3D cube rotates 90 degrees on the X axis to reveal a second face with a confirmation message. Uses CSS transform-style: preserve-3d with two absolutely-positioned faces — a front face (translateZ) and a top face (rotateX + translateZ). Auto-resets after 1.8 seconds.

Live preview: https://movin.design/components/buttons/cube-face/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/button-cube-face.json
```

Or copy [`button-cube-face.tsx`](./button-cube-face.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-cube-face.html`](./button-cube-face.html) where it goes and include [`button-cube-face.css`](./button-cube-face.css). [`button-cube-face.js`](./button-cube-face.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
