// JSON Resume content as a strict JSON schema for LLM structured outputs.
// Strict mode needs every property required and no extra properties, so
// optional values are requested as empty strings/arrays and removed with
// compact() (see values.js) afterwards.
import { SECTIONS } from './sections'

const DATE = 'ISO 8601 date: YYYY, YYYY-MM or YYYY-MM-DD. Empty string if unknown; for end dates, empty if current.'
const MARKDOWN = 'Markdown allowed (bold, italic, links, lists). Empty string if unknown.'

function fieldSchema(field) {
    if (field.type === 'list') {
        return { type: 'array', items: { type: 'string', ...(field.markdown && { description: 'Markdown allowed' }) } }
    }
    const description = {
        date: DATE,
        markdown: MARKDOWN,
        url: 'Full URL including https://. Empty string if unknown.',
        email: 'Email address. Empty string if unknown.',
    }[field.type] || 'Empty string if unknown.'
    return { type: 'string', description: `${field.label}. ${description}` }
}

function objectSchema(properties) {
    return { type: 'object', properties, required: Object.keys(properties), additionalProperties: false }
}

function itemsSchema(key) {
    const fields = SECTIONS[key].fields
    return { type: 'array', items: objectSchema(Object.fromEntries(fields.map(f => [f.key, fieldSchema(f)]))) }
}

const text = description => ({ type: 'string', description })

export function resumeContentSchema() {
    const listSections = Object.keys(SECTIONS).filter(key => SECTIONS[key].path?.length === 1)
    return objectSchema({
        basics: objectSchema({
            name: text('Full name'),
            label: text('Professional title, e.g. "Software Engineer"'),
            email: text('Email address. Empty string if unknown.'),
            phone: text('Phone number. Empty string if unknown.'),
            url: text('Personal website, full URL including https://. Empty string if unknown.'),
            summary: text(`Short professional summary. ${MARKDOWN}`),
            location: objectSchema({
                address: text('Street address. Empty string if unknown.'),
                postalCode: text('Postal code. Empty string if unknown.'),
                city: text('City. Empty string if unknown.'),
                countryCode: text('ISO-3166-1 ALPHA-2 country code, e.g. US. Empty string if unknown.'),
                region: text('State or region. Empty string if unknown.'),
            }),
            profiles: itemsSchema('profiles'),
        }),
        ...Object.fromEntries(listSections.map(key => [key, itemsSchema(key)])),
    })
}
