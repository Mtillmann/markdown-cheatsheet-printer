<script setup lang="ts">
import { inject } from 'vue';
import { scale } from '../lib/Scaler'

const layout = inject('layout') as any  // eslint-disable-line @typescript-eslint/no-explicit-any

async function print(){
    await scale();
    window.print();
}

</script>
<template>
    <div class="space-y-4 p-6 rounded-box bg-base-200 shadow">
        <p class="text-base font-semibold">
            Make sure to set these options in the print dialog:
        </p>

        <dl class="rounded-box border border-base-300 bg-base-100 p-4 grid gap-x-4 gap-y-2 sm:grid-cols-[max-content_1fr]">
            <dt>More Settings -> Scale</dt>
            <dd class="font-semibold sm:mb-0">Fit to page Width</dd>
            <dt>More Settings -> Margins</dt>
            <dd class="font-semibold sm:mb-0">Default</dd>
            <dt>More Settings -> Options -> Print headers and footers</dt>
            <dd class="font-semibold sm:mb-0">Unchecked</dd>
        </dl>

        <p class="rounded-box border border-base-300 bg-base-100 p-4">
            If there are empty pages in the preview dialog, click "More Settings", then set "Pages" to "Odd".
        </p>

        <p class="rounded-box border border-base-300 bg-base-100 p-4">
            Paper size and layout <em>should</em> be set automatically based on your layout setting.
            <br>If not: expand "More Settings", then set the paper size to <strong>{{ layout.size || 'A4' }}</strong> and layout to
            <strong>{{ layout.layout || 'Portrait' }}</strong>. 
            <br>Layout may not be visible at all!
        </p>


        <div class="flex justify-center pt-4">
            <button type="button" class="btn btn-wide btn-primary text-lg"
            @click="print">Print</button>
        </div>

        <p class="text-sm text-center text-base-content/80">
            Tip: While in the layout view, press <kbd>CTRL</kbd>+<kbd>P</kbd> anytime to open the print dialog.
        </p>
    </div>

</template>