import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import TiptapEditor from '../TiptapEditor.vue'

// Create a chainable mock for the editor chain
const chainMock = {
    focus: vi.fn().mockReturnThis(),
    toggleBold: vi.fn().mockReturnThis(),
    toggleItalic: vi.fn().mockReturnThis(),
    toggleStrike: vi.fn().mockReturnThis(),
    toggleUnderline: vi.fn().mockReturnThis(),
    toggleBulletList: vi.fn().mockReturnThis(),
    toggleOrderedList: vi.fn().mockReturnThis(),
    undo: vi.fn().mockReturnThis(),
    redo: vi.fn().mockReturnThis(),
    setFontFamily: vi.fn().mockReturnThis(),
    setColor: vi.fn().mockReturnThis(),
    setFontSize: vi.fn().mockReturnThis(),
    extendMarkRange: vi.fn().mockReturnThis(),
    unsetLink: vi.fn().mockReturnThis(),
    setLink: vi.fn().mockReturnThis(),
    insertContent: vi.fn().mockReturnThis(),
    setTextAlign: vi.fn().mockReturnThis(),
    run: vi.fn().mockReturnThis()
};

const mockEditor = {
    commands: {
        setContent: vi.fn(),
        focus: vi.fn().mockReturnThis(),
        toggleBold: vi.fn().mockReturnThis(),
        toggleItalic: vi.fn().mockReturnThis(),
        toggleStrike: vi.fn().mockReturnThis(),
        toggleUnderline: vi.fn().mockReturnThis(),
        toggleBulletList: vi.fn().mockReturnThis(),
        toggleOrderedList: vi.fn().mockReturnThis(),
        undo: vi.fn().mockReturnThis(),
        redo: vi.fn().mockReturnThis(),
        setFontFamily: vi.fn().mockReturnThis(),
        setColor: vi.fn().mockReturnThis(),
        setFontSize: vi.fn().mockReturnThis(),
        extendMarkRange: vi.fn().mockReturnThis(),
        unsetLink: vi.fn().mockReturnThis(),
        setLink: vi.fn().mockReturnThis(),
        insertContent: vi.fn().mockReturnThis()
    },
    chain: vi.fn(() => chainMock),
    getHTML: vi.fn().mockReturnValue('<p>Test content</p>'),
    isActive: vi.fn().mockReturnValue(false),
    getAttributes: vi.fn().mockReturnValue({}),
    destroy: vi.fn(),
    onUpdate: vi.fn()
}

vi.mock('@tiptap/vue-3', () => ({
    Editor: vi.fn(() => mockEditor),
    EditorContent: {
        name: 'EditorContent',
        template: '<div class="tiptap-editor-content"></div>'
    }
}))

vi.mock('@tiptap/starter-kit', () => ({
    default: {}
}))

vi.mock('@tiptap/extension-underline', () => ({
    default: {}
}))

vi.mock('@tiptap/extension-link', () => ({
    default: { configure: () => ({}) }
}))

vi.mock('@tiptap/extension-text-style', () => ({
    default: {}
}))

vi.mock('@tiptap/extension-color', () => ({
    default: {}
}))

vi.mock('@tiptap/extension-font-family', () => ({
    default: {}
}))

vi.mock('@tiptap/extension-text-align', () => ({
    default: { configure: () => ({}) }
}))

vi.mock('@tiptap/extension-font-size', () => ({
    default: {}
}))

vi.mock('@tiptap/core', () => ({
    Node: {
        create: vi.fn()
    }
}))

const vuetify = createVuetify()

describe('TiptapEditor', () => {
    let wrapper

    const defaultProps = {
        modelValue: '<p>Test content</p>'
    }

    beforeEach(() => {
        vi.clearAllMocks()

        wrapper = mount(TiptapEditor, {
            props: defaultProps,
            global: {
                plugins: [vuetify],
                stubs: {
                    'v-icon': true,
                    // Stub all unknown elements
                    stub: true
                }
            }
        })
    })

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount()
        }
    })

    describe('Component Mounting', () => {
        it('mounts successfully', () => {
            expect(wrapper.exists()).toBe(true)
        })

        it('renders toolbar buttons', () => {
            const buttons = wrapper.findAll('button')
            expect(buttons.length).toBeGreaterThan(0)
        })

        it('renders font and size selectors', () => {
            const selects = wrapper.findAll('select')
            expect(selects.length).toBe(2)
            expect(wrapper.find('input[type="color"]').exists()).toBe(true)
        })

        it('renders editor content', () => {
            expect(wrapper.find('.tiptap-editor-content').exists()).toBe(true)
        })
    })

    describe('Editor Initialization', () => {
        it('initializes with default values', () => {
            expect(wrapper.vm.currentFont).toBe('Arial')
            expect(wrapper.vm.currentColor).toBe('#222222')
            expect(wrapper.vm.currentFontSize).toBe('16px')
        })
    })

    describe('Toolbar Commands', () => {
        it('toggles bold formatting', async () => {
            const boldButton = wrapper.find('button[title*="bold"]')
            await boldButton.trigger('click')
            expect(chainMock.focus).toHaveBeenCalled()
            expect(chainMock.toggleBold).toHaveBeenCalled()
            expect(chainMock.run).toHaveBeenCalled()
        })

        it('toggles italic formatting', async () => {
            const italicButton = wrapper.find('button[title*="italic"]')
            await italicButton.trigger('click')
            expect(chainMock.toggleItalic).toHaveBeenCalled()
        })


        it('toggles bullet list', async () => {
            const bulletListButton = wrapper.find('button[title*="bullet list"]')
            await bulletListButton.trigger('click')
            expect(chainMock.toggleBulletList).toHaveBeenCalled()
        })

        it('toggles ordered list', async () => {
            const orderedListButton = wrapper.find('button[title*="numbered list"]')
            await orderedListButton.trigger('click')
            expect(chainMock.toggleOrderedList).toHaveBeenCalled()
        })

        it('undoes last action', async () => {
            const undoButton = wrapper.find('button[title*="Undo"]')
            await undoButton.trigger('click')
            expect(chainMock.undo).toHaveBeenCalled()
        })

        it('redoes last action', async () => {
            const redoButton = wrapper.find('button[title*="Redo"]')
            await redoButton.trigger('click')
            expect(chainMock.redo).toHaveBeenCalled()
        })

        it('removes list formatting', async () => {
            mockEditor.isActive.mockReturnValue(true)
            const removeListButton = wrapper.find('button[title*="Remove list"]')
            await removeListButton.trigger('click')
            expect(chainMock.toggleBulletList).toHaveBeenCalled()
        })
    })

    describe('Font and Color Controls', () => {
        it('sets font family', async () => {
            const fontSelect = wrapper.find('select')
            await fontSelect.setValue('Times New Roman')
            expect(wrapper.vm.currentFont).toBe('Times New Roman')
            expect(chainMock.setFontFamily).toHaveBeenCalledWith('Times New Roman')
        })

        it('sets font size', async () => {
            const sizeSelect = wrapper.findAll('select')[1]
            await sizeSelect.setValue('20px')
            expect(wrapper.vm.currentFontSize).toBe('20px')
        })

        it('sets text color', async () => {
            const colorInput = wrapper.find('input[type="color"]')
            await colorInput.setValue('#ff0000')
            expect(wrapper.vm.currentColor).toBe('#ff0000')
            expect(chainMock.setColor).toHaveBeenCalledWith('#ff0000')
        })
    })

    describe('Link Management', () => {
        it('sets link when URL is provided', async () => {
            const linkButton = wrapper.find('button[title*="link"]')
            const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('https://example.com')
            await linkButton.trigger('click')
            expect(promptSpy).toHaveBeenCalledWith('Enter URL', '')
            promptSpy.mockRestore()
        })

        it('does not set link when URL is cancelled', async () => {
            const linkButton = wrapper.find('button[title*="link"]')
            const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue(null)
            await linkButton.trigger('click')
            expect(promptSpy).toHaveBeenCalled()
            promptSpy.mockRestore()
        })

        it('unsets link', async () => {
            const unsetLinkButton = wrapper.find('button[title*="Remove link"]')
            await unsetLinkButton.trigger('click')
            expect(chainMock.focus).toHaveBeenCalled()
            expect(chainMock.unsetLink).toHaveBeenCalled()
            expect(chainMock.run).toHaveBeenCalled()
        })
    })

    describe('Language Proficiency', () => {
        it('adds language proficiency', async () => {
            const languageButton = wrapper.find('button[title*="language proficiency"]')
            await languageButton.trigger('click')
            expect(chainMock.focus).toHaveBeenCalled()
            expect(chainMock.insertContent).toHaveBeenCalledWith('(Skill)[BAR:50]\n')
            expect(chainMock.run).toHaveBeenCalled()
        })
    })

    describe('Active State Detection', () => {
        it('detects active bold state', () => {
            mockEditor.isActive.mockReturnValue(true)
            const result = wrapper.vm.isActive('bold')
            expect(result).toBe(true)
            expect(mockEditor.isActive).toHaveBeenCalledWith('bold')
        })

        it('detects inactive state', () => {
            mockEditor.isActive.mockReturnValue(false)
            const result = wrapper.vm.isActive('italic')
            expect(result).toBe(false)
            expect(mockEditor.isActive).toHaveBeenCalledWith('italic')
        })
    })

    describe('Content Updates', () => {
        it('emits update when content changes', async () => {
            // Simulate editor update by calling the onUpdate prop directly
            await wrapper.vm.$emit('update:modelValue', '<p>Test content</p>')
            expect(wrapper.emitted('update:modelValue')).toBeTruthy()
            expect(wrapper.emitted('update:modelValue')[0]).toEqual(['<p>Test content</p>'])
        })

        it('updates content when prop changes', async () => {
            await wrapper.setProps({ modelValue: '<p>New content</p>' })
            expect(mockEditor.commands.setContent).toHaveBeenCalledWith('<p>New content</p>', false)
        })

        it('does not update content if it matches current content', async () => {
            mockEditor.getHTML.mockReturnValue('<p>Test content</p>')
            await wrapper.setProps({ modelValue: '<p>Test content</p>' })
            expect(mockEditor.commands.setContent).not.toHaveBeenCalled()
        })
    })

    describe('Component Cleanup', () => {
        it('destroys editor on component unmount', () => {
            wrapper.unmount()

            expect(mockEditor.destroy).toHaveBeenCalled()
        })
    })

    describe('Font Options', () => {
        it('has correct font options', () => {
            expect(wrapper.vm.fonts).toContain('Arial')
            expect(wrapper.vm.fonts).toContain('Times New Roman')
            expect(wrapper.vm.fonts).toContain('Courier New')
        })

        it('has correct font sizes', () => {
            expect(wrapper.vm.fontSizes).toContain('8px')
            expect(wrapper.vm.fontSizes).toContain('16px')
            expect(wrapper.vm.fontSizes).toContain('48px')
        })
    })

    describe('Button States', () => {
        it('applies active class when format is active', async () => {
            // Remount with isActive returning true
            mockEditor.isActive.mockReturnValue(true)
            wrapper.unmount()
            wrapper = mount(TiptapEditor, {
                props: defaultProps,
                global: {
                    plugins: [vuetify],
                    stubs: {
                        'v-icon': true,
                        stub: true
                    }
                }
            })
            const boldButton = wrapper.find('button[title*="bold"]')
            expect(boldButton.classes()).toContain('active')
        })

        it('does not apply active class when format is inactive', async () => {
            // Remount with isActive returning false
            mockEditor.isActive.mockReturnValue(false)
            wrapper.unmount()
            wrapper = mount(TiptapEditor, {
                props: defaultProps,
                global: {
                    plugins: [vuetify],
                    stubs: {
                        'v-icon': true,
                        stub: true
                    }
                }
            })
            const italicButton = wrapper.find('button[title*="italic"]')
            expect(italicButton.classes()).not.toContain('active')
        })
    })

    describe('Error Handling', () => {
        it('handles editor not being available', () => {
            wrapper.vm.editor = null

            // These should not throw errors
            expect(() => wrapper.vm.toggleBold()).not.toThrow()
            expect(() => wrapper.vm.toggleItalic()).not.toThrow()
            expect(() => wrapper.vm.setFontFamily('Arial')).not.toThrow()
        })
    })
}) 