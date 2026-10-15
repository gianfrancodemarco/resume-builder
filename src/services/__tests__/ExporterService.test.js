import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ExporterService } from '@/services/ExporterService'
import { TypstService } from '@/typst/TypstService'
import { prepareResume, sampleResume, settingsOf, toggleItemHidden } from '@/resume/resume'

vi.mock('@/typst/TypstService', () => ({
    TypstService: {
        renderPdf: vi.fn(async () => new Uint8Array([37, 80, 68, 70])),
        renderSvg: vi.fn(async () => ({
            svg: '<svg class="typst-doc"></svg>',
            size: { width: 595, height: 1684 },
            pages: [{ width: 595, height: 842 }, { width: 595, height: 842 }]
        }))
    }
}))

const withBasics = basics => prepareResume({ basics })

describe('ExporterService', () => {
    let download

    beforeEach(() => {
        global.Blob = class { constructor(parts, opts) { this.parts = parts; this.type = opts?.type } }
        download = vi.spyOn(ExporterService, 'download').mockImplementation(() => { })
    })

    afterEach(() => {
        download.mockRestore()
    })

    describe('getFilename', () => {
        it('uses name and title', () => {
            expect(ExporterService.getFilename(withBasics({ name: 'John Doe', label: 'Engineer' }), 'pdf')).toBe('John Doe_Engineer.pdf')
        })

        it('uses whichever of name and title is set', () => {
            expect(ExporterService.getFilename(withBasics({ name: 'John Doe' }), 'pdf')).toBe('John Doe.pdf')
            expect(ExporterService.getFilename(withBasics({ label: 'Engineer' }), 'pdf')).toBe('Engineer.pdf')
        })

        it('falls back to "resume" and trims whitespace', () => {
            expect(ExporterService.getFilename(withBasics({}), 'pdf')).toBe('resume.pdf')
            expect(ExporterService.getFilename(withBasics({ name: '  John  ', label: ' ' }), 'txt')).toBe('John.txt')
        })
    })

    describe('exportToTXT', () => {
        const exportText = async resume => {
            await ExporterService.exportToTXT(resume)
            const [blob, filename] = download.mock.calls.at(-1)
            return { text: blob.parts[0], filename, type: blob.type }
        }

        it('exports every visible section in layout order as plain text', async () => {
            const { text, filename, type } = await exportText(sampleResume())

            expect(type).toBe('text/plain')
            expect(filename).toBe('John Doe_Software Engineer.txt')
            expect(text).toMatch(/^John Doe\nSoftware Engineer\n\nABOUT ME\nPassionate software engineer/)
            expect(text).toContain('using Vue.js and other') // Markdown removed
            expect(text).toContain('CONTACT\nNew York, US\njohn.doe@example.com\n+1 555 0100')
            expect(text).toContain('PROFILES\nGitHub: https://github.com/johndoe')
            expect(text).toContain('WORK EXPERIENCE\nSenior Software Engineer - Tech Solutions Inc.\nMar 2020 - Present | Milan')
            expect(text).toContain('- Improved application performance by 40%')
            expect(text).toContain('SKILLS\nFrontend: Vue.js, JavaScript, TypeScript, HTML/CSS')
            expect(text).toContain('LANGUAGES\nItalian: Native speaker')
            expect(text.indexOf('ABOUT ME')).toBeLessThan(text.indexOf('WORK EXPERIENCE'))
        })

        it('leaves out hidden sections and items', async () => {
            const resume = sampleResume()
            settingsOf(resume).sections.find(s => s.key === 'skills').visible = false
            toggleItemHidden(resume, 'work', 0)

            const { text } = await exportText(resume)

            expect(text).not.toContain('SKILLS')
            expect(text).not.toContain('Tech Solutions Inc.')
            expect(text).toContain('Digital Innovations')
        })

        it('handles an empty resume', async () => {
            const { text, filename } = await exportText(prepareResume({}))
            expect(text).toBe('')
            expect(filename).toBe('resume.txt')
        })
    })

    describe('exportToPDF and exportToHTML', () => {
        const resume = withBasics({ name: 'Jane <Doe>', label: 'Engineer' })

        it('downloads the PDF compiled by Typst', async () => {
            await ExporterService.exportToPDF(resume)

            expect(TypstService.renderPdf).toHaveBeenCalledWith(resume)
            const [blob, filename] = download.mock.calls[0]
            expect(blob.type).toBe('application/pdf')
            expect(filename).toBe('Jane <Doe>_Engineer.pdf')
        })

        it('downloads a standalone HTML page with the rendered pages', async () => {
            await ExporterService.exportToHTML(resume)

            const [blob, filename] = download.mock.calls[0]
            const html = blob.parts[0]
            expect(blob.type).toBe('text/html')
            expect(filename).toBe('Jane_<Doe>_Engineer.html')
            expect(html).toContain('<svg class="typst-doc"></svg>')
            expect(html).toContain('<title>Jane &lt;Doe&gt; - Engineer</title>')
            expect(html).toContain('@page { size: 595pt 842pt; margin: 0; }')
            expect(html).toContain('aspect-ratio: 595 / 1684')
        })
    })
})
