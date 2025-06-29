import { ResumeStyleV1_1 } from '../ResumeStyleV1_1';

export class TwoColumnsBlue extends ResumeStyleV1_1 {
    // The ResumeStyleV1_1 class already implements a 2 Columns Blue template, so we just need to extend it
    static TEMPLATE_NAME = '2 Columns Blue';

    constructor(data = {}) {
        super(data);
        this.templateName = TwoColumnsBlue.TEMPLATE_NAME;
    }
} 