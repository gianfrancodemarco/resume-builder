<template>
    <div>
        <div class="tiptap-toolbar">
            <button type="button" @click="run(c => c.toggleBold())" :class="{ active: isActive('bold') }"
                title="Bold (Ctrl+B)">
                <v-icon icon="ph-text-b" size="small" />
            </button>
            <button type="button" @click="run(c => c.toggleItalic())" :class="{ active: isActive('italic') }"
                title="Italic (Ctrl+I)">
                <v-icon icon="ph-text-italic" size="small" />
            </button>
            <button type="button" @click="run(c => c.toggleStrike())" :class="{ active: isActive('strike') }"
                title="Strikethrough">
                <v-icon icon="ph-text-strikethrough" size="small" />
            </button>
            <span class="toolbar-separator"></span>
            <button type="button" @click="setLink" :class="{ active: isActive('link') }" title="Add or edit link">
                <v-icon icon="ph-link" size="small" />
            </button>
            <button type="button" @click="run(c => c.unsetLink())" title="Remove link">
                <v-icon icon="ph-x" size="small" />
            </button>
            <span class="toolbar-separator"></span>
            <button type="button" @click="run(c => c.toggleBulletList())" :class="{ active: isActive('bulletList') }"
                title="Bullet list">
                <v-icon icon="ph-list-bullets" size="small" />
            </button>
            <button type="button" @click="run(c => c.toggleOrderedList())"
                :class="{ active: isActive('orderedList') }" title="Numbered list">
                <v-icon icon="ph-list-numbers" size="small" />
            </button>
            <span class="toolbar-separator"></span>
            <button type="button" @click="run(c => c.undo())" title="Undo (Ctrl+Z)">
                <v-icon icon="ph-arrow-counter-clockwise" size="small" />
            </button>
            <button type="button" @click="run(c => c.redo())" title="Redo (Ctrl+Y)">
                <v-icon icon="ph-arrow-clockwise" size="small" />
            </button>
        </div>
        <EditorContent class="tiptap-editor-content" :editor="editor" />
    </div>
</template>

<script setup>
// Rich text editor whose value is Markdown, the format of JSON Resume text fields
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { Markdown } from 'tiptap-markdown'
import { watch } from 'vue'
import { normalizeUrl } from '@/resume/values'

const model = defineModel({ type: String, default: '' })

const editor = useEditor({
    content: model.value,
    extensions: [
        // Only formatting Markdown can represent
        StarterKit.configure({ heading: false, codeBlock: false, horizontalRule: false }),
        Link.configure({ openOnClick: false, autolink: false }),
        Markdown.configure({ html: false, breaks: true, transformPastedText: true }),
    ],
    onUpdate({ editor }) {
        model.value = editor.storage.markdown.getMarkdown()
    },
})

watch(model, value => {
    if (editor.value && value !== editor.value.storage.markdown.getMarkdown()) {
        editor.value.commands.setContent(value || '', false)
    }
})

const run = command => editor.value && command(editor.value.chain().focus()).run()
const isActive = mark => editor.value?.isActive(mark) ?? false

const setLink = () => {
    if (!editor.value) return
    const url = window.prompt('Enter URL', editor.value.getAttributes('link').href || '')
    if (url === null) return
    if (url === '') {
        run(c => c.extendMarkRange('link').unsetLink())
        return
    }
    run(c => c.extendMarkRange('link').setLink({ href: normalizeUrl(url) }))
}
</script>

<style src="./MarkdownEditor.css"></style>
