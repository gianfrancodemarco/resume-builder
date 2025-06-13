<template>
    <v-app>
        <v-app-bar elevation="0" class="px-4 gradient-navbar custom-navbar">
            <v-app-bar-title class="text-h5 font-weight-bold navbar-title">
                <a href="/" class="text-decoration-none text-white">Resume Builder</a>
            </v-app-bar-title>
            <!-- Improved mobile menu button -->
            <v-btn v-if="$vuetify.display.smAndDown" icon="mdi-menu" color="white" variant="text"
                class="mobile-menu-btn" @click="toggleDrawer" />
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" app temporary>
            <v-list>
                <v-list-item @click="handleExportJSON" prepend-icon="mdi-code-json" title="Export JSON"></v-list-item>
                <v-list-item @click="handleImportJSON" prepend-icon="mdi-upload" title="Import JSON"></v-list-item>
                <v-list-item @click="handleDownloadPDF" prepend-icon="mdi-file-pdf-box"
                    title="Download PDF"></v-list-item>
                <v-list-item @click="handleDownloadHTML" prepend-icon="mdi-file-code"
                    title="Download HTML"></v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <div class="editor-content" :class="{ 'mobile-view': isMobile }">
                <div class="editor-col"
                    :style="isMobile ? { height: `${editorHeight}%` } : { width: `${editorWidth}%` }">
                    <ResumeEditor v-model:resume-data="resumeData" v-model:style="resumeStyle" @save="handleFormSave"
                        @change="handleFormChange" />
                </div>
                <div class="resize-handle" @mousedown.prevent="startResize" @touchstart.prevent="startResize"
                    @touchmove.prevent="handleResize" @touchend.prevent="stopResize">
                </div>
                <div class="preview-col"
                    :style="isMobile ? { height: `${100 - editorHeight}%` } : { width: `${100 - editorWidth}%` }">
                    <ResumePreview :resume-data="resumeData" :style="resumeStyle" />
                </div>
            </div>
        </v-main>

        <!-- Desktop download buttons -->
        <div class="download-buttons" v-if="!$vuetify.display.smAndDown">
            <v-tooltip text="Export JSON" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-code-json" color="primary" @click="exportJSON"
                        class="mr-2 download-btn" elevation="2" />
                </template>
            </v-tooltip>
            <v-tooltip text="Import JSON" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-upload" color="primary" @click="importJSON"
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

        <!-- Hidden file input for JSON import -->
        <input type="file" ref="fileInput" style="display: none" accept=".json" @change="handleFileUpload" />
    </v-app>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import ResumeEditor from './ResumeEditor.vue'
import ResumePreview from './ResumePreview.vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const router = useRouter()
const { mobile } = useDisplay()
const resumeData = ref({
    personal: {
        name: 'John Doe',
        title: 'Software Engineer',
        about: [
            'Passionate software engineer with a strong focus on web development and user experience. Experienced in building modern, responsive applications using Vue.js and other cutting-edge technologies.',
            'Skilled in both frontend and backend development, with a particular emphasis on creating intuitive user interfaces and robust server-side solutions.'
        ],
        details: [
            { value: 'New York, USA', isLink: false },
            { value: 'john.doe@example.com', isLink: true }
        ],
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
    skillsVisible: true,
    languages: [
        { name: 'Italian', proficiency: 100 },
        { name: 'English', proficiency: 90 },
        { name: 'Spanish', proficiency: 70 }
    ],
    languagesVisible: true,
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
    experiencesVisible: true,
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
    educationVisible: true
})

const resumeStyle = ref({
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

const fileInput = ref(null)

// Add drawer ref for mobile menu
const drawer = ref(false)

const showMobileMenu = ref(false)
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

// Handle navigation
const handleNavigation = (to) => {
    if (hasUnsavedChanges.value) {
        if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
            router.push(to)
        }
    } else {
        router.push(to)
    }
}

const getFilename = (extension) => {
    // Get name and position from resume data
    const name = resumeData.value.personal.name?.trim()
    const position = resumeData.value.personal.title?.trim()

    // Create filename: "Name_Position.extension" or "resume.extension" if no name/position
    return (name && position)
        ? `${name}_${position}.${extension}`
        : (name || position || 'resume') + `.${extension}`
}

const downloadPDF = async () => {
    const srcEl = document.getElementById('printable-area').cloneNode(true)
    if (!srcEl) return

    const filename = getFilename('pdf')
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
            background: white !important;
            box-sizing: border-box;
        }
    `
    printWindow.document.head.appendChild(style)
    printWindow.document.body.innerHTML = srcEl.outerHTML
    printWindow.document.fonts.ready.then(() => {
        setTimeout(() => {
            printWindow.print()
            //printWindow.close()
        }, 0) // Safari needs time to render layout
    })

}

const downloadHTML = async () => {
    const srcEl = document.getElementById('printable-area')
    if (!srcEl) return

    const filename = getFilename('html')
    const printWindow = window.open('', filename)
    if (!printWindow) {
        alert('Popup blocked. Please allow popups for this site.')
        return
    }

    printWindow.document.title = filename

    // Step 1: Collect local (non-CORS) styles from <style> and <link>
    const localCSS = Array.from(document.styleSheets).map(sheet => {
        try {
            return Array.from(sheet.cssRules || []).map(rule => rule.cssText).join('\n')
        } catch (e) {
            return '' // Ignore cross-origin styles
        }
    }).join('\n')

    // Step 2: Attempt to fetch CORS-allowed external stylesheets
    const fetchExternalStyles = async () => {
        const externalLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        const fetched = await Promise.all(externalLinks.map(async link => {
            try {
                const res = await fetch(link.href)
                if (!res.ok) throw new Error('fetch failed')
                return await res.text()
            } catch {
                console.warn(`Could not fetch: ${link.href}`)
                return ''
            }
        }))
        return fetched.join('\n')
    }

    const externalCSS = await fetchExternalStyles()

    // Step 3: Append combined CSS
    const styleTag = document.createElement('style')
    styleTag.textContent = `
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

    ${localCSS}
    ${externalCSS}
  `
    printWindow.document.head.appendChild(styleTag)

    // Step 4: Clone content
    const clone = srcEl.cloneNode(true)
    printWindow.document.body.appendChild(clone)

    // Step 5: Wait for fonts to load, then generate downloadable HTML
    await printWindow.document.fonts.ready
    setTimeout(() => {
        const blob = new Blob([printWindow.document.documentElement.outerHTML], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename.replace(/\s+/g, '_')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        printWindow.close()
    }, 0)
}

const updateStyle = (newStyle) => {
    resumeStyle.value = newStyle
}

const toggleSidebarPosition = () => {
    resumeStyle.value.spacing.sidebarLeft = !resumeStyle.value.spacing.sidebarLeft
}

// Add color picker tooltip formatter
const colorTooltip = (color) => {
    return `Color: ${color.toUpperCase()}`
}

// Add color preview formatter
const colorPreview = (color) => {
    return color.toUpperCase()
}

const exportJSON = () => {
    const data = {
        resumeData: resumeData.value,
        resumeStyle: resumeStyle.value
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = getFilename('json')
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
}

const importJSON = () => {
    fileInput.value.click()
}

const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result)
                if (data.resumeData && data.resumeStyle) {
                    resumeData.value = data.resumeData
                    resumeStyle.value = data.resumeStyle
                } else {
                    alert('Invalid resume data format')
                }
            } catch (error) {
                alert('Error loading file: ' + error.message)
            }
        }
        reader.readAsText(file)
    }
    // Reset the input so the same file can be selected again
    event.target.value = ''
}

const toggleDrawer = () => {
    drawer.value = !drawer.value
}

const handleExportJSON = () => {
    drawer.value = false
    exportJSON()
}

const handleImportJSON = () => {
    drawer.value = false
    importJSON()
}

const handleDownloadPDF = () => {
    drawer.value = false
    downloadPDF()
}

const handleDownloadHTML = () => {
    drawer.value = false
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
            editorWidth.value = Math.min(Math.max(newWidth, 20), 80) // Limit between 20% and 80%
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
    background-color: #f5f5f5;
}

/* Remove navigation drawer scrim */
:deep(.v-navigation-drawer__scrim) {
    display: none !important;
}

.editor-header {
    background-color: #fff;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.editor-col {
    border-right: 1px solid rgba(0, 0, 0, 0.08);
    overflow-y: auto;
    height: calc(100vh - 56px);
    /* Subtract navbar height */
    position: relative;
}

.mobile-editor {
    border-right: none;
    border-bottom: none;
    height: auto;
    max-height: 50vh;
}

.mobile-editor::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: linear-gradient(90deg, #0f2027 0%, #2c5364 100%);
    z-index: 1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

@media (max-width: 600px) {
    .navbar-title {
        font-size: 1.2rem;
    }
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

.preview-container {
    height: 100%;
    background-color: #f8fafc;
    overflow-y: auto;
}

@media (max-width: 960px) {
    .preview-container {
        height: calc(100vh - 56px - 50vh);
        /* Subtract navbar and editor height */
    }
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

/* Mobile optimizations */
@media (max-width: 600px) {
    .preview-wrapper {
        padding: 8px;
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

/* Mobile menu improvements */
.mobile-menu-btn {
    margin-left: auto;
    opacity: 0.9;
    transition: opacity 0.2s ease;
}

.mobile-menu-btn:hover {
    opacity: 1;
}

.mobile-drawer {
    :deep(.v-list) {
        padding: 8px;
    }
}

:deep(.v-navigation-drawer__content) {
    overflow-y: auto;
}

:deep(.v-list-item) {
    min-height: 48px;
    border-radius: 8px;
    margin: 4px 8px;
    transition: all 0.2s ease;
}

:deep(.v-list-item:hover) {
    background-color: rgba(var(--v-theme-primary), 0.05);
}

:deep(.v-list-item-title) {
    font-size: 0.95rem;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.87);
}

:deep(.v-icon) {
    font-size: 1.25rem;
    color: rgba(0, 0, 0, 0.6);
}

:deep(.v-divider) {
    opacity: 0.1;
    margin: 8px 0;
}

.editor-content {
    display: flex;
    height: calc(100vh - 64px);
    position: relative;
    overflow: hidden;
}

.editor-col {
    height: 100%;
    overflow-y: auto;
    background: #fff;
    transition: width 0.1s ease;
    flex-shrink: 0;
}

.preview-col {
    height: 100%;
    overflow-y: auto;
    background: #f8f9fa;
    transition: width 0.1s ease;
    flex-shrink: 0;
}

.resize-handle {
    width: 12px;
    background: #e0e0e0;
    cursor: col-resize;
    position: relative;
    z-index: 10;
    flex-shrink: 0;
    touch-action: none;
}

.resize-handle:hover,
.resize-handle:active {
    background: #bdbdbd;
}

.resize-handle::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 30px;
    background: #9e9e9e;
    border-radius: 1px;
}

@media (max-width: 960px) {
    .editor-content {
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
    }

    .editor-col {
        width: 100% !important;
        transition: height 0.1s ease;
    }

    .preview-col {
        width: 100% !important;
        transition: height 0.1s ease;
    }

    .resize-handle {
        width: 100%;
        height: 12px;
        cursor: row-resize;
    }

    .resize-handle::after {
        width: 30px;
        height: 2px;
    }
}

@media (max-width: 600px) {
    .editor-content {
        height: calc(100vh - 56px);
    }
}

:deep(.v-navigation-drawer) {
    background-color: #fff !important;
    border-right: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
