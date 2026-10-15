import { describe, expect, it } from 'vitest'
import {
    SCHEMA_URL, addSection, availableSections, isItemHidden, moveHidden, moveItem, moveSection, prepareResume,
    removeItem, removeSection, resumeContent, sampleResume, settingsOf, toggleItemHidden, validateResume,
    withContent, withDesign,
} from '@/resume/resume'
import { DEFAULT_DESIGN } from '@/resume/design'

const resumeWithJobs = (...names) => prepareResume({ basics: { name: 'X' }, work: names.map(name => ({ name })) })
const jobNames = resume => resume.work.map(w => w.name)
const hidden = resume => settingsOf(resume).hidden.work

describe('prepareResume', () => {
    it('adds the schema, basics and app settings to a bare JSON Resume', () => {
        const resume = prepareResume({ work: [{ name: 'Acme' }], skills: [{ name: 'Vue' }] })
        const settings = settingsOf(resume)

        expect(resume.$schema).toBe(SCHEMA_URL)
        expect(resume.basics).toEqual({ location: {} })
        expect(settings.design).toEqual(DEFAULT_DESIGN)
        expect(settings.sections).toEqual([
            { key: 'work', title: 'Work Experience', visible: true, column: 'main' },
            { key: 'skills', title: 'Skills', visible: true, column: 'sidebar' },
        ])
        expect(settings.hidden).toEqual({})
        expect(settings.photo).toEqual({ x: 50, y: 50, scale: 100 })
    })

    it('keeps existing settings and fills only the missing ones', () => {
        const resume = prepareResume({ meta: { resumeBuilder: { design: { layout: 'classic' }, sections: [] } } })
        expect(settingsOf(resume).design).toEqual({ ...DEFAULT_DESIGN, layout: 'classic' })
        expect(settingsOf(resume).sections).toEqual([])
        expect(settingsOf(resume).photo).toBeDefined()
    })

    it('does not modify its input', () => {
        const json = { basics: { name: 'X' } }
        prepareResume(json)
        expect(json).toEqual({ basics: { name: 'X' } })
    })
})

describe('validateResume', () => {
    it('accepts the sample resume', () => {
        expect(validateResume(sampleResume())).toEqual([])
    })

    it('reports schema errors with their path', () => {
        expect(validateResume({ basics: { name: 1 }, work: [{ startDate: 'June 2020' }] })).toEqual([
            'basics.name is not of a type(s) string',
            'work[0].startDate does not match pattern "^([1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]|[1-2][0-9]{3}-[0-1][0-9]|[1-2][0-9]{3})$"',
        ])
    })

    it('rejects values that are not objects', () => {
        expect(validateResume([])).toEqual(['A resume must be a JSON object'])
        expect(validateResume(null)).toEqual(['A resume must be a JSON object'])
    })
})

describe('sections', () => {
    it('adds a section with its default title and column', () => {
        const resume = sampleResume()
        expect(availableSections(resume)).toContain('projects')
        addSection(resume, 'projects')
        expect(settingsOf(resume).sections.at(-1)).toEqual({ key: 'projects', title: 'Projects', visible: true, column: 'main' })
        expect(availableSections(resume)).not.toContain('projects')
    })

    it('drops settings the app does not know', () => {
        const resume = prepareResume({ meta: { resumeBuilder: { template: 'TwoColumnsBlue', colors: {}, sections: [] }, version: '1' } })
        expect(Object.keys(settingsOf(resume))).toEqual(['design', 'sections', 'hidden', 'photo'])
        expect(resume.meta.version).toBe('1') // other meta fields are kept
    })

    it('replaces invalid design values with defaults', () => {
        const resume = prepareResume({ meta: { resumeBuilder: { design: { layout: 'nope', accent: 'red', size: 'xl', sidebarLeft: 'yes' } } } })
        expect(settingsOf(resume).design).toEqual(DEFAULT_DESIGN)
    })

    it('adds sidebar sections to the main column on layouts without a sidebar', () => {
        const resume = prepareResume({ meta: { resumeBuilder: { design: { layout: 'classic' }, sections: [] } } })
        addSection(resume, 'skills')
        expect(settingsOf(resume).sections[0].column).toBe('main')
    })

    it('removes a section together with its items and hidden state', () => {
        const resume = sampleResume()
        toggleItemHidden(resume, 'work', 0)
        removeSection(resume, 'work')
        expect(resume.work).toEqual([])
        expect(settingsOf(resume).sections.some(s => s.key === 'work')).toBe(false)
        expect(hidden(resume)).toBeUndefined()
    })

    it('keeps basics data when removing summary or contact', () => {
        const resume = sampleResume()
        removeSection(resume, 'summary')
        expect(resume.basics.summary).toBeTruthy()
    })

    it('moves sections and ignores moves past the ends', () => {
        const resume = sampleResume()
        const keys = () => settingsOf(resume).sections.map(s => s.key)
        const [first, second, third] = keys()
        moveSection(resume, 0, 2)
        expect(keys().slice(0, 3)).toEqual([second, third, first])
        moveSection(resume, 0, 99) // out of range: nothing happens
        expect(keys().slice(0, 3)).toEqual([second, third, first])
    })
})

describe('items', () => {
    it('hides and shows items', () => {
        const resume = resumeWithJobs('a', 'b')
        toggleItemHidden(resume, 'work', 1)
        expect(isItemHidden(resume, 'work', 1)).toBe(true)
        toggleItemHidden(resume, 'work', 1)
        expect(isItemHidden(resume, 'work', 1)).toBe(false)
        expect(hidden(resume)).toBeUndefined()
    })

    it('keeps hidden items hidden when they move', () => {
        const resume = resumeWithJobs('a', 'b', 'c')
        toggleItemHidden(resume, 'work', 0)
        moveItem(resume, 'work', 0, 2)
        expect(jobNames(resume)).toEqual(['b', 'c', 'a'])
        expect(hidden(resume)).toEqual([2])
        moveItem(resume, 'work', 2, 3) // past the end: nothing happens
        expect(jobNames(resume)).toEqual(['b', 'c', 'a'])
    })

    it('remaps hidden indices for items reordered elsewhere (drag and drop)', () => {
        const resume = resumeWithJobs('a', 'b', 'c')
        toggleItemHidden(resume, 'work', 2)
        resume.work = [resume.work[2], resume.work[0], resume.work[1]] // what the drag library does
        moveHidden(resume, 'work', 2, 0)
        expect(hidden(resume)).toEqual([0])
        expect(resume.work[0].name).toBe('c')
    })

    it('shifts hidden indices when an earlier item is removed', () => {
        const resume = resumeWithJobs('a', 'b', 'c')
        toggleItemHidden(resume, 'work', 0)
        toggleItemHidden(resume, 'work', 2)
        removeItem(resume, 'work', 0)
        expect(jobNames(resume)).toEqual(['b', 'c'])
        expect(hidden(resume)).toEqual([1])
    })
})

describe('content', () => {
    it('strips settings and photo from the content sent to AI models', () => {
        const resume = sampleResume()
        resume.basics.image = 'data:image/png;base64,AAAA'
        const content = resumeContent(resume)
        expect(content.meta).toBeUndefined()
        expect(content.$schema).toBeUndefined()
        expect(content.basics.image).toBeUndefined()
        expect(resume.basics.image).toBeDefined()
    })

    it('replaces content keeping settings and photo, adding sections that gained content', () => {
        const resume = sampleResume()
        resume.basics.image = 'data:image/png;base64,AAAA'
        settingsOf(resume).design.layout = 'classic'
        toggleItemHidden(resume, 'work', 1)
        toggleItemHidden(resume, 'education', 0)
        const content = resumeContent(resume)
        content.work.push({ name: 'New job' })
        content.projects = [{ name: 'New project' }]

        const next = withContent(resume, content)

        expect(next.basics.image).toBe('data:image/png;base64,AAAA')
        expect(settingsOf(next).design.layout).toBe('classic')
        expect(settingsOf(next).sections.at(-1).key).toBe('projects')
        expect(settingsOf(next).hidden).toEqual({ education: [0] }) // work changed length: reset
    })
})

describe('design', () => {
    it('builds a preview copy with other design values without changing the resume', () => {
        const resume = sampleResume()
        const preview = withDesign(resume, { layout: 'classic' })
        expect(settingsOf(preview).design).toEqual({ ...DEFAULT_DESIGN, layout: 'classic' })
        expect(settingsOf(resume).design.layout).toBe('sidebar')
    })
})
