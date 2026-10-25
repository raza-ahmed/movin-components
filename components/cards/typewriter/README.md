# Typewriter card

Hover erases the card title and description character-by-character then retypes new content, terminal-style with a blinking cursor visible during the erase/type phases. Mouse leave reverses the animation back to the original text.

Live preview: https://movin.design/components/cards/typewriter/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/card-typewriter
```

Or copy [`card-typewriter.tsx`](./card-typewriter.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`card-typewriter.html`](./card-typewriter.html) where it goes and include [`card-typewriter.css`](./card-typewriter.css). [`card-typewriter.js`](./card-typewriter.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
