// The visual design of a resume: a few deliberate choices instead of free
// knobs. Every combination is meant to look good; all colors are derived
// from the accent (see typst/colors.js). Stored in resume.meta.resumeBuilder.design.

// `headerContact`: contact details and profiles are shown in the header
// instead of as sections
export const LAYOUTS = {
    sidebar: { name: 'Sidebar', description: 'Colored sidebar next to the main column', typst: 'two-column', sidebar: true },
    classic: { name: 'Classic', description: 'Section titles in a narrow left column', typst: 'one-column-modern', sidebar: false },
    minimal: { name: 'Minimal', description: 'Centered header, one column, ATS friendly', typst: 'minimal', sidebar: false, headerContact: true },
    banner: { name: 'Banner', description: 'Colored header band with photo', typst: 'banner', sidebar: false, headerContact: true },
    timeline: { name: 'Timeline', description: 'Dates in a column along a timeline', typst: 'timeline', sidebar: false, headerContact: true },
}

export const ACCENTS = [
    { name: 'Navy', value: '#08294D' },
    { name: 'Slate', value: '#334155' },
    { name: 'Teal', value: '#0F5E68' },
    { name: 'Forest', value: '#1F6B45' },
    { name: 'Burgundy', value: '#7A1F3D' },
    { name: 'Plum', value: '#4C2A6B' },
    { name: 'Charcoal', value: '#36454F' },
    { name: 'Brown', value: '#795548' },
    { name: 'Indigo', value: '#4B0082' },
]

// Heading and body families; all bundled (see typst/fonts.js)
export const FONT_PAIRINGS = {
    classic: { name: 'Classic', heading: 'Arimo', body: 'Gelasio' },
    modern: { name: 'Modern', heading: 'Inter', body: 'Inter' },
    elegant: { name: 'Elegant', heading: 'EB Garamond', body: 'EB Garamond' },
    editorial: { name: 'Editorial', heading: 'Source Sans 3', body: 'Source Serif 4' },
    clean: { name: 'Clean', heading: 'Source Sans 3', body: 'Source Sans 3' },
    contemporary: { name: 'Contemporary', heading: 'Inter', body: 'Gelasio' },
}

// Sizes in CSS px, converted to pt for Typst
export const SIZES = {
    s: { name: 'S', base: 13, heading: 24 },
    m: { name: 'M', base: 14, heading: 26 },
    l: { name: 'L', base: 15, heading: 28 },
}

export const DENSITIES = {
    compact: { name: 'Compact', section: 16, content: 8 },
    normal: { name: 'Normal', section: 24, content: 12 },
    airy: { name: 'Airy', section: 32, content: 16 },
}

export const SIDEBAR_WIDTH = 280

export const DEFAULT_DESIGN = {
    layout: 'sidebar',
    accent: ACCENTS[0].value,
    fonts: 'classic',
    size: 'm',
    density: 'normal',
    sidebarLeft: false,
}

const HEX_COLOR = /^#[0-9a-f]{6}$/i

/** The design with every value checked; unknown or missing values take the default. */
export function normalizeDesign(design = {}) {
    const pick = (key, valid) => (valid(design[key]) ? design[key] : DEFAULT_DESIGN[key])
    return {
        layout: pick('layout', v => v in LAYOUTS),
        accent: pick('accent', v => HEX_COLOR.test(v)),
        fonts: pick('fonts', v => v in FONT_PAIRINGS),
        size: pick('size', v => v in SIZES),
        density: pick('density', v => v in DENSITIES),
        sidebarLeft: pick('sidebarLeft', v => typeof v === 'boolean'),
    }
}

/** Whether the layout has a sidebar column sections can be placed in. */
export const hasSidebar = layout => Boolean(LAYOUTS[layout]?.sidebar)
