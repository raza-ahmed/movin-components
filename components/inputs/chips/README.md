# Tag Chips input

A tag field. Press Enter or type a comma and the words you typed turn into a chip right where they were while the cursor glides along; Backspace on an empty field melts the last chip back into editable text. Repeats nudge the existing chip instead of doubling it.

Live preview: https://movin.design/components/inputs/chips/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-chips
```

Or copy [`input-chips.tsx`](./input-chips.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-chips.html`](./input-chips.html) where it goes and include [`input-chips.css`](./input-chips.css). [`input-chips.js`](./input-chips.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
