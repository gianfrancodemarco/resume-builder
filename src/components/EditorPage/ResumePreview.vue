<template>
  <div id="printable-area">
    <div class="resume-preview" :style="resumeStyle">
      <div class="preview-container">
        <div class="container" :class="{ 'sidebar-left': sidebarPosition === 'left' }">
          <div class="sidebar">
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
          <div class="language-proficiency">
            <div class="language-proficiency-label">${name}</div>
            <div class="language-proficiency-bar">
              <div class="language-proficiency-bar-fill" style="width: ${proficiency}%"></div>
            </div>
          </div>
        `
      })
    }
  },
  computed: {
    resumeStyle() {
      const { colors, typography, spacing } = this.style
      return {
        '--primary-color': colors.primary,
        '--text-color': colors.text,
        '--background-color': colors.background,
        '--sidebar-color': colors.sidebar || colors.primary,
        '--link-color': colors.link || colors.primary,
        '--heading-font': typography.headingFont,
        '--body-font': typography.bodyFont,
        '--base-size': `${typography.baseSize}px`,
        '--heading-size': `${typography.headingSize}px`,
        '--section-spacing': `${spacing.section}px`,
        '--content-spacing': `${spacing.content}px`,
        '--sidebar-width': `${spacing.sidebarWidth || 280}px`
      }
    },
    visibleCustomSections() {
      return this.resumeData.customSections.filter(s => s && s.visible !== false)
    },
    sidebarCustomSections() {
      return this.visibleCustomSections.filter(s => s.position === 'sidebar')
    },
    mainCustomSections() {
      return this.visibleCustomSections.filter(s => s.position === 'main')
    }
  }
}
</script>

<style>
@media screen {
  #printable-area {
    margin: auto;
    width: 210mm;
    background-color: #f5f5f5;
  }
}

@media print {
  @page {
    size: A4;
    margin: 0;
  }

  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
  }

  #printable-area {
    margin: 0;
    padding: 0;
    width: 210mm;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .sidebar {
    position: relative;
    background-color: var(--sidebar-color) !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .sidebar::before {
    content: '';
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: var(--sidebar-width);
    background-color: var(--sidebar-color);
    z-index: -1;
  }

  .container.sidebar-left .sidebar::before {
    right: auto;
    left: 0;
  }

  .content {
    position: relative;
    z-index: 1;
  }
}

.resume-preview {
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: var(--body-font) !important;
  font-size: var(--base-size);
  line-height: 1.6;
  padding: 0;
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
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: var(--body-font);
  padding: 0;
}

.container {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  margin: 0;
  padding: 0;
  background: var(--sidebar-color);
  overflow: hidden;
}

.container.sidebar-left {
  flex-direction: row;
}

.sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  max-width: var(--sidebar-width);
  background-color: var(--sidebar-color);
  color: #eee;
  font-weight: 400;
  min-height: 297mm;
  padding: 28px 28px 48px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  position: relative;
}

.sidebar h1,
.sidebar h2 {
  font-family: var(--heading-font);
  font-size: 1em;
  margin: 16px 0 6px;
  border-bottom: 2px solid #ffffff33;
  padding-bottom: 3px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #fff;
  word-wrap: break-word;
}

.sidebar h1:first-child,
.sidebar h2:first-child {
  margin-top: 0;
}

.sidebar a {
  color: var(--link-color);
  text-decoration: underline;
  display: block;
  margin-bottom: 3px;
  font-size: 0.9em;
  opacity: 1;
  word-wrap: break-word;
}

.sidebar a:hover {
  opacity: 0.8;
}

.sidebar div {
  margin-bottom: 6px;
  font-size: 0.9em;
  word-wrap: break-word;
}

.sidebar p {
  margin: 0 0 4px;
  font-size: 0.85em;
  line-height: 1.4;
  font-weight: 100;
  word-wrap: break-word;
}

.sidebar .subsubtitle {
  font-size: 0.75em;
  font-weight: 400;
  color: #eee;
  margin: 8px 0 0;
  font-style: italic;
  line-height: 1.4;
  font-family: var(--body-font);
}

.content {
  width: calc(100% - var(--sidebar-width));
  background: var(--background-color);
  color: var(--text-color);
  gap: var(--content-spacing);
  overflow-wrap: break-word;
  display: flex;
  flex-direction: column;
  padding: 16px 48px 64px;
  white-space: pre-wrap;
}

.content h1,
.content h2,
.content p,
.content .job-desc,
.content strong,
.content span {
  color: var(--text-color);
}

.content h1,
.content h2 {
  font-family: var(--heading-font);
  color: var(--primary-color);
}

.content p,
.content .job-desc,
.content strong,
.content span {
  font-family: var(--body-font);
}

.content .date {
  color: #aaa;
}

.content a {
  color: var(--link-color);
  text-decoration: underline;
}

.content h1 {
  margin-bottom: 0;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.content .subtitle {
  font-size: calc(var(--base-size) * 0.75);
  color: #aaa;
  margin-top: 4px;
}

.content h2 {
  font-weight: 600;
  font-size: calc(var(--heading-size) * 0.56);
  letter-spacing: 2px;
  margin: 0;
  text-transform: uppercase;
}

/* Sections */
.section {
  margin-top: 0;
  display: flex;
  flex-direction: column;
  gap: var(--content-spacing);
}

.section>div {
  display: flex;
  flex-direction: column;
  gap: calc(var(--content-spacing) * 0.5);
}

.job-title {
  font-family: var(--heading-font);
  font-weight: 700;
  margin: 0;
  font-size: calc(var(--heading-size) * 0.5);
}

.date {
  text-transform: uppercase;
  font-size: calc(var(--base-size) * 0.7);
  font-weight: 600;
  margin: 0;
  display: inline-block;
  color: #aaa;
}

.job-desc {
  margin: 0;
  white-space: pre-wrap;
}

p,
li {
  font-family: var(--body-font);
  font-size: calc(var(--base-size) * 0.75);
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
}

.language-proficiency {
  display: block;
}

.language-proficiency-label {
  font-size: calc(var(--base-size) * 0.75);
  line-height: 1.2;
}

.language-proficiency-bar {
  height: 8px;
  background-color: #526A82;
  border-radius: 4px;
  overflow: hidden;
  max-width: 250px;
  margin-bottom: 8px;
}

.language-proficiency-bar-fill {
  height: 100%;
  background-color: #fff;
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

.school {
  font-size: calc(var(--base-size) * 0.75);
  color: #666;
  margin: 0 0 4px;
  font-style: italic;
}

/* Custom sections styling to match original sections */
.resume-preview .custom-section h2 {
  font-family: var(--heading-font);
  font-size: var(--heading-size);
  margin-bottom: var(--content-spacing);
  color: var(--primary-color);
}

.resume-preview .custom-section p {
  font-family: var(--body-font);
  font-size: var(--base-size);
  line-height: 1.6;
  margin-bottom: var(--content-spacing);
}

.resume-preview .custom-section .skills-list {
  font-size: var(--base-size);
  line-height: 1.6;
}

.resume-preview .custom-section .skills-list span {
  display: block;
  margin-bottom: 4px;
}

.resume-preview .custom-section .language-proficiency {
  margin-bottom: var(--content-spacing);
}

.resume-preview .custom-section .language-proficiency-label {
  font-size: calc(var(--base-size) * 0.75);
  line-height: 1.2;
  margin-bottom: 4px;
}

.resume-preview .custom-section .language-proficiency-bar {
  height: 8px;
  background-color: var(--sidebar-color);
  border-radius: 4px;
  overflow: hidden;
  max-width: 250px;
  margin-bottom: 8px;
}

.resume-preview .custom-section .language-proficiency-bar-fill {
  height: 100%;
  background-color: #ffffff;
  border-radius: 4px;
}

.resume-preview .custom-section .subsubtitle {
  font-style: italic;
  font-size: var(--base-size);
  line-height: 1.6;
  margin-bottom: var(--content-spacing);
}

.resume-preview .custom-section a {
  color: var(--link-color);
  text-decoration: none;
}

.resume-preview .custom-section a:hover {
  text-decoration: underline;
}
</style>