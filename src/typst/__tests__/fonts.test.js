import { describe, expect, it } from 'vitest'
import { FALLBACK_SCRIPTS, fallbackFonts } from '@/typst/fonts'

describe('fallbackFonts', () => {
    it('matches the style of the family and never repeats it', () => {
        expect(fallbackFonts('Gelasio')).toEqual(['Source Serif 4', 'Arimo'])
        expect(fallbackFonts('Source Serif 4')).toEqual(['Arimo'])
        expect(fallbackFonts('Inter')).toEqual(['Arimo'])
        expect(fallbackFonts('Arimo')).toEqual([])
    })
})

describe('FALLBACK_SCRIPTS', () => {
    it('detects the scripts the fallback fonts add', () => {
        for (const text of ['Русский', 'Ελληνικά', 'עברית', 'Việt Nam']) expect(FALLBACK_SCRIPTS.test(text)).toBe(true)
        for (const text of ['Zoë Ångström-Müller', '„quotes“ — dashes €']) expect(FALLBACK_SCRIPTS.test(text)).toBe(false)
    })
})
