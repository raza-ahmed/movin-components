# Blueprint button

Hover turns the button into its own spec drawing: the face becomes a dashed outline on a grid, extension guides draw out, and dimension lines with arrowheads label its real measured width and height.

Live preview: https://movin.design/components/buttons/blueprint/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-blueprint
```

Or copy [`button-blueprint.tsx`](./button-blueprint.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-blueprint.html`](./button-blueprint.html) where it goes and include [`button-blueprint.css`](./button-blueprint.css). [`button-blueprint.js`](./button-blueprint.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
