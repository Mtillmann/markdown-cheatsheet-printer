<script setup lang="ts">
import { ref, watch, inject, onMounted } from 'vue'
import { optionNamesAndLabels, defaultOptions, allowedValues, hljsThemes, optionValidator } from '@/stores/Options'


const markdown = inject('markdown') as any
const userPreferences = inject('userPreferences') as any
const rendered = ref<HTMLElement>()


const { frontMatter: currentFrontMatter } = markdown.parseFrontMatter()

// minimal reactive options (frontmatter overrides defaults)
const localOptions = ref<Record<string, unknown>>({
    ...defaultOptions,
    ...currentFrontMatter
})

const invalidOptions = ref<string[]>([])

const validate = () => {
    // reset array
    invalidOptions.value = []
    // iterate current local options and collect invalid keys
    Object.entries(localOptions.value).forEach(([k, v]) => {
        if (!optionValidator(k, v)) invalidOptions.value.push(k)
    })
}
validate()

// tiny helper used by the template
const optionsForKey = (key: string): Array<string | number> => {
    if (key === 'theads') return ['keep', 'hide', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    if (key === 'hljsTheme') return hljsThemes as Array<string | number>
    const allowed = (allowedValues as unknown as Record<string, Array<string | number>>)[key]
    return Array.isArray(allowed) ? allowed : []
}

const optionLabel = (key: string, value: unknown): string => {
    if (value === defaultOptions[key]) {
        return `${value} (default)`
    }
    return String(value)
}

onMounted(() => {
    rendered.value!.innerHTML = markdown.html
})

const saveOptions = () => {
    markdown.writeFrontMatter(localOptions.value)
    markdown.convert()
    markdown.store()
    rendered.value!.innerHTML = markdown.html
}

watch(localOptions, () => { validate(); saveOptions() }, { deep: true })
</script>

<template>
    <div class="grid grid-cols-12 h-full gap-4 min-h-0">
        <div class="h-full col-span-6 lg:col-span-4 overflow-auto p-2 min-h-0">
            <div class="space-y-4">

                <!-- Theme -->
                <div class="card bg-base-200 p-3 shadow-sm"
                    :class="{ 'ring ring-red-300': invalidOptions.includes('theme') }">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">{{ optionNamesAndLabels.theme[0] }}</h3>
                        <div class="text-sm text-zinc-400">theme</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">{{ optionNamesAndLabels.theme[1] }}</p>
                    <fieldset class="mt-3">
                        <select v-model="localOptions.theme" class="select select-bordered w-full">
                            <option v-for="opt in optionsForKey('theme')" :key="opt" :value="opt">{{
                                optionLabel('theme', opt) }}</option>
                        </select>
                    </fieldset>
                </div>

                <!-- Keep Links -->
                <div class="card bg-base-200 p-3 shadow-sm"
                    :class="{ 'ring ring-red-300': invalidOptions.includes('keepLinks') }">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">{{ optionNamesAndLabels.keepLinks ? optionNamesAndLabels.keepLinks[0] :
                            'Keep Links' }}</h3>
                        <div class="text-sm text-zinc-400">keepLinks</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">{{ optionNamesAndLabels.keepLinks ?
                        optionNamesAndLabels.keepLinks[1] : 'Preserve original link text/formatting where possible.' }}
                    </p>
                    <fieldset class="mt-3">
                        <label class="label cursor-pointer">
                            <input type="checkbox" v-model="localOptions.keepLinks" class="toggle toggle-primary" />
                            <span class="label-text ml-2">Enabled</span>
                        </label>
                    </fieldset>
                </div>

                <!-- Table Headers (theads) -->
                <div class="card bg-base-200 p-3 shadow-sm"
                    :class="{ 'ring ring-red-300': invalidOptions.includes('theads') }">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">{{ optionNamesAndLabels.theads[0] }}</h3>
                        <div class="text-sm text-zinc-400">theads</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">{{ optionNamesAndLabels.theads[1] }}</p>
                    <fieldset class="mt-3">
                        <select v-model="localOptions.theads" class="select select-bordered w-full">
                            <option v-for="opt in optionsForKey('theads')" :key="opt" :value="opt">{{
                                optionLabel('theads', opt) }}</option>
                        </select>
                    </fieldset>
                </div>


                <!-- Header -->
                <div class="card bg-base-200 p-3 shadow-sm"
                    :class="{ 'ring ring-red-300': invalidOptions.includes('header') }">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">{{ optionNamesAndLabels.header[0] }}</h3>
                        <div class="text-sm text-zinc-400">header</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">{{ optionNamesAndLabels.header[1] }}</p>
                    <fieldset class="mt-3">
                        <select v-model="localOptions.header" class="select select-bordered w-full">
                            <option v-for="opt in optionsForKey('header')" :key="opt" :value="opt">{{
                                optionLabel('header', opt) }}</option>
                        </select>
                    </fieldset>
                </div>

                <!-- Footer -->
                <div class="card bg-base-200 p-3 shadow-sm"
                    :class="{ 'ring ring-red-300': invalidOptions.includes('footer') }">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">{{ optionNamesAndLabels.footer[0] }}</h3>
                        <div class="text-sm text-zinc-400">footer</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">{{ optionNamesAndLabels.footer[1] }}</p>
                    <fieldset class="mt-3">
                        <select v-model="localOptions.footer" class="select select-bordered w-full">
                            <option v-for="opt in optionsForKey('footer')" :key="opt" :value="opt">{{
                                optionLabel('footer', opt) }}</option>
                        </select>
                    </fieldset>
                </div>

                <!-- Render KBD -->
                <div class="card bg-base-200 p-3 shadow-sm"
                    :class="{ 'ring ring-red-300': invalidOptions.includes('renderKBD') }">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">{{ optionNamesAndLabels.renderKBD[0] }}</h3>
                        <div class="text-sm text-zinc-400">renderKBD</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">{{ optionNamesAndLabels.renderKBD[1] }}</p>
                    <fieldset class="mt-3">
                        <label class="label cursor-pointer">
                            <input type="checkbox" v-model="localOptions.renderKBD" class="toggle toggle-primary" />
                            <span class="label-text ml-2">Enabled</span>
                        </label>
                    </fieldset>
                </div>

                <!-- Typographer -->
                <div class="card bg-base-200 p-3 shadow-sm"
                    :class="{ 'ring ring-red-300': invalidOptions.includes('typographer') }">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">{{ optionNamesAndLabels.typographer[0] }}</h3>
                        <div class="text-sm text-zinc-400">typographer</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">{{ optionNamesAndLabels.typographer[1] }}</p>
                    <fieldset class="mt-3">
                        <label class="label cursor-pointer">
                            <input type="checkbox" v-model="localOptions.typographer" class="toggle toggle-primary" />
                            <span class="label-text ml-2">Enabled</span>
                        </label>
                    </fieldset>
                </div>

                <!-- Syntax Highlighting (hljs) -->
                <div class="card bg-base-200 p-3 shadow-sm"
                    :class="{ 'ring ring-red-300': invalidOptions.includes('hljs') }">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">{{ optionNamesAndLabels.hljs[0] }}</h3>
                        <div class="text-sm text-zinc-400">hljs</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">{{ optionNamesAndLabels.hljs[1] }}</p>
                    <fieldset class="mt-3">
                        <label class="label cursor-pointer">
                            <input type="checkbox" v-model="localOptions.hljs" class="toggle toggle-primary" />
                            <span class="label-text ml-2">Enabled</span>
                        </label>
                    </fieldset>
                </div>

                <!-- Highlight.js Theme -->
                <div class="card bg-base-200 p-3 shadow-sm"
                    :class="{ 'ring ring-red-300': invalidOptions.includes('hljsTheme') }">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">{{ optionNamesAndLabels.hljsTheme[0] }}</h3>
                        <div class="text-sm text-zinc-400">hljsTheme</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">{{ optionNamesAndLabels.hljsTheme[1] }}</p>
                    <fieldset class="mt-3">
                        <select v-model="localOptions.hljsTheme" class="select select-bordered w-full">
                            <option v-for="opt in optionsForKey('hljsTheme')" :key="opt" :value="opt">{{
                                optionLabel('hljsTheme', opt) }}</option>
                        </select>
                    </fieldset>
                </div>


                <div class="card bg-base-200 p-3 shadow-sm"
                    :class="{ 'ring ring-red-300': invalidOptions.includes('footerNote') }">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">{{ optionNamesAndLabels.footerNote[0] }}</h3>
                        <div class="text-sm text-zinc-400">footerNote</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">{{ optionNamesAndLabels.footerNote[1] }}</p>
                    <fieldset class="mt-3">
                        <label class="label cursor-pointer">
                            <input type="checkbox" :checked="localOptions.footerNote !== false"
                                @change="e => { localOptions.footerNote = (e.target as HTMLInputElement).checked ? (typeof localOptions.footerNote === 'string' ? localOptions.footerNote : (defaultOptions as any).footerNote) : false }"
                                class="toggle toggle-primary" />
                            <span class="label-text ml-2">Display footer text</span>
                        </label>
                        <input v-model="localOptions.footerNote" v-show:="!localOptions.footerNote === false"
                            class="input input-bordered w-full mt-2" />
                    </fieldset>
                </div>

                <!-- Theme Color Primary -->
                <div class="card bg-base-200 p-3 shadow-sm"
                    :class="{ 'ring ring-red-300': invalidOptions.includes('colorPrimary') }">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">{{ optionNamesAndLabels.colorPrimary[0] }}</h3>
                        <div class="text-sm text-zinc-400">colorPrimary</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">{{ optionNamesAndLabels.colorPrimary[1] }}</p>
                    <fieldset class="mt-3">
                        <div class="flex items-center gap-3">
                            <input type="color" v-model="localOptions.colorPrimary" class="w-12 h-8 p-0 rounded" />
                            <input v-model="localOptions.colorPrimary" placeholder="#RRGGBB"
                                class="input input-bordered flex-1" />
                            <button type="button" class="btn btn-sm btn-outline"
                                @click="localOptions.colorPrimary = ''">Clear</button>
                        </div>
                    </fieldset>
                </div>

                <!-- Theme Color Secondary -->
                <div class="card bg-base-200 p-3 shadow-sm"
                    :class="{ 'ring ring-red-300': invalidOptions.includes('colorSecondary') }">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">{{ optionNamesAndLabels.colorSecondary[0] }}</h3>
                        <div class="text-sm text-zinc-400">colorSecondary</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">{{ optionNamesAndLabels.colorSecondary[1] }}</p>
                    <fieldset class="mt-3">
                        <div class="flex items-center gap-3">
                            <input type="color" v-model="localOptions.colorSecondary"
                                class="w-12 h-8 p-0 rounded" />
                            <input v-model="localOptions.colorSecondary" placeholder="#RRGGBB"
                                class="input input-bordered flex-1" />
                            <button type="button" class="btn btn-sm btn-outline"
                                @click="localOptions.colorSecondary = ''">Clear</button>
                        </div>
                    </fieldset>
                </div>

            </div>
        </div>
        <div ref="rendered" class="col-span-6 lg:col-span-8 h-full overflow-auto p-0 min-h-0"
            :class="{ 'grayscale': userPreferences.grayscalePreviews }">
        </div>
    </div>
</template>