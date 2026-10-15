// Fonts bundled with the app (see scripts/fetch-fonts.mjs). Typst renders with
// these exact files on every device, which is what makes the output identical
// everywhere. `name` must match the family name stored inside the TTF.
const FULL = ['regular', 'italic', '700', '700italic']

export const FONT_FAMILIES = [
    { id: 'inter', name: 'Inter', category: 'sans', variants: FULL },
    { id: 'source-sans-3', name: 'Source Sans 3', category: 'sans', variants: FULL },
    { id: 'arimo', name: 'Arimo', category: 'sans', variants: FULL },
    { id: 'gelasio', name: 'Gelasio', category: 'serif', variants: FULL },
    { id: 'eb-garamond', name: 'EB Garamond', category: 'serif', variants: FULL },
    { id: 'source-serif-4', name: 'Source Serif 4', category: 'serif', variants: FULL },
]

// Used, in order, for the characters a chosen family lacks (e.g. Gelasio has
// no Cyrillic or Greek; only Arimo has Hebrew)
const FALLBACK_FONTS = { sans: ['Arimo'], serif: ['Source Serif 4', 'Arimo'] }

/** Scripts the fallback fonts add; only resumes using them need the fallback loaded. */
export const FALLBACK_SCRIPTS = /[\u0370-\u03FF\u1F00-\u1FFF\u0400-\u052F\u1C80-\u1C8F\u2DE0-\u2DFF\uA640-\uA69F\u0590-\u05FF\u1EA0-\u1EFF]/

/**
 * @param {string} name - A bundled family name
 * @returns {string[]} The fallback families for characters the family lacks
 */
export function fallbackFonts(name) {
    const category = FONT_FAMILIES.find(f => f.name === name)?.category
    return (FALLBACK_FONTS[category] || FALLBACK_FONTS.sans).filter(f => f !== name)
}

/**
 * @param {string} name - A bundled family name
 * @returns {string[]} URLs of the family's TTF files
 */
export function fontUrls(name) {
    const family = FONT_FAMILIES.find(f => f.name === name)
    if (!family) return []
    const base = import.meta.env?.BASE_URL ?? '/'
    return family.variants.map(v => `${base}fonts/${family.id}/${v}.ttf`)
}

const VARIANT_CSS = {
    regular: 'font-weight: 400; font-style: normal;',
    italic: 'font-weight: 400; font-style: italic;',
    '700': 'font-weight: 700; font-style: normal;',
    '700italic': 'font-weight: 700; font-style: italic;',
}

/**
 * Exposes the bundled fonts to the page (font pickers, rich text editor).
 * Browsers only download a face once something on the page uses it.
 */
export function registerFontFaces() {
    const base = import.meta.env?.BASE_URL ?? '/'
    const css = FONT_FAMILIES.flatMap(family => family.variants.map(v => `@font-face {
    font-family: '${family.name}';
    src: url('${base}fonts/${family.id}/${v}.ttf') format('truetype');
    ${VARIANT_CSS[v]}
    font-display: swap;
}`)).join('\n')
    const style = document.createElement('style')
    style.id = 'bundled-fonts'
    style.textContent = css
    document.head.appendChild(style)
}
