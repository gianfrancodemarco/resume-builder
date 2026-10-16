import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { ResumeService } from '@/services/ResumeService'
import { ExporterService } from '@/services/ExporterService'
import { prepareResume, sampleResume, settingsOf } from '@/resume/resume'
import EditorPage from '@/views/EditorPage.vue'

// Shared state for the vue-router and vuetify mocks below
const mocks = vi.hoisted(() => ({
    push: null,
    display: { mobile: null },
}))

vi.mock('vue-router', () => ({
    useRouter: () => ({ push: mocks.push }),
}))

// Keep the real Vuetify, but let each test choose between mobile and desktop
vi.mock('vuetify', async importOriginal => ({
    ...(await importOriginal()),
    useDisplay: () => ({ mobile: mocks.display.mobile }),
}))

// Child component stubs. They use render functions: the test build of Vue has no template compiler.
// Hoisted so the vi.mock factories below can use it.
const { stub } = vi.hoisted(() => ({
    stub: (name, cls, { props = ['resume'], emits = [] } = {}) => async () => {
        const { h } = await import('vue')
        return {
            default: {
                name,
                props,
                emits,
                render: () => h('div', { class: cls }, name),
            },
        }
    },
}))

vi.mock('@/components/EditorPage/TopBar.vue', stub('TopBar', 'top-bar-stub', {
    props: ['resume', 'saved', 'downloading', 'downloaded', 'compact'],
    emits: ['home', 'download-pdf', 'import', 'export-json', 'export-txt'],
}))
vi.mock('@/components/EditorPage/PreviewPane.vue', stub('PreviewPane', 'preview-pane-stub'))
vi.mock('@/components/EditorPage/content/ContentPanel.vue', stub('ContentPanel', 'content-panel-stub'))
vi.mock('@/components/EditorPage/design/DesignPanel.vue', stub('DesignPanel', 'design-panel-stub'))
vi.mock('@/components/EditorPage/ai/AIPanel.vue', stub('AIPanel', 'ai-panel-stub', { emits: ['update:resume'] }))

const isShown = wrapper => wrapper.exists() && wrapper.element.style.display !== 'none'

describe('EditorPage', () => {
    let wrapper
    let vuetify

    const mountPage = () => {
        wrapper = mount(EditorPage, {
            global: { plugins: [vuetify] },
            attachTo: document.body,
        })
        return wrapper
    }

    const topBar = () => wrapper.findComponent({ name: 'TopBar' })
    const snackbar = () => wrapper.findComponent({ name: 'VSnackbar' })
    const fileInput = () => wrapper.find('input[type="file"]')

    beforeEach(() => {
        localStorage.clear()
        vi.useFakeTimers()

        // jsdom has no ResizeObserver, which Vuetify's components use
        vi.stubGlobal('ResizeObserver', class {
            observe() { }
            unobserve() { }
            disconnect() { }
        })

        // Nor visualViewport, which positions the snackbar overlay
        vi.stubGlobal('visualViewport', Object.assign(new EventTarget(), { width: 1024, height: 768, scale: 1 }))

        mocks.push = vi.fn()
        mocks.display.mobile = ref(false)
        window.sa_event = vi.fn()

        vuetify = createVuetify({ components, directives })

        vi.spyOn(ResumeService, 'store').mockImplementation(() => { })
        vi.spyOn(ResumeService, 'exportToJSON').mockImplementation(() => new Blob(['test']))
        vi.spyOn(ResumeService, 'loadFromFile').mockImplementation(() => Promise.resolve(
            prepareResume({ basics: { name: 'Test User' } })
        ))
        vi.spyOn(ExporterService, 'getFilename').mockImplementation(() => 'test.json')
        vi.spyOn(ExporterService, 'download').mockImplementation(() => { })
        vi.spyOn(ExporterService, 'exportToPDF').mockImplementation(() => Promise.resolve())
        vi.spyOn(ExporterService, 'exportToTXT').mockImplementation(() => Promise.resolve())
    })

    afterEach(() => {
        wrapper?.unmount()
        wrapper = null
        localStorage.clear()
        delete window.sa_event
        vi.useRealTimers()
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
    })

    describe('mounting', () => {
        it('loads the sample resume when nothing is stored', () => {
            mountPage()
            expect(wrapper.vm.resume).toEqual(sampleResume())
        })

        it('loads the stored resume', () => {
            const stored = prepareResume({ basics: { name: 'Luke Skywalker', label: 'Jedi Knight' } })
            settingsOf(stored).design.layout = 'classic'
            localStorage.setItem('resume', JSON.stringify(stored))

            mountPage()

            expect(wrapper.vm.resume.basics.name).toBe('Luke Skywalker')
            expect(settingsOf(wrapper.vm.resume).design.layout).toBe('classic')
        })

        it('passes the resume and initial state to the top bar and preview', () => {
            mountPage()
            const resume = wrapper.vm.resume

            expect(topBar().props()).toEqual({ resume, saved: true, downloading: false, downloaded: false, compact: false })
            expect(wrapper.findComponent({ name: 'PreviewPane' }).props('resume')).toStrictEqual(resume)
            expect(wrapper.findComponent({ name: 'ContentPanel' }).props('resume')).toStrictEqual(resume)
        })

        it('starts on the content panel with no toast and no AI panel', () => {
            mountPage()

            expect(isShown(wrapper.findComponent({ name: 'ContentPanel' }))).toBe(true)
            expect(wrapper.findComponent({ name: 'DesignPanel' }).exists()).toBe(false)
            expect(wrapper.findComponent({ name: 'AIPanel' }).exists()).toBe(false)
            expect(snackbar().props('modelValue')).toBe(false)
        })
    })

    describe('autosave', () => {
        it('stores the resume every second', () => {
            mountPage()
            expect(ResumeService.store).not.toHaveBeenCalled()

            vi.advanceTimersByTime(1000)
            expect(ResumeService.store).toHaveBeenCalledTimes(1)
            expect(ResumeService.store).toHaveBeenCalledWith(wrapper.vm.resume)

            vi.advanceTimersByTime(2000)
            expect(ResumeService.store).toHaveBeenCalledTimes(3)
        })

        it('saves once more on unmount, then stops autosaving', () => {
            mountPage()
            wrapper.unmount()
            wrapper = null
            expect(ResumeService.store).toHaveBeenCalledTimes(1)

            vi.advanceTimersByTime(5000)
            expect(ResumeService.store).toHaveBeenCalledTimes(1)
        })

        it('saves when the tab is closed', () => {
            mountPage()
            window.dispatchEvent(new Event('beforeunload'))
            expect(ResumeService.store).toHaveBeenCalledTimes(1)
        })

        it('marks the resume unsaved and warns once when storage fails', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
            ResumeService.store.mockImplementation(() => { throw new Error('QuotaExceededError') })
            mountPage()

            vi.advanceTimersByTime(1000)
            await nextTick()

            expect(topBar().props('saved')).toBe(false)
            expect(wrapper.vm.toast).toMatchObject({ show: true, title: 'Autosave failed', type: 'error' })
            expect(snackbar().props('modelValue')).toBe(true)

            // Dismiss the toast: later failures must not show it again
            wrapper.vm.toast.show = false
            vi.advanceTimersByTime(3000)
            await nextTick()

            expect(wrapper.vm.toast.show).toBe(false)
            expect(consoleSpy).toHaveBeenCalledTimes(1)
        })

        it('marks the resume saved again once storing succeeds', async () => {
            vi.spyOn(console, 'error').mockImplementation(() => { })
            ResumeService.store.mockImplementationOnce(() => { throw new Error('full') })
            mountPage()

            vi.advanceTimersByTime(1000)
            await nextTick()
            expect(topBar().props('saved')).toBe(false)

            vi.advanceTimersByTime(1000)
            await nextTick()
            expect(topBar().props('saved')).toBe(true)
        })
    })

    describe('top bar actions', () => {
        beforeEach(() => mountPage())

        it('navigates home', () => {
            topBar().vm.$emit('home')
            expect(mocks.push).toHaveBeenCalledWith('/')
        })

        it('downloads the PDF, showing the downloading state while it runs', async () => {
            let finish
            ExporterService.exportToPDF.mockImplementation(() => new Promise(resolve => { finish = resolve }))

            topBar().vm.$emit('download-pdf')
            await nextTick()

            expect(ExporterService.exportToPDF).toHaveBeenCalledWith(wrapper.vm.resume)
            expect(window.sa_event).toHaveBeenCalledWith('download_pdf')
            expect(topBar().props('downloading')).toBe(true)

            finish()
            await flushPromises()

            expect(topBar().props('downloading')).toBe(false)
            // No toast on success
            expect(wrapper.vm.toast.show).toBe(false)
        })

        it('downloads the PDF on Ctrl+P or Cmd+P keyboard shortcut and prevents default', async () => {
            let finish
            ExporterService.exportToPDF.mockImplementation(() => new Promise(resolve => { finish = resolve }))

            const event = new KeyboardEvent('keydown', {
                key: 'p',
                ctrlKey: true,
                bubbles: true,
                cancelable: true,
            })
            const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

            window.dispatchEvent(event)
            await nextTick()

            expect(preventDefaultSpy).toHaveBeenCalled()
            expect(ExporterService.exportToPDF).toHaveBeenCalledWith(wrapper.vm.resume)
            expect(topBar().props('downloading')).toBe(true)

            finish()
            await flushPromises()
            expect(topBar().props('downloading')).toBe(false)
        })

        it('downloads the PDF on Cmd+P on macOS', async () => {
            const event = new KeyboardEvent('keydown', {
                key: 'p',
                metaKey: true,
                bubbles: true,
                cancelable: true,
            })
            const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

            window.dispatchEvent(event)
            await flushPromises()

            expect(preventDefaultSpy).toHaveBeenCalled()
            expect(ExporterService.exportToPDF).toHaveBeenCalledWith(wrapper.vm.resume)
        })

        it('does not trigger another download if already downloading when Ctrl+P is pressed', async () => {
            let finish
            ExporterService.exportToPDF.mockImplementation(() => new Promise(resolve => { finish = resolve }))

            topBar().vm.$emit('download-pdf')
            await nextTick()
            expect(ExporterService.exportToPDF).toHaveBeenCalledTimes(1)

            const event = new KeyboardEvent('keydown', {
                key: 'p',
                ctrlKey: true,
                bubbles: true,
                cancelable: true,
            })
            const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

            window.dispatchEvent(event)
            await nextTick()

            expect(preventDefaultSpy).toHaveBeenCalled()
            expect(ExporterService.exportToPDF).toHaveBeenCalledTimes(1)

            finish()
            await flushPromises()
        })

        it('stops listening to keyboard shortcut after unmount', () => {
            wrapper.unmount()
            wrapper = null

            const event = new KeyboardEvent('keydown', {
                key: 'p',
                ctrlKey: true,
                bubbles: true,
                cancelable: true,
            })
            const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

            window.dispatchEvent(event)

            expect(preventDefaultSpy).not.toHaveBeenCalled()
            expect(ExporterService.exportToPDF).not.toHaveBeenCalled()
        })

        it('shows an error toast when the PDF fails', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
            ExporterService.exportToPDF.mockRejectedValue(new Error('boom'))

            topBar().vm.$emit('download-pdf')
            await flushPromises()

            expect(consoleSpy).toHaveBeenCalledWith('Error generating PDF:', expect.any(Error))
            expect(wrapper.vm.toast).toMatchObject({ show: true, title: 'PDF generation failed', type: 'error' })
            expect(topBar().props('downloading')).toBe(false)
        })

        it('exports the resume as JSON', () => {
            topBar().vm.$emit('export-json')

            expect(ResumeService.exportToJSON).toHaveBeenCalledWith(wrapper.vm.resume)
            expect(ExporterService.getFilename).toHaveBeenCalledWith(wrapper.vm.resume, 'json')
            expect(ExporterService.download).toHaveBeenCalledWith(expect.any(Blob), 'test.json')
            expect(window.sa_event).toHaveBeenCalledWith('export_json')
            expect(wrapper.vm.toast.show).toBe(false)
        })

        it('shows an error toast when the JSON export fails', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
            ResumeService.exportToJSON.mockImplementation(() => { throw new Error('nope') })

            topBar().vm.$emit('export-json')

            expect(consoleSpy).toHaveBeenCalledWith('Error exporting JSON:', expect.any(Error))
            expect(ExporterService.download).not.toHaveBeenCalled()
            expect(wrapper.vm.toast).toMatchObject({ show: true, title: 'Export failed', type: 'error' })
        })

        it('exports the resume as text', async () => {
            topBar().vm.$emit('export-txt')
            await flushPromises()

            expect(ExporterService.exportToTXT).toHaveBeenCalledWith(wrapper.vm.resume)
            expect(window.sa_event).toHaveBeenCalledWith('download_txt')
            expect(wrapper.vm.toast.show).toBe(false)
        })

        it('shows an error toast when the text export fails', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
            ExporterService.exportToTXT.mockRejectedValue(new Error('nope'))

            topBar().vm.$emit('export-txt')
            await flushPromises()

            expect(consoleSpy).toHaveBeenCalledWith('Error generating TXT:', expect.any(Error))
            expect(wrapper.vm.toast).toMatchObject({ show: true, title: 'Export failed', type: 'error' })
        })

        it('opens the file picker on import', () => {
            const clickSpy = vi.spyOn(fileInput().element, 'click').mockImplementation(() => { })

            topBar().vm.$emit('import')

            expect(clickSpy).toHaveBeenCalled()
            expect(window.sa_event).toHaveBeenCalledWith('import_json')
        })
    })

    describe('importing a file', () => {
        beforeEach(() => mountPage())

        it('replaces the resume, shows a success toast and resets the input', async () => {
            const file = new File(['{}'], 'luke.json', { type: 'application/json' })
            const event = { target: { files: [file], value: 'C:\\fakepath\\luke.json' } }

            await wrapper.vm.handleFileUpload(event)
            await nextTick()

            expect(ResumeService.loadFromFile).toHaveBeenCalledWith(file)
            expect(wrapper.vm.resume.basics.name).toBe('Test User')
            expect(topBar().props('resume').basics.name).toBe('Test User')
            expect(wrapper.vm.toast).toMatchObject({ show: true, title: 'Resume imported', message: 'luke.json', type: 'success' })
            expect(event.target.value).toBe('')
        })

        it('keeps the resume, shows an error toast and resets the input on failure', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
            ResumeService.loadFromFile.mockRejectedValue(new Error('The file is not valid JSON.'))
            const before = wrapper.vm.resume
            const event = { target: { files: [new File(['x'], 'bad.json')], value: 'bad.json' } }

            await wrapper.vm.handleFileUpload(event)

            expect(consoleSpy).toHaveBeenCalledWith('Error importing file:', expect.any(Error))
            expect(wrapper.vm.resume).toStrictEqual(before)
            expect(wrapper.vm.toast).toMatchObject({
                show: true, title: 'Import failed', message: 'The file is not valid JSON.', type: 'error',
            })
            expect(event.target.value).toBe('')
        })

        it('falls back to a generic message when the error has none', async () => {
            vi.spyOn(console, 'error').mockImplementation(() => { })
            ResumeService.loadFromFile.mockRejectedValue(new Error(''))

            await wrapper.vm.handleFileUpload({ target: { files: [new File(['x'], 'bad.json')], value: '' } })

            expect(wrapper.vm.toast.message).toBe('Failed to import resume.')
        })

        it('does nothing but reset the input when no file is selected', async () => {
            const event = { target: { files: [], value: 'x' } }

            await wrapper.vm.handleFileUpload(event)

            expect(ResumeService.loadFromFile).not.toHaveBeenCalled()
            expect(wrapper.vm.toast.show).toBe(false)
            expect(event.target.value).toBe('')
        })

        it('handles the change event of the hidden file input', async () => {
            const file = new File(['{}'], 'luke.json', { type: 'application/json' })
            Object.defineProperty(fileInput().element, 'files', { value: [file], configurable: true })

            await fileInput().trigger('change')
            await flushPromises()

            expect(ResumeService.loadFromFile).toHaveBeenCalledWith(file)
            expect(wrapper.vm.resume.basics.name).toBe('Test User')
        })
    })

    describe('desktop tabs', () => {
        beforeEach(() => mountPage())

        const tabs = () => wrapper.findAllComponents({ name: 'VTab' })
        const selectTab = async index => {
            await tabs()[index].trigger('click')
            await nextTick()
        }

        it('shows the Content, Design and AI tabs and no bottom nav', () => {
            expect(tabs().map(tab => tab.text())).toEqual(['Content', 'Design', 'AI'])
            expect(wrapper.find('.bottom-nav').exists()).toBe(false)
            expect(isShown(wrapper.find('.editor-panel'))).toBe(true)
            expect(isShown(wrapper.findComponent({ name: 'PreviewPane' }))).toBe(true)
        })

        it('switches to the design panel', async () => {
            await selectTab(1)

            const design = wrapper.findComponent({ name: 'DesignPanel' })
            expect(design.exists()).toBe(true)
            expect(design.props('resume')).toStrictEqual(wrapper.vm.resume)
            expect(isShown(wrapper.findComponent({ name: 'ContentPanel' }))).toBe(false)
        })

        it('mounts the AI panel on first visit and keeps it afterwards', async () => {
            expect(wrapper.findComponent({ name: 'AIPanel' }).exists()).toBe(false)

            await selectTab(2)
            expect(isShown(wrapper.findComponent({ name: 'AIPanel' }))).toBe(true)

            await selectTab(0)
            const ai = wrapper.findComponent({ name: 'AIPanel' })
            expect(ai.exists()).toBe(true)
            expect(isShown(ai)).toBe(false)
            expect(isShown(wrapper.findComponent({ name: 'ContentPanel' }))).toBe(true)
            expect(wrapper.findComponent({ name: 'DesignPanel' }).exists()).toBe(false)
        })

        it('replaces the resume when the AI panel updates it', async () => {
            await selectTab(2)
            const updated = prepareResume({ basics: { name: 'AI User' } })

            wrapper.findComponent({ name: 'AIPanel' }).vm.$emit('update:resume', updated)
            await nextTick()

            expect(wrapper.vm.resume).toStrictEqual(updated)
            expect(topBar().props('resume')).toStrictEqual(updated)
            expect(wrapper.findComponent({ name: 'PreviewPane' }).props('resume')).toStrictEqual(updated)
        })
    })

    describe('mobile navigation', () => {
        beforeEach(() => {
            mocks.display.mobile.value = true
            mountPage()
        })

        const navButtons = () => wrapper.findAll('.bottom-nav button')
        const press = async label => {
            await navButtons().find(button => button.text() === label).trigger('click')
            await nextTick()
        }

        it('shows the bottom nav instead of tabs, in compact mode', () => {
            expect(navButtons().map(button => button.text())).toEqual(['Content', 'Design', 'AI', 'Preview'])
            expect(wrapper.findComponent({ name: 'VTabs' }).exists()).toBe(false)
            expect(topBar().props('compact')).toBe(true)
            expect(navButtons()[0].classes()).toContain('active')
        })

        it('hides the preview until it is selected', () => {
            expect(isShown(wrapper.find('.editor-panel'))).toBe(true)
            expect(isShown(wrapper.findComponent({ name: 'PreviewPane' }))).toBe(false)
        })

        it('shows the preview and hides the panel', async () => {
            await press('Preview')

            expect(isShown(wrapper.findComponent({ name: 'PreviewPane' }))).toBe(true)
            expect(isShown(wrapper.find('.editor-panel'))).toBe(false)
            expect(navButtons()[3].classes()).toContain('active')
        })

        it('returns to the last panel after the preview', async () => {
            await press('Design')
            await press('Preview')

            // The design panel stays mounted behind the preview
            expect(wrapper.findComponent({ name: 'DesignPanel' }).exists()).toBe(true)

            await press('Design')
            expect(isShown(wrapper.find('.editor-panel'))).toBe(true)
            expect(isShown(wrapper.findComponent({ name: 'PreviewPane' }))).toBe(false)
            expect(wrapper.findComponent({ name: 'DesignPanel' }).exists()).toBe(true)
        })

        it('mounts the AI panel when AI is selected', async () => {
            await press('AI')

            expect(isShown(wrapper.findComponent({ name: 'AIPanel' }))).toBe(true)
            expect(isShown(wrapper.findComponent({ name: 'ContentPanel' }))).toBe(false)
        })
    })
})
