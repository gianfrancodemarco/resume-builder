import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ResumeEditor from '@/components/EditorPage/ResumeEditor.vue'
import { vuetify } from '@/test/setup'
import { sampleResume } from '@/resume/resume'

const stubs = {
    ResumeInfo: {
        name: 'ResumeInfo',
        template: '<div class="resume-info-mock">ResumeInfo Mock</div>',
        props: ['resume', 'isMobile']
    },
    ResumeStyle: {
        name: 'ResumeStyle',
        template: '<div class="resume-style-mock">ResumeStyle Mock</div>',
        props: ['resume']
    },
    AIHub: {
        name: 'AIHub',
        template: '<div class="ai-hub-mock">AIHub Mock</div>',
        props: ['resume'],
        emits: ['update:resume']
    }
}

const mountEditor = props => mount(ResumeEditor, {
    global: { plugins: [vuetify], stubs },
    props
})

describe('ResumeEditor', () => {
    let wrapper
    let resume

    beforeEach(() => {
        resume = sampleResume()
        wrapper = mountEditor({ resume, isMobile: false, activeTab: 'info' })
    })

    describe('Component Mounting', () => {
        it('mounts successfully', () => {
            expect(wrapper.exists()).toBe(true)
            expect(wrapper.find('.editor-card').exists()).toBe(true)
        })

        it('passes the resume to the info panel', () => {
            const info = wrapper.findComponent({ name: 'ResumeInfo' })
            expect(info.props('resume')).toEqual(resume)
            expect(info.props('isMobile')).toBe(false)
        })
    })

    describe('Tab Navigation', () => {
        it('initializes with the active tab from props', () => {
            expect(wrapper.vm.activeTab).toBe('info')
        })

        it('shows the style panel with the resume when on the style tab', async () => {
            await wrapper.setProps({ activeTab: 'style' })
            const style = wrapper.findComponent({ name: 'ResumeStyle' })
            expect(style.exists()).toBe(true)
            expect(style.props('resume')).toEqual(resume)
        })

        it('emits update:activeTab when the local tab changes', async () => {
            wrapper.vm.activeTab = 'style'
            await wrapper.vm.$nextTick()
            expect(wrapper.emitted('update:activeTab')).toEqual([['style']])
        })
    })

    describe('AI updates', () => {
        it('forwards the resume returned by the AI hub', async () => {
            await wrapper.setProps({ activeTab: 'ai' })
            const updated = sampleResume()
            updated.basics.name = 'Jane Smith'

            wrapper.findComponent({ name: 'AIHub' }).vm.$emit('update:resume', updated)

            expect(wrapper.emitted('update:resume')).toEqual([[updated]])
        })
    })

    describe('Props Validation', () => {
        it.each([
            ['resume', { isMobile: false }],
            ['isMobile', { resume: sampleResume() }],
        ])('warns when the required %s prop is missing', (_, props) => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })
            mountEditor(props)
            expect(consoleSpy).toHaveBeenCalled()
            consoleSpy.mockRestore()
        })
    })
})
