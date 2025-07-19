<template>
  <BaseTemplate v-bind="$props">
    <div class="preview-container">
      <div class="container single-column">
        <div class="content single-column centered">
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

          <template v-for="(section, index) in allCustomSections" :key="index">
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
  name: 'OneColumnModern',
  components: { BaseTemplate },
  extends: BaseTemplate,
  computed: {
    // For OneColumnModern, show all custom sections in main content
    allCustomSections() {
      return this.visibleCustomSections
    }
  }
}
</script>

<style scoped>
.single-column {
  flex-direction: column !important;
}

.centered {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

.centered h1,
.centered .subtitle {
  text-align: center;
}

.centered .section {
  text-align: left;
}
</style> 