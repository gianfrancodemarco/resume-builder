<template>
    <div>
        <div class="editor-sections">
            <PersonalInfo :resume="resume" />

            <div v-for="(section, index) in settings.sections" :key="section.key" class="editor-section"
                :data-section="section.key">
                <div class="section-header">
                    <div class="d-flex align-center w-100">
                        <span class="section-title">
                            <v-icon :icon="SECTIONS[section.key].icon" size="small" class="mr-2" />
                            {{ section.title }}
                        </span>
                        <SectionHeaderActions class="ml-auto" :visible="section.visible" :column="section.column"
                            :show-column="withSidebar" :can-move-up="index > 0"
                            :can-move-down="index < settings.sections.length - 1"
                            :delete-confirm="confirmingDelete === `section-${section.key}`"
                            @edit="openTitleDialog(section)" @toggle-visible="section.visible = !section.visible"
                            @toggle-column="section.column = section.column === 'sidebar' ? 'main' : 'sidebar'"
                            @move-up="moveSection(resume, section.key, 'up')"
                            @move-down="moveSection(resume, section.key, 'down')"
                            @delete="confirmDelete(`section-${section.key}`, () => removeSection(resume, section.key))" />
                    </div>
                </div>

                <div class="section-content">
                    <p v-if="!isListSection(section.key)" class="section-note">
                        Edited in Personal Information above.
                    </p>
                    <template v-else>
                        <div v-for="(item, itemIndex) in itemsOf(resume, section.key)" :key="itemIndex"
                            class="section-item">
                            <SectionListItem :title="itemTitle(section.key, item)"
                                :visible="!isItemHidden(resume, section.key, itemIndex)"
                                :can-move-up="itemIndex > 0"
                                :can-move-down="itemIndex < itemsOf(resume, section.key).length - 1"
                                :delete-confirm="confirmingDelete === `item-${section.key}-${itemIndex}`"
                                :disabled="!section.visible"
                                @toggle-visibility="toggleItemHidden(resume, section.key, itemIndex)"
                                @edit="openItemDialog(section.key, itemIndex)"
                                @move-up="moveItem(resume, section.key, itemIndex, 'up')"
                                @move-down="moveItem(resume, section.key, itemIndex, 'down')"
                                @delete="confirmDelete(`item-${section.key}-${itemIndex}`, () => removeItem(resume, section.key, itemIndex))" />
                        </div>
                        <div class="d-flex justify-center">
                            <v-btn color="primary" prepend-icon="ph-plus" :disabled="!section.visible"
                                :aria-label="`Add ${SECTIONS[section.key].item}`"
                                @click="openItemDialog(section.key)">
                                Add {{ SECTIONS[section.key].item }}
                            </v-btn>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <div class="d-flex flex-column align-center">
            <v-menu v-if="available.length">
                <template v-slot:activator="{ props: menuProps }">
                    <v-btn v-bind="menuProps" color="primary" prepend-icon="ph-plus" class="mt-4 action-btn"
                        aria-label="Add section">Add Section</v-btn>
                </template>
                <v-list density="compact">
                    <v-list-item v-for="key in available" :key="key" :prepend-icon="SECTIONS[key].icon"
                        :title="SECTIONS[key].label" @click="addSection(resume, key)" />
                </v-list>
            </v-menu>
        </div>

        <ItemDialog :section-key="itemDialog.key" :item="itemDialog.item" :is-new="itemDialog.index < 0"
            @save="saveItem" @cancel="itemDialog.item = null" />

        <v-dialog v-model="titleDialog.show" max-width="500px" persistent>
            <v-card class="modal-card">
                <v-card-title class="modal-title">
                    <v-icon icon="ph-text-t" class="mr-2" />
                    Rename Section
                </v-card-title>
                <v-card-text class="modal-content">
                    <v-text-field v-model="titleDialog.title" label="Section Title" variant="outlined"
                        density="comfortable" prepend-inner-icon="ph-text-t" />
                </v-card-text>
                <v-card-actions class="modal-actions">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="outlined" class="modal-btn"
                        @click="titleDialog.show = false">Cancel</v-btn>
                    <v-btn color="primary" class="modal-btn" prepend-icon="ph-check" @click="saveTitle">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import {
    addSection, availableSections, isItemHidden, moveItem, moveSection, removeItem, removeSection,
    settingsOf, toggleItemHidden,
} from '@/resume/resume'
import { SECTIONS, isListSection, itemsOf, newItem, sectionItems } from '@/resume/sections'
import { hasSidebar } from '@/resume/templates'
import { cloneJson } from '@/resume/values'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ItemDialog from './ItemDialog.vue'
import PersonalInfo from './Personalnfo.vue'
import SectionHeaderActions from './SectionHeaderActions.vue'
import SectionListItem from './SectionListItem.vue'

const props = defineProps({
    resume: {
        type: Object,
        required: true
    },
    isMobile: {
        type: Boolean,
        required: true
    }
})

const settings = computed(() => settingsOf(props.resume))
const withSidebar = computed(() => hasSidebar(settings.value.template))
const available = computed(() => availableSections(props.resume))

const itemTitle = (key, item) => SECTIONS[key].itemTitle(item) || `(untitled ${SECTIONS[key].item.toLowerCase()})`

// Deleting needs a second click on the same button
const confirmingDelete = ref(null)
const confirmDelete = (id, action) => {
    if (confirmingDelete.value !== id) {
        confirmingDelete.value = id
        return
    }
    confirmingDelete.value = null
    action()
}
const cancelConfirm = () => { confirmingDelete.value = null }
onMounted(() => document.addEventListener('click', cancelConfirm))
onUnmounted(() => document.removeEventListener('click', cancelConfirm))

// Item dialog: edits a copy, written back on save
const itemDialog = ref({ key: 'work', index: -1, item: null })

const openItemDialog = (key, index = -1) => {
    const existing = index >= 0 ? cloneJson(sectionItems(props.resume, key)[index]) : {}
    itemDialog.value = { key, index, item: { ...newItem(key), ...existing } }
}

const saveItem = item => {
    const { key, index } = itemDialog.value
    const items = sectionItems(props.resume, key)
    if (index < 0) items.push(item)
    else items[index] = item
    itemDialog.value.item = null
}

// Section title dialog
const titleDialog = ref({ show: false, section: null, title: '' })

const openTitleDialog = section => {
    titleDialog.value = { show: true, section, title: section.title }
}

const saveTitle = () => {
    titleDialog.value.section.title = titleDialog.value.title.trim() || SECTIONS[titleDialog.value.section.key].defaultTitle
    titleDialog.value.show = false
}
</script>

<style scoped>
.section-note {
    font-size: 0.875rem;
    opacity: 0.7;
    margin: 0;
}
</style>
