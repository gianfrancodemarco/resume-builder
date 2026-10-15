// Formatting of JSON Resume values for display.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// YYYY, YYYY-MM or YYYY-MM-DD. Stricter than the JSON Resume schema pattern,
// which also accepts months like 13 and days like 39.
export const DATE_PATTERN = /^[1-2]\d{3}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/

/** "2020-03-15" or "2020-03" -> "Mar 2020", "2020" -> "2020". Unparseable values are returned as is. */
export function formatDate(date) {
    if (!date) return ''
    const match = String(date).match(/^(\d{4})(?:-(\d{2}))?/)
    if (!match) return String(date)
    const month = Number(match[2])
    return month >= 1 && month <= 12 ? `${MONTHS[month - 1]} ${match[1]}` : match[1]
}

/** "Mar 2020 – Present", "2016 – 2018", or a single date. */
export function formatRange(start, end) {
    if (!start) return formatDate(end)
    return `${formatDate(start)} – ${end ? formatDate(end) : 'Present'}`
}

// Proficiency used to draw language bars: CEFR levels, LinkedIn wording and
// common terms. Order matters: more specific phrases come first.
const FLUENCY_LEVELS = [
    [/native|mother|bilingual/i, 100],
    [/full professional|\bc2\b|fluent/i, 90],
    [/professional working|\bb2\b|upper[\s-]?intermediate/i, 65],
    [/\bc1\b|advanced|proficient/i, 80],
    [/\bb1\b|intermediate|conversational/i, 50],
    [/limited working|\ba2\b|elementary/i, 35],
    [/\ba1\b|beginner|basic/i, 20],
]

/** @returns {number|null} 0-100, or null when the fluency text is not recognized */
export function fluencyLevel(fluency) {
    if (!fluency) return null
    const percent = String(fluency).match(/(\d{1,3})\s*%/)
    if (percent) return Math.min(100, Number(percent[1]))
    return FLUENCY_LEVELS.find(([pattern]) => pattern.test(fluency))?.[1] ?? null
}

/** "New York, US" from a JSON Resume location. */
export function formatLocation(location = {}) {
    return [location.address, [location.postalCode, location.city].filter(Boolean).join(' '), location.region, location.countryCode]
        .filter(Boolean)
        .join(', ')
}
