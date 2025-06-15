<template>
  <div class="editor-card" :class="{ 'pt-8': !isMobile }">
    <v-tabs v-model="activeTab" color="primary" class="editor-tabs">
      <v-tab value="info">
        Info
      </v-tab>
      <v-tab value="style">
        Style
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab" class="editor-window">
      <v-window-item value="info">
        <div class="mb-4">
          <v-text-field v-model="resumeData.personal.name" label="Name" variant="outlined" density="comfortable"
            class="mb-2" aria-label="Name" />
          <v-text-field v-model="resumeData.personal.title" label="Title" variant="outlined" density="comfortable"
            aria-label="Title" />
        </div>
        <v-expansion-panels class="editor-panels" multiple>
          <v-expansion-panel class="editor-panel">
            <v-expansion-panel-title class="panel-title">
              <div class="d-flex align-center w-100">
                <span class="section-title">
                  Experience
                  <v-icon :icon="resumeData.experiencesVisible ? 'mdi-eye' : 'mdi-eye-off'" size="small"
                    class="visibility-icon"
                    @click.stop="resumeData.experiencesVisible = !resumeData.experiencesVisible" />
                </span>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-expansion-panels>
                <v-expansion-panel v-for="(exp, index) in resumeData.experiences" :key="index"
                  class="mb-4 experience-card">
                  <v-expansion-panel-title>
                    <div class="d-flex align-center w-100">
                      <span class="section-title">
                        {{ exp.title }} - {{ exp.company }}
                        <v-icon :icon="resumeData.experiences[index].visible ? 'mdi-eye' : 'mdi-eye-off'" size="small"
                          class="visibility-icon"
                          @click.stop="resumeData.experiences[index].visible = !resumeData.experiences[index].visible" />
                        <v-tooltip location="top">
                          <template v-slot:activator="{ props }">
                            <v-icon v-bind="props"
                              :icon="deleteConfirmState[`exp-${index}`] ? 'mdi-check' : 'mdi-delete'" size="small"
                              class="delete-icon" @click.stop="removeExp(index)"
                              :disabled="!resumeData.experiencesVisible" />
                          </template>
                          {{ deleteConfirmState[`exp-${index}`] ? 'Confirm delete' : 'Delete experience' }}
                        </v-tooltip>
                      </span>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div class="d-flex align-center mb-2">
                      <v-text-field v-model="resumeData.experiences[index].title" label="Job title"
                        :disabled="!resumeData.experiencesVisible || !resumeData.experiences[index].visible"
                        variant="outlined" density="comfortable" aria-label="Job title" />
                    </div>
                    <v-text-field v-model="resumeData.experiences[index].company" label="Company (+ location)"
                      :disabled="!resumeData.experiencesVisible || !resumeData.experiences[index].visible"
                      variant="outlined" density="comfortable" class="mb-2" aria-label="Company" />
                    <v-text-field v-model="resumeData.experiences[index].period" label="Period"
                      :disabled="!resumeData.experiencesVisible || !resumeData.experiences[index].visible"
                      variant="outlined" density="comfortable" class="mb-2" aria-label="Period" />
                    <v-textarea v-model="resumeData.experiences[index].description" label="Description"
                      :disabled="!resumeData.experiencesVisible || !resumeData.experiences[index].visible"
                      variant="outlined" density="comfortable" aria-label="Description" />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-btn color="primary" @click="addExp" aria-label="Add Experience"
                :disabled="!resumeData.experiencesVisible" prepend-icon="mdi-plus">Add
                Experience</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel class="editor-panel">
            <v-expansion-panel-title class="panel-title">
              <div class="d-flex align-center w-100">
                <span class="section-title">
                  Education
                  <v-icon :icon="resumeData.educationVisible ? 'mdi-eye' : 'mdi-eye-off'" size="small"
                    class="visibility-icon" @click.stop="resumeData.educationVisible = !resumeData.educationVisible" />
                </span>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-expansion-panels>
                <v-expansion-panel v-for="(edu, index) in resumeData.education" :key="index"
                  class="mb-4 education-card">
                  <v-expansion-panel-title>
                    <div class="d-flex align-center w-100">
                      <span class="section-title">
                        {{ edu.degree }} - {{ edu.school }}
                        <v-icon :icon="resumeData.education[index].visible ? 'mdi-eye' : 'mdi-eye-off'" size="small"
                          class="visibility-icon"
                          @click.stop="resumeData.education[index].visible = !resumeData.education[index].visible" />
                        <v-tooltip location="top">
                          <template v-slot:activator="{ props }">
                            <v-icon v-bind="props"
                              :icon="deleteConfirmState[`edu-${index}`] ? 'mdi-check' : 'mdi-delete'" size="small"
                              class="delete-icon" @click.stop="removeEdu(index)"
                              :disabled="!resumeData.educationVisible" />
                          </template>
                          {{ deleteConfirmState[`edu-${index}`] ? 'Confirm delete' : 'Delete education' }}
                        </v-tooltip>
                      </span>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-text-field v-model="resumeData.education[index].degree" label="Degree"
                      :disabled="!resumeData.educationVisible || !resumeData.education[index].visible"
                      variant="outlined" density="comfortable" aria-label="Degree" />
                    <v-text-field v-model="resumeData.education[index].school" label="School"
                      :disabled="!resumeData.educationVisible || !resumeData.education[index].visible"
                      variant="outlined" density="comfortable" class="mb-2" aria-label="School" />
                    <v-text-field v-model="resumeData.education[index].period" label="Period"
                      :disabled="!resumeData.educationVisible || !resumeData.education[index].visible"
                      variant="outlined" density="comfortable" class="mb-2" aria-label="Period" />
                    <v-text-field v-model="resumeData.education[index].mark" label="Grade"
                      :disabled="!resumeData.educationVisible || !resumeData.education[index].visible"
                      variant="outlined" density="comfortable" class="mb-2" aria-label="Grade" />
                    <v-textarea v-model="resumeData.education[index].thesis" label="Thesis / Notes"
                      :disabled="!resumeData.educationVisible || !resumeData.education[index].visible"
                      variant="outlined" density="comfortable" aria-label="Thesis / Notes" />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-btn color="primary" @click="addEdu" aria-label="Add Education" :disabled="!resumeData.educationVisible"
                prepend-icon="mdi-plus">Add Education</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <template v-for="(section, index) in resumeData.customSections" :key="index">
            <v-expansion-panel class="editor-panel">
              <v-expansion-panel-title class="panel-title">
                <div class="d-flex align-center w-100">
                  <span v-if="!editingSectionTitle[index]" class="section-title">
                    {{ section.title }}
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" icon="mdi-pencil" size="small" class="edit-icon"
                          @click.stop="startEditingTitle(index)" />
                      </template>
                      Edit section title
                    </v-tooltip>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props"
                          :icon="resumeData.customSections[index].visible ? 'mdi-eye' : 'mdi-eye-off'" size="small"
                          class="visibility-icon"
                          @click.stop="resumeData.customSections[index].visible = !resumeData.customSections[index].visible" />
                      </template>
                      {{ resumeData.customSections[index].visible ? 'Hide section' : 'Show section' }}
                    </v-tooltip>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" icon="mdi-arrow-up" size="small" class="move-icon"
                          @click.stop="moveCustomSection(index, 'up')" :disabled="index === 0" />
                      </template>
                      Move section up
                    </v-tooltip>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" icon="mdi-arrow-down" size="small" class="move-icon"
                          @click.stop="moveCustomSection(index, 'down')"
                          :disabled="index === resumeData.customSections.length - 1" />
                      </template>
                      Move section down
                    </v-tooltip>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" :icon="deleteConfirmState[index] ? 'mdi-check' : 'mdi-delete'"
                          size="small" class="delete-icon" @click.stop="removeCustomSection(index)"
                          :disabled="!resumeData.customSections[index].visible" />
                      </template>
                      {{ deleteConfirmState[index] ? 'Confirm delete' : 'Delete section' }}
                    </v-tooltip>
                  </span>
                  <v-text-field v-else v-model="resumeData.customSections[index].title" variant="plain"
                    density="compact" hide-details class="title-edit-field" @blur="stopEditingTitle(index)"
                    @keyup.enter="stopEditingTitle(index)" @keyup.esc="cancelEditingTitle(index)" ref="titleField" />
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="d-flex align-center mb-2">
                  <v-select v-model="resumeData.customSections[index].type" :items="sectionTypes" label="Type"
                    :disabled="!resumeData.customSections[index].visible" variant="outlined" density="comfortable"
                    class="mr-2" style="max-width: 200px;" item-title="label" item-value="value" aria-label="Type" />
                </div>

                <template v-if="section.type === 'languages'">
                  <div v-for="(item, itemIndex) in resumeData.customSections[index].items" :key="itemIndex"
                    class="d-flex align-center mb-2">
                    <v-text-field v-model="resumeData.customSections[index].items[itemIndex].name" label="Language"
                      :disabled="!resumeData.customSections[index].visible" variant="outlined" density="comfortable"
                      class="mr-2" aria-label="Language" />
                    <v-slider v-model="resumeData.customSections[index].items[itemIndex].proficiency"
                      label="Proficiency" :disabled="!resumeData.customSections[index].visible" min="0" max="100"
                      step="5" class="mr-2" />
                    <v-btn icon="mdi-delete" color="error" variant="text"
                      @click="removeCustomSectionItem(index, itemIndex)"
                      :disabled="!resumeData.customSections[index].visible" aria-label="Delete language" />
                  </div>
                  <div class="d-flex align-center mb-2">
                    <v-text-field v-model="newCustomSectionItem.name" label="Language"
                      :disabled="!resumeData.customSections[index].visible" variant="outlined" density="comfortable"
                      class="mr-2" aria-label="Language" />
                    <v-slider v-model="newCustomSectionItem.proficiency" label="Proficiency"
                      :disabled="!resumeData.customSections[index].visible" min="0" max="100" step="5" class="mr-2" />
                    <v-btn color="primary" @click="addCustomSectionItem(index)"
                      :disabled="!resumeData.customSections[index].visible" prepend-icon="mdi-plus"
                      aria-label="Add language">Add Language</v-btn>
                  </div>
                </template>

                <template v-else-if="section.type === 'list'">
                  <div v-for="(item, itemIndex) in resumeData.customSections[index].items" :key="itemIndex"
                    class="d-flex align-center mb-2">
                    <v-text-field v-model="resumeData.customSections[index].items[itemIndex].value" label="Item"
                      :disabled="!resumeData.customSections[index].visible" variant="outlined" density="comfortable"
                      class="mr-2" aria-label="Item" />
                    <v-btn icon="mdi-delete" color="error" variant="text"
                      @click="removeCustomSectionItem(index, itemIndex)"
                      :disabled="!resumeData.customSections[index].visible" aria-label="Delete item" />
                  </div>
                  <div class="d-flex align-center mb-2">
                    <v-text-field v-model="newCustomSectionItem.value" label="Item"
                      :disabled="!resumeData.customSections[index].visible" variant="outlined" density="comfortable"
                      class="mr-2" aria-label="Item" />
                    <v-btn color="primary" @click="addCustomSectionItem(index)"
                      :disabled="!resumeData.customSections[index].visible" prepend-icon="mdi-plus"
                      aria-label="Add item">Add
                      Item</v-btn>
                  </div>
                </template>

                <template v-else>
                  <div v-for="(item, itemIndex) in resumeData.customSections[index].items" :key="itemIndex"
                    class="custom-section-item mb-4">
                    <div class="d-flex align-center mb-2">
                      <v-textarea v-model="resumeData.customSections[index].items[itemIndex].value" label="Item"
                        :disabled="!resumeData.customSections[index].visible" variant="outlined" density="comfortable"
                        class="flex-grow-1" aria-label="Item" />
                    </div>
                    <div class="d-flex align-center justify-end">
                      <v-switch v-model="resumeData.customSections[index].items[itemIndex].isLink" label="Link"
                        :disabled="!resumeData.customSections[index].visible" hide-details density="compact"
                        color="primary" class="mr-2" />
                      <v-btn icon="mdi-delete" color="error" variant="text"
                        @click="removeCustomSectionItem(index, itemIndex)"
                        :disabled="!resumeData.customSections[index].visible" aria-label="Delete item" />
                    </div>
                    <div v-if="resumeData.customSections[index].items[itemIndex].isLink" class="mt-2">
                      <v-text-field v-model="resumeData.customSections[index].items[itemIndex].href" label="URL"
                        :disabled="!resumeData.customSections[index].visible" variant="outlined" density="comfortable"
                        placeholder="https://example.com" aria-label="URL" />
                    </div>
                  </div>

                  <div class="custom-section-item mb-4">
                    <div class="d-flex align-center mb-2">
                      <v-textarea v-model="newCustomSectionItem.value" label="New Item"
                        :disabled="!resumeData.customSections[index].visible" variant="outlined" density="comfortable"
                        class="flex-grow-1" aria-label="New Item" />
                    </div>
                    <div class="d-flex align-center justify-end">
                      <v-switch v-model="newCustomSectionItem.isLink" label="Link"
                        :disabled="!resumeData.customSections[index].visible" hide-details density="compact"
                        color="primary" class="mr-2" />
                      <v-btn color="primary" @click="addCustomSectionItem(index)"
                        :disabled="!resumeData.customSections[index].visible" prepend-icon="mdi-plus"
                        aria-label="Add item">Add Item</v-btn>
                    </div>
                    <div v-if="newCustomSectionItem.isLink" class="mt-2">
                      <v-text-field v-model="newCustomSectionItem.href" label="URL"
                        :disabled="!resumeData.customSections[index].visible" variant="outlined" density="comfortable"
                        placeholder="https://example.com" aria-label="URL" />
                    </div>
                  </div>
                </template>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </template>
        </v-expansion-panels>
        <div class="d-flex flex-column align-center">
          <v-btn color="primary" @click="addCustomSection" prepend-icon="mdi-plus" class="mt-4 action-btn"
            aria-label="Add custom section">Add Custom Section</v-btn>
        </div>
      </v-window-item>

      <v-window-item value="style">
        <ResumeStyle v-model:style-data="props.style" @update:style-data="updateStyle" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import ResumeStyle from './ResumeStyle.vue'
import { ResumeDataV1 as ResumeData } from '../models/ResumeData/ResumeDataV1'
import { ResumeStyle2ColumnsV1 as ResumeStyleClass } from '../models/ResumeStyle/ResumeStyle2ColumnsV1'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  style: {
    type: Object,
    required: true
  },
  isMobile: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:resumeData', 'update:style', 'save', 'change', 'preview'])

const activeTab = ref('info')

const newCustomSectionItem = ref(ResumeData.getNewCustomSectionItem())
const sectionTypes = ResumeStyleClass.SECTION_TYPES

const editingSectionTitle = ref({})
const deleteConfirmState = ref({})

// Add click outside handler
const handleClickOutside = (event) => {
  // Reset all confirmation states
  Object.keys(deleteConfirmState.value).forEach(key => {
    deleteConfirmState.value[key] = false
  })
}

// Add mounted and unmounted hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch for changes and emit updates
watch(() => props.resumeData, (newValue) => {
  emit('update:resumeData', newValue)
  emit('change')
}, { deep: true })

// Watch for style changes
watch(() => props.style, (newValue) => {
  emit('update:style', newValue)
  emit('change')
}, { deep: true })

const updateStyle = (newStyle) => {
  emit('update:style', newStyle)
  emit('change')
}

// Experience methods
const addExp = () => {
  props.resumeData.experiences.push(ResumeData.getNewExperience())
}

const removeExp = (index) => {
  if (!deleteConfirmState.value[`exp-${index}`]) {
    // First click - show confirmation
    deleteConfirmState.value[`exp-${index}`] = true
    return
  }
  // Second click - actually delete
  props.resumeData.experiences.splice(index, 1)
  deleteConfirmState.value[`exp-${index}`] = false
}

// Education methods
const addEdu = () => {
  props.resumeData.education.push(ResumeData.getNewEducation())
}

const removeEdu = (index) => {
  if (!deleteConfirmState.value[`edu-${index}`]) {
    // First click - show confirmation
    deleteConfirmState.value[`edu-${index}`] = true
    return
  }
  // Second click - actually delete
  props.resumeData.education.splice(index, 1)
  deleteConfirmState.value[`edu-${index}`] = false
}

// Custom section methods
const addCustomSection = () => {
  props.resumeData.customSections.push(ResumeData.getNewCustomSection())
}

const removeCustomSection = (index) => {
  if (!deleteConfirmState.value[index]) {
    // First click - show confirmation
    deleteConfirmState.value[index] = true
    return
  }
  // Second click - actually delete
  props.resumeData.customSections.splice(index, 1)
  deleteConfirmState.value[index] = false
}

const addCustomSectionItem = (sectionIndex) => {
  if (!newCustomSectionItem.value.name && !newCustomSectionItem.value.proficiency && !newCustomSectionItem.value.value) {
    return
  }

  const section = props.resumeData.customSections[sectionIndex]
  section.items.push(newCustomSectionItem.value)
  newCustomSectionItem.value = ResumeData.getNewCustomSectionItem()
}

const removeCustomSectionItem = (sectionIndex, itemIndex) => {
  props.resumeData.customSections[sectionIndex].items.splice(itemIndex, 1)
}

const startEditingTitle = (index) => {
  editingSectionTitle.value[index] = true
  // Wait for the next tick to focus the input
  nextTick(() => {
    const input = document.querySelector(`.title-edit-field input`)
    if (input) {
      input.focus()
      input.select()
    }
  })
}

const stopEditingTitle = (index) => {
  editingSectionTitle.value[index] = false
}

const cancelEditingTitle = (index) => {
  // Restore the original title
  props.resumeData.customSections[index].title = props.resumeData.customSections[index].title
  editingSectionTitle.value[index] = false
}

const moveCustomSection = (index, direction) => {
  const sections = props.resumeData.customSections
  if (direction === 'up' && index > 0) {
    // Swap with previous section
    [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]]
  } else if (direction === 'down' && index < sections.length - 1) {
    // Swap with next section
    [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]]
  }
}
</script>

<style scoped>
.editor-card {
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.2);
}

.editor-tabs {
  margin: 10px 20px;
  position: sticky;
  top: 0;
  z-index: 2;
  border-bottom: 2px solid rgba(0, 0, 0, 0.06);
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

.editor-panel {
  margin-bottom: 8px;
}

/* Desktop styles */
@media (min-width: 601px) {

  .editor-panel .section-title .visibility-icon,
  .editor-panel .section-title .edit-icon,
  .editor-panel .section-title .delete-icon,
  .editor-panel .section-title .move-icon {
    opacity: 0;
    transition: opacity 0.2s;
    cursor: pointer;
  }

  .editor-panel:hover .section-title .visibility-icon,
  .editor-panel:hover .section-title .edit-icon,
  .editor-panel:hover .section-title .delete-icon,
  .editor-panel:hover .section-title .move-icon {
    opacity: 0.7;
  }

  .editor-panel .section-title .visibility-icon:hover,
  .editor-panel .section-title .edit-icon:hover,
  .editor-panel .section-title .delete-icon:hover,
  .editor-panel .section-title .move-icon:hover {
    opacity: 1;
  }

  .editor-panel .section-title .move-icon.v-icon--disabled {
    opacity: 0;
    cursor: not-allowed;
  }

  .editor-panel:hover .section-title .move-icon.v-icon--disabled {
    opacity: 0.3;
  }
}

/* Mobile styles */
@media (max-width: 600px) {

  .editor-panel .section-title .visibility-icon,
  .editor-panel .section-title .edit-icon,
  .editor-panel .section-title .delete-icon,
  .editor-panel .section-title .move-icon {
    opacity: 0.7;
    cursor: pointer;
  }

  .editor-panel .section-title .move-icon.v-icon--disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.editor-panel:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

:deep(.editor-panel) {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

:deep(.panel-title) {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
  padding: 16px 20px;
  font-size: 1.2rem;
  letter-spacing: 0.3px;
}

:deep(.panel-title .section-title) {
  font-size: 1.2rem;
  font-weight: 600;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0 12px 12px;
}

.experience-card,
.education-card {
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  margin-bottom: 8px;
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
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
  height: 40px;
  font-size: 1rem;
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
  font-weight: 600;
  letter-spacing: 0.3px;
  font-size: 1.1rem;
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
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 1rem;
}

:deep(.v-textarea .v-field__input) {
  min-height: 100px;
  font-size: 1rem;
}

:deep(.v-field__label) {
  font-size: 0.95rem;
  font-weight: 500;
}

:deep(.v-field--variant-outlined .v-field__outline) {
  --v-field-border-width: 1px;
}

:deep(.v-expansion-panel-text) {
  font-size: 1rem;
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

.custom-section-item {
  background-color: #f8fafc;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 12px;
  transition: all 0.2s ease;
}

.custom-section-item:hover {
  background-color: #f1f5f9;
}

:deep(.v-textarea .v-field__input) {
  min-height: 80px;
}

.action-btn {
  width: 200px;
  justify-content: center;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-edit-field {
  width: 100%;
}
</style>