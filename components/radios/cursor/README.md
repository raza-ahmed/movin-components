# Cursor radio button

A glowing gray pill indicator slides smoothly between selected options via translateY, acting like a cursor homing in on the active choice. Labels brighten on select; the pill springs with a cubic-bezier overshoot.

Live preview: https://movin.design/components/radios/cursor/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/radio-cursor.json
```

Or copy [`radio-cursor.tsx`](./radio-cursor.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`radio-cursor.html`](./radio-cursor.html) where it goes and include [`radio-cursor.css`](./radio-cursor.css). [`radio-cursor.js`](./radio-cursor.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
