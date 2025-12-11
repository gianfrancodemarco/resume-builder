import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TemplateFactory from '../TemplateFactory.vue'
import { vuetify } from '@/test/setup'

describe('TemplateFactory', () => {
    let wrapper

    const mockResumeData = {
        personal: {
            name: 'John Doe',
            title: 'Software Engineer',
            visible: true
        },
        experiences: [],
        experiencesVisible: true,
        education: [],
        educationVisible: true,
        customSections: []
    }

    const mockStyle = {
        colors: {
            primary: '#1976D2',
            text: '#000000',
            background: '#ffffff',
            sidebar: '#1976D2',
            link: '#1976D2'
        },
        typography: {
            headingFont: 'Arial',
            bodyFont: 'Arial',
            baseSize: 12,
            headingSize: 16
        },
        spacing: {
            section: 16,
            content: 8,
            sidebarWidth: 280
        }
    }

    beforeEach(() => {
        wrapper = mount(TemplateFactory, {
            global: {
                plugins: [vuetify]
            },
            props: {
                resumeData: mockResumeData,
                style: mockStyle,
                sidebarPosition: 'right'
            }
        })
    })

    describe('Template Selection', () => {
        it('loads TwoColumnTemplate for TwoColumnsBlue template', () => {
            const styleWithTemplate = {
                ...mockStyle,
                templateName: 'TwoColumnsBlue'
            }
            
            wrapper = mount(TemplateFactory, {
                global: {
                    plugins: [vuetify]
                },
                props: {
                    resumeData: mockResumeData,
                    style: styleWithTemplate,
                    sidebarPosition: 'right'
                }
            })

            expect(wrapper.vm.templateComponent.name).toBe('TwoColumnTemplate')
        })

        it('loads TwoColumnTemplate for TwoColumnsGreen template', () => {
            const styleWithTemplate = {
                ...mockStyle,
                templateName: 'TwoColumnsGreen'
            }
            
            wrapper = mount(TemplateFactory, {
                global: {
                    plugins: [vuetify]
                },
                props: {
                    resumeData: mockResumeData,
                    style: styleWithTemplate,
                    sidebarPosition: 'right'
                }
            })

            expect(wrapper.vm.templateComponent.name).toBe('TwoColumnTemplate')
        })

        it('loads OneColumnModern for OneColumnModern template', () => {
            const styleWithTemplate = {
                ...mockStyle,
                templateName: 'OneColumnModern'
            }
            
            wrapper = mount(TemplateFactory, {
                global: {
                    plugins: [vuetify]
                },
                props: {
                    resumeData: mockResumeData,
                    style: styleWithTemplate,
                    sidebarPosition: 'right'
                }
            })

            expect(wrapper.vm.templateComponent.name).toBe('OneColumnModern')
        })

        it('defaults to TwoColumnsBlue when no template name is specified', () => {
            expect(wrapper.vm.templateComponent.name).toBe('TwoColumnTemplate')
        })

        it('falls back to TwoColumnTemplate for unknown template', () => {
            const styleWithUnknownTemplate = {
                ...mockStyle,
                templateName: 'UnknownTemplate'
            }
            
            wrapper = mount(TemplateFactory, {
                global: {
                    plugins: [vuetify]
                },
                props: {
                    resumeData: mockResumeData,
                    style: styleWithUnknownTemplate,
                    sidebarPosition: 'right'
                }
            })

            expect(wrapper.vm.templateComponent.name).toBe('TwoColumnTemplate')
        })
    })

    describe('Props Passing', () => {
        it('passes all props to the selected template component', () => {
            const styleWithTemplate = {
                ...mockStyle,
                templateName: 'TwoColumnsBlue'
            }
            
            wrapper = mount(TemplateFactory, {
                global: {
                    plugins: [vuetify]
                },
                props: {
                    resumeData: mockResumeData,
                    style: styleWithTemplate,
                    downloadId: 'test-id',
                    sidebarPosition: 'left'
                }
            })

            const templateComponent = wrapper.findComponent({ name: 'TwoColumnTemplate' })
            expect(templateComponent.exists()).toBe(true)
            expect(templateComponent.props('resumeData')).toEqual(mockResumeData)
            expect(templateComponent.props('style')).toEqual(styleWithTemplate)
            expect(templateComponent.props('downloadId')).toBe('test-id')
            expect(templateComponent.props('sidebarPosition')).toBe('left')
        })
    })
}) 