import { resumeContentSchema } from '@/resume/llmSchema'
import { compact } from '@/resume/values'

export class CVConversionService {
    static async convertCV(file, apiKey, model) {
        try {
            // Convert file to base64
            const base64File = await this.fileToBase64(file)

            // JSON Resume content (https://jsonresume.org/schema) as a strict schema
            const schema = resumeContentSchema()

            // Prepare the messages for OpenRouter
            const fileType = file.type === 'application/pdf' ? 'pdf' : 'image'
            const fileMessage = fileType === 'pdf' ? 
            {
                type: 'file',
                file: {
                    filename: file.name,
                    file_data: base64File
                }
            } : {
                type: 'image_url',
                image_url: {
                    url: `data:image/${fileType.split('/')[1]};base64,${base64File}`
                }
            }

            const messages = [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `
                                Please analyze this CV and convert it into the JSON Resume format (https://jsonresume.org/schema), following the provided schema.
                                Extract all relevant information: personal details, contact details, profiles, work experience, education, skills, languages, projects and any other section the CV has.
                                Put each piece of information in the most specific section of the schema. Leave a field as an empty string (or empty array) when the CV does not contain it; never invent data.
                                Dates must be ISO 8601 (YYYY, YYYY-MM or YYYY-MM-DD). Leave the end date empty for current positions.
                                Text fields may use Markdown (bold, italic, links). Put bullet points of a job or project in "highlights", one item per bullet, without the bullet character.
                                For languages, put the level as written in the CV in "fluency" (e.g. "Native speaker", "C1", "Fluent").
                                The CV is in the file attached.
                                `
                        },
                        fileMessage
                    ]
                }
            ]

            // Make the API request to OpenRouter
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
                    plugins: [
                        {
                            "id": "file-parser",
                            "pdf": {
                                "engine": "pdf-text"
                            }
                        }
                    ],
                    response_format: {
                        type: 'json_schema',
                        json_schema: {
                            name: "resume",
                            strict: true,
                            schema: schema
                        }
                    }
                }),
                
            })

            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your API key and try again.')
            }

            if (response.status === 402) {
                throw new Error('API key has insufficient credits. Please add more credits to your account.')
            }

            const data = await response.json()
            const convertedData = JSON.parse(data.choices[0].message.content)

            // Strict mode returns every field; drop the empty ones
            return compact(convertedData)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async fileToBase64(file) {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target.result)
            reader.readAsDataURL(file)
        })
    }

    static async fetchAvailableModels() {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/models')
            if (!response.ok) {
                throw new Error('Failed to fetch models')
            }
            const data = await response.json()

            // Filter models that support image input
            return data.data
                //.filter(model => model.architecture?.input_modalities?.includes('image') || model.architecture?.input_modalities?.includes('file'))
                .filter(model => model.architecture?.input_modalities?.includes('file'))
        } catch (error) {
            console.error('Error fetching models:', error)
            // Fallback to hardcoded models if API fails
            throw new Error('Error fetching models: ' + error.message)
        }
    }

    static validateFile(file) {
        if (!file) return false
        if (file.size > 10 * 1024 * 1024) {
            throw new Error('File size must be less than 10MB')
        }
        return true
    }
} 