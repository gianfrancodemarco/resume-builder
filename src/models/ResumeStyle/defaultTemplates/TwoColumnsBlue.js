import { ResumeStyleV1_1 } from '../ResumeStyleV1_1';

export class TwoColumnsBlue extends ResumeStyleV1_1 {
    static createDefault() {
        return {
            templateName: 'TwoColumnsBlue',
            colors: {
                primary: '#08294D',
                text: '#08294D',
                background: '#ffffff',
                sidebarBackground: '#08294D',
                sidebarText: '#eeeeee',
                datesTextColor: '#aaaaaa',
                subtitleTextColor: '#aaaaaa',
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