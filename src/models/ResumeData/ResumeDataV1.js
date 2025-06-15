export class ResumeDataV1 {
    static VERSION = 1;

    static SECTION_TYPES = {
        TEXT: 'text',
        ITALIC: 'italic',
        LIST: 'list',
        LANGUAGES: 'languages'
    };

    constructor(data = {}) {
        this.version = data.version || ResumeDataV1.VERSION;
        this.personal = {
            name: data.personal?.name || '',
            title: data.personal?.title || '',
            visible: data.personal?.visible ?? true
        };

        this.experiences = (data.experiences || []).map(exp => ({
            title: exp.title || '',
            company: exp.company || '',
            period: exp.period || '',
            description: exp.description || '',
            visible: exp.visible ?? true
        }));
        this.experiencesVisible = data.experiencesVisible ?? true;

        this.education = (data.education || []).map(edu => ({
            degree: edu.degree || '',
            school: edu.school || '',
            period: edu.period || '',
            mark: edu.mark || '',
            thesis: edu.thesis || '',
            visible: edu.visible ?? true
        }));
        this.educationVisible = data.educationVisible ?? true;

        this.customSections = (data.customSections || []).map(section => ({
            title: section.title || '',
            type: section.type || 'text',
            visible: section.visible ?? true,
            items: section.items || []
        }));
        this.customSectionsVisible = data.customSectionsVisible ?? true;
    }

    // Helper method to create a default resume
    static createDefault() {
        return new ResumeDataV1({
            version: ResumeDataV1.VERSION,
            personal: {
                name: 'John Doe',
                title: 'Software Engineer',
                visible: true
            },
            experiences: [
                {
                    title: 'Senior Software Engineer',
                    company: 'Tech Solutions Inc. - Milan',
                    period: '2020 - Present',
                    description: 'Led the development of enterprise-level web applications using Vue.js and Node.js. Implemented CI/CD pipelines and improved application performance by 40%.',
                    visible: true
                },
                {
                    title: 'Full Stack Developer',
                    company: 'Digital Innovations - Rome',
                    period: '2018 - 2020',
                    description: 'Developed and maintained multiple web applications. Collaborated with UX designers to implement responsive interfaces and improve user experience.',
                    visible: true
                }
            ],
            experiencesVisible: true,
            education: [
                {
                    degree: 'Master in Computer Science',
                    school: 'University of Milan',
                    period: '2016 - 2018',
                    mark: '110/110',
                    thesis: 'Advanced Web Development Techniques and Best Practices',
                    visible: true
                },
                {
                    degree: 'Bachelor in Computer Engineering',
                    school: 'University of Rome',
                    period: '2013 - 2016',
                    mark: '108/110',
                    thesis: 'Introduction to Modern Web Technologies',
                    visible: true
                }
            ],
            educationVisible: true,
            customSections: [
                {
                    title: 'About Me',
                    type: 'italic',
                    visible: true,
                    items: [
                        { value: 'Passionate software engineer with a strong focus on web development and user experience. Experienced in building modern, responsive applications using Vue.js and other cutting-edge technologies.', isLink: false, href: '' },
                        { value: 'Skilled in both frontend and backend development, with a particular emphasis on creating intuitive user interfaces and robust server-side solutions.', isLink: false, href: '' }
                    ]
                },
                {
                    title: 'Contact Details',
                    type: 'text',
                    visible: true,
                    items: [
                        { value: 'New York, USA', isLink: false, href: '' },
                        { value: 'john.doe@example.com', isLink: true, href: 'mailto:john.doe@example.com' }
                    ]
                },
                {
                    title: 'Professional Links',
                    type: 'text',
                    visible: true,
                    items: [
                        { value: 'GitHub Profile', isLink: true, href: 'https://github.com/johndoetest1999' },
                        { value: 'LinkedIn Profile', isLink: true, href: 'https://linkedin.com/in/johndoe' }
                    ]
                },
                {
                    title: 'Technical Skills',
                    type: 'list',
                    visible: true,
                    items: [
                        {
                            value: 'Vue.js',
                            isLink: false,
                            href: '',
                            name: '',
                            proficiency: 0
                        },
                        {
                            value: 'JavaScript',
                            isLink: false,
                            href: '',
                            name: '',
                            proficiency: 0
                        },
                        {
                            value: 'TypeScript',
                            isLink: false,
                            href: '',
                            name: '',
                            proficiency: 0
                        },
                        {
                            value: 'Python',
                            isLink: false,
                            href: '',
                            name: '',
                            proficiency: 0
                        },
                        {
                            value: 'HTML/CSS',
                            isLink: false,
                            href: '',
                            name: '',
                            proficiency: 0
                        },
                        {
                            value: 'Git',
                            isLink: false,
                            href: '',
                            name: '',
                            proficiency: 0
                        },
                        {
                            value: 'Docker',
                            isLink: false,
                            href: '',
                            name: '',
                            proficiency: 0
                        },
                        {
                            value: 'Node.js',
                            isLink: false,
                            href: '',
                            name: '',
                            proficiency: 0
                        }
                    ]
                },
                {
                    title: 'Languages',
                    type: 'languages',
                    visible: true,
                    items: [
                        { name: 'Italian', proficiency: 100 },
                        { name: 'English', proficiency: 90 },
                        { name: 'Spanish', proficiency: 70 }
                    ]
                }
            ],
            customSectionsVisible: true
        });
    }

    // Method to get a new experience object with default values
    static getNewExperience() {
        return {
            title: 'Experience',
            company: 'Company',
            period: '',
            description: '',
            visible: true
        };
    }

    // Method to get a new education object with default values
    static getNewEducation() {
        return {
            degree: 'Degree',
            school: 'Cool School',
            period: '',
            mark: '',
            thesis: '',
            visible: true
        };
    }

    // Method to get a new custom section object with default values
    static getNewCustomSection() {
        return {
            title: 'New Section',
            type: ResumeDataV1.SECTION_TYPES.TEXT,
            visible: true,
            items: []
        };
    }

    static getNewCustomSectionItem() {
        return {
            value: '',
            isLink: false,
            href: '',
            name: '',
            proficiency: 0
        };
    }

    // Method to convert the class instance to a plain object
    toJSON() {
        return {
            version: this.version,
            personal: this.personal,
            experiences: this.experiences,
            experiencesVisible: this.experiencesVisible,
            education: this.education,
            educationVisible: this.educationVisible,
            customSections: this.customSections,
            customSectionsVisible: this.customSectionsVisible
        };
    }

    // Method to create a ResumeDataV1 instance from a JSON object
    static fromJSON(json) {
        // Handle version migration if needed
        if (json.version !== ResumeDataV1.VERSION) {
            console.warn(`ResumeDataV1 version mismatch. Expected ${ResumeDataV1.VERSION}, got ${json.version}`);
            // Here you can add version migration logic in the future
            // For now, we'll just update the version
            json.version = ResumeDataV1.VERSION;
        }
        return new ResumeDataV1(json);
    }

    // Method to validate the resume data
    validate() {
        const errors = [];

        // Validate version
        if (this.version !== ResumeDataV1.VERSION) {
            errors.push(`Invalid resume version. Expected ${ResumeDataV1.VERSION}, got ${this.version}`);
        }

        // Validate personal information
        if (!this.personal.name?.trim()) {
            errors.push('Name is required');
        }
        if (!this.personal.title?.trim()) {
            errors.push('Title is required');
        }

        // Validate experiences
        if (this.experiencesVisible && this.experiences.length === 0) {
            errors.push('At least one experience is required when experiences section is visible');
        }

        // Validate education
        if (this.educationVisible && this.education.length === 0) {
            errors.push('At least one education entry is required when education section is visible');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Method to get the current version
    static getVersion() {
        return ResumeDataV1.VERSION;
    }
} 