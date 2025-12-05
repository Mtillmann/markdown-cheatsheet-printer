import { defineStore } from "pinia";
import { parse as frontMatterExtractor, type Result } from "../lib/Ultramatter";
import render from "@/lib/Renderer";
import { write, file} from "opfs-tools";
import { defaultOptions, optionValidator } from "./Options";
import { useUserPreferencesStore } from "./UserPreferences";
import { useAppStateStore } from "./AppState";

const filename = "document.md";

export const useMarkdownStore = defineStore("markdown", {
  state: () => ({
    content: "",
    frontMatter: {},
    html: "",
  }),
  actions: {
    async init(forceDefault:boolean = false) {
      const request = await fetch("/default-document.md");
      const defaultContent = await request.text();

      const buffer = await file(filename).arrayBuffer();
      const content = new TextDecoder().decode(buffer);
      this.content = forceDefault ? defaultContent: (content || defaultContent);
      this.writeFrontMatter();
      this.convert();
    },
    convert() {
      const { markdown, frontMatter } = this.parseFrontMatter();
      const options = {
        ...defaultOptions,
        ...(frontMatter as Record<string, unknown>),
      };

      this.html = render(markdown as string, options);
    },
    parseFrontMatter(): Record<string, unknown> {
      const { frontmatter: frontMatter, content: markdown }: Result = frontMatterExtractor(
        this.content
      );

      return { markdown, frontMatter: frontMatter };
    },

    writeFrontMatter(options: Record<string, unknown> = {}): void {
      const userPrefs = useUserPreferencesStore();

      const { markdown, frontMatter } = this.parseFrontMatter();

      const frontMatterItems = Object.entries({
        ...defaultOptions,
        ...(frontMatter as Record<string, unknown>),
        ...options,
      }).reduce((acc, [key, value]) => {
        if (typeof value === "string") {
          acc.push(`${key}: ${JSON.stringify(value)}`);
          return acc;
        }

        if (key.startsWith("layout")) {
          acc.push(`${key}: ${value}`);
          return acc;
        }

        if (value === defaultOptions[key] && userPrefs.omitFrontMatterDefaults) return acc;

        if (!optionValidator(key, value)) return acc;

        acc.push(`${key}: ${value}`);
        return acc;
      }, [] as string[]);

      if (frontMatterItems.length > 0) {
        frontMatterItems.unshift("---");
        frontMatterItems.push("---");
      } else {
        frontMatterItems.pop();
      }

      this.content = [...frontMatterItems, markdown].join("\n");
    },

    async store() {
      const state = useAppStateStore();
      state.status = "Saving document...";
      await write(filename, new TextEncoder().encode(this.content));
      state.status = "";
    },
  },
});
