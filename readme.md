# Markdown Cheatsheet Printer

- flexible grid layouts across multiple pages
- custom multi-column content flow
- syntax highlighting
- theme support
- extended markdown syntax
- KaTeX support
- prints natively to pdf or paper (no bitmap conversion)

## Markdown Renderer

Uses [markdown-it](https://github.com/markdown-it/markdown-it) for rendering the markdown to HTML with the following options:

- `html: true` - Enable HTML tags in source - always enabled
- `typographer: true` - smartquotes and other typographic replacements - can be toggled from frontmatter
- `quotes: ...` smartquotes - can be passed from frontmatter (TODO)
- `highlight: ...` - code syntax highlighting using [highlight.js](https://highlightjs.org/) - can be toggled from frontmatter - theme can be passed from frontmatter.

Plugins to enhance authoring and rendering:

- [`@mdit/plugin-attrs`](https://mdit-plugins.github.io/attrs.html)
- [`@mdit/plugin-dl`](https://mdit-plugins.github.io/dl.html)
- [`@mdit/plugin-footnote`](https://mdit-plugins.github.io/footnote.html)
- [`@mdit/plugin-ins`](https://mdit-plugins.github.io/ins.html)
- [`@mdit/plugin-katex`](https://mdit-plugins.github.io/katex.html)
- [`@mdit/plugin-mark`](https://mdit-plugins.github.io/mark.html)
- [`@mdit/plugin-sub`](https://mdit-plugins.github.io/sub.html)
- [`@mdit/plugin-sup`](https://mdit-plugins.github.io/sup.html)

Frontmatter parsing is based on [ultramatter](https://github.com/natemoo-re/ultramatter), so some limitations apply (e.g. no nested objects).

## Frontmatter Options

### Theme and Styling

**`theme`** (default: `'classic'`)
- Selects which CSS theme to use
- Available values: `classic`, `modern`, `cute`, `study`

**`colorPrimary`**, **`colorSecondary`**, **`color*`**
- Override theme colors dynamically
- Any frontmatter key starting with `color` sets a CSS variable
- Example: `colorPrimary: '#ff0000'` sets `--color-primary` variable

### Typography

**`typographer`** (default: `true`)
- Enables smart quotes and typography replacements
- Converts `--` to em-dash, `(c)` to ©, etc.

**`quotes`** (default: `'""'''`)
- Defines quote characters for typographer feature
- Format: opening double, closing double, opening single, closing single
- Default uses English-style quotes

### Code Highlighting

**`hljs`** (default: `true`)
- Enables highlight.js syntax highlighting for code blocks
- When `false`, code is rendered without syntax highlighting

**`hljsTheme`** (default: `'magula'`)
- Selects which highlight.js theme CSS to load
- Browse themes at [highlightjs.org](https://highlightjs.org/demo)
- use base16 themes like this `base16/{theme-name}`

### Content Options

**`header`** (default: `'default'`)
- Controls how the document header is displayed
- Values: 
  - `default`: as-is
  - `hide`: hidden
  - `span` applys `column-span:all`
  - `span+center`: applys `column-span:all` and `text-align:center`

**`footer`** (default: `'default'`)
- works same as `header`

**`theads`** (default: `'keep'`)
- Controls table header rendering behavior
- Values: `keep` (normal `<thead>`), `hide` (removes headers), `h1`, `h2`, `h3`, ... (converts headers to specified level)

**`keepLinks`** (default: `false`)
- Controls whether hyperlinks remain clickable/styled
- When `false`, links are rendered as plain text (print-friendly)

**`renderKBD`** (default: `true`)
- Enables keyboard shortcut rendering enhancement
- See below for examples

**`footerNote`** (default: `'printed via: https://mtillmann.github.io/markdown-cheatsheet-printer'`)
- rendered below footer content in smaller font
- set to false to disable

## Sheet Headers and Footers

use `\<header\>` and `\<footer\>` tags to define the document's header and footer. These will not be repeated per page but only rendered once. Use them like this:

```markdown
<header>

# Most important short-cuts

</header>
```

> Important: have one blank line before and after your content inside the tags


## Keyboard Shortcut Rendering with `frontmatter.renderKBD`

When `renderKBD` is enabled, use <kbd> tags to label keyboard keys:

- `\<kbd\>F5\</kbd\>`: single press
- `\<kbd\>Ctrl + A\</kbd\>`: chord  
- `\<kbd\>Ctrl + Shift + P\</kbd\>`: stacked chord  
- `\<kbd\>F5\</kbd\>\<kbd\>F12\</kbd\>`: sequence  
- `\<kbd\>Ctrl + S\</kbd\>\<kbd\>Enter\</kbd\>`: chord then press  
- `\<kbd\>Esc\</kbd\>\<kbd\>Ctrl + P\</kbd\>`: press then chord  
- `\<kbd\>A\</kbd\>\<kbd\>B\</kbd\>\<kbd\>C\</kbd\>`: multi-step sequence  

For better readability inside your source markdown, you can use `,`, `then`, or `->` between `\<kbd\>` elements. These values will be replace with an arrow-symbol in the output.