function ensureLinkElem(id: string): HTMLElement {
  let element = document.getElementById(id);
  if (!element) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.id = id;
    document.head.appendChild(link);
    element = link;
  }
  return element;
}

export default {
  theads(dom: HTMLElement, mode: string): void {
    if (/^h[1-6]$/.test(mode)) {
      dom.querySelectorAll("thead").forEach((thead) => {
        thead
          .closest("table")!
          .insertAdjacentHTML("beforebegin", `<${mode}>${thead.textContent}</${mode}>`);
      });
    }
  },
  theme(dom: HTMLElement, theme: string): void {
    if (/^https?:|\.css$/.test(theme)) {
      ensureLinkElem("externalDocumentTheme");
      dom.dataset.theme = "external";
    }
  },
  color(dom: HTMLElement, color:string, key: string): void {
    const varName = `--theme-color-${key.slice(5).toLowerCase()}`;
    dom.style.setProperty(varName, color);
  },
  renderKBD(dom: HTMLElement, mode: string): void {
    if (!mode) {
      return;
    }

    const connectors = [",", "then", "->","-&gt;","→"];

    let html = dom.innerHTML;

    html = html.replace(/<kbd>([^<]+)<\/kbd>/g, (match, content) => {
      const parts:string[] = content.split(/\s*\+\s*(?=.)/);
      if (parts.length < 2) return match;
      const keys = parts.map((k) => k.trim()).filter((k) => k !== "");
      if (keys.length < 2) return match;
      return keys.map((key:string) => `<kbd>${key}</kbd>`).join(" + ");
    });

    // Remove connector strings between kbd elements
    const connectorsPattern = connectors
      .map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    html = html.replace(
      new RegExp(`</kbd>\\s*(${connectorsPattern})\\s*<kbd>`, "gi"),
      "</kbd><kbd>"
    );

    // Add arrow separator between consecutive kbd elements
    html = html.replace(/(<\/kbd>)(<kbd>)/g, '$1 <span class="kbd-arrow">→</span> $2');

    dom.innerHTML = html;
  },
  hljsTheme(dom: HTMLElement, theme:string):void {
    ensureLinkElem("highlightJSThemeStylesheet").setAttribute(
      "href",
      `node_modules/highlight.js/styles/${theme}.css`
    );
  },
  moveFootnotesToFooter(dom: HTMLElement) {
    // Find the footnotes section
    const footnotesSection = dom.querySelector(".footnotes");

    if (!footnotesSection) {
      return; // No footnotes to move
    }

    // Find or create footer
    let footer = dom.querySelector("footer");
    if (!footer) {
      footer = document.createElement("footer");
      dom.appendChild(footer);
    }

    // Move footnotes into footer
    footer.appendChild(footnotesSection);

    dom.querySelectorAll('.footnotes p').forEach((p,i) => {
      p.insertAdjacentText('afterbegin', i + 1 + '. ');
    });

    dom.querySelector('.footnotes-sep')?.remove()

  },
  setFooterNote(dom: HTMLElement, content:string) {
    if (!content) {
      return;
    }
    dom.insertAdjacentHTML(
      "beforeend",
      `
        <div id="footNote">${content}</div>
      `
    );
  },
  header(dom: HTMLElement, mode:string): void {
    const header = dom.querySelector("header");
    if (!header) {
      return;
    }

    if (mode === "hide") {
      header.remove();
    }
  }
};
