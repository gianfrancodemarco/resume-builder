import { describe, expect, it } from 'vitest'
import { buildDocument, orderedSections } from '@/typst/document'
import { ResumeDataV2 } from '@/models/ResumeData/ResumeDataV2'
import { TwoColumnsBlue } from '@/models/ResumeStyle/defaultTemplates/TwoColumnsBlue'
import { OneColumnModern } from '@/models/ResumeStyle/defaultTemplates/OneColumnModern'

describe('orderedSections', () => {
    it('orders sections by their order field', () => {
        const data = ResumeDataV2.createDefault()
        data.educationOrder = -3
        expect(orderedSections(data).slice(0, 2).map(s => s.type)).toEqual(['education', 'experiences'])
    })

    it('skips hidden sections and sections without visible items', () => {
        const data = ResumeDataV2.createDefault()
        data.educationVisible = false
        data.experiences.forEach(e => { e.visible = false })
        data.customSections[0].visible = false
        const types = orderedSections(data).map(s => s.type)
        expect(types).not.toContain('education')
        expect(types).not.toContain('experiences')
        expect(types).toHaveLength(data.customSections.length - 1)
    })
})

describe('buildDocument', () => {
    it('splits sidebar and main sections for two-column templates', () => {
        const { data } = buildDocument(ResumeDataV2.createDefault(), TwoColumnsBlue.createDefault())
        expect(data.template).toBe('two-column')
        expect(data.main.map(s => s.type)).toEqual(['experiences', 'education'])
        expect(data.sidebar.map(s => s.title)).toEqual(['About Me', 'Contact Details', 'Professional Links', 'Technical Skills', 'Languages'])
    })

    it('moves sidebar sections to the main column when the sidebar is hidden', () => {
        const style = TwoColumnsBlue.createDefault()
        style.spacing.sidebarWidth = 0
        const { data } = buildDocument(ResumeDataV2.createDefault(), style)
        expect(data.sidebar).toEqual([])
        expect(data.main).toHaveLength(7)
        expect(data.sizes.sidebar).toBe(0)
    })

    it('puts every section in the main column for the one-column template', () => {
        const { data } = buildDocument(ResumeDataV2.createDefault(), OneColumnModern.createDefault())
        expect(data.template).toBe('one-column-modern')
        expect(data.sidebar).toEqual([])
        expect(data.main).toHaveLength(7)
    })

    it('converts px sizes to pt', () => {
        const { data } = buildDocument(ResumeDataV2.createDefault(), TwoColumnsBlue.createDefault())
        expect(data.sizes).toEqual({ base: 10.5, heading: 19.5, section: 18, content: 9, sidebar: 210 })
    })

    it('reports the fonts it uses and falls back to the default for unknown ones', () => {
        const style = TwoColumnsBlue.createDefault()
        style.typography.headingFont = 'Lora'
        style.typography.bodyFont = 'Comic Sans MS'
        const { data, fonts } = buildDocument(ResumeDataV2.createDefault(), style)
        expect(data.fonts).toEqual({ heading: 'Lora', body: 'Inter' })
        expect(fonts).toEqual(['Lora', 'Inter'])
    })

    it('includes the avatar only when an image is set', () => {
        const resume = ResumeDataV2.createDefault()
        expect(buildDocument(resume, TwoColumnsBlue.createDefault()).data.image).toBeNull()
        resume.personal.image = { data: 'data:image/png;base64,AAAA', x: 10, y: 20, scale: 150 }
        expect(buildDocument(resume, TwoColumnsBlue.createDefault()).data.image).toEqual({
            path: '/assets/avatar', x: 10, y: 20, scale: 150,
        })
    })

    it('falls back to valid colors', () => {
        const style = TwoColumnsBlue.createDefault()
        style.colors.link = ''
        style.colors.text = 'not-a-color'
        const { data } = buildDocument(ResumeDataV2.createDefault(), style)
        expect(data.colors.link).toBe('#08294d')
        expect(data.colors.text).toBe('#08294d')
    })
})
