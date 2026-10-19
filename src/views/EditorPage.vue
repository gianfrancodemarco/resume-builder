<template>
    <div class="editor-page" :class="{ mobile: isMobile }">
        <TopBar :resume="resume" :saved="saved" :downloading="downloading" :downloaded="downloaded"
            :compact="isMobile" @home="router.push('/')"
            @download-pdf="handleDownloadPDF" @import="handleImportJSON" @export-json="handleExportJSON"
            @export-txt="handleDownloadTXT" />

        <div class="editor-body">
            <aside v-show="!isMobile || view !== 'preview'" class="editor-panel">
                <v-tabs v-if="!isMobile" v-model="panel" grow color="primary" density="comfortable" class="panel-tabs">
                    <v-tab v-for="tab in TABS" :key="tab.value" :value="tab.value" :prepend-icon="tab.icon">
                        {{ tab.title }}
                    </v-tab>
                </v-tabs>
                <div class="panel-scroll">
                    <ContentPanel v-show="panel === 'content'" :resume="resume" />
                    <DesignPanel v-if="panel === 'design'" :resume="resume" />
                    <!-- Mounted on first visit, then kept so the chat and API keys survive tab switches -->
                    <AIPanel v-if="aiOpened" v-show="panel === 'ai'" :resume="resume"
                        @update:resume="resume = $event" />
                </div>
            </aside>

            <PreviewPane v-show="!isMobile || view === 'preview'" :resume="resume" class="editor-preview" />
        </div>

        <nav v-if="isMobile" class="bottom-nav" aria-label="Editor views">
            <button v-for="tab in [...TABS, PREVIEW_TAB]" :key="tab.value" type="button"
                :class="{ active: view === tab.value }" @click="view = tab.value">
                <v-icon :icon="tab.icon" size="20" />
                <span>{{ tab.title }}</span>
            </button>
        </nav>

        <!-- Hidden file input for JSON import -->
        <input ref="fileInput" type="file" class="d-none" accept=".json,application/json" @change="handleFileUpload" />

        <v-snackbar v-model="toast.show" :color="toast.type" :timeout="3000" location="bottom right">
            <strong>{{ toast.title }}</strong>
            <div>{{ toast.message }}</div>
        </v-snackbar>
    </div>
</template>

<script setup>
import AIPanel from '@/components/EditorPage/ai/AIPanel.vue'
import ContentPanel from '@/components/EditorPage/content/ContentPanel.vue'
import DesignPanel from '@/components/EditorPage/design/DesignPanel.vue'
import PreviewPane from '@/components/EditorPage/PreviewPane.vue'
import TopBar from '@/components/EditorPage/TopBar.vue'
import '@/components/EditorPage/editor.css'
import { trackEvent as track } from '@/analytics'
import { ExporterService } from '@/services/ExporterService'
import { ResumeService } from '@/services/ResumeService'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const TABS = [
    { value: 'content', title: 'Content', icon: 'ph-note-pencil' },
    { value: 'design', title: 'Design', icon: 'ph-paint-brush' },
    { value: 'ai', title: 'AI', icon: 'ph-sparkle' },
]
const PREVIEW_TAB = { value: 'preview', title: 'Preview', icon: 'ph-eye' }

const { mobile } = useDisplay()
const router = useRouter()
const isMobile = computed(() => mobile.value)

// A JSON Resume document; design and layout live in its meta
const resume = ref(ResumeService.loadStored())

// What is shown: a panel tab, or (on mobile) the preview
const view = ref('content')
const lastPanel = ref('content')
const panel = computed({
    get: () => (view.value === 'preview' ? lastPanel.value : view.value),
    set: value => { view.value = value },
})
watch(view, value => {
    if (value !== 'preview') lastPanel.value = value
})
const aiOpened = ref(false)
watch(panel, value => {
    if (value === 'ai') aiOpened.value = true
}, { immediate: true })

const fileInput = ref(null)
const downloading = ref(false)
// Shown on the download button for a moment after a successful download
const downloaded = ref(false)
let downloadedTimer = null
const saved = ref(true)

const toast = ref({ show: false, title: '', message: '', type: 'success' })
const notify = (title, message, type = 'success') => {
    toast.value = { show: true, title, message, type }
}

// ---- Autosave ----

let autosaveTimer = null
const autosave = () => {
    try {
        ResumeService.store(resume.value)
        saved.value = true
    } catch (error) {
        // Usually a full localStorage, e.g. because of a large photo. Warn once.
        if (saved.value) {
            console.error('Error saving resume:', error)
            notify('Autosave failed', 'Your browser storage is full. Export your resume as JSON to keep your changes.', 'error')
        }
        saved.value = false
    }
}

onMounted(() => {
    autosaveTimer = setInterval(autosave, 1000)
    // Save the last edits when the tab is closed or reloaded
    window.addEventListener('beforeunload', autosave)
})

onUnmounted(() => {
    clearInterval(autosaveTimer)
    clearTimeout(downloadedTimer)
    window.removeEventListener('beforeunload', autosave)
    // ...or when leaving the editor (e.g. to the home page)
    autosave()
})

// ---- Actions ----

const handleDownloadPDF = async () => {
    track('download_pdf')
    downloading.value = true
    downloaded.value = false
    try {
        await ExporterService.exportToPDF(resume.value)
        downloaded.value = true
        clearTimeout(downloadedTimer)
        downloadedTimer = setTimeout(() => { downloaded.value = false }, 2000)
    } catch (error) {
        console.error('Error generating PDF:', error)
        notify('PDF generation failed', 'Please try again.', 'error')
    } finally {
        downloading.value = false
    }
}

const handleExportJSON = () => {
    track('export_json')
    try {
        ExporterService.download(ResumeService.exportToJSON(resume.value), ExporterService.getFilename(resume.value, 'json'))
    } catch (error) {
        console.error('Error exporting JSON:', error)
        notify('Export failed', 'Failed to export the resume as JSON.', 'error')
    }
}

const handleDownloadTXT = async () => {
    track('download_txt')
    try {
        await ExporterService.exportToTXT(resume.value)
    } catch (error) {
        console.error('Error generating TXT:', error)
        notify('Export failed', 'Failed to export the resume as text.', 'error')
    }
}

const handleImportJSON = () => {
    track('import_json')
    fileInput.value.click()
}

const handleFileUpload = async event => {
    const file = event.target.files[0]
    if (file) {
        try {
            resume.value = await ResumeService.loadFromFile(file)
            notify('Resume imported', file.name)
        } catch (error) {
            console.error('Error importing file:', error)
            notify('Import failed', error.message || 'Failed to import resume.', 'error')
        }
    }
    // Reset the input so the same file can be selected again
    event.target.value = ''
}
</script>

<style scoped>
.editor-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
    background: rgb(var(--v-theme-background));
}

.editor-body {
    display: flex;
    flex: 1;
    min-height: 0;
}

.editor-panel {
    display: flex;
    flex-direction: column;
    width: clamp(380px, 36%, 560px);
    flex-shrink: 0;
    border-right: 1px solid rgb(var(--v-theme-editor-border));
    background: rgb(var(--v-theme-background));
}

.panel-tabs {
    flex: none;
    border-bottom: 1px solid rgb(var(--v-theme-editor-border));
}

.panel-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
}

.editor-preview {
    flex: 1;
}

.mobile .editor-panel {
    width: 100%;
    border-right: none;
}

.mobile .panel-scroll {
    padding: 12px;
}

.bottom-nav {
    display: flex;
    flex-shrink: 0;
    border-top: 1px solid rgb(var(--v-theme-editor-border));
    background: rgb(var(--v-theme-surface));
    padding-bottom: env(safe-area-inset-bottom);
}

.bottom-nav button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 8px 0;
    font-size: 0.72rem;
    color: rgb(var(--v-theme-editor-text-muted));
}

.bottom-nav button.active {
    color: rgb(var(--v-theme-primary));
}
</style>
