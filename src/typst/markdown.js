// Converts the Markdown stored in JSON Resume text fields into a small JSON
// tree that the Typst templates render (see templates/lib.typ). Text travels
// as data, so nothing typed by the user can be interpreted as Typst markup.
import { Lexer } from 'marked'

// Single newlines are line breaks, as in a textarea or a GitHub comment
const lexerOptions = { gfm: true, breaks: true }

/**
 * @param {string} markdown
 * @returns {Array} Nodes: strings for text, objects ({ t: ... }) for everything else
 */
export function markdownToNodes(markdown) {
    if (!markdown?.trim()) return []
    return blocks(new Lexer(lexerOptions).lex(markdown))
}

function blocks(tokens) {
    return tokens.flatMap(token => {
        switch (token.type) {
            case 'paragraph':
                return [{ t: 'p', c: inline(token.tokens) }]
            case 'text': // loose text inside list items
                return [{ t: 'p', c: token.tokens ? inline(token.tokens) : lines(token.text) }]
            case 'heading':
                return [{ t: 'h', level: token.depth, c: inline(token.tokens) }]
            case 'list':
                return [{ t: token.ordered ? 'ol' : 'ul', items: token.items.map(item => blocks(item.tokens)) }]
            case 'blockquote':
                return [{ t: 'quote', c: blocks(token.tokens) }]
            case 'hr':
                return [{ t: 'hr' }]
            case 'code':
                return [{ t: 'p', c: [{ t: 'code', c: lines(token.text) }] }]
            case 'table':
                return [token.header, ...token.rows].map(row => ({ t: 'p', c: row.flatMap((cell, i) => [...(i ? [' | '] : []), ...inline(cell.tokens)]) }))
            case 'html':
                return token.text.trim() ? [{ t: 'p', c: lines(token.text.trim()) }] : []
            default: // space, def
                return []
        }
    })
}

function inline(tokens = []) {
    return tokens.flatMap(token => {
        switch (token.type) {
            case 'strong':
                return [{ t: 'strong', c: inline(token.tokens) }]
            case 'em':
                return [{ t: 'em', c: inline(token.tokens) }]
            case 'del':
                return [{ t: 's', c: inline(token.tokens) }]
            case 'codespan':
                return [{ t: 'code', c: [token.text] }]
            case 'link':
                return [{ t: 'a', href: token.href, c: inline(token.tokens) }]
            case 'image':
                return token.text ? [token.text] : []
            case 'br':
                return [{ t: 'br' }]
            case 'text':
                return token.tokens ? inline(token.tokens) : lines(token.text)
            default: // escape, html and anything else: keep the text
                return lines(token.text ?? token.raw ?? '')
        }
    })
}

function lines(text) {
    return text.split('\n').flatMap((line, i) => [...(i ? [{ t: 'br' }] : []), ...(line ? [line] : [])])
}
