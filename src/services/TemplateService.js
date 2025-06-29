// Template service to dynamically load all available templates
import { TwoColumnsBlue } from '@/models/ResumeStyle/defaultTemplates/TwoColumnsBlue'
import { OneColumnModern } from '@/models/ResumeStyle/defaultTemplates/OneColumnModern'
import { TwoColumnsGreen } from '@/models/ResumeStyle/defaultTemplates/TwoColumnsGreen'

// Map of all available templates
const TEMPLATES = {
    'TwoColumnsBlue': TwoColumnsBlue,
    'TwoColumnsGreen': TwoColumnsGreen,
    'OneColumnModern': OneColumnModern
}

export class TemplateService {
    /**
     * Get all available templates
     * @returns {Array} Array of template objects with name and class
     */
    static getAllTemplates() {
        return Object.entries(TEMPLATES).map(([key, TemplateClass]) => ({
            key,
            name: TemplateClass.TEMPLATE_NAME || key,
            class: TemplateClass
        }))
    }

    /**
     * Get a specific template by key
     * @param {string} templateKey - The template key
     * @returns {Object|null} Template object or null if not found
     */
    static getTemplate(templateKey) {
        const TemplateClass = TEMPLATES[templateKey]
        if (!TemplateClass) {
            return null
        }

        return {
            key: templateKey,
            name: TemplateClass.TEMPLATE_NAME || templateKey,
            class: TemplateClass
        }
    }

    /**
     * Create a new instance of a template
     * @param {string} templateKey - The template key
     * @returns {Object|null} Template instance or null if not found
     */
    static createTemplateInstance(templateKey) {
        const TemplateClass = TEMPLATES[templateKey]
        if (!TemplateClass) {
            return null
        }

        return new TemplateClass()
    }
} 