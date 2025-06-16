export class ResumeDataV2 {
    static VERSION = 2;

    constructor(data = {}) {
        this.version = data.version || ResumeDataV2.VERSION;
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
        this.experiencesSectionName = data.experiencesSectionName || 'Employment History';
        this.education = (data.education || []).map(edu => ({
            degree: edu.degree || '',
            school: edu.school || '',
            period: edu.period || '',
            mark: edu.mark || '',
            thesis: edu.thesis || '',
            visible: edu.visible ?? true
        }));
        this.educationVisible = data.educationVisible ?? true;
        this.educationSectionName = data.educationSectionName || 'Education';
        this.customSections = (data.customSections || []).map(section => ({
            title: section.title || '',
            content: section.content || '',
            visible: section.visible ?? true,
            position: section.position || 'main' // 'main' or 'sidebar'
        }));
    }

    static getNewExperience() {
        return {
            title: 'Experience',
            company: 'Company',
            period: '',
            description: '',
            visible: true
        };
    }

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
    
    static getNewCustomSection() {
        return {
            title: 'New Section',
            content: '',
            visible: true,
            position: 'main' // 'main' or 'sidebar'
        };
    }

    static createDefault() {
        return new ResumeDataV2({
            version: ResumeDataV2.VERSION,
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
            experiencesSectionName: 'Employment History',
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
            educationSectionName: 'Education',
            customSections: [
                {
                    title: 'About Me',
                    content: '<p>Passionate software engineer with a strong focus on web development and user experience. Experienced in building modern, responsive applications using Vue.js and other cutting-edge technologies.</p><p>Skilled in both frontend and backend development, with a particular emphasis on creating intuitive user interfaces and robust server-side solutions.</p>',
                    visible: true,
                    position: 'sidebar'
                },
                {
                    title: 'Contact Details',
                    content: '<p>New York, USA</p><p><a href="mailto:john.doe@example.com">john.doe@example.com</a></p>',
                    visible: true,
                    position: 'sidebar'
                },
                {
                    title: 'Professional Links',
                    content: '<p><a href="https://github.com/johndoetest1999">GitHub Profile</a></p><p><a href="https://linkedin.com/in/johndoe">LinkedIn Profile</a></p>',
                    visible: true,
                    position: 'sidebar'
                },
                {
                    title: 'Technical Skills',
                    content: 'Vue.js<br/>JavaScript<br/>TypeScript<br/>Python<br/>HTML/CSS<br/>Git<br/>Docker<br/>Node.js',
                    visible: true,
                    position: 'sidebar'
                },
                {
                    title: 'Languages',
                    content: '(Italian)[BAR:100]<br/>(English)[BAR:90]<br/>(Spanish)[BAR:70]',
                    visible: true,
                    position: 'sidebar'
                }
            ]
        });
    }

    toJSON() {
        return {
            version: this.version,
            personal: this.personal,
            experiences: this.experiences,
            experiencesVisible: this.experiencesVisible,
            experiencesSectionName: this.experiencesSectionName,
            education: this.education,
            educationVisible: this.educationVisible,
            educationSectionName: this.educationSectionName,
            customSections: this.customSections
        };
    }

    static fromJSON(json) {
        if (json.version !== ResumeDataV2.VERSION) {
            json.version = ResumeDataV2.VERSION;
        }
        return new ResumeDataV2(json);
    }
} 