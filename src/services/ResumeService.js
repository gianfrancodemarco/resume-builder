import { ResumeDataV2 as ResumeDataClass } from '@/models/ResumeData/ResumeDataV2'
import { TwoColumnsBlue as ResumeStyleClass } from '@/models/ResumeStyle/defaultTemplates/TwoColumnsBlue'

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
                    const resumeStyle = data.resumeStyle

                    // Ensure customCSS field exists for backward compatibility
                    if (resumeStyle && resumeStyle.customCSS === undefined) {
                        resumeStyle.customCSS = ''
                    }

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