import { ResumeDataV2 } from '@/models/ResumeData/ResumeDataV2';

class AIGenerationService {
    /**
     * Calls an LLM to get an updated resume and a textual answer.
     * @param {object} resumeInfo - The current resume data.
     * @param {Array<{sender: string, text: string}>} history - The conversation history.
     * @param {string} apiKey - The OpenRouter API key.
     * @param {string} model - The selected model.
     * @param {string} systemMessage - The system message to use.
     * @returns {Promise<{answer: string, resumeInfo: object}>}
     */
    async generate(resumeInfo, history, apiKey, model, systemMessage) {
        if (!apiKey) {
            throw new Error("API Key is required.");
        }
        if (!model) {
            throw new Error("Model is required.");
        }

        const resumeSchema = ResumeDataV2.getResumeSchema();

        const historyMessages = history.map(h => ({
            role: h.sender,
            content: h.text
        }));

        const messages = [
            {
                role: 'system',
                content: `${systemMessage} The user's current resume data is: ${JSON.stringify(resumeInfo)}`
            },
            ...historyMessages
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
}

export default new AIGenerationService(); 