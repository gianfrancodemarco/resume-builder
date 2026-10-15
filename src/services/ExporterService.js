import { TypstService } from '@/typst/TypstService'

export class ExporterService {
    /**
     * Export resume as plain text (.txt)
     * @param {ResumeData} resumeData - The resume data
     * @returns {Promise<void>}
     */
    static async exportToTXT(resumeData) {
        let txt = '';
        // Personal Info
        if (resumeData.personal) {
            if (resumeData.personal.name) txt += `${resumeData.personal.name}\n`;
            if (resumeData.personal.title) txt += `${resumeData.personal.title}\n`;
            txt += '\n';
        }
        // Experiences
        if (Array.isArray(resumeData.experiences) && resumeData.experiences.length > 0) {
            txt += (resumeData.experiencesSectionName || 'Employment History') + '\n';
            resumeData.experiences.forEach(exp => {
                if (exp.title || exp.company) {
                    txt += `${exp.title || ''}`;
                    if (exp.company) txt += ` - ${exp.company}`;
                    txt += '\n';
                }
                if (exp.period) txt += `${exp.period}\n`;
                if (exp.description) txt += `\n${exp.description}\n`;
                txt += '\n';
            });
        }
        // Education
        if (Array.isArray(resumeData.education) && resumeData.education.length > 0) {
            txt += (resumeData.educationSectionName || 'Education') + '\n';
            resumeData.education.forEach(edu => {
                if (edu.degree || edu.school) {
                    txt += `${edu.degree || ''}`;
                    if (edu.school) txt += ` - ${edu.school}`;
                    txt += '\n';
                }
                if (edu.period) txt += `${edu.period}\n`;
                if (edu.mark) txt += `${edu.mark}\n`;
                if (edu.thesis) txt += `${edu.thesis}\n`;
                if (edu.description) txt += `${edu.description}\n`;
                txt += '\n';
            });
        }
        // Custom Sections (sidebar and main)
        if (Array.isArray(resumeData.customSections)) {
            resumeData.customSections.forEach(section => {
                if (section.title && section.content) {
                    txt += `${section.title}\n`;
                    txt += this.htmlToText(section.content) + '\n\n';
                }
            });
        }
        // Remove debug output
        let filename;
        try {
            filename = this.getFilename(resumeData, 'txt');
        } catch (e) {
            filename = 'resume.txt'; // fallback if personal info is missing
        }
        const blob = new Blob([txt.trim()], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    /**
     * Gets a filename for the resume based on personal info
     * @param {ResumeData} resumeData - The resume data containing personal info
     * @param {string} extension - The file extension to use
     * @returns {string} The generated filename
     */
    static getFilename(resumeData, extension) {
        const name = resumeData.personal.name?.trim()
        const position = resumeData.personal.title?.trim()

        return (name && position)
            ? `${name}_${position}.${extension}`
            : (name || position || 'resume') + `.${extension}`
    }

    /**
     * Export resume as PDF, compiled by Typst: identical to the preview on every device
     * @param {ResumeData} resumeData - The resume data
     * @param {Object} resumeStyle - The resume style
     * @returns {Promise<void>}
     */
    static async exportToPDF(resumeData, resumeStyle) {
        const pdf = await TypstService.renderPdf(resumeData, resumeStyle)
        this.download(new Blob([pdf], { type: 'application/pdf' }), this.getFilename(resumeData, 'pdf'))
    }

    /**
     * Export resume as a standalone HTML page showing the same pages as the PDF
     * @param {ResumeData} resumeData - The resume data
     * @param {Object} resumeStyle - The resume style
     * @returns {Promise<void>}
     */
    static async exportToHTML(resumeData, resumeStyle) {
        const { svg, size, pages } = await TypstService.renderSvg(resumeData, resumeStyle)
        const title = this.escapeHtml([resumeData.personal?.name, resumeData.personal?.title].filter(Boolean).join(' - ') || 'Resume')
        const { width, height } = size
        // Pages are stacked in one SVG; the page size makes print break between them
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
@page { size: ${width}pt ${pages[0].height}pt; margin: 0; }
html, body { margin: 0; padding: 0; background: #e5e7eb; }
.resume { width: ${width}pt; max-width: 100%; margin: 0 auto; background: white; }
.resume > svg { display: block; width: 100%; height: auto; }
@media print { html, body { background: none; } .resume { width: ${width}pt; } }
</style>
</head>
<body>
<div class="resume" style="aspect-ratio: ${width} / ${height}">${svg}</div>
</body>
</html>`
        this.download(new Blob([html], { type: 'text/html' }), this.getFilename(resumeData, 'html').replace(/\s+/g, '_'))
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

    static escapeHtml(text) {
        return text.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch])
    }

    static htmlToText(html) {
        // Simple HTML to text conversion
        if (!html) return '';
        let tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.innerText.replace(/\n{2,}/g, '\n').trim();
    }
}