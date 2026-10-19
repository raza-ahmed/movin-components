# Tilt 3D button

A Framer Motion button that rotates in 3D perspective as the cursor moves across it, using useMotionValue and useSpring to track mouse position into rotateX/rotateY transforms. A blurred white orb follows the cursor inside the button as a sheen highlight, and a depth shadow expands on hover. Requires framer-motion.

Live preview: https://movin.design/components/buttons/tilt-3d/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/button-tilt-3d.json
```

Or copy [`button-tilt-3d.tsx`](./button-tilt-3d.tsx) into your project. Dependencies: framer-motion.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-tilt-3d.html`](./button-tilt-3d.html) where it goes and include [`button-tilt-3d.css`](./button-tilt-3d.css). [`button-tilt-3d.js`](./button-tilt-3d.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
