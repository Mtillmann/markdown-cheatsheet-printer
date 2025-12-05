<script setup lang="ts">
import { inject, ref, watch, onMounted, nextTick, toRaw } from 'vue'
import { debounce } from 'lodash-es'
import { paperFormats, maxPagesAcross, maxPagesDown, maxColumns, maxColumnGap } from '../stores/Options'
import { scale } from '../lib/Scaler'

const layout = inject('layout') as any
const markdown = inject('markdown') as any
const prefs = inject('userPreferences') as any  // eslint-disable-line @typescript-eslint/no-explicit-any



const pagesAcross = ref<number[]>([])
watch(() => layout.pagesAcross, (val) => {
    const n = Math.max(0, Number(val) || 0)
    pagesAcross.value = Array.from({ length: n }, (_, i) => i)
}, { immediate: true })

const pagesDown = ref<number[]>([])
watch(() => layout.pagesDown, (val) => {
    const n = Math.max(0, Number(val) || 0)
    pagesDown.value = Array.from({ length: n }, (_, i) => i)
}, { immediate: true })




const pages = ref<HTMLElement[]>([])
const renderIteration = ref(0)

function rerender() {

    renderIteration.value++;
    nextTick(() => {

        document.querySelectorAll('.page-preview .page').forEach(n => n.remove())
        const actualPages = Array.from(document.querySelectorAll('body > .page')) as HTMLElement[]

        const small = pages.value[0]?.getBoundingClientRect()
        const large = actualPages[0]?.getBoundingClientRect()
        const sx = large?.width ? small.width / large.width : 1
        const sy = large?.height ? small.height / large.height : 1
        let s = Math.min(sx, sy)

        const pixelPerMM: number = large.width / paperFormats[layout.size as keyof typeof paperFormats].width
        const marginPixels = layout.margin * 2 * pixelPerMM;

        let marginScale = 1;

        if (prefs.printMarginPreview) {
            marginScale = (large.width - marginPixels) / large.width
        }

        s = s * marginScale;

        pages.value.forEach((thumb, i) => {
            const actual = actualPages[i]
            if (!actual) return
            const clone = actual.cloneNode(true) as HTMLElement
            clone.style.setProperty('--scale', String(s))
            clone.style.setProperty('--translateX', String((small.width * marginScale) * -0.5) + 'px')
            clone.style.setProperty('--translateY', String((small.height * marginScale) * -0.5) + 'px')
            thumb.appendChild(clone)
        })
    })
}


const reflow = async () => {
    await scale();
    rerender();
}

const debouncedReflow = debounce(reflow, 300)


onMounted(async () => {


    const fmlo = markdown.parseFrontMatter().frontMatter;
    for (const key in fmlo) {
        if (key.startsWith('layout_') && key.slice(7) in toRaw(layout)) {
            const layoutKey = key.slice(7)
            layout[layoutKey] = fmlo[key]
        }
    }

    setTimeout(async () => {
        await layout.validateAndWrite()
        await reflow()
    }, 255);
})

</script>


<template>
    <div class="grid grid-cols-12 h-full gap-4 min-h-0">
        <div class="py-4 pl-4 rounded col-span-3">
            <div class="space-y-4">

                <div class="card bg-base-200 p-3 shadow-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">Paper Size</h3>
                        <div class="text-sm text-zinc-400">size</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">Select the paper format for rendering.</p>
                    <fieldset class="mt-3">
                        <select v-model="layout.size" class="select select-bordered w-full" aria-label="Paper size"
                            @change="debouncedReflow">
                            <option value="" disabled>Choose paper size</option>
                            <option v-for="(format, key) in paperFormats" :key="key" :value="key">{{ format.label }}
                            </option>
                        </select>
                    </fieldset>
                </div>

                <div class="card bg-base-200 p-3 shadow-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">Layout</h3>
                        <div class="text-sm text-zinc-400">layout</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">Choose portrait or landscape orientation.</p>
                    <fieldset class="mt-3">
                        <select v-model="layout.layout" class="select select-bordered w-full" aria-label="Layout"
                            @change="debouncedReflow">
                            <option value="" disabled>Choose layout</option>
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                        </select>
                    </fieldset>
                </div>

                <div class="card bg-base-200 p-3 shadow-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">Margin</h3>
                        <div class="text-sm text-zinc-400">margin</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">Set the minimal margin your printer supports.</p>
                    <fieldset class="mt-3">
                        <input v-model.number="layout.margin" type="number" class="input input-bordered w-full" required
                            placeholder="0–100" min="0" max="100" step="0.5" aria-label="Margin"
                            @input="debouncedReflow" />
                    </fieldset>
                </div>

                <div class="card bg-base-200 p-3 shadow-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">Pages</h3>
                        <div class="text-sm text-zinc-400">pages across / down</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">Set how many pages are placed across and down.</p>
                    <div class="mt-3 grid grid-cols-2 gap-2">
                        <input v-model="layout.pagesAcross" type="number" class="input input-bordered w-full" required
                            placeholder="1–10" min="1" :max="maxPagesAcross" step="1" title="Must be between 1 and 10"
                            aria-label="Number of columns" @input="debouncedReflow" />
                        <input v-model="layout.pagesDown" type="number" class="input input-bordered w-full" required
                            placeholder="1–10" min="1" :max="maxPagesDown" step="1" title="Must be between 1 and 10"
                            aria-label="Number of rows" @input="debouncedReflow" />
                    </div>
                </div>

                <div class="card bg-base-200 p-3 shadow-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">Columns per Page</h3>
                        <div class="text-sm text-zinc-400">columns</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">Number of columns on each page.</p>
                    <fieldset class="mt-3">
                        <input v-model.number="layout.columns" type="number" class="input input-bordered w-full"
                            required placeholder="1–10" min="1" :max="maxColumns" step="1"
                            title="Must be between 1 and maxColumns" aria-label="Columns per Page"
                            @input="debouncedReflow" />
                    </fieldset>
                </div>

                <div class="card bg-base-200 p-3 shadow-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">Column Gap</h3>
                        <div class="text-sm text-zinc-400">column gap</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">Spacing between columns on a page (in mm).</p>
                    <fieldset class="mt-3">
                        <div class="flex items-center gap-2">
                            <input v-model.number="layout.columnGap" type="number" class="input input-bordered w-full"
                                min="0" :max="maxColumnGap" step="1" aria-label="Column gap (mm)"
                                @input="debouncedReflow" />
                            <div class="text-sm text-zinc-500 px-2">mm</div>
                        </div>
                    </fieldset>
                </div>

            </div>
        </div>
        <div class="col-span-9 h-full overflow-auto p-4 min-h-0 rounded"
            :class="{ 'grayscale': prefs.grayscalePreviews }">
            <div class="grid gap-4" id="pagePreview" :key="`iteration-${renderIteration}`">
                <div v-for="x in pagesAcross" class="col-span-1" :key="`col-${x}`">
                    <div v-for="y in pagesDown" ref="pages" class="page-preview mb-4 bg-white" :key="`row-${y}`">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>