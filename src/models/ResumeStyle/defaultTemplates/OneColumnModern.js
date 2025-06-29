import { ResumeStyleV1_1 } from '../ResumeStyleV1_1';

export class OneColumnModern extends ResumeStyleV1_1 {
    static TEMPLATE_NAME = '1 Column Modern';

    constructor(data = {}) {
        super(data);
        this.templateName = OneColumnModern.TEMPLATE_NAME;

        // Override with modern one-column styling
        this.colors = {
            primary: data.colors?.primary || '#2C3E50',
            text: data.colors?.text || '#2C3E50',
            background: data.colors?.background || '#ffffff',
            sidebarBackground: data.colors?.sidebarBackground || '#ECF0F1',
            sidebarText: data.colors?.sidebarText || '#2C3E50',
            datesTextColor: data.colors?.datesTextColor || '#7F8C8D',
            subtitleTextColor: data.colors?.subtitleTextColor || '#7F8C8D',
            link: data.colors?.link || '#3498DB'
        };

        this.typography = {
            headingFont: data.typography?.headingFont || 'Inter',
            bodyFont: data.typography?.bodyFont || 'Inter',
            baseSize: data.typography?.baseSize || 14,
            headingSize: data.typography?.headingSize || 24
        };

        this.spacing = {
            section: data.spacing?.section || 20,
            content: data.spacing?.content || 8,
            sidebarLeft: data.spacing?.sidebarLeft ?? false,
            sidebarWidth: data.spacing?.sidebarWidth || 0 // No sidebar for one-column
        };

        this.columns = {
            left: data.columns?.left || ['personal', 'education', 'experiences', 'customSections'],
            right: data.columns?.right || []
        };
    }
}