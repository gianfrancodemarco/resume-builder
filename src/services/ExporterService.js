import { ResumeService } from './ResumeService'

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
        const filename = this.getFilename(resumeData, 'txt');
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

    static async exportToPDF(resumeData, resumeStyle) {
        const srcEl = document.querySelector('.preview-container #printable-area').cloneNode(true)
        if (!srcEl) return

        // Remove any scaling and centering styles
        srcEl.style.transform = 'none'
        srcEl.style.transformOrigin = 'initial'
        srcEl.style.margin = '0'

        const filename = this.getFilename(resumeData, 'pdf')
        var printWindow = window.open('', filename)
        printWindow.document.title = filename
        printWindow.document.head.append(document.head.cloneNode(true))
        const style = printWindow.document.createElement('style')
        style.textContent = `
            @page {
                margin: 0;
            }

            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            /* We inject the background color variable into the html tag so that we can use them in the html tag */
            html {
                --background-color: ${resumeStyle.colors.background};
            }

            html {
                background-color: var(--background-color) !important;
            }

            /* Custom CSS from user */
            ${resumeStyle.customCSS || ''}
        `
        printWindow.document.head.appendChild(style)
        printWindow.document.body.innerHTML = srcEl.outerHTML
        printWindow.document.fonts.ready.then(() => {
            setTimeout(() => {
                printWindow.print()
                //printWindow.close() // On Android it seems to cause an error to close the window
            }, 0) // Safari needs time to render layout
        })
    }

    static async exportToHTML(resumeData, resumeStyle) {
        const srcEl = document.getElementById('printable-area')
        if (!srcEl) return

        const filename = this.getFilename(resumeData, 'html')
        const printWindow = window.open('', filename)
        if (!printWindow) {
            alert('Popup blocked. Please allow popups for this site.')
            return
        }

        printWindow.document.title = filename

        // Step 1: Collect local (non-CORS) styles from <style> and <link>
        const localCSS = Array.from(document.styleSheets).map(sheet => {
            try {
                return Array.from(sheet.cssRules || []).map(rule => rule.cssText).join('\n')
            } catch (e) {
                return '' // Ignore cross-origin styles
            }
        }).join('\n')

        // Step 2: Attempt to fetch CORS-allowed external stylesheets
        const fetchExternalStyles = async () => {
            const externalLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
            const fetched = await Promise.all(externalLinks.map(async link => {
                try {
                    const res = await fetch(link.href)
                    if (!res.ok) throw new Error('fetch failed')
                    return await res.text()
                } catch {
                    console.warn(`Could not fetch: ${link.href}`)
                    return ''
                }
            }))
            return fetched.join('\n')
        }

        const externalCSS = await fetchExternalStyles()

        // Step 3: Append combined CSS
        const styleTag = document.createElement('style')
        styleTag.textContent = `
        @page {
          margin: 0;
        }

        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: white !important;
          box-sizing: border-box;
        }

        ${localCSS}
        ${externalCSS}

        /* Custom CSS from user */
        ${resumeStyle.customCSS || ''}
      `
        printWindow.document.head.appendChild(styleTag)

        // Step 4: Clone content
        const clone = srcEl.cloneNode(true)
        printWindow.document.body.appendChild(clone)

        // Step 5: Wait for fonts to load, then generate downloadable HTML
        await printWindow.document.fonts.ready
        setTimeout(() => {
            const blob = new Blob([printWindow.document.documentElement.outerHTML], { type: 'text/html' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = filename.replace(/\s+/g, '_')
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            printWindow.close()
        }, 0)
    }

    static htmlToText(html) {
        // Simple HTML to text conversion
        if (!html) return '';
        let tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.innerText.replace(/\n{2,}/g, '\n').trim();
    }
}