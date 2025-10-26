<template>
  <BaseTemplate v-bind="$props" rootClass="ocm-resume">
    <template #header="{ resumeData }">
      <div class="ocm-header">
        <div class="ocm-name">{{ resumeData.personal.name || 'Your Name' }}</div>
        <div class="ocm-title">{{ resumeData.personal.title }}</div>
      </div>
    </template>

    <template #experiences="{ resumeData, processContent }">
      <div class="ocm-section">
        <div class="ocm-left-col">{{ resumeData.experiencesSectionName }}</div>
        <div class="ocm-right-col">
          <div v-for="(e, i) in resumeData.experiences" :key="i">
            <template v-if="e?.visible">
              <div class="ocm-experience-item">
                <div class="ocm-job-title">{{ e.title }} | {{ e.period }}</div>
                <div class="ocm-company">{{ e.company }}</div>
                <div class="ocm-job-desc" v-html="processContent(e.description)"></div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <template #education="{ resumeData, processContent }">
      <div class="ocm-section">
        <div class="ocm-left-col">{{ resumeData.educationSectionName }}</div>
        <div class="ocm-right-col">
          <div v-for="(ed, i) in resumeData.education" :key="i">
            <template v-if="ed?.visible">
              <div class="ocm-education-item">
                <div class="ocm-degree">{{ ed.school }} | {{ ed.period }}</div>
                <div class="ocm-school">{{ ed.degree }}</div>
                <div class="ocm-achievements" v-if="ed.mark">{{ ed.mark }}</div>
                <div class="ocm-thesis" v-if="ed.thesis" v-html="processContent(ed.thesis)"></div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <template #custom="{ section, processContent }">
      <div class="ocm-section">
        <div class="ocm-left-col">{{ section.title }}</div>
        <div class="ocm-right-col">
          <div v-html="processContent(section.content)"></div>
        </div>
      </div>
    </template>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from './BaseTemplate.vue'

export default {
  name: 'OneColumnModern',
  components: { BaseTemplate },
  extends: BaseTemplate,
}
</script>

<style>
.ocm-resume {
  background: var(--background-color);
  color: var(--text-color);
  font-family: var(--body-font);
  font-size: var(--base-size);
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid var(--text-color);
  min-height: 297mm;
  box-sizing: border-box;
}

/* Header */
.ocm-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--section-spacing);
  padding-bottom: var(--content-spacing);
  border-bottom: 1px solid var(--text-color);
}

.ocm-name {
  font-family: var(--heading-font);
  font-size: var(--heading-size);
  color: var(--primary-color);
  font-weight: bold;
}

.ocm-title {
  font-family: var(--heading-font);
  font-size: calc(var(--heading-size) * 0.75);
  color: var(--subtitle-text-color);
  font-weight: bold;
}

/* Section */
.ocm-section {
  display: flex;
  margin-bottom: var(--section-spacing);
  padding-bottom: var(--content-spacing);
  border-bottom: 1px solid var(--text-color);
}

.ocm-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.ocm-left-col {
  width: 25%;
  font-family: var(--heading-font);
  font-size: calc(var(--base-size));
  color: var(--primary-color);
  font-weight: bold;
  text-transform: uppercase;
  padding-right: 20px;
}

.ocm-right-col {
  width: 75%;
}

/* Experience */
.ocm-experience-item {
  margin-bottom: var(--content-spacing);
}

.ocm-job-title {
  font-family: var(--heading-font);
  font-size: var(--base-size);
  font-weight: bold;
  margin-bottom: 2px;
}

.ocm-company {
  font-size: var(--base-size);
  margin-bottom: 5px;
}

.ocm-job-desc {
  font-size: calc(var(--base-size) * 0.9);
  line-height: 1.4;
}

/* Education */
.ocm-education-item {
  margin-bottom: var(--content-spacing);
}

.ocm-degree {
  font-family: var(--heading-font);
  font-size: var(--base-size);
  font-weight: bold;
  margin-bottom: 2px;
}

.ocm-school {
  font-size: var(--base-size);
  margin-bottom: 5px;
}

.ocm-achievements {
  font-size: calc(var(--base-size) * 0.9);
  margin-bottom: 2px;
}

.ocm-thesis {
  font-size: calc(var(--base-size) * 0.9);
  line-height: 1.4;
  margin-top: 5px;
}

/* Override any inherited styles */
.ocm-resume * {
  white-space: normal;
}
</style>