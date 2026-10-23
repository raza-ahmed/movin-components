# Loupe button

A magnifying glass follows the cursor across the button at 2.5x, rendered from a clone of the content shifted by CSS so the point under the cursor sits in the middle of the lens. The fine print under the label is only readable through it.

Live preview: https://movin.design/components/buttons/loupe/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-loupe
```

Or copy [`button-loupe.tsx`](./button-loupe.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-loupe.html`](./button-loupe.html) where it goes and include [`button-loupe.css`](./button-loupe.css). [`button-loupe.js`](./button-loupe.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
