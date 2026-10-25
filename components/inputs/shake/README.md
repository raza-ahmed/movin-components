# Shake input

On invalid submission the input rattles horizontally to signal an error: a rapidly damping shake with a bright border. Pure CSS keyframes, no dependencies.

Live preview: https://movin.design/components/inputs/shake/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-shake
```

Or copy [`input-shake.tsx`](./input-shake.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-shake.html`](./input-shake.html) where it goes and include [`input-shake.css`](./input-shake.css). [`input-shake.js`](./input-shake.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
