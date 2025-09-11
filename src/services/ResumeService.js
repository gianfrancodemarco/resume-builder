import { ResumeDataV2 } from '@/models/ResumeData/ResumeDataV2'
import { TwoColumnsBlue as ResumeStyleClass } from '@/models/ResumeStyle/defaultTemplates/TwoColumnsBlue'
import { JSONResume as ResumeDataClass } from '@/models/ResumeData/JSONResume'

// Export the model classes
// These always point to the latest version of the models
// Other part of the app should only import from here
export { ResumeDataClass, ResumeStyleClass }

function migrateToJSONResume(data) {
    const jsonResume = new ResumeDataClass();

    // Personal to Basics
    if (data.personal) {
        jsonResume.basics.name = data.personal.name || '';
        jsonResume.basics.label = data.personal.title || '';
    }

    // Experiences to Work
    if (data.experiences) {
        jsonResume.work = data.experiences.map(exp => {
            const [startDate, endDate] = (exp.period || '').split(' - ');
            return {
                name: exp.company || '',
                position: exp.title || '',
                startDate: startDate || '',
                endDate: endDate || '',
                summary: exp.description || '',
                highlights: [] // V2 description is HTML, highlights need manual extraction
            };
        });
    }

    // Education
    if (data.education) {
        jsonResume.education = data.education.map(edu => {
            const [startDate, endDate] = (edu.period || '').split(' - ');
            // Simple split for degree, might need refinement
            const [studyType, ...areaParts] = (edu.degree || '').split(' in ');
            const area = areaParts.join(' in ');

            return {
                institution: edu.school || '',
                area: area || '',
                studyType: studyType || '',
                startDate: startDate || '',
                endDate: endDate || '',
                score: edu.mark || '',
                courses: edu.thesis ? [edu.thesis] : []
            };
        });
    }

    // Custom Sections to various JSONResume sections
    if (data.customSections) {
        data.customSections.forEach(section => {
            const title = section.title.toLowerCase();
            if (title.includes('about me') || title.includes('summary')) {
                jsonResume.basics.summary = section.content;
            } else if (title.includes('skills')) {
                // Assuming content is comma or newline separated
                jsonResume.skills.push({
                    name: section.title,
                    keywords: section.content.replace(/<br\/>/g, ',').split(',').map(s => s.trim())
                });
            } else if (title.includes('languages')) {
                // Crude parsing for "(Language)[BAR:100]"
                const langMatches = section.content.matchAll(/\(([^)]+)\)\[BAR:\d+\]/g);
                for (const match of langMatches) {
                    jsonResume.languages.push({
                        language: match[1],
                        fluency: 'Native speaker' // Placeholder
                    });
                }
            } else if (title.includes('links')) {
                const linkMatches = section.content.matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g);
                for (const match of linkMatches) {
                    jsonResume.basics.profiles.push({
                        network: match[2],
                        url: match[1],
                        username: '' // Not available in V2
                    });
                }
            } else {
                // Default to a project
                jsonResume.projects.push({
                    name: section.title,
                    description: section.content,
                    highlights: [],
                    url: ''
                });
            }
        });
    }

    return jsonResume;
}

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

                    let resumeData;
                    if (data.resumeData.version === ResumeDataV2.VERSION) {
                        const resumeDataV2 = ResumeDataV2.fromJSON(data.resumeData);
                        resumeData = migrateToJSONResume(resumeDataV2);
                    } else {
                        resumeData = ResumeDataClass.fromJSON(data.resumeData)
                    }

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