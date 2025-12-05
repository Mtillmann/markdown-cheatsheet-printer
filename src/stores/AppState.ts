import { defineStore } from "pinia";
import { localStorageKey } from "@/lib/Util";

const storageKey = localStorageKey("app-state");
const isFirefoxBrowser =
  typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent);

export const useAppStateStore = defineStore("appState", {
  state: () => ({
    currentTab: "Markdown",
    loading: false,
    loadingMessage: "loading",
    isFirefox: isFirefoxBrowser,
    status: "",
  }),
  actions: {
    load(message = "loading") {
      this.loading = true;
      this.loadingMessage = message;
    },
    unload() {
      this.loading = false;
    },

    writeToLocalStorage() {
      const state = JSON.parse(JSON.stringify(this.$state));
      localStorage.setItem(storageKey, JSON.stringify(state));
    },
  },
});
