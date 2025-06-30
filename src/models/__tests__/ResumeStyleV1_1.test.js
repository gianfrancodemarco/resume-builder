import { describe, expect, it } from 'vitest'
import { ResumeStyleV1_1 } from '@/models/ResumeStyle/ResumeStyleV1_1'

describe('ResumeStyleV1_1', () => {

    describe('createDefault', () => {
        it('creates a default style with sample data', () => {
            const style = ResumeStyleV1_1.createDefault()
            expect(style.colors.primary).toBe('#08294D')
            expect(style.typography.headingFont).toBe('Helvetica')
            expect(style.spacing.section).toBe(24)
            expect(style.columns.left).toEqual(['personal', 'education'])
            expect(style.columns.right).toEqual(['experiences', 'customSections'])
        })
    })



    describe('validateJSON', () => {
        it('validates a valid style object', () => {
            const style = ResumeStyleV1_1.createDefault()
            const errors = ResumeStyleV1_1.validateJSON(style)
            expect(errors).toEqual([])
        })

        it('returns errors for invalid style object', () => {
            const invalidStyle = {
                colors: {
                    primary: null
                }
            }
            const errors = ResumeStyleV1_1.validateJSON(invalidStyle)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors).toContain('Invalid primary color')
        })
    })

    describe('getVersion', () => {
        it('returns the current version', () => {
            expect(ResumeStyleV1_1.getVersion()).toBe(ResumeStyleV1_1.VERSION)
        })
    })

    describe('SECTION_TYPES', () => {
        it('contains all required section types', () => {
            const sectionTypes = ResumeStyleV1_1.SECTION_TYPES
            expect(sectionTypes).toContainEqual({ label: 'Text', value: 'text' })
            expect(sectionTypes).toContainEqual({ label: 'List', value: 'list' })
            expect(sectionTypes).toContainEqual({ label: 'Languages', value: 'languages' })
            expect(sectionTypes).toContainEqual({ label: 'Italic Text', value: 'italic' })
        })
    })

    describe('COLUMN_TYPES', () => {
        it('contains all required column types', () => {
            const columnTypes = ResumeStyleV1_1.COLUMN_TYPES
            expect(columnTypes).toHaveProperty('LEFT', 'left')
            expect(columnTypes).toHaveProperty('RIGHT', 'right')
        })
    })
}) 