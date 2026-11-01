# Drain slider

A segmented health bar: take some away and the lost chunk flashes and drains after a beat; add some and a ghost shows the new level while the bar fills up to it.

Live preview: https://movin.design/components/sliders/drain/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/slider-drain
```

Or copy [`slider-drain.tsx`](./slider-drain.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`slider-drain.html`](./slider-drain.html) where it goes and include [`slider-drain.css`](./slider-drain.css). [`slider-drain.js`](./slider-drain.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
