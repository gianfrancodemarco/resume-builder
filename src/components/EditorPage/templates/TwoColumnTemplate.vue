<template>
  <BaseTemplate v-bind="$props">
    <template #layout>
      <div class="preview-container">
        <div class="container" :class="{ 'sidebar-left': sidebarPosition === 'left' }">
          <div class="sidebar" v-if="isSidebarPresent">
            <template v-for="(section, index) in sidebarCustomSections" :key="getSidebarSectionKey(section)">
              <h2>{{ section.title }}</h2>
              <div v-html="processContent(section.content)"></div>
            </template>
          </div>

          <div class="content">
            <h1>{{ resumeData.personal.name || 'Your Name' }}</h1>
            <h2 class="subtitle">{{ resumeData.personal.title }}</h2>

            <template v-for="(section, index) in orderedMainSections" :key="getMainSectionKey(section)">
              <div class="section" v-if="section.type === 'experiences'">
                <h2>{{ resumeData.experiencesSectionName }}</h2>
                <div v-for="(e, i) in resumeData.experiences" :key="i">
                  <template v-if="e?.visible">
                    <p class="job-title">{{ e.title }} - {{ e.company }}</p>
                    <p class="date">{{ e.period }}</p>
                    <p class="job-desc" v-html="processContent(e.description)"></p>
                  </template>
                </div>
              </div>

              <div class="section" v-if="section.type === 'education'">
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

              <div class="section" v-if="section.type === 'custom'">
                <h2>{{ section.data.title }}</h2>
                <div v-html="processContent(section.data.content)"></div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from './BaseTemplate.vue'

export default {
  name: 'TwoColumnTemplate',
  components: { BaseTemplate },
  extends: BaseTemplate,
  computed: {
    // Sidebar-related computed properties for two-column templates
    isSidebarPresent() {
      return this.style.spacing.sidebarWidth > 0
    },
    sidebarCustomSections() {
      // Keep sidebar custom sections ordered consistently with the global section ordering
      return this.orderedSections
        .filter(s => s.type === 'custom' && s.data.position === 'sidebar')
        .map(s => s.data)
    },
    orderedMainSections() {
      return this.orderedSections.filter(s => {
        if (s.type === 'custom') {
          return s.data.position === 'main' || !this.isSidebarPresent
        }
        return true
      })
    }
  },
  methods: {
    getSidebarSectionKey(section) {
      const idx = this.resumeData.customSections.indexOf(section)
      return `sidebar-custom-${idx}`
    },
    getMainSectionKey(section) {
      if (section.type === 'custom') {
        const idx = this.resumeData.customSections.indexOf(section.data)
        return `main-custom-${idx}`
      }
      return `main-${section.type}`
    }
  }
}
</script>