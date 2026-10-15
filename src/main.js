import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import { registerFontFaces } from './typst/fonts'

// Vuetify imports
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Phosphor Icons
import {
    PhArrowsHorizontal,
    PhArrowsLeftRight,
    PhArticleNyTimes,
    PhBookOpen,
    PhBracketsCurly,
    PhBriefcase,
    PhCaretDown,
    PhCaretUp,
    PhCertificate,
    PhChatCircleText,
    PhCheck,
    PhClockCounterClockwise,
    PhCloudCheck,
    PhDotsSixVertical,
    PhDotsThreeVertical,
    PhDownloadSimple,
    PhEye,
    PhEyeSlash,
    PhFileArrowUp,
    PhFilePdf,
    PhFileText,
    PhFolder,
    PhGear,
    PhGraduationCap,
    PhHeart,
    PhImage,
    PhLightning,
    PhLink,
    PhListBullets,
    PhMagicWand,
    PhMicrophone,
    PhMinus,
    PhMoon,
    PhNotePencil,
    PhPaintBrush,
    PhPaperPlaneRight,
    PhPencilSimple,
    PhPhone,
    PhPlus,
    PhSparkle,
    PhStar,
    PhStop,
    PhSun,
    PhTextB,
    PhTextItalic,
    PhTranslate,
    PhTrash,
    PhTrophy,
    PhUploadSimple,
    PhUser,
    PhUsers,
    PhWarningCircle,
    PhX,
} from '@phosphor-icons/vue'

// Icons used as icon="ph-…" in the app
const PHOSPHOR_ICONS = {
    'ph-arrows-horizontal': PhArrowsHorizontal,
    'ph-arrows-left-right': PhArrowsLeftRight,
    'ph-article-nytimes': PhArticleNyTimes,
    'ph-book-open': PhBookOpen,
    'ph-brackets-curly': PhBracketsCurly,
    'ph-briefcase': PhBriefcase,
    'ph-caret-down': PhCaretDown,
    'ph-caret-up': PhCaretUp,
    'ph-certificate': PhCertificate,
    'ph-chat-circle-text': PhChatCircleText,
    'ph-check': PhCheck,
    'ph-clock-counter-clockwise': PhClockCounterClockwise,
    'ph-cloud-check': PhCloudCheck,
    'ph-dots-six-vertical': PhDotsSixVertical,
    'ph-dots-three-vertical': PhDotsThreeVertical,
    'ph-download-simple': PhDownloadSimple,
    'ph-eye': PhEye,
    'ph-eye-slash': PhEyeSlash,
    'ph-file-arrow-up': PhFileArrowUp,
    'ph-file-pdf': PhFilePdf,
    'ph-file-text': PhFileText,
    'ph-folder': PhFolder,
    'ph-gear': PhGear,
    'ph-graduation-cap': PhGraduationCap,
    'ph-heart': PhHeart,
    'ph-image': PhImage,
    'ph-lightning': PhLightning,
    'ph-link': PhLink,
    'ph-list-bullets': PhListBullets,
    'ph-magic-wand': PhMagicWand,
    'ph-microphone': PhMicrophone,
    'ph-minus': PhMinus,
    'ph-moon': PhMoon,
    'ph-note-pencil': PhNotePencil,
    'ph-paint-brush': PhPaintBrush,
    'ph-paper-plane-right': PhPaperPlaneRight,
    'ph-pencil-simple': PhPencilSimple,
    'ph-phone': PhPhone,
    'ph-plus': PhPlus,
    'ph-sparkle': PhSparkle,
    'ph-star': PhStar,
    'ph-stop': PhStop,
    'ph-sun': PhSun,
    'ph-text-b': PhTextB,
    'ph-text-italic': PhTextItalic,
    'ph-translate': PhTranslate,
    'ph-trash': PhTrash,
    'ph-trophy': PhTrophy,
    'ph-upload-simple': PhUploadSimple,
    'ph-user': PhUser,
    'ph-users': PhUsers,
    'ph-warning-circle': PhWarningCircle,
    'ph-x': PhX,
}
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
                component: props => {
                    const IconComponent = PHOSPHOR_ICONS[props.icon]
                    return IconComponent ? h(IconComponent, { ...props, icon: undefined }) : null
                }
            }
        }
    },
})

registerFontFaces()

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.mount('#app')