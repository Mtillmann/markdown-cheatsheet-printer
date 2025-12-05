<script setup lang="ts">
import { inject } from 'vue'

const prefs = inject('userPreferences') as any  // eslint-disable-line @typescript-eslint/no-explicit-any
const markdown = inject('markdown') as any // eslint-disable-line @typescript-eslint/no-explicit-any
const stylesheet = inject('stylesheet') as any // eslint-disable-line @typescript-eslint/no-explicit-any

const bumpFrontMatter = () => {
    markdown.writeFrontMatter()
}

const reset = () => {
    if(confirm('Are you sure you want to reset the markdown and custom CSS to defaults? This action cannot be undone.')) {
        markdown.init(true)
        stylesheet.init(true)
    }
}

</script>

<template>
    <div class="grid grid-cols-12 mt-4 text-base-content">
        <div class="col-span-10 col-start-2">
            <div class="space-y-4">

                <!-- Omit FrontMatter Defaults -->
                <div class="card bg-base-200 p-3 shadow-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">Omit FrontMatter Default Values</h3>
                        <div class="text-sm text-zinc-400">omitFrontMatterDefaults</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">When enabled, the default values will be omitted from
                        FrontMatter in your Markdown.</p>
                    <fieldset class="mt-3">
                        <label class="label cursor-pointer">
                            <input type="checkbox" class="toggle toggle-sm toggle-primary"
                                v-model="prefs.omitFrontMatterDefaults" @change="bumpFrontMatter" />
                            <span class="label-text ml-2">Enabled</span>
                        </label>
                    </fieldset>
                </div>

                <!-- Grayscale Previews -->
                <div class="card bg-base-200 p-3 shadow-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">Grayscale Previews</h3>
                        <div class="text-sm text-zinc-400">grayscalePreviews</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">When enabled, previews display in grayscale - similar to what
                        a laser printer might produce.</p>
                    <fieldset class="mt-3">
                        <label class="label cursor-pointer">
                            <input type="checkbox" class="toggle toggle-sm toggle-primary"
                                v-model="prefs.grayscalePreviews" />
                            <span class="label-text ml-2">Enabled</span>
                        </label>
                    </fieldset>
                </div>

                <!-- Write Layout To FrontMatter -->
                <div class="card bg-base-200 p-3 shadow-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">Write Layout To FrontMatter</h3>
                        <div class="text-sm text-zinc-400">writeLayoutToFrontMatter</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">When enabled, the current layout (size, rows, columns etc ) is
                        saved to the document's frontmatter.</p>
                    <fieldset class="mt-3">
                        <label class="label cursor-pointer">
                            <input type="checkbox" class="toggle toggle-sm toggle-primary"
                                v-model="prefs.writeLayoutToFrontMatter" @change="bumpFrontMatter" />
                            <span class="label-text ml-2">Enabled</span>
                        </label>
                    </fieldset>
                </div>

                <!-- Print Margin Preview -->
                <div class="card bg-base-200 p-3 shadow-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">Print Margin Preview</h3>
                        <div class="text-sm text-zinc-400">printMarginPreview</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">When enabled, print margins are displayed in the layout
                        preview.</p>
                    <fieldset class="mt-3">
                        <label class="label cursor-pointer">
                            <input type="checkbox" class="toggle toggle-sm toggle-primary"
                                v-model="prefs.printMarginPreview" />
                            <span class="label-text ml-2">Enabled</span>
                        </label>
                    </fieldset>
                </div>


                <!-- App Theme -->
                <div class="card bg-base-200 p-3 shadow-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">App Theme</h3>
                        <div class="text-sm text-zinc-400">theme</div>
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">Choose the application theme used for the UI.</p>
                    <fieldset class="mt-3">
                        <select v-model="prefs.theme" class="select select-bordered w-full" aria-label="Layout">
                            <option value="" disabled>Choose Theme</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                        </select>
                    </fieldset>
                </div>

                <!-- Reset Content -->
                <div class="card bg-base-200 p-4 shadow-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">Reset Markdown &amp; CSS</h3>
                        <div class="text-sm text-zinc-400">reset</div>
                    </div>
                        <p class="mt-1 text-sm text-zinc-400">Restores the <a href="default-document.md"
                            target="_blank" class="text-primary underline hover:text-primary-focus">default
                            markdown</a> and <a href="stylesheets/custom.css" target="_blank"
                            class="text-primary underline hover:text-primary-focus">default custom CSS</a>.</p>
                    <div class="mt-4 flex justify-center">
                        <button class="btn btn-error btn-sm" type="button" @click="reset">Reset to Defaults</button>
                    </div>
                </div>

                <div class="card bg-base-200 p-4 shadow-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="font-medium">Project Links</h3>
                        
                    </div>
                    <p class="mt-1 text-sm text-zinc-400">Find the source code, file issues, or contribute on GitHub.</p>
                    <div class="mt-4 flex justify-center">
                        <a href="https://github.com/Mtillmann/markdown-cheatsheet-printer" target="_blank"
                           rel="noreferrer" class="btn btn-sm btn-primary">
                            GitHub
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>