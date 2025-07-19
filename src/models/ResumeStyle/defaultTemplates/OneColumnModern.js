import { ResumeStyleV1_1 } from '../ResumeStyleV1_1';

export class OneColumnModern extends ResumeStyleV1_1 {
    static TEMPLATE_NAME = '1 Column Modern';

    static createDefault() {
        return {
            templateName: 'OneColumnModern',
            colors: {
                primary: '#2C3E50',
                text: '#2C3E50',
                background: '#ffffff',
                sidebarBackground: '#ECF0F1',
                sidebarText: '#2C3E50',
                datesTextColor: '#7F8C8D',
                subtitleTextColor: '#7F8C8D',
                link: '#3498DB'
            },
            typography: {
                headingFont: 'Inter',
                bodyFont: 'Inter',
                baseSize: 14,
                headingSize: 24
            },
            spacing: {
                section: 20,
                content: 8,
                sidebarLeft: false,
                sidebarWidth: 0 // No sidebar for one-column
            },
            columns: {
                left: ['personal', 'education', 'experiences', 'customSections'],
                right: []
            },
            customCSS: `h1, .subtitle {text-align: center}`
        };
    }

    static validateJSON(json) {
        return ResumeStyleV1_1.validateJSON(json);
    }
}