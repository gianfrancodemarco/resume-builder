<template>
    <header class="top-bar">
        <v-btn variant="text" class="brand" :icon="compact" aria-label="Home" @click="emit('home')">
            <v-icon icon="ph-file-text" />
            <span v-if="!compact" class="ml-2">Resume Builder</span>
        </v-btn>

        <div class="doc-info">
            <span class="doc-title">{{ title }}</span>
            <span class="save-state" :class="{ error: !saved }">
                <v-icon :icon="saved ? 'ph-cloud-check' : 'ph-warning-circle'" size="x-small" class="mr-1" />
                {{ saved ? 'Saved in this browser' : 'Not saved' }}
            </span>
        </div>

        <v-spacer />

        <v-btn color="primary" variant="flat" prepend-icon="ph-download-simple" :loading="downloading"
            @click="emit('download-pdf')">
            {{ compact ? 'PDF' : 'Download PDF' }}
        </v-btn>

        <v-menu location="bottom end">
            <template v-slot:activator="{ props: menuProps }">
                <v-btn v-bind="menuProps" icon="ph-dots-three-vertical" variant="text" aria-label="More actions" />
            </template>
            <v-list density="compact" min-width="220">
                <v-list-item prepend-icon="ph-upload-simple" title="Import JSON Resume" @click="emit('import')" />
                <v-list-item prepend-icon="ph-brackets-curly" title="Export JSON Resume" @click="emit('export-json')" />
                <v-list-item prepend-icon="ph-article-nytimes" title="Export plain text" @click="emit('export-txt')" />
                <v-divider class="my-1" />
                <v-list-item :prepend-icon="isDark ? 'ph-sun' : 'ph-moon'"
                    :title="isDark ? 'Light theme' : 'Dark theme'" @click="toggleTheme" />
            </v-list>
        </v-menu>
    </header>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const props = defineProps({
    resume: { type: Object, required: true },
    saved: { type: Boolean, default: true },
    downloading: { type: Boolean, default: false },
    compact: { type: Boolean, default: false },
})

const emit = defineEmits(['home', 'download-pdf', 'import', 'export-json', 'export-txt'])

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

const toggleTheme = () => {
    const next = isDark.value ? 'light' : 'dark'
    theme.global.name.value = next
    localStorage.setItem('theme', next)
}

const title = computed(() => {
    const { name, label } = props.resume.basics || {}
    return [name, label].filter(Boolean).join(' · ') || 'Untitled resume'
})
</script>

<style scoped>
.top-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 56px;
    padding: 0 12px;
    border-bottom: 1px solid rgb(var(--v-theme-editor-border));
    background: rgb(var(--v-theme-surface));
}

.brand {
    font-weight: 600;
}

.doc-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    margin-left: 8px;
    line-height: 1.2;
}

.doc-title {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.save-state {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    opacity: 0.65;
}

.save-state.error {
    color: rgb(var(--v-theme-error));
    opacity: 1;
}
</style>
