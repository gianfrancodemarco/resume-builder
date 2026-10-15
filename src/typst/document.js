// Builds the JSON document consumed by the Typst templates from the app's
// resume data and style. Sizes in the style model are CSS px; Typst gets pt.
import { resolveFont, typstFamily } from './fonts'
import { cssColorToHex, htmlToNodes } from './richtext'

const PX_TO_PT = 0.75

// Style templateName -> Typst template in src/typst/templates
const TEMPLATES = {
    TwoColumnsBlue: 'two-column',
    TwoColumnsGreen: 'two-column',
    OneColumnModern: 'one-column-modern',
}

export const AVATAR_PATH = '/assets/avatar'

/**
 * Orders the visible sections the same way the editor lists them.
 * @returns {Array<{type: string, order: number, data?: object}>}
 */
export function orderedSections(resumeData) {
    const sections = []
    if (resumeData.experiencesVisible && resumeData.experiences?.some(e => e?.visible)) {
        sections.push({ type: 'experiences', order: resumeData.experiencesOrder })
    }
    if (resumeData.educationVisible && resumeData.education?.some(e => e?.visible)) {
        sections.push({ type: 'education', order: resumeData.educationOrder })
    }
    (resumeData.customSections || []).forEach((section, index) => {
        if (section && section.visible !== false) {
            sections.push({ type: 'custom', order: section.order ?? index, data: section })
        }
    })
    return sections.sort((a, b) => a.order - b.order)
}

/**
 * @param {object} resumeData
 * @param {object} resumeStyle
 * @returns {{ data: object, fonts: string[] }} The template input and the bundled font families it needs
 */
export function buildDocument(resumeData, resumeStyle) {
    const { colors = {}, typography = {}, spacing = {} } = resumeStyle
    const template = TEMPLATES[resumeStyle.templateName] || 'two-column'
    const hasSidebar = template === 'two-column' && spacing.sidebarWidth > 0

    const headingFont = resolveFont(typography.headingFont)
    const bodyFont = resolveFont(typography.bodyFont)
    const fonts = new Set([headingFont, bodyFont])
    const rich = html => htmlToNodes(html, fonts)

    const color = (value, fallback) => cssColorToHex(value) || cssColorToHex(fallback) || '#000000'
    const primary = color(colors.primary, '#000000')

    const main = []
    const sidebar = []
    for (const section of orderedSections(resumeData)) {
        if (section.type === 'experiences') {
            main.push({
                type: 'experiences',
                title: resumeData.experiencesSectionName || '',
                items: resumeData.experiences.filter(e => e?.visible).map(e => ({
                    title: e.title || '',
                    company: e.company || '',
                    period: e.period || '',
                    description: rich(e.description),
                })),
            })
        } else if (section.type === 'education') {
            main.push({
                type: 'education',
                title: resumeData.educationSectionName || '',
                items: resumeData.education.filter(e => e?.visible).map(e => ({
                    degree: e.degree || '',
                    school: e.school || '',
                    period: e.period || '',
                    mark: e.mark || '',
                    thesis: rich(e.thesis),
                })),
            })
        } else {
            const custom = { type: 'custom', title: section.data.title || '', content: rich(section.data.content) }
            if (hasSidebar && section.data.position === 'sidebar') sidebar.push(custom)
            else main.push(custom)
        }
    }

    const image = resumeData.personal?.image
    const data = {
        template,
        title: [resumeData.personal?.name, resumeData.personal?.title].filter(Boolean).join(' - ') || 'Resume',
        personal: {
            name: resumeData.personal?.name || 'Your Name',
            title: resumeData.personal?.title || '',
        },
        image: image?.data ? {
            path: AVATAR_PATH,
            x: image.x ?? 50,
            y: image.y ?? 50,
            scale: image.scale ?? 100,
        } : null,
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
        fonts: {
            heading: typstFamily(headingFont),
            body: typstFamily(bodyFont),
        },
        sizes: {
            base: (typography.baseSize || 14) * PX_TO_PT,
            heading: (typography.headingSize || 24) * PX_TO_PT,
            section: (spacing.section ?? 24) * PX_TO_PT,
            content: (spacing.content ?? 12) * PX_TO_PT,
            sidebar: hasSidebar ? spacing.sidebarWidth * PX_TO_PT : 0,
        },
        sidebarLeft: Boolean(spacing.sidebarLeft),
        main,
        sidebar,
    }

    return { data, fonts: [...fonts] }
}

const TYPST_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml']

/**
 * Decodes the avatar data URL into bytes Typst can read. Formats Typst does
 * not support (e.g. webp, heic) are re-encoded as PNG through a canvas.
 * @param {string} dataUrl
 * @returns {Promise<Uint8Array>}
 */
export async function imageDataUrlToBytes(dataUrl) {
    const mime = dataUrl.slice(5, dataUrl.indexOf(';')).toLowerCase()
    if (!TYPST_IMAGE_TYPES.includes(mime)) {
        dataUrl = await reencodeAsPng(dataUrl)
    }
    const res = await fetch(dataUrl)
    return new Uint8Array(await res.arrayBuffer())
}

async function reencodeAsPng(dataUrl) {
    const img = new Image()
    img.src = dataUrl
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    canvas.getContext('2d').drawImage(img, 0, 0)
    return canvas.toDataURL('image/png')
}
