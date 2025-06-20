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
import { PhEye, PhEyeSlash, PhPencilSimple, PhCheck, PhTrash, PhPlus, PhTextAlignRight, PhTextAlignLeft, PhArrowUp, PhArrowDown, PhCopy, PhPalette, PhTextT, PhArrowsOutLineVertical, PhGlobe, PhLink, PhX, PhArrowCounterClockwise, PhArrowClockwise, PhTextB, PhTextItalic, PhTextStrikethrough, PhTextUnderline, PhListBullets, PhListNumbers, PhList, PhBracketsCurly, PhUpload, PhFilePdf, PhFileCode, PhFileText, PhLightning, PhUser } from '@phosphor-icons/vue'

const vuetify = createVuetify({
    components,
    directives,
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
                        'ph-user': PhUser
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