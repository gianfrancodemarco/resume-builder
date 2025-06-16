import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ResumeEditor from '@/components/EditorPage/ResumeEditor.vue'
import { vuetify } from '@/test/setup'

describe('ResumeEditor', () => {
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
                description: 'Led the development of enterprise-level web applications.',
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
                thesis: 'Advanced Web Development Techniques',
                visible: true
            }
        ],
        educationVisible: true,
        customSections: [
            {
                title: 'Skills',
                type: 'list',
                visible: true,
                items: ['Vue.js', 'JavaScript', 'Node.js']
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
        wrapper = mount(ResumeEditor, {
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

    describe('Component Mounting', () => {
        it('mounts successfully', () => {
            expect(wrapper.exists()).toBe(true)
        })

        it('initializes with correct props', () => {
            expect(wrapper.props('resumeData')).toEqual(mockResumeData)
            expect(wrapper.props('style')).toEqual(mockStyle)
            expect(wrapper.props('isMobile')).toBe(false)
        })
    })

    describe('Personal Information', () => {
        it('updates personal information', async () => {
            const nameInput = wrapper.find('input[aria-label="Name"]')
            const titleInput = wrapper.find('input[aria-label="Title"]')

            await nameInput.setValue('Jane Smith')
            await titleInput.setValue('Frontend Developer')
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.resumeData.personal.name).toBe('Jane Smith')
            expect(wrapper.vm.resumeData.personal.title).toBe('Frontend Developer')
        })
    })

    describe('Experience Section', () => {
        it('adds new experience', async () => {
            // Expand the experience panel first
            const experiencePanelTitle = wrapper.find('.v-expansion-panel-title')
            await experiencePanelTitle.trigger('click')
            await wrapper.vm.$nextTick()

            const addButton = wrapper.find('.v-btn[aria-label="Add Experience"]')
            await addButton.trigger('click')
            await wrapper.vm.$nextTick()

            // Expand the newly added experience panel
            const newExperiencePanel = wrapper.find('.v-expansion-panels').findAllComponents('.experience-card').at(-1).find('button')
            await newExperiencePanel.trigger('click')
            await wrapper.vm.$nextTick()

            const titleInput = wrapper.find('input[aria-label="Job title"]')
            const companyInput = wrapper.find('input[aria-label="Company"]')
            const periodInput = wrapper.find('input[aria-label="Period"]')
            const descriptionInput = wrapper.find('div[role="textbox"]').find('p')

            await titleInput.setValue('Full Stack Developer')
            await companyInput.setValue('Tech Corp')
            await periodInput.setValue('2019 - 2020')
            descriptionInput.element.textContent = 'Developed web applications'
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.resumeData.experiences).toContainEqual(expect.objectContaining({
                title: 'Full Stack Developer',
                company: 'Tech Corp',
                period: '2019 - 2020',
                description: '<p>Developed web applications</p>',
                visible: true
            }))
        })

        // it('removes experience', async () => {
        //     // Expand the experience panel first
        //     const experiencePanelTitle = wrapper.find('.v-expansion-panels').findAllComponents('.experience-card').at(0).find('button')
        //     await experiencePanelTitle.trigger('click')
        //     await wrapper.vm.$nextTick()

        //     const deleteButton = wrapper.find('.delete-icon')
        //     await deleteButton.trigger('click')
        //     await wrapper.vm.$nextTick()
        //     await deleteButton.trigger('click') // Confirm deletion
        //     await wrapper.vm.$nextTick()

        //     expect(wrapper.vm.resumeData.experiences).toHaveLength(0)
        // })

        // it('toggles experience visibility', async () => {
        //     // Expand the experience panel first
        //     const experiencePanelTitle = wrapper.find('.v-expansion-panels').findAllComponents('.experience-card').at(0).find('button')
        //     await experiencePanelTitle.trigger('click')
        //     await wrapper.vm.$nextTick()

        //     const visibilityIcon = wrapper.find('.visibility-icon')
        //     await visibilityIcon.trigger('click')
        //     await wrapper.vm.$nextTick()

        //     expect(wrapper.vm.resumeData.experiencesVisible).toBe(false)
        // })
    })

    describe('Education Section', () => {
        it('adds new education', async () => {
            // Expand the education panel first
            const educationPanelTitle = wrapper.find('.v-expansion-panels').findAllComponents('.v-expansion-panel').at(1).find('button')
            await educationPanelTitle.trigger('click')
            await wrapper.vm.$nextTick()

            const addButton = wrapper.find('.v-btn[aria-label="Add Education"]')
            await addButton.trigger('click')
            await wrapper.vm.$nextTick()

            // Expand the newly added education panel
            const newEducationPanel = wrapper.find('.v-expansion-panels').findAllComponents('.education-card').at(-1).find('button')
            await newEducationPanel.trigger('click')
            await wrapper.vm.$nextTick()

            const degreeInput = wrapper.find('input[aria-label="Degree"]')
            const schoolInput = wrapper.find('input[aria-label="School"]')
            const periodInput = wrapper.find('input[aria-label="Period"]')
            const markInput = wrapper.find('input[aria-label="Grade"]')
            const thesisInput = wrapper.find('div[role="textbox"]').find('p')

            await degreeInput.setValue('Bachelor in Computer Science')
            await schoolInput.setValue('University of Rome')
            await periodInput.setValue('2013 - 2016')
            await markInput.setValue('108/110')
            thesisInput.element.textContent = 'Web Development Basics'
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.resumeData.education).toContainEqual(expect.objectContaining({
                degree: 'Bachelor in Computer Science',
                school: 'University of Rome',
                period: '2013 - 2016',
                mark: '108/110',
                thesis: '<p>Web Development Basics</p>',
                visible: true
            }))
        })

        // it('removes education', async () => {
        //     // Expand the education panel first
        //     const educationPanelTitle = wrapper.find('.v-expansion-panel-title:nth-child(2)')
        //     await educationPanelTitle.trigger('click')
        //     await wrapper.vm.$nextTick()

        //     const deleteButton = wrapper.find('.delete-icon')
        //     await deleteButton.trigger('click')
        //     await wrapper.vm.$nextTick()
        //     await deleteButton.trigger('click') // Confirm deletion
        //     await wrapper.vm.$nextTick()

        //     expect(wrapper.vm.resumeData.education).toHaveLength(0)
        // })

        // it('toggles education visibility', async () => {
        //     // Expand the education panel first
        //     const educationPanelTitle = wrapper.find('.v-expansion-panel-title:nth-child(2)')
        //     await educationPanelTitle.trigger('click')
        //     await wrapper.vm.$nextTick()

        //     const visibilityIcon = wrapper.find('.visibility-icon')
        //     await visibilityIcon.trigger('click')
        //     await wrapper.vm.$nextTick()

        //     expect(wrapper.vm.resumeData.educationVisible).toBe(false)
        // })
    })

    describe('Custom Sections', () => {
        it('adds new custom section', async () => {
            const addButton = wrapper.find('.v-btn[aria-label="Add custom section"]')
            await addButton.trigger('click')
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.resumeData.customSections).toContainEqual(expect.objectContaining({
                title: 'New Section',
                type: 'text',
                items: [],
                visible: true
            }))
        })

        // it('changes section type', async () => {
        //     // Expand the custom section panel first
        //     const customSectionPanelTitle = wrapper.find('.v-expansion-panel-title:nth-child(3)')
        //     await customSectionPanelTitle.trigger('click')
        //     await wrapper.vm.$nextTick()

        //     const sectionTypeSelect = wrapper.find('input[aria-label="Type"]')
        //     await sectionTypeSelect.trigger('click')
        //     await wrapper.vm.$nextTick()

        //     const languageOption = wrapper.find('.v-list-item:contains("Languages")')
        //     await languageOption.trigger('click')
        //     await wrapper.vm.$nextTick()

        //     expect(wrapper.vm.resumeData.customSections[0].type).toBe('languages')
        // })

        // it('adds items to list section', async () => {
        //     // Expand the custom section panel first
        //     const customSectionPanelTitle = wrapper.find('.v-expansion-panel-title:nth-child(3)')
        //     await customSectionPanelTitle.trigger('click')
        //     await wrapper.vm.$nextTick()

        //     const addButton = wrapper.find('.v-btn[aria-label="Add item"]')
        //     const itemInput = wrapper.find('input[aria-label="Item"]')

        //     await itemInput.setValue('React')
        //     await addButton.trigger('click')
        //     await wrapper.vm.$nextTick()

        //     expect(wrapper.vm.resumeData.customSections[0].items).toContain('React')
        // })

        // it('removes custom section', async () => {
        //     // Expand the custom section panel first
        //     const customSectionPanelTitle = wrapper.find('.v-expansion-panel-title:nth-child(3)')
        //     await customSectionPanelTitle.trigger('click')
        //     await wrapper.vm.$nextTick()

        //     const deleteButton = wrapper.find('.delete-icon')
        //     await deleteButton.trigger('click')
        //     await wrapper.vm.$nextTick()
        //     await deleteButton.trigger('click') // Confirm deletion
        //     await wrapper.vm.$nextTick()

        //     expect(wrapper.vm.resumeData.customSections).toHaveLength(0)
        // })
    })

    // describe('Style Management', () => {
    //     // it('updates style data', async () => {
    //     //     const newStyle = {
    //     //         colors: {
    //     //             primary: '#FF0000',
    //     //             text: '#333333',
    //     //             background: '#F5F5F5',
    //     //             sidebar: '#FF0000',
    //     //             link: '#FF0000'
    //     //         },
    //     //         typography: {
    //     //             headingFont: 'Times New Roman',
    //     //             bodyFont: 'Times New Roman',
    //     //             baseSize: 14,
    //     //             headingSize: 20
    //     //         },
    //     //         spacing: {
    //     //             section: 24,
    //     //             content: 12,
    //     //             sidebarWidth: 300
    //     //         }
    //     //     }

    //     //     await wrapper.setProps({ style: newStyle })
    //     //     await wrapper.vm.$nextTick()
    //     //     expect(wrapper.vm.styleData).toEqual(newStyle)
    //     // })
    // })

    // describe('Event Emissions', () => {
    //     //     it('emits update:resumeData when data changes', async () => {
    //     //         const nameInput = wrapper.find('input[aria-label="Name"]')
    //     //         await nameInput.setValue('Jane Smith')
    //     //         await wrapper.vm.$nextTick()

    //     //         expect(wrapper.emitted('update:resumeData')).toBeTruthy()
    //     //     })

    //     //     it('emits update:style when style changes', async () => {
    //     //         const newStyle = { ...mockStyle }
    //     //         await wrapper.setProps({ style: newStyle })
    //     //         await wrapper.vm.$nextTick()

    //     //         expect(wrapper.emitted('update:style')).toBeTruthy()
    //     //     })

    //     //     it('emits change event when data is modified', async () => {
    //     //         const nameInput = wrapper.find('input[aria-label="Name"]')
    //     //         await nameInput.setValue('Jane Smith')
    //     //         await wrapper.vm.$nextTick()

    //     //         expect(wrapper.emitted('change')).toBeTruthy()
    //     //     })
    //     // })
}) 