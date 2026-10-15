// Converts the HTML produced by the TipTap editor into a small JSON tree that
// the Typst templates render (see templates/lib.typ). Text travels as data, so
// nothing typed by the user can be interpreted as Typst markup.
import { resolveFont, typstFamily } from './fonts'

const PX_TO_PT = 0.75

// Matches the language proficiency syntax: (Italian)[BAR:90]
const BAR_PATTERN = /\(([^)]+)\)\[BAR:(\d+)\]/g

const INLINE_MARKS = {
    strong: 'strong', b: 'strong',
    em: 'em', i: 'em',
    u: 'u',
    s: 's', strike: 's', del: 's',
    code: 'code',
}

const BLOCKS = new Set(['p', 'div', 'li', 'ul', 'ol', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr'])

/**
 * @param {string} html - Rich text HTML (or plain text) from the editor
 * @param {Set<string>} [fonts] - Collects the bundled font families referenced by the content
 * @returns {Array} Nodes: strings for text, objects ({ t: ... }) for everything else
 */
export function htmlToNodes(html, fonts = new Set()) {
    if (!html) return []
    const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
    return convertChildren(doc.body, fonts)
}

function convertChildren(el, fonts) {
    const children = Array.from(el.childNodes)
    const hasBlocks = children.some(c => c.nodeType === 1 && BLOCKS.has(c.tagName.toLowerCase()))
    const nodes = []
    for (const child of children) {
        // Whitespace between block elements is formatting, not content
        if (hasBlocks && child.nodeType === 3 && !child.textContent.trim()) continue
        nodes.push(...convertNode(child, fonts))
    }
    return nodes
}

function convertNode(node, fonts) {
    if (node.nodeType === 3) return convertText(node.textContent)
    if (node.nodeType !== 1) return []

    const tag = node.tagName.toLowerCase()
    const c = () => convertChildren(node, fonts)

    if (INLINE_MARKS[tag]) {
        if (tag === 'code') fonts.add('Cousine') // lib.typ sets code in Cousine
        return [{ t: INLINE_MARKS[tag], c: c() }]
    }

    switch (tag) {
        case 'br':
            return [{ t: 'br' }]
        case 'hr':
            return [{ t: 'hr' }]
        case 'p':
            return [{ t: 'p', align: textAlign(node), c: c() }]
        case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
            return [{ t: 'h', level: Number(tag[1]), align: textAlign(node), c: c() }]
        case 'ul': case 'ol':
            return [{
                t: tag,
                items: Array.from(node.children)
                    .filter(li => li.tagName.toLowerCase() === 'li')
                    .map(li => convertChildren(li, fonts)),
            }]
        case 'blockquote':
            return [{ t: 'quote', c: c() }]
        case 'a':
            return [{ t: 'a', href: node.getAttribute('href') || '', c: c() }]
        case 'span':
            return [styledSpan(node, c(), fonts)]
        case 'script': case 'style':
            return []
        default:
            // Unknown elements keep their content; block-level ones stay blocks
            return BLOCKS.has(tag) ? [{ t: 'div', c: c() }] : c()
    }
}

function convertText(text) {
    const nodes = []
    let last = 0
    for (const match of text.matchAll(BAR_PATTERN)) {
        nodes.push(...splitLines(text.slice(last, match.index)))
        nodes.push({ t: 'bar', label: match[1], value: Math.min(100, Number(match[2])) })
        last = match.index + match[0].length
    }
    nodes.push(...splitLines(text.slice(last)))
    return nodes
}

// The HTML templates rendered with `white-space: pre-wrap`, so newlines in text are line breaks
function splitLines(text) {
    if (!text) return []
    const nodes = []
    text.split('\n').forEach((line, i) => {
        if (i > 0) nodes.push({ t: 'br' })
        if (line) nodes.push(line)
    })
    return nodes
}

function textAlign(el) {
    const align = el.style?.textAlign
    return ['left', 'center', 'right', 'justify'].includes(align) ? align : null
}

function styledSpan(el, children, fonts) {
    const span = { t: 'span', c: children }
    const { color, fontSize, fontFamily } = el.style || {}
    if (color) span.color = cssColorToHex(color)
    if (fontSize) {
        const size = parseFloat(fontSize)
        if (fontSize.endsWith('px')) span.size = size * PX_TO_PT
        else if (fontSize.endsWith('pt')) span.size = size
        else if (fontSize.endsWith('em')) span.scale = size
        else if (fontSize.endsWith('%')) span.scale = size / 100
    }
    if (fontFamily) {
        const font = resolveFont(fontFamily)
        fonts.add(font)
        span.font = typstFamily(font)
    }
    return span
}

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
