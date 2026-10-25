# Pressure Dip checkbox

The entire box squishes flat (scaleY 0.28) under simulated finger pressure then springs back up with an overshoot, revealing the checked fill. Distinct from raised (3D): this is a flat squeeze-and-spring.

Live preview: https://movin.design/components/checkboxes/pressure-dip/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/checkbox-pressure-dip
```

Or copy [`checkbox-pressure-dip.tsx`](./checkbox-pressure-dip.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`checkbox-pressure-dip.html`](./checkbox-pressure-dip.html) where it goes and include [`checkbox-pressure-dip.css`](./checkbox-pressure-dip.css). [`checkbox-pressure-dip.js`](./checkbox-pressure-dip.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
