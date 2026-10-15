<template>
    <v-dialog :model-value="Boolean(item)" max-width="800px" persistent>
        <v-card v-if="item" class="modal-card">
            <v-card-title class="modal-title">
                <v-icon :icon="section.icon" class="mr-2" />
                {{ isNew ? 'Add' : 'Edit' }} {{ section.item }}
            </v-card-title>
            <v-card-text class="modal-content">
                <v-form ref="form" @submit.prevent="save">
                    <template v-for="field in section.fields" :key="field.key">
                        <div v-if="field.type === 'markdown'" class="mb-4">
                            <label class="v-label mb-2 d-block">{{ field.label }}</label>
                            <MarkdownEditor v-model="item[field.key]" />
                        </div>
                        <ListField v-else-if="field.type === 'list'" v-model="item[field.key]" :label="field.label"
                            :markdown="field.markdown" class="mb-4" />
                        <v-text-field v-else v-model="item[field.key]" :label="field.label"
                            :placeholder="field.placeholder || (field.type === 'date' ? 'YYYY-MM' : '')"
                            :hint="field.hint || (field.type === 'date' ? 'YYYY, YYYY-MM or YYYY-MM-DD' : '')"
                            :type="field.type === 'email' ? 'email' : 'text'" :rules="rules(field)"
                            variant="outlined" density="comfortable" class="mb-2"
                            @blur="field.type === 'url' && (item[field.key] = normalizeUrl(item[field.key]))" />
                    </template>
                </v-form>
            </v-card-text>
            <v-card-actions class="modal-actions">
                <v-spacer></v-spacer>
                <v-btn color="grey-darken-1" variant="outlined" class="modal-btn" @click="emit('cancel')">
                    Cancel
                </v-btn>
                <v-btn color="primary" class="modal-btn" prepend-icon="ph-check" @click="save">
                    {{ isNew ? 'Add' : 'Save' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
// Form for one item of a JSON Resume section, generated from the section's fields
import { DATE_PATTERN } from '@/resume/format'
import { SECTIONS } from '@/resume/sections'
import { normalizeUrl } from '@/resume/values'
import { computed, ref } from 'vue'
import ListField from './ListField.vue'
import MarkdownEditor from './MarkdownEditor.vue'

const props = defineProps({
    sectionKey: { type: String, required: true },
    // The item being edited (a copy); null closes the dialog
    item: { type: Object, default: null },
    isNew: { type: Boolean, default: false },
})

const emit = defineEmits(['save', 'cancel'])

const form = ref(null)
const section = computed(() => SECTIONS[props.sectionKey])

const RULES = {
    date: v => !v || DATE_PATTERN.test(v) || 'Use YYYY, YYYY-MM or YYYY-MM-DD',
    url: v => !v || URL.canParse(normalizeUrl(v)) || 'Enter a valid URL',
    email: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email',
}

const rules = field => (RULES[field.type] ? [RULES[field.type]] : [])

const save = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return
    const item = { ...props.item }
    for (const field of section.value.fields) {
        if (field.type === 'list') item[field.key] = item[field.key].map(v => v.trim()).filter(Boolean)
        else if (field.type === 'url') item[field.key] = normalizeUrl(item[field.key])
    }
    emit('save', item)
}
</script>
