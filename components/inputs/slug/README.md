# Slug input

A post-title field that builds its URL slug live underneath: accents are stripped, symbols become dashes, and each character of the slug pops in only when it actually changes. Copy puts the full link on the clipboard.

Live preview: https://movin.design/components/inputs/slug/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-slug
```

Or copy [`input-slug.tsx`](./input-slug.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-slug.html`](./input-slug.html) where it goes and include [`input-slug.css`](./input-slug.css). [`input-slug.js`](./input-slug.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
