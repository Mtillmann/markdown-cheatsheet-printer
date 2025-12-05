<script setup lang="ts">
import { ref, onMounted, inject, onBeforeUnmount } from 'vue'
import { basicSetup, EditorView } from "codemirror"
import { markdown as langMarkdown } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"
import { oneDark } from '@codemirror/theme-one-dark'
import { throttle } from 'lodash-es'


const userPreferences = inject('userPreferences') as any
const prefersDark = () =>
    userPreferences?.theme === 'dark' ||
    (userPreferences?.theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)

const container = ref<HTMLDivElement>()
let editorView: EditorView

const markdown = inject('markdown') as any

const write = async function (content:string) {
    markdown.content = content
    markdown.writeFrontMatter()
    markdown.convert()
    await markdown.store()
}

onBeforeUnmount(async() => {
    await write(editorView.state.doc.toString())
    editorView.destroy();
})

onMounted(() => {

    markdown.writeFrontMatter()

    editorView = new EditorView({
        doc: markdown.content,
        extensions: [
            basicSetup,
            EditorView.theme({ "&": { height: "100%" } }),
            EditorView.updateListener.of(throttle((update) => {
                if (update.docChanged) {
                    write(update.state.doc.toString())
                }
            }, 300)),
            langMarkdown({ codeLanguages: languages }),
            ...(prefersDark() ? [oneDark] : []),
        ],
        parent: container.value
    })
})

</script>

<template>
    <div ref="container" class="h-full"></div>
</template>