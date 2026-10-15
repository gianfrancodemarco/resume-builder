import { describe, expect, it } from 'vitest'
import { buildDocument, buildSections } from '@/typst/document'
import { addSection, applyTemplate, prepareResume, sampleResume, settingsOf, toggleItemHidden } from '@/resume/resume'

const keys = sections => sections.map(s => s.key)

describe('buildSections', () => {
    it('follows the layout order and skips hidden or empty sections', () => {
        const resume = sampleResume()
        const layout = settingsOf(resume).sections
        layout.find(s => s.key === 'skills').visible = false
        addSection(resume, 'projects') // in the layout but empty

        expect(keys(buildSections(resume))).toEqual(['summary', 'contact', 'profiles', 'work', 'education', 'languages'])
    })

    it('leaves hidden items out', () => {
        const resume = sampleResume()
        toggleItemHidden(resume, 'work', 0)
        const work = buildSections(resume).find(s => s.key === 'work')
        expect(work.items.map(i => i.subtitle)).toEqual(['Digital Innovations'])
    })

    it('drops a section whose items are all hidden', () => {
        const resume = sampleResume()
        toggleItemHidden(resume, 'languages', 0)
        toggleItemHidden(resume, 'languages', 1)
        toggleItemHidden(resume, 'languages', 2)
        expect(keys(buildSections(resume))).not.toContain('languages')
    })

    it('maps work entries with formatted dates and Markdown content', () => {
        const [job] = buildSections(sampleResume()).find(s => s.key === 'work').items
        expect(job).toMatchObject({
            title: 'Senior Software Engineer',
            subtitle: 'Tech Solutions Inc.',
            location: 'Milan',
            date: 'Mar 2020 - Present',
            href: '',
            details: [],
            keywords: [],
        })
        expect(job.highlights[1]).toEqual([{ t: 'p', c: ['Improved application performance by ', { t: 'strong', c: ['40%'] }] }])
    })

    it('maps education, contact, profiles, skills and languages', () => {
        const sections = Object.fromEntries(buildSections(sampleResume()).map(s => [s.key, s]))
        expect(sections.education.items[0]).toMatchObject({ title: 'Master in Computer Science', subtitle: 'University of Milan', date: '2016 - 2018', details: ['110/110'] })
        expect(sections.contact.items).toEqual([
            { text: 'New York, US', href: '' },
            { text: 'john.doe@example.com', href: 'mailto:john.doe@example.com' },
            { text: '+1 555 0100', href: 'tel:+15550100' },
        ])
        expect(sections.profiles.items[0]).toEqual({ label: 'GitHub', text: 'johndoe', href: 'https://github.com/johndoe' })
        expect(sections.skills.items[0]).toEqual({ name: 'Frontend', level: '', keywords: ['Vue.js', 'JavaScript', 'TypeScript', 'HTML/CSS'] })
        expect(sections.languages.items.map(l => l.level)).toEqual([100, 80, 50])
    })
})

describe('buildDocument', () => {
    it('splits sidebar and main sections for two-column templates', () => {
        const { data } = buildDocument(sampleResume())
        expect(data.template).toBe('two-column')
        expect(keys(data.main)).toEqual(['work', 'education'])
        expect(keys(data.sidebar)).toEqual(['summary', 'contact', 'profiles', 'skills', 'languages'])
    })

    it('puts everything in the main column when the sidebar is hidden or absent', () => {
        const resume = sampleResume()
        settingsOf(resume).spacing.sidebarWidth = 0
        expect(buildDocument(resume).data.sidebar).toEqual([])
        expect(buildDocument(resume).data.sizes.sidebar).toBe(0)

        applyTemplate(resume, 'OneColumnModern')
        const { data } = buildDocument(resume)
        expect(data.template).toBe('one-column-modern')
        expect(data.sidebar).toEqual([])
        expect(data.main).toHaveLength(7)
    })

    it('converts px sizes to pt', () => {
        expect(buildDocument(sampleResume()).data.sizes).toEqual({ base: 10.5, heading: 19.5, section: 18, content: 9, sidebar: 210 })
    })

    it('reports the fonts it uses, including Cousine for inline code', () => {
        const resume = sampleResume()
        expect(buildDocument(resume).fonts).toEqual(['Arimo', 'Gelasio'])
        settingsOf(resume).typography.bodyFont = 'Comic Sans MS'
        resume.basics.summary = 'Uses `code`'
        expect(buildDocument(resume).fonts).toEqual(['Arimo', 'Inter', 'Cousine'])
    })

    it('adds a matching fallback font only when the text uses Greek, Cyrillic, Hebrew or Vietnamese', () => {
        const resume = sampleResume()
        expect(buildDocument(resume).data.fonts).toEqual({ heading: ['Arimo'], body: ['Gelasio'] })

        resume.languages.push({ language: 'Русский', fluency: 'A2' })
        const { data, fonts } = buildDocument(resume)
        expect(data.fonts).toEqual({ heading: ['Arimo'], body: ['Gelasio', 'Tinos'] }) // Arimo needs no fallback
        expect(fonts).toEqual(['Arimo', 'Gelasio', 'Tinos'])

        settingsOf(resume).typography.bodyFont = 'Lato'
        expect(buildDocument(resume).data.fonts.body).toEqual(['Lato', 'Arimo'])
    })

    it('includes the photo with its crop settings', () => {
        const resume = sampleResume()
        expect(buildDocument(resume).data.image).toBeNull()
        resume.basics.image = 'data:image/png;base64,AAAA'
        Object.assign(settingsOf(resume).photo, { x: 10, y: 20, scale: 150 })
        expect(buildDocument(resume).data.image).toEqual({ path: '/assets/avatar', x: 10, y: 20, scale: 150 })
    })

    it('uses name and title from basics', () => {
        const { data } = buildDocument(prepareResume({ basics: { label: 'Engineer' } }))
        expect(data.personal).toEqual({ name: 'Your Name', title: 'Engineer' })
        expect(data.title).toBe('Engineer')
    })

    it('falls back to valid colors', () => {
        const resume = sampleResume()
        settingsOf(resume).colors.link = ''
        settingsOf(resume).colors.text = 'not-a-color'
        const { data } = buildDocument(resume)
        expect(data.colors.link).toBe('#08294d')
        expect(data.colors.text).toBe('#08294d')
    })
})
