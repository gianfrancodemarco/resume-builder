import { describe, expect, it } from 'vitest'
import { buildDocument, buildSections } from '@/typst/document'
import { addSection, prepareResume, sampleResume, settingsOf, toggleItemHidden } from '@/resume/resume'

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
            date: 'Mar 2020 – Present',
            href: '',
            details: [],
            keywords: [],
        })
        expect(job.highlights[1]).toEqual([{ t: 'p', c: ['Improved application performance by ', { t: 'strong', c: ['40%'] }] }])
    })

    it('maps education, contact, profiles, skills and languages', () => {
        const sections = Object.fromEntries(buildSections(sampleResume()).map(s => [s.key, s]))
        expect(sections.education.items[0]).toMatchObject({ title: 'Master in Computer Science', subtitle: 'University of Milan', date: '2016 – 2018', details: ['110/110'] })
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
    const design = (resume, changes) => Object.assign(settingsOf(resume).design, changes)

    it('splits sidebar and main sections for the sidebar layout', () => {
        const { data } = buildDocument(sampleResume())
        expect(data.template).toBe('two-column')
        expect(keys(data.main)).toEqual(['work', 'education'])
        expect(keys(data.sidebar)).toEqual(['summary', 'contact', 'profiles', 'skills', 'languages'])
        expect(data.sizes.sidebar).toBe(210)
    })

    it('puts everything in the main column for the classic layout', () => {
        const resume = sampleResume()
        design(resume, { layout: 'classic' })
        const { data } = buildDocument(resume)
        expect(data.template).toBe('one-column-modern')
        expect(data.sidebar).toEqual([])
        expect(data.main).toHaveLength(7)
        expect(data.sizes.sidebar).toBe(0)
    })

    it('moves contact details and profiles to the header for layouts that show them there', () => {
        const resume = sampleResume()
        design(resume, { layout: 'minimal' })
        const { data } = buildDocument(resume)
        expect(data.template).toBe('minimal')
        expect(keys(data.main)).toEqual(['summary', 'work', 'education', 'skills', 'languages'])
        expect(data.header.contact.map(c => c.text)).toEqual(['New York, US', 'john.doe@example.com', '+1 555 0100'])
        expect(data.header.links.map(l => l.href)).toEqual(['https://github.com/johndoe', 'https://linkedin.com/in/johndoe'])
    })

    it('leaves the header empty when contact and profiles are hidden', () => {
        const resume = sampleResume()
        design(resume, { layout: 'banner' })
        for (const section of settingsOf(resume).sections) {
            if (section.key === 'contact' || section.key === 'profiles') section.visible = false
        }
        expect(buildDocument(resume).data.header).toEqual({ contact: [], links: [] })
    })

    it('keeps contact and profiles as sections in the sidebar and classic layouts', () => {
        expect(buildDocument(sampleResume()).data.header).toEqual({ contact: [], links: [] })
    })

    it('converts the size and density choices to pt', () => {
        const resume = sampleResume()
        expect(buildDocument(resume).data.sizes).toEqual({ base: 10.5, heading: 19.5, section: 18, content: 9, sidebar: 210 })
        design(resume, { size: 'l', density: 'airy' })
        expect(buildDocument(resume).data.sizes).toEqual({ base: 11.25, heading: 21, section: 24, content: 12, sidebar: 210 })
    })

    it('uses the fonts of the chosen pairing', () => {
        const resume = sampleResume()
        expect(buildDocument(resume).fonts).toEqual(['Arimo', 'Gelasio'])
        design(resume, { fonts: 'editorial' })
        expect(buildDocument(resume).data.fonts).toEqual({ heading: ['Source Sans 3'], body: ['Source Serif 4'] })
    })

    it('adds matching fallback fonts only when the text uses Greek, Cyrillic, Hebrew or Vietnamese', () => {
        const resume = sampleResume()
        resume.languages.push({ language: 'Русский', fluency: 'A2' })
        const { data, fonts } = buildDocument(resume)
        expect(data.fonts).toEqual({ heading: ['Arimo'], body: ['Gelasio', 'Source Serif 4', 'Arimo'] })
        expect(fonts).toEqual(['Arimo', 'Gelasio', 'Source Serif 4'])

        design(resume, { fonts: 'modern' })
        expect(buildDocument(resume).data.fonts.body).toEqual(['Inter', 'Arimo'])
    })

    it('derives the colors from the accent and passes the sidebar side', () => {
        const resume = sampleResume()
        design(resume, { accent: '#7A1F3D', sidebarLeft: true })
        const { data } = buildDocument(resume)
        expect(data.colors).toMatchObject({ primary: '#7a1f3d', sidebarBackground: '#7A1F3D', sidebarText: '#FFFFFF' })
        expect(data.sidebarLeft).toBe(true)
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
})
