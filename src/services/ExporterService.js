import { buildSections } from '@/typst/document'
import { TypstService } from '@/typst/TypstService'

export class ExporterService {
    /**
     * Export resume as plain text (.txt), following the resume layout
     * @param {object} resume
     */
    static async exportToTXT(resume) {
        const basics = resume.basics || {}
        const blocks = [[basics.name, basics.label].filter(Boolean).join('\n')]
        for (const section of buildSections(resume)) {
            blocks.push(`${section.title.toUpperCase()}\n${sectionText(section)}`)
        }
        const txt = blocks.filter(Boolean).join('\n\n')
        this.download(new Blob([txt], { type: 'text/plain' }), this.getFilename(resume, 'txt'))
    }

    /**
     * Gets a filename for the resume based on name and title
     * @param {object} resume
     * @param {string} extension - The file extension to use
     * @returns {string} The generated filename
     */
    static getFilename(resume, extension) {
        const name = resume.basics?.name?.trim()
        const position = resume.basics?.label?.trim()

        return (name && position)
            ? `${name}_${position}.${extension}`
            : (name || position || 'resume') + `.${extension}`
    }

    /**
     * Export resume as PDF, compiled by Typst: identical to the preview on every device
     * @param {object} resume
     */
    static async exportToPDF(resume) {
        const pdf = await TypstService.renderPdf(resume)
        this.download(new Blob([pdf], { type: 'application/pdf' }), this.getFilename(resume, 'pdf'))
    }

    static download(blob, filename) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }
}

// ---- Plain text -------------------------------------------------------------

function sectionText(section) {
    switch (section.kind) {
        case 'text':
            return nodesText(section.content)
        case 'contact':
            return section.items.map(i => i.text).join('\n')
        case 'links':
            return section.items.map(i => [i.label && `${i.label}:`, i.href || i.text].filter(Boolean).join(' ')).join('\n')
        case 'tags':
            return section.items.map(i => [i.name, i.keywords.join(', ')].filter(Boolean).join(': ')).join('\n')
        case 'languages':
            return section.items.map(i => [i.name, i.fluency].filter(Boolean).join(': ')).join('\n')
        default:
            return section.items.map(entryText).join('\n\n')
    }
}

function entryText(e) {
    return [
        [e.title, e.subtitle].filter(Boolean).join(' - '),
        [e.date, e.location].filter(Boolean).join(' | '),
        ...e.details,
        nodesText(e.summary),
        ...e.highlights.map(h => `- ${nodesText(h)}`),
        e.keywords.join(', '),
    ].filter(Boolean).join('\n')
}

// Markdown node tree (see typst/markdown.js) to plain text
function nodesText(nodes) {
    return nodes.map(node => {
        if (typeof node === 'string') return node
        if (node.t === 'br') return '\n'
        if (node.t === 'hr') return '\n'
        if (node.t === 'ul' || node.t === 'ol') {
            return node.items.map((item, i) => `${node.t === 'ol' ? `${i + 1}.` : '-'} ${nodesText(item)}`).join('\n') + '\n'
        }
        if (node.t === 'a') return `${nodesText(node.c)}${node.href ? ` (${node.href})` : ''}`
        const text = nodesText(node.c || [])
        return ['p', 'h', 'quote'].includes(node.t) ? `${text}\n` : text
    }).join('').trim()
}
