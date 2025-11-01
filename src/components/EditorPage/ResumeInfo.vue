<template>
    <div>
        <div class="editor-sections">
            <!-- Personal Section -->
            <div class="editor-section" data-section="personal">
                <div class="section-header">
                    <div class="d-flex align-center w-100">
                        <span class="section-title">
                            Personal Information
                        </span>
                    </div>
                </div>
                <div class="section-content">
                    <v-text-field v-model="props.resumeData.personal.name" label="Name" variant="outlined"
                        density="comfortable" class="mb-2" aria-label="Name" />
                    <v-text-field v-model="props.resumeData.personal.title" label="Title" variant="outlined"
                        density="comfortable" aria-label="Title" />
                    <div class="d-flex align-center">
                        <v-file-input 
                            :model-value="props.resumeData.personal.image" label="Image" variant="outlined"
                            density="comfortable" aria-label="Image" accept="image/*" @change="handleImageChange"
                            prepend-icon=""
                            clearable
                            clear-icon="ph-delete"
                            @click:clear="handleClearImage"
                            />
                    </div>
                </div>
            </div>

            <div v-for="(section, index) in orderedSections" :key="section.type + (section.originalIndex || '')">
                <!-- Experience Section -->
                <div v-if="section.type === 'experience'" class="editor-section" data-section="experience">
                    <div class="section-header">
                        <div class="d-flex align-center w-100">
                            <span class="section-title">
                                {{ props.resumeData.experiencesSectionName }}
                            </span>
                            <div class="section-actions ml-auto">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps" icon="ph-pencil-simple" size="small"
                                            class="edit-icon" @click.stop="openSectionNameModal('experience')" />
                                    </template>
                                    Edit section
                                </v-tooltip>
                                <v-icon :icon="props.resumeData.experiencesVisible ? 'ph-eye' : 'ph-eye-slash'"
                                    size="small" class="visibility-icon"
                                    @click.stop="props.resumeData.experiencesVisible = !props.resumeData.experiencesVisible" />
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps" icon="ph-arrow-up" size="small" class="move-icon"
                                            :class="{ 'v-icon--disabled': index === 0 }"
                                            @click.stop="moveSection({ type: 'experience' }, 'up')"
                                            :disabled="index === 0" />
                                    </template>
                                    Move section up
                                </v-tooltip>
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps" icon="ph-arrow-down" size="small" class="move-icon"
                                            :class="{ 'v-icon--disabled': index === orderedSections.length - 1 }"
                                            @click.stop="moveSection({ type: 'experience' }, 'down')"
                                            :disabled="index === orderedSections.length - 1" />
                                    </template>
                                    Move section down
                                </v-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="section-content">
                        <div v-for="(exp, expIndex) in props.resumeData.experiences" :key="expIndex"
                            class="experience-item">
                            <SectionListItem :title="`${exp.title} - ${exp.company}`" :visible="exp.visible"
                                :can-move-up="expIndex > 0"
                                :can-move-down="expIndex < props.resumeData.experiences.length - 1"
                                :delete-confirm="deleteConfirmState[`exp-${expIndex}`]"
                                :disabled="!props.resumeData.experiencesVisible"
                                @toggle-visibility="toggleItemVisibility(props.resumeData.experiences, expIndex)"
                                @edit="openExperienceModal(expIndex)" @move-up="moveExperienceItem(expIndex, 'up')"
                                @move-down="moveExperienceItem(expIndex, 'down')" @delete="removeExp(expIndex)" />
                        </div>
                        <div class="d-flex justify-center">
                            <v-btn color="primary" @click="addExp" aria-label="Add Experience"
                                :disabled="!props.resumeData.experiencesVisible" prepend-icon="ph-plus">Add
                                Experience</v-btn>
                        </div>
                    </div>
                </div>

                <!-- Education Section -->
                <div v-if="section.type === 'education'" class="editor-section" data-section="education">
                    <div class="section-header">
                        <div class="d-flex align-center w-100">
                            <span class="section-title">
                                {{ props.resumeData.educationSectionName }}
                            </span>
                            <div class="section-actions ml-auto">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps" icon="ph-pencil-simple" size="small"
                                            class="edit-icon" @click.stop="openSectionNameModal('education')" />
                                    </template>
                                    Edit section
                                </v-tooltip>
                                <v-icon :icon="props.resumeData.educationVisible ? 'ph-eye' : 'ph-eye-slash'"
                                    size="small" class="visibility-icon"
                                    @click.stop="props.resumeData.educationVisible = !props.resumeData.educationVisible" />
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps" icon="ph-arrow-up" size="small" class="move-icon"
                                            :class="{ 'v-icon--disabled': index === 0 }"
                                            @click.stop="moveSection({ type: 'education' }, 'up')"
                                            :disabled="index === 0" />
                                    </template>
                                    Move section up
                                </v-tooltip>
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: iconProps }">
                                        <v-icon v-bind="iconProps" icon="ph-arrow-down" size="small" class="move-icon"
                                            :class="{ 'v-icon--disabled': index === orderedSections.length - 1 }"
                                            @click.stop="moveSection({ type: 'education' }, 'down')"
                                            :disabled="index === orderedSections.length - 1" />
                                    </template>
                                    Move section down
                                </v-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="section-content">
                        <div v-for="(edu, eduIndex) in props.resumeData.education" :key="eduIndex"
                            class="education-item">
                            <SectionListItem :title="`${edu.degree} - ${edu.school}`" :visible="edu.visible"
                                :can-move-up="eduIndex > 0"
                                :can-move-down="eduIndex < props.resumeData.education.length - 1"
                                :delete-confirm="deleteConfirmState[`edu-${eduIndex}`]"
                                :disabled="!props.resumeData.educationVisible"
                                @toggle-visibility="toggleItemVisibility(props.resumeData.education, eduIndex)"
                                @edit="openEducationModal(eduIndex)" @move-up="moveEducationItem(eduIndex, 'up')"
                                @move-down="moveEducationItem(eduIndex, 'down')" @delete="removeEdu(eduIndex)" />
                        </div>
                        <div class="d-flex justify-center">
                            <v-btn color="primary" @click="addEdu" aria-label="Add Education"
                                :disabled="!props.resumeData.educationVisible" prepend-icon="ph-plus">Add
                                Education</v-btn>
                        </div>
                    </div>
                </div>

                <!-- Custom Sections -->
                <div v-if="section.type === 'custom'" class="editor-section"
                    :data-section="`custom-${section.originalIndex}`">
                    <div class="section-header">
                        <div class="custom-section-title-row">
                            <div class="section-title">{{ section.data.title }}</div>
                            <div class="section-actions">
                                <CustomSectionHeaderActions
                                    :visible="props.resumeData.customSections[section.originalIndex].visible"
                                    :position="props.resumeData.customSections[section.originalIndex].position"
                                    :can-move-up="index === 0 ? false : true"
                                    :can-move-down="index === orderedSections.length - 1 ? false : true"
                                    :delete-confirm="deleteConfirmState[section.originalIndex]"
                                    :disabled="!props.resumeData.customSections[section.originalIndex].visible"
                                    @edit="openCustomSectionModal(section.originalIndex)"
                                    @toggle-visible="toggleItemVisibility(props.resumeData.customSections, section.originalIndex)"
                                    @toggle-position="toggleSectionPosition(section.originalIndex)"
                                    @move-up="moveSection({ type: 'custom', originalIndex: section.originalIndex }, 'up')"
                                    @move-down="moveSection({ type: 'custom', originalIndex: section.originalIndex }, 'down')"
                                    @delete="removeCustomSection(section.originalIndex)"
                                    @clone="cloneCustomSection(section.originalIndex)" />
                            </div>
                        </div>
                    </div>
                    <div class="custom-section-preview" v-html="section.data.content"></div>
                </div>
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

        <!-- Section Name Modal (reused for experience/education) -->
        <v-dialog v-model="sectionNameModal.show" max-width="500px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon :icon="sectionNameModal.type === 'experience' ? 'ph-briefcase' : 'ph-graduation-cap'"
                        class="mr-2" />
                    Edit {{ sectionNameModal.type === 'experience' ? 'Experience' : 'Education' }} Section
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="sectionNameModal.data.sectionName" label="Section Title" variant="outlined"
                        density="comfortable" prepend-inner-icon="ph-text-t" />
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="closeSectionNameModal" class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveSectionName" class="modal-btn" prepend-icon="ph-check">
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import CustomSectionHeaderActions from './CustomSectionHeaderActions.vue'
import SectionListItem from './SectionListItem.vue'
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

const orderedSections = computed(() => {
    const sections = []
    sections.push({
        type: 'experience',
        order: props.resumeData.experiencesOrder,
    })
    sections.push({
        type: 'education',
        order: props.resumeData.educationOrder,
    })
    props.resumeData.customSections.forEach((section, index) => {
        sections.push({
            type: 'custom',
            order: section.order ?? index,
            originalIndex: index,
            data: section,
        })
    })
    sections.sort((a, b) => a.order - b.order)
    return sections
})

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

const sectionNameModal = ref({
    show: false,
    type: 'experience', // 'experience' | 'education'
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

// removed dedicated education section modal in favor of unified modal

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

// Unified Section Name Modal Methods
const openSectionNameModal = (type) => {
    sectionNameModal.value = {
        show: true,
        type,
        data: {
            sectionName: type === 'experience' ? props.resumeData.experiencesSectionName : props.resumeData.educationSectionName
        }
    }
}

const closeSectionNameModal = () => {
    sectionNameModal.value.show = false
}

const saveSectionName = () => {
    if (sectionNameModal.value.type === 'experience') {
        props.resumeData.experiencesSectionName = sectionNameModal.value.data.sectionName
    } else {
        props.resumeData.educationSectionName = sectionNameModal.value.data.sectionName
    }
    closeSectionNameModal()
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

// removed dedicated education section name handlers in favor of unified modal

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

const addExp = () => {
    openExperienceModal()
}

const removeItem = (prefixKey, list, index) => {
    const key = prefixKey ? `${prefixKey}-${index}` : index
    if (!deleteConfirmState.value[key]) {
        deleteConfirmState.value[key] = true
        return
    }
    list.splice(index, 1)
    deleteConfirmState.value[key] = false
}

const addEdu = () => {
    openEducationModal()
}

// removed in favor of removeItem

const removeExp = (index) => {
    removeItem('exp', props.resumeData.experiences, index)
}

const removeEdu = (index) => {
    removeItem('edu', props.resumeData.education, index)
}

const removeCustomSection = (index) => {
    removeItem('', props.resumeData.customSections, index)
}

const addCustomSection = () => {
    openCustomSectionModal()
}

// removed in favor of removeItem

const moveSection = (sectionInfo, direction) => {
    const sections = orderedSections.value
    const currentIndex = sections.findIndex(s => s.type === sectionInfo.type && s.originalIndex === sectionInfo.originalIndex)
    if ((direction === 'up' && currentIndex === 0) || (direction === 'down' && currentIndex === sections.length - 1)) return

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const current = sections[currentIndex]
    const target = sections[targetIndex]

    const currentOrder = current.order
    const targetOrder = target.order

    // apply swap to underlying data
    if (current.type === 'experience') {
        props.resumeData.experiencesOrder = targetOrder
    } else if (current.type === 'education') {
        props.resumeData.educationOrder = targetOrder
    } else {
        props.resumeData.customSections[current.originalIndex].order = targetOrder
    }

    if (target.type === 'experience') {
        props.resumeData.experiencesOrder = currentOrder
    } else if (target.type === 'education') {
        props.resumeData.educationOrder = currentOrder
    } else {
        props.resumeData.customSections[target.originalIndex].order = currentOrder
    }
}

// Simple array move helpers for items
const moveArrayItem = (arr, index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= arr.length) return
    const temp = arr[index]
    arr[index] = arr[targetIndex]
    arr[targetIndex] = temp
}

const moveExperienceItem = (index, direction) => {
    if (!props.resumeData.experiencesVisible) return
    moveArrayItem(props.resumeData.experiences, index, direction)
}

const moveEducationItem = (index, direction) => {
    if (!props.resumeData.educationVisible) return
    moveArrayItem(props.resumeData.education, index, direction)
}

const toggleItemVisibility = (list, index) => {
    list[index].visible = !list[index].visible
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

// removed unused preview helper; using v-html directly

// removed helper; handled by CustomSectionHeaderActions label

const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            props.resumeData.personal.imageData = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

const handleClearImage = () => {
    props.resumeData.personal.image = null
    props.resumeData.personal.imageData = ''
}
</script>

<style scoped src="./ResumeEditorStyles.css"></style>