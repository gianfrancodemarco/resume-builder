import { describe, expect, it } from 'vitest'
import { contrast, deriveColors } from '@/typst/colors'
import { ACCENTS } from '@/resume/design'

describe('deriveColors', () => {
    it('keeps a dark accent as is, with white sidebar text', () => {
        const colors = deriveColors('#08294D')
        expect(colors.primary).toBe('#08294d')
        expect(colors.sidebarBackground).toBe('#08294D')
        expect(colors.sidebarText).toBe('#FFFFFF')
    })

    it('darkens a light accent for text and uses dark sidebar text', () => {
        const colors = deriveColors('#F2C94C')
        expect(contrast(colors.primary, '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
        expect(colors.sidebarBackground).toBe('#F2C94C')
        expect(colors.sidebarText).toBe('#1F2328')
    })

    it('keeps every preset readable', () => {
        for (const { value } of ACCENTS) {
            const colors = deriveColors(value)
            expect(contrast(colors.primary, colors.background)).toBeGreaterThanOrEqual(4.5)
            expect(contrast(colors.sidebarText, colors.sidebarBackground)).toBeGreaterThanOrEqual(4.5)
        }
    })
})
