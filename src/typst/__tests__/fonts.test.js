import { describe, expect, it } from 'vitest'
import { FALLBACK_SCRIPTS, fallbackFont, resolveFont } from '@/typst/fonts'

describe('resolveFont', () => {
    it('picks the first bundled family of a CSS font stack', () => {
        expect(resolveFont("'Comic Sans MS', lora, serif")).toBe('Lora')
        expect(resolveFont('Comic Sans MS')).toBe('Inter')
        expect(resolveFont('')).toBe('Inter')
    })
})

describe('fallbackFont', () => {
    it('matches the style of the family', () => {
        expect(fallbackFont('Gelasio')).toBe('Tinos')
        expect(fallbackFont('Lato')).toBe('Arimo')
        expect(fallbackFont('Cousine')).toBe('Cousine')
    })
})

describe('FALLBACK_SCRIPTS', () => {
    it('detects the scripts the fallback fonts add', () => {
        for (const text of ['Русский', 'Ελληνικά', 'עברית', 'Việt Nam']) expect(FALLBACK_SCRIPTS.test(text)).toBe(true)
        for (const text of ['Zoë Ångström-Müller', '„quotes“ — dashes €']) expect(FALLBACK_SCRIPTS.test(text)).toBe(false)
    })
})
