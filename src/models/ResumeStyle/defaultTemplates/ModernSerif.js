 import { ResumeStyleBase } from '../ResumeStyleBase.js';

export class ModernSerif extends ResumeStyleBase {
    static TEMPLATE_NAME = 'Modern Serif';

    constructor(data = {}) {
        super(data);
        this.templateName = ModernSerif.TEMPLATE_NAME;

        // Override with Modern Serif specific styling
        this.colors = {
            primary: data.colors?.primary || '#8e44ad',
            text: data.colors?.text || '#333',
            background: data.colors?.background || '#f8f9fa',
            accent: data.colors?.accent || '#8e44ad',
            sectionTitle: data.colors?.sectionTitle || '#8e44ad'
        };

        this.typography = {
            headingFont: data.typography?.headingFont || 'Georgia, serif',
            bodyFont: data.typography?.bodyFont || 'Georgia, serif',
            baseSize: data.typography?.baseSize || 16,
            headingSize: data.typography?.headingSize || 28
        };

        this.spacing = {
            section: data.spacing?.section || 30,
            content: data.spacing?.content || 15,
            padding: data.spacing?.padding || 40
        };

        this.layout = {
            type: 'single-column',
            maxWidth: 800,
            headerAlignment: 'center',
            sectionTitleStyle: 'minimal'
        };

        // Additional properties specific to this layout 
        this.sectionStyles = {
            header: {
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                paddingBottom: '20px'
            },
            sectionTitle: {
                fontWeight: 'normal',
                letterSpacing: '1px',
                textTransform: 'none'
            },
            skillItem: {
                background: '#f5eef8',
                padding: '8px 15px',
                borderRadius: '4px'
            }
        };
    }

    // To generate CSS for this template
    generateCSS() {
        return `
            :root {
                --primary: ${this.colors.primary};
                --text: ${this.colors.text};
                --background: ${this.colors.background};
                --accent: ${this.colors.accent};
                --section-title: ${this.colors.sectionTitle};
                --section-spacing: ${this.spacing.section}px;
                --content-spacing: ${this.spacing.content}px;
                --padding: ${this.spacing.padding}px;
                --heading-font: ${this.typography.headingFont};
                --body-font: ${this.typography.bodyFont};
                --base-size: ${this.typography.baseSize}px;
                --heading-size: ${this.typography.headingSize}px;
                --max-width: ${this.layout.maxWidth}px;
            }
            
            .modern-serif-resume {
                background: var(--background);
                color: var(--text);
                font-family: var(--body-font);
                font-size: var(--base-size);
                padding: var(--padding);
                max-width: var(--max-width);
                margin: 0 auto;
            }
            
            .modern-serif-resume .resume-header {
                text-align: ${this.layout.headerAlignment};
                padding-bottom: ${this.sectionStyles.header.paddingBottom};
                border-bottom: ${this.sectionStyles.header.borderBottom};
                margin-bottom: 30px;
            }
            
            .modern-serif-resume .name {
                font-family: var(--heading-font);
                font-size: var(--heading-size);
                color: var(--text);
                margin-bottom: 5px;
            }
            
            .modern-serif-resume .title {
                font-size: 1.3rem;
                color: #7f8c8d;
                margin-bottom: 15px;
            }
            
            .modern-serif-resume .section {
                margin-bottom: var(--section-spacing);
            }
            
            .modern-serif-resume .section-title {
                font-family: var(--heading-font);
                font-size: 1.4rem;
                color: var(--section-title);
                margin-bottom: 15px;
                font-weight: ${this.sectionStyles.sectionTitle.fontWeight};
                letter-spacing: ${this.sectionStyles.sectionTitle.letterSpacing};
                text-transform: ${this.sectionStyles.sectionTitle.textTransform};
            }
            
            .modern-serif-resume .item {
                margin-bottom: var(--content-spacing);
            }
            
            .modern-serif-resume .skill-items {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .modern-serif-resume .skill-item {
                background: ${this.sectionStyles.skillItem.background};
                padding: ${this.sectionStyles.skillItem.padding};
                border-radius: ${this.sectionStyles.skillItem.borderRadius};
                font-size: 0.9rem;
            }
            
            @media (max-width: 768px) {
                .modern-serif-resume {
                    padding: 20px;
                }
            }
        `;
    }

    // Method to generate HTML structure
    generateHTML(resumeData) {
        return `
            <div class="modern-serif-resume">
                <div class="resume-header">
                    <h1 class="name">${resumeData.name}</h1>
                    <p class="title">${resumeData.title}</p>
                    <div class="contact-info">
                        ${resumeData.contact.map(item => `<span>${item}</span>`).join('')}
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Professional Summary</h2>
                    <p>${resumeData.summary}</p>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Work Experience</h2>
                    ${resumeData.experience.map(job => `
                        <div class="item">
                            <div class="item-title">${job.position}</div>
                            <div class="item-subtitle">${job.company}</div>
                            <div class="item-date">${job.dates}</div>
                            <p>${job.description}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="section">
                    <h2 class="section-title">Education</h2>
                    ${resumeData.education.map(edu => `
                        <div class="item">
                            <div class="item-title">${edu.degree}</div>
                            <div class="item-subtitle">${edu.institution}</div>
                            <div class="item-date">${edu.dates}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="section">
                    <h2 class="section-title">Skills</h2>
                    <div class="skills-list">
                        ${Object.entries(resumeData.skills).map(([category, skills]) => `
                            <div class="skill-category">
                                <h4>${category}</h4>
                                <div class="skill-items">
                                    ${skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
}