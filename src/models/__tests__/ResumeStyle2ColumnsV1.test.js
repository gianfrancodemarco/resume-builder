import { describe, expect, it } from 'vitest'
import { ResumeStyle2ColumnsV1 } from '@/models/ResumeStyle/ResumeStyle2ColumnsV1'

describe('ResumeStyle2ColumnsV1', () => {
    describe('constructor', () => {
        it('creates instance with default values', () => {
            const style = new ResumeStyle2ColumnsV1()
            expect(style.version).toBe(ResumeStyle2ColumnsV1.VERSION)
            expect(style.templateName).toBe(ResumeStyle2ColumnsV1.TEMPLATE_NAME)
            expect(style.colors).toEqual({
                primary: '#08294D',
                text: '#08294D',
                background: '#ffffff',
                sidebar: '#08294D',
                link: '#08294D'
            })
            expect(style.typography).toEqual({
                headingFont: 'Helvetica',
                bodyFont: 'Georgia',
                baseSize: 16,
                headingSize: 26
            })
            expect(style.spacing).toEqual({
                section: 24,
                content: 12,
                sidebarLeft: false,
                sidebarWidth: 280
            })
            expect(style.columns).toEqual({
                left: [],
                right: []
            })
        })

        it('creates instance with provided values', () => {
            const data = {
                colors: {
                    primary: '#000000',
                    text: '#ffffff',
                    background: '#000000',
                    sidebar: '#ffffff',
                    link: '#000000'
                },
                typography: {
                    headingFont: 'Arial',
                    bodyFont: 'Helvetica',
                    baseSize: 14,
                    headingSize: 24
                },
                spacing: {
                    section: 20,
                    content: 10,
                    sidebarLeft: true,
                    sidebarWidth: 300
                },
                columns: {
                    left: ['skills'],
                    right: ['experience']
                }
            }

            const style = new ResumeStyle2ColumnsV1(data)
            expect(style.colors).toEqual(data.colors)
            expect(style.typography).toEqual(data.typography)
            expect(style.spacing).toEqual(data.spacing)
            expect(style.columns).toEqual(data.columns)
        })
    })

    describe('createDefault', () => {
        it('creates a default style with sample data', () => {
            const style = ResumeStyle2ColumnsV1.createDefault()
            expect(style.version).toBe(ResumeStyle2ColumnsV1.VERSION)
            expect(style.templateName).toBe(ResumeStyle2ColumnsV1.TEMPLATE_NAME)
            expect(style.colors.primary).toBe('#08294D')
            expect(style.typography.headingFont).toBe('Helvetica')
            expect(style.spacing.section).toBe(24)
        })
    })

    describe('toJSON', () => {
        it('converts instance to plain object', () => {
            const style = new ResumeStyle2ColumnsV1({
                colors: {
                    primary: '#000000'
                }
            })

            const json = style.toJSON()
            expect(json).toEqual({
                version: ResumeStyle2ColumnsV1.VERSION,
                templateName: ResumeStyle2ColumnsV1.TEMPLATE_NAME,
                colors: style.colors,
                typography: style.typography,
                spacing: style.spacing,
                columns: style.columns
            })
        })
    })

    describe('fromJSON', () => {
        it('creates instance from JSON data', () => {
            const data = {
                version: ResumeStyle2ColumnsV1.VERSION,
                colors: {
                    primary: '#000000'
                }
            }

            const style = ResumeStyle2ColumnsV1.fromJSON(data)
            expect(style).toBeInstanceOf(ResumeStyle2ColumnsV1)
            expect(style.colors.primary).toBe('#000000')
        })

        it('handles invalid JSON data', () => {
            const style = ResumeStyle2ColumnsV1.fromJSON(null)
            expect(style).toBeInstanceOf(ResumeStyle2ColumnsV1)
            expect(style.colors.primary).toBe('#08294D') // Default value
        })
    })

    describe('getVersion', () => {
        it('returns the current version', () => {
            expect(ResumeStyle2ColumnsV1.getVersion()).toBe(ResumeStyle2ColumnsV1.VERSION)
        })
    })

    describe('SECTION_TYPES', () => {
        it('contains all required section types', () => {
            const sectionTypes = ResumeStyle2ColumnsV1.SECTION_TYPES
            expect(sectionTypes).toContainEqual({ label: 'Text', value: 'text' })
            expect(sectionTypes).toContainEqual({ label: 'List', value: 'list' })
            expect(sectionTypes).toContainEqual({ label: 'Languages', value: 'languages' })
            expect(sectionTypes).toContainEqual({ label: 'Italic Text', value: 'italic' })
        })
    })

    describe('COLUMN_TYPES', () => {
        it('contains all required column types', () => {
            const columnTypes = ResumeStyle2ColumnsV1.COLUMN_TYPES
            expect(columnTypes).toHaveProperty('LEFT', 'left')
            expect(columnTypes).toHaveProperty('RIGHT', 'right')
        })
    })
}) 