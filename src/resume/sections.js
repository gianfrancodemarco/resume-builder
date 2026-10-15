// The resume sections the app knows, all from the JSON Resume schema
// (https://jsonresume.org/schema). Each definition drives the editor form,
// the AI output schema and the renderer.
//
// `label` names the section, `item` one of its entries (for "Add …" buttons).
//
// Field types:
//   text      single-line string
//   url       string with format uri
//   email     string with format email
//   date      ISO 8601 date: YYYY, YYYY-MM or YYYY-MM-DD
//   markdown  multi-line string, Markdown allowed
//   list      array of strings (Markdown allowed when `markdown` is set)

export const SECTIONS = {
    summary: {
        label: 'Summary',
        icon: 'ph-user',
        defaultTitle: 'About Me',
        source: 'basics',
    },
    contact: {
        label: 'Contact',
        icon: 'ph-phone',
        defaultTitle: 'Contact',
        source: 'basics',
    },
    profiles: {
        label: 'Profiles',
        item: 'Profile',
        icon: 'ph-link',
        defaultTitle: 'Profiles',
        path: ['basics', 'profiles'],
        itemTitle: p => p.network || p.username || p.url,
        fields: [
            { key: 'network', label: 'Network', type: 'text', placeholder: 'GitHub' },
            { key: 'username', label: 'Username', type: 'text' },
            { key: 'url', label: 'URL', type: 'url' },
        ],
    },
    work: {
        label: 'Work',
        item: 'Job',
        icon: 'ph-briefcase',
        defaultTitle: 'Work Experience',
        path: ['work'],
        itemTitle: w => [w.position, w.name].filter(Boolean).join(' - '),
        fields: [
            { key: 'position', label: 'Position', type: 'text' },
            { key: 'name', label: 'Company', type: 'text' },
            { key: 'location', label: 'Location', type: 'text' },
            { key: 'url', label: 'Website', type: 'url' },
            { key: 'startDate', label: 'Start date', type: 'date' },
            { key: 'endDate', label: 'End date', type: 'date', hint: 'Leave empty if current' },
            { key: 'description', label: 'Company description', type: 'text' },
            { key: 'summary', label: 'Summary', type: 'markdown' },
            { key: 'highlights', label: 'Highlights', type: 'list', markdown: true },
        ],
    },
    volunteer: {
        label: 'Volunteering',
        item: 'Volunteering role',
        icon: 'ph-heart',
        defaultTitle: 'Volunteering',
        path: ['volunteer'],
        itemTitle: v => [v.position, v.organization].filter(Boolean).join(' - '),
        fields: [
            { key: 'position', label: 'Position', type: 'text' },
            { key: 'organization', label: 'Organization', type: 'text' },
            { key: 'url', label: 'Website', type: 'url' },
            { key: 'startDate', label: 'Start date', type: 'date' },
            { key: 'endDate', label: 'End date', type: 'date', hint: 'Leave empty if current' },
            { key: 'summary', label: 'Summary', type: 'markdown' },
            { key: 'highlights', label: 'Highlights', type: 'list', markdown: true },
        ],
    },
    education: {
        label: 'Education',
        item: 'Education',
        icon: 'ph-graduation-cap',
        defaultTitle: 'Education',
        path: ['education'],
        itemTitle: e => [degree(e), e.institution].filter(Boolean).join(' - '),
        fields: [
            { key: 'institution', label: 'Institution', type: 'text' },
            { key: 'studyType', label: 'Degree', type: 'text', placeholder: 'Bachelor' },
            { key: 'area', label: 'Field of study', type: 'text', placeholder: 'Computer Science' },
            { key: 'url', label: 'Website', type: 'url' },
            { key: 'startDate', label: 'Start date', type: 'date' },
            { key: 'endDate', label: 'End date', type: 'date', hint: 'Leave empty if current' },
            { key: 'score', label: 'Grade', type: 'text' },
            { key: 'courses', label: 'Courses / notes', type: 'list', markdown: true },
        ],
    },
    awards: {
        label: 'Awards',
        item: 'Award',
        icon: 'ph-trophy',
        defaultTitle: 'Awards',
        path: ['awards'],
        itemTitle: a => a.title,
        fields: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'awarder', label: 'Awarded by', type: 'text' },
            { key: 'date', label: 'Date', type: 'date' },
            { key: 'summary', label: 'Summary', type: 'markdown' },
        ],
    },
    certificates: {
        label: 'Certificates',
        item: 'Certificate',
        icon: 'ph-certificate',
        defaultTitle: 'Certificates',
        path: ['certificates'],
        itemTitle: c => c.name,
        fields: [
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'issuer', label: 'Issuer', type: 'text' },
            { key: 'date', label: 'Date', type: 'date' },
            { key: 'url', label: 'URL', type: 'url' },
        ],
    },
    publications: {
        label: 'Publications',
        item: 'Publication',
        icon: 'ph-book-open',
        defaultTitle: 'Publications',
        path: ['publications'],
        itemTitle: p => p.name,
        fields: [
            { key: 'name', label: 'Title', type: 'text' },
            { key: 'publisher', label: 'Publisher', type: 'text' },
            { key: 'releaseDate', label: 'Release date', type: 'date' },
            { key: 'url', label: 'URL', type: 'url' },
            { key: 'summary', label: 'Summary', type: 'markdown' },
        ],
    },
    projects: {
        label: 'Projects',
        item: 'Project',
        icon: 'ph-folder',
        defaultTitle: 'Projects',
        path: ['projects'],
        itemTitle: p => p.name,
        fields: [
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'entity', label: 'Organization', type: 'text' },
            { key: 'type', label: 'Type', type: 'text', placeholder: 'application' },
            { key: 'url', label: 'URL', type: 'url' },
            { key: 'startDate', label: 'Start date', type: 'date' },
            { key: 'endDate', label: 'End date', type: 'date', hint: 'Leave empty if current' },
            { key: 'roles', label: 'Roles', type: 'list' },
            { key: 'description', label: 'Description', type: 'markdown' },
            { key: 'highlights', label: 'Highlights', type: 'list', markdown: true },
            { key: 'keywords', label: 'Keywords', type: 'list' },
        ],
    },
    skills: {
        label: 'Skills',
        item: 'Skill group',
        icon: 'ph-lightning',
        defaultTitle: 'Skills',
        path: ['skills'],
        itemTitle: s => s.name,
        fields: [
            { key: 'name', label: 'Name', type: 'text', placeholder: 'Web Development' },
            { key: 'level', label: 'Level', type: 'text', placeholder: 'Master' },
            { key: 'keywords', label: 'Keywords', type: 'list' },
        ],
    },
    languages: {
        label: 'Languages',
        item: 'Language',
        icon: 'ph-translate',
        defaultTitle: 'Languages',
        path: ['languages'],
        itemTitle: l => l.language,
        fields: [
            { key: 'language', label: 'Language', type: 'text' },
            { key: 'fluency', label: 'Fluency', type: 'text', placeholder: 'Native speaker, Fluent, C1…' },
        ],
    },
    interests: {
        label: 'Interests',
        item: 'Interest',
        icon: 'ph-star',
        defaultTitle: 'Interests',
        path: ['interests'],
        itemTitle: i => i.name,
        fields: [
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'keywords', label: 'Keywords', type: 'list' },
        ],
    },
    references: {
        label: 'References',
        item: 'Reference',
        icon: 'ph-users',
        defaultTitle: 'References',
        path: ['references'],
        itemTitle: r => r.name,
        fields: [
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'reference', label: 'Reference', type: 'markdown' },
        ],
    },
}

export const SECTION_KEYS = Object.keys(SECTIONS)

/** Sections whose content is a list of items (everything but summary and contact). */
export const isListSection = key => Boolean(SECTIONS[key]?.path)

// "Master in Computer Science"
export function degree(education) {
    return [education.studyType, education.area].filter(Boolean).join(' in ')
}

/** The items of a list section, without modifying the resume. */
export function itemsOf(resume, key) {
    const items = SECTIONS[key].path.reduce((node, part) => node?.[part], resume)
    return Array.isArray(items) ? items : []
}

/** The item array of a list section, created if missing (for editing). */
export function sectionItems(resume, key) {
    const path = SECTIONS[key].path
    let node = resume
    for (const part of path.slice(0, -1)) node = node[part] ??= {}
    return node[path.at(-1)] ??= []
}

/** Replaces the items of a list section (e.g. after drag and drop). */
export function setSectionItems(resume, key, items) {
    const path = SECTIONS[key].path
    let node = resume
    for (const part of path.slice(0, -1)) node = node[part] ??= {}
    node[path.at(-1)] = items
}

/** Whether an item has no value in any field (e.g. added and left blank). */
export function isEmptyItem(item) {
    return Object.values(item || {}).every(v => (Array.isArray(v) ? v.every(x => !String(x).trim()) : !String(v ?? '').trim()))
}

/** An empty item with every field of the section. */
export function newItem(key) {
    return Object.fromEntries(SECTIONS[key].fields.map(f => [f.key, f.type === 'list' ? [] : '']))
}

/** Whether a section has content to show. */
export function hasContent(resume, key) {
    if (key === 'summary') return Boolean(resume.basics?.summary?.trim())
    if (key === 'contact') {
        const b = resume.basics || {}
        return Boolean(b.email || b.phone || b.url || Object.values(b.location || {}).some(Boolean))
    }
    return itemsOf(resume, key).length > 0
}
