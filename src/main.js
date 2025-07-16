import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify imports
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Phosphor Icons
import { PhEye, PhEyeSlash, PhPencilSimple, PhCheck, PhTrash, PhPlus, PhTextAlignRight, PhTextAlignLeft, PhArrowUp, PhArrowDown, PhCopy, PhPalette, PhTextT, PhArrowsOutLineVertical, PhGlobe, PhLink, PhX, PhArrowCounterClockwise, PhArrowClockwise, PhTextB, PhTextItalic, PhTextStrikethrough, PhTextUnderline, PhListBullets, PhListNumbers, PhList, PhBracketsCurly, PhUpload, PhFilePdf, PhFileCode, PhFileText, PhLightning, PhUser, PhUserCircle, PhBriefcase, PhGraduationCap, PhPlusCircle, PhTranslate, PhCertificate, PhFolder, PhBookOpen, PhTrophy, PhHeart, PhStar, PhUsers, PhTarget, PhMedal, PhGameController, PhBuildings, PhLightbulb, PhPhone, PhMagnifyingGlassPlus, PhMagnifyingGlassMinus, PhHouse, PhSun, PhMoon, PhCaretUp, PhCaretDown, PhLayout } from '@phosphor-icons/vue'
const savedTheme = localStorage.getItem('theme') || 'dark';
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: savedTheme,
        themes: {
            dark: {
                dark: true,
                colors: {
                    // Primary colors
                    primary: '#667eea',
                    secondary: '#764ba2',

                    // Background colors
                    background: '#0f172a',
                    surface: '#1e293b',
                    'surface-variant': 'rgba(30, 41, 59, 0.4)',

                    // Text colors
                    'on-surface': '#e2e8f0',
                    'on-surface-variant': '#cbd5e1',
                    'on-background': '#f8fafc',

                    // Custom theme colors
                    'editor-bg': 'rgba(30, 41, 59, 0.3)',
                    'editor-border': 'rgba(51, 65, 85, 0.6)',
                    'editor-section-bg': 'rgba(30, 41, 59, 0.4)',
                    'editor-section-border': 'rgba(51, 65, 85, 0.6)',
                    'editor-section-hover': 'rgba(51, 65, 85, 0.8)',
                    'editor-field-bg': 'rgba(15, 23, 42, 0.5)',
                    'editor-field-border': 'rgba(51, 65, 85, 0.8)',
                    'editor-text-primary': '#e2e8f0',
                    'editor-text-secondary': '#cbd5e1',
                    'editor-text-muted': '#94a3b8',
                    'editor-preview-bg': 'rgba(15, 23, 42, 0.5)',
                    'editor-preview-content': 'rgba(30, 41, 59, 0.4)',
                    'editor-scrollbar-track': 'rgba(15, 23, 42, 0.3)',
                    'editor-scrollbar-thumb': '#334155',
                    'editor-scrollbar-hover': '#475569',
                    'editor-item-bg': 'rgba(51, 65, 85, 0.3)',
                    'editor-item-border': 'rgba(51, 65, 85, 0.8)',
                    'editor-item-hover': 'rgba(51, 65, 85, 0.5)',
                    'editor-divider': 'rgba(71, 85, 105, 0.6)',
                    'editor-code-bg': 'rgba(51, 65, 85, 0.6)',
                    'editor-blockquote-bg': 'rgba(var(--v-theme-primary), 0.1)',
                    'editor-table-border': 'rgba(51, 65, 85, 0.6)',
                    'editor-table-header': 'rgba(var(--v-theme-primary), 0.2)',
                    'editor-table-hover': 'rgba(var(--v-theme-primary), 0.1)',
                }
            },
            light: {
                dark: false,
                colors: {
                    // Primary colors
                    primary: '#667eea',
                    secondary: '#764ba2',

                    // Background colors
                    background: '#ffffff',
                    surface: '#f8fafc',
                    'surface-variant': 'rgba(248, 250, 252, 0.8)',

                    // Text colors
                    'on-surface': '#1e293b',
                    'on-surface-variant': '#475569',
                    'on-background': '#0f172a',

                    // Custom theme colors
                    'editor-bg': 'rgba(248, 250, 252, 0.8)',
                    'editor-border': 'rgba(203, 213, 225, 0.6)',
                    'editor-section-bg': 'rgba(255, 255, 255, 0.8)',
                    'editor-section-border': 'rgba(203, 213, 225, 0.6)',
                    'editor-section-hover': 'rgba(203, 213, 225, 0.8)',
                    'editor-field-bg': 'rgba(248, 250, 252, 0.8)',
                    'editor-field-border': 'rgba(203, 213, 225, 0.8)',
                    'editor-text-primary': '#1e293b',
                    'editor-text-secondary': '#475569',
                    'editor-text-muted': '#64748b',
                    'editor-preview-bg': 'rgba(248, 250, 252, 0.8)',
                    'editor-preview-content': 'rgba(255, 255, 255, 0.9)',
                    'editor-scrollbar-track': 'rgba(248, 250, 252, 0.5)',
                    'editor-scrollbar-thumb': '#cbd5e1',
                    'editor-scrollbar-hover': '#94a3b8',
                    'editor-item-bg': 'rgba(248, 250, 252, 0.6)',
                    'editor-item-border': 'rgba(203, 213, 225, 0.8)',
                    'editor-item-hover': 'rgba(241, 245, 249, 0.8)',
                    'editor-divider': 'rgba(203, 213, 225, 0.6)',
                    'editor-code-bg': 'rgba(241, 245, 249, 0.8)',
                    'editor-blockquote-bg': 'rgba(var(--v-theme-primary), 0.05)',
                    'editor-table-border': 'rgba(203, 213, 225, 0.6)',
                    'editor-table-header': 'rgba(var(--v-theme-primary), 0.1)',
                    'editor-table-hover': 'rgba(var(--v-theme-primary), 0.02)',
                }
            }
        }
    },
    icons: {
        defaultSet: 'ph',
        sets: {
            ph: {
                component: (props) => {
                    const iconMap = {
                        'ph-eye': PhEye,
                        'ph-eye-slash': PhEyeSlash,
                        'ph-pencil-simple': PhPencilSimple,
                        'ph-check': PhCheck,
                        'ph-delete': PhTrash,
                        'ph-plus': PhPlus,
                        'ph-format-align-right': PhTextAlignRight,
                        'ph-format-align-left': PhTextAlignLeft,
                        'ph-arrow-up': PhArrowUp,
                        'ph-arrow-down': PhArrowDown,
                        'ph-content-copy': PhCopy,
                        'ph-palette': PhPalette,
                        'ph-text-t': PhTextT,
                        'ph-arrows-out-line-vertical': PhArrowsOutLineVertical,
                        'ph-globe': PhGlobe,
                        'ph-link': PhLink,
                        'ph-x': PhX,
                        'ph-arrow-counter-clockwise': PhArrowCounterClockwise,
                        'ph-arrow-clockwise': PhArrowClockwise,
                        'ph-text-b': PhTextB,
                        'ph-text-italic': PhTextItalic,
                        'ph-text-strikethrough': PhTextStrikethrough,
                        'ph-text-underline': PhTextUnderline,
                        'ph-list-bullets': PhListBullets,
                        'ph-list-numbers': PhListNumbers,
                        'ph-list': PhList,
                        'ph-brackets-curly': PhBracketsCurly,
                        'ph-upload': PhUpload,
                        'ph-file-pdf': PhFilePdf,
                        'ph-file-code': PhFileCode,
                        'ph-file-text': PhFileText,
                        'ph-lightning': PhLightning,
                        'ph-user': PhUser,
                        'ph-user-circle': PhUserCircle,
                        'ph-briefcase': PhBriefcase,
                        'ph-graduation-cap': PhGraduationCap,
                        'ph-plus-circle': PhPlusCircle,
                        'ph-translate': PhTranslate,
                        'ph-certificate': PhCertificate,
                        'ph-folder': PhFolder,
                        'ph-book-open': PhBookOpen,
                        'ph-trophy': PhTrophy,
                        'ph-heart': PhHeart,
                        'ph-star': PhStar,
                        'ph-users': PhUsers,
                        'ph-target': PhTarget,
                        'ph-medal': PhMedal,
                        'ph-game-controller': PhGameController,
                        'ph-buildings': PhBuildings,
                        'ph-lightbulb': PhLightbulb,
                        'ph-phone': PhPhone,
                        'ph-magnifying-glass-plus': PhMagnifyingGlassPlus,
                        'ph-magnifying-glass-minus': PhMagnifyingGlassMinus,
                        'ph-house': PhHouse,
                        'ph-sun': PhSun,
                        'ph-moon': PhMoon,
                        'ph-caret-up': PhCaretUp,
                        'ph-caret-down': PhCaretDown,
                        'ph-layout': PhLayout
                    }
                    const IconComponent = iconMap[props.icon]
                    return IconComponent ? h(IconComponent, { ...props, icon: undefined }) : null
                }
            }
        }
    },
})

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.mount('#app')