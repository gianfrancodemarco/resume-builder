<template>
  <div id="printable-area">
    <div class="resume-preview" :style="resumeStyle">
      <div class="preview-container">
        <div class="container" :class="{ 'sidebar-left': sidebarPosition === 'left' }">
          <div class="sidebar">
            <div v-if="resumeData.personal.visible">
              <h2>About me</h2>
              <p class="subsubtitle" v-for="(t, i) in resumeData.personal.about" :key="i">{{ t }}</p>
            </div>
            <div v-if="resumeData.personal.detailsVisible">
              <h2>Details</h2>
              <p v-for="(detail, index) in resumeData.personal.details" :key="index">
                <template v-if="detail.isLink">
                  <a :href="detail.value" target="_blank">{{ detail.value }}</a>
                </template>
                <template v-else>
                  {{ detail.value }}
                </template>
              </p>
            </div>
            <div v-if="resumeData.personal.linksVisible && resumeData.personal.links.length">
              <h2>Links</h2>
              <a v-for="(l, i) in resumeData.personal.links" :key="i" :href="l" target="_blank">{{ l }}</a>
            </div>
            <div v-if="resumeData.skillsVisible && resumeData.skills.length">
              <h2>Skills</h2>
              <p class="skills-list"><span v-for="(s, i) in resumeData.skills" :key="i">{{ s }}<br /></span></p>
            </div>
            <div v-if="resumeData.languagesVisible && resumeData.languages.length">
              <h2>Languages</h2>
              <div class="language-proficiency" v-for="(l, i) in resumeData.languages" :key="i">
                <div class="language-proficiency-label">{{ l.name }}</div>
                <div class="language-proficiency-bar">
                  <div class="language-proficiency-bar-fill" :style="{ width: l.proficiency + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="content">
            <h1>{{ resumeData.personal.name || 'Your Name' }}</h1>
            <h2 class="subtitle">{{ resumeData.personal.title }}</h2>

            <div class="section" v-if="resumeData.experiencesVisible && resumeData.experiences.length">
              <h2>Employment History</h2>
              <div v-for="(e, i) in resumeData.experiences" :key="i">
                <p class="job-title">{{ e.title }}</p>
                <p class="date">{{ e.period }}</p>
                <p class="job-desc" v-html="e.description"></p>
              </div>
            </div>

            <div class="section" v-if="resumeData.educationVisible && resumeData.education.length">
              <h2>Education</h2>
              <div v-for="(ed, i) in resumeData.education" :key="i">
                <p class="job-title">{{ ed.degree }}</p>
                <p class="date">{{ ed.period }}</p>
                <p class="graduation-mark">{{ ed.mark }}</p>
                <p class="thesis">{{ ed.thesis }}</p>
              </div>
            </div>
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
  computed: {
    resumeStyle() {
      return {
        '--primary-color': this.style.colors.primary,
        '--text-color': this.style.colors.text,
        '--background-color': this.style.colors.background,
        '--sidebar-color': this.style.colors.sidebar || this.style.colors.primary,
        '--link-color': this.style.colors.link || this.style.colors.primary,
        '--heading-font': this.style.typography.headingFont,
        '--body-font': this.style.typography.bodyFont,
        '--base-size': `${this.style.typography.baseSize}px`,
        '--heading-size': `${this.style.typography.headingSize}px`,
        '--section-spacing': `${this.style.spacing.section}px`,
        '--content-spacing': `${this.style.spacing.content}px`,
        '--sidebar-width': `${this.style.spacing.sidebarWidth || 280}px`
      }
    }
  }
}
</script>

<style>
#printable-area {
  margin: auto;
  width: 210mm;
  min-height: 297mm;
  padding: 0;
  background-color: black !important;
}

.resume-preview {
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: var(--body-font);
  font-size: var(--base-size);
  line-height: 1.6;
  padding: 0;
  overflow: hidden;
}

.resume-preview h1,
.resume-preview h2,
.resume-preview h3 {
  color: var(--primary-color);
  font-family: var(--heading-font);
  font-size: var(--heading-size);
  margin-bottom: var(--content-spacing);
}

.resume-preview .section {
  margin-bottom: var(--section-spacing);
}

.resume-preview .section-content {
  margin-top: var(--content-spacing);
}

.preview-container {
  width: 100%;
  min-height: 100%;
  margin: 0;
  background-color: var(--background-color, #f9f9f9);
  color: var(--text-color, #08294D);
  font-family: var(--body-font, 'Lato', sans-serif);
  padding: 0;
}

.container {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  margin: 0;
  padding: 0;
  background: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.container.sidebar-left {
  flex-direction: row;
}

.sidebar {
  width: var(--sidebar-width, 280px);
  min-width: var(--sidebar-width, 280px);
  max-width: var(--sidebar-width, 280px);
  background-color: var(--sidebar-color, #08294D);
  color: #eee;
  font-weight: 400;
  min-height: 297mm;
  padding: 28px 28px 48px 28px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

.sidebar h1,
.sidebar h2 {
  font-family: var(--heading-font, 'Oswald', sans-serif);
  font-size: 1em;
  margin-bottom: 6px;
  border-bottom: 2px solid #ffffff33;
  padding-bottom: 3px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #fff;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.sidebar a {
  color: var(--link-color, #eee);
  text-decoration: underline;
  display: block;
  margin-bottom: 3px;
  font-size: 0.9em;
  opacity: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.sidebar a:hover {
  opacity: 0.8;
}

.sidebar div:first-child {
  margin-top: 0;
}

.sidebar div {
  margin-bottom: 6px;
  font-size: 0.9em;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.sidebar p {
  margin: 0 0 4px 0;
  font-size: 0.85em;
  line-height: 1.4;
  font-weight: 100;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.sidebar .subsubtitle {
  font-size: 0.75em;
  font-weight: 400;
  color: #eee;
  margin: 8px 0 0 0;
  text-transform: none;
  font-style: italic;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.content {
  width: 72%;
  padding: 16px 48px 64px 48px;
  background: var(--background-color, #fff);
  color: var(--text-color, #08294D);
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

.content h1,
.content h2,
.content p,
.content .job-title,
.content .job-desc,
.content strong,
.content span {
  color: var(--text-color, #08294D);
  font-family: var(--body-font, 'Lato', sans-serif);
}

.content .date {
  color: #aaa;
}

.content a {
  color: var(--link-color, #0b7dda);
  text-decoration: underline;
}

.content h1 {
  font-family: var(--heading-font, 'Oswald', sans-serif);
  font-size: var(--heading-size, 1.6em);
  margin-bottom: 0;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--primary-color, #08294D);
}

.content .subtitle {
  font-size: calc(var(--base-size, 16px) * 0.75);
  padding-left: 0px;
  color: #aaa;
}

.content h2 {
  font-family: var(--heading-font, 'Oswald', sans-serif);
  font-weight: 600;
  font-size: calc(var(--heading-size, 24px) * 0.56);
  letter-spacing: 2px;
  margin-top: 6px;
  margin-bottom: 0;
  text-transform: uppercase;
  color: var(--primary-color, #08294D);
}

.section {
  margin-top: 24px;
}

.section h2 {
  font-family: var(--heading-font, 'Oswald', sans-serif);
  font-size: var(--heading-size, 1em);
  margin-bottom: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.job-title {
  font-family: var(--heading-font, 'Oswald', sans-serif);
  font-weight: 700;
  margin-top: 20px;
  margin-bottom: 0;
  font-size: calc(var(--heading-size, 24px) * 0.5);
}

.date {
  text-transform: uppercase;
  font-size: calc(var(--base-size, 16px) * 0.7);
  font-weight: 600;
  margin-top: 0;
  display: inline-block;
}

.job-desc {
  margin-top: 0;
}

p,
li {
  font-family: var(--body-font, 'Lato', sans-serif);
  font-size: calc(var(--base-size, 16px) * 0.75);
  line-height: 1.5;
  margin-bottom: 6px;
}

.language-proficiency {
  display: block;
}

.language-proficiency-label {
  font-size: 0.75em;
  line-height: 1.2;
}

.language-proficiency-bar {
  flex-grow: 1;
  height: 8px;
  background-color: #526A82;
  border-radius: 4px;
  overflow: hidden;
  max-width: 250px;
  margin-bottom: 8px;
}

.language-proficiency-bar-fill {
  height: 100%;
  background-color: #ffffff;
  border-radius: 4px;
}

.thesis {
  font-style: italic;
  font-size: 0.7em;
  color: #666;
  margin: 2px 0;
}

.graduation-mark {
  font-size: 0.7em;
  color: #666;
  margin: 0 0 0 8px;
  display: inline-block;
}

.resume-preview .section .job-title,
.resume-preview .section .job-desc,
.resume-preview .section .date,
.resume-preview .section .graduation-mark,
.resume-preview .section .thesis,
.resume-preview .section p,
.resume-preview .section li {
  margin-bottom: var(--content-spacing);
}
</style>