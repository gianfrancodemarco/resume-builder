 export class ResumeStyleBase {
    static VERSION = 2.0;
    
    constructor(data = {}) {
        this.version = data.version || ResumeStyleBase.VERSION;
        this.templateName = data.templateName || 'Base Template';
         
        this.colors = {
            primary: data.colors?.primary || '#3498db',
            text: data.colors?.text || '#333',
            background: data.colors?.background || '#ffffff',
            accent: data.colors?.accent || '#e74c3c',
            sectionTitle: data.colors?.sectionTitle || '#2c3e50'
        };
        
        this.typography = {
            headingFont: data.typography?.headingFont || 'Georgia, serif',
            bodyFont: data.typography?.bodyFont || 'Georgia, serif',
            baseSize: data.typography?.baseSize || 16,
            headingSize: data.typography?.headingSize || 28
        };
        
        this.spacing = {
            section: data.spacing?.section || 25,
            content: data.spacing?.content || 12,
            padding: data.spacing?.padding || 40
        };
        
        this.layout = {
            type: data.layout?.type || 'single-column',
            maxWidth: data.layout?.maxWidth || 800
        };
    }
    
    static createDefault() {
        return new this();
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
        if (!this.colors.accent || typeof this.colors.accent !== 'string') {
            errors.push('Invalid accent color');
        }
        if (!this.colors.sectionTitle || typeof this.colors.sectionTitle !== 'string') {
            errors.push('Invalid section title color');
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
        if (typeof this.spacing.padding !== 'number') {
            errors.push('Invalid content spacing');
        } 
                
        return errors;
    }
    
    static fromJSON(json) {
        if (!json || typeof json !== 'object') {
            return new ResumeStyleBase();
        }
        return new ResumeStyleBase(json);
    }
}