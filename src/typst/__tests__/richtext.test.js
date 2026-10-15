import { describe, expect, it } from 'vitest'
import { cssColorToHex, htmlToNodes } from '@/typst/richtext'

describe('htmlToNodes', () => {
    it('returns an empty list for empty content', () => {
        expect(htmlToNodes('')).toEqual([])
        expect(htmlToNodes(null)).toEqual([])
    })

    it('converts paragraphs and inline marks', () => {
        expect(htmlToNodes('<p>Hello <strong>bold</strong> <em>it</em> <u>u</u> <s>s</s></p>')).toEqual([
            {
                t: 'p', align: null, c: [
                    'Hello ', { t: 'strong', c: ['bold'] }, ' ', { t: 'em', c: ['it'] }, ' ',
                    { t: 'u', c: ['u'] }, ' ', { t: 's', c: ['s'] },
                ]
            },
        ])
    })

    it('keeps Typst markup characters as plain text', () => {
        expect(htmlToNodes('#set page() $x$ *a* _b_ [c] @d')).toEqual(['#set page() $x$ *a* _b_ [c] @d'])
    })

    it('converts line breaks, including newlines in plain text', () => {
        expect(htmlToNodes('Vue.js<br/>Python')).toEqual(['Vue.js', { t: 'br' }, 'Python'])
        expect(htmlToNodes('one\ntwo')).toEqual(['one', { t: 'br' }, 'two'])
    })

    it('converts links and lists', () => {
        expect(htmlToNodes('<ul><li><p><a href="https://x.dev">X</a></p></li><li><p>Y</p></li></ul>')).toEqual([
            {
                t: 'ul', items: [
                    [{ t: 'p', align: null, c: [{ t: 'a', href: 'https://x.dev', c: ['X'] }] }],
                    [{ t: 'p', align: null, c: ['Y'] }],
                ]
            },
        ])
    })

    it('converts text alignment', () => {
        expect(htmlToNodes('<p style="text-align: center">C</p>')[0].align).toBe('center')
    })

    it('converts span styles and collects the fonts they use', () => {
        const fonts = new Set()
        const [span] = htmlToNodes('<span style="color: rgb(255, 0, 0); font-size: 16px; font-family: Georgia">x</span>', fonts)
        expect(span).toEqual({ t: 'span', color: '#ff0000', size: 12, font: 'Gelasio', c: ['x'] })
        expect([...fonts]).toEqual(['Gelasio'])
    })

    it('uses the font name stored in the TTF for Typst', () => {
        const [span] = htmlToNodes('<span style="font-family: Merriweather">x</span>')
        expect(span.font).toBe('Merriweather Light 18pt')
    })

    it('converts language proficiency bars', () => {
        expect(htmlToNodes('(Italian)[BAR:100](English)[BAR:90]')).toEqual([
            { t: 'bar', label: 'Italian', value: 100 },
            { t: 'bar', label: 'English', value: 90 },
        ])
    })

    it('caps proficiency at 100', () => {
        expect(htmlToNodes('(X)[BAR:250]')).toEqual([{ t: 'bar', label: 'X', value: 100 }])
    })

    it('ignores whitespace between block elements', () => {
        expect(htmlToNodes('<p>a</p>\n  <p>b</p>')).toHaveLength(2)
    })

    it('drops script and style elements', () => {
        expect(htmlToNodes('<script>alert(1)</script><style>p{}</style>ok')).toEqual(['ok'])
    })
})

describe('cssColorToHex', () => {
    it('normalizes hex colors', () => {
        expect(cssColorToHex('#ABC')).toBe('#aabbcc')
        expect(cssColorToHex('#08294D')).toBe('#08294d')
    })

    it('converts rgb and rgba colors', () => {
        expect(cssColorToHex('rgb(8, 41, 77)')).toBe('#08294d')
        expect(cssColorToHex('rgba(255, 255, 255, 0.5)')).toBe('#ffffff80')
    })

    it('returns null for unsupported values', () => {
        expect(cssColorToHex('')).toBeNull()
        expect(cssColorToHex('papayawhip')).toBeNull()
    })
})
