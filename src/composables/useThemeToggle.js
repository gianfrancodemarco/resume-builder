import { computed } from 'vue'
import { useTheme } from 'vuetify'

export const THEME_STORAGE_KEY = 'theme'

/** The theme to start with: the saved choice, else the system preference. */
export function initialTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

/** Light/dark switch, remembered in this browser. */
export function useThemeToggle() {
    const theme = useTheme()
    const isDark = computed(() => theme.global.current.value.dark)

    const toggleTheme = () => {
        const next = isDark.value ? 'light' : 'dark'
        theme.global.name.value = next
        localStorage.setItem(THEME_STORAGE_KEY, next)
    }

    return { isDark, toggleTheme }
}
