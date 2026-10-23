# Shape radio button

A shape picker whose preview morphs: circle, square, triangle and star are all 20-point polygons drawn from the top clockwise, so choosing one melts the preview straight into the next with a springy overshoot. Pure CSS (clip-path interpolation).

Live preview: https://movin.design/components/radios/shape/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/radio-shape
```

Or copy [`radio-shape.tsx`](./radio-shape.tsx) into your project. Dependencies: none.

## Plain HTML + CSS

No framework and no dependencies. Paste [`radio-shape.html`](./radio-shape.html) where it goes and include [`radio-shape.css`](./radio-shape.css). It is pure CSS, so there is no script.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
