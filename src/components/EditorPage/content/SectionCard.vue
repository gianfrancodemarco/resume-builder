<template>
    <div class="panel-card section-card" :class="{ 'is-hidden': !section.visible }" :data-section="section.key">
        <div class="card-header">
            <v-icon icon="ph-dots-six-vertical" size="18" class="drag-handle section-handle" aria-hidden="true" />
            <button type="button" class="card-toggle" :aria-expanded="expanded" @click="expanded = !expanded">
                <v-icon :icon="definition.icon" size="18" class="card-icon" />
                <span class="card-title">{{ section.title }}</span>
                <span v-if="isList" class="card-count">{{ items.length }}</span>
                <v-chip v-if="!section.visible" size="x-small" variant="tonal" class="ml-1">Hidden</v-chip>
                <v-chip v-if="withSidebar && section.column === 'sidebar'" size="x-small" variant="tonal"
                    class="ml-1">Sidebar</v-chip>
                <v-spacer />
                <v-icon :icon="expanded ? 'ph-caret-up' : 'ph-caret-down'" size="18" />
            </button>
            <v-menu location="bottom end">
                <template v-slot:activator="{ props: menuProps }">
                    <v-btn v-bind="menuProps" icon="ph-dots-three-vertical" size="small" variant="text"
                        :aria-label="`${section.title} options`" />
                </template>
                <v-list density="compact" min-width="200">
                    <v-list-item prepend-icon="ph-pencil-simple" title="Rename" @click="openRename" />
                    <v-list-item :prepend-icon="section.visible ? 'ph-eye-slash' : 'ph-eye'"
                        :title="section.visible ? 'Hide from resume' : 'Show on resume'"
                        @click="section.visible = !section.visible" />
                    <v-list-item v-if="withSidebar" prepend-icon="ph-arrows-left-right"
                        :title="section.column === 'sidebar' ? 'Move to main column' : 'Move to sidebar'"
                        @click="section.column = section.column === 'sidebar' ? 'main' : 'sidebar'" />
                    <v-divider class="my-1" />
                    <v-list-item prepend-icon="ph-trash" title="Remove section" base-color="error"
                        @click="confirmRemove = true" />
                </v-list>
            </v-menu>
        </div>

        <div v-if="expanded" class="card-body">
            <!-- Summary and contact live in basics -->
            <MarkdownEditor v-if="section.key === 'summary'" v-model="summary" />

            <div v-else-if="section.key === 'contact'" class="form-grid">
                <div class="full">
                    <label class="field-label">Email</label>
                    <v-text-field v-model="basics.email" type="email" variant="outlined" density="compact"
                        hide-details="auto" aria-label="Email" :rules="[emailRule]" />
                </div>
                <div>
                    <label class="field-label">Phone</label>
                    <v-text-field v-model="basics.phone" variant="outlined" density="compact" hide-details
                        aria-label="Phone" />
                </div>
                <div>
                    <label class="field-label">Website</label>
                    <v-text-field v-model="basics.url" variant="outlined" density="compact" hide-details
                        aria-label="Website" @blur="basics.url = normalizeUrl(basics.url)" />
                </div>
                <div>
                    <label class="field-label">City</label>
                    <v-text-field v-model="basics.location.city" variant="outlined" density="compact" hide-details
                        aria-label="City" />
                </div>
                <div>
                    <label class="field-label">Country code</label>
                    <v-text-field v-model="basics.location.countryCode" variant="outlined" density="compact"
                        hide-details placeholder="US" aria-label="Country code" />
                </div>
                <v-btn v-if="!showAddress" class="full justify-start" variant="text" size="small" color="primary"
                    prepend-icon="ph-plus" @click="showAddress = true">Address, region and postal code</v-btn>
                <template v-else>
                    <div class="full">
                        <label class="field-label">Address</label>
                        <v-text-field v-model="basics.location.address" variant="outlined" density="compact"
                            hide-details aria-label="Address" />
                    </div>
                    <div>
                        <label class="field-label">Region</label>
                        <v-text-field v-model="basics.location.region" variant="outlined" density="compact"
                            hide-details aria-label="Region" />
                    </div>
                    <div>
                        <label class="field-label">Postal code</label>
                        <v-text-field v-model="basics.location.postalCode" variant="outlined" density="compact"
                            hide-details aria-label="Postal code" />
                    </div>
                </template>
            </div>

            <template v-else>
                <VueDraggable v-model="items" handle=".item-handle" :animation="150" class="items" @end="onDragEnd">
                    <div v-for="(item, index) in items" :key="itemKeys[index]" class="item"
                        :class="{ open: openIndex === index, 'is-hidden': isItemHidden(resume, section.key, index) }">
                        <div class="item-row">
                            <v-icon icon="ph-dots-six-vertical" size="18" class="drag-handle item-handle"
                                aria-hidden="true" />
                            <button type="button" class="item-text" :aria-expanded="openIndex === index"
                                @click="toggleItem(index)">
                                <span class="item-title">{{ itemTitle(item) }}</span>
                                <span v-if="itemSubtitle(item)" class="item-subtitle">{{ itemSubtitle(item) }}</span>
                            </button>
                            <v-btn :icon="isItemHidden(resume, section.key, index) ? 'ph-eye-slash' : 'ph-eye'"
                                size="small" variant="text"
                                :aria-label="isItemHidden(resume, section.key, index) ? 'Show on resume' : 'Hide from resume'"
                                @click="toggleItemHidden(resume, section.key, index)" />
                        </div>
                        <ItemEditor v-if="openIndex === index" :section-key="section.key" :item="item"
                            @done="closeItem" @delete="deleteItem(index)" />
                    </div>
                </VueDraggable>
                <p v-if="!items.length" class="empty-state">No {{ definition.label.toLowerCase() }} yet.</p>
                <v-btn variant="text" color="primary" size="small" prepend-icon="ph-plus" @click="addItem">
                    Add {{ definition.item.toLowerCase() }}
                </v-btn>
            </template>
        </div>

        <v-dialog v-model="renaming" max-width="420">
            <v-card title="Rename section">
                <v-card-text>
                    <v-text-field v-model="newTitle" label="Title" variant="outlined" autofocus hide-details
                        @keydown.enter="saveRename" />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="renaming = false">Cancel</v-btn>
                    <v-btn color="primary" variant="flat" @click="saveRename">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="confirmRemove" max-width="420">
            <v-card :title="`Remove ${section.title}?`">
                <v-card-text>
                    <template v-if="isList && items.length">
                        This deletes its {{ items.length }} {{ items.length === 1 ? 'entry' : 'entries' }}.
                    </template>
                    <template v-else-if="isList">The section is empty.</template>
                    <template v-else>It will no longer appear on the resume. The data in it is kept.</template>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="confirmRemove = false">Cancel</v-btn>
                    <v-btn color="error" variant="flat" @click="emit('remove')">Remove</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { formatRange } from '@/resume/format'
import { isItemHidden, moveHidden, removeItem, toggleItemHidden } from '@/resume/resume'
import { SECTIONS, isEmptyItem, isListSection, newItem, sectionItems, setSectionItems } from '@/resume/sections'
import { normalizeUrl } from '@/resume/values'
import { computed, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import ItemEditor from './ItemEditor.vue'
import MarkdownEditor from './MarkdownEditor.vue'

const props = defineProps({
    resume: { type: Object, required: true },
    // The section's layout entry from the resume settings (edited in place)
    section: { type: Object, required: true },
    withSidebar: { type: Boolean, default: false },
    initiallyExpanded: { type: Boolean, default: false },
})

const emit = defineEmits(['remove'])

const definition = computed(() => SECTIONS[props.section.key])
const isList = computed(() => isListSection(props.section.key))
const basics = computed(() => props.resume.basics)
const expanded = ref(props.initiallyExpanded)

const summary = computed({
    get: () => basics.value.summary || '',
    set: value => { basics.value.summary = value },
})

const emailRule = v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email'
const location = basics.value.location || {}
const showAddress = ref(Boolean(location.address || location.region || location.postalCode))

// ---- Items ----

const items = computed({
    get: () => (isList.value ? sectionItems(props.resume, props.section.key) : []),
    set: value => setSectionItems(props.resume, props.section.key, value),
})

// Stable keys so open editors and drag animations follow their item
const keyOf = new WeakMap()
let nextKey = 0
const itemKeys = computed(() => items.value.map(item => {
    if (!keyOf.has(item)) keyOf.set(item, nextKey++)
    return keyOf.get(item)
}))

const openIndex = ref(-1)

const itemTitle = item => definition.value.itemTitle(item) || `New ${definition.value.item.toLowerCase()}`
const itemSubtitle = item => formatRange(item.startDate, item.endDate) || item.date || item.releaseDate || item.fluency || ''

// Drops an item that was added and left blank
const discardIfEmpty = index => {
    if (index >= 0 && isEmptyItem(items.value[index])) removeItem(props.resume, props.section.key, index)
}

const openItem = index => {
    // Imported items may lack fields; the form needs all of them
    const item = items.value[index]
    for (const [field, empty] of Object.entries(newItem(props.section.key))) item[field] ??= empty
    openIndex.value = index
}

const closeItem = () => {
    const index = openIndex.value
    openIndex.value = -1
    discardIfEmpty(index)
}

const toggleItem = index => {
    if (openIndex.value === index) return closeItem()
    const previous = openIndex.value
    openItem(index)
    if (previous >= 0 && isEmptyItem(items.value[previous])) {
        removeItem(props.resume, props.section.key, previous)
        if (previous < index) openIndex.value = index - 1
    }
}

const addItem = () => {
    closeItem()
    items.value.push(newItem(props.section.key))
    openIndex.value = items.value.length - 1
}

const deleteItem = index => {
    openIndex.value = -1
    removeItem(props.resume, props.section.key, index)
}

const onDragEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) return
    moveHidden(props.resume, props.section.key, oldIndex, newIndex)
    if (openIndex.value === oldIndex) openIndex.value = newIndex
}

// ---- Section menu ----

const renaming = ref(false)
const newTitle = ref('')
const confirmRemove = ref(false)

const openRename = () => {
    newTitle.value = props.section.title
    renaming.value = true
}

const saveRename = () => {
    props.section.title = newTitle.value.trim() || definition.value.defaultTitle
    renaming.value = false
}
</script>

<style scoped>
.section-card.is-hidden .card-title,
.section-card.is-hidden .card-icon {
    opacity: 0.5;
}

.card-count {
    margin-left: 8px;
    font-size: 0.8rem;
    opacity: 0.6;
}

.items {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 4px;
}

.item {
    border: 1px solid rgb(var(--v-theme-editor-border));
    border-radius: 8px;
    background: rgb(var(--v-theme-editor-item-bg));
}

.item.open {
    border-color: rgba(var(--v-theme-primary), 0.6);
}

.item-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 4px 4px 6px;
}

.item-text {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    padding: 4px 0;
    text-align: left;
    color: inherit;
    border-radius: 6px;
}

.item-text:focus-visible {
    outline: 2px solid rgb(var(--v-theme-primary));
}

.item-title {
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.item-subtitle {
    font-size: 0.8rem;
    opacity: 0.6;
}

.item.is-hidden .item-text {
    opacity: 0.45;
    text-decoration: line-through;
}

.empty-state {
    margin: 4px 0 8px;
    font-size: 0.875rem;
    opacity: 0.6;
}
</style>
