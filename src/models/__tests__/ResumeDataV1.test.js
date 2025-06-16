import { describe, expect, it } from 'vitest'
import { ResumeDataV1 } from '@/models/ResumeData/ResumeDataV1'

describe('ResumeDataV1', () => {
    describe('constructor', () => {
        it('creates instance with default values', () => {
            const resume = new ResumeDataV1()
            expect(resume.version).toBe(ResumeDataV1.VERSION)
            expect(resume.personal).toEqual({
                name: '',
                title: '',
                visible: true
            })
            expect(resume.experiences).toEqual([])
            expect(resume.experiencesVisible).toBe(true)
            expect(resume.education).toEqual([])
            expect(resume.educationVisible).toBe(true)
            expect(resume.customSections).toEqual([])
            expect(resume.customSectionsVisible).toBe(true)
        })

        it('creates instance with provided values', () => {
            const data = {
                personal: {
                    name: 'John Doe',
                    title: 'Software Engineer',
                    visible: false
                },
                experiences: [
                    {
                        title: 'Senior Dev',
                        company: 'Tech Co',
                        period: '2020-2023',
                        description: 'Worked on stuff',
                        visible: true
                    }
                ],
                experiencesVisible: false,
                education: [
                    {
                        degree: 'BS CS',
                        school: 'University',
                        period: '2016-2020',
                        mark: '4.0',
                        thesis: 'Thesis',
                        visible: true
                    }
                ],
                educationVisible: false,
                customSections: [
                    {
                        title: 'Skills',
                        type: 'list',
                        visible: true,
                        items: []
                    }
                ],
                customSectionsVisible: false
            }

            const resume = new ResumeDataV1(data)
            expect(resume.personal).toEqual(data.personal)
            expect(resume.experiences).toEqual(data.experiences)
            expect(resume.experiencesVisible).toBe(data.experiencesVisible)
            expect(resume.education).toEqual(data.education)
            expect(resume.educationVisible).toBe(data.educationVisible)
            expect(resume.customSections).toEqual(data.customSections)
            expect(resume.customSectionsVisible).toBe(data.customSectionsVisible)
        })
    })

    describe('createDefault', () => {
        it('creates a default resume with sample data', () => {
            const resume = ResumeDataV1.createDefault()
            expect(resume.version).toBe(ResumeDataV1.VERSION)
            expect(resume.personal.name).toBe('John Doe')
            expect(resume.personal.title).toBe('Software Engineer')
            expect(resume.experiences.length).toBe(2)
            expect(resume.education.length).toBe(2)
            expect(resume.customSections.length).toBe(5)
        })
    })

    describe('getNewExperience', () => {
        it('returns a new experience object with default values', () => {
            const experience = ResumeDataV1.getNewExperience()
            expect(experience).toEqual({
                title: 'Experience',
                company: 'Company',
                period: '',
                description: '',
                visible: true
            })
        })
    })

    describe('getNewEducation', () => {
        it('returns a new education object with default values', () => {
            const education = ResumeDataV1.getNewEducation()
            expect(education).toEqual({
                degree: 'Degree',
                school: 'Cool School',
                period: '',
                mark: '',
                thesis: '',
                visible: true
            })
        })
    })

    describe('getNewCustomSection', () => {
        it('returns a new custom section object with default values', () => {
            const section = ResumeDataV1.getNewCustomSection()
            expect(section).toEqual({
                title: 'New Section',
                type: ResumeDataV1.SECTION_TYPES.TEXT,
                visible: true,
                items: []
            })
        })
    })

    describe('getNewCustomSectionItem', () => {
        it('returns a new custom section item with default values', () => {
            const item = ResumeDataV1.getNewCustomSectionItem()
            expect(item).toEqual({
                value: '',
                isLink: false,
                href: '',
                name: '',
                proficiency: 0
            })
        })
    })

    describe('toJSON', () => {
        it('converts instance to plain object', () => {
            const resume = new ResumeDataV1({
                personal: {
                    name: 'John Doe',
                    title: 'Software Engineer'
                }
            })

            const json = resume.toJSON()
            expect(json).toEqual({
                version: ResumeDataV1.VERSION,
                personal: resume.personal,
                experiences: resume.experiences,
                experiencesVisible: resume.experiencesVisible,
                education: resume.education,
                educationVisible: resume.educationVisible,
                customSections: resume.customSections,
                customSectionsVisible: resume.customSectionsVisible
            })
        })
    })

    describe('fromJSON', () => {
        it('creates instance from JSON data', () => {
            const data = {
                version: ResumeDataV1.VERSION,
                personal: {
                    name: 'John Doe',
                    title: 'Software Engineer'
                }
            }

            const resume = ResumeDataV1.fromJSON(data)
            expect(resume).toBeInstanceOf(ResumeDataV1)
            expect(resume.personal.name).toBe('John Doe')
            expect(resume.personal.title).toBe('Software Engineer')
        })

        it('handles version mismatch', () => {
            const data = {
                version: 999,
                personal: {
                    name: 'John Doe',
                    title: 'Software Engineer'
                }
            }

            const resume = ResumeDataV1.fromJSON(data)
            expect(resume.version).toBe(ResumeDataV1.VERSION)
        })
    })

    describe('validate', () => {
        it('validates a complete resume', () => {
            const resume = ResumeDataV1.createDefault()
            const result = resume.validate()
            expect(result.isValid).toBe(true)
            expect(result.errors).toHaveLength(0)
        })

        it('detects missing required fields', () => {
            const resume = new ResumeDataV1({
                personal: {
                    name: '',
                    title: ''
                }
            })
            const result = resume.validate()
            expect(result.isValid).toBe(false)
            expect(result.errors).toContain('Name is required')
            expect(result.errors).toContain('Title is required')
        })

        it('detects missing experiences when visible', () => {
            const resume = new ResumeDataV1({
                personal: {
                    name: 'John Doe',
                    title: 'Software Engineer'
                },
                experiencesVisible: true,
                experiences: []
            })
            const result = resume.validate()
            expect(result.isValid).toBe(false)
            expect(result.errors).toContain('At least one experience is required when experiences section is visible')
        })

        it('detects missing education when visible', () => {
            const resume = new ResumeDataV1({
                personal: {
                    name: 'John Doe',
                    title: 'Software Engineer'
                },
                educationVisible: true,
                education: []
            })
            const result = resume.validate()
            expect(result.isValid).toBe(false)
            expect(result.errors).toContain('At least one education entry is required when education section is visible')
        })
    })
}) 