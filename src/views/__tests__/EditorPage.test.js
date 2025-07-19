import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { ResumeService } from '@/services/ResumeService'
import { ExporterService } from '@/services/ExporterService'
import { CVConversionService } from '@/services/CVConversionService'
import EditorPage from '@/views/EditorPage.vue'
import { ResumeDataClass, ResumeStyleClass } from '@/services/ResumeService'

// Mock child components to focus on EditorPage logic
vi.mock('@/components/EditorPage/LateralMenu.vue', () => ({
    default: {
        name: 'LateralMenu',
        template: '<div class="lateral-menu-mock">LateralMenu Mock</div>',
        props: ['activeTab', 'customSections'],
        emits: ['update:activeTab', 'scroll-to-section']
    }
}))

vi.mock('@/components/EditorPage/ResumeEditor.vue', () => ({
    default: {
        name: 'ResumeEditor',
        template: '<div class="resume-editor-mock">ResumeEditor Mock</div>',
        props: ['resumeData', 'style', 'activeTab', 'isMobile'],
        emits: ['update:resume-data', 'update:style', 'update:activeTab', 'save', 'change']
    }
}))

vi.mock('@/components/EditorPage/templates/TemplateFactory.vue', () => ({
    default: {
        name: 'TemplateFactory',
        template: '<div class="template-factory-mock">TemplateFactory Mock</div>',
        props: ['resumeData', 'style', 'sidebarPosition']
    }
}))

vi.mock('@/components/EditorPage/ConvertCVDialog.vue', () => ({
    default: {
        name: 'ConvertCVDialog',
        template: '<div class="convert-cv-dialog-mock">ConvertCVDialog Mock</div>',
        props: ['dialog', 'models', 'loading'],
        emits: ['close']
    }
}))

describe('EditorPage', () => {
    let wrapper
    let router
    let vuetify

    const mockResumeData = ResumeDataClass.createDefault()
    const mockResumeStyle = ResumeStyleClass.createDefault()

    beforeEach(() => {
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
                    name: 'editor',
                    component: { template: '<div>Editor</div>' }
                }
            ]
        })

        // Mock window.URL.createObjectURL and revokeObjectURL
        window.URL.createObjectURL = vi.fn()
        window.URL.revokeObjectURL = vi.fn()

        // Mock Blob and text() method
        global.Blob = vi.fn((content) => ({
            type: 'application/json',
            text: () => Promise.resolve(content[0])
        }))

        // Mock window.sa_event
        window.sa_event = vi.fn()

        // Mock ResumeService methods
        vi.spyOn(ResumeService, 'exportToJSON').mockImplementation(() => new Blob(['test']))
        vi.spyOn(ResumeService, 'loadFromFile').mockImplementation(() => Promise.resolve({
            resumeData: new ResumeDataClass({ personal: { name: 'Test User' } }),
            resumeStyle: new ResumeStyleClass()
        }))
        vi.spyOn(ExporterService, 'getFilename').mockImplementation(() => 'test.json')
        vi.spyOn(ExporterService, 'exportToPDF').mockImplementation(() => Promise.resolve())
        vi.spyOn(ExporterService, 'exportToHTML').mockImplementation(() => Promise.resolve())

        // Mock CVConversionService methods
        vi.spyOn(CVConversionService, 'fetchAvailableModels').mockImplementation(() => Promise.resolve(['model1', 'model2']))
        vi.spyOn(CVConversionService, 'convertCV').mockImplementation(() => Promise.resolve(new ResumeDataClass()))

        // Mock router
        const mockRouter = {
            push: vi.fn()
        }

        wrapper = mount(EditorPage, {
            global: {
                plugins: [router, vuetify],
                mocks: {
                    $router: mockRouter
                },
                stubs: {
                    'v-app': true,
                    'v-main': true,
                    'v-btn': true,
                    'v-expansion-panels': true,
                    'v-expansion-panel': true,
                    'v-expansion-panel-title': true,
                    'v-expansion-panel-text': true,
                    'v-tabs': true,
                    'v-tab': true,
                    'v-slide-group': true,
                    'LateralMenu': {
                        template: '<div class="lateral-menu-mock">LateralMenu Mock</div>',
                        props: ['activeTab', 'customSections'],
                        emits: ['update:activeTab', 'scroll-to-section']
                    },
                    'ResumeEditor': {
                        template: '<div class="resume-editor-mock">ResumeEditor Mock</div>',
                        props: ['resumeData', 'style', 'activeTab', 'isMobile'],
                        emits: ['update:resume-data', 'update:style', 'update:activeTab', 'save', 'change']
                    },
                    'TemplateFactory': {
                        template: '<div class="template-factory-mock">TemplateFactory Mock</div>',
                        props: ['resumeData', 'style', 'sidebarPosition']
                    },
                    'ConvertCVDialog': {
                        template: '<div class="convert-cv-dialog-mock">ConvertCVDialog Mock</div>',
                        props: ['dialog', 'models', 'loading'],
                        emits: ['close']
                    }
                }
            }
        })
    })

    describe('Component Mounting', () => {
        it('mounts successfully', () => {
            expect(wrapper.exists()).toBe(true)
        })

        it('initializes with default resume data and style', () => {
            expect(wrapper.vm.resumeData).toBeDefined()
            expect(wrapper.vm.resumeStyle).toBeDefined()
        })

        it('initializes with correct default values', () => {
            expect(wrapper.vm.activeTab).toBe('info')
            expect(wrapper.vm.zoomLevel).toBe(100)
            expect(wrapper.vm.showConvertDialog).toBe(false)
            expect(wrapper.vm.isConverting).toBe(false)
            // availableModels will be populated by the mock in onMounted
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
    })

    describe('LocalStorage', () => {
        beforeEach(() => {
            // Clear localStorage before each test
            localStorage.clear()
            // Mock setInterval to avoid actual intervals running
            vi.spyOn(global, 'setInterval').mockImplementation(() => 123)
        })

        afterEach(() => {
            localStorage.clear()
            vi.restoreAllMocks()
        })

        it('initializes with default data when localStorage is empty', () => {
            // Ensure localStorage is empty
            expect(localStorage.getItem('resumeData')).toBeNull()
            expect(localStorage.getItem('resumeStyle')).toBeNull()

            // Component should initialize with default data
            expect(wrapper.vm.resumeData).toBeDefined()
            expect(wrapper.vm.resumeStyle).toBeDefined()
        })

        it('loads resume data from localStorage on initialization', () => {
            const mockResumeData = {
                personal: {
                    name: 'Luke Skywalker',
                    title: 'Jedi Knight'
                }
            }
            const mockResumeStyle = {
                spacing: { sidebarLeft: true }
            }

            // Set up localStorage before mounting
            localStorage.setItem('resumeData', JSON.stringify(mockResumeData))
            localStorage.setItem('resumeStyle', JSON.stringify(mockResumeStyle))

            // Re-mount component to trigger initialization
            wrapper.unmount()
            wrapper = mount(EditorPage, {
                global: {
                    plugins: [router, vuetify],
                    stubs: {
                        'v-app': true,
                        'v-main': true,
                        'v-btn': true,
                        'v-expansion-panels': true,
                        'v-expansion-panel': true,
                        'v-expansion-panel-title': true,
                        'v-expansion-panel-text': true,
                        'v-tabs': true,
                        'v-tab': true,
                        'v-slide-group': true
                    }
                }
            })

            // Verify data was loaded from localStorage
            expect(wrapper.vm.resumeData.personal.name).toBe('Luke Skywalker')
            expect(wrapper.vm.resumeData.personal.title).toBe('Jedi Knight')
            expect(wrapper.vm.resumeStyle.spacing.sidebarLeft).toBe(true)
        })
    })

    describe('Export JSON', () => {
        it('exports resume data as JSON file', async () => {
            // Set resume data
            wrapper.vm.resumeData = new ResumeDataClass({
                personal: {
                    name: 'Luke Skywalker',
                    title: 'Jedi Knight'
                }
            })

            // Trigger export
            await wrapper.vm.handleExportJSON()

            // Verify ResumeService was called
            expect(ResumeService.exportToJSON).toHaveBeenCalledWith(
                wrapper.vm.resumeData,
                wrapper.vm.resumeStyle
            )

            // Verify createObjectURL was called
            expect(window.URL.createObjectURL).toHaveBeenCalled()

            // Verify sa_event was called
            expect(window.sa_event).toHaveBeenCalledWith('export_json')

            // Verify cleanup
            expect(window.URL.revokeObjectURL).toHaveBeenCalled()
        })

        it('generates correct filename from resume data', async () => {
            // Set resume data
            wrapper.vm.resumeData = new ResumeDataClass({
                personal: {
                    name: 'Luke Skywalker',
                    title: 'Jedi Knight'
                }
            })

            // Trigger export
            await wrapper.vm.handleExportJSON()

            // Verify ExporterService.getFilename was called
            expect(ExporterService.getFilename).toHaveBeenCalledWith(
                wrapper.vm.resumeData,
                'json'
            )
        })

        it('generates fallback filename when name/title is missing', async () => {
            // Set resume data with missing name/title
            wrapper.vm.resumeData = new ResumeDataClass({
                personal: {}
            })

            // Trigger export
            await wrapper.vm.handleExportJSON()

            // Verify ExporterService.getFilename was called
            expect(ExporterService.getFilename).toHaveBeenCalledWith(
                wrapper.vm.resumeData,
                'json'
            )
        })

        it('handles export JSON error gracefully', async () => {
            // Mock console.error to avoid noise in tests
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

            // Mock ResumeService to throw error
            vi.spyOn(ResumeService, 'exportToJSON').mockImplementation(() => {
                throw new Error('Export failed')
            })

            // Trigger export
            await wrapper.vm.handleExportJSON()

            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalledWith('Error exporting JSON:', expect.any(Error))

            consoleSpy.mockRestore()
        })
    })

    describe('Import JSON', () => {
        it('triggers file input click when import is called', async () => {
            // Mock file input click
            const clickSpy = vi.fn()
            wrapper.vm.fileInput = { click: clickSpy }

            // Trigger import
            wrapper.vm.handleImportJSON()

            // Verify file input was clicked
            expect(clickSpy).toHaveBeenCalled()
            expect(window.sa_event).toHaveBeenCalledWith('import_json')
        })

        it('handles file upload successfully', async () => {
            const mockFile = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' })
            const mockEvent = { target: { files: [mockFile] } }

            // Trigger file upload
            await wrapper.vm.handleFileUpload(mockEvent)

            // Verify ResumeService.loadFromFile was called
            expect(ResumeService.loadFromFile).toHaveBeenCalledWith(mockFile)

            // Verify data was updated
            expect(wrapper.vm.resumeData.personal.name).toBe('Test User')

            // Verify input was reset
            expect(mockEvent.target.files[0]).toBe(mockFile)
        })

        it('handles file upload error', async () => {
            const mockFile = new File(['invalid json'], 'test.json', { type: 'application/json' })
            const mockEvent = { target: { files: [mockFile] } }

            // Mock ResumeService to throw error
            vi.spyOn(ResumeService, 'loadFromFile').mockImplementation(() => {
                throw new Error('Invalid file format')
            })

            // Mock console.error to avoid noise in tests
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

            // Trigger file upload
            await wrapper.vm.handleFileUpload(mockEvent)

            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalledWith('Error importing file:', expect.any(Error))

            consoleSpy.mockRestore()
        })

        it('handles no file selected', async () => {
            const mockEvent = { target: { files: [] } }

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
            expect(ExporterService.exportToPDF).toHaveBeenCalledWith(
                wrapper.vm.resumeData,
                wrapper.vm.resumeStyle
            )

            // Verify sa_event was called
            expect(window.sa_event).toHaveBeenCalledWith('download_pdf')
        })

        it('handles PDF export error', async () => {
            // Mock ExporterService to throw error
            vi.spyOn(ExporterService, 'exportToPDF').mockImplementation(() => {
                throw new Error('PDF generation failed')
            })

            // Mock console.error to avoid noise in tests
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

            // Trigger PDF export
            await wrapper.vm.handleDownloadPDF()

            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalledWith('Error generating PDF:', expect.any(Error))

            consoleSpy.mockRestore()
        })
    })

    describe('HTML Export', () => {
        it('exports resume as HTML successfully', async () => {
            // Trigger HTML export
            await wrapper.vm.handleDownloadHTML()

            // Verify ExporterService.exportToHTML was called
            expect(ExporterService.exportToHTML).toHaveBeenCalledWith(
                wrapper.vm.resumeData,
                wrapper.vm.resumeStyle
            )

            // Verify sa_event was called
            expect(window.sa_event).toHaveBeenCalledWith('download_html')
        })

        it('handles HTML export error', async () => {
            // Mock ExporterService to throw error
            vi.spyOn(ExporterService, 'exportToHTML').mockImplementation(() => {
                throw new Error('HTML generation failed')
            })

            // Mock console.error to avoid noise in tests
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

            // Trigger HTML export
            await wrapper.vm.handleDownloadHTML()

            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalledWith('Error generating HTML:', expect.any(Error))

            consoleSpy.mockRestore()
        })
    })

    describe('CV Conversion', () => {
        it('loads available models on mount', async () => {
            // Component should have loaded models in onMounted
            expect(CVConversionService.fetchAvailableModels).toHaveBeenCalled()
        })

        it('opens convert dialog when button is clicked', () => {
            // Trigger convert CV button click
            wrapper.vm.handleConvertCVButtonClick()

            // Verify dialog is shown
            expect(wrapper.vm.showConvertDialog).toBe(true)
            expect(window.sa_event).toHaveBeenCalledWith('convert_cv_button_click')
        })

        it('handles CV conversion successfully', async () => {
            const mockFile = new File(['test'], 'test.pdf')
            const mockParams = { file: mockFile, apiKey: 'test-key', model: 'test-model' }

            // Trigger conversion
            await wrapper.vm.handleConvert(mockParams)

            // Verify CVConversionService.convertCV was called
            expect(CVConversionService.convertCV).toHaveBeenCalledWith(mockFile, 'test-key', 'test-model')

            // Verify dialog is closed
            expect(wrapper.vm.showConvertDialog).toBe(false)

            // Verify sa_event was called
            expect(window.sa_event).toHaveBeenCalledWith('convert_cv')
        })

        it('handles CV conversion error', async () => {
            const mockFile = new File(['test'], 'test.pdf')
            const mockParams = { file: mockFile, apiKey: 'test-key', model: 'test-model' }

            // Mock CVConversionService to throw error
            vi.spyOn(CVConversionService, 'convertCV').mockImplementation(() => {
                throw new Error('Conversion failed')
            })

            // Trigger conversion
            await wrapper.vm.handleConvert(mockParams)

            // Verify error was handled (should show alert)
            expect(wrapper.vm.isConverting).toBe(false)
        })

        it('sets converting state correctly during conversion', async () => {
            const mockFile = new File(['test'], 'test.pdf')
            const mockParams = { file: mockFile, apiKey: 'test-key', model: 'test-model' }

            // Mock CVConversionService to delay
            vi.spyOn(CVConversionService, 'convertCV').mockImplementation(() =>
                new Promise(resolve => {
                    // Use a microtask instead of setTimeout to avoid navigation issues
                    Promise.resolve().then(() => resolve(new ResumeDataClass()))
                })
            )

            // Start conversion
            const conversionPromise = wrapper.vm.handleConvert(mockParams)

            // Verify converting state is true
            expect(wrapper.vm.isConverting).toBe(true)

            // Wait for conversion to complete
            await conversionPromise

            // Verify converting state is false
            expect(wrapper.vm.isConverting).toBe(false)
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

        it('auto-hides alert after timeout', async () => {
            // Mock setTimeout
            vi.spyOn(global, 'setTimeout').mockImplementation((fn) => {
                fn()
                return 123
            })

            // Show alert
            wrapper.vm.showAlert('Test Title', 'Test Message')

            // Verify setTimeout was called
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000)
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
    })

    describe('Mobile Responsiveness', () => {
        it('computes mobile state correctly', () => {
            // Test that isMobile is a computed property
            expect(typeof wrapper.vm.isMobile).toBe('boolean')
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

    describe('Component Lifecycle and Initialization', () => {
        it('loads available models on mount', async () => {
            // Verify CVConversionService.fetchAvailableModels was called during mount
            expect(CVConversionService.fetchAvailableModels).toHaveBeenCalled()
        })

        it('handles CV conversion service error gracefully', async () => {
            // Mock CVConversionService to throw error
            vi.spyOn(CVConversionService, 'fetchAvailableModels').mockImplementation(() => {
                throw new Error('Service unavailable')
            })

            // Mock console.error to avoid noise in tests
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

            // Re-mount component to trigger the error
            wrapper.unmount()
            wrapper = mount(EditorPage, {
                global: {
                    plugins: [router, vuetify],
                    mocks: {
                        $router: { push: vi.fn() }
                    },
                    stubs: {
                        'v-app': true,
                        'v-main': true,
                        'v-btn': true,
                        'v-expansion-panels': true,
                        'v-expansion-panel': true,
                        'v-expansion-panel-title': true,
                        'v-expansion-panel-text': true,
                        'v-tabs': true,
                        'v-tab': true,
                        'v-slide-group': true
                    }
                }
            })

            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalledWith('Error fetching models:', expect.any(Error))

            consoleSpy.mockRestore()
        })
    })

    describe('Template Rendering and DOM Elements', () => {
        it('renders all child components with correct props', () => {
            // Check that all child components are rendered
            expect(wrapper.findComponent({ name: 'LateralMenu' })).toBeTruthy()
            expect(wrapper.findComponent({ name: 'ResumeEditor' })).toBeTruthy()
            expect(wrapper.findComponent({ name: 'TemplateFactory' })).toBeTruthy()
            expect(wrapper.findComponent({ name: 'ConvertCVDialog' })).toBeTruthy()
        })
    })

    describe('Scroll Functionality Extended', () => {
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

            // Verify querySelector was called
            expect(document.querySelector).toHaveBeenCalledWith('.editor-window')
            expect(mockEditorContent.querySelector).toHaveBeenCalledWith('[data-section="test-section"]')

            // Verify scrollIntoView was called
            expect(mockTargetElement.scrollIntoView).toHaveBeenCalledWith({
                behavior: 'smooth',
                block: 'start'
            })
        })
    })

    describe('Export Functionality Extended', () => {
        it('handles export JSON with missing sa_event', async () => {
            // Temporarily remove sa_event
            const originalSaEvent = window.sa_event
            delete window.sa_event

            // Trigger export
            await wrapper.vm.handleExportJSON()

            // Verify export still works without sa_event
            expect(ResumeService.exportToJSON).toHaveBeenCalled()

            // Restore sa_event
            window.sa_event = originalSaEvent
        })

        it('handles import JSON with missing sa_event', () => {
            // Temporarily remove sa_event
            const originalSaEvent = window.sa_event
            delete window.sa_event

            // Mock file input click
            const clickSpy = vi.fn()
            wrapper.vm.fileInput = { click: clickSpy }

            // Trigger import
            wrapper.vm.handleImportJSON()

            // Verify import still works without sa_event
            expect(clickSpy).toHaveBeenCalled()

            // Restore sa_event
            window.sa_event = originalSaEvent
        })

        it('handles PDF export with missing sa_event', async () => {
            // Temporarily remove sa_event
            const originalSaEvent = window.sa_event
            delete window.sa_event

            // Trigger PDF export
            await wrapper.vm.handleDownloadPDF()

            // Verify PDF export still works without sa_event
            expect(ExporterService.exportToPDF).toHaveBeenCalled()

            // Restore sa_event
            window.sa_event = originalSaEvent
        })

        it('handles HTML export with missing sa_event', async () => {
            // Temporarily remove sa_event
            const originalSaEvent = window.sa_event
            delete window.sa_event

            // Trigger HTML export
            await wrapper.vm.handleDownloadHTML()

            // Verify HTML export still works without sa_event
            expect(ExporterService.exportToHTML).toHaveBeenCalled()

            // Restore sa_event
            window.sa_event = originalSaEvent
        })
    })

    describe('Error Handling Extended', () => {
        it('handles JSON parsing errors in localStorage', () => {
            // Mock JSON.parse to throw error
            const originalParse = JSON.parse
            JSON.parse = vi.fn().mockImplementation(() => {
                throw new Error('JSON parse error')
            })

            // Re-mount component to trigger the error
            wrapper.unmount()
            wrapper = mount(EditorPage, {
                global: {
                    plugins: [router, vuetify],
                    mocks: {
                        $router: { push: vi.fn() }
                    },
                    stubs: {
                        'v-app': true,
                        'v-main': true,
                        'v-btn': true,
                        'v-expansion-panels': true,
                        'v-expansion-panel': true,
                        'v-expansion-panel-title': true,
                        'v-expansion-panel-text': true,
                        'v-tabs': true,
                        'v-tab': true,
                        'v-slide-group': true
                    }
                }
            })

            // Component should still mount successfully with default data
            expect(wrapper.vm.resumeData).toBeDefined()
            expect(wrapper.vm.resumeStyle).toBeDefined()

            // Restore JSON.parse
            JSON.parse = originalParse
        })
    })

    describe('Component State Management', () => {
        it('updates resume data correctly', () => {
            const newData = new ResumeDataClass({ personal: { name: 'New Name' } })
            wrapper.vm.resumeData = newData

            expect(wrapper.vm.resumeData.personal.name).toBe('New Name')
        })

        it('updates active tab correctly', () => {
            wrapper.vm.activeTab = 'experience'
            expect(wrapper.vm.activeTab).toBe('experience')
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

        it('handles empty resume data gracefully', () => {
            const emptyData = new ResumeDataClass({})
            wrapper.vm.resumeData = emptyData

            // Should not throw when accessing properties
            expect(wrapper.vm.resumeData.personal).toBeDefined()
        })

        it('handles null/undefined values in localStorage', () => {
            // Mock localStorage.getItem to return null
            const originalGetItem = localStorage.getItem
            localStorage.getItem = vi.fn().mockReturnValue(null)

            // Re-mount component
            wrapper.unmount()
            wrapper = mount(EditorPage, {
                global: {
                    plugins: [router, vuetify],
                    mocks: {
                        $router: { push: vi.fn() }
                    },
                    stubs: {
                        'v-app': true,
                        'v-main': true,
                        'v-btn': true,
                        'v-expansion-panels': true,
                        'v-expansion-panel': true,
                        'v-expansion-panel-title': true,
                        'v-expansion-panel-text': true,
                        'v-tabs': true,
                        'v-tab': true,
                        'v-slide-group': true
                    }
                }
            })

            // Component should initialize with default data
            expect(wrapper.vm.resumeData).toBeDefined()
            expect(wrapper.vm.resumeStyle).toBeDefined()

            // Restore localStorage
            localStorage.getItem = originalGetItem
        })
    })
}) 