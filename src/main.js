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
import { PhEye, PhEyeSlash, PhPencilSimple, PhCheck, PhTrash, PhPlus, PhTextAlignRight, PhTextAlignLeft, PhArrowUp, PhArrowDown, PhCopy, PhPalette, PhTextT, PhArrowsOutLineVertical, PhGlobe, PhLink, PhX, PhArrowCounterClockwise, PhArrowClockwise, PhTextB, PhTextItalic, PhTextStrikethrough, PhTextUnderline, PhListBullets, PhListNumbers, PhList, PhBracketsCurly, PhUpload, PhFilePdf, PhFileCode, PhFileText, PhLightning, PhUser, PhUserCircle, PhBriefcase, PhGraduationCap, PhPlusCircle, PhTranslate, PhCertificate, PhFolder, PhBookOpen, PhTrophy, PhHeart, PhStar, PhUsers, PhTarget, PhMedal, PhGameController, PhBuildings, PhLightbulb, PhPhone, PhMagnifyingGlassPlus, PhMagnifyingGlassMinus, PhHouse } from '@phosphor-icons/vue'

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
        themes: {
            dark: {
                dark: true,
                colors: {
                    primary: '#667eea',
                    secondary: '#764ba2',
                    background: '#0a0a0a',
                    surface: '#1a1a1a',
                    'surface-variant': 'rgba(255, 255, 255, 0.05)',
                    'on-surface': 'rgba(255, 255, 255, 0.9)',
                    'on-surface-variant': 'rgba(255, 255, 255, 0.7)',
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
                        'ph-house': PhHouse
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