import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ResumePreview from '@/components/EditorPage/ResumePreview.vue'
import { vuetify } from '@/test/setup'

describe('ResumePreview Content', () => {
    let wrapper

    const mockResumeData = {
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
        customSections: [
            {
                title: 'About Me',
                type: 'italic',
                visible: true,
                items: [
                    { value: 'Passionate software engineer with a strong focus on web development and user experience.', isLink: false, href: '' },
                    { value: 'Skilled in both frontend and backend development.', isLink: false, href: '' }
                ]
            },
            {
                title: 'Contact Details',
                type: 'text',
                visible: true,
                items: [
                    { value: 'New York, USA', isLink: false, href: '' },
                    { value: 'john.doe@example.com', isLink: true, href: 'mailto:john.doe@example.com' }
                ]
            },
            {
                title: 'Technical Skills',
                type: 'list',
                visible: true,
                items: [{
                    value: 'Vue.js',
                    isLink: false,
                    href: ''
                },
                { value: 'JavaScript', isLink: false, href: '' },
                { value: 'TypeScript', isLink: false, href: '' },
                { value: 'HTML/CSS', isLink: false, href: '' },
                { value: 'Node.js', isLink: false, href: '' }
                ]
            },
            {
                title: 'Languages',
                type: 'languages',
                visible: true,
                items: [
                    { name: 'Italian', proficiency: 100 },
                    { name: 'English', proficiency: 90 },
                    { name: 'Spanish', proficiency: 70 }
                ]
            }
        ],
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
            await wrapper.setProps({
                resumeData: {
                    ...mockResumeData,
                    experiencesVisible: false
                }
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
            await wrapper.setProps({
                resumeData: {
                    ...mockResumeData,
                    educationVisible: false
                }
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
            expect(wrapper.text()).toContain('HTML/CSS')
            expect(wrapper.text()).toContain('Node.js')
            expect(wrapper.text()).toContain('Languages')
            expect(wrapper.text()).toContain('Italian')
            expect(wrapper.text()).toContain('English')
            expect(wrapper.text()).toContain('Spanish')
        })
    })
}) 