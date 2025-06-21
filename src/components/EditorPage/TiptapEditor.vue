<template>
    <div>
        <div class="tiptap-toolbar">
            <button type="button" @click="toggleBold" :class="{ active: isActive('bold') }"
                title="Make text bold (Ctrl+B)">
                <v-icon icon="ph-text-b" size="small" />
            </button>
            <button type="button" @click="toggleItalic" :class="{ active: isActive('italic') }"
                title="Make text italic (Ctrl+I)">
                <v-icon icon="ph-text-italic" size="small" />
            </button>
            <button type="button" @click="toggleStrike" :class="{ active: isActive('strike') }"
                title="Strikethrough text">
                <v-icon icon="ph-text-strikethrough" size="small" />
            </button>
            <button type="button" @click="toggleUnderline" :class="{ active: isActive('underline') }"
                title="Underline text (Ctrl+U)">
                <v-icon icon="ph-text-underline" size="small" />
            </button>
            <span class="toolbar-separator"></span>
            <button type="button" @click="addLanguageProficiency" title="Add language proficiency bar">
                <v-icon icon="ph-globe" size="small" />
            </button>
            <span class="toolbar-separator"></span>
            <button type="button" @click="setLink" :class="{ active: isActive('link') }"
                title="Add or edit link (Ctrl+K)">
                <v-icon icon="ph-link" size="small" />
            </button>
            <button type="button" @click="unsetLink" title="Remove link">
                <v-icon icon="ph-x" size="small" />
            </button>
            <span class="toolbar-separator"></span>
            <button type="button" @click="toggleBulletList" :class="{ active: isActive('bulletList') }"
                title="Create bullet list">
                <v-icon icon="ph-list-bullets" size="small" />
            </button>
            <button type="button" @click="toggleOrderedList" :class="{ active: isActive('orderedList') }"
                title="Create numbered list">
                <v-icon icon="ph-list-numbers" size="small" />
            </button>
            <span class="toolbar-separator"></span>
            <button type="button" @click="undo" title="Undo last action (Ctrl+Z)">
                <v-icon icon="ph-arrow-counter-clockwise" size="small" />
            </button>
            <button type="button" @click="redo" title="Redo last action (Ctrl+Y)">
                <v-icon icon="ph-arrow-clockwise" size="small" />
            </button>
            <span class="toolbar-separator"></span>
            <button type="button" @click="removeList" title="Remove list formatting" class="delete-button">
                <v-icon icon="ph-text-t" size="small" />
            </button>
            <br />
            <select v-model="currentFont" @change="setFontFamily($event.target.value)" class="toolbar-select"
                title="Change font family">
                <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
            </select>
            <select v-model="currentFontSize" @change="setFontSize($event.target.value)" class="toolbar-select"
                title="Change font size">
                <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}</option>
            </select>
            <input type="color" v-model="currentColor" @input="setColor($event.target.value)" class="toolbar-color"
                title="Change text color" />
        </div>
        <EditorContent class="tiptap-editor-content" :editor="editor" />
    </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import FontSize from '@tiptap/extension-font-size'
import { Node } from '@tiptap/core'
import { ResumeStyle2ColumnsV1 } from '@/models/ResumeStyle/ResumeStyle2ColumnsV1'

const LanguageProficiency = Node.create({
    name: 'languageProficiency',
    group: 'block',
    content: 'text*',
    addAttributes() {
        return {
            name: {
                default: 'Language'
            },
            proficiency: {
                default: 50
            }
        }
    },
    parseHTML() {
        return [
            {
                tag: 'div[data-type="language-proficiency"]',
            },
        ]
    },
    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            { 'data-type': 'language-proficiency' },
            [
                'div',
                { class: 'language-proficiency-label' },
                HTMLAttributes.name
            ],
            [
                'div',
                { class: 'language-proficiency-bar' },
                [
                    'div',
                    {
                        class: 'language-proficiency-bar-fill',
                        style: `width: ${HTMLAttributes.proficiency}%`
                    }
                ]
            ]
        ]
    },
    addNodeView() {
        return ({ node, HTMLAttributes, getPos }) => {
            const dom = document.createElement('div')
            dom.setAttribute('data-type', 'language-proficiency')
            dom.textContent = `${node.attrs.name} [BAR:${node.attrs.proficiency}%]`

            return {
                dom,
                update: (newNode) => {
                    if (newNode.type !== node.type) {
                        return false
                    }
                    dom.textContent = `${newNode.attrs.name} [BAR:${newNode.attrs.proficiency}%]`
                    dom.appendChild(deleteBtn)
                    return true
                }
            }
        }
    }
})

const fonts = ResumeStyle2ColumnsV1.FONT_OPTIONS
const fontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px']
const currentFont = ref(fonts[0])
const currentColor = ref('#222222')
const currentFontSize = ref('16px')

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})
const emit = defineEmits(['update:modelValue'])

const editor = ref(null)

editor.value = new Editor({
    content: props.modelValue,
    extensions: [
        StarterKit,
        Underline,
        TextStyle,
        Color,
        FontFamily,
        FontSize,
        Link.configure({ openOnClick: true, autolink: false }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        LanguageProficiency,
    ],
    onUpdate({ editor }) {
        emit('update:modelValue', editor.getHTML())
    }
})

watch(
    () => props.modelValue,
    (newValue) => {
        if (editor.value && newValue !== editor.value.getHTML()) {
            editor.value.commands.setContent(newValue || '', false)
        }
    }
)

onBeforeUnmount(() => {
    if (editor.value) {
        editor.value.destroy()
    }
})

// Toolbar command methods
const toggleBold = () => editor.value && editor.value.chain().focus().toggleBold().run()
const toggleItalic = () => editor.value && editor.value.chain().focus().toggleItalic().run()
const toggleStrike = () => editor.value && editor.value.chain().focus().toggleStrike().run()
const toggleUnderline = () => editor.value && editor.value.chain().focus().toggleUnderline().run()
const toggleBulletList = () => editor.value && editor.value.chain().focus().toggleBulletList().run()
const toggleOrderedList = () => editor.value && editor.value.chain().focus().toggleOrderedList().run()
const removeList = () => {
    if (!editor.value) return

    // Check if we're in a list and remove it properly
    if (editor.value.isActive('bulletList')) {
        editor.value.chain().focus().toggleBulletList().run()
    } else if (editor.value.isActive('orderedList')) {
        editor.value.chain().focus().toggleOrderedList().run()
    }
}
const undo = () => editor.value && editor.value.chain().focus().undo().run()
const redo = () => editor.value && editor.value.chain().focus().redo().run()
const isActive = (format) => editor.value && editor.value.isActive(format)

const setFontFamily = (font) => {
    currentFont.value = font
    editor.value && editor.value.chain().focus().setFontFamily(font).run()
}
const setColor = (color) => {
    currentColor.value = color
    editor.value && editor.value.chain().focus().setColor(color).run()
}
const setLink = () => {
    if (!editor.value) return
    const previousUrl = editor.value.getAttributes('link').href || ''
    const url = window.prompt('Enter URL', previousUrl)
    if (url === null) return
    if (url === '') {
        editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
        return
    }
    editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}
const unsetLink = () => {
    editor.value && editor.value.chain().focus().unsetLink().run()
}

const setTextAlign = (align) => {
    editor.value && editor.value.chain().focus().setTextAlign(align).run()
}

const addSpace = () => {
    editor.value && editor.value.chain().focus().insertContent(' ').run()
}

const setFontSize = (size) => {
    currentFontSize.value = size
    editor.value && editor.value.chain().focus().setFontSize(size).run()
}

const addLanguageProficiency = () => {
    if (!editor.value) return
    editor.value.chain().focus().insertContent('(Skill)[BAR:50]\n').run()
}
</script>

<style src="./TiptapEditor.css"></style>