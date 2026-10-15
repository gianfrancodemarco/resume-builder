<template>
    <div class="markdown-editor" :class="{ focused }">
        <div class="toolbar">
            <button v-for="action in ACTIONS" :key="action.name" type="button" :title="action.title"
                :aria-label="action.title" :class="{ active: isActive(action.name) }" @click="action.run()">
                <v-icon :icon="action.icon" size="18" />
            </button>
        </div>
        <EditorContent class="content" :editor="editor" />
    </div>
</template>

<script setup>
// Rich text editor whose value is Markdown, the format of JSON Resume text fields
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { Markdown } from 'tiptap-markdown'
import { ref, watch } from 'vue'
import { normalizeUrl } from '@/resume/values'

const model = defineModel({ type: String, default: '' })
const focused = ref(false)

const editor = useEditor({
    content: model.value,
    extensions: [
        // Only formatting Markdown can represent
        StarterKit.configure({ heading: false, codeBlock: false, horizontalRule: false, blockquote: false }),
        Link.configure({ openOnClick: false, autolink: false }),
        Markdown.configure({ html: false, breaks: true, transformPastedText: true }),
    ],
    onUpdate({ editor }) {
        model.value = editor.storage.markdown.getMarkdown()
    },
    onFocus: () => { focused.value = true },
    onBlur: () => { focused.value = false },
})

watch(model, value => {
    if (editor.value && value !== editor.value.storage.markdown.getMarkdown()) {
        editor.value.commands.setContent(value || '', false)
    }
})

const chain = () => editor.value.chain().focus()
const isActive = mark => editor.value?.isActive(mark) ?? false

const toggleLink = () => {
    if (!editor.value) return
    if (isActive('link')) {
        chain().extendMarkRange('link').unsetLink().run()
        return
    }
    const url = window.prompt('Link URL')
    if (url) chain().extendMarkRange('link').setLink({ href: normalizeUrl(url) }).run()
}

const ACTIONS = [
    { name: 'bold', title: 'Bold (Ctrl+B)', icon: 'ph-text-b', run: () => chain().toggleBold().run() },
    { name: 'italic', title: 'Italic (Ctrl+I)', icon: 'ph-text-italic', run: () => chain().toggleItalic().run() },
    { name: 'link', title: 'Link', icon: 'ph-link', run: toggleLink },
    { name: 'bulletList', title: 'Bullet list', icon: 'ph-list-bullets', run: () => chain().toggleBulletList().run() },
]
</script>

<style scoped>
.markdown-editor {
    border: 1px solid rgb(var(--v-theme-editor-border));
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.15s;
}

.markdown-editor.focused {
    border-color: rgb(var(--v-theme-primary));
}

.toolbar {
    display: flex;
    gap: 2px;
    padding: 4px;
    border-bottom: 1px solid rgb(var(--v-theme-editor-border));
}

.toolbar button {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    color: rgb(var(--v-theme-editor-text-secondary));
}

.toolbar button:hover {
    background: rgb(var(--v-theme-editor-item-hover));
}

.toolbar button.active {
    background: rgba(var(--v-theme-primary), 0.18);
    color: rgb(var(--v-theme-primary));
}

.content :deep(.tiptap) {
    min-height: 88px;
    padding: 10px 12px;
    outline: none;
    line-height: 1.5;
}

.content :deep(.tiptap p) {
    margin: 0 0 0.5em;
}

.content :deep(.tiptap ul),
.content :deep(.tiptap ol) {
    padding-left: 1.4em;
    margin: 0 0 0.5em;
}

.content :deep(.tiptap a) {
    color: rgb(var(--v-theme-primary));
    text-decoration: underline;
}
</style>
