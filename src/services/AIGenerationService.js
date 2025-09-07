import { ResumeDataV2 } from '@/models/ResumeData/ResumeDataV2';

class AIGenerationService {
    /**
     * Calls an LLM to get an updated resume and a textual answer.
     * @param {object} resumeInfo - The current resume data.
     * @param {string} message - The user's message.
     * @param {string} apiKey - The OpenRouter API key.
     * @param {string} model - The selected model.
     * @returns {Promise<{answer: string, resumeInfo: object}>}
     */
    async generate(resumeInfo, message, apiKey, model) {
        if (!apiKey) {
            throw new Error("API Key is required.");
        }
        if (!model) {
            throw new Error("Model is required.");
        }

        const resumeSchema = this.getResumeSchema();

        const messages = [
            {
                role: 'system',
                content: `You are an expert resume builder. The user will provide their current resume data and a message. Your task is to return a JSON object with two properties: "answer" and "resumeInfo". The "answer" should be a helpful, conversational response to the user. The "resumeInfo" should be the user's complete, updated resume data, following their instructions. The user's current resume data is: ${JSON.stringify(resumeInfo)}`
            },
            {
                role: 'user',
                content: message
            }
        ];

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Resume Builder'
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                response_format: {
                    type: 'json_schema',
                    json_schema: {
                        name: "ai_generation",
                        strict: true,
                        schema: {
                            type: 'object',
                            properties: {
                                answer: { type: 'string' },
                                resumeInfo: resumeSchema
                            },
                            required: ['answer', 'resumeInfo']
                        }
                    }
                }
            })
        });

        if (response.status === 401) {
            throw new Error('Invalid API key. Please check your API key and try again.');
        }

        if (response.status === 402) {
            throw new Error('API key has insufficient credits. Please add more credits to your account.');
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || 'An unknown error occurred.');
        }

        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);

        // Ensure the response has the correct structure
        if (!content.answer || !content.resumeInfo) {
            throw new Error("Invalid response format from the AI.");
        }

        return {
            answer: content.answer,
            resumeInfo: ResumeDataV2.fromJSON(content.resumeInfo),
        };
    }

    getResumeSchema() {
        return {
            type: 'object',
            properties: {
                version: { type: 'number' },
                personal: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        title: { type: 'string' },
                        visible: { type: 'boolean' }
                    },
                    additionalProperties: false,
                    required: ['name', 'title', 'visible']
                },
                experiences: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            company: { type: 'string' },
                            period: { type: 'string' },
                            description: { type: 'string' },
                            visible: { type: 'boolean' }
                        },
                        additionalProperties: false,
                        required: ['title', 'company', 'period', 'description', 'visible']
                    }
                },
                experiencesVisible: { type: 'boolean' },
                experiencesSectionName: { type: 'string' },
                education: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            degree: { type: 'string' },
                            school: { type: 'string' },
                            period: { type: 'string' },
                            mark: { type: 'string' },
                            thesis: { type: 'string' },
                            visible: { type: 'boolean' }
                        },
                        additionalProperties: false,
                        required: ['degree', 'school', 'period', 'mark', 'thesis', 'visible']
                    }
                },
                educationVisible: { type: 'boolean' },
                educationSectionName: { type: 'string' },
                customSections: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            content: { type: 'string' },
                            visible: { type: 'boolean' },
                            position: { type: 'string', enum: ['main', 'sidebar'] }
                        },
                        additionalProperties: false,
                        required: ['title', 'content', 'visible', 'position']
                    }
                }
            },
            additionalProperties: false,
            required: ['version', 'personal', 'experiences', 'education', 'customSections', 'experiencesVisible', 'educationVisible', 'experiencesSectionName', 'educationSectionName']
        }
    }
}

export default new AIGenerationService(); 