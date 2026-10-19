# Typewriter radio button

On selection, the option label types character-by-character at 50ms intervals with a blinking cursor. Switching options clears the previous and re-types the new one, giving each selection a deliberate, terminal-like personality.

Live preview: https://movin.design/components/radios/typewriter/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/radio-typewriter.json
```

Or copy [`radio-typewriter.tsx`](./radio-typewriter.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`radio-typewriter.html`](./radio-typewriter.html) where it goes and include [`radio-typewriter.css`](./radio-typewriter.css). [`radio-typewriter.js`](./radio-typewriter.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
