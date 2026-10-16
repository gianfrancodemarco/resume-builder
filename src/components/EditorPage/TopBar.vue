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
                {{ saved ? (compact ? 'Saved' : 'Saved in this browser') : 'Not saved' }}
            </span>
        </div>

        <v-spacer />

        <v-btn :href="REPOSITORY_URL" target="_blank" rel="noopener" variant="text" :icon="compact"
            class="star" aria-label="Star this project on GitHub" title="Star this project on GitHub">
            <v-icon icon="ph-github-logo" />
            <template v-if="!compact">
                <span class="ml-2">Star</span>
                <v-icon icon="ph-star" size="14" class="ml-1 star-icon" />
            </template>
        </v-btn>

        <!-- Split button: PDF, plus the other formats in the menu -->
        <div class="download" :class="{ done: downloaded }">
            <v-tooltip text="Download PDF (Ctrl+P / ⌘P)" location="bottom">
                <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn v-bind="tooltipProps" color="primary" variant="flat" class="download-main" :aria-busy="downloading"
                        :prepend-icon="downloading ? undefined : downloaded ? 'ph-check' : 'ph-download-simple'"
                        @click="!downloading && emit('download-pdf')">
                        <v-progress-circular v-if="downloading" indeterminate size="16" width="2" class="mr-2" />
                        {{ downloadLabel }}
                    </v-btn>
                </template>
            </v-tooltip>
            <v-menu location="bottom end">
                <template v-slot:activator="{ props: menuProps }">
                    <v-btn v-bind="menuProps" color="primary" variant="flat" class="download-more"
                        aria-label="Other download formats">
                        <v-icon icon="ph-caret-down" size="16" />
                    </v-btn>
                </template>
                <v-list density="compact" min-width="280" lines="two">
                    <v-list-subheader>Download as</v-list-subheader>
                    <v-list-item prepend-icon="ph-file-pdf" title="PDF" subtitle="Ready to send or print"
                        @click="emit('download-pdf')" />
                    <v-list-item prepend-icon="ph-brackets-curly" title="JSON Resume"
                        subtitle="Edit it later here or in any JSON Resume tool" @click="emit('export-json')" />
                    <v-list-item prepend-icon="ph-article-nytimes" title="Plain text"
                        subtitle="For pasting into application forms" @click="emit('export-txt')" />
                </v-list>
            </v-menu>
        </div>

        <v-menu location="bottom end">
            <template v-slot:activator="{ props: menuProps }">
                <v-btn v-bind="menuProps" icon="ph-dots-three-vertical" variant="text" aria-label="More actions" />
            </template>
            <v-list density="compact" min-width="220">
                <v-list-item prepend-icon="ph-upload-simple" title="Import JSON Resume" @click="emit('import')" />
                <v-divider class="my-1" />
                <v-list-item :prepend-icon="isDark ? 'ph-sun' : 'ph-moon'"
                    :title="isDark ? 'Light theme' : 'Dark theme'" @click="toggleTheme" />
            </v-list>
        </v-menu>
    </header>
</template>

<script setup>
import { useThemeToggle } from '@/composables/useThemeToggle'
import { computed } from 'vue'

const props = defineProps({
    resume: { type: Object, required: true },
    saved: { type: Boolean, default: true },
    downloading: { type: Boolean, default: false },
    // Briefly true after a successful download, to confirm it
    downloaded: { type: Boolean, default: false },
    compact: { type: Boolean, default: false },
})

const emit = defineEmits(['home', 'download-pdf', 'import', 'export-json', 'export-txt'])

const REPOSITORY_URL = 'https://github.com/gianfrancodemarco/resume-builder'

const { isDark, toggleTheme } = useThemeToggle()

const downloadLabel = computed(() => {
    if (props.downloading) return props.compact ? '' : 'Preparing…'
    if (props.downloaded) return props.compact ? '' : 'Downloaded'
    return props.compact ? 'PDF' : 'Download PDF'
})

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
    white-space: nowrap;
    font-size: 0.75rem;
    opacity: 0.65;
}

.star-icon {
    color: #E3B341;
}

.download {
    display: flex;
}

.download-main {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
    min-width: 0;
    transition: background-color 0.2s;
}

.download-more {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
    min-width: 0;
    padding: 0 10px;
    margin-left: 1px;
}

/* Confirmation after a download */
.download.done .download-main {
    background-color: rgb(var(--v-theme-success)) !important;
    color: rgb(var(--v-theme-on-success)) !important;
}

.save-state.error {
    color: rgb(var(--v-theme-error));
    opacity: 1;
}
</style>
