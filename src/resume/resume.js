// The resume document: a JSON Resume (https://jsonresume.org/schema) whose
// `meta.resumeBuilder` holds everything app-specific (template, style,
// section layout, hidden items, photo crop). Other JSON Resume tools ignore it.
import schema from '@jsonresume/schema/schema.json'
import { Validator } from 'jsonschema'
import { SECTIONS, SECTION_KEYS, hasContent, isListSection, itemsOf, sectionItems } from './sections'
import { DEFAULT_TEMPLATE, TEMPLATES, hasSidebar, templateStyle } from './templates'
import { cloneJson } from './values'

export const SCHEMA_URL = 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json'

// Sections placed in the sidebar when a layout is created from data
const SIDEBAR_SECTIONS = new Set(['summary', 'contact', 'profiles', 'skills', 'languages', 'interests'])

const DEFAULT_ORDER = [
    'summary', 'contact', 'profiles', 'work', 'education', 'projects', 'volunteer',
    'awards', 'certificates', 'publications', 'skills', 'languages', 'interests', 'references',
]

/** The app settings stored in the resume. */
export const settingsOf = resume => resume.meta.resumeBuilder

function defaultSettings(resume) {
    return {
        template: DEFAULT_TEMPLATE,
        ...templateStyle(DEFAULT_TEMPLATE),
        sections: DEFAULT_ORDER.filter(key => hasContent(resume, key)).map(sectionLayout),
        hidden: {},
        photo: { x: 50, y: 50, scale: 100 },
    }
}

function sectionLayout(key) {
    return { key, title: SECTIONS[key].defaultTitle, visible: true, column: SIDEBAR_SECTIONS.has(key) ? 'sidebar' : 'main' }
}

/**
 * Makes any JSON Resume usable by the app: adds `basics` and the app settings
 * when missing. Files exported by other tools get a layout built from their content.
 * @param {object} json - A JSON Resume document
 * @returns {object} A new resume object
 */
export function prepareResume(json) {
    const resume = cloneJson(json)
    resume.$schema ??= SCHEMA_URL
    resume.basics ??= {}
    resume.basics.location ??= {}
    resume.meta ??= {}
    resume.meta.resumeBuilder = { ...defaultSettings(resume), ...resume.meta.resumeBuilder }
    return resume
}

/**
 * Validates a document against the official JSON Resume schema.
 * @returns {string[]} Error messages, empty when valid
 */
export function validateResume(json) {
    if (!json || typeof json !== 'object' || Array.isArray(json)) return ['A resume must be a JSON object']
    return new Validator().validate(json, schema).errors.map(e => `${e.property.replace(/^instance\.?/, '') || 'resume'} ${e.message}`)
}

/** The resume content without app settings or the photo, e.g. to send to an AI model. */
export function resumeContent(resume) {
    const { meta, $schema, basics = {}, ...content } = resume
    // The photo is left out before copying: it can be a large data URL
    const { image, ...basicsWithoutImage } = basics
    return cloneJson({ basics: basicsWithoutImage, ...content })
}

/**
 * Replaces the content of a resume (e.g. with AI output) keeping its settings
 * and photo. Sections that gained content are added to the layout; hidden
 * items are reset for sections whose item count changed.
 */
export function withContent(resume, content) {
    const next = prepareResume({ ...content, $schema: resume.$schema, meta: resume.meta })
    next.basics.image = resume.basics?.image
    const settings = settingsOf(next)
    for (const key of DEFAULT_ORDER) {
        if (hasContent(next, key) && !settings.sections.some(s => s.key === key)) settings.sections.push(sectionLayout(key))
    }
    for (const key of Object.keys(settings.hidden)) {
        if (itemsOf(next, key).length !== itemsOf(resume, key).length) delete settings.hidden[key]
    }
    return next
}

// ---- Sections -------------------------------------------------------------

/** Sections that can still be added to the layout. */
export function availableSections(resume) {
    const used = new Set(settingsOf(resume).sections.map(s => s.key))
    return SECTION_KEYS.filter(key => !used.has(key))
}

export function addSection(resume, key) {
    const layout = sectionLayout(key)
    if (!hasSidebar(settingsOf(resume).template)) layout.column = 'main'
    settingsOf(resume).sections.push(layout)
}

/** Removes a section from the layout and deletes its items. */
export function removeSection(resume, key) {
    const settings = settingsOf(resume)
    settings.sections = settings.sections.filter(s => s.key !== key)
    if (isListSection(key)) sectionItems(resume, key).splice(0)
    delete settings.hidden[key]
}

export function moveSection(resume, key, direction) {
    const sections = settingsOf(resume).sections
    const from = sections.findIndex(s => s.key === key)
    swap(sections, from, from + (direction === 'up' ? -1 : 1))
}

// ---- Items ----------------------------------------------------------------
// Hidden items are stored by index, so every operation that changes indices
// goes through these helpers to keep `hidden` in sync.

export function isItemHidden(resume, key, index) {
    return settingsOf(resume).hidden[key]?.includes(index) ?? false
}

export function toggleItemHidden(resume, key, index) {
    const hidden = new Set(settingsOf(resume).hidden[key])
    hidden.has(index) ? hidden.delete(index) : hidden.add(index)
    setHidden(resume, key, hidden)
}

export function removeItem(resume, key, index) {
    sectionItems(resume, key).splice(index, 1)
    const hidden = [...(settingsOf(resume).hidden[key] || [])]
        .filter(i => i !== index)
        .map(i => (i > index ? i - 1 : i))
    setHidden(resume, key, hidden)
}

export function moveItem(resume, key, index, direction) {
    const target = index + (direction === 'up' ? -1 : 1)
    if (!swap(sectionItems(resume, key), index, target)) return
    const hidden = [...(settingsOf(resume).hidden[key] || [])]
        .map(i => (i === index ? target : i === target ? index : i))
    setHidden(resume, key, hidden)
}

function setHidden(resume, key, indices) {
    const sorted = [...indices].sort((a, b) => a - b)
    if (sorted.length) settingsOf(resume).hidden[key] = sorted
    else delete settingsOf(resume).hidden[key]
}

function swap(array, a, b) {
    if (a < 0 || b < 0 || a >= array.length || b >= array.length) return false
    ;[array[a], array[b]] = [array[b], array[a]]
    return true
}

// ---- Templates ------------------------------------------------------------

/** Switches template, resetting colors, typography and spacing to its defaults. */
export function applyTemplate(resume, templateKey) {
    const settings = settingsOf(resume)
    Object.assign(settings, { template: templateKey }, templateStyle(templateKey))
}

/** A copy of the resume rendered with another template (for previews). */
export function withTemplate(resume, templateKey) {
    return {
        ...resume,
        meta: { ...resume.meta, resumeBuilder: { ...settingsOf(resume), template: templateKey, ...TEMPLATES[templateKey].style } },
    }
}

// ---- Sample ---------------------------------------------------------------

export function sampleResume() {
    return prepareResume({
        basics: {
            name: 'John Doe',
            label: 'Software Engineer',
            email: 'john.doe@example.com',
            phone: '+1 555 0100',
            summary: 'Passionate software engineer with a strong focus on web development and user experience. Experienced in building modern, responsive applications using **Vue.js** and other cutting-edge technologies.\n\nSkilled in both frontend and backend development, with a particular emphasis on creating intuitive user interfaces and robust server-side solutions.',
            location: { city: 'New York', countryCode: 'US' },
            profiles: [
                { network: 'GitHub', username: 'johndoe', url: 'https://github.com/johndoe' },
                { network: 'LinkedIn', username: 'johndoe', url: 'https://linkedin.com/in/johndoe' },
            ],
        },
        work: [
            {
                name: 'Tech Solutions Inc.',
                position: 'Senior Software Engineer',
                location: 'Milan',
                startDate: '2020-03',
                summary: 'Led the development of enterprise-level web applications using Vue.js and Node.js.',
                highlights: ['Implemented CI/CD pipelines', 'Improved application performance by **40%**'],
            },
            {
                name: 'Digital Innovations',
                position: 'Full Stack Developer',
                location: 'Rome',
                startDate: '2018-01',
                endDate: '2020-02',
                summary: 'Developed and maintained multiple web applications. Collaborated with UX designers to implement responsive interfaces and improve user experience.',
            },
        ],
        education: [
            {
                institution: 'University of Milan',
                studyType: 'Master',
                area: 'Computer Science',
                startDate: '2016',
                endDate: '2018',
                score: '110/110',
                courses: ['Thesis: Advanced Web Development Techniques and Best Practices'],
            },
            {
                institution: 'University of Rome',
                studyType: 'Bachelor',
                area: 'Computer Engineering',
                startDate: '2013',
                endDate: '2016',
                score: '108/110',
                courses: ['Thesis: Introduction to Modern Web Technologies'],
            },
        ],
        skills: [
            { name: 'Frontend', keywords: ['Vue.js', 'JavaScript', 'TypeScript', 'HTML/CSS'] },
            { name: 'Backend', keywords: ['Python', 'Node.js'] },
            { name: 'Tooling', keywords: ['Git', 'Docker'] },
        ],
        languages: [
            { language: 'Italian', fluency: 'Native speaker' },
            { language: 'English', fluency: 'C1' },
            { language: 'Spanish', fluency: 'B1' },
        ],
    })
}
