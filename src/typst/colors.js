// Colors of a resume, all derived from its accent color.

const TEXT = '#1F2328'
const MUTED = '#6B7280'
const WHITE = '#FFFFFF'

function channels(hex) {
    return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
}

function toHex(rgb) {
    return '#' + rgb.map(c => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0')).join('')
}

// WCAG relative luminance and contrast ratio
function luminance(hex) {
    const [r, g, b] = channels(hex).map(c => {
        const v = c / 255
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a, b) {
    const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (l1 + 0.05) / (l2 + 0.05)
}

/** Darkens a color until it reaches the given contrast against white. */
function readableOnWhite(hex, ratio) {
    let rgb = channels(hex)
    while (contrast(toHex(rgb), WHITE) < ratio) rgb = rgb.map(c => c * 0.9)
    return toHex(rgb)
}

/**
 * All the colors of a resume, from its accent color: headings and links use
 * the accent (darkened if too light to read on white), the sidebar is filled
 * with it, and sidebar text is white or black, whichever reads better.
 * @param {string} accent - #rrggbb
 */
export function deriveColors(accent) {
    const primary = readableOnWhite(accent, 4.5)
    return {
        primary,
        text: TEXT,
        background: WHITE,
        sidebarBackground: accent,
        sidebarText: contrast(accent, WHITE) >= 4.5 ? WHITE : TEXT,
        dates: MUTED,
        subtitle: MUTED,
        link: primary,
    }
}
