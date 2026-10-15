// Builds the JSON document consumed by the Typst templates from a resume.
// Every section is reduced to one of a few generic shapes (kinds), so the
// templates only need to know how to draw those:
//   text       { content }                       basics.summary
//   contact    { items: [{ text, href }] }       email, phone, website, location
//   links      { items: [{ label, text, href }] } basics.profiles
//   entries    { items: [{ title, subtitle, date, location, href, details, summary, highlights, keywords }] }
//   tags       { items: [{ name, level, keywords }] }
//   languages  { items: [{ name, fluency, level }] }
// Sizes in the design are CSS px; Typst gets pt.
import { degree, hasContent, itemsOf } from '@/resume/sections'
import { resumeContent, settingsOf } from '@/resume/resume'
import { DENSITIES, FONT_PAIRINGS, LAYOUTS, SIDEBAR_WIDTH, SIZES, hasSidebar } from '@/resume/design'
import { fluencyLevel, formatDate, formatLocation, formatRange } from '@/resume/format'
import { FALLBACK_SCRIPTS, fallbackFonts } from './fonts'
import { deriveColors } from './colors'
import { markdownToNodes } from './markdown'

const PX_TO_PT = 0.75

export const AVATAR_PATH = '/assets/avatar'

const md = markdownToNodes
const mdList = list => (list || []).filter(s => s?.trim()).map(md)
const strings = list => (list || []).filter(s => s?.trim())

const ENTRY_MAPPERS = {
    work: w => ({
        title: w.position, subtitle: w.name, location: w.location, href: w.url,
        date: formatRange(w.startDate, w.endDate),
        details: strings([w.description]), summary: md(w.summary), highlights: mdList(w.highlights),
    }),
    volunteer: v => ({
        title: v.position, subtitle: v.organization, href: v.url,
        date: formatRange(v.startDate, v.endDate),
        summary: md(v.summary), highlights: mdList(v.highlights),
    }),
    education: e => ({
        title: degree(e), subtitle: e.institution, href: e.url,
        date: formatRange(e.startDate, e.endDate),
        details: strings([e.score]), highlights: mdList(e.courses),
    }),
    awards: a => ({ title: a.title, subtitle: a.awarder, date: formatDate(a.date), summary: md(a.summary) }),
    certificates: c => ({ title: c.name, subtitle: c.issuer, date: formatDate(c.date), href: c.url }),
    publications: p => ({
        title: p.name, subtitle: p.publisher, date: formatDate(p.releaseDate), href: p.url, summary: md(p.summary),
    }),
    projects: p => ({
        title: p.name, subtitle: [p.entity, ...strings(p.roles)].filter(Boolean).join(' · '), href: p.url,
        date: formatRange(p.startDate, p.endDate),
        summary: md(p.description), highlights: mdList(p.highlights), keywords: strings(p.keywords),
    }),
    references: r => ({ title: r.name, summary: md(r.reference) }),
}

const ENTRY_DEFAULTS = { title: '', subtitle: '', date: '', location: '', href: '', details: [], summary: [], highlights: [], keywords: [] }

function buildSection(resume, key, visibleItems) {
    const basics = resume.basics || {}
    switch (key) {
        case 'summary':
            return { kind: 'text', content: md(basics.summary) }
        case 'contact':
            return {
                kind: 'contact',
                items: [
                    { text: formatLocation(basics.location), href: '' },
                    { text: basics.email, href: basics.email ? `mailto:${basics.email}` : '' },
                    { text: basics.phone, href: basics.phone ? `tel:${basics.phone.replace(/[^\d+]/g, '')}` : '' },
                    { text: basics.url?.replace(/^https?:\/\//, ''), href: basics.url },
                ].filter(item => item.text).map(item => ({ ...item, href: item.href || '' })),
            }
        case 'profiles':
            return {
                kind: 'links',
                items: visibleItems.map(p => ({
                    label: p.network || '',
                    text: p.username || p.url?.replace(/^https?:\/\//, '') || '',
                    href: p.url || '',
                })),
            }
        case 'skills':
        case 'interests':
            return {
                kind: 'tags',
                items: visibleItems.map(s => ({ name: s.name || '', level: s.level || '', keywords: strings(s.keywords) })),
            }
        case 'languages':
            return {
                kind: 'languages',
                items: visibleItems.map(l => ({ name: l.language || '', fluency: l.fluency || '', level: fluencyLevel(l.fluency) })),
            }
        default:
            return {
                kind: 'entries',
                items: visibleItems.map(item => {
                    const entry = { ...ENTRY_DEFAULTS, ...ENTRY_MAPPERS[key](item) }
                    for (const field of ['title', 'subtitle', 'date', 'location', 'href']) entry[field] ||= ''
                    return entry
                }),
            }
    }
}

/**
 * The visible sections in layout order, with hidden items left out.
 * @returns {Array<{ key, title, column, kind, ... }>}
 */
export function buildSections(resume) {
    const settings = settingsOf(resume)
    const sections = []
    for (const layout of settings.sections) {
        if (!layout.visible || !hasContent(resume, layout.key)) continue
        const hidden = new Set(settings.hidden?.[layout.key])
        const items = layout.key === 'summary' || layout.key === 'contact'
            ? []
            : itemsOf(resume, layout.key).filter((_, i) => !hidden.has(i))
        const section = { key: layout.key, title: layout.title, column: layout.column, ...buildSection(resume, layout.key, items) }
        if (section.items?.length !== 0) sections.push(section)
    }
    return sections
}

/**
 * @param {object} resume - A prepared resume (see prepareResume)
 * @returns {{ data: object, fonts: string[] }} The template input and the bundled font families it needs
 */
export function buildDocument(resume) {
    const settings = settingsOf(resume)
    const { design, photo = {} } = settings
    const size = SIZES[design.size]
    const density = DENSITIES[design.density]
    const pairing = FONT_PAIRINGS[design.fonts]
    const withSidebar = hasSidebar(design.layout)

    const layout = LAYOUTS[design.layout]
    const main = []
    const sidebar = []
    // Contact details and profiles shown in the header, for layouts that do that
    const header = { contact: [], links: [] }
    for (const { column, ...section } of buildSections(resume)) {
        if (layout.headerContact && section.kind === 'contact') header.contact = section.items
        else if (layout.headerContact && section.kind === 'links') header.links = section.items
        else (withSidebar && column === 'sidebar' ? sidebar : main).push(section)
    }

    // Each font is a list: Typst uses the next family for characters the first lacks.
    // The fallbacks are only added (and downloaded) when the text needs them.
    const needsFallback = FALLBACK_SCRIPTS.test(JSON.stringify(resumeContent(resume)))
    const fontList = font => [font, ...(needsFallback ? fallbackFonts(font) : [])]
    const headingFonts = fontList(pairing.heading)
    const bodyFonts = fontList(pairing.body)
    const basics = resume.basics || {}

    const data = {
        template: layout.typst,
        title: [basics.name, basics.label].filter(Boolean).join(' - ') || 'Resume',
        personal: { name: basics.name || 'Your Name', title: basics.label || '' },
        image: basics.image ? { path: AVATAR_PATH, x: photo.x ?? 50, y: photo.y ?? 50, scale: photo.scale ?? 100 } : null,
        colors: deriveColors(design.accent),
        fonts: { heading: headingFonts, body: bodyFonts },
        sizes: {
            base: size.base * PX_TO_PT,
            heading: size.heading * PX_TO_PT,
            section: density.section * PX_TO_PT,
            content: density.content * PX_TO_PT,
            sidebar: withSidebar ? SIDEBAR_WIDTH * PX_TO_PT : 0,
        },
        sidebarLeft: design.sidebarLeft,
        header,
        main,
        sidebar,
    }

    return { data, fonts: [...new Set([...headingFonts, ...bodyFonts])] }
}

const TYPST_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml']

/**
 * Loads the photo (data URL or web URL) as bytes Typst can read. Formats
 * Typst does not support (e.g. webp) are re-encoded as PNG through a canvas.
 * @param {string} src
 * @returns {Promise<Uint8Array>}
 */
export async function imageToBytes(src) {
    const res = await fetch(src)
    if (!res.ok) throw new Error(`Could not load the photo (${res.status})`)
    const blob = await res.blob()
    if (TYPST_IMAGE_TYPES.includes(blob.type)) return new Uint8Array(await blob.arrayBuffer())
    return reencodeAsPng(blob)
}

async function reencodeAsPng(blob) {
    const bitmap = await createImageBitmap(blob)
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    canvas.getContext('2d').drawImage(bitmap, 0, 0)
    const png = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    return new Uint8Array(await png.arrayBuffer())
}
