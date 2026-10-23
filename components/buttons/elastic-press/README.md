# Elastic Press button

On click, a CSS keyframe animation fires — squishing the button horizontally then snapping back with an overshoot oscillation that simulates spring physics. The animation is re-triggered cleanly on every click by removing and re-adding the data attribute with a forced reflow. No dependencies.

Live preview: https://movin.design/components/buttons/elastic-press/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-elastic-press
```

Or copy [`button-elastic-press.tsx`](./button-elastic-press.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-elastic-press.html`](./button-elastic-press.html) where it goes and include [`button-elastic-press.css`](./button-elastic-press.css). [`button-elastic-press.js`](./button-elastic-press.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
