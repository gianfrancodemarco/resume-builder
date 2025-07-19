<template>
  <div id="printable-area">
    <div class="resume-preview" :style="resumeStyle">
      <!-- Template-specific content will be overridden -->
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseTemplate',
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
      // Replace language proficiency text with a single bar using a CSS variable
      return content.replace(/\(([^)]+)\)\[BAR:(\d+)\]/g, (match, name, proficiency) => {
        return `<div class="proficiency-bar-container">
            <div class="proficiency-bar-label">${name}</div>
            <div class="proficiency-bar" style="--proficiency: ${proficiency}"></div>
          </div>`
      })
    },
    updateCustomCSS() {
      this.removeCustomCSS()
      // Only inject if there's actual CSS content
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
      // Also remove any other potential custom CSS elements
      const allCustomStyles = document.querySelectorAll('style[id^="resume-custom"]')
      allCustomStyles.forEach(style => style.remove())
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
    },
    'style.templateName': {
      handler() {
        // Force CSS update when template changes
        this.$nextTick(() => {
          this.updateCustomCSS()
        })
      },
      immediate: true
    },
    // Watch for any changes to the entire style object
    style: {
      handler() {
        this.$nextTick(() => {
          this.updateCustomCSS()
        })
      },
      deep: true,
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

      return baseStyles
    },
    visibleCustomSections() {
      return this.resumeData.customSections.filter(s => s && s.visible !== false)
    }
  }
}
</script>

<style src="../ResumePreviewStyles.css"></style> 