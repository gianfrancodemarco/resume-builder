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
                <v-text-field v-model="local.education[index].school" label="School" :disabled="!local.educationVisible"
                  variant="outlined" density="comfortable" class="mb-2" />
                <v-text-field v-model="local.education[index].period" label="Period" :disabled="!local.educationVisible"
                  variant="outlined" density="comfortable" class="mb-2" />
                <v-text-field v-model="local.education[index].mark" label="Grade" :disabled="!local.educationVisible"
                  variant="outlined" density="comfortable" class="mb-2" />
                <v-textarea v-model="local.education[index].thesis" label="Thesis / Notes"
                  :disabled="!local.educationVisible" variant="outlined" density="comfortable" />
              </div>
              <v-text-field v-model="edu.degree" label="Degree" :disabled="!local.educationVisible" variant="outlined"
                density="comfortable" class="mb-2" />
              <v-text-field v-model="edu.school" label="School" :disabled="!local.educationVisible" variant="outlined"
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

          <v-expansion-panel class="editor-panel">
            <v-expansion-panel-title class="panel-title">
              <v-icon icon="mdi-plus-circle" class="mr-2" />
              Custom Sections
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="d-flex justify-end mb-4">
                <v-switch v-model="local.customSectionsVisible" label="Show section" hide-details density="compact"
                  color="primary" />
              </div>
              <div v-for="(section, index) in local.customSections" :key="index" class="mb-4 custom-section-card pa-3">
                <div class="d-flex align-center mb-2">
                  <v-text-field v-model="local.customSections[index].title" label="Section Title"
                    :disabled="!local.customSectionsVisible" variant="outlined" density="comfortable" class="mr-2" />
                  <v-select v-model="local.customSections[index].type" :items="sectionTypes" label="Type"
                    :disabled="!local.customSectionsVisible" variant="outlined" density="comfortable" class="mr-2"
                    style="max-width: 200px;"
                    @update:model-value="(val) => handleSectionTypeChange(local.customSections[index], val)"
                    item-title="label" item-value="value" />
                  <v-btn icon="mdi-delete" color="error" variant="text" @click="removeCustomSection(index)" class="ml-2"
                    :disabled="!local.customSectionsVisible" />
                </div>
                <template v-if="section.type === 'languages'">
                  <div v-for="(item, itemIndex) in local.customSections[index].items" :key="itemIndex"
                    class="d-flex align-center mb-2">
                    <v-text-field v-model="local.customSections[index].items[itemIndex].name" label="Language"
                      :disabled="!local.customSectionsVisible" variant="outlined" density="comfortable" class="mr-2" />
                    <v-slider v-model="local.customSections[index].items[itemIndex].proficiency" label="Proficiency"
                      :disabled="!local.customSectionsVisible" min="0" max="100" step="5" class="mr-2" />
                    <v-btn icon="mdi-delete" color="error" variant="text"
                      @click="removeCustomSectionItem(index, itemIndex)" :disabled="!local.customSectionsVisible" />
                  </div>
                  <div class="d-flex align-center mb-2">
                    <v-text-field v-model="newCustomSectionItem.name" label="Language"
                      :disabled="!local.customSectionsVisible" variant="outlined" density="comfortable" class="mr-2" />
                    <v-slider v-model="newCustomSectionItem.proficiency" label="Proficiency"
                      :disabled="!local.customSectionsVisible" min="0" max="100" step="5" class="mr-2" />
                    <v-btn color="primary" @click="addCustomSectionItem(index)" :disabled="!local.customSectionsVisible"
                      prepend-icon="mdi-plus">Add Language</v-btn>
                  </div>
                </template>
                <template v-else-if="section.type === 'list'">
                  <div v-for="(item, itemIndex) in local.customSections[index].items" :key="itemIndex"
                    class="d-flex align-center mb-2">
                    <v-text-field v-model="local.customSections[index].items[itemIndex]" label="Item"
                      :disabled="!local.customSectionsVisible" variant="outlined" density="comfortable" class="mr-2" />
                    <v-btn icon="mdi-delete" color="error" variant="text"
                      @click="removeCustomSectionItem(index, itemIndex)" :disabled="!local.customSectionsVisible" />
                  </div>
                  <div class="d-flex align-center mb-2">
                    <v-text-field v-model="newCustomSectionItem" label="Item" :disabled="!local.customSectionsVisible"
                      variant="outlined" density="comfortable" class="mr-2" />
                    <v-btn color="primary" @click="addCustomSectionItem(index)" :disabled="!local.customSectionsVisible"
                      prepend-icon="mdi-plus">Add Item</v-btn>
                  </div>
                </template>
                <template v-else-if="section.type === 'italic'">
                  <div v-for="(item, itemIndex) in local.customSections[index].items" :key="itemIndex"
                    class="d-flex align-center mb-2">
                    <v-text-field v-model="local.customSections[index].items[itemIndex].value" label="Item"
                      :disabled="!local.customSectionsVisible" variant="outlined" density="comfortable" class="mr-2" />
                    <v-switch v-model="local.customSections[index].items[itemIndex].isLink" label="Link"
                      :disabled="!local.customSectionsVisible" hide-details density="compact" color="primary"
                      class="mr-2" />
                    <v-btn icon="mdi-delete" color="error" variant="text"
                      @click="removeCustomSectionItem(index, itemIndex)" :disabled="!local.customSectionsVisible" />
                  </div>
                  <div class="d-flex align-center mb-2">
                    <v-text-field v-model="newCustomSectionItem.value" label="Item"
                      :disabled="!local.customSectionsVisible" variant="outlined" density="comfortable" class="mr-2" />
                    <v-switch v-model="newCustomSectionItem.isLink" label="Link"
                      :disabled="!local.customSectionsVisible" hide-details density="compact" color="primary"
                      class="mr-2" />
                    <v-btn color="primary" @click="addCustomSectionItem(index)" :disabled="!local.customSectionsVisible"
                      prepend-icon="mdi-plus">Add Item</v-btn>
                  </div>
                </template>
                <template v-else>
                  <div v-for="(item, itemIndex) in local.customSections[index].items" :key="itemIndex"
                    class="d-flex align-center mb-2">
                    <v-text-field v-model="local.customSections[index].items[itemIndex].value" label="Item"
                      :disabled="!local.customSectionsVisible" variant="outlined" density="comfortable" class="mr-2" />
                    <v-switch v-model="local.customSections[index].items[itemIndex].isLink" label="Link"
                      :disabled="!local.customSectionsVisible" hide-details density="compact" color="primary"
                      class="mr-2" />
                    <v-btn icon="mdi-delete" color="error" variant="text"
                      @click="removeCustomSectionItem(index, itemIndex)" :disabled="!local.customSectionsVisible" />
                  </div>
                  <div class="d-flex align-center mb-2">
                    <v-text-field v-model="newCustomSectionItem.value" label="Item"
                      :disabled="!local.customSectionsVisible" variant="outlined" density="comfortable" class="mr-2" />
                    <v-switch v-model="newCustomSectionItem.isLink" label="Link"
                      :disabled="!local.customSectionsVisible" hide-details density="compact" color="primary"
                      class="mr-2" />
                    <v-btn color="primary" @click="addCustomSectionItem(index)" :disabled="!local.customSectionsVisible"
                      prepend-icon="mdi-plus">Add Item</v-btn>
                  </div>
                </template>
              </div>
              <v-btn color="primary" @click="addCustomSection" :disabled="!local.customSectionsVisible"
                prepend-icon="mdi-plus">Add
                Custom Section</v-btn>
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

<script setup>
import { ref, watch, computed } from 'vue'
import ResumeStyle from './ResumeStyle.vue'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  style: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:resumeData', 'update:style', 'save', 'change'])

const activeTab = ref('info')
const styleData = ref(props.style)

const local = ref({
  personal: {
    name: props.resumeData.personal.name || '',
    title: props.resumeData.personal.title || '',
    visible: props.resumeData.personal.visible || true
  },
  experiences: props.resumeData.experiences || [],
  experiencesVisible: props.resumeData.experiencesVisible || true,
  education: props.resumeData.education || [],
  educationVisible: props.resumeData.educationVisible || true,
  customSections: props.resumeData.customSections || [],
  customSectionsVisible: props.resumeData.customSectionsVisible || true
})

// Form data for new items
const exp = ref({
  title: '',
  company: '',
  period: '',
  description: ''
})

const edu = ref({
  degree: '',
  school: '',
  period: '',
  mark: '',
  thesis: ''
})

const newCustomSectionItem = ref({
  value: '',
  isLink: false,
  name: '',
  proficiency: 50
})

const sectionTypes = [
  { label: 'Text', value: 'text' },
  { label: 'List', value: 'list' },
  { label: 'Languages', value: 'languages' },
  { label: 'Italic Text', value: 'italic' }
]

const fonts = [
  'Oswald',
  'Lato',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Raleway',
  'Poppins',
  'Source Sans Pro'
]

// Watch for changes and emit updates
watch(local, (newValue) => {
  emit('update:resumeData', newValue)
  emit('change')
}, { deep: true })

// Watch for style changes
watch(styleData, (newValue) => {
  emit('update:style', newValue)
  emit('change')
}, { deep: true })

const updateStyle = (newStyle) => {
  styleData.value = newStyle
  emit('update:style', newStyle)
  emit('change')
}

// Experience methods
const addExp = () => {
  if (exp.value.title) {
    local.value.experiences.push({ ...exp.value })
    exp.value = {
      title: '',
      company: '',
      period: '',
      description: ''
    }
  }
}

const removeExp = (index) => {
  local.value.experiences.splice(index, 1)
}

// Education methods
const addEdu = () => {
  if (edu.value.degree) {
    local.value.education.push({ ...edu.value })
    edu.value = {
      degree: '',
      school: '',
      period: '',
      mark: '',
      thesis: ''
    }
  }
}

const removeEdu = (index) => {
  local.value.education.splice(index, 1)
}

// Custom section methods
const addCustomSection = () => {
  local.value.customSections.push({
    title: 'New Section',
    type: 'text',
    items: []
  })
}

const removeCustomSection = (index) => {
  local.value.customSections.splice(index, 1)
}

const handleSectionTypeChange = (section, newType) => {
  if (section.type === newType) {
    return section
  }

  // If switching between text and italic, convert the data structure
  if ((section.type === 'text' && newType === 'italic') ||
    (section.type === 'italic' && newType === 'text')) {
    // Convert items to the new format if needed
    const convertedItems = section.items.map(item => {
      if (typeof item === 'string') {
        return {
          value: item,
          isLink: false
        }
      }
      return item
    })
    return {
      ...section,
      type: newType,
      items: convertedItems
    }
  }

  // For other type changes, reset the items
  section.type = newType
  section.items = []

  if (newType === 'languages') {
    newCustomSectionItem.value = {
      name: '',
      proficiency: 50
    }
  } else if (newType === 'list') {
    newCustomSectionItem.value = ''
  } else {
    newCustomSectionItem.value = {
      value: '',
      isLink: false
    }
  }
}

const addCustomSectionItem = (sectionIndex) => {
  const section = local.value.customSections[sectionIndex]
  if (section.type === 'languages') {
    if (newCustomSectionItem.value.name) {
      section.items.push({ ...newCustomSectionItem.value })
      newCustomSectionItem.value = {
        name: '',
        proficiency: 50
      }
    }
  } else if (section.type === 'list') {
    if (newCustomSectionItem.value) {
      section.items.push(newCustomSectionItem.value)
      newCustomSectionItem.value = ''
    }
  } else {
    // Handle both text and italic types
    if (newCustomSectionItem.value.value) {
      section.items.push({
        value: newCustomSectionItem.value.value,
        isLink: newCustomSectionItem.value.isLink || false
      })
      newCustomSectionItem.value = {
        value: '',
        isLink: false
      }
    }
  }
}

const removeCustomSectionItem = (sectionIndex, itemIndex) => {
  local.value.customSections[sectionIndex].items.splice(itemIndex, 1)
}

// Style methods
const colorTooltip = (color) => {
  return `Color: ${color.toUpperCase()}`
}

const colorPreview = (color) => {
  return color.toUpperCase()
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

.custom-section-card {
  background-color: #f8fafc;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  margin-bottom: 8px;
  padding: 12px !important;
}

.custom-section-card:hover {
  background-color: #f1f5f9;
}
</style>
