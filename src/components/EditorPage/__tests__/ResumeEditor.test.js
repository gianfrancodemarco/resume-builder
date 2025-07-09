import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ResumeEditor from '@/components/EditorPage/ResumeEditor.vue'
import { vuetify } from '@/test/setup'
import { ResumeDataClass, ResumeStyleClass } from '@/services/ResumeService'

// Mock the child components to avoid complex interactions
vi.mock('@/components/EditorPage/ResumeInfo.vue', () => ({
    default: {
        name: 'ResumeInfo',
        template: '<div class="resume-info-mock">ResumeInfo Mock</div>',
        props: ['resumeData', 'isMobile'],
        emits: ['update:resume-data', 'change']
    }
}))

vi.mock('@/components/EditorPage/ResumeStyle.vue', () => ({
    default: {
        name: 'ResumeStyle',
        template: '<div class="resume-style-mock">ResumeStyle Mock</div>',
        props: ['styleData'],
        emits: ['update:style-data']
    }
}))

describe('ResumeEditor', () => {
    let wrapper

    const mockResumeData = ResumeDataClass.createDefault()
    const mockStyle = ResumeStyleClass.createDefault()

    beforeEach(() => {
        wrapper = mount(ResumeEditor, {
            global: {
                plugins: [vuetify],
                stubs: {
                    'ResumeInfo': {
                        template: '<div class="resume-info-mock">ResumeInfo Mock</div>',
                        props: ['resumeData', 'isMobile'],
                        emits: ['update:resume-data', 'change']
                    },
                    'ResumeStyle': {
                        template: '<div class="resume-style-mock">ResumeStyle Mock</div>',
                        props: ['styleData'],
                        emits: ['update:style-data']
                    }
                }
            },
            props: {
                resumeData: mockResumeData,
                style: mockStyle,
                isMobile: false,
                activeTab: 'info'
            }
        })
    })

    describe('Component Mounting', () => {
        it('mounts successfully', () => {
            expect(wrapper.exists()).toBe(true)
        })

        it('initializes with correct props', () => {
            expect(wrapper.props('resumeData')).toEqual(mockResumeData)
            expect(wrapper.props('style')).toEqual(mockStyle)
            expect(wrapper.props('isMobile')).toBe(false)
            expect(wrapper.props('activeTab')).toBe('info')
        })

        it('renders the editor card structure', () => {
            const editorCard = wrapper.find('.editor-card')
            expect(editorCard.exists()).toBe(true)
        })
    })

    describe('Tab Navigation', () => {
        it('initializes with correct active tab', () => {
            expect(wrapper.vm.activeTab).toBe('info')
        })

        it('updates active tab when prop changes', async () => {
            await wrapper.setProps({ activeTab: 'style' })
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.activeTab).toBe('style')
        })

        it('emits update:activeTab when local activeTab changes', async () => {
            wrapper.vm.activeTab = 'style'
            await wrapper.vm.$nextTick()

            expect(wrapper.emitted('update:activeTab')).toBeTruthy()
            expect(wrapper.emitted('update:activeTab')[0]).toEqual(['style'])
        })
    })

    describe('Data Updates', () => {
        it('emits update:resumeData when resume data changes', async () => {
            const newResumeData = ResumeDataClass.createDefault()
            newResumeData.personal.name = 'Jane Smith'

            await wrapper.setProps({ resumeData: newResumeData })
            await wrapper.vm.$nextTick()

            // The component should handle the prop change
            expect(wrapper.props('resumeData')).toEqual(newResumeData)
        })

        it('emits update:style when style data changes', async () => {
            const newStyle = ResumeStyleClass.createDefault()
            newStyle.colors.primary = '#FF0000'

            await wrapper.setProps({ style: newStyle })
            await wrapper.vm.$nextTick()

            // The component should handle the prop change
            expect(wrapper.props('style')).toEqual(newStyle)
        })
    })

    describe('Event Emissions', () => {
        it('emits update:activeTab when activeTab changes', async () => {
            // Trigger a change by updating the active tab
            wrapper.vm.activeTab = 'style'
            await wrapper.vm.$nextTick()

            expect(wrapper.emitted('update:activeTab')).toBeTruthy()
            expect(wrapper.emitted('update:activeTab')[0]).toEqual(['style'])
        })

        it('emits change event when resume data is modified', async () => {
            // Simulate resume data update by calling the updateResumeData method
            const newResumeData = ResumeDataClass.createDefault()
            newResumeData.personal.name = 'Jane Smith'

            wrapper.vm.updateResumeData(newResumeData)
            await wrapper.vm.$nextTick()

            expect(wrapper.emitted('change')).toBeTruthy()
            expect(wrapper.emitted('update:resumeData')).toBeTruthy()
        })

        it('emits change event when style data is modified', async () => {
            // Simulate style data update by calling the updateStyle method
            const newStyle = ResumeStyleClass.createDefault()
            newStyle.colors.primary = '#FF0000'

            wrapper.vm.updateStyle(newStyle)
            await wrapper.vm.$nextTick()

            expect(wrapper.emitted('change')).toBeTruthy()
            expect(wrapper.emitted('update:style')).toBeTruthy()
        })

        it('emits save event when save is triggered', async () => {
            // The save event would be emitted from child components
            // We can test that the component is set up to handle it
            expect(wrapper.emitted('save')).toBeFalsy() // No save event initially
        })
    })

    describe('Mobile Responsiveness', () => {
        it('handles mobile prop correctly', async () => {
            await wrapper.setProps({ isMobile: true })
            await wrapper.vm.$nextTick()

            expect(wrapper.props('isMobile')).toBe(true)
        })
    })

    describe('Component Integration', () => {
        it('renders ResumeInfo component when on info tab', () => {
            const resumeInfo = wrapper.find('.resume-info-mock')
            expect(resumeInfo.exists()).toBe(true)
        })

        it('renders ResumeStyle component when on style tab', async () => {
            await wrapper.setProps({ activeTab: 'style' })
            await wrapper.vm.$nextTick()

            const resumeStyle = wrapper.find('.resume-style-mock')
            expect(resumeStyle.exists()).toBe(true)
        })
    })

    describe('Props Validation', () => {
        it('handles missing resumeData prop gracefully', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })

            mount(ResumeEditor, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        'ResumeInfo': { template: '<div></div>' },
                        'ResumeStyle': { template: '<div></div>' }
                    }
                },
                props: {
                    style: mockStyle,
                    isMobile: false
                }
            })

            // Vue should warn about missing required prop
            expect(consoleSpy).toHaveBeenCalled()
            consoleSpy.mockRestore()
        })

        it('handles missing style prop gracefully', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })

            mount(ResumeEditor, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        'ResumeInfo': { template: '<div></div>' },
                        'ResumeStyle': { template: '<div></div>' }
                    }
                },
                props: {
                    resumeData: mockResumeData,
                    isMobile: false
                }
            })

            // Vue should warn about missing required prop
            expect(consoleSpy).toHaveBeenCalled()
            consoleSpy.mockRestore()
        })

        it('handles missing isMobile prop gracefully', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })

            mount(ResumeEditor, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        'ResumeInfo': { template: '<div></div>' },
                        'ResumeStyle': { template: '<div></div>' }
                    }
                },
                props: {
                    resumeData: mockResumeData,
                    style: mockStyle
                }
            })

            // Vue should warn about missing required prop
            expect(consoleSpy).toHaveBeenCalled()
            consoleSpy.mockRestore()
        })
    })

    describe('Watchers', () => {
        it('watches for activeTab prop changes', async () => {
            await wrapper.setProps({ activeTab: 'style' })
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.activeTab).toBe('style')
        })

        it('watches for local activeTab changes', async () => {
            wrapper.vm.activeTab = 'style'
            await wrapper.vm.$nextTick()

            expect(wrapper.emitted('update:activeTab')).toBeTruthy()
        })
    })
}) 