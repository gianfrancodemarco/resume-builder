<template>
    <v-app>
        <v-main>
            <div class="editor-content" :class="{ 'mobile-view': isMobile }">
                <div class="editor-col" :style="isMobile ? { width: '100%' } : { width: `${editorWidth}%` }">
                    <ResumeEditor v-model:resume-data="resumeData" v-model:style="resumeStyle" @save="handleFormSave"
                        @change="handleFormChange" :is-mobile="isMobile" @preview="toggleActions" />
                </div>
                <div v-if="!isMobile" class="resize-handle" @mousedown.prevent="startResize"
                    @touchstart.prevent="startResize" @touchmove.prevent="handleResize" @touchend.prevent="stopResize">
                </div>
                <div class="preview-col" :class="{ 'hidden': isMobile }"
                    :style="!isMobile ? { width: `${100 - editorWidth}%` } : {}">
                    <div class="preview-container">
                        <div class="preview-header"></div>
                        <ResumePreview :resume-data="resumeData" :style="resumeStyle"
                            :sidebar-position="resumeStyle.spacing.sidebarLeft ? 'left' : 'right'" />
                    </div>
                </div>
            </div>
        </v-main>

        <!-- Mobile action buttons -->
        <div v-if="isMobile" class="mobile-actions">
            <div v-if="showActions" class="action-buttons">
                <div class="action-item">
                    <span class="action-label">Close this menu</span>
                    <v-btn icon="mdi-close" color="white" class="action-btn" elevation="2" @click="toggleActions" />
                </div>
                <div class="action-item">
                    <span class="action-label">Export JSON</span>
                    <v-btn icon="mdi-code-json" color="primary" @click="handleExportJSON" class="action-btn"
                        elevation="2" />
                </div>
                <div class="action-item">
                    <span class="action-label">Import JSON</span>
                    <v-btn icon="mdi-upload" color="primary" @click="handleImportJSON" class="action-btn"
                        elevation="2" />
                </div>
                <div class="action-item">
                    <span class="action-label">Download PDF</span>
                    <v-btn icon="mdi-file-pdf-box" color="primary" @click="handleDownloadPDF" class="action-btn"
                        elevation="2" />
                </div>
                <div class="action-item">
                    <span class="action-label">Download HTML</span>
                    <v-btn icon="mdi-file-code" color="primary" @click="handleDownloadHTML" class="action-btn"
                        elevation="2" />
                </div>
            </div>
            <v-btn icon="mdi-lightning-bolt" color="primary" class="action-btn" elevation="2" @click="toggleActions" />
        </div>

        <!-- Mobile overlay -->
        <div v-if="isMobile && showActions" class="mobile-overlay" @click="toggleActions"></div>

        <!-- Hidden file input for JSON import -->
        <input type="file" ref="fileInput" style="display: none" accept=".json" @change="handleFileUpload" />

        <!-- Desktop Collapsible Menu -->
        <CollapsibleMenu v-if="!isMobile" :handleExportJSON="handleExportJSON" :handleImportJSON="handleImportJSON"
            :handleDownloadPDF="handleDownloadPDF" :handleDownloadHTML="handleDownloadHTML" />
    </v-app>
</template>

<script setup>
import ResumeEditor from '@/components/EditorPage/ResumeEditor.vue'
import ResumePreview from '@/components/EditorPage/ResumePreview.vue'
import CollapsibleMenu from '@/components/EditorPage/CollapsibleMenu.vue'
import { ExporterService } from '@/services/ExporterService'
import { ResumeData, ResumeService, ResumeStyleClass } from '@/services/ResumeService'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const router = useRouter()
const { mobile } = useDisplay()

// Replace the resumeData ref with the ResumeData factory
const resumeData = ref(ResumeData.createDefault())

// Initialize the style with the class instance
const resumeStyle = ref(ResumeStyleClass.createDefault())

const fileInput = ref(null)

// Add drawer ref for mobile menu
const drawer = ref(false)

const showActions = ref(false)
const hasUnsavedChanges = ref(false)
const editorWidth = ref(35)
const editorHeight = ref(50)
const isResizing = ref(false)

const isMobile = computed(() => mobile.value)

// Add event listener for page unload
onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('mousemove', handleResize)
    window.addEventListener('touchmove', handleResize)
    window.addEventListener('mouseup', stopResize)
    window.addEventListener('touchend', stopResize)

    // Set initial scale to 75%
    const printableArea = document.getElementById('printable-area')
    if (printableArea) {
        printableArea.style.transform = 'scale(0.75)'
        printableArea.style.transformOrigin = 'center top'
        printableArea.style.margin = '0 auto'
    }
})

// Remove event listener when component is destroyed
onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
    window.removeEventListener('mousemove', handleResize)
    window.removeEventListener('touchmove', handleResize)
    window.removeEventListener('mouseup', stopResize)
    window.removeEventListener('touchend', stopResize)
})

// Handle beforeunload event
const handleBeforeUnload = (e) => {
    if (hasUnsavedChanges.value) {
        e.preventDefault()
        e.returnValue = ''
        return ''
    }
}

// Handle form changes
const handleFormChange = () => {
    hasUnsavedChanges.value = true
}

// Handle form save
const handleFormSave = () => {
    hasUnsavedChanges.value = false
}

const downloadPDF = async () => {
    await ExporterService.exportToPDF(resumeData.value, resumeStyle.value)
}

const downloadHTML = async () => {
    await ExporterService.exportToHTML(resumeData.value)
}

const exportJSON = () => {
    const blob = ResumeService.exportToJSON(resumeData.value, resumeStyle.value)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = ExporterService.getFilename(resumeData.value, 'json')
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
}

const importJSON = () => {
    fileInput.value.click()
}

const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
        try {
            const { resumeData: newResumeData, resumeStyle: newResumeStyle } = await ResumeService.loadFromFile(file)
            resumeData.value = newResumeData
            resumeStyle.value = newResumeStyle
        } catch (error) {
            alert(error.message)
        }
    }
    // Reset the input so the same file can be selected again
    event.target.value = ''
}

const toggleActions = () => {
    showActions.value = !showActions.value
}

const handleExportJSON = () => {
    drawer.value = false
    if (window.sa_event) {
        window.sa_event('export_json')
    }
    exportJSON()
}

const handleImportJSON = () => {
    drawer.value = false
    if (window.sa_event) {
        window.sa_event('import_json')
    }
    importJSON()
}

const handleDownloadPDF = () => {
    drawer.value = false
    if (window.sa_event) {
        window.sa_event('download_pdf')
    }
    downloadPDF()
}

const handleDownloadHTML = () => {
    drawer.value = false
    if (window.sa_event) {
        window.sa_event('download_html')
    }
    downloadHTML()
}

// Resize handlers
const startResize = (e) => {
    isResizing.value = true
    e.preventDefault()
}

const handleResize = (e) => {
    if (!isResizing.value) return

    const container = document.querySelector('.editor-content')
    if (!container) return

    // Calculate scale based on editor width - inverse relationship
    const printableArea = document.getElementById('printable-area')
    if (printableArea) {
        const scale = 0.75 * (1 - (editorWidth.value - 35) / 100) // Decrease scale as editor width increases
        printableArea.style.transform = `scale(${Math.max(0.35, scale)})`
        printableArea.style.transformOrigin = 'center top'
    }

    if (isMobile.value) {
        // Handle vertical resize for mobile
        const containerRect = container.getBoundingClientRect()
        const clientY = e.clientY || (e.touches && e.touches[0].clientY)

        if (clientY) {
            const newHeight = ((clientY - containerRect.top) / containerRect.height) * 100
            editorHeight.value = Math.min(Math.max(newHeight, 20), 80) // Limit between 20% and 80%
        }
    } else {
        // Handle horizontal resize for desktop
        const containerRect = container.getBoundingClientRect()
        const clientX = e.clientX || (e.touches && e.touches[0].clientX)

        if (clientX) {
            const newWidth = ((clientX - containerRect.left) / containerRect.width) * 100
            editorWidth.value = Math.max(35, Math.min(newWidth, 50)) // Minimum 35%, maximum 60%
        }
    }
}

const stopResize = () => {
    isResizing.value = false
}
</script>

<style scoped>
.editor-page {
    min-height: 100vh;
}

:deep(.v-navigation-drawer__scrim) {
    display: none !important;
}

.editor-content {
    display: flex;
    position: relative;
    overflow: hidden;
    background-color: #f5f5f5;
    height: 100vh;
}

.editor-col {
    transition: all 0.2s ease;
    flex-shrink: 0;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.preview-col {
    position: relative;
    height: 100%;
    overflow: auto;
    transition: width 0.2s ease;
}

.preview-col.hidden {
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    width: 0;
    height: 0;
    overflow: hidden;
}

.resize-handle {
    width: 8px;
    background: transparent;
    cursor: col-resize;
    position: relative;
    z-index: 10;
    flex-shrink: 0;
    touch-action: none;
    transition: background-color 0.2s ease;
}

.resize-handle:hover,
.resize-handle:active {
    background: rgba(0, 0, 0, 0.05);
}

.resize-handle::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 24px;
    background: rgba(0, 0, 0, 0.1);

}

.download-buttons {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    gap: 8px;
    z-index: 100;
}

.download-btn {
    transition: all 0.2s ease;
    background: #0f2027 !important;
    color: white !important;
    box-shadow: 0 2px 8px rgba(15, 32, 39, 0.1) !important;
}

.download-btn:hover {
    transform: translateY(-2px);
    background: #1a2c35 !important;
    box-shadow: 0 4px 12px rgba(15, 32, 39, 0.15) !important;
}

.gradient-navbar {
    background: linear-gradient(135deg, #0f2027 0%, #2c5364 100%) !important;
    box-shadow: 0 2px 8px rgba(44, 83, 100, 0.08);
    border-bottom: none !important;
    min-height: 48px !important;
    height: 56px !important;
    padding: 0 24px !important;
    display: flex;
    align-items: center;
}

.custom-navbar {
    color: #fff !important;
    font-size: 1.1rem;
    font-family: 'Oswald', sans-serif;
    letter-spacing: 0.5px;
}

.navbar-title {
    margin: 0;
    padding: 0;
    font-size: 1.4rem;
    font-weight: 600;
    color: #fff !important;
    display: flex;
    align-items: center;
    height: 100%;
}

:deep(.v-app-bar) {
    box-shadow: none !important;
    border-bottom: none !important;
    min-height: 48px !important;
    height: 56px !important;
    padding: 0 !important;
    backdrop-filter: none !important;
    opacity: 1 !important;
}

:deep(.v-navigation-drawer) {
    background-color: #fff !important;
    border-right: 1px solid rgba(0, 0, 0, 0.06);
}

:deep(.v-list-item) {
    min-height: 44px;
    border-radius: 6px;
    margin: 2px 8px;
    transition: all 0.2s ease;
}

:deep(.v-list-item:hover) {
    background-color: rgba(var(--v-theme-primary), 0.04);
}

:deep(.v-list-item-title) {
    font-size: 0.9rem;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.8);
}

:deep(.v-icon) {
    font-size: 1.2rem;
    opacity: 0.8;
}

@media (max-width: 960px) {
    .editor-content {
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
    }

    .editor-col {
        width: 100% !important;
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .preview-col {
        width: 100% !important;
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .resize-handle {
        width: 100%;
        height: 8px;
        cursor: row-resize;
    }

    .resize-handle::after {
        width: 24px;
        height: 2px;
    }
}

@media (max-width: 600px) {
    .editor-content {
        height: 100vh;
        overflow: hidden;
    }

    .editor-col {
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .navbar-title {
        font-size: 1.2rem;
    }

    .download-buttons {
        bottom: 16px;
        right: 16px;
    }

    .download-btn {
        width: 40px;
        height: 40px;
    }
}

.desktop-actions {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    gap: 8px;
    z-index: 100;
}

.desktop-btn {
    background: linear-gradient(135deg, #0f2027 0%, #2c5364 100%) !important;
    color: white !important;
}

.desktop-btn:hover {
    background: linear-gradient(135deg, #1a2c35 0%, #3c6374 100%) !important;
    transform: translateY(-2px);
}

.mobile-actions {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
    z-index: 100;
}

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-end;
}

.action-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.action-label {
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    white-space: nowrap;
}

.action-btn {
    width: 48px !important;
    height: 48px !important;
    transition: all 0.2s ease;
}

.action-btn:hover {
    transform: translateY(-2px);
}

.actions-btn {
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 99;
}

.preview-container {
    position: relative;
    height: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.preview-header {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
}

.preview-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
}

.preview-actions .action-btn {
    width: auto;
    min-width: 150px;
    justify-content: center;
    text-transform: none;
    letter-spacing: 0.2px;
    font-weight: 500;
    font-size: 0.8rem;
    height: 36px;
}
</style>
