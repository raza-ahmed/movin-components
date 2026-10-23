# Typewriter button

On hover, the button label erases character-by-character at 45ms intervals then retypes an alternate label at 55ms intervals. On mouse leave the process reverses back to the original text. A blinking cursor is shown throughout.

Live preview: https://movin.design/components/buttons/typewriter/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-typewriter
```

Or copy [`button-typewriter.tsx`](./button-typewriter.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-typewriter.html`](./button-typewriter.html) where it goes and include [`button-typewriter.css`](./button-typewriter.css). [`button-typewriter.js`](./button-typewriter.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
