import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ResumePreview from '@/components/EditorPage/ResumePreview.vue'
import { vuetify } from '@/test/setup'
import { ResumeDataV2 } from '@/models/ResumeData/ResumeDataV2'

describe('ResumePreview Content', () => {
    let wrapper

    const mockResumeData = new ResumeDataV2({
        personal: {
            name: 'John Doe',
            title: 'Software Engineer',
            visible: true
        },
        experiences: [
            {
                title: 'Senior Software Engineer',
                company: 'Tech Solutions Inc. - Milan',
                period: '2020 - Present',
                description: 'Led the development of enterprise-level web applications using Vue.js and Node.js. Implemented CI/CD pipelines and improved application performance by 40%.',
                visible: true
            },
            {
                title: 'Full Stack Developer',
                company: 'Digital Innovations - Rome',
                period: '2018 - 2020',
                description: 'Developed and maintained multiple web applications. Collaborated with UX designers to implement responsive interfaces and improve user experience.',
                visible: true
            }
        ],
        experiencesVisible: true,
        experiencesSectionName: 'Employment History',
        education: [
            {
                degree: 'Master in Computer Science',
                school: 'University of Milan',
                period: '2016 - 2018',
                mark: '110/110',
                thesis: 'Advanced Web Development Techniques and Best Practices',
                visible: true
            },
            {
                degree: 'Bachelor in Computer Engineering',
                school: 'University of Rome',
                period: '2013 - 2016',
                mark: '108/110',
                thesis: 'Introduction to Modern Web Technologies',
                visible: true
            }
        ],
        educationVisible: true,
        educationSectionName: 'Education',
        customSections: [
            {
                title: 'About Me',
                content: '<p>Passionate software engineer with a strong focus on web development and user experience.</p><p>Skilled in both frontend and backend development.</p>',
                visible: true,
                position: 'sidebar'
            },
            {
                title: 'Contact Details',
                content: '<p>New York, USA</p><p><a href="mailto:john.doe@example.com">john.doe@example.com</a></p>',
                visible: true,
                position: 'sidebar'
            },
            {
                title: 'Technical Skills',
                content: 'Vue.js<br/>JavaScript<br/>TypeScript<br/>HTML/CSS<br/>Node.js',
                visible: true,
                position: 'sidebar'
            },
            {
                title: 'Languages',
                content: '(Italian)[BAR:100]<br/>(English)[BAR:90]<br/>(Spanish)[BAR:70]',
                visible: true,
                position: 'sidebar'
            }
        ]
    })

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
        },
        customCSS: ''
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

    describe('Personal Information', () => {
        it('displays personal information correctly', () => {
            expect(wrapper.text()).toContain('John Doe')
            expect(wrapper.text()).toContain('Software Engineer')
        })
    })

    describe('Experience Section', () => {
        it('displays experience section when visible', () => {
            expect(wrapper.text()).toContain('Senior Software Engineer')
            expect(wrapper.text()).toContain('Tech Solutions Inc. - Milan')
            expect(wrapper.text()).toContain('2020 - Present')
            expect(wrapper.text()).toContain('Led the development of enterprise-level web applications using Vue.js and Node.js. Implemented CI/CD pipelines and improved application performance by 40%.')
            expect(wrapper.text()).toContain('Full Stack Developer')
            expect(wrapper.text()).toContain('Digital Innovations - Rome')
            expect(wrapper.text()).toContain('2018 - 2020')
            expect(wrapper.text()).toContain('Developed and maintained multiple web applications. Collaborated with UX designers to implement responsive interfaces and improve user experience.')
        })

        it('hides experience section when not visible', async () => {
            const updatedData = new ResumeDataV2({
                ...mockResumeData.toJSON(),
                experiencesVisible: false
            })
            await wrapper.setProps({
                resumeData: updatedData
            })
            expect(wrapper.text()).not.toContain('Senior Software Engineer')
            expect(wrapper.text()).not.toContain('Tech Solutions Inc. - Milan')
            expect(wrapper.text()).not.toContain('2020 - Present')
            expect(wrapper.text()).not.toContain('Led the development of enterprise-level web applications using Vue.js and Node.js. Implemented CI/CD pipelines and improved application performance by 40%.')
            expect(wrapper.text()).not.toContain('Full Stack Developer')
            expect(wrapper.text()).not.toContain('Digital Innovations - Rome')
            expect(wrapper.text()).not.toContain('2018 - 2020')
            expect(wrapper.text()).not.toContain('Developed and maintained multiple web applications. Collaborated with UX designers to implement responsive interfaces and improve user experience.')
        })
    })

    describe('Education Section', () => {
        it('displays education section when visible', () => {
            expect(wrapper.text()).toContain('Master in Computer Science')
            expect(wrapper.text()).toContain('University of Milan')
            expect(wrapper.text()).toContain('2016 - 2018')
            expect(wrapper.text()).toContain('110/110')
            expect(wrapper.text()).toContain('Advanced Web Development Techniques and Best Practices')
            expect(wrapper.text()).toContain('Bachelor in Computer Engineering')
            expect(wrapper.text()).toContain('University of Rome')
            expect(wrapper.text()).toContain('2013 - 2016')
            expect(wrapper.text()).toContain('108/110')
            expect(wrapper.text()).toContain('Introduction to Modern Web Technologies')
        })

        it('hides education section when not visible', async () => {
            const updatedData = new ResumeDataV2({
                ...mockResumeData.toJSON(),
                educationVisible: false
            })
            await wrapper.setProps({
                resumeData: updatedData
            })
            expect(wrapper.text()).not.toContain('Master in Computer Science')
            expect(wrapper.text()).not.toContain('University of Milan')
            expect(wrapper.text()).not.toContain('2016 - 2018')
            expect(wrapper.text()).not.toContain('110/110')
            expect(wrapper.text()).not.toContain('Advanced Web Development Techniques and Best Practices')
            expect(wrapper.text()).not.toContain('Bachelor in Computer Engineering')
            expect(wrapper.text()).not.toContain('University of Rome')
            expect(wrapper.text()).not.toContain('2013 - 2016')
            expect(wrapper.text()).not.toContain('108/110')
            expect(wrapper.text()).not.toContain('Introduction to Modern Web Technologies')
        })
    })

    describe('Custom Sections', () => {
        it('displays custom sections correctly', () => {
            expect(wrapper.text()).toContain('About Me')
            expect(wrapper.text()).toContain('Passionate software engineer with a strong focus on web development and user experience.')
            expect(wrapper.text()).toContain('Skilled in both frontend and backend development.')
            expect(wrapper.text()).toContain('Contact Details')
            expect(wrapper.text()).toContain('New York, USA')
            expect(wrapper.text()).toContain('john.doe@example.com')
            expect(wrapper.text()).toContain('Technical Skills')
            expect(wrapper.text()).toContain('Vue.js')
            expect(wrapper.text()).toContain('JavaScript')
            expect(wrapper.text()).toContain('TypeScript')
        })
    })

    describe('Custom CSS', () => {
        it('injects custom CSS into document head when provided', async () => {
            const styleWithCustomCSS = {
                ...mockStyle,
                customCSS: 'h1 { color: red !important; }'
            }
            await wrapper.setProps({
                style: styleWithCustomCSS
            })

            // Check that the style element is injected into document head
            const styleElement = document.getElementById('resume-custom-css')
            expect(styleElement).toBeTruthy()
            expect(styleElement.textContent).toContain('h1 { color: red !important; }')
        })

        it('removes custom CSS when no custom CSS is provided', async () => {
            // First add some custom CSS
            const styleWithCustomCSS = {
                ...mockStyle,
                customCSS: 'h1 { color: red !important; }'
            }
            await wrapper.setProps({
                style: styleWithCustomCSS
            })

            // Then remove it
            const styleWithoutCustomCSS = {
                ...mockStyle,
                customCSS: ''
            }
            await wrapper.setProps({
                style: styleWithoutCustomCSS
            })

            // Check that the style element is removed
            const styleElement = document.getElementById('resume-custom-css')
            expect(styleElement).toBeNull()
        })

        it('cleans up custom CSS on component unmount', async () => {
            const styleWithCustomCSS = {
                ...mockStyle,
                customCSS: 'h1 { color: red !important; }'
            }
            await wrapper.setProps({
                style: styleWithCustomCSS
            })

            // Verify CSS is injected
            expect(document.getElementById('resume-custom-css')).toBeTruthy()

            // Unmount component
            await wrapper.unmount()

            // Verify CSS is cleaned up
            expect(document.getElementById('resume-custom-css')).toBeNull()
        })
    })

    describe('Custom Sections Visibility', () => {
        it('displays all custom section content', () => {
            expect(wrapper.text()).toContain('HTML/CSS')
            expect(wrapper.text()).toContain('Node.js')
            expect(wrapper.text()).toContain('Languages')
            expect(wrapper.text()).toContain('Italian')
            expect(wrapper.text()).toContain('English')
            expect(wrapper.text()).toContain('Spanish')
        })

        it('hides custom sections when not visible', async () => {
            const updatedData = new ResumeDataV2({
                ...mockResumeData.toJSON(),
                customSections: mockResumeData.customSections.map(section => ({
                    ...section,
                    visible: false
                }))
            })
            await wrapper.setProps({
                resumeData: updatedData
            })
            expect(wrapper.text()).not.toContain('About Me')
            expect(wrapper.text()).not.toContain('Contact Details')
            expect(wrapper.text()).not.toContain('Technical Skills')
            expect(wrapper.text()).not.toContain('Languages')
        })
    })
}) 