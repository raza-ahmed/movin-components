# Rewind button

An undo button: each press spins its arrow backwards with a fading motion trail, and the undone action runs back out of the label, skewed and smeared like tape, revealing the one before.

Live preview: https://movin.design/components/buttons/rewind/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-rewind
```

Or copy [`button-rewind.tsx`](./button-rewind.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-rewind.html`](./button-rewind.html) where it goes and include [`button-rewind.css`](./button-rewind.css). [`button-rewind.js`](./button-rewind.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
