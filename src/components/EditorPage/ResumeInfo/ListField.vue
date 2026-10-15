<template>
    <div class="list-field">
        <label class="v-label mb-2 d-block">{{ label }}</label>
        <div v-for="(_, index) in model" :key="index" class="list-field-row">
            <v-text-field v-model="model[index]" variant="outlined" density="compact" hide-details
                :placeholder="markdown ? 'Markdown allowed, e.g. **bold**' : ''" :aria-label="`${label} ${index + 1}`"
                @keydown.enter.prevent="add(index + 1)" />
            <v-btn icon="ph-arrow-up" size="x-small" variant="text" :disabled="index === 0"
                :aria-label="`Move ${label} ${index + 1} up`" @click="move(index, -1)" />
            <v-btn icon="ph-arrow-down" size="x-small" variant="text" :disabled="index === model.length - 1"
                :aria-label="`Move ${label} ${index + 1} down`" @click="move(index, 1)" />
            <v-btn icon="ph-delete" size="x-small" variant="text" :aria-label="`Remove ${label} ${index + 1}`"
                @click="model.splice(index, 1)" />
        </div>
        <v-btn size="small" variant="tonal" prepend-icon="ph-plus" @click="add(model.length)">Add</v-btn>
    </div>
</template>

<script setup>
// Editor for a JSON Resume array of strings (highlights, keywords, courses…)
const model = defineModel({ type: Array, required: true })

defineProps({
    label: { type: String, required: true },
    markdown: { type: Boolean, default: false },
})

const add = index => model.value.splice(index, 0, '')

const move = (index, offset) => {
    const items = model.value
    ;[items[index], items[index + offset]] = [items[index + offset], items[index]]
}
</script>

<style scoped>
.list-field-row {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
}
</style>
