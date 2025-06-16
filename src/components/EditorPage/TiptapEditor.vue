<template>
    <div>
        <div class="tiptap-toolbar">
            <button type="button" @click="toggleBold" :class="{ active: isActive('bold') }"
                title="Bold"><b>B</b></button>
            <button type="button" @click="toggleItalic" :class="{ active: isActive('italic') }"
                title="Italic"><i>I</i></button>
            <button type="button" @click="toggleStrike" :class="{ active: isActive('strike') }"
                title="Strikethrough"><s>S</s></button>
            <button type="button" @click="toggleUnderline" :class="{ active: isActive('underline') }"
                title="Underline"><u>U</u></button>
            <span class="toolbar-separator"></span>
            <button type="button" @click="addLanguageProficiency" title="Add Language Proficiency">🌐</button>
            <span class="toolbar-separator"></span>
            <select v-model="currentFont" @change="setFontFamily($event.target.value)" class="toolbar-select"
                title="Font Family">
                <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
            </select>
            <select v-model="currentFontSize" @change="setFontSize($event.target.value)" class="toolbar-select"
                title="Font Size">
                <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}</option>
            </select>
            <input type="color" v-model="currentColor" @input="setColor($event.target.value)" class="toolbar-color"
                title="Font Color" />
            <span class="toolbar-separator"></span>
            <button type="button" @click="setLink" :class="{ active: isActive('link') }"
                title="Add/Edit Link">🔗</button>
            <button type="button" @click="unsetLink" title="Remove Link">❌</button>
            <span class="toolbar-separator"></span>
            <button type="button" @click="toggleBulletList" :class="{ active: isActive('bulletList') }"
                title="Bullet List">• List</button>
            <button type="button" @click="toggleOrderedList" :class="{ active: isActive('orderedList') }"
                title="Ordered List">1. List</button>
            <span class="toolbar-separator"></span>
            <button type="button" @click="undo" title="Undo">↺</button>
            <button type="button" @click="redo" title="Redo">↻</button>
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

<style scoped>
.tiptap-toolbar {
    align-items: center;
    margin-bottom: 8px;
    background: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-radius: 6px 6px 0 0;
    padding: 4px 8px;
}

.tiptap-toolbar button {
    background: none;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    color: #333;
    transition: background 0.15s;
}

.tiptap-toolbar button.active {
    background: #1976d2;
    color: #fff;
}

.tiptap-toolbar button:hover {
    background: #e3e3e3;
}

.toolbar-separator {
    width: 1px;
    height: 20px;
    background: #e0e0e0;
    margin: 0 6px;
    display: inline-block;
}

.toolbar-select {
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 1rem;
    margin-right: 4px;
}

.toolbar-color {
    width: 28px;
    height: 28px;
    border: none;
    background: none;
    margin-right: 4px;
    cursor: pointer;
}

.tiptap-editor-content {
    border: 1px solid #e0e0e0;
    border-radius: 0 0 6px 6px;
    padding: 12px 24px;
    background: #fff;
}

[data-type="language-proficiency"] {
    position: relative;
    margin: 16px 0;
    padding: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background: #f8f8f8;
    cursor: pointer;
}

[data-type="language-proficiency"]:hover {
    background: #f0f0f0;
}

.delete-language-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #666;
    font-size: 18px;
    cursor: pointer;
    padding: 0 4px;
    border-radius: 4px;
}

.delete-language-btn:hover {
    background: #e0e0e0;
    color: #333;
}

[data-type="language-proficiency"] .language-proficiency-label {
    font-size: 0.9em;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
}

[data-type="language-proficiency"] .language-proficiency-bar {
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    max-width: 250px;
}

[data-type="language-proficiency"] .language-proficiency-bar-fill {
    height: 100%;
    background-color: #1976d2;
    border-radius: 4px;
    transition: width 0.3s ease;
}
</style>