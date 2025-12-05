import { defineStore } from "pinia";
import { localStorageKey } from "@/lib/Util";

const storageKey = localStorageKey("userPreferences");

const defaults = {
  theme: "system",
  omitFrontMatterDefaults : true,
  grayscalePreviews: false,
  printMarginPreview: true,
  writeLayoutToFrontMatter: false,
};

function setTheme(theme:string):void {
  if (theme !== "system") {
    document.documentElement.dataset.theme = theme;
  } else {
    delete document.documentElement.dataset.theme;
  }
}


const json = localStorage.getItem(storageKey) || JSON.stringify(defaults);
const state = json ? JSON.parse(json) : defaults;

for(const key in defaults){
  if(!(key in state)){
    state[key as keyof typeof defaults] = defaults[key as keyof typeof defaults]
  }
}

setTheme(state.theme);



export const useUserPreferencesStore = defineStore("userPreferences", {
  state: () => state,
  actions: {
    setTheme() {
      setTheme(this.theme);
    },
    writeToLocalStorage() {
      setTheme(this.theme);
      localStorage.setItem(storageKey, JSON.stringify(this.$state));
    },
  },
});
