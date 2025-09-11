<template>
  <BaseTemplate v-bind="$props" rootClass="ocm-resume">
    <template #layout="{ resumeData, orderedSections, processContent }">
      <div class="ocm-header">
        <div class="ocm-name">{{ resumeData.basics.name }}</div>
        <div class="ocm-title">{{ resumeData.basics.label }}</div>
      </div>

      <template v-for="section in orderedSections" :key="section.type">
        <div class="ocm-section">
          <div class="ocm-left-col">{{ section.title }}</div>
          <div class="ocm-right-col">
            <!-- Work -->
            <div v-if="section.type === 'work'">
              <div v-for="job in section.items" :key="job.name" class="ocm-experience-item">
                <div class="ocm-job-title">{{ job.position }} | {{ job.startDate }} - {{ job.endDate }}</div>
                <div class="ocm-company">{{ job.name }}</div>
                <div class="ocm-job-desc" v-html="processContent(job.summary)"></div>
              </div>
            </div>
            <!-- Education -->
            <div v-else-if="section.type === 'education'">
              <div v-for="edu in section.items" :key="edu.institution" class="ocm-education-item">
                <div class="ocm-degree">{{ edu.institution }} | {{ edu.startDate }} - {{ edu.endDate }}</div>
                <div class="ocm-school">{{ edu.studyType }} in {{ edu.area }}</div>
                <div class="ocm-achievements" v-if="edu.score">Score: {{ edu.score }}</div>
              </div>
            </div>
            <!-- Skills -->
            <div v-else-if="section.type === 'skills'">
              <div v-for="skill in section.items" :key="skill.name">
                <strong>{{ skill.name }}:</strong> {{ skill.keywords.join(', ') }}
              </div>
            </div>
            <!-- Projects -->
            <div v-else-if="section.type === 'projects'">
              <div v-for="proj in section.items" :key="proj.name">
                <div class="ocm-job-title">{{ proj.name }}</div>
                <div v-html="processContent(proj.description)"></div>
              </div>
            </div>
            <!-- Awards -->
            <div v-else-if="section.type === 'awards'">
              <div v-for="award in section.items" :key="award.title">
                <div class="ocm-job-title">{{ award.title }} - {{ award.awarder }}</div>
                <div>{{ award.date }}</div>
                <div v-html="processContent(award.summary)"></div>
              </div>
            </div>
            <!-- Volunteer -->
            <div v-else-if="section.type === 'volunteer'">
              <div v-for="item in section.items" :key="item.organization" class="ocm-experience-item">
                <div class="ocm-job-title">{{ item.position }} | {{ item.startDate }} - {{ item.endDate }}</div>
                <div class="ocm-company">{{ item.organization }}</div>
                <div class="ocm-job-desc" v-html="processContent(item.summary)"></div>
              </div>
            </div>
            <!-- Certificates -->
            <div v-else-if="section.type === 'certificates'">
              <div v-for="cert in section.items" :key="cert.name">
                <p><strong>{{ cert.name }}</strong> - {{ cert.issuer }} ({{ cert.date }})</p>
              </div>
            </div>
            <!-- Publications -->
            <div v-else-if="section.type === 'publications'">
              <div v-for="pub in section.items" :key="pub.name">
                <div class="ocm-job-title">{{ pub.name }} - {{ pub.publisher }}</div>
                <div>{{ pub.releaseDate }}</div>
                <div v-html="processContent(pub.summary)"></div>
              </div>
            </div>
            <!-- Languages -->
            <div v-else-if="section.type === 'languages'">
              <div v-for="lang in section.items" :key="lang.language">
                <p><strong>{{ lang.language }}:</strong> {{ lang.fluency }}</p>
              </div>
            </div>
            <!-- Interests -->
            <div v-else-if="section.type === 'interests'">
              <div v-for="interest in section.items" :key="interest.name">
                <p><strong>{{ interest.name }}:</strong> {{ interest.keywords.join(', ') }}</p>
              </div>
            </div>
            <!-- References -->
            <div v-else-if="section.type === 'references'">
              <div v-for="ref in section.items" :key="ref.name">
                <p><strong>{{ ref.name }}:</strong> {{ ref.reference }}</p>
              </div>
            </div>
            <!-- Default Fallback -->
            <div v-else>
              <div v-for="item in section.items" :key="item.name || item.title">
                <p>{{ item.name || item.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from './BaseTemplate.vue'

export default {
  name: 'OneColumnModern',
  components: { BaseTemplate },
  props: {
    resumeData: {
      type: Object,
      required: true
    },
    style: {
      type: Object,
      required: true
    }
  },
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

@media print {
  .ocm-resume {
    margin: 0;
    padding: 15mm;
    border: none;
    box-shadow: none;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>