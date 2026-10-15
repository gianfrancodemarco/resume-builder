// Cleanup of values entered in forms or returned by AI models.

/**
 * Deep copy of JSON data. Unlike structuredClone it also accepts Vue
 * reactive proxies, which is what the editor holds.
 */
export const cloneJson = value => JSON.parse(JSON.stringify(value))

/** Removes empty strings, empty arrays and empty objects, recursively. */
export function compact(value) {
    if (Array.isArray(value)) {
        return value.map(compact).filter(v => v !== undefined && !(isObject(v) && Object.keys(v).length === 0))
    }
    if (value && typeof value === 'object') {
        const entries = Object.entries(value)
            .map(([k, v]) => [k, compact(v)])
            .filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0) && !(isObject(v) && Object.keys(v).length === 0))
        return Object.fromEntries(entries)
    }
    if (typeof value === 'string') return value.trim() === '' ? undefined : value
    return value
}

const isObject = v => v && typeof v === 'object' && !Array.isArray(v)

/** Adds https:// to URLs typed without a scheme, as the schema requires full URIs. */
export function normalizeUrl(url) {
    const value = url?.trim()
    if (!value || /^[a-z][a-z\d+.-]*:/i.test(value)) return value
    return `https://${value}`
}
