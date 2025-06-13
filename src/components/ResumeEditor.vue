<template>
  <div class="editor-card">
    <v-tabs v-model="activeTab" color="primary" class="editor-tabs">
      <v-tab value="info">
        <v-icon icon="mdi-account" class="mr-2" />
        Info
      </v-tab>
      <v-tab value="style">
        <v-icon icon="mdi-palette" class="mr-2" />
        Style
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab" class="editor-window">
      <v-window-item value="info">
        <v-expansion-panels class="editor-panels" multiple>
          <!-- Personal / Sidebar -->
          <v-expansion-panel class="editor-panel">
            <v-expansion-panel-title class="panel-title">
              <v-icon icon="mdi-account" class="mr-2" />
              About Me
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="d-flex justify-end mb-4">
                <v-switch v-model="local.personal.visible" label="Show section" hide-details density="compact"
                  color="primary" />
              </div>
              <v-text-field v-model="local.personal.name" label="Name" :disabled="!local.personal.visible"
                variant="outlined" density="comfortable" class="mb-2" />
              <v-text-field v-model="local.personal.title" label="Title" :disabled="!local.personal.visible"
                variant="outlined" density="comfortable" class="mb-2" />
              <v-textarea v-model="local.personal.about[0]" label="Description 1" :disabled="!local.personal.visible"
                variant="outlined" density="comfortable" class="mb-2" />
              <v-textarea v-model="local.personal.about[1]" label="Description 2" :disabled="!local.personal.visible"
                variant="outlined" density="comfortable" />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel class="editor-panel">
            <v-expansion-panel-title class="panel-title">
              <v-icon icon="mdi-card-account-details" class="mr-2" />
              Details
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="d-flex justify-end mb-4">
                <v-switch v-model="local.personal.detailsVisible" label="Show section" hide-details density="compact"
                  color="primary" />
              </div>
              <v-text-field v-model="local.personal.location" label="Location"
                :disabled="!local.personal.detailsVisible" variant="outlined" density="comfortable" class="mb-2" />
              <v-text-field v-model="local.personal.email" label="Email" :disabled="!local.personal.detailsVisible"
                variant="outlined" density="comfortable" />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel class="editor-panel">
            <v-expansion-panel-title class="panel-title">
              <v-icon icon="mdi-link-variant" class="mr-2" />
              Links
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="d-flex justify-end mb-4">
                <v-switch v-model="local.personal.linksVisible" label="Show section" hide-details density="compact"
                  color="primary" />
              </div>
              <div v-for="(link, index) in local.personal.links" :key="index" class="d-flex align-center mb-2">
                <v-text-field v-model="local.personal.links[index]" label="Link" readonly
                  :disabled="!local.personal.linksVisible" variant="outlined" density="comfortable" />
                <v-btn icon="mdi-delete" color="error" variant="text" @click="removeLink(index)" class="ml-2"
                  :disabled="!local.personal.linksVisible" />
              </div>
              <v-text-field v-model="link" label="Add link (url)" :disabled="!local.personal.linksVisible"
                variant="outlined" density="comfortable" class="mb-2" />
              <v-btn color="primary" @click="addLink" :disabled="!local.personal.linksVisible"
                prepend-icon="mdi-plus">Add
                Link</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel class="editor-panel">
            <v-expansion-panel-title class="panel-title">
              <v-icon icon="mdi-tools" class="mr-2" />
              Skills
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="d-flex justify-end mb-4">
                <v-switch v-model="local.skillsVisible" label="Show section" hide-details density="compact"
                  color="primary" />
              </div>
              <div v-for="(skill, index) in local.skills" :key="index" class="d-flex align-center mb-2">
                <v-text-field v-model="local.skills[index]" label="Skill" readonly :disabled="!local.skillsVisible"
                  variant="outlined" density="comfortable" />
                <v-btn icon="mdi-delete" color="error" variant="text" @click="removeSkill(index)" class="ml-2"
                  :disabled="!local.skillsVisible" />
              </div>
              <v-text-field v-model="skill" label="Skill" :disabled="!local.skillsVisible" variant="outlined"
                density="comfortable" class="mb-2" />
              <v-btn color="primary" @click="addSkill" :disabled="!local.skillsVisible" prepend-icon="mdi-plus">Add
                Skill</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel class="editor-panel">
            <v-expansion-panel-title class="panel-title">
              <v-icon icon="mdi-translate" class="mr-2" />
              Languages
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="d-flex justify-end mb-4">
                <v-switch v-model="local.languagesVisible" label="Show section" hide-details density="compact"
                  color="primary" />
              </div>
              <div v-for="(lang, index) in local.languages" :key="index" class="d-flex align-center mb-2">
                <v-text-field v-model="local.languages[index].name" label="Language" readonly
                  :disabled="!local.languagesVisible" variant="outlined" density="comfortable" />
                <v-text-field v-model="local.languages[index].proficiency" label="Proficiency (%)" readonly class="mx-2"
                  :disabled="!local.languagesVisible" variant="outlined" density="comfortable" />
                <v-btn icon="mdi-delete" color="error" variant="text" @click="removeLang(index)" class="ml-2"
                  :disabled="!local.languagesVisible" />
              </div>
              <v-text-field v-model="lang.name" label="Language" :disabled="!local.languagesVisible" variant="outlined"
                density="comfortable" class="mb-2" />
              <v-text-field v-model="lang.proficiency" label="Proficiency (%)" :disabled="!local.languagesVisible"
                variant="outlined" density="comfortable" class="mb-2" />
              <v-btn color="primary" @click="addLang" :disabled="!local.languagesVisible" prepend-icon="mdi-plus">Add
                Language</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel class="editor-panel">
            <v-expansion-panel-title class="panel-title">
              <v-icon icon="mdi-briefcase" class="mr-2" />
              Experience
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="d-flex justify-end mb-4">
                <v-switch v-model="local.experiencesVisible" label="Show section" hide-details density="compact"
                  color="primary" />
              </div>
              <div v-for="(exp, index) in local.experiences" :key="index" class="mb-4 experience-card pa-3">
                <div class="d-flex align-center mb-2">
                  <v-text-field v-model="local.experiences[index].title" label="Job title" readonly
                    :disabled="!local.experiencesVisible" variant="outlined" density="comfortable" />
                  <v-btn icon="mdi-delete" color="error" variant="text" @click="removeExp(index)" class="ml-2"
                    :disabled="!local.experiencesVisible" />
                </div>
                <v-text-field v-model="local.experiences[index].company" label="Company (+ location)" readonly
                  :disabled="!local.experiencesVisible" variant="outlined" density="comfortable" class="mb-2" />
                <v-text-field v-model="local.experiences[index].period" label="Period" readonly
                  :disabled="!local.experiencesVisible" variant="outlined" density="comfortable" class="mb-2" />
                <v-textarea v-model="local.experiences[index].description" label="Description" readonly
                  :disabled="!local.experiencesVisible" variant="outlined" density="comfortable" />
              </div>
              <v-text-field v-model="exp.title" label="Job title" :disabled="!local.experiencesVisible"
                variant="outlined" density="comfortable" class="mb-2" />
              <v-text-field v-model="exp.company" label="Company (+ location)" :disabled="!local.experiencesVisible"
                variant="outlined" density="comfortable" class="mb-2" />
              <v-text-field v-model="exp.period" label="Period" :disabled="!local.experiencesVisible" variant="outlined"
                density="comfortable" class="mb-2" />
              <v-textarea v-model="exp.description" label="Description" :disabled="!local.experiencesVisible"
                variant="outlined" density="comfortable" class="mb-2" />
              <v-btn color="primary" @click="addExp" :disabled="!local.experiencesVisible" prepend-icon="mdi-plus">Add
                Experience</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel class="editor-panel">
            <v-expansion-panel-title class="panel-title">
              <v-icon icon="mdi-school" class="mr-2" />
              Education
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="d-flex justify-end mb-4">
                <v-switch v-model="local.educationVisible" label="Show section" hide-details density="compact"
                  color="primary" />
              </div>
              <div v-for="(edu, index) in local.education" :key="index" class="mb-4 education-card pa-3">
                <div class="d-flex align-center mb-2">
                  <v-text-field v-model="local.education[index].degree" label="Degree" readonly
                    :disabled="!local.educationVisible" variant="outlined" density="comfortable" />
                  <v-btn icon="mdi-delete" color="error" variant="text" @click="removeEdu(index)" class="ml-2"
                    :disabled="!local.educationVisible" />
                </div>
                <v-text-field v-model="local.education[index].period" label="Period" readonly
                  :disabled="!local.educationVisible" variant="outlined" density="comfortable" class="mb-2" />
                <v-text-field v-model="local.education[index].mark" label="Grade" readonly
                  :disabled="!local.educationVisible" variant="outlined" density="comfortable" class="mb-2" />
                <v-textarea v-model="local.education[index].thesis" label="Thesis / Notes" readonly
                  :disabled="!local.educationVisible" variant="outlined" density="comfortable" />
              </div>
              <v-text-field v-model="edu.degree" label="Degree" :disabled="!local.educationVisible" variant="outlined"
                density="comfortable" class="mb-2" />
              <v-text-field v-model="edu.period" label="Period" :disabled="!local.educationVisible" variant="outlined"
                density="comfortable" class="mb-2" />
              <v-text-field v-model="edu.mark" label="Grade" :disabled="!local.educationVisible" variant="outlined"
                density="comfortable" class="mb-2" />
              <v-textarea v-model="edu.thesis" label="Thesis / Notes" :disabled="!local.educationVisible"
                variant="outlined" density="comfortable" class="mb-2" />
              <v-btn color="primary" @click="addEdu" :disabled="!local.educationVisible" prepend-icon="mdi-plus">Add
                Education</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-window-item>

      <v-window-item value="style">
        <ResumeStyle v-model:style-data="styleData" @update:style-data="updateStyle" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import ResumeStyle from './ResumeStyle.vue'

export default {
  components: {
    ResumeStyle
  },
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
  emits: ['update:resume-data', 'update:style'],
  data() {
    return {
      activeTab: 'info',
      styleData: JSON.parse(JSON.stringify(this.style)),
      local: this.resumeData,
      link: '',
      skill: '',
      lang: { name: '', proficiency: 100 },
      exp: { title: '', company: '', period: '', description: '' },
      edu: { degree: '', period: '', mark: '', thesis: '' }
    }
  },
  watch: {
    local: {
      handler(newVal) {
        this.$emit('update:resume-data', newVal)
      },
      deep: true
    },
    style: {
      handler(newVal) {
        this.styleData = JSON.parse(JSON.stringify(newVal))
      },
      deep: true
    }
  },
  methods: {
    updateStyle(newStyle) {
      this.styleData = newStyle
      this.$emit('update:style', JSON.parse(JSON.stringify(newStyle)))
    },
    addLink() {
      if (this.link) {
        this.local.personal.links.push(this.link)
        this.link = ''
      }
    },
    removeLink(index) {
      this.local.personal.links.splice(index, 1)
    },
    addSkill() {
      if (this.skill) {
        this.local.skills.push(this.skill)
        this.skill = ''
      }
    },
    removeSkill(index) {
      this.local.skills.splice(index, 1)
    },
    addLang() {
      if (this.lang.name) {
        this.local.languages.push({ ...this.lang })
        this.lang = { name: '', proficiency: 100 }
      }
    },
    removeLang(index) {
      this.local.languages.splice(index, 1)
    },
    addExp() {
      if (this.exp.title) {
        this.local.experiences.push({ ...this.exp })
        this.exp = { title: '', company: '', period: '', description: '' }
      }
    },
    removeExp(index) {
      this.local.experiences.splice(index, 1)
    },
    addEdu() {
      if (this.edu.degree) {
        this.local.education.push({ ...this.edu })
        this.edu = { degree: '', period: '', mark: '', thesis: '' }
      }
    },
    removeEdu(index) {
      this.local.education.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.editor-card {
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.editor-tabs {
  margin-left: 20px;
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.editor-window {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.editor-panels {
  background: transparent;
}

:deep(.editor-panel) {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  border-radius: 12px !important;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease-in-out;
}

:deep(.editor-panel:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

:deep(.panel-title) {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
  padding: 16px;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0 16px 16px;
}

.experience-card,
.education-card {
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

:deep(.v-field) {
  border-radius: 8px !important;
}

:deep(.v-field__outline) {
  border-color: rgba(0, 0, 0, 0.12) !important;
}

:deep(.v-field--focused .v-field__outline) {
  border-color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-btn) {
  border-radius: 8px;
  font-weight: 500;
}

:deep(.v-btn--icon) {
  border-radius: 8px;
}

:deep(.v-switch .v-label) {
  font-size: 0.875rem;
  opacity: 0.7;
}
</style>
