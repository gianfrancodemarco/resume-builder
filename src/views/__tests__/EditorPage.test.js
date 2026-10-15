import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { ResumeService } from '@/services/ResumeService'
import { ExporterService } from '@/services/ExporterService'
import { prepareResume, sampleResume, settingsOf } from '@/resume/resume'
import EditorPage from '@/views/EditorPage.vue'

// Mock child components to focus on EditorPage logic.
// They use render functions: the test build of Vue has no template compiler.
vi.mock('@/components/EditorPage/LateralMenu.vue', async () => {
    const { h } = await import('vue')
    return {
        default: {
            name: 'LateralMenu',
            render: () => h('div', { class: 'lateral-menu-mock' }, 'LateralMenu Mock'),
            props: ['activeTab', 'sections'],
            emits: ['update:activeTab', 'scroll-to-section']
        }
    }
})

vi.mock('@/components/EditorPage/ResumeEditor.vue', async () => {
    const { h } = await import('vue')
    return {
        default: {
            name: 'ResumeEditor',
            render: () => h('div', { class: 'resume-editor-mock' }, 'ResumeEditor Mock'),
            props: ['resume', 'isMobile', 'activeTab'],
            emits: ['update:resume', 'update:activeTab']
        }
    }
})

vi.mock('@/components/EditorPage/ResumePreview.vue', async () => {
    const { h } = await import('vue')
    return {
        default: {
            name: 'ResumePreview',
            render: () => h('div', { class: 'resume-preview-mock' }, 'ResumePreview Mock'),
            props: ['resume']
        }
    }
})

describe('EditorPage', () => {
    let wrapper
    let router
    let vuetify

    // Mounts the page; child components are replaced by the mocks above
    const mountPage = () => mount(EditorPage, {
        global: {
            plugins: [router, vuetify]
        }
    })

    beforeEach(() => {
        localStorage.clear()

        // jsdom has no ResizeObserver, which Vuetify's layout components use
        vi.stubGlobal('ResizeObserver', class {
            observe() { }
            unobserve() { }
            disconnect() { }
        })

        // Create a fresh Vuetify instance for each test
        vuetify = createVuetify({
            components,
            directives,
            icons: {
                defaultSet: 'mdi',
                aliases,
                sets: { mdi }
            }
        })

        // Create router instance with a default route
        router = createRouter({
            history: createWebHistory('/'),
            routes: [
                {
                    path: '/',
                    name: 'home',
                    component: { template: '<div>Home</div>' }
                }
            ]
        })

        // Mock window.URL.createObjectURL and revokeObjectURL
        window.URL.createObjectURL = vi.fn(() => 'blob:test')
        window.URL.revokeObjectURL = vi.fn()

        // Mock window.sa_event
        window.sa_event = vi.fn()

        // Avoid the autosave interval running between tests
        vi.spyOn(globalThis, 'setInterval').mockImplementation(() => 123)

        // Mock ResumeService and ExporterService methods
        vi.spyOn(ResumeService, 'exportToJSON').mockImplementation(() => new Blob(['test']))
        vi.spyOn(ResumeService, 'loadFromFile').mockImplementation(() => Promise.resolve(
            prepareResume({ basics: { name: 'Test User' } })
        ))
        vi.spyOn(ExporterService, 'getFilename').mockImplementation(() => 'test.json')
        vi.spyOn(ExporterService, 'download').mockImplementation(() => { })
        vi.spyOn(ExporterService, 'exportToPDF').mockImplementation(() => Promise.resolve())
        vi.spyOn(ExporterService, 'exportToHTML').mockImplementation(() => Promise.resolve())
        vi.spyOn(ExporterService, 'exportToTXT').mockImplementation(() => Promise.resolve())

        wrapper = mountPage()
    })

    afterEach(() => {
        wrapper?.unmount()
        localStorage.clear()
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
    })

    describe('Component Mounting', () => {
        it('mounts successfully', () => {
            expect(wrapper.exists()).toBe(true)
        })

        it('initializes with the sample resume', () => {
            expect(wrapper.vm.resume).toEqual(sampleResume())
        })

        it('initializes with correct default values', () => {
            expect(wrapper.vm.activeTab).toBe('info')
            expect(wrapper.vm.zoomLevel).toBe(100)
            expect(wrapper.vm.alertMessage.show).toBe(false)
        })
    })

    describe('Zoom Functionality', () => {
        it('initializes with 100% zoom level', () => {
            expect(wrapper.vm.zoomLevel).toBe(100)
        })

        it('increases zoom level when zoom in is called', async () => {
            const initialZoom = wrapper.vm.zoomLevel
            wrapper.vm.handleZoomIn()
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.zoomLevel).toBe(initialZoom + 25)
        })

        it('decreases zoom level when zoom out is called', async () => {
            const initialZoom = wrapper.vm.zoomLevel
            wrapper.vm.handleZoomOut()
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.zoomLevel).toBe(initialZoom - 25)
        })

        it('does not increase zoom beyond 200%', async () => {
            wrapper.vm.zoomLevel = 200
            wrapper.vm.handleZoomIn()
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.zoomLevel).toBe(200)
        })

        it('does not decrease zoom below 50%', async () => {
            wrapper.vm.zoomLevel = 50
            wrapper.vm.handleZoomOut()
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.zoomLevel).toBe(50)
        })

        it('applies the zoom level to the preview container', async () => {
            wrapper.vm.handleZoomIn()
            await wrapper.vm.$nextTick()

            expect(wrapper.find('.preview-container').attributes('style')).toContain('scale(1.25)')
        })
    })

    describe('LocalStorage', () => {
        it('initializes with the sample resume when localStorage is empty', () => {
            expect(localStorage.getItem('resume')).toBeNull()
            expect(wrapper.vm.resume.basics.name).toBe(sampleResume().basics.name)
        })

        it('loads the resume from localStorage on initialization', () => {
            const stored = prepareResume({
                basics: { name: 'Luke Skywalker', label: 'Jedi Knight' }
            })
            settingsOf(stored).template = 'twoColumnsGreen'
            localStorage.setItem('resume', JSON.stringify(stored))

            // Re-mount component to trigger initialization
            wrapper.unmount()
            wrapper = mountPage()

            // Verify data was loaded from localStorage
            expect(wrapper.vm.resume.basics.name).toBe('Luke Skywalker')
            expect(wrapper.vm.resume.basics.label).toBe('Jedi Knight')
            expect(settingsOf(wrapper.vm.resume).template).toBe('twoColumnsGreen')
        })

        it('ignores the old resumeData/resumeStyle keys', () => {
            localStorage.setItem('resumeData', JSON.stringify({ personal: { name: 'Old Format' } }))
            localStorage.setItem('resumeStyle', JSON.stringify({ spacing: { sidebarLeft: true } }))

            wrapper.unmount()
            wrapper = mountPage()

            expect(wrapper.vm.resume).toEqual(sampleResume())
        })

        it('saves the resume to localStorage periodically', () => {
            // The autosave callback is registered with setInterval on mount
            const [callback, delay] = setInterval.mock.calls.at(-1)
            expect(delay).toBe(1000)

            wrapper.vm.resume.basics.name = 'Saved Name'
            callback()

            expect(JSON.parse(localStorage.getItem('resume')).basics.name).toBe('Saved Name')
        })
    })

    describe('Export JSON', () => {
        it('exports the resume as a JSON file', async () => {
            wrapper.vm.resume = prepareResume({
                basics: { name: 'Luke Skywalker', label: 'Jedi Knight' }
            })

            // Trigger export
            await wrapper.vm.handleExportJSON()

            // Verify ResumeService was called with the resume
            expect(ResumeService.exportToJSON).toHaveBeenCalledWith(wrapper.vm.resume)

            // Verify the file was downloaded with the generated filename
            expect(ExporterService.download).toHaveBeenCalledWith(expect.any(Blob), 'test.json')

            // Verify sa_event was called
            expect(window.sa_event).toHaveBeenCalledWith('export_json')
            expect(wrapper.vm.alertMessage.title).toBe('Export Successful')
        })

        it('creates and revokes an object URL for the download', async () => {
            // Use the real download implementation
            ExporterService.download.mockRestore()
            const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => { })

            await wrapper.vm.handleExportJSON()

            expect(window.URL.createObjectURL).toHaveBeenCalled()
            expect(clickSpy).toHaveBeenCalled()
            expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test')
        })

        it('generates the filename from the resume', async () => {
            wrapper.vm.resume = prepareResume({
                basics: { name: 'Luke Skywalker', label: 'Jedi Knight' }
            })

            // Trigger export
            await wrapper.vm.handleExportJSON()

            // Verify ExporterService.getFilename was called
            expect(ExporterService.getFilename).toHaveBeenCalledWith(wrapper.vm.resume, 'json')
        })

        it('generates fallback filename when name/label is missing', async () => {
            ExporterService.getFilename.mockRestore()
            wrapper.vm.resume = prepareResume({})

            // Trigger export
            await wrapper.vm.handleExportJSON()

            expect(ExporterService.download).toHaveBeenCalledWith(expect.any(Blob), 'resume.json')
        })

        it('handles export JSON error gracefully', async () => {
            // Mock console.error to avoid noise in tests
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

            // Mock ResumeService to throw error
            ResumeService.exportToJSON.mockImplementation(() => {
                throw new Error('Export failed')
            })

            // Trigger export
            await wrapper.vm.handleExportJSON()

            // Verify error was logged and shown
            expect(consoleSpy).toHaveBeenCalledWith('Error exporting JSON:', expect.any(Error))
            expect(wrapper.vm.alertMessage.title).toBe('Export Failed')
            expect(wrapper.vm.alertMessage.type).toBe('error')
        })
    })

    describe('Import JSON', () => {
        it('triggers file input click when import is called', () => {
            const clickSpy = vi.spyOn(wrapper.vm.fileInput, 'click').mockImplementation(() => { })

            // Trigger import
            wrapper.vm.handleImportJSON()

            // Verify file input was clicked
            expect(clickSpy).toHaveBeenCalled()
            expect(window.sa_event).toHaveBeenCalledWith('import_json')
        })

        it('handles file upload successfully', async () => {
            const mockFile = new File(['{"basics": {}}'], 'test.json', { type: 'application/json' })
            const mockEvent = { target: { files: [mockFile], value: 'C:\\fakepath\\test.json' } }

            // Trigger file upload
            await wrapper.vm.handleFileUpload(mockEvent)

            // Verify ResumeService.loadFromFile was called
            expect(ResumeService.loadFromFile).toHaveBeenCalledWith(mockFile)

            // Verify the resume was replaced
            expect(wrapper.vm.resume.basics.name).toBe('Test User')
            expect(wrapper.vm.alertMessage.title).toBe('Import Successful')

            // Verify input was reset so the same file can be selected again
            expect(mockEvent.target.value).toBe('')
        })

        it('handles file upload error', async () => {
            const mockFile = new File(['invalid json'], 'test.json', { type: 'application/json' })
            const mockEvent = { target: { files: [mockFile], value: 'test.json' } }
            const before = wrapper.vm.resume

            // Mock ResumeService to reject
            ResumeService.loadFromFile.mockRejectedValue(new Error('The file is not valid JSON.'))

            // Mock console.error to avoid noise in tests
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

            // Trigger file upload
            await wrapper.vm.handleFileUpload(mockEvent)

            // Verify error was logged and shown, and the resume kept
            expect(consoleSpy).toHaveBeenCalledWith('Error importing file:', expect.any(Error))
            expect(wrapper.vm.alertMessage.title).toBe('Import Failed')
            expect(wrapper.vm.alertMessage.message).toBe('The file is not valid JSON.')
            expect(wrapper.vm.resume).toBe(before)
            expect(mockEvent.target.value).toBe('')
        })

        it('handles no file selected', async () => {
            const mockEvent = { target: { files: [], value: '' } }

            // Trigger file upload with no file
            await wrapper.vm.handleFileUpload(mockEvent)

            // Verify ResumeService.loadFromFile was not called
            expect(ResumeService.loadFromFile).not.toHaveBeenCalled()
        })
    })

    describe('PDF Export', () => {
        it('exports resume as PDF successfully', async () => {
            // Trigger PDF export
            await wrapper.vm.handleDownloadPDF()

            // Verify ExporterService.exportToPDF was called
            expect(ExporterService.exportToPDF).toHaveBeenCalledWith(wrapper.vm.resume)

            // Verify sa_event was called
            expect(window.sa_event).toHaveBeenCalledWith('download_pdf')
            expect(wrapper.vm.alertMessage.title).toBe('PDF Generated')
        })

        it('handles PDF export error', async () => {
            // Mock ExporterService to reject
            ExporterService.exportToPDF.mockRejectedValue(new Error('PDF generation failed'))

            // Mock console.error to avoid noise in tests
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

            // Trigger PDF export
            await wrapper.vm.handleDownloadPDF()

            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalledWith('Error generating PDF:', expect.any(Error))
            expect(wrapper.vm.alertMessage.title).toBe('PDF Generation Failed')
        })
    })

    describe('HTML Export', () => {
        it('exports resume as HTML successfully', async () => {
            // Trigger HTML export
            await wrapper.vm.handleDownloadHTML()

            // Verify ExporterService.exportToHTML was called
            expect(ExporterService.exportToHTML).toHaveBeenCalledWith(wrapper.vm.resume)

            // Verify sa_event was called
            expect(window.sa_event).toHaveBeenCalledWith('download_html')
            expect(wrapper.vm.alertMessage.title).toBe('HTML Generated')
        })

        it('handles HTML export error', async () => {
            // Mock ExporterService to reject
            ExporterService.exportToHTML.mockRejectedValue(new Error('HTML generation failed'))

            // Mock console.error to avoid noise in tests
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

            // Trigger HTML export
            await wrapper.vm.handleDownloadHTML()

            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalledWith('Error generating HTML:', expect.any(Error))
            expect(wrapper.vm.alertMessage.title).toBe('HTML Generation Failed')
        })
    })

    describe('TXT Export', () => {
        it('exports resume as TXT successfully', async () => {
            // Trigger TXT export
            await wrapper.vm.handleDownloadTXT()

            // Verify ExporterService.exportToTXT was called
            expect(ExporterService.exportToTXT).toHaveBeenCalledWith(wrapper.vm.resume)

            // Verify sa_event was called
            expect(window.sa_event).toHaveBeenCalledWith('download_txt')
            expect(wrapper.vm.alertMessage.title).toBe('TXT Generated')
        })

        it('handles TXT export error', async () => {
            // Mock ExporterService to reject
            ExporterService.exportToTXT.mockRejectedValue(new Error('TXT generation failed'))

            // Mock console.error to avoid noise in tests
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

            // Trigger TXT export
            await wrapper.vm.handleDownloadTXT()

            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalledWith('Error generating TXT:', expect.any(Error))
            expect(wrapper.vm.alertMessage.title).toBe('TXT Generation Failed')
        })

        it('passes the current resume to TXT export', async () => {
            // Set a specific resume
            const testResume = prepareResume({
                basics: { name: 'Luke Skywalker', label: 'Jedi Knight' },
                work: [{ position: 'Jedi Knight', name: 'Rebel Alliance', startDate: '2019', endDate: '2023' }]
            })
            wrapper.vm.resume = testResume

            // Trigger TXT export
            await wrapper.vm.handleDownloadTXT()

            // Verify ExporterService.exportToTXT was called with correct data
            expect(ExporterService.exportToTXT).toHaveBeenCalledWith(testResume)
        })
    })

    describe('Alert System', () => {
        it('shows alert with correct parameters', () => {
            // Trigger alert
            wrapper.vm.showAlert('Test Title', 'Test Message', 'error')

            // Verify alert state
            expect(wrapper.vm.alertMessage.show).toBe(true)
            expect(wrapper.vm.alertMessage.title).toBe('Test Title')
            expect(wrapper.vm.alertMessage.message).toBe('Test Message')
            expect(wrapper.vm.alertMessage.type).toBe('error')
        })

        it('hides alert when hideAlert is called', () => {
            // Show alert first
            wrapper.vm.showAlert('Test Title', 'Test Message')

            // Hide alert
            wrapper.vm.hideAlert()

            // Verify alert is hidden
            expect(wrapper.vm.alertMessage.show).toBe(false)
        })

        it('auto-hides alert after timeout', () => {
            vi.useFakeTimers()
            try {
                wrapper.vm.showAlert('Test Title', 'Test Message')
                expect(wrapper.vm.alertMessage.show).toBe(true)

                vi.advanceTimersByTime(3000)
                expect(wrapper.vm.alertMessage.show).toBe(false)
            } finally {
                vi.useRealTimers()
            }
        })

        it('restarts the timer when a new alert is shown', () => {
            vi.useFakeTimers()
            try {
                wrapper.vm.showAlert('Alert 1', 'Message 1')
                vi.advanceTimersByTime(2000)
                wrapper.vm.showAlert('Alert 2', 'Message 2')

                // The first alert's timer must not hide the second one
                vi.advanceTimersByTime(2000)
                expect(wrapper.vm.alertMessage.show).toBe(true)

                vi.advanceTimersByTime(1000)
                expect(wrapper.vm.alertMessage.show).toBe(false)
            } finally {
                vi.useRealTimers()
            }
        })
    })

    describe('Alert System Edge Cases', () => {
        it('handles multiple rapid alerts', () => {
            // Show multiple alerts rapidly
            wrapper.vm.showAlert('Alert 1', 'Message 1')
            wrapper.vm.showAlert('Alert 2', 'Message 2')
            wrapper.vm.showAlert('Alert 3', 'Message 3')

            // Verify the last alert is shown
            expect(wrapper.vm.alertMessage.title).toBe('Alert 3')
            expect(wrapper.vm.alertMessage.message).toBe('Message 3')
        })

        it('handles alert with default type', () => {
            // Show alert without specifying type
            wrapper.vm.showAlert('Test Title', 'Test Message')

            // Verify default type is 'success'
            expect(wrapper.vm.alertMessage.type).toBe('success')
        })
    })

    describe('Scroll Functionality', () => {
        it('handles scroll to section when editor content not found', () => {
            // Mock document.querySelector to return null
            vi.spyOn(document, 'querySelector').mockReturnValue(null)

            // Trigger scroll to section
            wrapper.vm.handleScrollToSection('test-section')

            // Verify querySelector was called
            expect(document.querySelector).toHaveBeenCalledWith('.editor-window')
        })

        it('handles scroll to section when target element not found', () => {
            // Mock document.querySelector to return editor content but no target
            const mockEditorContent = {
                querySelector: vi.fn().mockReturnValue(null)
            }
            vi.spyOn(document, 'querySelector').mockReturnValue(mockEditorContent)

            // Trigger scroll to section
            wrapper.vm.handleScrollToSection('test-section')

            // Verify querySelector was called
            expect(document.querySelector).toHaveBeenCalledWith('.editor-window')
            expect(mockEditorContent.querySelector).toHaveBeenCalledWith('[data-section="test-section"]')
        })

        it('handles scroll to section when element exists', () => {
            // Mock document.querySelector to return an element with querySelector method
            const mockTargetElement = {
                scrollIntoView: vi.fn()
            }
            const mockEditorContent = {
                querySelector: vi.fn().mockReturnValue(mockTargetElement)
            }
            vi.spyOn(document, 'querySelector').mockReturnValue(mockEditorContent)

            // Trigger scroll to section
            wrapper.vm.handleScrollToSection('test-section')

            // Verify scrollIntoView was called
            expect(mockTargetElement.scrollIntoView).toHaveBeenCalledWith({
                behavior: 'smooth',
                block: 'start'
            })
        })

        it('scrolls when the lateral menu emits scroll-to-section', () => {
            const spy = vi.spyOn(document, 'querySelector').mockReturnValue(null)

            wrapper.findComponent({ name: 'LateralMenu' }).vm.$emit('scroll-to-section', 'work')

            expect(spy).toHaveBeenCalledWith('.editor-window')
        })
    })

    describe('Tooltips', () => {
        // Builds a lateral menu with one button inside a tooltip and one outside
        const addMenu = () => {
            const menu = document.createElement('div')
            menu.className = 'lateral-menu'
            menu.innerHTML = '<div class="v-tooltip"><button class="v-btn" id="in"></button></div><button class="v-btn" id="out"></button>'
            document.body.appendChild(menu)
            return menu
        }

        it('dispatches mouseenter on tooltip buttons when showing tooltips', () => {
            const menu = addMenu()
            const inside = vi.fn()
            const outside = vi.fn()
            menu.querySelector('#in').addEventListener('mouseenter', inside)
            menu.querySelector('#out').addEventListener('mouseenter', outside)

            wrapper.vm.handleShowTooltipsStart()

            expect(inside).toHaveBeenCalled()
            expect(outside).not.toHaveBeenCalled()
            menu.remove()
        })

        it('dispatches mouseleave on tooltip buttons when hiding tooltips', () => {
            const menu = addMenu()
            const inside = vi.fn()
            menu.querySelector('#in').addEventListener('mouseleave', inside)

            wrapper.vm.handleShowTooltipsEnd()

            expect(inside).toHaveBeenCalled()
            menu.remove()
        })
    })

    describe('Navigation', () => {
        it('navigates to the home page', () => {
            const pushSpy = vi.spyOn(router, 'push').mockResolvedValue()

            wrapper.vm.handleHome()

            expect(pushSpy).toHaveBeenCalledWith('/')
        })
    })

    describe('Mobile Responsiveness', () => {
        it('computes mobile state correctly', () => {
            // Test that isMobile is a computed property
            expect(typeof wrapper.vm.isMobile).toBe('boolean')
        })
    })

    describe('Template Rendering and DOM Elements', () => {
        it('renders all child components with correct props', () => {
            const lateralMenu = wrapper.findComponent({ name: 'LateralMenu' })
            const editor = wrapper.findComponent({ name: 'ResumeEditor' })
            const preview = wrapper.findComponent({ name: 'ResumePreview' })

            expect(lateralMenu.exists()).toBe(true)
            expect(editor.exists()).toBe(true)
            expect(preview.exists()).toBe(true)

            expect(lateralMenu.props('activeTab')).toBe('info')
            expect(lateralMenu.props('sections')).toBe(settingsOf(wrapper.vm.resume).sections)
            expect(editor.props('resume')).toBe(wrapper.vm.resume)
            expect(editor.props('activeTab')).toBe('info')
            expect(editor.props('isMobile')).toBe(wrapper.vm.isMobile)
            expect(preview.props('resume')).toBe(wrapper.vm.resume)
        })

        it('renders a hidden JSON file input', () => {
            const input = wrapper.find('input[type="file"]')
            expect(input.exists()).toBe(true)
            expect(input.attributes('accept')).toBe('.json')
        })

        it('updates the resume when the editor emits update:resume', async () => {
            const updated = prepareResume({ basics: { name: 'Edited' } })

            wrapper.findComponent({ name: 'ResumeEditor' }).vm.$emit('update:resume', updated)
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.resume.basics.name).toBe('Edited')
            expect(wrapper.findComponent({ name: 'ResumePreview' }).props('resume').basics.name).toBe('Edited')
        })

        it('updates the active tab from child components', async () => {
            wrapper.findComponent({ name: 'LateralMenu' }).vm.$emit('update:activeTab', 'style')
            await wrapper.vm.$nextTick()
            expect(wrapper.vm.activeTab).toBe('style')
            expect(wrapper.findComponent({ name: 'ResumeEditor' }).props('activeTab')).toBe('style')

            wrapper.findComponent({ name: 'ResumeEditor' }).vm.$emit('update:activeTab', 'ai')
            await wrapper.vm.$nextTick()
            expect(wrapper.vm.activeTab).toBe('ai')
        })
    })

    describe('Export Functionality Extended', () => {
        it('handles export JSON with missing sa_event', async () => {
            delete window.sa_event

            // Trigger export
            await wrapper.vm.handleExportJSON()

            // Verify export still works without sa_event
            expect(ResumeService.exportToJSON).toHaveBeenCalled()
        })

        it('handles import JSON with missing sa_event', () => {
            delete window.sa_event
            const clickSpy = vi.spyOn(wrapper.vm.fileInput, 'click').mockImplementation(() => { })

            // Trigger import
            wrapper.vm.handleImportJSON()

            // Verify import still works without sa_event
            expect(clickSpy).toHaveBeenCalled()
        })

        it('handles PDF export with missing sa_event', async () => {
            delete window.sa_event

            // Trigger PDF export
            await wrapper.vm.handleDownloadPDF()

            // Verify PDF export still works without sa_event
            expect(ExporterService.exportToPDF).toHaveBeenCalled()
        })

        it('handles HTML export with missing sa_event', async () => {
            delete window.sa_event

            // Trigger HTML export
            await wrapper.vm.handleDownloadHTML()

            // Verify HTML export still works without sa_event
            expect(ExporterService.exportToHTML).toHaveBeenCalled()
        })

        it('handles TXT export with missing sa_event', async () => {
            delete window.sa_event

            // Trigger TXT export
            await wrapper.vm.handleDownloadTXT()

            // Verify TXT export still works without sa_event
            expect(ExporterService.exportToTXT).toHaveBeenCalled()
        })
    })

    describe('Error Handling Extended', () => {
        it('falls back to the sample resume when localStorage holds invalid JSON', () => {
            localStorage.setItem('resume', '{not json')

            // Re-mount component to read the corrupted value
            wrapper.unmount()
            wrapper = mountPage()

            // Component should still mount successfully with the sample resume
            expect(wrapper.vm.resume).toEqual(sampleResume())
        })

        it('falls back to the sample resume when the stored resume is not a valid JSON Resume', () => {
            localStorage.setItem('resume', JSON.stringify({ basics: { name: 42 } }))

            wrapper.unmount()
            wrapper = mountPage()

            expect(wrapper.vm.resume).toEqual(sampleResume())
        })
    })

    describe('Component State Management', () => {
        it('updates the resume correctly', () => {
            wrapper.vm.resume = prepareResume({ basics: { name: 'New Name' } })

            expect(wrapper.vm.resume.basics.name).toBe('New Name')
        })

        it('updates active tab correctly', () => {
            wrapper.vm.activeTab = 'style'
            expect(wrapper.vm.activeTab).toBe('style')
        })

        it('updates zoom level correctly', () => {
            wrapper.vm.zoomLevel = 150
            expect(wrapper.vm.zoomLevel).toBe(150)
        })
    })

    describe('Edge Cases and Boundary Conditions', () => {
        it('handles zoom level at exact boundaries', () => {
            // Test at minimum zoom
            wrapper.vm.zoomLevel = 50
            wrapper.vm.handleZoomOut()
            expect(wrapper.vm.zoomLevel).toBe(50)

            // Test at maximum zoom
            wrapper.vm.zoomLevel = 200
            wrapper.vm.handleZoomIn()
            expect(wrapper.vm.zoomLevel).toBe(200)
        })

        it('handles an empty resume gracefully', () => {
            wrapper.vm.resume = prepareResume({})

            // prepareResume fills in basics and the app settings
            expect(wrapper.vm.resume.basics).toBeDefined()
            expect(settingsOf(wrapper.vm.resume).sections).toEqual([])
        })

        it('handles null values in localStorage', () => {
            vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)

            // Re-mount component
            wrapper.unmount()
            wrapper = mountPage()

            // Component should initialize with the sample resume
            expect(wrapper.vm.resume).toEqual(sampleResume())
        })
    })
})
