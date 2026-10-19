# Validate input

A right-side icon morphs between states: invisible on idle, a checkmark springs in on valid email format, an X shakes in on invalid submission attempt.

Live preview: https://movin.design/components/inputs/validate/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/input-validate.json
```

Or copy [`input-validate.tsx`](./input-validate.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-validate.html`](./input-validate.html) where it goes and include [`input-validate.css`](./input-validate.css). [`input-validate.js`](./input-validate.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
