<script setup lang="ts">
import { ref, onMounted, inject, onBeforeUnmount } from 'vue'
import { basicSetup, EditorView } from "codemirror"
import { css } from "@codemirror/lang-css"
import { oneDark } from '@codemirror/theme-one-dark'


const userPreferences = inject('userPreferences') as any // eslint-disable-line @typescript-eslint/no-explicit-any
const stylesheet = inject('stylesheet') as any // eslint-disable-line @typescript-eslint/no-explicit-any
const markdown = inject('markdown') as any // eslint-disable-line @typescript-eslint/no-explicit-any
const rendered = ref<HTMLElement>()
const container = ref<HTMLDivElement>()
let editorView: EditorView

const prefersDark = () =>
    userPreferences?.theme === 'dark' ||
    (userPreferences?.theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)


onBeforeUnmount(() => {
    stylesheet.store()
    stylesheet.deploy();
    editorView.destroy();
})

onMounted(() => {
    rendered.value!.innerHTML = markdown.html


    editorView = new EditorView({
        doc: stylesheet.content,
        extensions: [
            basicSetup,
            EditorView.theme({ "&": { height: "100%" } }),
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    stylesheet.content = update.state.doc.toString()
                    stylesheet.deploy()
                    stylesheet.store()
                }
            }),
            css(),
            ...(prefersDark() ? [oneDark] : []),
        ],
        parent: container.value
    })
})

</script>

<template>
    <div class="grid grid-cols-12 h-full gap-4 min-h-0">

        <div class="h-full col-span-6 lg:col-span-4 overflow-auto min-h-0"
            ref="container">
        </div>

        <div ref="rendered" class="col-span-6 lg:col-span-8 h-full overflow-auto p-0 min-h-0"
            :class="{ 'grayscale': userPreferences.grayscalePreviews }">
        </div>
    </div>
</template>