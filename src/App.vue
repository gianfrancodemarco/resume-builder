<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>Resume Builder</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-4">
        <v-row>
          <v-col cols="8" class="pa-2">
            <ResumePreview :resume-data="resumeData" />
          </v-col>
          <v-col cols="4" class="pa-2">
            <ResumeEditor v-model:resume-data="resumeData" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <div class="download-buttons">
      <v-tooltip text="Download as PDF" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-file-pdf-box" color="primary" @click="downloadPDF" class="mr-2" />
        </template>
      </v-tooltip>
      <v-tooltip text="Download as HTML" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-file-code" color="primary" @click="downloadHTML" />
        </template>
      </v-tooltip>
    </div>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import ResumeEditor from './components/ResumeEditor.vue'
import ResumePreview from './components/ResumePreview.vue'
import html2pdf from 'html2pdf.js'

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
</script>

<style>
.download-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 100;
}
</style>
