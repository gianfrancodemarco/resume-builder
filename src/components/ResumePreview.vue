<template>
  <div class="preview-container">
    <div class="container">
      <div class="sidebar">
        <div v-if="resumeData.personal.visible">
          <h2>About me</h2>
          <p class="subsubtitle" v-for="(t, i) in resumeData.personal.about" :key="i">{{ t }}</p>
        </div>
        <div v-if="resumeData.personal.detailsVisible">
          <h2>Details</h2>
          <p>{{ resumeData.personal.location }}<br />
            <a :href="'mailto:' + resumeData.personal.email">{{ resumeData.personal.email }}</a>
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
</template>

<script>
export default {
  props: { resumeData: Object }
}
</script>

<style scoped>
@page {
  size: A4;
  margin: 0;
}

.preview-container {
  margin: 0;
  font-family: 'Lato', sans-serif;
  background-color: #f9f9f9;
  color: #08294D;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 0;
}

.container {
  display: flex;
  flex-direction: row-reverse;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.sidebar {
  background-color: #08294D;
  color: #eee;
  font-weight: 400;
  width: 28%;
  padding: 28px 28px 48px 28px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.sidebar h2 {
  font-family: 'Oswald', sans-serif;
  font-size: 1em;
  margin-bottom: 6px;
  border-bottom: 2px solid #ffffff33;
  padding-bottom: 3px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #fff;
}

.sidebar a {
  color: #eee !important;
  text-decoration: underline;
  display: block;
  margin-bottom: 3px;
  font-size: 0.9em;
  opacity: 1;
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
}

.sidebar p {
  margin: 0 0 4px 0;
  font-size: 0.85em;
  line-height: 1.4;
  font-weight: 100;
}

.sidebar .subsubtitle {
  font-size: 0.75em;
  font-weight: 400;
  color: #eee;
  margin: 8px 0 0 0;
  text-transform: none;
  font-style: italic;
  line-height: 1.4;
}

.content {
  width: 72%;
  padding: 16px 48px 64px 48px;
  background: #fff;
  color: #08294D;
}

.content h1,
.content h2,
.content p,
.content .job-title,
.content .job-desc,
.content strong,
.content span {
  color: #08294D;
}

.content .date {
  color: #aaa;
}

.content a {
  color: #0b7dda;
  text-decoration: underline;
}

.content h1 {
  font-family: 'Oswald', sans-serif;
  font-size: 1.6em;
  margin-bottom: 0;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.content .subtitle {
  font-size: 0.75em;
  padding-left: 3px;
  color: #aaa;
}

.content h2 {
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 0.9em;
  letter-spacing: 2px;
  margin-top: 6px;
  margin-bottom: 0;
  text-transform: uppercase;
}

.section {
  margin-top: 24px;
}

.section h2 {
  font-family: 'Oswald', sans-serif;
  font-size: 1em;
  margin-bottom: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.job-title {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  margin-top: 20px;
  margin-bottom: 0;
  font-size: 0.8em;
}

.date {
  text-transform: uppercase;
  font-size: 0.7em;
  font-weight: 600;
  margin-top: 0;
  display: inline-block;
}

.job-desc {
  margin-top: 0;
}

p,
li {
  font-family: 'Lato', sans-serif;
  font-size: 0.75em;
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

@media print {
  .container {
    width: 210mm;
    height: 297mm;
    padding: 20mm;
    margin: 0;
  }
}
</style>