export class ResumeStyleV1 {
    static VERSION = 1;
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

    constructor(data = {}) {
        this.version = data.version || ResumeStyleV1.VERSION;
        this.templateName = data.templateName || ResumeStyleV1.TEMPLATE_NAME;
        this.colors = {
            primary: data.colors?.primary || '#08294D',
            text: data.colors?.text || '#08294D',
            background: data.colors?.background || '#ffffff',
            sidebar: data.colors?.sidebar || '#08294D',
            link: data.colors?.link || '#08294D'
        };

        this.typography = {
            headingFont: data.typography?.headingFont || 'Helvetica',
            bodyFont: data.typography?.bodyFont || 'Georgia',
            baseSize: data.typography?.baseSize || 16,
            headingSize: data.typography?.headingSize || 26
        };

        this.spacing = {
            section: data.spacing?.section || 24,
            content: data.spacing?.content || 12,
            sidebarLeft: data.spacing?.sidebarLeft ?? false,
            sidebarWidth: data.spacing?.sidebarWidth || 280
        };

        this.columns = {
            left: data.columns?.left || [],
            right: data.columns?.right || []
        };
    }

    static createDefault() {
        return new ResumeStyleV1({
            version: ResumeStyleV1.VERSION,
            colors: {
                primary: '#08294D',
                text: '#08294D',
                background: '#ffffff',
                sidebar: '#08294D',
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
                left: ['personal',
                    'education'],
                right: ['experiences',
                    'customSections']
            }
        });
    }

    toJSON() {
        return {
            version: this.version,
            templateName: this.templateName,
            colors: this.colors,
            typography: this.typography,
            spacing: this.spacing,
            columns: this.columns
        };
    }

    static fromJSON(json) {
        if (!json || typeof json !== 'object') {
            return new ResumeStyleV1();
        }
        return new ResumeStyleV1(json);
    }

    validate() {
        const errors = [];

        // Validate colors
        if (!this.colors.primary || typeof this.colors.primary !== 'string') {
            errors.push('Invalid primary color');
        }
        if (!this.colors.text || typeof this.colors.text !== 'string') {
            errors.push('Invalid text color');
        }
        if (!this.colors.background || typeof this.colors.background !== 'string') {
            errors.push('Invalid background color');
        }
        if (!this.colors.sidebar || typeof this.colors.sidebar !== 'string') {
            errors.push('Invalid sidebar color');
        }
        if (!this.colors.link || typeof this.colors.link !== 'string') {
            errors.push('Invalid link color');
        }

        // Validate typography
        if (!this.typography.headingFont || typeof this.typography.headingFont !== 'string') {
            errors.push('Invalid heading font');
        }
        if (!this.typography.bodyFont || typeof this.typography.bodyFont !== 'string') {
            errors.push('Invalid body font');
        }
        if (!this.typography.baseSize || typeof this.typography.baseSize !== 'number') {
            errors.push('Invalid base size');
        }
        if (!this.typography.headingSize || typeof this.typography.headingSize !== 'number') {
            errors.push('Invalid heading size');
        }

        // Validate spacing
        if (typeof this.spacing.section !== 'number') {
            errors.push('Invalid section spacing');
        }
        if (typeof this.spacing.content !== 'number') {
            errors.push('Invalid content spacing');
        }
        if (typeof this.spacing.sidebarLeft !== 'boolean') {
            errors.push('Invalid sidebar position');
        }
        if (typeof this.spacing.sidebarWidth !== 'number') {
            errors.push('Invalid sidebar width');
        }

        // Validate columns
        if (!Array.isArray(this.columns.left)) {
            errors.push('Invalid left column configuration');
        }
        if (!Array.isArray(this.columns.right)) {
            errors.push('Invalid right column configuration');
        }

        return errors;
    }

    static getVersion() {
        return ResumeStyleV1.VERSION;
    }
} 