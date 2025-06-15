import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EditorPage from '../../views/EditorPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { vuetify } from '../../test/setup'

describe('EditorPage', () => {
    let wrapper
    let router

    beforeEach(() => {
        // Create router instance with a default route
        router = createRouter({
            history: createWebHistory(),
            routes: [
                {
                    path: '/',
                    name: 'editor',
                    component: { template: '<div>Editor</div>' }
                }
            ]
        })

        // Mock window.URL.createObjectURL and revokeObjectURL
        window.URL.createObjectURL = vi.fn()
        window.URL.revokeObjectURL = vi.fn()

        // Mock Blob and text() method
        global.Blob = vi.fn((content) => ({
            type: 'application/json',
            text: () => Promise.resolve(content[0])
        }))

        // Mock window.sa_event
        window.sa_event = vi.fn()

        // Create a fresh Vuetify instance for each test
        const testVuetify = vuetify

        wrapper = mount(EditorPage, {
            global: {
                plugins: [router, testVuetify],
                stubs: {
                    'v-app': true,
                    'v-main': true,
                    'v-btn': true,
                    'v-expansion-panels': true,
                    'v-expansion-panel': true,
                    'v-expansion-panel-title': true,
                    'v-expansion-panel-text': true,
                    'v-tabs': true,
                    'v-tab': true,
                    'v-slide-group': true
                }
            }
        })
    })

    describe('Export JSON', () => {
        it('exports resume data as JSON file', async () => {
            // Trigger export
            await wrapper.vm.handleExportJSON()

            // Verify createObjectURL was called with correct data
            expect(window.URL.createObjectURL).toHaveBeenCalled()
            const blob = window.URL.createObjectURL.mock.calls[0][0]
            expect(blob.type).toBe('application/json')

            // Verify the JSON content
            const jsonContent = JSON.parse(await blob.text())
            expect(jsonContent).toHaveProperty('version', 1)
            expect(jsonContent).toHaveProperty('resumeData')
            expect(jsonContent).toHaveProperty('resumeStyle')

            // Verify the resume data structure
            expect(jsonContent.resumeData).toHaveProperty('personal')
            expect(jsonContent.resumeData).toHaveProperty('experiences')
            expect(jsonContent.resumeData).toHaveProperty('education')
            expect(jsonContent.resumeData).toHaveProperty('customSections')

            // Verify the style data structure
            expect(jsonContent.resumeStyle).toHaveProperty('colors')
            expect(jsonContent.resumeStyle).toHaveProperty('typography')
            expect(jsonContent.resumeStyle).toHaveProperty('spacing')

            // Verify cleanup
            expect(window.URL.revokeObjectURL).toHaveBeenCalled()
        })

        it('generates correct filename from resume data', async () => {
            // Set resume data with specific name and title
            wrapper.vm.resumeData = {
                personal: {
                    name: 'Luke Skywalker',
                    title: 'Jedi Knight'
                }
            }

            // Spy on the getFilename method
            const getFilenameSpy = vi.spyOn(wrapper.vm, 'getFilename').mockReturnValue('Luke_Skywalker_Jedi_Knight.json')

            // Spy on the exportJSON method to ensure it's called
            const exportJSONSpy = vi.spyOn(wrapper.vm, 'exportJSON').mockImplementation(() => {
                wrapper.vm.getFilename('json')
            })

            // Trigger the export function
            await wrapper.vm.handleExportJSON()

            // Verify that getFilename was called with the correct argument
            expect(getFilenameSpy).toHaveBeenCalledWith('json')

            // Restore original methods
            getFilenameSpy.mockRestore()
            exportJSONSpy.mockRestore()
        })

        it('generates fallback filename when name/title is missing', async () => {
            // Set resume data with missing name/title
            wrapper.vm.resumeData = {
                personal: {}
            }

            // Mock the getFilename function
            const originalGetFilename = wrapper.vm.getFilename
            wrapper.vm.getFilename = vi.fn(() => 'resume.json')

            // Trigger export
            await wrapper.vm.handleExportJSON()

            // Verify filename generation
            expect(wrapper.vm.getFilename).toHaveBeenCalledWith('json')

            // Restore original function
            wrapper.vm.getFilename = originalGetFilename
        })
    })
}) 