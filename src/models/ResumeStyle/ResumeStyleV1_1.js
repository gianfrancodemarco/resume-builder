export class ResumeStyleV1_1 {
    static VERSION = 1.1;
    static TEMPLATE_NAME = '2 Columns';

    static FONT_OPTIONS = [
        "Arial",
        "Verdana",
        "Helvetica",
        "Georgia",
        "Times New Roman",
        "Trebuchet MS",
        "Tahoma",
        "Courier New",
        "Lucida Console",
        "Palatino Linotype",
        "Book Antiqua",
        "Impact",
        "Gill Sans"
    ];

    static COLUMN_TYPES = {
        LEFT: 'left',
        RIGHT: 'right'
    };

    static SECTION_TYPES = [
        {
            label: 'Text',
            value: 'text'
        },
        {
            label: 'List',
            value: 'list'
        },
        {
            label: 'Languages',
            value: 'languages'
        },
        {
            label: 'Italic Text',
            value: 'italic'
        }
    ]

    static createDefault() {
        return {
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
                baseSize: 16,
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
        const errors = [];

        // Validate colors
        if (!json.colors?.primary || typeof json.colors.primary !== 'string') {
            errors.push('Invalid primary color');
        }
        if (!json.colors?.text || typeof json.colors.text !== 'string') {
            errors.push('Invalid text color');
        }
        if (!json.colors?.background || typeof json.colors.background !== 'string') {
            errors.push('Invalid background color');
        }
        if (!json.colors?.sidebarBackground || typeof json.colors.sidebarBackground !== 'string') {
            errors.push('Invalid sidebar background color');
        }
        if (!json.colors?.sidebarText || typeof json.colors.sidebarText !== 'string') {
            errors.push('Invalid sidebar text color');
        }
        if (!json.colors?.datesTextColor || typeof json.colors.datesTextColor !== 'string') {
            errors.push('Invalid dates color');
        }
        if (!json.colors?.subtitleTextColor || typeof json.colors.subtitleTextColor !== 'string') {
            errors.push('Invalid subtitle text color');
        }
        if (!json.colors?.link || typeof json.colors.link !== 'string') {
            errors.push('Invalid link color');
        }

        // Validate typography
        if (!json.typography?.headingFont || typeof json.typography.headingFont !== 'string') {
            errors.push('Invalid heading font');
        }
        if (!json.typography?.bodyFont || typeof json.typography.bodyFont !== 'string') {
            errors.push('Invalid body font');
        }
        if (!json.typography?.baseSize || typeof json.typography.baseSize !== 'number') {
            errors.push('Invalid base size');
        }
        if (!json.typography?.headingSize || typeof json.typography.headingSize !== 'number') {
            errors.push('Invalid heading size');
        }

        // Validate spacing
        if (typeof json.spacing?.section !== 'number') {
            errors.push('Invalid section spacing');
        }
        if (typeof json.spacing?.content !== 'number') {
            errors.push('Invalid content spacing');
        }
        if (typeof json.spacing?.sidebarLeft !== 'boolean') {
            errors.push('Invalid sidebar position');
        }
        if (typeof json.spacing?.sidebarWidth !== 'number') {
            errors.push('Invalid sidebar width');
        }

        // Validate columns
        if (!Array.isArray(json.columns?.left)) {
            errors.push('Invalid left column configuration');
        }
        if (!Array.isArray(json.columns?.right)) {
            errors.push('Invalid right column configuration');
        }

        // Validate customCSS
        if (json.customCSS !== undefined && typeof json.customCSS !== 'string') {
            errors.push('Invalid custom CSS');
        }

        return errors;
    }

    static getVersion() {
        return ResumeStyleV1_1.VERSION;
    }
} 