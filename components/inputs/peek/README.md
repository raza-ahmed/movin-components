# Peek input

A password field whose show/hide toggle is a living eye. Hidden, the eye is shut; showing the password blinks it open, and while it is open the pupil follows your caret along the text.

Live preview: https://movin.design/components/inputs/peek/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/input-peek.json
```

Or copy [`input-peek.tsx`](./input-peek.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-peek.html`](./input-peek.html) where it goes and include [`input-peek.css`](./input-peek.css). [`input-peek.js`](./input-peek.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
