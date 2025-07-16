<template>
  <div id="printable-area">
    <div class="resume-preview" :style="resumeStyle">
      <div class="preview-container">
        <div class="container" :class="{ 'sidebar-left': sidebarPosition === 'left' }">

          <div class="sidebar" v-if="isSidebarPresent">
            <template v-for="(section, index) in sidebarCustomSections" :key="index">
              <h2>{{ section.title }}</h2>
              <div v-html="processContent(section.content)"></div>
            </template>
          </div>

          <div class="content">
            <h1>{{ resumeData.personal.name || 'Your Name' }}</h1>
            <h2 class="subtitle">{{ resumeData.personal.title }}</h2>

            <div class="section"
              v-if="resumeData.experiencesVisible && resumeData.experiences && resumeData.experiences.filter(e => e?.visible).length">
              <h2>{{ resumeData.experiencesSectionName }}</h2>
              <div v-for="(e, i) in resumeData.experiences" :key="i">
                <template v-if="e?.visible">
                  <p class="job-title">{{ e.title }} - {{ e.company }}</p>
                  <p class="date">{{ e.period }}</p>
                  <p class="job-desc" v-html="processContent(e.description)"></p>
                </template>
              </div>
            </div>

            <div class="section"
              v-if="resumeData.educationVisible && resumeData.education && resumeData.education.filter(e => e?.visible).length">
              <h2>{{ resumeData.educationSectionName }}</h2>
              <div v-for="(ed, i) in resumeData.education" :key="i">
                <template v-if="ed?.visible">
                  <p class="job-title">{{ ed.degree }} - {{ ed.school }}</p>
                  <div>
                    <p class="date">{{ ed.period }}</p>
                    <p class="graduation-mark">{{ ed.mark }}</p>
                  </div>
                  <p class="thesis" v-html="processContent(ed.thesis)"></p>
                </template>
              </div>
            </div>

            <template v-for="(section, index) in mainCustomSections" :key="index">
              <div class="section">
                <h2>{{ section.title }}</h2>
                <div v-html="processContent(section.content)"></div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    resumeData: {
      type: Object,
      required: true
    },
    style: {
      type: Object,
      required: true
    },
    downloadId: {
      type: String,
      default: ''
    },
    sidebarPosition: {
      type: String,
      default: 'right',
      validator: (value) => ['left', 'right'].includes(value)
    }
  },
  methods: {
    processContent(content) {
      if (!content) return ''
      // Replace language proficiency text with bars
      return content.replace(/\(([^)]+)\)\[BAR:(\d+)\]/g, (match, name, proficiency) => {
        return `
          <div class="proficiency-bar-container">
            <div class="proficiency-bar-label">${name}</div>
            <div class="proficiency-bar">
              <div class="proficiency-bar-fill" style="width: ${proficiency}%"></div>
            </div>
          </div>
        `
      })
    },
    updateCustomCSS() {
      this.removeCustomCSS()
      if (this.style.customCSS && this.style.customCSS.trim()) {
        const styleElement = document.createElement('style')
        styleElement.id = 'resume-custom-css'
        styleElement.textContent = this.style.customCSS
        document.head.appendChild(styleElement)
      }
    },
    removeCustomCSS() {
      const existingStyle = document.getElementById('resume-custom-css')
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  },
  mounted() {
    this.updateCustomCSS()
  },
  beforeUnmount() {
    this.removeCustomCSS()
  },
  watch: {
    'style.customCSS': {
      handler() {
        this.updateCustomCSS()
      },
      immediate: true
    }
  },
  computed: {
    resumeStyle() {
      const { colors, typography, spacing, customCSS } = this.style
      const baseStyles = {
        '--primary-color': colors.primary,
        '--text-color': colors.text,
        '--background-color': colors.background,
        '--sidebar-background-color': colors.sidebarBackground || colors.primary,
        '--sidebar-text-color': colors.sidebarText || colors.primary,
        '--dates-text-color': colors.datesTextColor || colors.primary,
        '--subtitle-text-color': colors.subtitleTextColor || colors.primary,
        '--link-color': colors.link || colors.primary,
        '--heading-font': typography.headingFont,
        '--body-font': typography.bodyFont,
        '--base-size': `${typography.baseSize}px`,
        '--heading-size': `${typography.headingSize}px`,
        '--section-spacing': `${spacing.section}px`,
        '--content-spacing': `${spacing.content}px`,
        '--sidebar-width': `${spacing.sidebarWidth}px`
      }

      // Custom CSS is handled in mounted hook and watchers

      return baseStyles
    },
    visibleCustomSections() {
      return this.resumeData.customSections.filter(s => s && s.visible !== false)
    },
    isSidebarPresent() {
      return this.style.spacing.sidebarWidth > 0
    },
    sidebarCustomSections() {
      return this.visibleCustomSections.filter(s => s.position === 'sidebar')
    },
    mainCustomSections() {
      // If sidebar is not present, show all custom sections in main content
      return this.visibleCustomSections.filter(s => s.position === 'main' || !this.isSidebarPresent)
    }
  }
}
</script>

<style src="./ResumePreviewStyles.css"></style>