import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ResumeService } from '@/services/ResumeService'
import { ResumeDataV2 } from '@/models/ResumeData/ResumeDataV2'
import { ResumeStyleV1_1 } from '@/models/ResumeStyle/ResumeStyleV1_1'

describe('ResumeService', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks()
    })

    describe('loadFromFile', () => {
        it('loads valid resume data from file', async () => {
            const mockResumeData = {
                version: 1,
                personal: {
                    name: 'John Doe',
                    title: 'Software Engineer'
                }
            }
            const mockResumeStyle = {
                version: 1,
                colors: {
                    primary: '#000000'
                }
            }
            const mockFile = new File(
                [JSON.stringify({ resumeData: mockResumeData, resumeStyle: mockResumeStyle })],
                'resume.json',
                { type: 'application/json' }
            )

            const result = await ResumeService.loadFromFile(mockFile)

            expect(result.resumeData).toBeInstanceOf(ResumeDataV2)
            expect(result.resumeData.personal.name).toBe('John Doe')
            expect(result.resumeStyle.colors.primary).toBe('#000000')
        })

        it('rejects invalid file format', async () => {
            const mockFile = new File(
                [JSON.stringify({ invalid: 'data' })],
                'resume.json',
                { type: 'application/json' }
            )

            await expect(ResumeService.loadFromFile(mockFile)).rejects.toThrow('Invalid resume data format')
        })

        it('rejects invalid JSON', async () => {
            const mockFile = new File(
                ['invalid json'],
                'resume.json',
                { type: 'application/json' }
            )

            await expect(ResumeService.loadFromFile(mockFile)).rejects.toThrow('Error loading file')
        })

        it('handles file read error', async () => {
            const mockFile = new File(
                ['test'],
                'resume.json',
                { type: 'application/json' }
            )

            // Mock FileReader to simulate error
            const mockFileReader = {
                readAsText: vi.fn(),
                onerror: null,
                onload: null
            }
            global.FileReader = vi.fn(() => mockFileReader)

            const loadPromise = ResumeService.loadFromFile(mockFile)
            mockFileReader.onerror()

            await expect(loadPromise).rejects.toThrow('Error reading file')
        })
    })

    describe('exportToJSON', () => {
        it('exports resume data and style to JSON', () => {
            const resumeData = new ResumeDataV2({
                personal: {
                    name: 'John Doe',
                    title: 'Software Engineer'
                }
            })
            const resumeStyle = ResumeStyleV1_1.createDefault()

            const blob = ResumeService.exportToJSON(resumeData, resumeStyle)
            expect(blob).toBeInstanceOf(Blob)
            expect(blob.type).toBe('application/json')

            // Test blob content
            const reader = new FileReader()
            reader.onload = () => {
                const data = JSON.parse(reader.result)
                expect(data.resumeData.personal.name).toBe('John Doe')
                expect(data.resumeStyle.colors.primary).toBe('#08294D')
            }
            reader.readAsText(blob)
        })

        it('handles plain object style', () => {
            const resumeData = new ResumeDataV2({
                personal: {
                    name: 'John Doe',
                    title: 'Software Engineer'
                }
            })
            const resumeStyle = {
                colors: {
                    primary: '#000000'
                }
            }

            const blob = ResumeService.exportToJSON(resumeData, resumeStyle)
            expect(blob).toBeInstanceOf(Blob)
            expect(blob.type).toBe('application/json')

            // Test blob content
            const reader = new FileReader()
            reader.onload = () => {
                const data = JSON.parse(reader.result)
                expect(data.resumeData.personal.name).toBe('John Doe')
                expect(data.resumeStyle.colors.primary).toBe('#000000')
            }
            reader.readAsText(blob)
        })
    })
}) 