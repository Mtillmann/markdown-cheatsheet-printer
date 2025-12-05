import { defineStore } from "pinia";
import { write, file } from "opfs-tools";
import * as csstree from "css-tree";
import { useAppStateStore } from "./AppState";

const filename = "custom.css";

export const useStylesheetStore = defineStore("stylesheet", {
  state: () => ({
    content: "",
    sanitized: "",
  }),
  actions: {
    async init(forceDefault: boolean = false) {
      const request = await fetch("/stylesheets/custom.css");
      const defaultStylesheet = await request.text();

      const buffer = await file(filename).arrayBuffer();
      const content = new TextDecoder().decode(buffer);
      this.content = forceDefault ? defaultStylesheet : content || defaultStylesheet;
      this.convert();
    },
    convert() {
      const scope = ".document";

      const ast = csstree.parse(this.content);

      csstree.walk(ast, (node) => {
        if (node.type === "Selector") {
          node.children.prependData({
            type: "ClassSelector",
            name: scope.slice(1),
          });
        }
      });

      this.sanitized = csstree.generate(ast);
    },
    deploy() {
      this.convert();
      let node = document.getElementById("customStylesheet");
      if (!node) {
        node = document.createElement("style");
        node.id = "customStylesheet";
        document.head.appendChild(node);
      }
      node.innerHTML = this.sanitized;
    },

    async store() {
      const state = useAppStateStore();
      state.status = "Saving stylesheet...";
      
      await write(filename, new TextEncoder().encode(this.content));
      state.status = "";
    },
  },
});
