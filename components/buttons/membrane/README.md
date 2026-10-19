# Membrane button

The button is a rubber skin drawn as an SVG path. Leave it and the edge you exit through stretches after the cursor until it lets go and wobbles home on a spring; a press squishes every side inwards and the release boings. A small rAF spring integrator, no dependencies.

Live preview: https://movin.design/components/buttons/membrane/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/button-membrane.json
```

Or copy [`button-membrane.tsx`](./button-membrane.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-membrane.html`](./button-membrane.html) where it goes and include [`button-membrane.css`](./button-membrane.css). [`button-membrane.js`](./button-membrane.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
