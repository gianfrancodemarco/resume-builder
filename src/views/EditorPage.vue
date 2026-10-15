<template>
    <v-app>
        <v-main>
            <div class="editor-content" :class="{ 'mobile-view': isMobile }">
                <!-- Lateral Menu -->

                <LateralMenu v-model:active-tab="activeTab" :sections="settingsOf(resume).sections"
                    :handleShowAll="handleShowAllTooltips" :handleShowTooltipsStart="handleShowTooltipsStart"
                    :handleShowTooltipsEnd="handleShowTooltipsEnd" :handleZoomIn="handleZoomIn"
                    :handleZoomOut="handleZoomOut" :handleExportJSON="handleExportJSON"
                    :handleImportJSON="handleImportJSON" :handleDownloadPDF="handleDownloadPDF"
                    :handleDownloadHTML="handleDownloadHTML" :handleDownloadTXT="handleDownloadTXT"
                    :handleHome="handleHome" @scroll-to-section="handleScrollToSection"
                    @update:active-tab="activeTab = $event" />

                <div class="editor-col" :style="isMobile ? { width: '100%' } : { width: '35%' }">
                    <ResumeEditor v-model:resume="resume" v-model:active-tab="activeTab"
                        :is-mobile="isMobile" />
                </div>
                <div class="preview-col" :class="{ 'hidden': isMobile }" :style="!isMobile ? { width: '65%' } : {}">
                    <div class="preview-container"
                        :style="{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }">
                        <ResumePreview :resume="resume" />
                    </div>
                </div>
            </div>
        </v-main>

        <!-- Hidden file input for JSON import -->
        <input type="file" ref="fileInput" style="display: none" accept=".json" @change="handleFileUpload" />

        <v-alert v-model="alertMessage.show" :type="alertMessage.type" :title="alertMessage.title"
            :text="alertMessage.message" closable @click:close="hideAlert" class="alert-message" timeout="3000" />
    </v-app>
</template>

<script setup>
import LateralMenu from '@/components/EditorPage/LateralMenu.vue'
import ResumeEditor from '@/components/EditorPage/ResumeEditor.vue'
import ResumePreview from '@/components/EditorPage/ResumePreview.vue'
import { ExporterService } from '@/services/ExporterService'
import { settingsOf } from '@/resume/resume'
import { ResumeService } from '@/services/ResumeService'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const router = useRouter()

// A JSON Resume document; template, style and layout live in its meta
const resume = ref(ResumeService.loadStored())

// Active Tab State
const activeTab = ref('info')

// Zoom and tooltip state
const zoomLevel = ref(100)

const fileInput = ref(null)

const isMobile = computed(() => mobile.value)
const alertMessage = ref({
    show: false,
    title: '',
    message: '',
    type: 'success'
})

let alertTimer = null
const showAlert = (title, message, type = 'success') => {
    alertMessage.value = {
        show: true,
        title,
        message,
        type
    }
    // A new alert restarts the timer, so it is not hidden by the previous one's
    clearTimeout(alertTimer)
    alertTimer = setTimeout(hideAlert, 3000)
}

const hideAlert = () => {
    alertMessage.value.show = false
}

let autosaveTimer = null
let storageWarned = false
const autosave = () => {
    try {
        ResumeService.store(resume.value)
    } catch (error) {
        // Usually a full localStorage, e.g. because of a large photo. Warn once.
        if (!storageWarned) {
            storageWarned = true
            console.error('Error saving resume:', error)
            showAlert('Autosave Failed', 'Your browser storage is full. Export your resume as JSON to keep your changes.', 'error')
        }
    }
}

onUnmounted(() => {
    clearInterval(autosaveTimer)
    clearTimeout(alertTimer)
})

onMounted(() => {
    autosaveTimer = setInterval(autosave, 1000)
});

const downloadPDF = async () => {
    await ExporterService.exportToPDF(resume.value)
}

const downloadHTML = async () => {
    await ExporterService.exportToHTML(resume.value)
}

const exportJSON = () => {
    ExporterService.download(ResumeService.exportToJSON(resume.value), ExporterService.getFilename(resume.value, 'json'))
}

const importJSON = () => {
    fileInput.value.click()
}

const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
        try {
            resume.value = await ResumeService.loadFromFile(file)
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

const handleScrollToSection = (section) => {
    // Find the editor content area
    const editorContent = document.querySelector('.editor-window')
    if (!editorContent) return

    // Find the target section element using data-section attribute
    const targetElement = editorContent.querySelector(`[data-section="${section}"]`)

    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }
}

const handleShowAllTooltips = () => {
    // This will be handled by mouse events in the template
}

const handleShowTooltipsStart = () => {
    // Force show all tooltips in the lateral menu
    const tooltipButtons = document.querySelectorAll('.lateral-menu .v-btn')
    tooltipButtons.forEach(btn => {
        const tooltip = btn.closest('.v-tooltip')
        if (tooltip) {
            // Trigger hover event to show tooltip
            btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        }
    })
}

const handleShowTooltipsEnd = () => {
    // Force hide all tooltips in the lateral menu
    const tooltipButtons = document.querySelectorAll('.lateral-menu .v-btn')
    tooltipButtons.forEach(btn => {
        const tooltip = btn.closest('.v-tooltip')
        if (tooltip) {
            // Trigger mouse leave event to hide tooltip
            btn.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
        }
    })
}

const handleZoomIn = () => {
    if (zoomLevel.value < 200) {
        zoomLevel.value += 25
    }
}

const handleZoomOut = () => {
    if (zoomLevel.value > 50) {
        zoomLevel.value -= 25
    }
}

const handleHome = () => {
    // Navigate to home page
    router.push('/')
}

// TXT Export logic
const downloadTXT = async () => {
    await ExporterService.exportToTXT(resume.value)
}

const handleDownloadTXT = async () => {
    if (window.sa_event) {
        window.sa_event('download_txt');
    }
    try {
        // Call the downloadTXT function to generate and download the TXT file
        await downloadTXT();
        showAlert('TXT Generated', 'Your resume has been generated as TXT.', 'success');
    } catch (error) {
        console.error('Error generating TXT:', error);
        showAlert('TXT Generation Failed', 'Failed to generate TXT. Please try again.', 'error');
    }
}
</script>

<style scoped src="@/views/EditorPage.css"></style>
