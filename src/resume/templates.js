// Visual templates. A template sets the Typst layout and the default style;
// the chosen template and its (user-tweaked) style live in
// resume.meta.resumeBuilder.

const NAVY = '#08294D'

export const TEMPLATES = {
    TwoColumnsBlue: {
        name: '2 Columns',
        layout: 'two-column',
        style: {
            colors: {
                primary: NAVY,
                text: NAVY,
                background: '#ffffff',
                sidebarBackground: NAVY,
                sidebarText: '#eeeeee',
                datesTextColor: '#aaaaaa',
                subtitleTextColor: '#aaaaaa',
                link: '#ffffff',
            },
            typography: { headingFont: 'Arimo', bodyFont: 'Gelasio', baseSize: 14, headingSize: 26 },
            spacing: { section: 24, content: 12, sidebarLeft: false, sidebarWidth: 280 },
        },
    },
    TwoColumnsGreen: {
        name: '2 Columns Green',
        layout: 'two-column',
        style: {
            colors: {
                primary: '#27AE60',
                text: '#2C3E50',
                background: '#ffffff',
                sidebarBackground: '#27AE60',
                sidebarText: '#ffffff',
                datesTextColor: '#7F8C8D',
                subtitleTextColor: '#7F8C8D',
                link: '#ffffff',
            },
            typography: { headingFont: 'Arimo', bodyFont: 'Gelasio', baseSize: 14, headingSize: 26 },
            spacing: { section: 24, content: 12, sidebarLeft: false, sidebarWidth: 280 },
        },
    },
    OneColumnModern: {
        name: '1 Column Modern',
        layout: 'one-column-modern',
        style: {
            colors: {
                primary: '#2C3E50',
                text: '#2C3E50',
                background: '#ffffff',
                sidebarBackground: '#ECF0F1',
                sidebarText: '#2C3E50',
                datesTextColor: '#7F8C8D',
                subtitleTextColor: '#7F8C8D',
                link: '#3498DB',
            },
            typography: { headingFont: 'Inter', bodyFont: 'Inter', baseSize: 14, headingSize: 24 },
            spacing: { section: 20, content: 20, sidebarLeft: false, sidebarWidth: 0 },
        },
    },
}

export const DEFAULT_TEMPLATE = 'TwoColumnsBlue'

/** Whether the template has a sidebar column sections can be placed in. */
export const hasSidebar = templateKey => TEMPLATES[templateKey]?.layout === 'two-column'

/** A fresh copy of the template's default style. */
export function templateStyle(templateKey) {
    return structuredClone(TEMPLATES[templateKey].style)
}
