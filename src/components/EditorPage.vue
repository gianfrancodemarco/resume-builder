<template>
    <v-app>
        <v-app-bar elevation="0" class="px-4 gradient-navbar custom-navbar">
            <v-app-bar-title class="text-h5 font-weight-bold navbar-title">
                <a href="/" class="text-decoration-none text-white">Resume Builder</a>
            </v-app-bar-title>
        </v-app-bar>

        <v-main>
            <v-container fluid class="pa-0 fill-height">
                <v-row no-gutters class="fill-height">
                    <v-col cols="12" md="5" lg="4" class="editor-col">
                        <ResumeEditor v-model:resume-data="resumeData" v-model:style="styleData"
                            @update:style="updateStyle">
                            <template #style-extensions>
                                <div class="sidebar-toggle-row">
                                    <v-btn icon="mdi-arrow-left-right" color="primary" variant="tonal"
                                        @click="toggleSidebarPosition" class="sidebar-toggle-btn"></v-btn>
                                    <span class="sidebar-toggle-label">Sidebar: <b>{{ styleData.spacing.sidebarLeft ?
                                        'left' : 'right' }}</b></span>
                                </div>
                            </template>
                        </ResumeEditor>
                    </v-col>
                    <v-col cols="12" md="7" lg="8" class="preview-container">
                        <div class="preview-wrapper">
                            <ResumePreview download-id="resume-preview" :resume-data="resumeData" :style="styleData"
                                :sidebar-position="styleData.spacing.sidebarLeft ? 'left' : 'right'" />
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>

        <div class="download-buttons">
            <v-tooltip text="Preview" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-eye" color="primary" @click="showFullPreview = true"
                        class="mr-2 download-btn" elevation="2" />
                </template>
            </v-tooltip>
            <v-tooltip text="Download as PDF" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-file-pdf-box" color="primary" @click="downloadPDF"
                        class="mr-2 download-btn" elevation="2" />
                </template>
            </v-tooltip>
            <v-tooltip text="Download as HTML" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-file-code" color="primary" @click="downloadHTML"
                        class="download-btn" elevation="2" />
                </template>
            </v-tooltip>
        </div>

        <!-- Preview Modal -->
        <v-dialog v-model="showFullPreview" max-width="90vw" class="preview-dialog">
            <v-card class="preview-card">
                <v-card-text class="preview-content pa-0">
                    <div class="floating-actions">
                        <div class="d-flex align-center">
                            <v-btn icon="mdi-close" variant="text" @click="showFullPreview = false"
                                color="white"></v-btn>
                            <v-divider vertical class="mx-2" color="white"></v-divider>
                            <div class="zoom-controls">
                                <v-btn icon="mdi-magnify-minus" variant="text" @click="zoomOut" color="white"
                                    :disabled="zoomLevel <= 0.5"></v-btn>
                                <span class="text-white mx-2">{{ Math.round(zoomLevel * 100) }}%</span>
                                <v-btn icon="mdi-magnify-plus" variant="text" @click="zoomIn" color="white"
                                    :disabled="zoomLevel >= 2"></v-btn>
                            </div>
                        </div>
                    </div>
                    <div class="preview-wrapper"
                        :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'center top' }">
                        <ResumePreview :resume-data="resumeData" :style="styleData" />
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script setup>
import { ref, watch } from 'vue'
import ResumeEditor from './ResumeEditor.vue'
import ResumePreview from './ResumePreview.vue'
import html2pdf from 'html2pdf.js'

const showFullPreview = ref(false)
const zoomLevel = ref(1)

const resumeData = ref({
    personal: {
        name: 'John Doe',
        title: 'Software Engineer',
        about: [
            'Passionate software engineer with a strong focus on web development and user experience. Experienced in building modern, responsive applications using Vue.js and other cutting-edge technologies.',
            'Skilled in both frontend and backend development, with a particular emphasis on creating intuitive user interfaces and robust server-side solutions.'
        ],
        location: 'New York, USA',
        email: 'john.doe@example.com',
        links: [
            'https://github.com/johndoe',
            'https://linkedin.com/in/johndoe'
        ],
        visible: true,
        detailsVisible: true,
        linksVisible: true
    },
    skills: [
        'Vue.js',
        'JavaScript',
        'TypeScript',
        'HTML/CSS',
        'Node.js',
        'Python',
        'Git',
        'Docker'
    ],
    languages: [
        { name: 'Italian', proficiency: 100 },
        { name: 'English', proficiency: 90 },
        { name: 'Spanish', proficiency: 70 }
    ],
    experiences: [
        {
            title: 'Senior Software Engineer',
            company: 'Tech Solutions Inc. - Milan',
            period: '2020 - Present',
            description: 'Led the development of enterprise-level web applications using Vue.js and Node.js. Implemented CI/CD pipelines and improved application performance by 40%.'
        },
        {
            title: 'Full Stack Developer',
            company: 'Digital Innovations - Rome',
            period: '2018 - 2020',
            description: 'Developed and maintained multiple web applications. Collaborated with UX designers to implement responsive interfaces and improve user experience.'
        }
    ],
    education: [
        {
            degree: 'Master in Computer Science',
            period: '2016 - 2018',
            mark: '110/110',
            thesis: 'Advanced Web Development Techniques and Best Practices'
        },
        {
            degree: 'Bachelor in Computer Engineering',
            period: '2013 - 2016',
            mark: '108/110',
            thesis: 'Introduction to Modern Web Technologies'
        }
    ],
    skillsVisible: true,
    languagesVisible: true,
    experiencesVisible: true,
    educationVisible: true
})

const styleData = ref({
    colors: {
        primary: '#08294D',
        text: '#08294D',
        background: '#ffffff',
        sidebar: '#08294D',
        link: '#ffffff'
    },
    typography: {
        headingFont: 'Oswald',
        bodyFont: 'Lato',
        baseSize: 16,
        headingSize: 26
    },
    spacing: {
        section: 24,
        content: 12,
        sidebarLeft: false
    }
})

const zoomIn = () => {
    if (zoomLevel.value < 2) {
        zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2)
    }
}

const zoomOut = () => {
    if (zoomLevel.value > 0.5) {
        zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5)
    }
}

// Reset zoom when closing modal
watch(showFullPreview, (newVal) => {
    if (!newVal) {
        zoomLevel.value = 1
    }
})

const downloadPDF = async () => {
    const srcEl = document.getElementById('printable-area')
    if (!srcEl) return

    // Get name and position from resume data
    const name = resumeData.value.personal.name?.trim()
    const position = resumeData.value.personal.title?.trim()

    // Create filename: "Name_Position.pdf" or "resume.pdf" if no name/position
    const filename = (name && position)
        ? `${name}_${position}.pdf`
        : (name || position || 'resume') + '.pdf'

    var printWindow = window.open('', filename)
    printWindow.document.title = filename
    printWindow.document.head.append(document.head.cloneNode(true))
    const style = printWindow.document.createElement('style')
    style.textContent = `
        @page {
            margin: 0;
        }

        html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: white !important;
            box-sizing: border-box;
        }
    `
    printWindow.document.head.appendChild(style)
    printWindow.document.body.innerHTML = srcEl.outerHTML
    printWindow.document.fonts.ready.then(() => {
        printWindow.print()
        //printWindow.close()
    })
}

const downloadHTML = () => {
    const srcEl = document.getElementById('resume-preview')
    if (!srcEl) return

    // Get name and position from resume data
    const name = resumeData.value.personal.name?.trim()
    const position = resumeData.value.personal.title?.trim()

    // Create filename: "Name_Position.html" or "resume.html" if no name/position
    const filename = (name && position)
        ? `${name}_${position}.html`
        : (name || position || 'resume') + '.html'

    // Create a blob with the HTML content
    const blob = new Blob([srcEl.outerHTML], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename.replace(/\s+/g, '_')
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
}

const updateStyle = (newStyle) => {
    styleData.value = newStyle
}

const toggleSidebarPosition = () => {
    styleData.value.spacing.sidebarLeft = !styleData.value.spacing.sidebarLeft
}

// Add color picker tooltip formatter
const colorTooltip = (color) => {
    return `Color: ${color.toUpperCase()}`
}

// Add color preview formatter
const colorPreview = (color) => {
    return color.toUpperCase()
}
</script>

<style scoped>
.editor-col {
    border-right: 1px solid rgba(0, 0, 0, 0.08);
    overflow-y: auto;
}

.download-buttons {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    gap: 12px;
    z-index: 100;
}

.download-btn {
    transition: all 0.2s ease-in-out;
    background: #0f2027 !important;
    box-shadow: 0 4px 12px rgba(15, 32, 39, 0.1) !important;
}

.download-btn:hover {
    transform: translateY(-2px);
    background: #1a2c35 !important;
    box-shadow: 0 6px 16px rgba(15, 32, 39, 0.15) !important;
}

.gradient-navbar {
    background: linear-gradient(135deg, #0f2027 0%, #2c5364 100%) !important;
    box-shadow: 0 4px 16px rgba(44, 83, 100, 0.10);
    border-bottom: none !important;
    min-height: 48px !important;
    height: 56px !important;
    padding-left: 24px !important;
    padding-right: 24px !important;
    display: flex;
    align-items: center;
    background-color: #2c5364 !important;
    backdrop-filter: none !important;
    opacity: 1 !important;
}

.custom-navbar {
    color: #fff !important;
    font-size: 1.1rem;
    font-family: 'Oswald', sans-serif;
    letter-spacing: 1px;
}

.navbar-title {
    margin: 0;
    padding: 0;
    font-size: 1.5rem;
    font-weight: 700;
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

.preview-dialog {
    :deep(.v-overlay__content) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.preview-card {
    background-color: white;
    border-radius: 16px;
    overflow: hidden;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.preview-content {
    position: relative;
    overflow-y: auto;
    max-height: 90vh;
    padding-top: 80px;
    display: flex;
    justify-content: center;
}

.preview-wrapper {
    overflow-y: auto;
    padding: 24px;
}

.preview-container {
    height: 100%;
    background-color: #f8fafc;
}

.floating-actions {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 2;
    background: rgba(0, 0, 0, 0.6);
    padding: 8px 16px;
    border-radius: 12px;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.zoom-controls {
    display: flex;
    align-items: center;
    gap: 8px;
}

:deep(.v-overlay__scrim) {
    opacity: 0.85 !important;
    backdrop-filter: blur(4px);
}

:deep(.v-btn--disabled) {
    opacity: 0.5 !important;
}

.sidebar-toggle-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 16px 0 0 0;
}

.sidebar-toggle-btn {
    background: #0f2027 !important;
    box-shadow: 0 2px 8px rgba(15, 32, 39, 0.10);
}

.sidebar-toggle-btn:hover {
    background: #1a2c35 !important;
}

.sidebar-toggle-label {
    font-size: 0.95em;
    color: #333;
    opacity: 0.8;
}

:deep(.v-color-picker) {
    .v-color-picker__input {
        .v-color-picker__input__value {
            font-family: monospace;
            font-size: 0.9em;
        }
    }
}

:deep(.v-color-picker__preview) {
    position: relative;

    &::after {
        content: attr(data-color);
        position: absolute;
        right: -60px;
        top: 50%;
        transform: translateY(-50%);
        font-family: monospace;
        font-size: 0.9em;
        color: rgba(0, 0, 0, 0.6);
    }
}
</style>
