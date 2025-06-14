import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
        deps: {
            inline: [/vuetify/]
        },
        css: {
            modules: {
                classNameStrategy: 'non-scoped'
            }
        }
    }
}) 