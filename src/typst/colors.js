// Color values from the style editor, normalized for Typst's rgb().

/**
 * Normalizes CSS colors (#rgb, #rrggbb, rgb(), rgba()) to #rrggbb[aa], or null.
 * @param {string} color
 * @returns {string|null}
 */
export function cssColorToHex(color) {
    if (!color) return null
    const value = color.trim().toLowerCase()
    if (/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(value)) {
        if (value.length > 5) return value
        return '#' + value.slice(1).split('').map(ch => ch + ch).join('')
    }
    const rgb = value.match(/^rgba?\(([^)]+)\)$/)
    if (rgb) {
        const [r, g, b, a] = rgb[1].split(/[\s,/]+/).filter(Boolean).map(Number)
        const hex = [r, g, b].map(n => Math.round(n).toString(16).padStart(2, '0')).join('')
        const alpha = a === undefined || a >= 1 ? '' : Math.round(a * 255).toString(16).padStart(2, '0')
        return `#${hex}${alpha}`
    }
    return null
}
