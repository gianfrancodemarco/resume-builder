import { beforeEach, describe, expect, it } from 'vitest'
import { ResumeService } from '@/services/ResumeService'
import { sampleResume, settingsOf, validateResume } from '@/resume/resume'

const jsonFile = content => ({ text: async () => (typeof content === 'string' ? content : JSON.stringify(content)) })

// jsdom's Blob has no text()
const readJson = blob => new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = () => resolve(JSON.parse(reader.result))
    reader.readAsText(blob)
})

describe('ResumeService', () => {
    describe('loadFromFile', () => {
        it('loads a JSON Resume from another tool and builds a layout for it', async () => {
            const resume = await ResumeService.loadFromFile(jsonFile({
                basics: { name: 'Jane Doe', summary: 'Hello' },
                work: [{ name: 'Acme', position: 'Engineer', startDate: '2020-01' }],
            }))

            expect(resume.basics.name).toBe('Jane Doe')
            expect(settingsOf(resume).sections.map(s => s.key)).toEqual(['summary', 'work'])
        })

        it('keeps the layout stored in meta', async () => {
            const original = sampleResume()
            settingsOf(original).design.layout = 'classic'
            const resume = await ResumeService.loadFromFile(jsonFile(original))
            expect(settingsOf(resume).design.layout).toBe('classic')
        })

        it('rejects files that are not JSON', async () => {
            await expect(ResumeService.loadFromFile(jsonFile('not json'))).rejects.toThrow('The file is not valid JSON.')
        })

        it('rejects JSON that is not a valid JSON Resume', async () => {
            await expect(ResumeService.loadFromFile(jsonFile({ basics: { name: 42 } })))
                .rejects.toThrow('Not a valid JSON Resume: basics.name is not of a type(s) string')
        })
    })

    describe('exportToJSON', () => {
        it('exports a valid JSON Resume without the empty values left by the editor', async () => {
            const resume = sampleResume()
            resume.basics.url = ''
            resume.work[0].url = ''
            resume.work[0].highlights.push('')

            const json = await readJson(ResumeService.exportToJSON(resume))

            expect(validateResume(json)).toEqual([])
            expect(json.basics.url).toBeUndefined()
            expect(json.work[0].url).toBeUndefined()
            expect(json.work[0].highlights).toHaveLength(2)
            expect(json.meta.resumeBuilder).toEqual(settingsOf(resume))
            expect(json.meta.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}T/)
        })

        it('keeps the photo', async () => {
            const resume = sampleResume()
            resume.basics.image = 'data:image/png;base64,AAAA'
            const json = await readJson(ResumeService.exportToJSON(resume))
            expect(json.basics.image).toBe('data:image/png;base64,AAAA')
        })
    })

    describe('loadStored', () => {
        beforeEach(() => localStorage.clear())

        it('returns the sample resume when nothing is stored', () => {
            expect(ResumeService.loadStored().basics.name).toBe('John Doe')
        })

        it('returns the stored resume', () => {
            const resume = sampleResume()
            resume.basics.name = 'Stored Name'
            ResumeService.store(resume)
            expect(ResumeService.loadStored().basics.name).toBe('Stored Name')
        })

        it('ignores stored data that is not a valid JSON Resume', () => {
            localStorage.setItem('resume', '{"basics": {"name": 1}}')
            expect(ResumeService.loadStored().basics.name).toBe('John Doe')
        })
    })
})
