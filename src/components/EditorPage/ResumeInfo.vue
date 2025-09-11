<template>
    <div>
        <div class="editor-sections">
            <!-- Basics Section -->
            <div class="editor-section" data-section="basics">
                <div class="section-header">
                    <div class="d-flex align-center w-100">
                        <span class="section-title">
                            Basics
                        </span>
                    </div>
                </div>
                <div class="section-content">
                    <v-text-field v-model="props.resumeData.basics.name" label="Name" variant="outlined"
                        density="comfortable" class="mb-2" />
                    <v-text-field v-model="props.resumeData.basics.label" label="Label" variant="outlined"
                        density="comfortable" class="mb-2" />
                    <v-text-field v-model="props.resumeData.basics.email" label="Email" variant="outlined"
                        density="comfortable" class="mb-2" />
                    <v-text-field v-model="props.resumeData.basics.phone" label="Phone" variant="outlined"
                        density="comfortable" class="mb-2" />
                    <v-text-field v-model="props.resumeData.basics.url" label="Website" variant="outlined"
                        density="comfortable" class="mb-2" />
                    <v-textarea v-model="props.resumeData.basics.summary" label="Summary" variant="outlined"
                        density="comfortable" />
                </div>
            </div>

            <!-- Work Section -->
            <div class="editor-section" data-section="work">
                <div class="section-header">
                    <div class="d-flex align-center w-100">
                        <span class="section-title">Work Experience</span>
                    </div>
                </div>
                <div class="section-content">
                    <div v-for="(workItem, index) in props.resumeData.work" :key="index" class="item-container">
                        <div class="item-header">
                            <span class="item-title">{{ workItem.position }} at {{ workItem.name }}</span>
                            <div class="item-actions">
                                <v-icon icon="ph-pencil-simple" size="small" class="edit-icon"
                                    @click="openWorkModal(index)" />
                                <v-icon icon="ph-delete" size="small" class="delete-icon"
                                    @click="removeWorkItem(index)" />
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-center mt-4">
                        <v-btn color="primary" prepend-icon="ph-plus" @click="openWorkModal()">Add Work</v-btn>
                    </div>
                </div>
            </div>

            <!-- Education Section -->
            <div class="editor-section" data-section="education">
                <div class="section-header">
                    <div class="d-flex align-center w-100">
                        <span class="section-title">Education</span>
                    </div>
                </div>
                <div class="section-content">
                    <div v-for="(educationItem, index) in props.resumeData.education" :key="index"
                        class="item-container">
                        <div class="item-header">
                            <span class="item-title">{{ educationItem.studyType }} at {{ educationItem.institution
                                }}</span>
                            <div class="item-actions">
                                <v-icon icon="ph-pencil-simple" size="small" class="edit-icon"
                                    @click="openEducationModal(index)" />
                                <v-icon icon="ph-delete" size="small" class="delete-icon"
                                    @click="removeEducationItem(index)" />
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-center mt-4">
                        <v-btn color="primary" prepend-icon="ph-plus" @click="openEducationModal()">Add
                            Education</v-btn>
                    </div>
                </div>
            </div>

            <!-- Skills Section -->
            <div class="editor-section" data-section="skills">
                <div class="section-header">
                    <div class="d-flex align-center w-100">
                        <span class="section-title">Skills</span>
                    </div>
                </div>
                <div class="section-content">
                    <div v-for="(skill, index) in props.resumeData.skills" :key="index" class="item-container">
                        <div class="item-header">
                            <span class="item-title">{{ skill.name }}</span>
                            <div class="item-actions">
                                <v-icon icon="ph-pencil-simple" size="small" class="edit-icon"
                                    @click="openSkillModal(index)" />
                                <v-icon icon="ph-delete" size="small" class="delete-icon" @click="removeSkill(index)" />
                            </div>
                        </div>
                        <div class="item-content">
                            <v-chip v-for="keyword in skill.keywords" :key="keyword" size="small" class="mr-2 mb-2">{{
                                keyword }}</v-chip>
                        </div>
                    </div>
                    <div class="d-flex justify-center mt-4">
                        <v-btn color="primary" prepend-icon="ph-plus" @click="openSkillModal()">Add Skill</v-btn>
                    </div>
                </div>
            </div>

            <!-- Projects Section -->
            <div class="editor-section" data-section="projects">
                <div class="section-header">
                    <span class="section-title">Projects</span>
                </div>
                <div class="section-content">
                    <div v-for="(project, index) in props.resumeData.projects" :key="index" class="item-container">
                        <div class="item-header">
                            <span class="item-title">{{ project.name }}</span>
                            <div class="item-actions">
                                <v-icon icon="ph-pencil-simple" size="small" class="edit-icon"
                                    @click="openProjectModal(index)" />
                                <v-icon icon="ph-delete" size="small" class="delete-icon"
                                    @click="removeProject(index)" />
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-center mt-4">
                        <v-btn color="primary" prepend-icon="ph-plus" @click="openProjectModal()">Add Project</v-btn>
                    </div>
                </div>
            </div>

            <!-- Awards Section -->
            <div class="editor-section" data-section="awards">
                <div class="section-header">
                    <span class="section-title">Awards</span>
                </div>
                <div class="section-content">
                    <div v-for="(award, index) in props.resumeData.awards" :key="index" class="item-container">
                        <div class="item-header">
                            <span class="item-title">{{ award.title }}</span>
                            <div class="item-actions">
                                <v-icon icon="ph-pencil-simple" size="small" class="edit-icon"
                                    @click="openAwardModal(index)" />
                                <v-icon icon="ph-delete" size="small" class="delete-icon" @click="removeAward(index)" />
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-center mt-4">
                        <v-btn color="primary" prepend-icon="ph-plus" @click="openAwardModal()">Add Award</v-btn>
                    </div>
                </div>
            </div>

            <!-- Volunteer Section -->
            <div class="editor-section" data-section="volunteer">
                <div class="section-header">
                    <span class="section-title">Volunteer</span>
                </div>
                <div class="section-content">
                    <div v-for="(volunteer, index) in props.resumeData.volunteer" :key="index" class="item-container">
                        <div class="item-header">
                            <span class="item-title">{{ volunteer.organization }}</span>
                            <div class="item-actions">
                                <v-icon icon="ph-pencil-simple" size="small" class="edit-icon"
                                    @click="openVolunteerModal(index)" />
                                <v-icon icon="ph-delete" size="small" class="delete-icon"
                                    @click="removeVolunteer(index)" />
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-center mt-4">
                        <v-btn color="primary" prepend-icon="ph-plus" @click="openVolunteerModal()">Add Volunteer
                        </v-btn>
                    </div>
                </div>
            </div>

            <!-- Publications Section -->
            <div class="editor-section" data-section="publications">
                <div class="section-header">
                    <span class="section-title">Publications</span>
                </div>
                <div class="section-content">
                    <div v-for="(publication, index) in props.resumeData.publications" :key="index"
                        class="item-container">
                        <div class="item-header">
                            <span class="item-title">{{ publication.name }}</span>
                            <div class="item-actions">
                                <v-icon icon="ph-pencil-simple" size="small" class="edit-icon"
                                    @click="openPublicationModal(index)" />
                                <v-icon icon="ph-delete" size="small" class="delete-icon"
                                    @click="removePublication(index)" />
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-center mt-4">
                        <v-btn color="primary" prepend-icon="ph-plus" @click="openPublicationModal()">Add Publication
                        </v-btn>
                    </div>
                </div>
            </div>

            <!-- Languages Section -->
            <div class="editor-section" data-section="languages">
                <div class="section-header">
                    <span class="section-title">Languages</span>
                </div>
                <div class="section-content">
                    <div v-for="(language, index) in props.resumeData.languages" :key="index" class="item-container">
                        <div class="item-header">
                            <span class="item-title">{{ language.language }}</span>
                            <div class="item-actions">
                                <v-icon icon="ph-pencil-simple" size="small" class="edit-icon"
                                    @click="openLanguageModal(index)" />
                                <v-icon icon="ph-delete" size="small" class="delete-icon"
                                    @click="removeLanguage(index)" />
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-center mt-4">
                        <v-btn color="primary" prepend-icon="ph-plus" @click="openLanguageModal()">Add Language</v-btn>
                    </div>
                </div>
            </div>

            <!-- Interests Section -->
            <div class="editor-section" data-section="interests">
                <div class="section-header">
                    <span class="section-title">Interests</span>
                </div>
                <div class="section-content">
                    <div v-for="(interest, index) in props.resumeData.interests" :key="index" class="item-container">
                        <div class="item-header">
                            <span class="item-title">{{ interest.name }}</span>
                            <div class="item-actions">
                                <v-icon icon="ph-pencil-simple" size="small" class="edit-icon"
                                    @click="openInterestModal(index)" />
                                <v-icon icon="ph-delete" size="small" class="delete-icon"
                                    @click="removeInterest(index)" />
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-center mt-4">
                        <v-btn color="primary" prepend-icon="ph-plus" @click="openInterestModal()">Add Interest</v-btn>
                    </div>
                </div>
            </div>

            <!-- References Section -->
            <div class="editor-section" data-section="references">
                <div class="section-header">
                    <span class="section-title">References</span>
                </div>
                <div class="section-content">
                    <div v-for="(reference, index) in props.resumeData.references" :key="index" class="item-container">
                        <div class="item-header">
                            <span class="item-title">{{ reference.name }}</span>
                            <div class="item-actions">
                                <v-icon icon="ph-pencil-simple" size="small" class="edit-icon"
                                    @click="openReferenceModal(index)" />
                                <v-icon icon="ph-delete" size="small" class="delete-icon"
                                    @click="removeReference(index)" />
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-center mt-4">
                        <v-btn color="primary" prepend-icon="ph-plus" @click="openReferenceModal()">Add Reference
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>

        <!-- Work Modal -->
        <v-dialog v-model="workModal.show" max-width="800px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon icon="ph-briefcase" class="mr-2" />
                    {{ workModal.isNew ? 'Add Work' : 'Edit Work' }}
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="workModal.data.position" label="Position" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="workModal.data.name" label="Company" variant="outlined" density="comfortable"
                        class="mb-3" />
                    <v-text-field v-model="workModal.data.startDate" label="Start Date" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="workModal.data.endDate" label="End Date" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <div class="mb-3">
                        <label class="v-label mb-2 d-block">Summary</label>
                        <TiptapEditor v-model="workModal.data.summary" />
                    </div>
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="workModal.show = false" class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveWorkModal" class="modal-btn" prepend-icon="ph-check">
                        {{ workModal.isNew ? 'Add' : 'Save' }}
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
                    <v-text-field v-model="educationModal.data.institution" label="Institution" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="educationModal.data.studyType" label="Study Type" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="educationModal.data.area" label="Area" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="educationModal.data.startDate" label="Start Date" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="educationModal.data.endDate" label="End Date" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="educationModal.data.score" label="Score" variant="outlined"
                        density="comfortable" class="mb-3" />
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="educationModal.show = false"
                        class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveEducationModal" class="modal-btn" prepend-icon="ph-check">
                        {{ educationModal.isNew ? 'Add' : 'Save' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Skills Modal -->
        <v-dialog v-model="skillModal.show" max-width="800px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon icon="ph-lightning" class="mr-2" />
                    {{ skillModal.isNew ? 'Add Skill' : 'Edit Skill' }}
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="skillModal.data.name" label="Skill Name" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-combobox v-model="skillModal.data.keywords" label="Keywords" chips multiple clearable
                        variant="outlined" density="comfortable" />
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="skillModal.show = false" class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveSkillModal" class="modal-btn" prepend-icon="ph-check">
                        {{ skillModal.isNew ? 'Add' : 'Save' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Projects Modal -->
        <v-dialog v-model="projectModal.show" max-width="800px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon icon="ph-code" class="mr-2" />
                    {{ projectModal.isNew ? 'Add Project' : 'Edit Project' }}
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="projectModal.data.name" label="Project Name" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="projectModal.data.description" label="Description" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="projectModal.data.url" label="URL" variant="outlined" density="comfortable"
                        class="mb-3" />
                    <v-combobox v-model="projectModal.data.highlights" label="Highlights" chips multiple clearable
                        variant="outlined" density="comfortable" />
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="projectModal.show = false"
                        class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveProjectModal" class="modal-btn" prepend-icon="ph-check">
                        {{ projectModal.isNew ? 'Add' : 'Save' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Awards Modal -->
        <v-dialog v-model="awardModal.show" max-width="800px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon icon="ph-trophy" class="mr-2" />
                    {{ awardModal.isNew ? 'Add Award' : 'Edit Award' }}
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="awardModal.data.title" label="Award Title" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="awardModal.data.date" label="Date" variant="outlined" density="comfortable"
                        class="mb-3" />
                    <v-text-field v-model="awardModal.data.awarder" label="Awarder" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <TiptapEditor v-model="awardModal.data.summary" />
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="awardModal.show = false" class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveAwardModal" class="modal-btn" prepend-icon="ph-check">
                        {{ awardModal.isNew ? 'Add' : 'Save' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Volunteer Modal -->
        <v-dialog v-model="volunteerModal.show" max-width="800px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon icon="ph-heart" class="mr-2" />
                    {{ volunteerModal.isNew ? 'Add Volunteer' : 'Edit Volunteer' }}
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="volunteerModal.data.organization" label="Organization" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="volunteerModal.data.position" label="Position" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="volunteerModal.data.startDate" label="Start Date" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="volunteerModal.data.endDate" label="End Date" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <TiptapEditor v-model="volunteerModal.data.summary" />
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="volunteerModal.show = false"
                        class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveVolunteerModal" class="modal-btn" prepend-icon="ph-check">
                        {{ volunteerModal.isNew ? 'Add' : 'Save' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Publications Modal -->
        <v-dialog v-model="publicationModal.show" max-width="800px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon icon="ph-book-open" class="mr-2" />
                    {{ publicationModal.isNew ? 'Add Publication' : 'Edit Publication' }}
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="publicationModal.data.name" label="Publication Name" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="publicationModal.data.publisher" label="Publisher" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="publicationModal.data.releaseDate" label="Release Date" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <TiptapEditor v-model="publicationModal.data.summary" />
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="publicationModal.show = false"
                        class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="savePublicationModal" class="modal-btn" prepend-icon="ph-check">
                        {{ publicationModal.isNew ? 'Add' : 'Save' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Languages Modal -->
        <v-dialog v-model="languageModal.show" max-width="500px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon icon="ph-translate" class="mr-2" />
                    {{ languageModal.isNew ? 'Add Language' : 'Edit Language' }}
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="languageModal.data.language" label="Language" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-text-field v-model="languageModal.data.fluency" label="Fluency" variant="outlined"
                        density="comfortable" />
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="languageModal.show = false"
                        class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveLanguageModal" class="modal-btn" prepend-icon="ph-check">
                        {{ languageModal.isNew ? 'Add' : 'Save' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Interests Modal -->
        <v-dialog v-model="interestModal.show" max-width="800px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon icon="ph-star" class="mr-2" />
                    {{ interestModal.isNew ? 'Add Interest' : 'Edit Interest' }}
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="interestModal.data.name" label="Interest Name" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <v-combobox v-model="interestModal.data.keywords" label="Keywords" chips multiple clearable
                        variant="outlined" density="comfortable" />
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="interestModal.show = false"
                        class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveInterestModal" class="modal-btn" prepend-icon="ph-check">
                        {{ interestModal.isNew ? 'Add' : 'Save' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- References Modal -->
        <v-dialog v-model="referenceModal.show" max-width="800px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon icon="ph-users" class="mr-2" />
                    {{ referenceModal.isNew ? 'Add Reference' : 'Edit Reference' }}
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="referenceModal.data.name" label="Reference Name" variant="outlined"
                        density="comfortable" class="mb-3" />
                    <TiptapEditor v-model="referenceModal.data.reference" />
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" @click="referenceModal.show = false"
                        class="modal-btn">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveReferenceModal" class="modal-btn" prepend-icon="ph-check">
                        {{ referenceModal.isNew ? 'Add' : 'Save' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
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

const workModal = ref({
    show: false,
    isNew: false,
    index: -1,
    data: {}
})

const getNewWorkItem = () => ({
    name: '',
    position: '',
    url: '',
    startDate: '',
    endDate: '',
    summary: '',
    highlights: []
})

const openWorkModal = (index = -1) => {
    if (index >= 0) {
        workModal.value = {
            show: true,
            isNew: false,
            index,
            data: JSON.parse(JSON.stringify(props.resumeData.work[index]))
        }
    } else {
        workModal.value = {
            show: true,
            isNew: true,
            index: -1,
            data: getNewWorkItem()
        }
    }
}

const saveWorkModal = () => {
    if (workModal.value.isNew) {
        props.resumeData.work.push(workModal.value.data)
    } else {
        props.resumeData.work[workModal.value.index] = workModal.value.data
    }
    workModal.value.show = false
}

const removeWorkItem = (index) => {
    props.resumeData.work.splice(index, 1)
}

const educationModal = ref({
    show: false,
    isNew: false,
    index: -1,
    data: {}
})

const getNewEducationItem = () => ({
    institution: '',
    area: '',
    studyType: '',
    startDate: '',
    endDate: '',
    score: '',
    courses: []
})

const openEducationModal = (index = -1) => {
    if (index >= 0) {
        educationModal.value = {
            show: true,
            isNew: false,
            index,
            data: JSON.parse(JSON.stringify(props.resumeData.education[index]))
        }
    } else {
        educationModal.value = {
            show: true,
            isNew: true,
            index: -1,
            data: getNewEducationItem()
        }
    }
}

const saveEducationModal = () => {
    if (educationModal.value.isNew) {
        props.resumeData.education.push(educationModal.value.data)
    } else {
        props.resumeData.education[educationModal.value.index] = educationModal.value.data
    }
    educationModal.value.show = false
}

const removeEducationItem = (index) => {
    props.resumeData.education.splice(index, 1)
}

const skillModal = ref({
    show: false,
    isNew: false,
    index: -1,
    data: {}
})

const getNewSkill = () => ({
    name: '',
    level: '',
    keywords: []
})

const openSkillModal = (index = -1) => {
    if (index >= 0) {
        skillModal.value = {
            show: true,
            isNew: false,
            index,
            data: JSON.parse(JSON.stringify(props.resumeData.skills[index]))
        }
    } else {
        skillModal.value = {
            show: true,
            isNew: true,
            index: -1,
            data: getNewSkill()
        }
    }
}

const saveSkillModal = () => {
    if (skillModal.value.isNew) {
        props.resumeData.skills.push(skillModal.value.data)
    } else {
        props.resumeData.skills[skillModal.value.index] = skillModal.value.data
    }
    skillModal.value.show = false
}

const removeSkill = (index) => {
    props.resumeData.skills.splice(index, 1)
}

// Projects
const projectModal = ref({ show: false, isNew: false, index: -1, data: {} })
const getNewProject = () => ({ name: '', description: '', highlights: [], url: '' })
const openProjectModal = (index = -1) => {
    projectModal.value = {
        show: true,
        isNew: index < 0,
        index,
        data: index >= 0 ? JSON.parse(JSON.stringify(props.resumeData.projects[index])) : getNewProject()
    }
}
const saveProjectModal = () => {
    if (projectModal.value.isNew) props.resumeData.projects.push(projectModal.value.data)
    else props.resumeData.projects[projectModal.value.index] = projectModal.value.data
    projectModal.value.show = false
}
const removeProject = (index) => props.resumeData.projects.splice(index, 1)

// Awards
const awardModal = ref({ show: false, isNew: false, index: -1, data: {} })
const getNewAward = () => ({ title: '', date: '', awarder: '', summary: '' })
const openAwardModal = (index = -1) => {
    awardModal.value = {
        show: true,
        isNew: index < 0,
        index,
        data: index >= 0 ? JSON.parse(JSON.stringify(props.resumeData.awards[index])) : getNewAward()
    }
}
const saveAwardModal = () => {
    if (awardModal.value.isNew) props.resumeData.awards.push(awardModal.value.data)
    else props.resumeData.awards[awardModal.value.index] = awardModal.value.data
    awardModal.value.show = false
}
const removeAward = (index) => props.resumeData.awards.splice(index, 1)

// Volunteer
const volunteerModal = ref({ show: false, isNew: false, index: -1, data: {} })
const getNewVolunteer = () => ({ organization: '', position: '', url: '', startDate: '', endDate: '', summary: '', highlights: [] })
const openVolunteerModal = (index = -1) => {
    volunteerModal.value = {
        show: true,
        isNew: index < 0,
        index,
        data: index >= 0 ? JSON.parse(JSON.stringify(props.resumeData.volunteer[index])) : getNewVolunteer()
    }
}
const saveVolunteerModal = () => {
    if (volunteerModal.value.isNew) props.resumeData.volunteer.push(volunteerModal.value.data)
    else props.resumeData.volunteer[volunteerModal.value.index] = volunteerModal.value.data
    volunteerModal.value.show = false
}
const removeVolunteer = (index) => props.resumeData.volunteer.splice(index, 1)

// Publications
const publicationModal = ref({ show: false, isNew: false, index: -1, data: {} })
const getNewPublication = () => ({ name: '', publisher: '', releaseDate: '', url: '', summary: '' })
const openPublicationModal = (index = -1) => {
    publicationModal.value = {
        show: true,
        isNew: index < 0,
        index,
        data: index >= 0 ? JSON.parse(JSON.stringify(props.resumeData.publications[index])) : getNewPublication()
    }
}
const savePublicationModal = () => {
    if (publicationModal.value.isNew) props.resumeData.publications.push(publicationModal.value.data)
    else props.resumeData.publications[publicationModal.value.index] = publicationModal.value.data
    publicationModal.value.show = false
}
const removePublication = (index) => props.resumeData.publications.splice(index, 1)

// Languages
const languageModal = ref({ show: false, isNew: false, index: -1, data: {} })
const getNewLanguage = () => ({ language: '', fluency: '' })
const openLanguageModal = (index = -1) => {
    languageModal.value = {
        show: true,
        isNew: index < 0,
        index,
        data: index >= 0 ? JSON.parse(JSON.stringify(props.resumeData.languages[index])) : getNewLanguage()
    }
}
const saveLanguageModal = () => {
    if (languageModal.value.isNew) props.resumeData.languages.push(languageModal.value.data)
    else props.resumeData.languages[languageModal.value.index] = languageModal.value.data
    languageModal.value.show = false
}
const removeLanguage = (index) => props.resumeData.languages.splice(index, 1)

// Interests
const interestModal = ref({ show: false, isNew: false, index: -1, data: {} })
const getNewInterest = () => ({ name: '', keywords: [] })
const openInterestModal = (index = -1) => {
    interestModal.value = {
        show: true,
        isNew: index < 0,
        index,
        data: index >= 0 ? JSON.parse(JSON.stringify(props.resumeData.interests[index])) : getNewInterest()
    }
}
const saveInterestModal = () => {
    if (interestModal.value.isNew) props.resumeData.interests.push(interestModal.value.data)
    else props.resumeData.interests[interestModal.value.index] = interestModal.value.data
    interestModal.value.show = false
}
const removeInterest = (index) => props.resumeData.interests.splice(index, 1)

// References
const referenceModal = ref({ show: false, isNew: false, index: -1, data: {} })
const getNewReference = () => ({ name: '', reference: '' })
const openReferenceModal = (index = -1) => {
    referenceModal.value = {
        show: true,
        isNew: index < 0,
        index,
        data: index >= 0 ? JSON.parse(JSON.stringify(props.resumeData.references[index])) : getNewReference()
    }
}
const saveReferenceModal = () => {
    if (referenceModal.value.isNew) props.resumeData.references.push(referenceModal.value.data)
    else props.resumeData.references[referenceModal.value.index] = referenceModal.value.data
    referenceModal.value.show = false
}
const removeReference = (index) => props.resumeData.references.splice(index, 1)
</script>

<style scoped src="./ResumeEditorStyles.css"></style>