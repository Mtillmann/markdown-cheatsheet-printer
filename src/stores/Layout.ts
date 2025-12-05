import { defineStore } from "pinia";
import { localStorageKey } from "@/lib/Util";
import { paperFormats, maxPagesAcross, maxPagesDown, maxColumnGap, maxColumns } from "./Options";
import { useMarkdownStore } from "./Markdown";
import { useUserPreferencesStore } from "./UserPreferences";

const storageKey = localStorageKey("layout-state");

const defaults = {
  size: "A4",
  layout: "portrait",
  margin: 4,
  pagesAcross: 2,
  pagesDown: 1,
  columns: 2,
  columnGap: 5,
};

const json = localStorage.getItem(storageKey) || JSON.stringify(defaults);
const state = json ? JSON.parse(json) : defaults;
let markdown: any;
let prefs: any;

for (const key in defaults) {
  if (!(key in state)) {
    state[key] = defaults[key as keyof typeof defaults];
  }
}

export const useLayoutStore = defineStore("layout", {
  state: () => state,
  actions: {
    async validateAndWrite() {
      if (this.pagesAcross < 1) {
        this.pagesAcross = 1;
      }
      if (this.pagesAcross > maxPagesAcross) {
        this.pagesAcross = maxPagesAcross;
      }
      if (this.pagesDown < 1) {
        this.pagesDown = 1;
      }
      if (this.pagesDown > maxPagesDown) {
        this.pagesDown = maxPagesDown;
      }
      if (!(this.size in paperFormats)) {
        this.size = "din";
      }
      if (this.columns < 1) {
        this.columns = 1;
      }
      if (this.columns > maxColumns) {
        this.columns = maxColumns;
      }
      if (this.columnGap < 0) {
        this.columnGap = 0;
      }
      if (this.columnGap > maxColumnGap) {
        this.columnGap = maxColumnGap;
      }

      await this.writeToLocalStorage();
    },
    applyStyles() {
      const format = paperFormats[this.size as keyof typeof paperFormats];

      const w = this.layout === "portrait" ? format.width : format.height;
      const h = this.layout === "portrait" ? format.height : format.width;
      const ar = w / h;

      let extraWidth = 0;
      if (this.pagesAcross === 2) {
        extraWidth = this.columnGap;
      } else if (this.pagesAcross > 2) {
        extraWidth = (this.pagesAcross - 1) * this.columnGap;
      }

      let pageRuleStyleElement = document.getElementById(
        "pageRuleStyle"
      ) as HTMLStyleElement | null;
      if (!pageRuleStyleElement) {
        pageRuleStyleElement = document.createElement("style");
        pageRuleStyleElement.id = "pageRuleStyle";
        document.head.appendChild(pageRuleStyleElement);
      }

      // in firefox muss das margin im print dialog immer auf default stehen!
      // das margin muss so sein wie das physikalische des druckers
      pageRuleStyleElement.textContent = `
      @media print {
          @page {
              size: ${this.size} ${this.layout};
              margin: ${this.margin}mm;
          }
      }
      `;

      document.documentElement.dataset.paperSize = this.size;
      document.documentElement.dataset.paperLayout = this.layout;

      document.documentElement.style.setProperty("--extra-width", `${extraWidth}mm`);

      document.documentElement.style.setProperty("--page-width", `${w}mm`);
      document.documentElement.style.setProperty("--page-height", `${h}mm`);
      document.documentElement.style.setProperty("--cols-per-page", this.columns);
      document.documentElement.style.setProperty("--column-gap", `${this.columnGap}mm`);
      document.documentElement.style.setProperty("--page-aspect-ratio", ar as unknown as string);

      const scale = 1.5;

      document.documentElement.style.setProperty("--extra-width-scaled", `${extraWidth * scale}mm`);
      document.documentElement.style.setProperty("--page-width-scaled", `${w * scale}mm`);
      document.documentElement.style.setProperty("--page-height-scaled", `${h * scale}mm`);
      document.documentElement.style.setProperty(
        "--column-gap-scaled",
        `${this.columnGap * scale}mm`
      );

      document.documentElement.style.setProperty("--pages-across", this.pagesAcross);
      document.documentElement.style.setProperty("--pages-down", this.pagesDown);
      document.documentElement.style.setProperty(
        "--gtc-columns",
        Math.max(1, Number(this.pagesAcross) || 1).toString()
      );
    },

    async writeToLocalStorage() {

      if (!markdown) {
        markdown = useMarkdownStore();
      }

      if (!prefs) {
        prefs = useUserPreferencesStore();
      }

      if (prefs.writeLayoutToFrontMatter) {
        markdown.writeFrontMatter({
          layout_size: this.size,
          layout_layout: this.layout,
          layout_margin: this.margin,
          layout_pagesAcross: this.pagesAcross,
          layout_pagesDown: this.pagesDown,
          layout_columns: this.columns,
          layout_columnGap: this.columnGap,
        });
        await markdown.store();
      }

      localStorage.setItem(storageKey, JSON.stringify(this.$state));
    },
  },
});
