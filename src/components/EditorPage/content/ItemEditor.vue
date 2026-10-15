<template>
    <div class="item-editor">
        <template v-for="field in SECTIONS[sectionKey].fields" :key="field.key">
            <DateField v-if="field.type === 'date'" v-model="item[field.key]" :label="field.label"
                :end="field.key === 'endDate'" class="half" />
            <div v-else-if="field.type === 'markdown'" class="full">
                <label class="field-label">{{ field.label }}</label>
                <MarkdownEditor v-model="item[field.key]" />
            </div>
            <ListField v-else-if="field.type === 'list'" v-model="item[field.key]" :label="field.label"
                :markdown="field.markdown" class="full" />
            <div v-else :class="WIDE_FIELDS.has(field.key) ? 'full' : 'half'">
                <label class="field-label" :for="`${id}-${field.key}`">{{ field.label }}</label>
                <v-text-field :id="`${id}-${field.key}`" v-model="item[field.key]" variant="outlined"
                    density="compact" :placeholder="field.placeholder" :rules="RULES[field.type] || []"
                    :type="field.type === 'email' ? 'email' : 'text'" hide-details="auto"
                    @blur="field.type === 'url' && (item[field.key] = normalizeUrl(item[field.key]))" />
            </div>
        </template>

        <div class="actions full">
            <v-btn variant="text" color="error" size="small" prepend-icon="ph-trash" @click="emit('delete')">
                Delete {{ SECTIONS[sectionKey].item.toLowerCase() }}
            </v-btn>
            <v-spacer />
            <v-btn variant="tonal" color="primary" size="small" @click="emit('done')">Done</v-btn>
        </div>
    </div>
</template>

<script setup>
// Form for one item of a JSON Resume section, generated from the section's
// fields. It edits the item in place, so the preview updates while typing.
import { useId } from 'vue'
import { SECTIONS } from '@/resume/sections'
import { normalizeUrl } from '@/resume/values'
import DateField from './DateField.vue'
import ListField from './ListField.vue'
import MarkdownEditor from './MarkdownEditor.vue'

defineProps({
    sectionKey: { type: String, required: true },
    item: { type: Object, required: true },
})

const emit = defineEmits(['done', 'delete'])

const id = useId()

// Fields given a full row; others share it two by two
const WIDE_FIELDS = new Set(['description', 'url', 'reference'])

const RULES = {
    url: [v => !v || URL.canParse(normalizeUrl(v)) || 'Enter a valid URL'],
    email: [v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email'],
}
</script>

<style scoped>
.item-editor {
    container-type: inline-size;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 12px 12px 8px;
}

.full {
    grid-column: 1 / -1;
}

@container (max-width: 420px) {
    .half {
        grid-column: 1 / -1;
    }
}

.actions {
    display: flex;
    align-items: center;
}
</style>
