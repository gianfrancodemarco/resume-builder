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
                        <span v-if="!editingSectionTitle.experience" class="section-title">
                            {{ props.resumeData.experiencesSectionName }}
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props: iconProps }">
                                    <v-icon v-bind="iconProps" icon="mdi-pencil" size="small" class="edit-icon"
                                        @click.stop="startEditingTitle('experience')" />
                                </template>
                                Edit section title
                            </v-tooltip>
                            <v-icon :icon="props.resumeData.experiencesVisible ? 'mdi-eye' : 'mdi-eye-off'" size="small"
                                class="visibility-icon"
                                @click.stop="props.resumeData.experiencesVisible = !props.resumeData.experiencesVisible" />
                        </span>
                        <v-text-field v-else v-model="props.resumeData.experiencesSectionName" variant="outlined"
                            density="comfortable" class="title-edit-field" @blur="stopEditingTitle('experience')"
                            @keyup.enter="stopEditingTitle('experience')" ref="experienceTitleField" />
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
                                            {{ deleteConfirmState[`exp-${index}`] ? 'Confirm delete' : "Delete experience" }}
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
                                <div class="mb-2">
                                    <label class="v-label">Description</label>
                                    <TiptapEditor v-model="props.resumeData.experiences[index].description"
                                        :disabled="!props.resumeData.experiencesVisible || !props.resumeData.experiences[index].visible" />
                                </div>
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
                        <span v-if="!editingSectionTitle.education" class="section-title">
                            {{ props.resumeData.educationSectionName }}
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props: iconProps }">
                                    <v-icon v-bind="iconProps" icon="mdi-pencil" size="small" class="edit-icon"
                                        @click.stop="startEditingTitle('education')" />
                                </template>
                                Edit section title
                            </v-tooltip>
                            <v-icon :icon="props.resumeData.educationVisible ? 'mdi-eye' : 'mdi-eye-off'" size="small"
                                class="visibility-icon"
                                @click.stop="props.resumeData.educationVisible = !props.resumeData.educationVisible" />
                        </span>
                        <v-text-field v-else v-model="props.resumeData.educationSectionName" variant="outlined"
                            density="comfortable" class="title-edit-field" @blur="stopEditingTitle('education')"
                            @keyup.enter="stopEditingTitle('education')" ref="educationTitleField" />
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
                                            {{ deleteConfirmState[`edu-${index}`] ? 'Confirm delete' : "Delete education" }}
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
                                <div class="mb-2">
                                    <label class="v-label">Thesis / Notes</label>
                                    <TiptapEditor v-model="props.resumeData.education[index].thesis"
                                        :disabled="!props.resumeData.educationVisible || !props.resumeData.education[index].visible" />
                                </div>
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
                                        <v-icon v-bind="iconProps"
                                            :icon="props.resumeData.customSections[index].position === 'sidebar' ? 'mdi-format-align-right' : 'mdi-format-align-left'"
                                            size="small" class="position-icon"
                                            @click.stop="toggleSectionPosition(index)" />
                                    </template>
                                    {{ props.resumeData.customSections[index].position === 'sidebar' ? 'Move to main content' : 'Move to sidebar' }}
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
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps" icon="mdi-content-copy" size="small"
                                            class="clone-icon" @click.stop="cloneCustomSection(index)"
                                            :disabled="!props.resumeData.customSections[index].visible" />
                                    </template>
                                    Clone section
                                </v-tooltip>
                            </span>
                            <v-text-field v-else v-model="props.resumeData.customSections[index].title" variant="plain"
                                density="compact" hide-details class="title-edit-field" @blur="stopEditingTitle(index)"
                                @keyup.enter="stopEditingTitle(index)" @keyup.esc="cancelEditingTitle(index)"
                                ref="titleField" />
                        </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <TiptapEditor v-model="section.content" />
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
import { ResumeData, ResumeStyleClass } from '@/services/ResumeService'
import TiptapEditor from './TiptapEditor.vue'

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

const toggleSectionPosition = (index) => {
    props.resumeData.customSections[index].position =
        props.resumeData.customSections[index].position === 'sidebar' ? 'main' : 'sidebar';
}

const cloneCustomSection = (index) => {
    const sectionToClone = props.resumeData.customSections[index]
    const clonedSection = {
        ...JSON.parse(JSON.stringify(sectionToClone)),
        title: `${sectionToClone.title} (Copy)`
    }
    props.resumeData.customSections.splice(index + 1, 0, clonedSection)
}
</script>

<style scoped src="./ResumeEditorStyles.css"></style>