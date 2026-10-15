import { ResumeDataV2 as ResumeDataClass } from '@/models/ResumeData/ResumeDataV2'
import { TwoColumnsBlue as ResumeStyleClass } from '@/models/ResumeStyle/defaultTemplates/TwoColumnsBlue'
import { resolveFont } from '@/typst/fonts'

// Export the model classes
// These always point to the latest version of the models
// Other part of the app should only import from here
export { ResumeDataClass, ResumeStyleClass }

export class ResumeService {
    // Current versions of the models
    static CURRENT_RESUME_DATA_VERSION = ResumeDataClass.VERSION
    static CURRENT_RESUME_STYLE_VERSION = ResumeStyleClass.VERSION

    /**
     * Loads resume data from a JSON file
     * @param {File} file - The JSON file to load
     * @returns {Promise<{resumeData: ResumeDataClass, resumeStyle: Object}>} The loaded resume data and style
     * @throws {Error} If the file is invalid or cannot be loaded
     */
    static async loadFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result)
                    if (!data.resumeData || !data.resumeStyle) {
                        throw new Error('Invalid resume data format')
                    }

                    const resumeData = ResumeDataClass.fromJSON(data.resumeData)
                    const resumeStyle = ResumeService.normalizeStyle(data.resumeStyle)

                    resolve({ resumeData, resumeStyle })
                } catch (error) {
                    reject(new Error(`Error loading file: ${error.message}`))
                }
            }

            reader.onerror = () => {
                reject(new Error('Error reading file'))
            }

            reader.readAsText(file)
        })
    }

    /**
     * Upgrades a stored style to what the renderer supports: fonts that are no
     * longer offered (old system fonts) are mapped to the closest bundled font.
     * @param {Object} resumeStyle
     * @returns {Object} The same style object, updated in place
     */
    static normalizeStyle(resumeStyle) {
        if (!resumeStyle) return resumeStyle
        if (resumeStyle.customCSS === undefined) {
            resumeStyle.customCSS = ''
        }
        if (resumeStyle.typography) {
            resumeStyle.typography.headingFont = resolveFont(resumeStyle.typography.headingFont)
            resumeStyle.typography.bodyFont = resolveFont(resumeStyle.typography.bodyFont)
        }
        return resumeStyle
    }

    /**
     * Exports resume data to a JSON file
     * @param {ResumeDataClass} resumeData - The resume data to export
     * @param {Object} resumeStyle - The resume style to export
     * @returns {Blob} The JSON file as a Blob
     */
    static exportToJSON(resumeData, resumeStyle) {
        const data = {
            resumeData: resumeData.toJSON(),
            resumeStyle: resumeStyle
        }
        return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    }
} 