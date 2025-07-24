import { describe, expect, it } from 'vitest'
import { ExporterService } from '@/services/ExporterService'
import { ResumeDataV1 } from '@/models/ResumeData/ResumeDataV1'

describe('ExporterService', () => {
    describe('getFilename', () => {
        it('generates filename with name and title', () => {
            const resumeData = new ResumeDataV1({
                personal: {
                    name: 'Luke Skywalker',
                    title: 'Jedi Knight'
                }
            })

            const filename = ExporterService.getFilename(resumeData, 'pdf')
            expect(filename).toBe('Luke Skywalker_Jedi Knight.pdf')
        })

        it('generates filename with only name', () => {
            const resumeData = new ResumeDataV1({
                personal: {
                    name: 'Luke Skywalker',
                    title: ''
                }
            })

            const filename = ExporterService.getFilename(resumeData, 'pdf')
            expect(filename).toBe('Luke Skywalker.pdf')
        })

        it('generates filename with only title', () => {
            const resumeData = new ResumeDataV1({
                personal: {
                    name: '',
                    title: 'Jedi Knight'
                }
            })

            const filename = ExporterService.getFilename(resumeData, 'pdf')
            expect(filename).toBe('Jedi Knight.pdf')
        })

        it('generates fallback filename when both name and title are missing', () => {
            const resumeData = new ResumeDataV1({
                personal: {
                    name: '',
                    title: ''
                }
            })

            const filename = ExporterService.getFilename(resumeData, 'pdf')
            expect(filename).toBe('resume.pdf')
        })

        it('trims whitespace from name and title', () => {
            const resumeData = new ResumeDataV1({
                personal: {
                    name: '  Luke Skywalker  ',
                    title: '  Jedi Knight  '
                }
            })

            const filename = ExporterService.getFilename(resumeData, 'pdf')
            expect(filename).toBe('Luke Skywalker_Jedi Knight.pdf')
        })
    })

    describe('exportToTXT', () => {
        let mockCreateElement
        let mockClick
        let mockAppendChild
        let mockRemoveChild
        let mockCreateObjectURL
        let mockRevokeObjectURL

        beforeEach(() => {
            // Mock DOM methods
            mockClick = vi.fn()
            mockAppendChild = vi.fn()
            mockRemoveChild = vi.fn()
            mockCreateObjectURL = vi.fn(() => 'mock-url')
            mockRevokeObjectURL = vi.fn()

            mockCreateElement = vi.fn(() => ({
                href: '',
                download: '',
                click: mockClick
            }))

            global.document = {
                createElement: mockCreateElement,
                body: {
                    appendChild: mockAppendChild,
                    removeChild: mockRemoveChild
                }
            }

            global.window = {
                URL: {
                    createObjectURL: mockCreateObjectURL,
                    revokeObjectURL: mockRevokeObjectURL
                }
            }

            global.Blob = vi.fn(() => ({}))
        })

        it('exports complete resume data to TXT format', async () => {
            const resumeData = new ResumeDataV1({
                personal: {
                    name: 'Luke Skywalker',
                    title: 'Jedi Knight'
                },
                experiences: [{
                    title: 'Jedi Knight',
                    company: 'Rebel Alliance',
                    period: '2019-2023',
                    description: 'Fought against the Empire'
                }],
                education: [{
                    degree: 'Jedi Training',
                    school: 'Dagobah Academy',
                    period: '2016-2019',
                    mark: 'Master Level',
                    thesis: 'The Force and You',
                    description: 'Comprehensive Jedi training'
                }],
                customSections: [{
                    title: 'Skills',
                    content: '<p>Lightsaber combat</p><p>Force abilities</p>'
                }],
                experiencesSectionName: 'Work Experience',
                educationSectionName: 'Education'
            })

            await ExporterService.exportToTXT(resumeData)

            // Verify Blob was created with correct content
            expect(Blob).toHaveBeenCalledWith(
                [expect.stringContaining('Luke Skywalker')],
                { type: 'text/plain' }
            )

            // Verify file download process
            expect(mockCreateObjectURL).toHaveBeenCalled()
            expect(mockCreateElement).toHaveBeenCalledWith('a')
            expect(mockAppendChild).toHaveBeenCalled()
            expect(mockClick).toHaveBeenCalled()
            expect(mockRemoveChild).toHaveBeenCalled()
            expect(mockRevokeObjectURL).toHaveBeenCalled()
        })

        it('exports minimal resume data to TXT format', async () => {
            const resumeData = new ResumeDataV1({
                personal: {
                    name: 'Luke Skywalker'
                }
            })

            await ExporterService.exportToTXT(resumeData)

            expect(Blob).toHaveBeenCalledWith(
                [expect.stringContaining('Luke Skywalker')],
                { type: 'text/plain' }
            )
        })

        it('handles empty resume data gracefully', async () => {
            const resumeData = new ResumeDataV1({})

            await ExporterService.exportToTXT(resumeData)

            // Should still create a blob and attempt download
            expect(Blob).toHaveBeenCalled()
            expect(mockClick).toHaveBeenCalled()
        })

        it('generates correct filename for TXT export', async () => {
            const resumeData = new ResumeDataV1({
                personal: {
                    name: 'Luke Skywalker',
                    title: 'Jedi Knight'
                }
            })

            // Mock getFilename to return expected value
            vi.spyOn(ExporterService, 'getFilename').mockReturnValue('Luke Skywalker_Jedi Knight.txt')

            await ExporterService.exportToTXT(resumeData)

            // Verify getFilename was called with correct parameters
            expect(ExporterService.getFilename).toHaveBeenCalledWith(resumeData, 'txt')
        })

        it('handles filename generation error gracefully', async () => {
            const resumeData = new ResumeDataV1({})

            // Mock getFilename to throw error
            vi.spyOn(ExporterService, 'getFilename').mockImplementation(() => {
                throw new Error('No personal info')
            })

            await ExporterService.exportToTXT(resumeData)

            // Should use fallback filename and still proceed with download
            expect(Blob).toHaveBeenCalled()
            expect(mockClick).toHaveBeenCalled()
        })
    })

    describe('htmlToText', () => {
        beforeEach(() => {
            // Mock DOM for htmlToText function
            const mockDiv = {
                innerHTML: '',
                innerText: ''
            }
            global.document = {
                createElement: vi.fn(() => mockDiv)
            }
        })

        it('converts HTML to plain text', () => {
            const mockDiv = {
                innerHTML: '',
                innerText: 'Lightsaber combat\nForce abilities'
            }
            global.document.createElement = vi.fn(() => mockDiv)

            const result = ExporterService.htmlToText('<p>Lightsaber combat</p><p>Force abilities</p>')
            
            expect(result).toBe('Lightsaber combat\nForce abilities')
        })

        it('handles empty HTML', () => {
            const result = ExporterService.htmlToText('')
            expect(result).toBe('')
        })

        it('handles null HTML', () => {
            const result = ExporterService.htmlToText(null)
            expect(result).toBe('')
        })

        it('removes excessive newlines', () => {
            const mockDiv = {
                innerHTML: '',
                innerText: 'Line 1\n\n\n\nLine 2'
            }
            global.document.createElement = vi.fn(() => mockDiv)

            const result = ExporterService.htmlToText('<p>Line 1</p><br><br><br><p>Line 2</p>')
            
            expect(result).toBe('Line 1\nLine 2')
        })
    })
}) 