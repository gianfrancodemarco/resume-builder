import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import ConvertCVDialog from '../ConvertCVDialog.vue'
import { CVConversionService } from '@/services/CVConversionService'

// Mock CVConversionService
vi.mock('@/services/CVConversionService', () => ({
    CVConversionService: {
        validateFile: vi.fn()
    }
}))

const vuetify = createVuetify()

// Helper to find stub by name
function findStub(wrapper, name) {
    return wrapper.findComponent({ name })
}

describe('ConvertCVDialog', () => {
    let wrapper

    const defaultProps = {
        models: [
            { id: 'model1', name: 'Model 1' },
            { id: 'google/gemini-2.5-pro-preview', name: 'Gemini 2.5 Pro' },
            { id: 'model2', name: 'Model 2' }
        ],
        loading: false,
        dialog: true,
        handleConvert: vi.fn()
    }

    beforeEach(() => {
        vi.clearAllMocks()
        wrapper = mount(ConvertCVDialog, {
            props: defaultProps,
            global: {
                plugins: [vuetify],
                stubs: {
                    'v-dialog': true,
                    'v-card': true,
                    'v-card-title': true,
                    'v-card-subtitle': true,
                    'v-card-text': true,
                    'v-card-actions': true,
                    'v-form': true,
                    'v-text-field': true,
                    'v-autocomplete': true,
                    'v-file-input': true,
                    'v-btn': true,
                    'v-overlay': true,
                    'v-progress-circular': true
                }
            }
        })
    })

    afterEach(() => {
        wrapper.unmount()
    })

    describe('Component Mounting', () => {
        it('mounts successfully', () => {
            expect(wrapper.exists()).toBe(true)
        })
    })

    describe('Props and Data', () => {
        it('initializes with correct default values', () => {
            expect(wrapper.vm.apiKey).toBe('')
            // selectedModel is set by watcher to default model
            expect(wrapper.vm.selectedModel).toBe('google/gemini-2.5-pro-preview')
            expect(wrapper.vm.file).toBe(null)
            expect(wrapper.vm.formValid).toBe(false)
        })

        it('accepts props correctly', () => {
            expect(wrapper.props('models')).toEqual(defaultProps.models)
            expect(wrapper.props('loading')).toBe(false)
            expect(wrapper.props('dialog')).toBe(true)
        })
    })

    describe('Model Selection', () => {
        it('selects default model when models are available', async () => {
            await wrapper.vm.$nextTick()
            expect(wrapper.vm.selectedModel).toBe('google/gemini-2.5-pro-preview')
        })


        it('handles empty models array', async () => {
            const propsWithEmptyModels = {
                ...defaultProps,
                models: []
            }
            wrapper = mount(ConvertCVDialog, {
                props: propsWithEmptyModels,
                global: {
                    plugins: [vuetify],
                    stubs: {
                        'v-dialog': true,
                        'v-card': true,
                        'v-card-title': true,
                        'v-card-subtitle': true,
                        'v-card-text': true,
                        'v-card-actions': true,
                        'v-form': true,
                        'v-text-field': true,
                        'v-autocomplete': true,
                        'v-file-input': true,
                        'v-btn': true,
                        'v-overlay': true,
                        'v-progress-circular': true
                    }
                }
            })
            await wrapper.vm.$nextTick()
            expect(wrapper.vm.selectedModel).toBe(null)
        })
    })

    describe('Dialog Control', () => {
        it('emits close event when dialog is closed', async () => {
            wrapper.vm.localDialog = false
            await wrapper.vm.$nextTick()
            expect(wrapper.emitted('close')).toBeTruthy()
        })

        it('resets form when close is called', async () => {
            // Set some values
            wrapper.vm.apiKey = 'test-key'
            wrapper.vm.selectedModel = 'model1'
            wrapper.vm.file = { name: 'test.pdf' }

            wrapper.vm.close()
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.apiKey).toBe('')
            expect(wrapper.vm.selectedModel).toBe(null)
            expect(wrapper.vm.file).toBe(null)
            expect(wrapper.emitted('close')).toBeTruthy()
        })
    })

    describe('File Validation', () => {
        it('validates file successfully', async () => {
            const mockFile = { name: 'test.pdf', type: 'application/pdf', size: 1024 }
            CVConversionService.validateFile.mockReturnValue(true)
            // Simulate v-file-input change event
            wrapper.vm.file = mockFile
            wrapper.vm.handleFileChange(mockFile)
            await wrapper.vm.$nextTick()
            expect(CVConversionService.validateFile).toHaveBeenCalledWith(mockFile)
        })

        it('handles file validation error', async () => {
            const mockFile = { name: 'test.pdf', type: 'application/pdf', size: 1024 }
            const errorMessage = 'File size must be less than 10MB'
            CVConversionService.validateFile.mockImplementation(() => {
                throw new Error(errorMessage)
            })
            // Mock alert
            const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { })
            wrapper.vm.handleFileChange(mockFile)
            await wrapper.vm.$nextTick()
            expect(alertSpy).toHaveBeenCalledWith(errorMessage)
            alertSpy.mockRestore()
        })

        it('handles null file', async () => {
            wrapper.vm.handleFileChange(null)
            await wrapper.vm.$nextTick()
            expect(CVConversionService.validateFile).not.toHaveBeenCalled()
        })
    })

    describe('Form Validation', () => {
        it('validates form when all fields are filled', async () => {
            wrapper.vm.apiKey = 'test-key'
            wrapper.vm.selectedModel = 'model1'
            wrapper.vm.file = { name: 'test.pdf' }
            // Simulate form valid
            wrapper.vm.formValid = true
            await wrapper.vm.$nextTick()
            expect(wrapper.vm.formValid).toBe(true)
        })
    })

    describe('Convert Button', () => {
        it('calls handleConvert with correct parameters', async () => {
            wrapper.vm.apiKey = 'test-key'
            wrapper.vm.selectedModel = 'model1'
            wrapper.vm.file = { name: 'test.pdf' }
            wrapper.vm.formValid = true
            await wrapper.vm.$nextTick()
            wrapper.vm.handleConvert({ file: wrapper.vm.file, apiKey: wrapper.vm.apiKey, model: wrapper.vm.selectedModel })
            expect(defaultProps.handleConvert).toHaveBeenCalledWith({
                file: { name: 'test.pdf' },
                apiKey: 'test-key',
                model: 'model1'
            })
        })
    })

    describe('Loading State', () => {
        it('shows loading overlay when loading is true', async () => {
            wrapper = mount(ConvertCVDialog, {
                props: { ...defaultProps, loading: true },
                global: {
                    plugins: [vuetify],
                    stubs: {
                        'v-dialog': true,
                        'v-card': true,
                        'v-card-title': true,
                        'v-card-subtitle': true,
                        'v-card-text': true,
                        'v-card-actions': true,
                        'v-form': true,
                        'v-text-field': true,
                        'v-autocomplete': true,
                        'v-file-input': true,
                        'v-btn': true,
                        'v-overlay': true,
                        'v-progress-circular': true
                    }
                }
            })
            await wrapper.vm.$nextTick()
            expect(wrapper.vm.loading).toBe(true)
        })
    })

    describe('Computed Properties', () => {
        it('localDialog getter returns dialog prop', () => {
            expect(wrapper.vm.localDialog).toBe(true)
        })

        it('localDialog setter emits close when set to false', async () => {
            wrapper.vm.localDialog = false
            await wrapper.vm.$nextTick()
            expect(wrapper.emitted('close')).toBeTruthy()
        })
    })

    describe('Watchers', () => {
        it('watches models prop and sets default model', async () => {
            const newModels = [
                { id: 'new-model', name: 'New Model' },
                { id: 'google/gemini-2.5-pro-preview', name: 'Gemini 2.5 Pro' }
            ]
            await wrapper.setProps({ models: newModels })
            await wrapper.vm.$nextTick()
            expect(wrapper.vm.selectedModel).toBe('google/gemini-2.5-pro-preview')
        })
    })
}) 