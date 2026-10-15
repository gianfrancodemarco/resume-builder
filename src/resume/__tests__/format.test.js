import { describe, expect, it } from 'vitest'
import { DATE_PATTERN, fluencyLevel, formatDate, formatLocation, formatRange } from '@/resume/format'

describe('formatDate', () => {
    it('formats ISO 8601 dates of any precision', () => {
        expect(formatDate('2020')).toBe('2020')
        expect(formatDate('2020-03')).toBe('Mar 2020')
        expect(formatDate('2020-12-31')).toBe('Dec 2020')
        expect(formatDate('')).toBe('')
    })

    it('returns other text as is', () => {
        expect(formatDate('Summer 2019')).toBe('Summer 2019')
    })
})

describe('formatRange', () => {
    it('uses Present for missing end dates', () => {
        expect(formatRange('2020-03', '')).toBe('Mar 2020 – Present')
        expect(formatRange('2016', '2018')).toBe('2016 – 2018')
        expect(formatRange('', '2018')).toBe('2018')
        expect(formatRange('', '')).toBe('')
    })
})

describe('DATE_PATTERN', () => {
    it('accepts real dates only', () => {
        for (const date of ['2020', '2020-01', '2020-12-31']) expect(DATE_PATTERN.test(date)).toBe(true)
        for (const date of ['2020-13', '2020-00', '2020-01-32', '20', 'March 2020']) expect(DATE_PATTERN.test(date)).toBe(false)
    })
})

describe('fluencyLevel', () => {
    it.each([
        ['Native speaker', 100],
        ['Bilingual', 100],
        ['Full professional proficiency', 90],
        ['Fluent', 90],
        ['C2', 90],
        ['C1', 80],
        ['Advanced', 80],
        ['Professional working proficiency', 65],
        ['Upper intermediate', 65],
        ['B2', 65],
        ['B1 - intermediate', 50],
        ['Limited working proficiency', 35],
        ['A2', 35],
        ['Beginner', 20],
        ['75%', 75],
    ])('%s -> %i', (fluency, level) => {
        expect(fluencyLevel(fluency)).toBe(level)
    })

    it('returns null when the fluency is not recognized', () => {
        expect(fluencyLevel('Can order coffee')).toBeNull()
        expect(fluencyLevel('')).toBeNull()
    })
})

describe('formatLocation', () => {
    it('joins the parts that are set', () => {
        expect(formatLocation({ city: 'New York', countryCode: 'US' })).toBe('New York, US')
        expect(formatLocation({ address: '1 Main St', postalCode: '10001', city: 'New York', region: 'NY' }))
            .toBe('1 Main St, 10001 New York, NY')
        expect(formatLocation()).toBe('')
    })
})
