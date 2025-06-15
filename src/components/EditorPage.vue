<template>
    <v-app>
        <v-app-bar v-if="$vuetify.display.smAndDown" elevation="0" class="px-4 gradient-navbar custom-navbar">
            <v-btn icon="mdi-menu" color="white" variant="text" class="mobile-menu-btn" @click="toggleDrawer" />
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
            <div class="editor-content pa-4" :class="{ 'mobile-view': isMobile }">
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
                    <ResumePreview :resume-data="resumeData" :style="resumeStyle"
                        :sidebar-position="resumeStyle.spacing.sidebarLeft ? 'left' : 'right'" />
                </div>
            </div>
        </v-main>

        <!-- Desktop download buttons -->
        <div class="download-buttons" v-if="!$vuetify.display.smAndDown">
            <v-tooltip text="Export JSON" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-code-json" color="white" @click="handleExportJSON"
                        class="mr-2 download-btn" elevation="2" />
                </template>
            </v-tooltip>
            <v-tooltip text="Import JSON" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-upload" color="white" @click="handleImportJSON"
                        class="mr-2 download-btn" elevation="2" />
                </template>
            </v-tooltip>
            <v-tooltip text="Download as PDF" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-file-pdf-box" color="white" @click="handleDownloadPDF"
                        class="mr-2 download-btn" elevation="2" />
                </template>
            </v-tooltip>
            <v-tooltip text="Download as HTML" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-file-code" color="white" @click="handleDownloadHTML"
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
        visible: true
    },
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
            school: 'University of Milan',
            period: '2016 - 2018',
            mark: '110/110',
            thesis: 'Advanced Web Development Techniques and Best Practices'
        },
        {
            degree: 'Bachelor in Computer Engineering',
            school: 'University of Rome',
            period: '2013 - 2016',
            mark: '108/110',
            thesis: 'Introduction to Modern Web Technologies'
        }
    ],
    educationVisible: true,
    customSections: [
        {
            title: 'About Me',
            type: 'italic',
            visible: true,
            items: [
                { value: 'Passionate software engineer with a strong focus on web development and user experience. Experienced in building modern, responsive applications using Vue.js and other cutting-edge technologies.', isLink: false, href: '' },
                { value: 'Skilled in both frontend and backend development, with a particular emphasis on creating intuitive user interfaces and robust server-side solutions.', isLink: false, href: '' }
            ]
        },
        {
            title: 'Contact Details',
            type: 'text',
            visible: true,
            items: [
                { value: 'New York, USA', isLink: false, href: '' },
                { value: 'john.doe@example.com', isLink: true, href: 'mailto:john.doe@example.com' }
            ]
        },
        {
            title: 'Professional Links',
            type: 'text',
            visible: true,
            items: [
                { value: 'GitHub Profile', isLink: true, href: 'https://github.com/johndoetest1999' },
                { value: 'LinkedIn Profile', isLink: true, href: 'https://linkedin.com/in/johndoe' }
            ]
        },
        {
            title: 'Technical Skills',
            type: 'list',
            visible: true,
            items: [
                'Vue.js',
                'JavaScript',
                'TypeScript',
                'HTML/CSS',
                'Node.js',
                'Python',
                'Git',
                'Docker'
            ]
        },
        {
            title: 'Languages',
            type: 'languages',
            visible: true,
            items: [
                { name: 'Italian', proficiency: 100 },
                { name: 'English', proficiency: 90 },
                { name: 'Spanish', proficiency: 70 }
            ]
        }
    ],
    customSectionsVisible: true
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
        sidebarLeft: false,
        sidebarWidth: 280
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

const exportJSON = () => {
    const data = {
        version: 1,
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
    debugger
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
.v-main {
    background-color: #e2e8f0;
}

.editor-page {
    min-height: 100vh;
}

:deep(.v-navigation-drawer__scrim) {
    display: none !important;
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
    transition: all 0.2s ease;
    flex-shrink: 0;
    border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.preview-col {
    height: 100%;
    overflow-y: auto;
    transition: all 0.2s ease;
    flex-shrink: 0;
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
    border-radius: 1px;
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
    }

    .editor-col {
        width: 100% !important;
    }

    .preview-col {
        width: 100% !important;
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
        height: calc(100vh - 56px);
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
</style>
