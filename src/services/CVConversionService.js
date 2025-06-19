import { ResumeDataV2 } from '@/models/ResumeData/ResumeDataV2'

export class CVConversionService {
    static async convertCV(file, apiKey, model) {
        try {
            // Convert file to base64
            const base64File = await this.fileToBase64(file)

            // Prepare the schema based on ResumeDataV2 structure
            const schema = this.getResumeSchema()

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
                                Please analyze this CV and convert it into a structured format following the provided schema. 
                                Extract all relevant information including personal details, work experience, education, and any other sections that could be added as custom sections. Format the content appropriately for a professional resume. 
                                The content section is in HTML. Try to replicate original styles.

                                Use <a> for links of websites, social media, etc.

                                For lists, use <ul> and <li> tags. Add a tabs before each item. Do not add new lines between items.
                                Do not use lists in work experience and education sections, but use <br> to separate paragraphs.

                                If there are bars for skills, languages, etc. use the following format: (Skill)[BAR:Percentage] with no space, no list and not other text, for example: (Italian)[BAR:90]
                                
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

            // Create new ResumeDataV2 instance with the converted data
            const resumeData = ResumeDataV2.fromJSON(convertedData)
            // For now, force all custom sections to be in the sidebar
            for (const section of resumeData.customSections) {
                section.position = 'sidebar'
            }
            return resumeData
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

    static getResumeSchema() {
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
            return this.getDefaultModels()
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