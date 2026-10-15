<template>
    <div class="list-field">
        <label class="field-label">{{ label }}</label>
        <VueDraggable v-model="model" handle=".row-handle" :animation="150" class="rows">
            <div v-for="(_, index) in model" :key="index" class="row">
                <v-icon icon="ph-dots-six-vertical" size="18" class="row-handle" aria-hidden="true" />
                <v-text-field v-model="model[index]" variant="outlined" density="compact" hide-details
                    :placeholder="markdown ? 'Markdown allowed, e.g. **bold**' : ''"
                    :aria-label="`${label} ${index + 1}`" @keydown.enter.prevent="add(index + 1)" />
                <v-btn icon="ph-x" size="x-small" variant="text" :aria-label="`Remove ${label} ${index + 1}`"
                    @click="model.splice(index, 1)" />
            </div>
        </VueDraggable>
        <v-btn size="small" variant="text" color="primary" prepend-icon="ph-plus" @click="add(model.length)">
            Add
        </v-btn>
    </div>
</template>

<script setup>
// Editor for a JSON Resume array of strings (highlights, keywords, courses…)
import { nextTick } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

const model = defineModel({ type: Array, required: true })

const props = defineProps({
    label: { type: String, required: true },
    markdown: { type: Boolean, default: false },
})

const add = async index => {
    model.value.splice(index, 0, '')
    await nextTick()
    document.querySelector(`[aria-label="${CSS.escape(`${props.label} ${index + 1}`)}"]`)?.focus()
}
</script>

<style scoped>
.rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 4px;
}

.row {
    display: flex;
    align-items: center;
    gap: 4px;
}

.row-handle {
    cursor: grab;
    opacity: 0.5;
}
</style>
