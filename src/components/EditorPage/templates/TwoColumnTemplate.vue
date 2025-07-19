<template>
  <BaseTemplate v-bind="$props">
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
      return this.visibleCustomSections.filter(s => s.position === 'sidebar')
    },
    mainCustomSections() {
      // If sidebar is not present, show all custom sections in main content
      return this.visibleCustomSections.filter(s => s.position === 'main' || !this.isSidebarPresent)
    }
  }
}
</script> 