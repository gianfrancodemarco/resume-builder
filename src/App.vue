<template>
  <v-app>
    <v-app-bar color="primary" elevation="1">
      <v-app-bar-title class="text-h5 font-weight-bold">Resume Builder</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-github" variant="text" href="https://github.com/gianfrancodemarco/resume-builder"
        target="_blank"></v-btn>
    </v-app-bar>

    <v-main class="app-background">
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <v-col cols="12" md="4" lg="3">
            <ResumeEditor v-model:resume-data="resumeData" v-model:style="styleData" @update:style="updateStyle" />
          </v-col>
          <v-col cols="12" md="8" lg="9" class="preview-container">
            <div class="preview-wrapper">
              <ResumePreview :resume-data="resumeData" :style-data="styleData" download-id="resume-preview" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <div class="download-buttons">
      <v-tooltip text="Preview" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-eye" color="primary" @click="showFullPreview = true" class="mr-2 download-btn"
            elevation="2" />
        </template>
      </v-tooltip>
      <v-tooltip text="Download as PDF" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-file-pdf-box" color="primary" @click="downloadPDF" class="mr-2 download-btn"
            elevation="2" />
        </template>
      </v-tooltip>
      <v-tooltip text="Download as HTML" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-file-code" color="primary" @click="downloadHTML" class="download-btn"
            elevation="2" />
        </template>
      </v-tooltip>
    </div>

    <!-- Preview Modal -->
    <v-dialog v-model="showFullPreview" max-width="90vw" class="preview-dialog">
      <v-card class="preview-card">
        <v-card-text class="preview-content pa-0">
          <div class="floating-actions">
            <div class="d-flex align-center">
              <v-btn icon="mdi-close" variant="text" @click="showFullPreview = false" color="white"></v-btn>
              <v-divider vertical class="mx-2" color="white"></v-divider>
              <div class="zoom-controls">
                <v-btn icon="mdi-magnify-minus" variant="text" @click="zoomOut" color="white"
                  :disabled="zoomLevel <= 0.5"></v-btn>
                <span class="text-white mx-2">{{ Math.round(zoomLevel * 100) }}%</span>
                <v-btn icon="mdi-magnify-plus" variant="text" @click="zoomIn" color="white"
                  :disabled="zoomLevel >= 2"></v-btn>
              </div>
            </div>
          </div>
          <div class="preview-wrapper" :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'center top' }">
            <ResumePreview :resume-data="resumeData" :style-data="styleData" />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, watch } from 'vue'
import ResumeEditor from './components/ResumeEditor.vue'
import ResumePreview from './components/ResumePreview.vue'
import html2pdf from 'html2pdf.js'

const showFullPreview = ref(false)
const zoomLevel = ref(1)

const resumeData = ref({
  personal: {
    name: 'John Doe',
    title: 'Software Engineer',
    about: [
      'Passionate software engineer with a strong focus on web development and user experience. Experienced in building modern, responsive applications using Vue.js and other cutting-edge technologies.',
      'Skilled in both frontend and backend development, with a particular emphasis on creating intuitive user interfaces and robust server-side solutions.'
    ],
    location: 'New York, USA',
    email: 'john.doe@example.com',
    links: [
      'https://github.com/johndoe',
      'https://linkedin.com/in/johndoe'
    ],
    visible: true,
    detailsVisible: true,
    linksVisible: true
  },
  skills: [
    'Vue.js',
    'JavaScript',
    'TypeScript',
    'HTML/CSS',
    'Node.js',
    'Python',
    'Git',
    'Docker'
  ],
  languages: [
    { name: 'Italian', proficiency: 100 },
    { name: 'English', proficiency: 90 },
    { name: 'Spanish', proficiency: 70 }
  ],
  experiences: [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Inc. - Milan',
      period: '2020 - Present',
      description: 'Led the development of enterprise-level web applications using Vue.js and Node.js. Implemented CI/CD pipelines and improved application performance by 40%.'
    },
    {
      title: 'Full Stack Developer',
      company: 'Digital Innovations - Rome',
      period: '2018 - 2020',
      description: 'Developed and maintained multiple web applications. Collaborated with UX designers to implement responsive interfaces and improve user experience.'
    }
  ],
  education: [
    {
      degree: 'Master in Computer Science',
      period: '2016 - 2018',
      mark: '110/110',
      thesis: 'Advanced Web Development Techniques and Best Practices'
    },
    {
      degree: 'Bachelor in Computer Engineering',
      period: '2013 - 2016',
      mark: '108/110',
      thesis: 'Introduction to Modern Web Technologies'
    }
  ],
  skillsVisible: true,
  languagesVisible: true,
  experiencesVisible: true,
  educationVisible: true
})

const styleData = ref({
  colors: {
    primary: '#08294D',
    text: '#08294D',
    background: '#ffffff',
    sidebar: '#08294D',
    link: '#ffffff'
  },
  typography: {
    headingFont: 'Oswald',
    bodyFont: 'Lato',
    baseSize: 16,
    headingSize: 26
  },
  spacing: {
    section: 24,
    content: 12
  }
})

const zoomIn = () => {
  if (zoomLevel.value < 2) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2)
  }
}

const zoomOut = () => {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5)
  }
}

// Reset zoom when closing modal
watch(showFullPreview, (newVal) => {
  if (!newVal) {
    zoomLevel.value = 1
  }
})

const downloadPDF = () => {
  const element = document.getElementById('resume-preview')
  const opt = {
    margin: 0,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }
  html2pdf().set(opt).from(element).save()
}

const downloadHTML = () => {
  const element = document.getElementById('resume-preview')
  const html = element.outerHTML
  const blob = new Blob([html], { type: 'text/html' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'resume.html'
  a.click()
  window.URL.revokeObjectURL(url)
}

const updateStyle = (newStyle) => {
  styleData.value = newStyle
}
</script>

<style>
.app-background {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.download-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 100;
}

.download-btn {
  transition: transform 0.2s ease-in-out;
}

.download-btn:hover {
  transform: translateY(-2px);
}

:deep(.v-app-bar) {
  backdrop-filter: blur(10px);
  background-color: rgba(var(--v-theme-primary), 0.95) !important;
}

:deep(.v-main) {
  padding-top: 64px;
}

.preview-dialog {
  :deep(.v-overlay__content) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.preview-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.preview-content {
  position: relative;
  overflow-y: auto;
  max-height: 90vh;
  padding-top: 80px;
  display: flex;
  justify-content: center;
}

.preview-wrapper {
  height: 100vh;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding: 48px;
}

.preview-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.floating-actions {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 2;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.v-overlay__scrim) {
  opacity: 0.8 !important;
}

:deep(.v-btn--disabled) {
  opacity: 0.5 !important;
}
</style>
