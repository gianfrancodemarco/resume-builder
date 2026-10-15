import { describe, expect, it } from 'vitest'
import { markdownToNodes } from '@/typst/markdown'

describe('markdownToNodes', () => {
    it('returns an empty list for empty text', () => {
        expect(markdownToNodes('')).toEqual([])
        expect(markdownToNodes('  \n ')).toEqual([])
        expect(markdownToNodes(undefined)).toEqual([])
    })

    it('converts paragraphs and inline formatting', () => {
        expect(markdownToNodes('Hello **bold** *it* ~~old~~ `code`\n\nSecond')).toEqual([
            {
                t: 'p', c: [
                    'Hello ', { t: 'strong', c: ['bold'] }, ' ', { t: 'em', c: ['it'] }, ' ',
                    { t: 's', c: ['old'] }, ' ', { t: 'code', c: ['code'] },
                ]
            },
            { t: 'p', c: ['Second'] },
        ])
    })

    it('treats single newlines as line breaks', () => {
        expect(markdownToNodes('one\ntwo')).toEqual([{ t: 'p', c: ['one', { t: 'br' }, 'two'] }])
    })

    it('converts links and lists', () => {
        expect(markdownToNodes('- [Site](https://x.dev)\n- Two\n\n1. First')).toEqual([
            {
                t: 'ul', items: [
                    [{ t: 'p', c: [{ t: 'a', href: 'https://x.dev', c: ['Site'] }] }],
                    [{ t: 'p', c: ['Two'] }],
                ]
            },
            { t: 'ol', items: [[{ t: 'p', c: ['First'] }]] },
        ])
    })

    it('keeps Typst markup characters as plain text', () => {
        expect(markdownToNodes('#set page(width: 1pt) $x$ @ref [z] = 1')).toEqual([
            { t: 'p', c: ['#set page(width: 1pt) $x$ @ref [z] = 1'] },
        ])
    })

    it('keeps raw HTML as text instead of interpreting it', () => {
        const [paragraph] = markdownToNodes('<b>not bold</b>')
        expect(paragraph.c.every(node => typeof node === 'string')).toBe(true)
        expect(paragraph.c.join('')).toBe('<b>not bold</b>')
    })
})
