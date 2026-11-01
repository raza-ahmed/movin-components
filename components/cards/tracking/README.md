# Tracking card

A parcel tracking card: on load the route line fills down the timeline to the current step one segment at a time, each dot filling as the line reaches it, and the latest step pulses.

Live preview: https://movin.design/components/cards/tracking/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/card-tracking
```

Or copy [`card-tracking.tsx`](./card-tracking.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`card-tracking.html`](./card-tracking.html) where it goes and include [`card-tracking.css`](./card-tracking.css). [`card-tracking.js`](./card-tracking.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
