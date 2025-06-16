<template>
    <div>
        <div class="mb-4">
            <v-text-field v-model="props.resumeData.personal.name" label="Name" variant="outlined" density="comfortable"
                class="mb-2" aria-label="Name" />
            <v-text-field v-model="props.resumeData.personal.title" label="Title" variant="outlined"
                density="comfortable" aria-label="Title" />
        </div>
        <v-expansion-panels class="editor-panels" multiple>
            <!-- Experience Section -->
            <v-expansion-panel class="editor-panel">
                <v-expansion-panel-title class="panel-title">
                    <div class="d-flex align-center w-100">
                        <span class="section-title">
                            Experience
                            <v-icon :icon="props.resumeData.experiencesVisible ? 'mdi-eye' : 'mdi-eye-off'" size="small"
                                class="visibility-icon"
                                @click.stop="props.resumeData.experiencesVisible = !props.resumeData.experiencesVisible" />
                        </span>
                    </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-expansion-panels>
                        <v-expansion-panel v-for="(exp, index) in props.resumeData.experiences" :key="index"
                            class="mb-4 experience-card">
                            <v-expansion-panel-title>
                                <div class="d-flex align-center w-100">
                                    <span class="section-title">
                                        {{ exp.title }} - {{ exp.company }}
                                        <v-icon
                                            :icon="props.resumeData.experiences[index].visible ? 'mdi-eye' : 'mdi-eye-off'"
                                            size="small" class="visibility-icon"
                                            @click.stop="props.resumeData.experiences[index].visible = !props.resumeData.experiences[index].visible" />
                                        <v-tooltip location="top">
                                            <template v-slot:activator="{ props: iconProps }">
                                                <v-icon v-bind="iconProps"
                                                    :icon="deleteConfirmState[`exp-${index}`] ? 'mdi-check' : 'mdi-delete'"
                                                    size="small" class="delete-icon" @click.stop="removeExp(index)"
                                                    :disabled="!props.resumeData.experiencesVisible" />
                                            </template>
                                            {{ deleteConfirmState[`exp-${index}`] ? 'Confirm delete' : 'Delete experience' }}
                                        </v-tooltip>
                                    </span>
                                </div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <div class="d-flex align-center mb-2">
                                    <v-text-field v-model="props.resumeData.experiences[index].title" label="Job title"
                                        :disabled="!props.resumeData.experiencesVisible || !props.resumeData.experiences[index].visible"
                                        variant="outlined" density="comfortable" aria-label="Job title" />
                                </div>
                                <v-text-field v-model="props.resumeData.experiences[index].company"
                                    label="Company (+ location)"
                                    :disabled="!props.resumeData.experiencesVisible || !props.resumeData.experiences[index].visible"
                                    variant="outlined" density="comfortable" class="mb-2" aria-label="Company" />
                                <v-text-field v-model="props.resumeData.experiences[index].period" label="Period"
                                    :disabled="!props.resumeData.experiencesVisible || !props.resumeData.experiences[index].visible"
                                    variant="outlined" density="comfortable" class="mb-2" aria-label="Period" />
                                <v-textarea v-model="props.resumeData.experiences[index].description"
                                    label="Description"
                                    :disabled="!props.resumeData.experiencesVisible || !props.resumeData.experiences[index].visible"
                                    variant="outlined" density="comfortable" aria-label="Description" />
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-btn color="primary" @click="addExp" aria-label="Add Experience"
                        :disabled="!props.resumeData.experiencesVisible" prepend-icon="mdi-plus">Add
                        Experience</v-btn>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Education Section -->
            <v-expansion-panel class="editor-panel">
                <v-expansion-panel-title class="panel-title">
                    <div class="d-flex align-center w-100">
                        <span class="section-title">
                            Education
                            <v-icon :icon="props.resumeData.educationVisible ? 'mdi-eye' : 'mdi-eye-off'" size="small"
                                class="visibility-icon"
                                @click.stop="props.resumeData.educationVisible = !props.resumeData.educationVisible" />
                        </span>
                    </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-expansion-panels>
                        <v-expansion-panel v-for="(edu, index) in props.resumeData.education" :key="index"
                            class="mb-4 education-card">
                            <v-expansion-panel-title>
                                <div class="d-flex align-center w-100">
                                    <span class="section-title">
                                        {{ edu.degree }} - {{ edu.school }}
                                        <v-icon
                                            :icon="props.resumeData.education[index].visible ? 'mdi-eye' : 'mdi-eye-off'"
                                            size="small" class="visibility-icon"
                                            @click.stop="props.resumeData.education[index].visible = !props.resumeData.education[index].visible" />
                                        <v-tooltip location="top">
                                            <template v-slot:activator="{ props: iconProps }">
                                                <v-icon v-bind="iconProps"
                                                    :icon="deleteConfirmState[`edu-${index}`] ? 'mdi-check' : 'mdi-delete'"
                                                    size="small" class="delete-icon" @click.stop="removeEdu(index)"
                                                    :disabled="!props.resumeData.educationVisible" />
                                            </template>
                                            {{ deleteConfirmState[`edu-${index}`] ? 'Confirm delete' : 'Delete education' }}
                                        </v-tooltip>
                                    </span>
                                </div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-text-field v-model="props.resumeData.education[index].degree" label="Degree"
                                    :disabled="!props.resumeData.educationVisible || !props.resumeData.education[index].visible"
                                    variant="outlined" density="comfortable" aria-label="Degree" />
                                <v-text-field v-model="props.resumeData.education[index].school" label="School"
                                    :disabled="!props.resumeData.educationVisible || !props.resumeData.education[index].visible"
                                    variant="outlined" density="comfortable" class="mb-2" aria-label="School" />
                                <v-text-field v-model="props.resumeData.education[index].period" label="Period"
                                    :disabled="!props.resumeData.educationVisible || !props.resumeData.education[index].visible"
                                    variant="outlined" density="comfortable" class="mb-2" aria-label="Period" />
                                <v-text-field v-model="props.resumeData.education[index].mark" label="Grade"
                                    :disabled="!props.resumeData.educationVisible || !props.resumeData.education[index].visible"
                                    variant="outlined" density="comfortable" class="mb-2" aria-label="Grade" />
                                <v-textarea v-model="props.resumeData.education[index].thesis" label="Thesis / Notes"
                                    :disabled="!props.resumeData.educationVisible || !props.resumeData.education[index].visible"
                                    variant="outlined" density="comfortable" aria-label="Thesis / Notes" />
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-btn color="primary" @click="addEdu" aria-label="Add Education"
                        :disabled="!props.resumeData.educationVisible" prepend-icon="mdi-plus">Add Education</v-btn>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Custom Sections -->
            <template v-for="(section, index) in props.resumeData.customSections" :key="index">
                <v-expansion-panel class="editor-panel">
                    <v-expansion-panel-title class="panel-title">
                        <div class="d-flex align-center w-100">
                            <span v-if="!editingSectionTitle[index]" class="section-title">
                                {{ section.title }}
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps" icon="mdi-pencil" size="small" class="edit-icon"
                                            @click.stop="startEditingTitle(index)" />
                                    </template>
                                    Edit section title
                                </v-tooltip>
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps"
                                            :icon="props.resumeData.customSections[index].visible ? 'mdi-eye' : 'mdi-eye-off'"
                                            size="small" class="visibility-icon"
                                            @click.stop="props.resumeData.customSections[index].visible = !props.resumeData.customSections[index].visible" />
                                    </template>
                                    {{ props.resumeData.customSections[index].visible ? 'Hide section' : 'Show section'
                                    }}
                                </v-tooltip>
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps" icon="mdi-arrow-up" size="small" class="move-icon"
                                            @click.stop="moveCustomSection(index, 'up')" :disabled="index === 0" />
                                    </template>
                                    Move section up
                                </v-tooltip>
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps" icon="mdi-arrow-down" size="small" class="move-icon"
                                            @click.stop="moveCustomSection(index, 'down')"
                                            :disabled="index === props.resumeData.customSections.length - 1" />
                                    </template>
                                    Move section down
                                </v-tooltip>
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps"
                                            :icon="deleteConfirmState[index] ? 'mdi-check' : 'mdi-delete'" size="small"
                                            class="delete-icon" @click.stop="removeCustomSection(index)"
                                            :disabled="!props.resumeData.customSections[index].visible" />
                                    </template>
                                    {{ deleteConfirmState[index] ? 'Confirm delete' : 'Delete section' }}
                                </v-tooltip>
                            </span>
                            <v-text-field v-else v-model="props.resumeData.customSections[index].title" variant="plain"
                                density="compact" hide-details class="title-edit-field" @blur="stopEditingTitle(index)"
                                @keyup.enter="stopEditingTitle(index)" @keyup.esc="cancelEditingTitle(index)"
                                ref="titleField" />
                        </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <div class="d-flex align-center mb-2">
                            <v-select v-model="props.resumeData.customSections[index].type" :items="sectionTypes"
                                label="Type" :disabled="!props.resumeData.customSections[index].visible"
                                variant="outlined" density="comfortable" class="mr-2" style="max-width: 200px;"
                                item-title="label" item-value="value" aria-label="Type" />
                        </div>

                        <template v-if="section.type === 'languages'">
                            <div v-for="(item, itemIndex) in props.resumeData.customSections[index].items"
                                :key="itemIndex" class="d-flex align-center mb-2">
                                <v-text-field v-model="props.resumeData.customSections[index].items[itemIndex].name"
                                    label="Language" :disabled="!props.resumeData.customSections[index].visible"
                                    variant="outlined" density="comfortable" class="mr-2" aria-label="Language" />
                                <v-slider v-model="props.resumeData.customSections[index].items[itemIndex].proficiency"
                                    label="Proficiency" :disabled="!props.resumeData.customSections[index].visible"
                                    min="0" max="100" step="5" class="mr-2" />
                                <v-btn icon="mdi-delete" color="error" variant="text"
                                    @click="removeCustomSectionItem(index, itemIndex)"
                                    :disabled="!props.resumeData.customSections[index].visible"
                                    aria-label="Delete language" />
                            </div>
                            <div class="d-flex align-center mb-2">
                                <v-text-field v-model="newCustomSectionItem.name" label="Language"
                                    :disabled="!props.resumeData.customSections[index].visible" variant="outlined"
                                    density="comfortable" class="mr-2" aria-label="Language" />
                                <v-slider v-model="newCustomSectionItem.proficiency" label="Proficiency"
                                    :disabled="!props.resumeData.customSections[index].visible" min="0" max="100"
                                    step="5" class="mr-2" />
                                <v-btn color="primary" @click="addCustomSectionItem(index)"
                                    :disabled="!props.resumeData.customSections[index].visible" prepend-icon="mdi-plus"
                                    aria-label="Add language">Add Language</v-btn>
                            </div>
                        </template>

                        <template v-else-if="section.type === 'list'">
                            <div v-for="(item, itemIndex) in props.resumeData.customSections[index].items"
                                :key="itemIndex" class="d-flex align-center mb-2">
                                <v-text-field v-model="props.resumeData.customSections[index].items[itemIndex].value"
                                    label="Item" :disabled="!props.resumeData.customSections[index].visible"
                                    variant="outlined" density="comfortable" class="mr-2" aria-label="Item" />
                                <v-btn icon="mdi-delete" color="error" variant="text"
                                    @click="removeCustomSectionItem(index, itemIndex)"
                                    :disabled="!props.resumeData.customSections[index].visible"
                                    aria-label="Delete item" />
                            </div>
                            <div class="d-flex align-center mb-2">
                                <v-text-field v-model="newCustomSectionItem.value" label="Item"
                                    :disabled="!props.resumeData.customSections[index].visible" variant="outlined"
                                    density="comfortable" class="mr-2" aria-label="Item" />
                                <v-btn color="primary" @click="addCustomSectionItem(index)"
                                    :disabled="!props.resumeData.customSections[index].visible" prepend-icon="mdi-plus"
                                    aria-label="Add item">Add Item</v-btn>
                            </div>
                        </template>

                        <template v-else>
                            <div v-for="(item, itemIndex) in props.resumeData.customSections[index].items"
                                :key="itemIndex" class="custom-section-item mb-4">
                                <div class="d-flex align-center mb-2">
                                    <v-textarea v-model="props.resumeData.customSections[index].items[itemIndex].value"
                                        label="Item" :disabled="!props.resumeData.customSections[index].visible"
                                        variant="outlined" density="comfortable" class="flex-grow-1"
                                        aria-label="Item" />
                                </div>
                                <div class="d-flex align-center justify-end">
                                    <v-switch v-model="props.resumeData.customSections[index].items[itemIndex].isLink"
                                        label="Link" :disabled="!props.resumeData.customSections[index].visible"
                                        hide-details density="compact" color="primary" class="mr-2" />
                                    <v-btn icon="mdi-delete" color="error" variant="text"
                                        @click="removeCustomSectionItem(index, itemIndex)"
                                        :disabled="!props.resumeData.customSections[index].visible"
                                        aria-label="Delete item" />
                                </div>
                                <div v-if="props.resumeData.customSections[index].items[itemIndex].isLink" class="mt-2">
                                    <v-text-field v-model="props.resumeData.customSections[index].items[itemIndex].href"
                                        label="URL" :disabled="!props.resumeData.customSections[index].visible"
                                        variant="outlined" density="comfortable" placeholder="https://example.com"
                                        aria-label="URL" />
                                </div>
                            </div>

                            <div class="custom-section-item mb-4">
                                <div class="d-flex align-center mb-2">
                                    <v-textarea v-model="newCustomSectionItem.value" label="New Item"
                                        :disabled="!props.resumeData.customSections[index].visible" variant="outlined"
                                        density="comfortable" class="flex-grow-1" aria-label="New Item" />
                                </div>
                                <div class="d-flex align-center justify-end">
                                    <v-switch v-model="newCustomSectionItem.isLink" label="Link"
                                        :disabled="!props.resumeData.customSections[index].visible" hide-details
                                        density="compact" color="primary" class="mr-2" />
                                    <v-btn color="primary" @click="addCustomSectionItem(index)"
                                        :disabled="!props.resumeData.customSections[index].visible"
                                        prepend-icon="mdi-plus" aria-label="Add item">Add Item</v-btn>
                                </div>
                                <div v-if="newCustomSectionItem.isLink" class="mt-2">
                                    <v-text-field v-model="newCustomSectionItem.href" label="URL"
                                        :disabled="!props.resumeData.customSections[index].visible" variant="outlined"
                                        density="comfortable" placeholder="https://example.com" aria-label="URL" />
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
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { ResumeDataV1 as ResumeData } from '../models/ResumeData/ResumeDataV1'
import { ResumeStyle2ColumnsV1 as ResumeStyleClass } from '../models/ResumeStyle/ResumeStyle2ColumnsV1'

const props = defineProps({
    resumeData: {
        type: Object,
        required: true
    },
    isMobile: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['update:resume-data', 'change'])

const newCustomSectionItem = ref(ResumeData.getNewCustomSectionItem())
const sectionTypes = ResumeStyleClass.SECTION_TYPES

const editingSectionTitle = ref({})
const deleteConfirmState = ref({})

const handleClickOutside = (event) => {
    Object.keys(deleteConfirmState.value).forEach(key => {
        deleteConfirmState.value[key] = false
    })
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

const addExp = () => {
    props.resumeData.experiences.push(ResumeData.getNewExperience())
}

const removeExp = (index) => {
    if (!deleteConfirmState.value[`exp-${index}`]) {
        deleteConfirmState.value[`exp-${index}`] = true
        return
    }
    props.resumeData.experiences.splice(index, 1)
    deleteConfirmState.value[`exp-${index}`] = false
}

const addEdu = () => {
    props.resumeData.education.push(ResumeData.getNewEducation())
}

const removeEdu = (index) => {
    if (!deleteConfirmState.value[`edu-${index}`]) {
        deleteConfirmState.value[`edu-${index}`] = true
        return
    }
    props.resumeData.education.splice(index, 1)
    deleteConfirmState.value[`edu-${index}`] = false
}

const addCustomSection = () => {
    props.resumeData.customSections.push(ResumeData.getNewCustomSection())
}

const removeCustomSection = (index) => {
    if (!deleteConfirmState.value[index]) {
        deleteConfirmState.value[index] = true
        return
    }
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
    props.resumeData.customSections[index].title = props.resumeData.customSections[index].title
    editingSectionTitle.value[index] = false
}

const moveCustomSection = (index, direction) => {
    const sections = props.resumeData.customSections
    if (direction === 'up' && index > 0) {
        [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]]
    } else if (direction === 'down' && index < sections.length - 1) {
        [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]]
    }
}
</script>

<style scoped src="./ResumeEditorStyles.css"></style>