---
theme: "modern"
keepLinks: true
theads: "h3"
header: "span"
footer: "span+center"
hljsTheme: "github-dark"
colorPrimary: ""
colorSecondary: ""
layout_size: "A4"
layout_layout: "landscape"
layout_margin: 4
layout_pagesAcross: 2
layout_pagesDown: 1
layout_columns: 2
layout_columnGap: 5
---
<header>

# Abstract Document

</header>

This is the default document to showcase some features of 
the Markdown Cheatsheet Printer. Simply put your own 
markdown content in place of this text and generate a 
printable cheatsheet or reference sheet.

Check the repository's README for details on available options and features: 
https://github.com/Mtillmann/markdown-cheatsheet-printer

## Structural Elements

### Lists & Attributes

- Item Alpha {.eyebrow}
- Item Beta
  - Sub-item 1
  - Sub-item 2

1. Ordered One
2. Ordered Two

### Definition List

Abstract Term
:   Description of the abstract term.

Another Concept
:   Explanation of the concept.

## Textual Enhancements

- **Boldness** and *Emphasis*
- ~~Struck through~~
- ==Highlighted / Marked==
- ++Inserted Content++
- X^2^ (Superscript)
- H~2~O (Subscript)
- 'Smart Quotes' & "Typographic" -- Dashes

## Mathematical Notation

Inline equation: $e^{i\pi} + 1 = 0$

Block equation:
$$
f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2\pi i \xi x} \,d\xi
$$

## Some Code

```javascript
// Abstract Algorithm
function execute(input) {
  const result = input.process();
  return result ?? "Default";
}
```

## Tabular Data

| Some Stuff | | |
| :--- | :---: | ---: |
| Value 1 | Center | 100 |
| Value 2 | Center | 200 |

## Input Methods

- **Action:** <kbd>Ctrl + S</kbd>
- **Sequence:** <kbd>G</kbd> then <kbd>G</kbd>
- **Flow:** <kbd>Alt</kbd>-><kbd>Tab</kbd>

## References

Referencing an external source[^1] and another point[^2].

<footer>

Abstract Footer Region

</footer>

[^1]: Primary citation details.
[^2]: Secondary citation details.
