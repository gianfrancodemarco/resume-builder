import { describe, expect, it } from 'vitest'
import { ACCENTS, DEFAULT_DESIGN, FONT_PAIRINGS, LAYOUTS, hasSidebar, normalizeDesign } from '@/resume/design'
import { FONT_FAMILIES } from '@/typst/fonts'

describe('normalizeDesign', () => {
    it('fills missing values with defaults', () => {
        expect(normalizeDesign()).toEqual(DEFAULT_DESIGN)
        expect(normalizeDesign({ layout: 'classic' })).toEqual({ ...DEFAULT_DESIGN, layout: 'classic' })
    })

    it('replaces invalid values and drops unknown keys', () => {
        expect(normalizeDesign({ layout: 'grid', accent: '#abc', fonts: 'comic', size: 'xl', density: 'tight', sidebarLeft: 1, colors: {} }))
            .toEqual(DEFAULT_DESIGN)
    })

    it('accepts any 6-digit hex accent', () => {
        expect(normalizeDesign({ accent: '#F2C94C' }).accent).toBe('#F2C94C')
    })
})

describe('design options', () => {
    it('only uses bundled fonts', () => {
        const bundled = new Set(FONT_FAMILIES.map(f => f.name))
        for (const pairing of Object.values(FONT_PAIRINGS)) {
            expect(bundled.has(pairing.heading) && bundled.has(pairing.body)).toBe(true)
        }
    })

    it('offers valid accent colors', () => {
        for (const accent of ACCENTS) expect(normalizeDesign({ accent: accent.value }).accent).toBe(accent.value)
    })

    it('knows which layouts have a sidebar', () => {
        expect(Object.keys(LAYOUTS).filter(hasSidebar)).toEqual(['sidebar'])
    })
})
