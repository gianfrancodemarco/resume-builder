import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import { registerFontFaces } from './typst/fonts'
import { initialTheme } from './composables/useThemeToggle'

// Vuetify imports
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
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
    PhGithubLogo,
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
    'ph-github-logo': PhGithubLogo,
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

// Editor tokens on top of Vuetify's: borders, field and item backgrounds,
// secondary text, and the backdrop behind the resume preview
const THEMES = {
    dark: {
        dark: true,
        colors: {
            primary: '#8B9AFF',
            'on-primary': '#0E1117',
            secondary: '#B39DFF',
            success: '#3FB950',
            'on-success': '#0E1117',
            background: '#0E1117',
            surface: '#161B22',
            'on-background': '#E6EDF3',
            'on-surface': '#E6EDF3',
            'editor-border': '#2B3440',
            'editor-field-bg': '#0F141A',
            'editor-item-bg': '#1A2029',
            'editor-item-hover': '#212935',
            'editor-text-secondary': '#B1BAC4',
            'editor-text-muted': '#7D8590',
            'editor-preview-bg': '#0A0D12',
        },
    },
    light: {
        dark: false,
        colors: {
            primary: '#4C5BD4',
            secondary: '#7B5BD6',
            success: '#1A7F37',
            'on-success': '#FFFFFF',
            background: '#F4F5F8',
            surface: '#FFFFFF',
            'on-background': '#1F2328',
            'on-surface': '#1F2328',
            'editor-border': '#DDE1E7',
            'editor-field-bg': '#FFFFFF',
            'editor-item-bg': '#F8F9FB',
            'editor-item-hover': '#EEF0F4',
            'editor-text-secondary': '#4B5563',
            'editor-text-muted': '#6B7280',
            'editor-preview-bg': '#E6E9EF',
        },
    },
}

// One look for every form field
const FIELD_DEFAULTS = { variant: 'outlined', density: 'compact', color: 'primary', rounded: 'lg' }

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: initialTheme(),
        themes: THEMES,
    },
    // Phone layout below 960px; Vuetify's default (1280px) would hit many laptops
    display: { mobileBreakpoint: 'md' },
    defaults: {
        VTextField: FIELD_DEFAULTS,
        VSelect: FIELD_DEFAULTS,
        VAutocomplete: FIELD_DEFAULTS,
        VFileInput: FIELD_DEFAULTS,
        VTextarea: FIELD_DEFAULTS,
        VCheckbox: { color: 'primary' },
    },
    icons: {
        defaultSet: 'ph',
        // Vuetify's own icons (checkbox, dropdown arrow, close…) come from MDI
        aliases,
        sets: {
            mdi,
            ph: {
                component: props => {
                    const IconComponent = PHOSPHOR_ICONS[props.icon]
                    return IconComponent ? h(IconComponent, { ...props, icon: undefined }) : h(mdi.component, props)
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

// Fade out the loading screen from index.html, keeping it at least briefly
// so it does not just flicker on fast loads
const SPLASH_MIN_MS = 500
const splash = document.getElementById('splash')
if (splash) {
    setTimeout(() => {
        splash.classList.add('hidden')
        setTimeout(() => splash.remove(), 400)
    }, Math.max(0, SPLASH_MIN_MS - performance.now()))
}