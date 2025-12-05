import { useAppStateStore } from "@/stores/AppState";
import { useLayoutStore } from "@/stores/Layout";
import { useMarkdownStore } from "@/stores/Markdown";

let state: any;
let layout: any;
let markdown: any;
export const scale = () =>
  new Promise<void>((resolve) => {
    if (!state) {
      state = useAppStateStore();
      layout = useLayoutStore();
      markdown = useMarkdownStore()
    }

    document.querySelectorAll("body > .page").forEach((node) => node.remove());
    let i = 0;
    
    for (let x =0; x < layout.pagesAcross; x++) {
      for (let y = 0; y < layout.pagesDown; y++) {
        document.body.insertAdjacentHTML(
          "beforeend",
          `<div class="page" style="--x:${x};--y:${y};--i:${i}">
                    <div class="content">
                        ${markdown.html}
                    </div>
                </div>`
        );
        i++;
      }
    }

    let outer = document.getElementById("#reflowContainer");
    if (!outer) {
      outer = document.createElement("div");
      outer.id = "reflowContainer";
      document.body.appendChild(outer);
    }
    outer.innerHTML = "";
    outer.innerHTML = markdown.html;
    outer.style.setProperty("font-size", "16px");

    const referenceElement: HTMLElement = outer;
    const elementToScale: HTMLElement = outer.querySelector(".document")!;

    const tolerance = 1;
    const maxIterations = 100;
    let iteration = 0;

    // Binary search bounds for font-size in pixels
    let minFontSize = 4;
    let maxFontSize = 64;

    let refHeight = referenceElement.offsetHeight;
    let scaleHeight = elementToScale.offsetHeight;

    function adjustReferenceElementFontSize() {
      refHeight = referenceElement.offsetHeight;
      scaleHeight = elementToScale.offsetHeight;

      state.load(`reflowing... (iteration ${iteration + 1})`);

      const currentDifference = Math.abs(refHeight - scaleHeight);

      // Check if we've converged within tolerance or hit max iterations
      if (currentDifference <= tolerance || iteration > maxIterations) {
        state.unload();
        resolve();
        return;
      }

      // Binary search: try the midpoint between min and max
      const midpoint = (minFontSize + maxFontSize) / 2;

      // Check if search space has collapsed (can't narrow further)
      if (Math.abs(maxFontSize - minFontSize) < 0.1) {
        state.unload();
        resolve();
        return;
      }

      // Apply the midpoint font-size
      referenceElement.style.fontSize = `${midpoint}px`;

      iteration++;

      // Wait for layout to update, then adjust search bounds
      requestAnimationFrame(() => {
        scaleHeight = elementToScale.offsetHeight;

        // If content is too small, search upper half (larger font sizes)
        if (scaleHeight < refHeight) {
          minFontSize = midpoint;
        }
        // If content is too large, search lower half (smaller font sizes)
        else {
          maxFontSize = midpoint;
        }

        // Update CSS variable for display
        document.documentElement.style.setProperty("--scaled-font-size", `${midpoint}px`);

        const scale = 1.5;
        document.documentElement.style.setProperty(
          "--scaled-font-size-scaled",
          `${midpoint * scale}px`
        );

        // Continue binary search
        requestAnimationFrame(adjustReferenceElementFontSize);
      });
    }

    requestAnimationFrame(adjustReferenceElementFontSize);
  });
