import { ResumeDataV1 as ResumeData } from '../models/ResumeData/ResumeDataV1'
import { ResumeStyle2ColumnsV1 as ResumeStyleClass } from '../models/ResumeStyle/ResumeStyle2ColumnsV1'

export class ResumeService {
    /**
     * Loads resume data from a JSON file
     * @param {File} file - The JSON file to load
     * @returns {Promise<{resumeData: ResumeData, resumeStyle: Object}>} The loaded resume data and style
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

                    const resumeData = ResumeData.fromJSON(data.resumeData)
                    const resumeStyle = ResumeStyleClass.fromJSON(data.resumeStyle)

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
     * @param {ResumeData} resumeData - The resume data to export
     * @param {Object|ResumeStyleClass} resumeStyle - The resume style to export
     * @returns {Blob} The JSON file as a Blob
     */
    static exportToJSON(resumeData, resumeStyle) {
        const data = {
            resumeData: resumeData.toJSON(),
            resumeStyle: resumeStyle.toJSON ? resumeStyle.toJSON() : resumeStyle
        }
        return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
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
} 