import { describe, expect, it } from 'vitest'
import { Validator } from 'jsonschema'
import { resumeContentSchema } from '@/resume/llmSchema'
import { cloneJson, compact, normalizeUrl } from '@/resume/values'
import { reactive } from 'vue'

describe('compact', () => {
    it('removes empty strings, arrays and objects recursively', () => {
        expect(compact({
            basics: { name: 'Jane', email: '', location: { city: ' ' }, profiles: [] },
            work: [{ name: 'Acme', highlights: ['a', ''] }, { name: '' }],
            skills: [],
        })).toEqual({ basics: { name: 'Jane' }, work: [{ name: 'Acme', highlights: ['a'] }] })
    })

    it('keeps numbers and booleans', () => {
        expect(compact({ a: 0, b: false })).toEqual({ a: 0, b: false })
    })
})

describe('normalizeUrl', () => {
    it('adds https:// when the scheme is missing', () => {
        expect(normalizeUrl('example.com/me')).toBe('https://example.com/me')
        expect(normalizeUrl('http://example.com')).toBe('http://example.com')
        expect(normalizeUrl('mailto:me@example.com')).toBe('mailto:me@example.com')
        expect(normalizeUrl('')).toBe('')
    })
})

describe('cloneJson', () => {
    it('copies Vue reactive objects deeply', () => {
        const original = reactive({ work: [{ name: 'Acme' }] })
        const copy = cloneJson(original)
        copy.work[0].name = 'Changed'
        expect(original.work[0].name).toBe('Acme')
    })
})

describe('resumeContentSchema', () => {
    const schema = resumeContentSchema()

    it('is strict: every object lists all its properties as required and allows no others', () => {
        const check = node => {
            if (node.type === 'object') {
                expect(node.required).toEqual(Object.keys(node.properties))
                expect(node.additionalProperties).toBe(false)
                Object.values(node.properties).forEach(check)
            }
            if (node.type === 'array') check(node.items)
        }
        check(schema)
    })

    it('accepts a strict AI answer, which becomes a valid JSON Resume once compacted', () => {
        const answer = {
            basics: {
                name: 'Jane', label: '', email: '', phone: '', url: '', summary: '',
                location: { address: '', postalCode: '', city: 'Rome', countryCode: 'IT', region: '' },
                profiles: [],
            },
            ...Object.fromEntries(Object.keys(schema.properties).filter(k => k !== 'basics').map(k => [k, []])),
        }
        expect(new Validator().validate(answer, schema).errors).toEqual([])
        expect(compact(answer)).toEqual({ basics: { name: 'Jane', location: { city: 'Rome', countryCode: 'IT' } } })
    })
})
