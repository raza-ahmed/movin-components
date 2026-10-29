# Markdown checkbox

A Markdown task checkbox: ticking blinks a caret between the brackets and types an x into them; unticking deletes it, and the task text dims while it is done.

Live preview: https://movin.design/components/checkboxes/markdown/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/checkbox-markdown
```

Or copy [`checkbox-markdown.tsx`](./checkbox-markdown.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`checkbox-markdown.html`](./checkbox-markdown.html) where it goes and include [`checkbox-markdown.css`](./checkbox-markdown.css). [`checkbox-markdown.js`](./checkbox-markdown.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
