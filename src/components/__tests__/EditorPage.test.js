import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { ResumeDataV1 } from '../../models/ResumeData/ResumeDataV1'
import { ResumeService } from '../../services/ResumeService'
import { ExporterService } from '../../services/ExporterService'
import { vuetify } from '../../test/setup'
import EditorPage from '../../views/EditorPage.vue'

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

        // Mock ResumeService methods
        vi.spyOn(ResumeService, 'exportToJSON').mockImplementation(() => new Blob(['test']))
        vi.spyOn(ExporterService, 'getFilename').mockImplementation(() => 'test.json')

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
            // Set resume data
            wrapper.vm.resumeData = new ResumeDataV1({
                personal: {
                    name: 'Luke Skywalker',
                    title: 'Jedi Knight'
                }
            })

            // Trigger export
            await wrapper.vm.handleExportJSON()

            // Verify ResumeService was called
            expect(ResumeService.exportToJSON).toHaveBeenCalledWith(
                wrapper.vm.resumeData,
                wrapper.vm.resumeStyle
            )

            // Verify createObjectURL was called
            expect(window.URL.createObjectURL).toHaveBeenCalled()

            // Verify sa_event was called
            expect(window.sa_event).toHaveBeenCalledWith('export_json')

            // Verify cleanup
            expect(window.URL.revokeObjectURL).toHaveBeenCalled()
        })

        it('generates correct filename from resume data', async () => {
            // Set resume data
            wrapper.vm.resumeData = new ResumeDataV1({
                personal: {
                    name: 'Luke Skywalker',
                    title: 'Jedi Knight'
                }
            })

            // Trigger export
            await wrapper.vm.handleExportJSON()

            // Verify ExporterService.getFilename was called
            expect(ExporterService.getFilename).toHaveBeenCalledWith(
                wrapper.vm.resumeData,
                'json'
            )
        })

        it('generates fallback filename when name/title is missing', async () => {
            // Set resume data with missing name/title
            wrapper.vm.resumeData = new ResumeDataV1({
                personal: {}
            })

            // Trigger export
            await wrapper.vm.handleExportJSON()

            // Verify ExporterService.getFilename was called
            expect(ExporterService.getFilename).toHaveBeenCalledWith(
                wrapper.vm.resumeData,
                'json'
            )
        })
    })
}) 