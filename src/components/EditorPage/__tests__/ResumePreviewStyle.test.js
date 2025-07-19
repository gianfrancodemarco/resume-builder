import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TemplateFactory from '@/components/EditorPage/templates/TemplateFactory.vue'
import { vuetify } from '@/test/setup'

describe('TemplateFactory Style', () => {
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
                isMobile: false
            }
        })
    })

    describe('Color Styles', () => {
        it('applies primary color correctly', () => {
            const previewElement = wrapper.find('.resume-preview')
            expect(previewElement.attributes('style')).toContain('--primary-color: #1976D2')
        })

        it('applies text color correctly', () => {
            const previewElement = wrapper.find('.resume-preview')
            expect(previewElement.attributes('style')).toContain('--text-color: #000000')
        })

        it('applies background color correctly', () => {
            const previewElement = wrapper.find('.resume-preview')
            expect(previewElement.attributes('style')).toContain('--background-color: #ffffff')
        })

        it('applies sidebar color correctly', () => {
            const previewElement = wrapper.find('.resume-preview')
            expect(previewElement.attributes('style')).toContain('--sidebar-background-color: #1976D2')
        })

        it('applies link color correctly', () => {
            const previewElement = wrapper.find('.resume-preview')
            expect(previewElement.attributes('style')).toContain('--link-color: #1976D2')
        })
    })

    describe('Typography Styles', () => {
        it('applies heading font correctly', () => {
            const previewElement = wrapper.find('.resume-preview')
            expect(previewElement.attributes('style')).toContain('--heading-font: Arial')
        })

        it('applies body font correctly', () => {
            const previewElement = wrapper.find('.resume-preview')
            expect(previewElement.attributes('style')).toContain('--body-font: Arial')
        })

        it('applies base font size correctly', () => {
            const previewElement = wrapper.find('.resume-preview')
            expect(previewElement.attributes('style')).toContain('--base-size: 12px')
        })

        it('applies heading font size correctly', () => {
            const previewElement = wrapper.find('.resume-preview')
            expect(previewElement.attributes('style')).toContain('--heading-size: 16px')
        })
    })

    describe('Spacing Styles', () => {
        it('applies section spacing correctly', () => {
            const previewElement = wrapper.find('.resume-preview')
            expect(previewElement.attributes('style')).toContain('--section-spacing: 16px')
        })

        it('applies content spacing correctly', () => {
            const previewElement = wrapper.find('.resume-preview')
            expect(previewElement.attributes('style')).toContain('--content-spacing: 8px')
        })

        it('applies sidebar width correctly', () => {
            const previewElement = wrapper.find('.resume-preview')
            expect(previewElement.attributes('style')).toContain('--sidebar-width: 280px')
        })
    })

    describe('Sidebar Width Functionality', () => {
        it('applies sidebar width of 0 correctly', async () => {
            const styleWithZeroSidebar = {
                ...mockStyle,
                spacing: {
                    ...mockStyle.spacing,
                    sidebarWidth: 0
                }
            }

            await wrapper.setProps({ style: styleWithZeroSidebar })

            const previewElement = wrapper.find('.resume-preview')
            expect(previewElement.attributes('style')).toContain('--sidebar-width: 0px')
        })

        it('hides sidebar when width is 0', async () => {
            const styleWithZeroSidebar = {
                ...mockStyle,
                spacing: {
                    ...mockStyle.spacing,
                    sidebarWidth: 0
                }
            }

            await wrapper.setProps({ style: styleWithZeroSidebar })

            const sidebar = wrapper.find('.sidebar')
            expect(sidebar.exists()).toBe(false)
        })

        it('shows sidebar when width is greater than 0', async () => {
            const styleWithSidebar = {
                ...mockStyle,
                spacing: {
                    ...mockStyle.spacing,
                    sidebarWidth: 200
                }
            }

            await wrapper.setProps({ style: styleWithSidebar })

            const sidebar = wrapper.find('.sidebar')
            expect(sidebar.exists()).toBe(true)
        })

        it('applies correct sidebar width CSS variable', async () => {
            const styleWithCustomSidebar = {
                ...mockStyle,
                spacing: {
                    ...mockStyle.spacing,
                    sidebarWidth: 150
                }
            }

            await wrapper.setProps({ style: styleWithCustomSidebar })

            const previewElement = wrapper.find('.resume-preview')
            expect(previewElement.attributes('style')).toContain('--sidebar-width: 150px')
        })
    })

    describe('Sidebar Position Functionality', () => {
        it('applies sidebar-left class when sidebar is on left', async () => {
            const styleWithLeftSidebar = {
                ...mockStyle,
                spacing: {
                    ...mockStyle.spacing,
                    sidebarLeft: true
                }
            }

            await wrapper.setProps({
                style: styleWithLeftSidebar,
                sidebarPosition: 'left'
            })

            const container = wrapper.find('.container')
            expect(container.classes()).toContain('sidebar-left')
        })

        it('does not apply sidebar-left class when sidebar is on right', async () => {
            const styleWithRightSidebar = {
                ...mockStyle,
                spacing: {
                    ...mockStyle.spacing,
                    sidebarLeft: false
                }
            }

            await wrapper.setProps({
                style: styleWithRightSidebar,
                sidebarPosition: 'right'
            })

            const container = wrapper.find('.container')
            expect(container.classes()).not.toContain('sidebar-left')
        })
    })

    describe('Custom Sections with Sidebar', () => {
        it('shows sidebar custom sections when sidebar is present', async () => {
            const resumeDataWithSidebarSections = {
                ...mockResumeData,
                customSections: [
                    {
                        title: 'Skills',
                        content: 'JavaScript, Vue.js, CSS',
                        position: 'sidebar',
                        visible: true
                    }
                ]
            }

            const styleWithSidebar = {
                ...mockStyle,
                spacing: {
                    ...mockStyle.spacing,
                    sidebarWidth: 200
                }
            }

            await wrapper.setProps({
                resumeData: resumeDataWithSidebarSections,
                style: styleWithSidebar
            })

            const sidebar = wrapper.find('.sidebar')
            expect(sidebar.exists()).toBe(true)
            expect(sidebar.text()).toContain('Skills')
        })

        it('moves sidebar sections to main content when sidebar width is 0', async () => {
            const resumeDataWithSidebarSections = {
                ...mockResumeData,
                customSections: [
                    {
                        title: 'Skills',
                        content: 'JavaScript, Vue.js, CSS',
                        position: 'sidebar',
                        visible: true
                    }
                ]
            }

            const styleWithZeroSidebar = {
                ...mockStyle,
                spacing: {
                    ...mockStyle.spacing,
                    sidebarWidth: 0
                }
            }

            await wrapper.setProps({
                resumeData: resumeDataWithSidebarSections,
                style: styleWithZeroSidebar
            })

            const sidebar = wrapper.find('.sidebar')
            expect(sidebar.exists()).toBe(false)

            const content = wrapper.find('.content')
            expect(content.text()).toContain('Skills')
        })
    })

    describe('Computed Properties', () => {
        it('correctly computes isSidebarPresent when sidebar width is 0', async () => {
            const styleWithZeroSidebar = {
                ...mockStyle,
                templateName: 'TwoColumnsBlue',
                spacing: {
                    ...mockStyle.spacing,
                    sidebarWidth: 0
                }
            }

            await wrapper.setProps({ style: styleWithZeroSidebar })

            // Access computed properties through the template component
            const templateComponent = wrapper.findComponent({ name: 'TwoColumnTemplate' })
            expect(templateComponent.vm.isSidebarPresent).toBe(false)
        })

        it('correctly computes isSidebarPresent when sidebar width is greater than 0', async () => {
            const styleWithSidebar = {
                ...mockStyle,
                spacing: {
                    ...mockStyle.spacing,
                    sidebarWidth: 200
                }
            }

            await wrapper.setProps({ style: styleWithSidebar })

            // Access computed properties through the template component
            const templateComponent = wrapper.findComponent({ name: 'TwoColumnTemplate' })
            expect(templateComponent.vm.isSidebarPresent).toBe(true)
        })

        it('correctly filters sidebar custom sections', async () => {
            const resumeDataWithMixedSections = {
                ...mockResumeData,
                customSections: [
                    {
                        title: 'Skills',
                        content: 'JavaScript, Vue.js',
                        position: 'sidebar',
                        visible: true
                    },
                    {
                        title: 'Experience',
                        content: '5 years of development',
                        position: 'main',
                        visible: true
                    }
                ]
            }

            const styleWithSidebar = {
                ...mockStyle,
                spacing: {
                    ...mockStyle.spacing,
                    sidebarWidth: 200
                }
            }

            await wrapper.setProps({
                resumeData: resumeDataWithMixedSections,
                style: styleWithSidebar
            })

            // Access computed properties through the template component
            const templateComponent = wrapper.findComponent({ name: 'TwoColumnTemplate' })
            expect(templateComponent.vm.sidebarCustomSections).toHaveLength(1)
            expect(templateComponent.vm.sidebarCustomSections[0].title).toBe('Skills')
        })

        it('moves all sections to main content when sidebar is not present', async () => {
            const resumeDataWithMixedSections = {
                ...mockResumeData,
                customSections: [
                    {
                        title: 'Skills',
                        content: 'JavaScript, Vue.js',
                        position: 'sidebar',
                        visible: true
                    },
                    {
                        title: 'Experience',
                        content: '5 years of development',
                        position: 'main',
                        visible: true
                    }
                ]
            }

            const styleWithZeroSidebar = {
                ...mockStyle,
                templateName: 'TwoColumnsBlue',
                spacing: {
                    ...mockStyle.spacing,
                    sidebarWidth: 0
                }
            }

            await wrapper.setProps({
                resumeData: resumeDataWithMixedSections,
                style: styleWithZeroSidebar
            })

            // Access computed properties through the template component
            const templateComponent = wrapper.findComponent({ name: 'TwoColumnTemplate' })
            expect(templateComponent.vm.mainCustomSections).toHaveLength(2)
        })
    })

    describe('Style Updates', () => {
        it('updates styles when props change', async () => {
            const newStyle = {
                colors: {
                    primary: '#FF0000',
                    text: '#333333',
                    background: '#F5F5F5',
                    sidebar: '#FF0000',
                    link: '#FF0000'
                },
                typography: {
                    headingFont: 'Times New Roman',
                    bodyFont: 'Times New Roman',
                    baseSize: 14,
                    headingSize: 20
                },
                spacing: {
                    section: 24,
                    content: 12,
                    sidebarWidth: 300
                }
            }

            await wrapper.setProps({
                style: newStyle
            })

            const previewElement = wrapper.find('.resume-preview')
            expect(previewElement.attributes('style')).toContain('--primary-color: #FF0000')
            expect(previewElement.attributes('style')).toContain('--text-color: #333333')
            expect(previewElement.attributes('style')).toContain('--background-color: #F5F5F5')
            expect(previewElement.attributes('style')).toContain('--heading-font: Times New Roman')
            expect(previewElement.attributes('style')).toContain('--body-font: Times New Roman')
            expect(previewElement.attributes('style')).toContain('--base-size: 14px')
            expect(previewElement.attributes('style')).toContain('--heading-size: 20px')
            expect(previewElement.attributes('style')).toContain('--section-spacing: 24px')
            expect(previewElement.attributes('style')).toContain('--content-spacing: 12px')
            expect(previewElement.attributes('style')).toContain('--sidebar-width: 300px')
        })
    })
}) 