<template>
    <div class="lateral-menu">
        <!-- Tab switching section -->
        <div class="menu-section">
            <v-tooltip location="right" :model-value="showAllTooltips">
                <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn v-bind="tooltipProps" icon="ph-user" :color="activeTab === 'info' ? 'primary' : 'grey'"
                        variant="text" class="menu-btn" @click="activeTab = 'info'"
                        :class="{ 'active': activeTab === 'info' }" />
                </template>
                Info
            </v-tooltip>
            <v-tooltip location="right" :model-value="showAllTooltips">
                <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn v-bind="tooltipProps" icon="ph-palette" :color="activeTab === 'style' ? 'primary' : 'grey'"
                        variant="text" class="menu-btn" @click="activeTab = 'style'"
                        :class="{ 'active': activeTab === 'style' }" />
                </template>
                Style
            </v-tooltip>
        </div>

        <!-- Divider -->
        <div class="menu-divider"></div>

        <!-- Section Navigation -->
        <div class="menu-section">
            <!-- Info sections -->
            <template v-if="activeTab === 'info'">
                <v-tooltip location="right" :model-value="showAllTooltips">
                    <template v-slot:activator="{ props: tooltipProps }">
                        <v-btn v-bind="tooltipProps" icon="ph-user-circle"
                            :color="currentSection === 'personal' ? 'primary' : 'grey'" variant="text" class="menu-btn"
                            @click="scrollToSection('personal')" :class="{ 'active': currentSection === 'personal' }" />
                    </template>
                    Personal Info
                </v-tooltip>
                <v-tooltip location="right" :model-value="showAllTooltips">
                    <template v-slot:activator="{ props: tooltipProps }">
                        <v-btn v-bind="tooltipProps" icon="ph-briefcase"
                            :color="currentSection === 'experience' ? 'primary' : 'grey'" variant="text"
                            class="menu-btn" @click="scrollToSection('experience')"
                            :class="{ 'active': currentSection === 'experience' }" />
                    </template>
                    Experience
                </v-tooltip>
                <v-tooltip location="right" :model-value="showAllTooltips">
                    <template v-slot:activator="{ props: tooltipProps }">
                        <v-btn v-bind="tooltipProps" icon="ph-graduation-cap"
                            :color="currentSection === 'education' ? 'primary' : 'grey'" variant="text" class="menu-btn"
                            @click="scrollToSection('education')"
                            :class="{ 'active': currentSection === 'education' }" />
                    </template>
                    Education
                </v-tooltip>

                <!-- Custom Sections -->
                <template v-for="(section, index) in customSections" :key="`custom-${index}`">
                    <v-tooltip location="right" :model-value="showAllTooltips">
                        <template v-slot:activator="{ props: tooltipProps }">
                            <v-btn v-bind="tooltipProps" :icon="getCustomSectionIcon(section)"
                                :color="currentSection === `custom-${index}` ? 'primary' : 'grey'" variant="text"
                                class="menu-btn" @click="scrollToSection(`custom-${index}`)"
                                :class="{ 'active': currentSection === `custom-${index}` }" />
                        </template>
                        {{ section.title }}
                    </v-tooltip>
                </template>
            </template>

            <!-- Style sections -->
            <template v-if="activeTab === 'style'">
                <v-tooltip location="right" :model-value="showAllTooltips">
                    <template v-slot:activator="{ props: tooltipProps }">
                        <v-btn v-bind="tooltipProps" icon="ph-palette"
                            :color="currentSection === 'colors' ? 'primary' : 'grey'" variant="text" class="menu-btn"
                            @click="scrollToSection('colors')" :class="{ 'active': currentSection === 'colors' }" />
                    </template>
                    Colors
                </v-tooltip>
                <v-tooltip location="right" :model-value="showAllTooltips">
                    <template v-slot:activator="{ props: tooltipProps }">
                        <v-btn v-bind="tooltipProps" icon="ph-text-t"
                            :color="currentSection === 'typography' ? 'primary' : 'grey'" variant="text"
                            class="menu-btn" @click="scrollToSection('typography')"
                            :class="{ 'active': currentSection === 'typography' }" />
                    </template>
                    Typography
                </v-tooltip>
                <v-tooltip location="right" :model-value="showAllTooltips">
                    <template v-slot:activator="{ props: tooltipProps }">
                        <v-btn v-bind="tooltipProps" icon="ph-arrows-out-line-vertical"
                            :color="currentSection === 'spacing' ? 'primary' : 'grey'" variant="text" class="menu-btn"
                            @click="scrollToSection('spacing')" :class="{ 'active': currentSection === 'spacing' }" />
                    </template>
                    Spacing
                </v-tooltip>
            </template>
        </div>

        <!-- Divider -->
        <div class="menu-divider"></div>

        <!-- Actions section -->
        <div class="menu-section">
            <v-tooltip location="right" :model-value="showAllTooltips">
                <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn v-bind="tooltipProps" icon="ph-eye" color="grey" variant="text" class="menu-btn"
                        @mousedown="handleShowTooltipsStart" @mouseup="handleShowTooltipsEnd"
                        @mouseleave="handleShowTooltipsEnd" />
                </template>
                Show All
            </v-tooltip>
            <v-tooltip location="right" :model-value="showAllTooltips">
                <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn v-bind="tooltipProps" icon="ph-magnifying-glass-plus" color="grey" variant="text"
                        class="menu-btn hide-mobile" @click="handleZoomIn" />
                </template>
                Zoom In
            </v-tooltip>
            <v-tooltip location="right" :model-value="showAllTooltips">
                <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn v-bind="tooltipProps" icon="ph-magnifying-glass-minus" color="grey" variant="text"
                        class="menu-btn hide-mobile" @click="handleZoomOut" />
                </template>
                Zoom Out
            </v-tooltip>
            <v-tooltip location="right" :model-value="showAllTooltips">
                <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn v-bind="tooltipProps" icon="ph-brackets-curly" color="grey" variant="text" class="menu-btn"
                        @click="handleExportJSON" />
                </template>
                Export JSON
            </v-tooltip>
            <v-tooltip location="right" :model-value="showAllTooltips">
                <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn v-bind="tooltipProps" icon="ph-upload" color="grey" variant="text" class="menu-btn"
                        @click="handleImportJSON" />
                </template>
                Import JSON
            </v-tooltip>
            <v-tooltip location="right" :model-value="showAllTooltips">
                <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn v-bind="tooltipProps" icon="ph-file-pdf" color="grey" variant="text" class="menu-btn"
                        @click="handleDownloadPDF" />
                </template>
                Download PDF
            </v-tooltip>
            <v-tooltip location="right" :model-value="showAllTooltips">
                <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn v-bind="tooltipProps" icon="ph-file-code" color="grey" variant="text" class="menu-btn"
                        @click="handleDownloadHTML" />
                </template>
                Download HTML
            </v-tooltip>
            <v-tooltip location="right" :model-value="showAllTooltips">
                <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn v-bind="tooltipProps" icon="ph-file-text" color="grey" variant="text" class="menu-btn"
                        @click="handleConvertCV" />
                </template>
                Convert CV
            </v-tooltip>
        </div>

        <!-- Spacer to push home button to bottom -->
        <div class="menu-spacer"></div>

        <!-- Divider -->
        <div class="menu-divider"></div>

        <!-- Home button at bottom -->
        <div class="menu-section">
            <v-tooltip location="right" :model-value="showAllTooltips">
                <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn v-bind="tooltipProps" icon="ph-house" color="grey" variant="text" class="menu-btn"
                        @click="handleHome" />
                </template>
                Home
            </v-tooltip>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    activeTab: {
        type: String,
        default: 'info'
    },
    customSections: {
        type: Array,
        default: () => []
    },
    handleShowAll: Function,
    handleShowTooltipsStart: Function,
    handleShowTooltipsEnd: Function,
    handleZoomIn: Function,
    handleZoomOut: Function,
    handleExportJSON: Function,
    handleImportJSON: Function,
    handleDownloadPDF: Function,
    handleDownloadHTML: Function,
    handleConvertCV: Function,
    handleHome: Function
})

const emit = defineEmits(['update:activeTab', 'scrollToSection'])

const activeTab = ref(props.activeTab)
const currentSection = ref('')
const showAllTooltips = ref(false)

// Scroll detection setup
let scrollTimeout = null
let scrollListenerAttached = false

const setupScrollListener = () => {
    if (scrollListenerAttached) return

    const editorWindow = document.querySelector('.editor-window')
    if (editorWindow) {
        editorWindow.addEventListener('scroll', handleScroll)
        scrollListenerAttached = true
        handleScroll()
    }
}

const handleScroll = () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout)
    }

    scrollTimeout = setTimeout(() => {
        const editorWindow = document.querySelector('.editor-window')
        if (!editorWindow) return

        const sections = document.querySelectorAll('.editor-section[data-section], .section-block[data-section]')
        if (!sections || sections.length === 0) return

        const scrollTop = editorWindow.scrollTop
        const containerHeight = editorWindow.clientHeight

        let bestMatch = { section: '', sectionTop: Infinity }

        sections.forEach(section => {
            if (!section) return

            const rect = section.getBoundingClientRect()
            const containerRect = editorWindow.getBoundingClientRect()
            const sectionTop = rect.top - containerRect.top
            const sectionBottom = sectionTop + rect.height

            // Check if section is visible in the viewport
            const isVisible = sectionBottom > scrollTop && sectionTop < scrollTop + containerHeight

            if (isVisible) {
                // Prioritize the first (topmost) visible section
                if (!bestMatch.section || sectionTop < bestMatch.sectionTop) {
                    bestMatch = {
                        section: section.dataset.section,
                        sectionTop: sectionTop
                    }
                }
            }
        })

        currentSection.value = bestMatch.section
    }, 50) // Reduced debounce for more responsive detection
}

// Watch for changes in the activeTab prop
watch(() => props.activeTab, (newValue) => {
    activeTab.value = newValue
})

// Watch for changes in the local activeTab and emit to parent
watch(activeTab, (newValue) => {
    emit('update:activeTab', newValue)
})

// Setup scroll listener when component mounts
onMounted(() => {
    setupScrollListener()

    // Add global mouse event listener to hide tooltips when mouse leaves the menu
    document.addEventListener('mouseup', handleShowTooltipsEnd)
    document.addEventListener('mouseleave', handleShowTooltipsEnd)
})

// Cleanup when component unmounts
onBeforeUnmount(() => {
    const editorWindow = document.querySelector('.editor-window')
    if (editorWindow && scrollListenerAttached) {
        editorWindow.removeEventListener('scroll', handleScroll)
    }

    if (scrollTimeout) {
        clearTimeout(scrollTimeout)
    }

    // Remove global event listeners
    document.removeEventListener('mouseup', handleShowTooltipsEnd)
    document.removeEventListener('mouseleave', handleShowTooltipsEnd)
})

// Expose the handlers for template
const handleShowAll = () => props.handleShowAll && props.handleShowAll()
const handleShowTooltipsStart = () => {
    showAllTooltips.value = true
}
const handleShowTooltipsEnd = () => {
    showAllTooltips.value = false
}
const handleZoomIn = () => props.handleZoomIn && props.handleZoomIn()
const handleZoomOut = () => props.handleZoomOut && props.handleZoomOut()
const handleExportJSON = () => props.handleExportJSON && props.handleExportJSON()
const handleImportJSON = () => props.handleImportJSON && props.handleImportJSON()
const handleDownloadPDF = () => props.handleDownloadPDF && props.handleDownloadPDF()
const handleDownloadHTML = () => props.handleDownloadHTML && props.handleDownloadHTML()
const handleConvertCV = () => props.handleConvertCV && props.handleConvertCV()
const handleHome = () => props.handleHome && props.handleHome()

// Scroll to section function
const scrollToSection = (sectionName) => {
    emit('scrollToSection', sectionName)
}

// Get icon for custom section based on title or type
const getCustomSectionIcon = (section) => {
    if (!section || !section.title) {
        return 'ph-plus-circle'
    }

    const title = section.title.toLowerCase().trim()

    // Map common section titles to icons
    const iconMap = {
        'skills': 'ph-lightning',
        'languages': 'ph-translate',
        'certifications': 'ph-certificate',
        'projects': 'ph-folder',
        'publications': 'ph-book-open',
        'awards': 'ph-trophy',
        'volunteer': 'ph-heart',
        'interests': 'ph-star',
        'hobby': 'ph-star',
        'hobbies': 'ph-star',
        'references': 'ph-users',
        'contacts': 'ph-phone',
        'contact': 'ph-phone',
        'summary': 'ph-text-align-left',
        'objective': 'ph-target',
        'achievements': 'ph-medal',
        'activities': 'ph-game-controller',
        'memberships': 'ph-buildings',
        'patents': 'ph-lightbulb'
    }

    // Simple word matching
    const words = title.split(/\s+/)
    for (const word of words) {
        if (iconMap[word]) {
            return iconMap[word]
        }
    }

    // Default icon for unknown sections
    return 'ph-plus-circle'
}
</script>

<style scoped>
.lateral-menu {
    display: flex;
    flex-direction: column;
    background-color: rgba(30, 41, 59, 0.3);
    /* slate-800 with opacity */
    border-right: 1px solid rgba(51, 65, 85, 0.6);
    /* slate-700 with opacity */
    padding: 12px 8px;
    width: 56px;
    flex-shrink: 0;
    align-items: center;
    justify-content: flex-start;
    padding-top: 20px;
    gap: 8px;
    position: relative;
    z-index: 10;
    backdrop-filter: blur(10px);
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* Internet Explorer 10+ */
}

.lateral-menu::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
}

.menu-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    width: 100%;
}

.menu-divider {
    width: 32px;
    height: 1px;
    border-top: 1px solid rgba(71, 85, 105, 0.6);
    /* slate-600 with opacity */
    margin: 16px 0;
    flex-shrink: 0;
}

.menu-spacer {
    flex: 1;
    min-height: 20px;
}

.menu-btn {
    width: 40px !important;
    height: 40px !important;
    border-radius: 8px !important;
    transition: all 0.2s ease !important;
    color: #94a3b8 !important;
    /* slate-400 */
}

.menu-btn:hover {
    background-color: rgba(var(--v-theme-primary), 0.1) !important;
    color: #e2e8f0 !important;
    /* slate-200 */
}

.menu-btn.active {
    background-color: rgba(var(--v-theme-primary), 0.2) !important;
    color: rgb(var(--v-theme-primary)) !important;
    transform: scale(1.05);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .lateral-menu {
        min-width: 56px;
        max-width: 56px;
        width: 56px;
    }

    .menu-btn {
        width: 44px !important;
        height: 44px !important;
        min-width: 44px;
    }

    .hide-mobile {
        display: none !important;
    }
}

@media (max-width: 480px) {
    .lateral-menu {
        min-width: 52px;
        max-width: 52px;
        width: 52px;
        padding: 8px 6px;
    }

    .menu-btn {
        width: 40px !important;
        height: 40px !important;
        min-width: 40px;
    }
}
</style>