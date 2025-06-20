<template>
    <v-app>
        <v-main>
            <div class="editor-content" :class="{ 'mobile-view': isMobile }">
                <!-- Tab switching lateral bar -->
                <div class="tab-switcher">
                    <v-tooltip location="right" open-on-hover>
                        <template v-slot:activator="{ props: tooltipProps }">
                            <v-btn v-bind="tooltipProps" icon="ph-user"
                                :color="activeTab === 'info' ? 'primary' : 'grey'" variant="text" class="tab-btn"
                                @click="activeTab = 'info'" :class="{ 'active': activeTab === 'info' }" />
                        </template>
                        Info
                    </v-tooltip>
                    <v-tooltip location="right" open-on-hover>
                        <template v-slot:activator="{ props: tooltipProps }">
                            <v-btn v-bind="tooltipProps" icon="ph-palette"
                                :color="activeTab === 'style' ? 'primary' : 'grey'" variant="text" class="tab-btn"
                                @click="activeTab = 'style'" :class="{ 'active': activeTab === 'style' }" />
                        </template>
                        Style
                    </v-tooltip>
                </div>

                <div class="editor-col" :style="isMobile ? { width: '100%' } : { width: '30%' }">
                    <ResumeEditor v-model:resume-data="resumeData" v-model:style="resumeStyle"
                        v-model:active-tab="activeTab" @save="handleFormSave" @change="handleFormChange"
                        :is-mobile="isMobile" />
                </div>
                <div class="preview-col" :class="{ 'hidden': isMobile }" :style="!isMobile ? { width: '70%' } : {}">
                    <div class="preview-container">
                        <div class="preview-header"></div>
                        <ResumePreview :resume-data="resumeData" :style="resumeStyle"
                            :sidebar-position="resumeStyle.spacing.sidebarLeft ? 'left' : 'right'" />
                    </div>
                </div>
            </div>
        </v-main>

        <!-- Hidden file input for JSON import -->
        <input type="file" ref="fileInput" style="display: none" accept=".json" @change="handleFileUpload" />

        <!-- Collapsible Menu - show on both mobile and desktop -->
        <CollapsibleMenu :handleExportJSON="handleExportJSON" :handleImportJSON="handleImportJSON"
            :handleDownloadPDF="handleDownloadPDF" :handleDownloadHTML="handleDownloadHTML"
            :handleConvertCV="handleConvertCVButtonClick" />

        <!-- Convert CV Dialog -->
        <ConvertCVDialog :dialog="showConvertDialog" :models="availableModels" :loading="isConverting"
            :handleConvert="handleConvert" @close="showConvertDialog = false" />

        <v-alert v-model="alertMessage.show" :type="alertMessage.type" :title="alertMessage.title"
            :text="alertMessage.message" closable @click:close="hideAlert" class="alert-message" timeout="3000" />
    </v-app>
</template>

<script setup>
import CollapsibleMenu from '@/components/EditorPage/CollapsibleMenu.vue'
import ConvertCVDialog from '@/components/EditorPage/ConvertCVDialog.vue'
import ResumeEditor from '@/components/EditorPage/ResumeEditor.vue'
import ResumePreview from '@/components/EditorPage/ResumePreview.vue'
import { CVConversionService } from '@/services/CVConversionService'
import { ExporterService } from '@/services/ExporterService'
import { ResumeData, ResumeService, ResumeStyleClass } from '@/services/ResumeService'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

// Replace the resumeData ref with the ResumeData factory
const resumeData = ref(ResumeData.createDefault())

// Initialize the style with the class instance
const resumeStyle = ref(ResumeStyleClass.createDefault())

// Active Tab State
const activeTab = ref('info')

const fileInput = ref(null)
const hasUnsavedChanges = ref(false)

const isMobile = computed(() => mobile.value)
const alertMessage = ref({
    show: false,
    title: '',
    message: '',
    type: 'success'
})

const showAlert = (title, message, type = 'success') => {
    alertMessage.value = {
        show: true,
        title,
        message,
        type
    }
    setTimeout(() => {
        hideAlert()
    }, 3000)
}

const hideAlert = () => {
    alertMessage.value.show = false
}

// Add event listener for page unload
onMounted(async () => {
    // Load available models
    await loadAvailableModels()

    window.addEventListener('beforeunload', handleBeforeUnload)

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
            showAlert('Import Successful', 'Your resume has been imported successfully.', 'success')
        } catch (error) {
            console.error('Error importing file:', error)
            showAlert('Import Failed', error.message || 'Failed to import resume.', 'error')
        }
    }
    // Reset the input so the same file can be selected again
    event.target.value = ''
}

const handleExportJSON = () => {
    if (window.sa_event) {
        window.sa_event('export_json')
    }
    try {
        exportJSON()
        showAlert('Export Successful', 'Your resume has been exported as JSON.', 'success')
    } catch (error) {
        console.error('Error exporting JSON:', error)
        showAlert('Export Failed', 'Failed to export resume as JSON.', 'error')
    }
}

const handleImportJSON = () => {
    if (window.sa_event) {
        window.sa_event('import_json')
    }
    importJSON()
}

const handleDownloadPDF = async () => {
    if (window.sa_event) {
        window.sa_event('download_pdf')
    }
    try {
        await downloadPDF()
        showAlert('PDF Generated', 'Your resume has been generated as PDF.', 'success')
    } catch (error) {
        console.error('Error generating PDF:', error)
        showAlert('PDF Generation Failed', 'Failed to generate PDF. Please try again.', 'error')
    }
}

const handleDownloadHTML = async () => {
    if (window.sa_event) {
        window.sa_event('download_html')
    }
    try {
        await downloadHTML()
        showAlert('HTML Generated', 'Your resume has been generated as HTML.', 'success')
    } catch (error) {
        console.error('Error generating HTML:', error)
        showAlert('HTML Generation Failed', 'Failed to generate HTML. Please try again.', 'error')
    }
}

// Convert CV Dialog State
const showConvertDialog = ref(false)
const availableModels = ref([])
const isConverting = ref(false)

const loadAvailableModels = async () => {
    try {
        availableModels.value = await CVConversionService.fetchAvailableModels()
    } catch (error) {
        console.error('Error fetching models:', error)
        availableModels.value = []
    }
}

const handleConvertCVButtonClick = () => {
    if (window.sa_event) {
        window.sa_event('convert_cv_button_click')
    }
    showConvertDialog.value = true
}

const handleConvert = async ({ file, apiKey, model }) => {
    if (window.sa_event) {
        window.sa_event('convert_cv')
    }
    isConverting.value = true
    try {
        const newResumeData = await CVConversionService.convertCV(file, apiKey, model)
        resumeData.value = newResumeData
        showAlert('CV successfully converted!', 'Your CV has been successfully converted.', 'success')
        showConvertDialog.value = false
    } catch (error) {
        showAlert('Error converting CV', error, 'error')
    } finally {
        isConverting.value = false
    }
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

.alert-message {
    position: fixed;
    top: 24px;
    right: 50%;
    transform: translateX(50%);
    z-index: 1000;
    min-width: 500px;
    max-width: 800px;
}

.tab-switcher {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: #fff;
    border-right: 1px solid rgba(0, 0, 0, 0.06);
    padding: 12px 8px;
    width: 56px;
    flex-shrink: 0;
    align-items: center;
    justify-content: flex-start;
    padding-top: 20px;
}

.tab-btn {
    width: 40px !important;
    height: 40px !important;
    border-radius: 6px !important;
    transition: all 0.2s ease;
    cursor: pointer !important;
}

.tab-btn.active {
    background-color: rgba(var(--v-theme-primary), 0.1) !important;
    color: rgb(var(--v-theme-primary)) !important;
}

.tab-btn:hover {
    background-color: rgba(var(--v-theme-primary), 0.05) !important;
}
</style>
