import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ConvertCV from '@/components/EditorPage/AIHub/ConvertCV.vue'
import { CVConversionService } from '@/services/CVConversionService'

vi.mock('@/services/CVConversionService', () => ({
    CVConversionService: {
        convertCV: vi.fn(),
        validateFile: vi.fn(),
    }
}))

const pdf = new File(['%PDF-1.4'], 'cv.pdf', { type: 'application/pdf' })

describe('ConvertCV', () => {
    let wrapper

    const mountConvertCV = (props = {}) => mount(ConvertCV, {
        props: { apiKey: 'key', model: 'model', ...props },
        global: {
            plugins: [createVuetify({ components, directives })],
            // The loading overlay needs browser APIs jsdom lacks
            stubs: { VOverlay: true },
        },
    })

    beforeEach(() => {
        vi.stubGlobal('ResizeObserver', class { observe() { } unobserve() { } disconnect() { } })
        vi.clearAllMocks()
    })

    afterEach(() => {
        wrapper?.unmount()
        vi.unstubAllGlobals()
    })

    it('converts the CV and emits the JSON Resume content', async () => {
        CVConversionService.convertCV.mockResolvedValue({ basics: { name: 'Jane Doe' } })
        wrapper = mountConvertCV()

        await wrapper.vm.handleConvert({ file: pdf, apiKey: 'key', model: 'model' })
        await flushPromises()

        expect(CVConversionService.convertCV).toHaveBeenCalledWith(pdf, 'key', 'model')
        expect(wrapper.emitted('conversion-started')).toHaveLength(1)
        expect(wrapper.emitted('update:resume-info')).toEqual([[{ basics: { name: 'Jane Doe' } }]])
        expect(wrapper.emitted('conversion-finished')).toHaveLength(1)
        expect(wrapper.vm.alertMessage).toMatchObject({ show: true, type: 'success' })
        expect(wrapper.vm.loading).toBe(false)
    })

    it('reports conversion errors', async () => {
        CVConversionService.convertCV.mockRejectedValue(new Error('Invalid API key'))
        wrapper = mountConvertCV()

        await wrapper.vm.handleConvert({ file: pdf, apiKey: 'key', model: 'model' })
        await flushPromises()

        expect(wrapper.emitted('update:resume-info')).toBeUndefined()
        expect(wrapper.emitted('conversion-error')[0][0].message).toBe('Invalid API key')
        expect(wrapper.emitted('conversion-finished')).toHaveLength(1)
        expect(wrapper.vm.alertMessage).toMatchObject({ show: true, type: 'error', message: 'Invalid API key' })
    })

    it('rejects invalid files', () => {
        CVConversionService.validateFile.mockImplementation(() => { throw new Error('File is too large') })
        wrapper = mountConvertCV()

        wrapper.vm.handleFileChange({ target: { files: [pdf] } })

        expect(wrapper.vm.file).toBeNull()
        expect(wrapper.vm.alertMessage).toMatchObject({ show: true, type: 'error', message: 'File is too large' })
    })

    it('cannot convert without an API key', () => {
        wrapper = mountConvertCV({ apiKey: '' })
        const button = wrapper.findAll('button').find(b => b.text().includes('Convert'))
        expect(button.attributes('disabled')).toBeDefined()
    })
})
