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
        <div class="mb-4">
          <v-text-field v-model="local.personal.name" label="Name" variant="outlined" density="comfortable"
            class="mb-2" />
          <v-text-field v-model="local.personal.title" label="Title" variant="outlined" density="comfortable" />
        </div>
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
              <div v-for="(desc, index) in local.personal.about" :key="index" class="d-flex align-center mb-2">
                <v-textarea v-model="local.personal.about[index]" :label="`Description ${index + 1}`"
                  :disabled="!local.personal.visible" variant="outlined" density="comfortable" />
                <v-btn icon="mdi-delete" color="error" variant="text" @click="removeDescription(index)" class="ml-2"
                  :disabled="!local.personal.visible" />
              </div>
              <v-btn color="primary" @click="addDescription" :disabled="!local.personal.visible" prepend-icon="mdi-plus"
                class="mt-2">Add Description</v-btn>
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
              <div v-for="(detail, index) in local.personal.details" :key="index" class="detail-card pa-3 mb-3">
                <div class="d-flex align-center">
                  <v-text-field v-model="detail.value" label="Value" :disabled="!local.personal.detailsVisible"
                    variant="outlined" density="comfortable" class="mr-2" hide-details />
                  <v-switch v-model="detail.isLink" label="Link" hide-details density="compact"
                    :disabled="!local.personal.detailsVisible" color="primary" class="mr-2" />
                  <v-btn icon="mdi-delete" color="error" variant="text" @click="removeDetail(index)"
                    :disabled="!local.personal.detailsVisible" />
                </div>
              </div>
              <div class="detail-card pa-3 mb-3">
                <v-text-field v-model="newDetail.value" label="New detail" :disabled="!local.personal.detailsVisible"
                  variant="outlined" density="comfortable" class="mb-2" hide-details />
                <div class="d-flex align-center">
                  <v-switch v-model="newDetail.isLink" label="Link" hide-details density="compact"
                    :disabled="!local.personal.detailsVisible" color="primary" class="mr-2" />
                  <v-btn color="primary" @click="addDetail" :disabled="!local.personal.detailsVisible"
                    prepend-icon="mdi-plus" class="ml-auto">Add Detail</v-btn>
                </div>
              </div>
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
                <v-text-field v-model="local.personal.links[index]" label="Link"
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
                <v-text-field v-model="local.skills[index]" label="Skill" :disabled="!local.skillsVisible"
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
                <v-text-field v-model="local.languages[index].name" label="Language" :disabled="!local.languagesVisible"
                  variant="outlined" density="comfortable" />
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
                  <v-text-field v-model="local.experiences[index].title" label="Job title"
                    :disabled="!local.experiencesVisible" variant="outlined" density="comfortable" />
                  <v-btn icon="mdi-delete" color="error" variant="text" @click="removeExp(index)" class="ml-2"
                    :disabled="!local.experiencesVisible" />
                </div>
                <v-text-field v-model="local.experiences[index].company" label="Company (+ location)"
                  :disabled="!local.experiencesVisible" variant="outlined" density="comfortable" class="mb-2" />
                <v-text-field v-model="local.experiences[index].period" label="Period"
                  :disabled="!local.experiencesVisible" variant="outlined" density="comfortable" class="mb-2" />
                <v-textarea v-model="local.experiences[index].description" label="Description"
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
                  <v-text-field v-model="local.education[index].degree" label="Degree"
                    :disabled="!local.educationVisible" variant="outlined" density="comfortable" />
                  <v-btn icon="mdi-delete" color="error" variant="text" @click="removeEdu(index)" class="ml-2"
                    :disabled="!local.educationVisible" />
                </div>
                <v-text-field v-model="local.education[index].period" label="Period" :disabled="!local.educationVisible"
                  variant="outlined" density="comfortable" class="mb-2" />
                <v-text-field v-model="local.education[index].mark" label="Grade" :disabled="!local.educationVisible"
                  variant="outlined" density="comfortable" class="mb-2" />
                <v-textarea v-model="local.education[index].thesis" label="Thesis / Notes"
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
    // Initialize the data structure with defaults
    const defaultData = {
      personal: {
        name: '',
        title: '',
        visible: true,
        detailsVisible: true,
        linksVisible: true,
        about: [''],
        details: [
          { value: '', isLink: false },
          { value: '', isLink: true }
        ],
        links: []
      },
      skills: [],
      skillsVisible: true,
      languages: [],
      languagesVisible: true,
      experiences: [],
      experiencesVisible: true,
      education: [],
      educationVisible: true
    }

    // Merge the provided data with defaults
    const mergedData = {
      ...defaultData,
      ...this.resumeData,
      personal: {
        ...defaultData.personal,
        ...this.resumeData.personal,
        about: this.resumeData.personal?.about || [''],
        details: this.resumeData.personal?.details || defaultData.personal.details,
        links: this.resumeData.personal?.links || []
      }
    }

    return {
      activeTab: 'info',
      styleData: JSON.parse(JSON.stringify(this.style)),
      local: mergedData,
      link: '',
      skill: '',
      lang: { name: '', proficiency: 100 },
      exp: { title: '', company: '', period: '', description: '' },
      edu: { degree: '', period: '', mark: '', thesis: '' },
      newDetail: { value: '', isLink: false }
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
    },
    addDescription() {
      this.local.personal.about.push('')
    },
    removeDescription(index) {
      this.local.personal.about.splice(index, 1)
    },
    addDetail() {
      if (this.newDetail.value) {
        this.local.personal.details.push({ ...this.newDetail })
        this.newDetail = { value: '', isLink: false }
      }
    },
    removeDetail(index) {
      this.local.personal.details.splice(index, 1)
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
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.editor-tabs {
  margin: 0 12px;
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 4px 0;
}

.editor-window {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.editor-panels {
  background: transparent;
}

:deep(.editor-panel) {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  border-radius: 8px !important;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

:deep(.editor-panel:hover) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

:deep(.panel-title) {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
  padding: 12px 16px;
  font-size: 0.95rem;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0 12px 12px;
}

.experience-card,
.education-card {
  background-color: #f8fafc;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  margin-bottom: 8px;
  padding: 12px !important;
}

.experience-card:hover,
.education-card:hover {
  background-color: #f1f5f9;
}

:deep(.v-field) {
  border-radius: 6px !important;
  transition: all 0.2s ease;
}

:deep(.v-field__outline) {
  border-color: rgba(0, 0, 0, 0.08) !important;
}

:deep(.v-field--focused .v-field__outline) {
  border-color: rgb(var(--v-theme-primary)) !important;
  border-width: 1px !important;
}

:deep(.v-btn) {
  border-radius: 6px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.2px;
  transition: all 0.2s ease;
  height: 36px;
}

:deep(.v-btn--icon) {
  border-radius: 6px;
  width: 32px;
  height: 32px;
}

:deep(.v-switch .v-label) {
  font-size: 0.85rem;
  opacity: 0.8;
  font-weight: 500;
}

:deep(.v-tab) {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.2px;
  font-size: 0.9rem;
}

:deep(.v-tab--selected) {
  font-weight: 600;
}

:deep(.v-expansion-panel-title__overlay) {
  opacity: 0;
}

:deep(.v-expansion-panel--active > .v-expansion-panel-title) {
  color: rgb(var(--v-theme-primary));
}

:deep(.v-text-field .v-field__input) {
  padding-top: 8px;
  padding-bottom: 8px;
  font-size: 0.9rem;
}

:deep(.v-textarea .v-field__input) {
  min-height: 80px;
  font-size: 0.9rem;
}

:deep(.v-field__label) {
  font-size: 0.85rem;
}

:deep(.v-field--variant-outlined .v-field__outline) {
  --v-field-border-width: 1px;
}

:deep(.v-expansion-panel-text) {
  font-size: 0.9rem;
}

.detail-card {
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.detail-card:hover {
  background-color: #f1f5f9;
  border-color: rgba(0, 0, 0, 0.1);
}

:deep(.v-field__input) {
  padding-top: 8px;
  padding-bottom: 8px;
}

:deep(.v-field--variant-outlined .v-field__outline) {
  --v-field-border-width: 1px;
}

:deep(.v-switch .v-label) {
  font-size: 0.85rem;
  opacity: 0.8;
  font-weight: 500;
}

:deep(.v-btn) {
  text-transform: none;
  letter-spacing: 0.2px;
  font-weight: 500;
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .editor-window {
    padding: 20px 12px;
  }

  :deep(.v-field) {
    margin-bottom: 16px;
    width: 100%;
  }

  :deep(.v-text-field .v-field__input) {
    padding-top: 12px;
    padding-bottom: 12px;
    font-size: 0.85rem;
    width: 100%;
  }

  :deep(.v-textarea .v-field__input) {
    min-height: 60px;
    font-size: 0.85rem;
    width: 100%;
  }

  :deep(.v-field__label) {
    font-size: 0.8rem;
  }

  :deep(.v-btn) {
    height: 36px;
    font-size: 0.85rem;
  }

  :deep(.v-btn--icon) {
    width: 32px;
    height: 32px;
  }

  :deep(.v-expansion-panel-text__wrapper) {
    padding: 0 12px 20px;
  }

  .experience-card,
  .education-card,
  .detail-card {
    padding: 20px 12px !important;
    margin-bottom: 16px;
  }

  :deep(.panel-title) {
    padding: 16px 12px;
    font-size: 0.9rem;
  }

  :deep(.v-switch .v-label) {
    font-size: 0.8rem;
  }

  :deep(.v-tab) {
    font-size: 0.85rem;
    padding: 0 12px;
  }

  :deep(.v-expansion-panel-text) {
    font-size: 0.85rem;
  }

  :deep(.editor-panel) {
    margin-bottom: 20px;
  }

  :deep(.v-expansion-panels) {
    padding: 0;
  }

  :deep(.v-expansion-panel) {
    margin-bottom: 16px;
  }

  :deep(.v-expansion-panel:last-child) {
    margin-bottom: 0;
  }

  :deep(.v-field__outline) {
    width: 100% !important;
  }

  :deep(.v-field__input) {
    width: 100% !important;
  }

  :deep(.v-field__append-inner),
  :deep(.v-field__prepend-inner) {
    padding: 0 8px;
  }
}

/* Tablet optimizations */
@media (min-width: 601px) and (max-width: 960px) {
  .editor-window {
    padding: 16px;
  }

  :deep(.v-field) {
    margin-bottom: 12px;
  }

  :deep(.v-text-field .v-field__input) {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  :deep(.v-textarea .v-field__input) {
    min-height: 70px;
  }

  :deep(.v-btn) {
    height: 36px;
  }

  :deep(.v-btn--icon) {
    width: 32px;
    height: 32px;
  }

  :deep(.v-expansion-panel-text__wrapper) {
    padding: 0 16px 16px;
  }

  .experience-card,
  .education-card,
  .detail-card {
    padding: 16px !important;
    margin-bottom: 12px;
  }
}
</style>
