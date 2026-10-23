# Shatter button

A click breaks the button into 24 irregular triangular shards, each a clone of the face clipped with clip-path. They burst away from the click point in 3D, hang in the air for a beat with their own lighting, then fly back and lock together with a small snap.

Live preview: https://movin.design/components/buttons/shatter/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-shatter
```

Or copy [`button-shatter.tsx`](./button-shatter.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-shatter.html`](./button-shatter.html) where it goes and include [`button-shatter.css`](./button-shatter.css). [`button-shatter.js`](./button-shatter.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
