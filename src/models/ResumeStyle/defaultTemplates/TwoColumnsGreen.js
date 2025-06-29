import { ResumeStyleV1_1 } from '../ResumeStyleV1_1';

export class TwoColumnsGreen extends ResumeStyleV1_1 {
    static TEMPLATE_NAME = '2 Columns Green';

    constructor(data = {}) {
        super(data);
        this.templateName = TwoColumnsGreen.TEMPLATE_NAME;

        // Override with green color scheme
        this.colors.primary = '#27AE60';
        this.colors.text = '#2C3E50';
        this.colors.sidebarBackground = '#27AE60';
        this.colors.sidebarText = '#ffffff';
        this.colors.datesTextColor = '#7F8C8D';
        this.colors.subtitleTextColor = '#7F8C8D';

        this.spacing.sidebarLeft = false;
    }
} 