<template>
    <div>
        <div class="editor-sections">
            <!-- Personal Section -->
            <div class="editor-section" data-section="personal">
                <div class="section-header">
                    <div class="d-flex align-center w-100">
                        <span class="section-title">
                            Personal Information
                            <v-icon :icon="props.resumeData.personal.visible ? 'ph-eye' : 'ph-eye-slash'" size="small"
                                class="visibility-icon"
                                @click.stop="props.resumeData.personal.visible = !props.resumeData.personal.visible" />
                        </span>
                    </div>
                </div>
                <div class="section-content">
                    <v-text-field v-model="props.resumeData.personal.name" label="Name" variant="outlined"
                        density="comfortable" class="mb-2" aria-label="Name"
                        :disabled="!props.resumeData.personal.visible" />
                    <v-text-field v-model="props.resumeData.personal.title" label="Title" variant="outlined"
                        density="comfortable" aria-label="Title" :disabled="!props.resumeData.personal.visible" />
                </div>
            </div>

            <!-- Experience Section -->
            <div class="editor-section" data-section="experience">
                <div class="section-header">
                    <div class="d-flex align-center w-100">
                        <span class="section-title">
                            {{ props.resumeData.experiencesSectionName }}
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props: iconProps }">
                                    <v-icon v-bind="iconProps" icon="ph-pencil-simple" size="small" class="edit-icon"
                                        @click.stop="openExperienceSectionModal" />
                                </template>
                                Edit section
                            </v-tooltip>
                            <v-icon :icon="props.resumeData.experiencesVisible ? 'ph-eye' : 'ph-eye-slash'" size="small"
                                class="visibility-icon"
                                @click.stop="props.resumeData.experiencesVisible = !props.resumeData.experiencesVisible" />
                        </span>
                    </div>
                </div>
                <div class="section-content">
                    <div v-for="(exp, index) in props.resumeData.experiences" :key="index" class="experience-item">
                        <div class="item-header">
                            <span class="item-title">{{ exp.title }} - {{ exp.company }}</span>
                            <div class="item-actions">
                                <v-icon :icon="props.resumeData.experiences[index].visible ? 'ph-eye' : 'ph-eye-slash'"
                                    size="small" class="visibility-icon"
                                    @click.stop="props.resumeData.experiences[index].visible = !props.resumeData.experiences[index].visible" />
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps" icon="ph-pencil-simple" size="small"
                                            class="edit-icon" @click.stop="openExperienceModal(index)" />
                                    </template>
                                    Edit experience
                                </v-tooltip>
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps"
                                            :icon="deleteConfirmState[`exp-${index}`] ? 'ph-check' : 'ph-delete'"
                                            size="small" class="delete-icon"
                                            :class="{ 'v-icon--disabled': !props.resumeData.experiencesVisible }"
                                            @click.stop="removeExp(index)"
                                            :disabled="!props.resumeData.experiencesVisible" />
                                    </template>
                                    {{ deleteConfirmState[`exp-${index}`] ? 'Confirm delete' : "Delete experience" }}
                                </v-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-center">
                        <v-btn color="primary" @click="addExp" aria-label="Add Experience"
                            :disabled="!props.resumeData.experiencesVisible" prepend-icon="ph-plus">Add
                            Experience</v-btn>
                    </div>
                </div>
            </div>

            <!-- Education Section -->
            <div class="editor-section" data-section="education">
                <div class="section-header">
                    <div class="d-flex align-center w-100">
                        <span class="section-title">
                            {{ props.resumeData.educationSectionName }}
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props: iconProps }">
                                    <v-icon v-bind="iconProps" icon="ph-pencil-simple" size="small" class="edit-icon"
                                        @click.stop="openEducationSectionModal" />
                                </template>
                                Edit section
                            </v-tooltip>
                            <v-icon :icon="props.resumeData.educationVisible ? 'ph-eye' : 'ph-eye-slash'" size="small"
                                class="visibility-icon"
                                @click.stop="props.resumeData.educationVisible = !props.resumeData.educationVisible" />
                        </span>
                    </div>
                </div>
                <div class="section-content">
                    <div v-for="(edu, index) in props.resumeData.education" :key="index" class="education-item">
                        <div class="item-header">
                            <span class="item-title">{{ edu.degree }} - {{ edu.school }}</span>
                            <div class="item-actions">
                                <v-icon :icon="props.resumeData.education[index].visible ? 'ph-eye' : 'ph-eye-slash'"
                                    size="small" class="visibility-icon"
                                    @click.stop="props.resumeData.education[index].visible = !props.resumeData.education[index].visible" />
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps" icon="ph-pencil-simple" size="small"
                                            class="edit-icon" @click.stop="openEducationModal(index)" />
                                    </template>
                                    Edit education
                                </v-tooltip>
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps"
                                            :icon="deleteConfirmState[`edu-${index}`] ? 'ph-check' : 'ph-delete'"
                                            size="small" class="delete-icon"
                                            :class="{ 'v-icon--disabled': !props.resumeData.educationVisible }"
                                            @click.stop="removeEdu(index)"
                                            :disabled="!props.resumeData.educationVisible" />
                                    </template>
                                    {{ deleteConfirmState[`edu-${index}`] ? 'Confirm delete' : "Delete education" }}
                                </v-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-center">
                        <v-btn color="primary" @click="addEdu" aria-label="Add Education"
                            :disabled="!props.resumeData.educationVisible" prepend-icon="ph-plus">Add Education</v-btn>
                    </div>
                </div>
            </div>

            <!-- Custom Sections -->
            <div v-for="(section, index) in props.resumeData.customSections" :key="index" class="editor-section"
                :data-section="`custom-${index}`">
                <div class="section-header">
                    <div class="custom-section-title-row">
                        <div class="section-title">{{ section.title }}</div>
                        <div class="section-actions">
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props: iconProps }">
                                    <v-icon v-bind="iconProps" icon="ph-pencil-simple" size="small" class="edit-icon"
                                        @click.stop="openCustomSectionModal(index)" />
                                </template>
                                Edit section
                            </v-tooltip>
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props: iconProps }">
                                    <v-icon v-bind="iconProps"
                                        :icon="props.resumeData.customSections[index].visible ? 'ph-eye' : 'ph-eye-slash'"
                                        size="small" class="visibility-icon"
                                        @click.stop="props.resumeData.customSections[index].visible = !props.resumeData.customSections[index].visible" />
                                </template>
                                {{ props.resumeData.customSections[index].visible ? 'Hide section' : 'Show section'
                                }}
                            </v-tooltip>
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props: iconProps }">
                                    <v-icon v-bind="iconProps"
                                        :icon="props.resumeData.customSections[index].position === 'sidebar' ? 'ph-format-align-right' : 'ph-format-align-left'"
                                        size="small" class="position-icon" @click.stop="toggleSectionPosition(index)" />
                                </template>
                                {{ getPositionTooltipText(props.resumeData.customSections[index].position) }}
                            </v-tooltip>
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props: iconProps }">
                                    <v-icon v-bind="iconProps" icon="ph-arrow-up" size="small" class="move-icon"
                                        :class="{ 'v-icon--disabled': index === 0 }"
                                        @click.stop="moveCustomSection(index, 'up')" :disabled="index === 0" />
                                </template>
                                Move section up
                            </v-tooltip>
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props: iconProps }">
                                    <v-icon v-bind="iconProps" icon="ph-arrow-down" size="small" class="move-icon"
                                        :class="{ 'v-icon--disabled': index === props.resumeData.customSections.length - 1 }"
                                        @click.stop="moveCustomSection(index, 'down')"
                                        :disabled="index === props.resumeData.customSections.length - 1" />
                                </template>
                                Move section down
                            </v-tooltip>
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props: iconProps }">
                                    <v-icon v-bind="iconProps"
                                        :icon="deleteConfirmState[index] ? 'ph-check' : 'ph-delete'" size="small"
                                        class="delete-icon"
                                        :class="{ 'v-icon--disabled': !props.resumeData.customSections[index].visible }"
                                        @click.stop="removeCustomSection(index)"
                                        :disabled="!props.resumeData.customSections[index].visible" />
                                </template>
                                {{ deleteConfirmState[index] ? 'Confirm delete' : 'Delete section' }}
                            </v-tooltip>
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props: iconProps }">
                                    <v-icon v-bind="iconProps" icon="ph-content-copy" size="small" class="clone-icon"
                                        :class="{ 'v-icon--disabled': !props.resumeData.customSections[index].visible }"
                                        @click.stop="cloneCustomSection(index)"
                                        :disabled="!props.resumeData.customSections[index].visible" />
                                </template>
                                Clone section
                            </v-tooltip>
                        </div>
                    </div>
                </div>
                <div class="custom-section-preview" v-html="section.content"></div>
            </div>
        </div>

        <div class="d-flex flex-column align-center">
            <v-btn color="primary" @click="addCustomSection" prepend-icon="ph-plus" class="mt-4 action-btn"
                aria-label="Add custom section">Add Custom Section</v-btn>
        </div>

        <!-- Custom Section Modal -->
        <v-dialog v-model="customSectionModal.show" max-width="800px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon icon="ph-folder-simple" class="mr-2" />
                    {{ customSectionModal.isNew ? 'Add Custom Section' : 'Edit Custom Section' }}
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="customSectionModal.data.title" label="Section Title" variant="outlined"
                        density="comfortable" class="mb-4" prepend-inner-icon="ph-text-t" />
                    <div class="mb-4">
                        <label class="v-label mb-2 d-block">Content</label>
                        <TiptapEditor v-model="customSectionModal.data.content" />
                    </div>
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="closeCustomSectionModal" class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveCustomSection" class="modal-btn" prepend-icon="ph-check">
                        {{ customSectionModal.isNew ? 'Add' : 'Save' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Experience Section Modal -->
        <v-dialog v-model="experienceSectionModal.show" max-width="500px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon icon="ph-briefcase" class="mr-2" />
                    Edit Experience Section
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="experienceSectionModal.data.sectionName" label="Section Title"
                        variant="outlined" density="comfortable" prepend-inner-icon="ph-text-t" />
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="closeExperienceSectionModal"
                        class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveExperienceSection" class="modal-btn" prepend-icon="ph-check">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Experience Modal -->
        <v-dialog v-model="experienceModal.show" max-width="800px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon icon="ph-briefcase" class="mr-2" />
                    {{ experienceModal.isNew ? 'Add Experience' : 'Edit Experience' }}
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="experienceModal.data.title" label="Job Title" variant="outlined"
                        density="comfortable" class="mb-3" prepend-inner-icon="ph-user" />
                    <v-text-field v-model="experienceModal.data.company" label="Company (+ location)" variant="outlined"
                        density="comfortable" class="mb-3" prepend-inner-icon="ph-buildings" />
                    <v-text-field v-model="experienceModal.data.period" label="Period" variant="outlined"
                        density="comfortable" class="mb-3" prepend-inner-icon="ph-calendar" />
                    <div class="mb-3">
                        <label class="v-label mb-2 d-block">Description</label>
                        <TiptapEditor v-model="experienceModal.data.description" />
                    </div>
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="closeExperienceModal" class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveExperience" class="modal-btn" prepend-icon="ph-check">
                        {{ experienceModal.isNew ? 'Add' : 'Save' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Education Section Modal -->
        <v-dialog v-model="educationSectionModal.show" max-width="500px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon icon="ph-graduation-cap" class="mr-2" />
                    Edit Education Section
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="educationSectionModal.data.sectionName" label="Section Title"
                        variant="outlined" density="comfortable" prepend-inner-icon="ph-text-t" />
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="closeEducationSectionModal"
                        class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveEducationSection" class="modal-btn" prepend-icon="ph-check">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Education Modal -->
        <v-dialog v-model="educationModal.show" max-width="800px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon icon="ph-graduation-cap" class="mr-2" />
                    {{ educationModal.isNew ? 'Add Education' : 'Edit Education' }}
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="educationModal.data.degree" label="Degree" variant="outlined"
                        density="comfortable" class="mb-3" prepend-inner-icon="ph-certificate" />
                    <v-text-field v-model="educationModal.data.school" label="School" variant="outlined"
                        density="comfortable" class="mb-3" prepend-inner-icon="ph-buildings" />
                    <v-text-field v-model="educationModal.data.period" label="Period" variant="outlined"
                        density="comfortable" class="mb-3" prepend-inner-icon="ph-calendar" />
                    <v-text-field v-model="educationModal.data.mark" label="Grade" variant="outlined"
                        density="comfortable" class="mb-3" prepend-inner-icon="ph-star" />
                    <div class="mb-3">
                        <label class="v-label mb-2 d-block">Thesis / Notes</label>
                        <TiptapEditor v-model="educationModal.data.thesis" />
                    </div>
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="closeEducationModal" class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveEducation" class="modal-btn" prepend-icon="ph-check">
                        {{ educationModal.isNew ? 'Add' : 'Save' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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

const deleteConfirmState = ref({})

// Modal states
const customSectionModal = ref({
    show: false,
    isNew: false,
    index: -1,
    data: {
        title: '',
        content: '',
        visible: true,
        position: 'main'
    }
})

const experienceSectionModal = ref({
    show: false,
    data: {
        sectionName: ''
    }
})

const experienceModal = ref({
    show: false,
    isNew: false,
    index: -1,
    data: {
        title: '',
        company: '',
        period: '',
        description: '',
        visible: true
    }
})

const educationSectionModal = ref({
    show: false,
    data: {
        sectionName: ''
    }
})

const educationModal = ref({
    show: false,
    isNew: false,
    index: -1,
    data: {
        degree: '',
        school: '',
        period: '',
        mark: '',
        thesis: '',
        visible: true
    }
})

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

// Custom Section Modal Methods
const openCustomSectionModal = (index = -1) => {
    if (index >= 0) {
        // Edit existing section
        const section = props.resumeData.customSections[index]
        customSectionModal.value = {
            show: true,
            isNew: false,
            index,
            data: {
                title: section.title,
                content: section.content,
                visible: section.visible,
                position: section.position
            }
        }
    } else {
        // Add new section
        customSectionModal.value = {
            show: true,
            isNew: true,
            index: -1,
            data: {
                title: '',
                content: '',
                visible: true,
                position: 'main'
            }
        }
    }
}

const closeCustomSectionModal = () => {
    customSectionModal.value.show = false
}

const saveCustomSection = () => {
    if (customSectionModal.value.isNew) {
        // Add new section
        props.resumeData.customSections.push({
            ...customSectionModal.value.data
        })
    } else {
        // Update existing section
        const index = customSectionModal.value.index
        Object.assign(props.resumeData.customSections[index], customSectionModal.value.data)
    }
    closeCustomSectionModal()
}

// Experience Section Modal Methods
const openExperienceSectionModal = () => {
    experienceSectionModal.value = {
        show: true,
        data: {
            sectionName: props.resumeData.experiencesSectionName
        }
    }
}

const closeExperienceSectionModal = () => {
    experienceSectionModal.value.show = false
}

const saveExperienceSection = () => {
    props.resumeData.experiencesSectionName = experienceSectionModal.value.data.sectionName
    closeExperienceSectionModal()
}

// Experience Modal Methods
const openExperienceModal = (index = -1) => {
    if (index >= 0) {
        // Edit existing experience
        const exp = props.resumeData.experiences[index]
        experienceModal.value = {
            show: true,
            isNew: false,
            index,
            data: {
                title: exp.title,
                company: exp.company,
                period: exp.period,
                description: exp.description,
                visible: exp.visible
            }
        }
    } else {
        // Add new experience
        experienceModal.value = {
            show: true,
            isNew: true,
            index: -1,
            data: {
                title: '',
                company: '',
                period: '',
                description: '',
                visible: true
            }
        }
    }
}

const closeExperienceModal = () => {
    experienceModal.value.show = false
}

const saveExperience = () => {
    if (experienceModal.value.isNew) {
        // Add new experience
        props.resumeData.experiences.push({
            ...experienceModal.value.data
        })
    } else {
        // Update existing experience
        const index = experienceModal.value.index
        Object.assign(props.resumeData.experiences[index], experienceModal.value.data)
    }
    closeExperienceModal()
}

// Education Section Modal Methods
const openEducationSectionModal = () => {
    educationSectionModal.value = {
        show: true,
        data: {
            sectionName: props.resumeData.educationSectionName
        }
    }
}

const closeEducationSectionModal = () => {
    educationSectionModal.value.show = false
}

const saveEducationSection = () => {
    props.resumeData.educationSectionName = educationSectionModal.value.data.sectionName
    closeEducationSectionModal()
}

// Education Modal Methods
const openEducationModal = (index = -1) => {
    if (index >= 0) {
        // Edit existing education
        const edu = props.resumeData.education[index]
        educationModal.value = {
            show: true,
            isNew: false,
            index,
            data: {
                degree: edu.degree,
                school: edu.school,
                period: edu.period,
                mark: edu.mark,
                thesis: edu.thesis,
                visible: edu.visible
            }
        }
    } else {
        // Add new education
        educationModal.value = {
            show: true,
            isNew: true,
            index: -1,
            data: {
                degree: '',
                school: '',
                period: '',
                mark: '',
                thesis: '',
                visible: true
            }
        }
    }
}

const closeEducationModal = () => {
    educationModal.value.show = false
}

const saveEducation = () => {
    if (educationModal.value.isNew) {
        // Add new education
        props.resumeData.education.push({
            ...educationModal.value.data
        })
    } else {
        // Update existing education
        const index = educationModal.value.index
        Object.assign(props.resumeData.education[index], educationModal.value.data)
    }
    closeEducationModal()
}

// Legacy methods (updated to use modals)
const addExp = () => {
    openExperienceModal()
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
    openEducationModal()
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
    openCustomSectionModal()
}

const removeCustomSection = (index) => {
    if (!deleteConfirmState.value[index]) {
        deleteConfirmState.value[index] = true
        return
    }
    props.resumeData.customSections.splice(index, 1)
    deleteConfirmState.value[index] = false
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

const getCustomSectionPreview = (content) => {
    if (!content) return '';

    // Strip HTML tags and get plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    // Return first 80 characters with ellipsis if longer
    return plainText.length > 80 ? plainText.substring(0, 80) + '...' : plainText;
}

const getPositionTooltipText = (position) => {
    if (position === 'sidebar') {
        return 'Move to main content';
    } else if (position === 'main') {
        return 'Move to sidebar';
    }
    return '';
}
</script>

<style scoped src="./ResumeEditorStyles.css"></style>