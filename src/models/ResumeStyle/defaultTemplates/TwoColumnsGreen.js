import { ResumeStyleV1_1 } from '../ResumeStyleV1_1';

export class TwoColumnsGreen extends ResumeStyleV1_1 {
    static TEMPLATE_NAME = '2 Columns Green';

    static createDefault() {
        return {
            colors: {
                primary: '#27AE60',
                text: '#2C3E50',
                background: '#ffffff',
                sidebarBackground: '#27AE60',
                sidebarText: '#ffffff',
                datesTextColor: '#7F8C8D',
                subtitleTextColor: '#7F8C8D',
                link: '#ffffff'
            },
            typography: {
                headingFont: 'Helvetica',
                bodyFont: 'Georgia',
                baseSize: 14,
                headingSize: 26
            },
            spacing: {
                section: 24,
                content: 12,
                sidebarLeft: false,
                sidebarWidth: 280
            },
            columns: {
                left: ['personal', 'education'],
                right: ['experiences', 'customSections']
            },
            customCSS: ''
        };
    }

    static validateJSON(json) {
        return ResumeStyleV1_1.validateJSON(json);
    }
} 