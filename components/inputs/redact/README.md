# Redact input

A notes field that hides private details as you type: phone numbers and email addresses get a solid redaction bar wiped over them. Reveal wipes the bars off to an underline; Hide wipes them back.

Live preview: https://movin.design/components/inputs/redact/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-redact
```

Or copy [`input-redact.tsx`](./input-redact.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-redact.html`](./input-redact.html) where it goes and include [`input-redact.css`](./input-redact.css). [`input-redact.js`](./input-redact.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
