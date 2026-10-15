import { prepareResume, resumeContent, sampleResume, validateResume } from '@/resume/resume'
import { compact } from '@/resume/values'

const STORAGE_KEY = 'resume'

export class ResumeService {
    /** The resume saved in this browser, or the sample resume. */
    static loadStored() {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
            if (stored && validateResume(stored).length === 0) return prepareResume(stored)
        } catch {
            // Unreadable storage: start from the sample
        }
        return sampleResume()
    }

    static store(resume) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resume))
    }

    /**
     * Loads a JSON Resume file. Files from other JSON Resume tools work too.
     * @param {File} file
     * @returns {Promise<object>} The prepared resume
     * @throws {Error} If the file is not valid JSON or not a valid JSON Resume
     */
    static async loadFromFile(file) {
        let json
        try {
            json = JSON.parse(await file.text())
        } catch {
            throw new Error('The file is not valid JSON.')
        }
        const errors = validateResume(json)
        if (errors.length) {
            throw new Error(`Not a valid JSON Resume: ${errors.slice(0, 3).join('; ')}`)
        }
        return prepareResume(json)
    }

    /**
     * The resume as a JSON Resume file. Empty values left by the editor are
     * removed so the file validates against the schema.
     * @returns {Blob}
     */
    static exportToJSON(resume) {
        const image = resume.basics?.image
        const content = compact(resumeContent(resume))
        const json = {
            $schema: resume.$schema,
            ...content,
            basics: { ...content.basics, ...(image && { image }) },
            meta: { ...resume.meta, lastModified: new Date().toISOString() },
        }
        return new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
    }
}
