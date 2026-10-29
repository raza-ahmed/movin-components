# Synth card

A tiny synth module: drag the two knobs to shape a live waveform on the little screen. Freq packs more cycles in; Shape morphs it smoothly from sine through triangle and square to saw.

Live preview: https://movin.design/components/cards/synth/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/card-synth
```

Or copy [`card-synth.tsx`](./card-synth.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`card-synth.html`](./card-synth.html) where it goes and include [`card-synth.css`](./card-synth.css). [`card-synth.js`](./card-synth.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
