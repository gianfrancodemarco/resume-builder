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
}) 