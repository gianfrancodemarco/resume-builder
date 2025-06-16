import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ResumePreview from '@/components/ResumePreview.vue'
import { vuetify } from '@/test/setup'

describe('ResumePreview Style', () => {
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
        customSections: [],
        customSectionsVisible: true
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
        wrapper = mount(ResumePreview, {
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
            expect(previewElement.attributes('style')).toContain('--sidebar-color: #1976D2')
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