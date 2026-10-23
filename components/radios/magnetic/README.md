# Magnetic radio button

The selection indicator snaps to the chosen option with a magnetic spring-overshoot cubic-bezier — fast pull-in followed by a damped overshoot, simulating ferromagnetic attraction. Field lines ripple out on snap.

Live preview: https://movin.design/components/radios/magnetic/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/radio-magnetic
```

Or copy [`radio-magnetic.tsx`](./radio-magnetic.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`radio-magnetic.html`](./radio-magnetic.html) where it goes and include [`radio-magnetic.css`](./radio-magnetic.css). [`radio-magnetic.js`](./radio-magnetic.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
