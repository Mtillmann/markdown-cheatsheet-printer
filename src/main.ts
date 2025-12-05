import { createApp } from "vue";
import { createPinia } from "pinia";
import { useUserPreferencesStore } from "@/stores/UserPreferences";
import { useAppStateStore } from "./stores/AppState";
import { useLayoutStore } from "./stores/Layout";
import { useMarkdownStore } from "./stores/Markdown";
import { useStylesheetStore } from "./stores/Stylesheet";


import "@/app.css";
import "katex/dist/katex.min.css";

import App from "./App.vue";

const app = createApp(App);
app.use(createPinia());

const userPreferencesStore = useUserPreferencesStore();
const stateStore = useAppStateStore();

const layoutStore = useLayoutStore();

const stylesheetStore = useStylesheetStore();
await stylesheetStore.init();

stylesheetStore.deploy();

const markdownStore = useMarkdownStore();
await markdownStore.init();

["basic", "modern", "classic", "study", "cute"].forEach((theme) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `./stylesheets/${theme}.css`;
  document.head.appendChild(link);
});

app.provide("userPreferences", userPreferencesStore);
app.provide("appState", stateStore);
app.provide("stylesheet", stylesheetStore);
app.provide("userPrefs", userPreferencesStore);
app.provide("layout", layoutStore);
app.provide("markdown", markdownStore);

userPreferencesStore.$subscribe(
  () => {
    userPreferencesStore.writeToLocalStorage();
  },
  { detached: true }
);

stateStore.$subscribe(
  () => {
    stateStore.writeToLocalStorage();
  },
  { detached: true }
);

layoutStore.$subscribe(
  () => {
    layoutStore.validateAndWrite();
    layoutStore.applyStyles();
  },
  { detached: true }
);
layoutStore.applyStyles();




app.mount("#app");
