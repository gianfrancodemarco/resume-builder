import { ResumeStyleV1 } from './ResumeStyleV1';

export class ResumeStyleV1_1 extends ResumeStyleV1 {
    static VERSION = 1.1;

    constructor(data = {}) {
        super(data);
        this.version = data.version || ResumeStyleV1_1.VERSION;
        this.colors = {
            primary: data.colors?.primary || '#08294D',
            text: data.colors?.text || '#08294D',
            background: data.colors?.background || '#ffffff',
            sidebarBackground: data.colors?.sidebarBackground || '#08294D',
            sidebarText: data.colors?.sidebarText || '#eeeeee',
            datesTextColor: data.colors?.datesTextColor || '#aaaaaa',
            subtitleTextColor: data.colors?.subtitleTextColor || '#aaaaaa',
            link: data.colors?.link || '#ffffff'
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
        return new this();
    }

    validate() {
        super.validate();
        const errors = [];

        // Validate colors
        if (!this.colors.sidebarBackground || typeof this.colors.sidebarBackground !== 'string') {
            errors.push('Invalid sidebar background color');
        }
        if (!this.colors.sidebarText || typeof this.colors.sidebarText !== 'string') {
            errors.push('Invalid sidebar text color');
        }
        if (!this.colors.datesTextColor || typeof this.colors.datesTextColor !== 'string') {
            errors.push('Invalid dates color');
        }
        if (!this.colors.subtitleTextColor || typeof this.colors.subtitleTextColor !== 'string') {
            errors.push('Invalid subtitle text color');
        }
        return errors;
    }

    static fromJSON(json) {
        if (!json || typeof json !== 'object') {
            return new ResumeStyleV1_1();
        }
        return new ResumeStyleV1_1(json);
    }
} 