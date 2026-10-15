// Builds the JSON document consumed by the Typst templates from a resume.
// Every section is reduced to one of a few generic shapes (kinds), so the
// templates only need to know how to draw those:
//   text       { content }                       basics.summary
//   contact    { items: [{ text, href }] }       email, phone, website, location
//   links      { items: [{ label, text, href }] } basics.profiles
//   entries    { items: [{ title, subtitle, date, location, href, details, summary, highlights, keywords }] }
//   tags       { items: [{ name, level, keywords }] }
//   languages  { items: [{ name, fluency, level }] }
// Sizes in the style are CSS px; Typst gets pt.
import { degree, hasContent, itemsOf } from '@/resume/sections'
import { settingsOf } from '@/resume/resume'
import { TEMPLATES, hasSidebar } from '@/resume/templates'
import { fluencyLevel, formatDate, formatLocation, formatRange } from '@/resume/format'
import { resolveFont, typstFamily } from './fonts'
import { cssColorToHex } from './colors'
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
    const { colors = {}, typography = {}, spacing = {}, photo = {} } = settings
    const template = TEMPLATES[settings.template] || TEMPLATES.TwoColumnsBlue
    const withSidebar = hasSidebar(settings.template) && spacing.sidebarWidth > 0

    const main = []
    const sidebar = []
    for (const { column, ...section } of buildSections(resume)) {
        ;(withSidebar && column === 'sidebar' ? sidebar : main).push(section)
    }

    const headingFont = resolveFont(typography.headingFont)
    const bodyFont = resolveFont(typography.bodyFont)
    const fonts = new Set([headingFont, bodyFont])
    if (usesCode([main, sidebar])) fonts.add('Cousine') // lib.typ sets code in Cousine

    const color = (value, fallback) => cssColorToHex(value) || cssColorToHex(fallback) || '#000000'
    const primary = color(colors.primary, '#000000')
    const basics = resume.basics || {}

    const data = {
        template: template.layout,
        title: [basics.name, basics.label].filter(Boolean).join(' - ') || 'Resume',
        personal: { name: basics.name || 'Your Name', title: basics.label || '' },
        image: basics.image ? { path: AVATAR_PATH, x: photo.x ?? 50, y: photo.y ?? 50, scale: photo.scale ?? 100 } : null,
        colors: {
            primary,
            text: color(colors.text, primary),
            background: color(colors.background, '#ffffff'),
            sidebarBackground: color(colors.sidebarBackground, primary),
            sidebarText: color(colors.sidebarText, primary),
            dates: color(colors.datesTextColor, primary),
            subtitle: color(colors.subtitleTextColor, primary),
            link: color(colors.link, primary),
        },
        fonts: { heading: typstFamily(headingFont), body: typstFamily(bodyFont) },
        sizes: {
            base: (typography.baseSize || 14) * PX_TO_PT,
            heading: (typography.headingSize || 24) * PX_TO_PT,
            section: (spacing.section ?? 24) * PX_TO_PT,
            content: (spacing.content ?? 12) * PX_TO_PT,
            sidebar: withSidebar ? spacing.sidebarWidth * PX_TO_PT : 0,
        },
        sidebarLeft: Boolean(spacing.sidebarLeft),
        main,
        sidebar,
    }

    return { data, fonts: [...fonts] }
}

function usesCode(value) {
    if (Array.isArray(value)) return value.some(usesCode)
    if (value && typeof value === 'object') return value.t === 'code' || Object.values(value).some(usesCode)
    return false
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
