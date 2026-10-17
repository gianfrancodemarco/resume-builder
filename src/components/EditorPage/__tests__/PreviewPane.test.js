import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import PreviewPane from '../PreviewPane.vue'

vi.mock('@/components/EditorPage/ResumePreview.vue', () => ({
    default: { template: '<div />' }
}))

describe('PreviewPane zoom preferences', () => {
    let wrapper

    const mountPreview = () => mount(PreviewPane, {
        props: { resume: {} },
        global: { plugins: [createVuetify({ components, directives })] }
    })

    beforeEach(() => {
        localStorage.clear()
        vi.stubGlobal('ResizeObserver', class { observe() { } unobserve() { } disconnect() { } })
    })

    afterEach(() => {
        wrapper?.unmount()
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
    })

    it('starts in Fit mode with no saved preferences', () => {
        wrapper = mountPreview()
        expect(wrapper.vm.fit).toBe(true)
        expect(wrapper.find('.zoom-value').text()).toBe('100%')
    })

    it('keeps a manual zoom after remounting', async () => {
        wrapper = mountPreview()
        await wrapper.get('[aria-label="Zoom in"]').trigger('click')
        await nextTick()
        wrapper.unmount()
        wrapper = mountPreview()
        expect(wrapper.vm.fit).toBe(false)
        expect(wrapper.find('.zoom-value').text()).toBe('110%')
    })

    it('keeps Fit mode after remounting', async () => {
        localStorage.setItem('resume-preview-fit', 'false')
        localStorage.setItem('resume-preview-zoom', '1.5')
        wrapper = mountPreview()
        const fitButton = wrapper.findAll('button').find(button => button.text() === 'Fit')
        await fitButton.trigger('click')
        await nextTick()
        wrapper.unmount()
        wrapper = mountPreview()
        expect(wrapper.vm.fit).toBe(true)
        expect(wrapper.find('.zoom-value').text()).toBe('100%')
    })

    it.each([
        ['9', '200%'],
        ['-1', '25%'],
        ['NaN', '100%'],
        ['Infinity', '100%']
    ])('bounds the stored zoom %s', (stored, displayed) => {
        localStorage.setItem('resume-preview-fit', 'false')
        localStorage.setItem('resume-preview-zoom', stored)
        wrapper = mountPreview()
        expect(wrapper.find('.zoom-value').text()).toBe(displayed)
    })

    it('still zooms when browser storage is unavailable', async () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new DOMException('Storage blocked', 'SecurityError')
        })
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new DOMException('Storage blocked', 'SecurityError')
        })
        vi.spyOn(console, 'error').mockImplementation(() => {})
        wrapper = mountPreview()
        expect(wrapper.vm.fit).toBe(true)
        await wrapper.get('[aria-label="Zoom in"]').trigger('click')
        expect(wrapper.find('.zoom-value').text()).toBe('110%')
    })

    it('still zooms when obtaining localStorage throws', async () => {
        vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
            throw new DOMException('Storage blocked', 'SecurityError')
        })
        vi.spyOn(console, 'error').mockImplementation(() => {})
        wrapper = mountPreview()
        expect(wrapper.vm.fit).toBe(true)
        await wrapper.get('[aria-label="Zoom in"]').trigger('click')
        expect(wrapper.vm.fit).toBe(false)
        expect(wrapper.find('.zoom-value').text()).toBe('110%')
    })
})
