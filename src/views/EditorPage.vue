<template>
    <v-app>
        <v-main>
            <div class="editor-content" :class="{ 'mobile-view': isMobile }">
                <!-- Lateral Menu -->

                <LateralMenu v-model:active-tab="activeTab" :custom-sections="resumeData.customSections"
                    :handleShowAll="handleShowAllTooltips" :handleShowTooltipsStart="handleShowTooltipsStart"
                    :handleShowTooltipsEnd="handleShowTooltipsEnd" :handleZoomIn="handleZoomIn"
                    :handleZoomOut="handleZoomOut" :handleExportJSON="handleExportJSON"
                    :handleImportJSON="handleImportJSON" :handleDownloadPDF="handleDownloadPDF"
                    :handleDownloadHTML="handleDownloadHTML" :handleDownloadTXT="handleDownloadTXT"
                    :handleHome="handleHome" @scroll-to-section="handleScrollToSection"
                    @update:active-tab="activeTab = $event" />

                <div class="editor-col" :style="isMobile ? { width: '100%' } : { width: '35%' }">
                    <ResumeEditor v-model:resume-data="resumeData" v-model:style="resumeStyle"
                        v-model:active-tab="activeTab" @save="handleFormSave" @change="handleFormChange"
                        :is-mobile="isMobile" />
                </div>
                <div class="preview-col" :class="{ 'hidden': isMobile }" :style="!isMobile ? { width: '65%' } : {}">
                    <div ref="previewContainer" class="preview-container"
                        :style="{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }">
                        <div v-for="(line, i) in lines" :key="i" :style="{
                            position: 'absolute',
                            top: `${(i + 1) * 296}mm`,
                            left: 0,
                            width: '100%',
                            borderTop: '3px dashed rgba(0,0,0,0.5)', // thicker and semi-transparent
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontStyle: 'italic',
                            color: 'rgba(0,0,0,0.5)',
                            height: '20px', // ensures space for text
                            zIndex: 1000
                        }">
                            <span style="position: absolute; top: -25px;">Page will be cut approximately here</span>
                        </div>
                        <TemplateFactory :resume-data="resumeData" :style="resumeStyle"
                            :sidebar-position="resumeStyle.spacing.sidebarLeft ? 'left' : 'right'" />
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
import TemplateFactory from '@/components/EditorPage/templates/TemplateFactory.vue'
import { ExporterService } from '@/services/ExporterService'
import { ResumeDataClass, ResumeService, ResumeStyleClass } from '@/services/ResumeService'
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'

const { mobile } = useDisplay()
const router = useRouter()

// Replace the resumeData ref with the ResumeDataClass factory
// We use from JSON so that if an older version of the resume data is loaded, it will be converted to the latest version
const resumeData = ref(localStorage.getItem('resumeData') ? ResumeDataClass.fromJSON(JSON.parse(localStorage.getItem('resumeData'))) : ResumeDataClass.createDefault())

// We use from JSON so that if an older version of the resume style is loaded, it will be converted to the latest version
const resumeStyle = ref(localStorage.getItem('resumeStyle') ? JSON.parse(localStorage.getItem('resumeStyle')) : ResumeStyleClass.createDefault())

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

// PageBreak
const previewContainer = ref(null);
const lines = ref([]);
let observer;

const updateLines = () => {
    if (!previewContainer.value) return;
    const intervalMm = 292; //The page layout changes a bit on @, so 292 seems to give better results than 297
    const heightPx = previewContainer.value.scrollHeight;
    const heightMm = (heightPx * 25.4) / 96; // only to count lines
    const count = Math.floor(heightMm / intervalMm);
    lines.value = Array.from({ length: count });
};

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

onMounted(async () => {
    setInterval(() => {
        localStorage.setItem('resumeData', JSON.stringify(resumeData.value))
        localStorage.setItem('resumeStyle', JSON.stringify(resumeStyle.value))
    }, 1000)

    updateLines();
    observer = new ResizeObserver(updateLines);
    observer.observe(previewContainer.value);
});

onBeforeUnmount(async () => {
    observer?.disconnect;
});

const downloadPDF = async () => {
    await ExporterService.exportToPDF(resumeData.value, resumeStyle.value)
}

const downloadHTML = async () => {
    await ExporterService.exportToHTML(resumeData.value, resumeStyle.value)
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
    await ExporterService.exportToTXT(resumeData.value)
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
