// Fonts bundled with the app (see scripts/fetch-fonts.mjs). Typst renders with
// these exact files on every device, which is what makes the output identical
// everywhere. `name` is what users see; `typstName` is the family name stored
// inside the TTF when the two differ.
const FULL = ['regular', 'italic', '700', '700italic']

export const FONT_FAMILIES = [
    { id: 'inter', name: 'Inter', variants: FULL },
    { id: 'roboto', name: 'Roboto', variants: FULL },
    { id: 'open-sans', name: 'Open Sans', variants: FULL },
    { id: 'lato', name: 'Lato', variants: FULL },
    { id: 'source-sans-3', name: 'Source Sans 3', variants: FULL },
    { id: 'montserrat', name: 'Montserrat', variants: FULL },
    { id: 'arimo', name: 'Arimo', variants: FULL },
    { id: 'gelasio', name: 'Gelasio', variants: FULL },
    { id: 'tinos', name: 'Tinos', variants: FULL },
    { id: 'merriweather', name: 'Merriweather', typstName: 'Merriweather Light 18pt', variants: FULL },
    { id: 'lora', name: 'Lora', variants: FULL },
    { id: 'eb-garamond', name: 'EB Garamond', variants: FULL },
    { id: 'source-serif-4', name: 'Source Serif 4', variants: FULL },
    { id: 'cousine', name: 'Cousine', variants: FULL },
]

export const FONT_NAMES = FONT_FAMILIES.map(f => f.name)

export const DEFAULT_FONT = 'Inter'

/**
 * Picks the first bundled family in a font name or CSS font stack.
 * @param {string} font
 * @returns {string} The bundled family, or the default font if none matches
 */
export function resolveFont(font) {
    const candidates = (font || '').split(',').map(f => f.trim().replace(/^['"]|['"]$/g, '').toLowerCase())
    for (const candidate of candidates) {
        const bundled = FONT_NAMES.find(name => name.toLowerCase() === candidate)
        if (bundled) return bundled
    }
    return DEFAULT_FONT
}

/**
 * @param {string} name - A bundled family name
 * @returns {string} The family name Typst knows the font by
 */
export function typstFamily(name) {
    const family = FONT_FAMILIES.find(f => f.name === name)
    return family?.typstName || family?.name || name
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
