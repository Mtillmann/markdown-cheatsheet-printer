/* eslint-disable @typescript-eslint/no-unused-vars */
import markdownit from "markdown-it";
import { attrs } from "@mdit/plugin-attrs";
import { dl } from "@mdit/plugin-dl";
import { footnote } from "@mdit/plugin-footnote";
import { ins } from "@mdit/plugin-ins";
import { mark } from "@mdit/plugin-mark";
import { sub } from "@mdit/plugin-sub";
import { sup } from "@mdit/plugin-sup";
import { katex } from "@mdit/plugin-katex";
import hljs from "highlight.js";
import helpers from "./RenderHelpers.ts";



export default function (markdown: string, options: Record<string, unknown>): string {
  const renderElement = document.createElement("div");

  const mditOptions:Record<string,unknown> = {
    html: true,
    typographer: options.typographer,
  };

  if (options.quotes) {
    mditOptions.quotes = options.quotes;
  }

  if (options.hljs) {
    mditOptions.highlight = function (str:string, lang:string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            '<pre><code class="hljs">' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            "</code></pre>"
          );
        } catch (e) {}
      }

      return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + "</code></pre>";
    };
  }

  const md = markdownit(mditOptions);

  md.use(attrs);
  md.use(dl);
  md.use(footnote);
  md.use(ins);
  md.use(mark);
  md.use(sub);
  md.use(sup);
  md.use(katex);

  const result = md.render(markdown);

  renderElement.insertAdjacentHTML("beforeend", result);
  renderElement.classList.add('document','custom');

  Object.entries(options).forEach(([key, value]) => {
    
    if(key.startsWith('layout_')) return;


    value = value === "false" ? false : value === "true" ? true : value;

    renderElement.dataset[key] = (value as string).toString();
    if (key in helpers) {
      (helpers as Record<string, (body: HTMLElement, value: string, key: string) => void>)[key](
        renderElement,
        value as string,
        key as string
      );
    }
    if (key.startsWith("color")) {
      helpers.color(renderElement, value as string, key);
    }
  });

  // Always move footnotes to footer
  helpers.moveFootnotesToFooter(renderElement);
  if (options.footerNote) helpers.setFooterNote(renderElement, options.footerNote as string);

  return renderElement.outerHTML;
}
