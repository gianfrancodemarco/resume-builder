<template>
    <div class="panel-stack">
        <PersonalCard :resume="resume" />

        <VueDraggable v-model="sections" handle=".section-handle" :animation="150" class="panel-stack">
            <SectionCard v-for="section in sections" :key="section.key" :resume="resume" :section="section"
                :with-sidebar="withSidebar" :initially-expanded="section.key === justAdded"
                @remove="removeSection(resume, section.key)" />
        </VueDraggable>

        <v-menu v-if="available.length" location="top">
            <template v-slot:activator="{ props: menuProps }">
                <v-btn v-bind="menuProps" variant="tonal" color="primary" prepend-icon="ph-plus" block
                    class="add-section">Add section</v-btn>
            </template>
            <v-list density="compact">
                <v-list-item v-for="key in available" :key="key" :prepend-icon="SECTIONS[key].icon"
                    :title="SECTIONS[key].label" @click="add(key)" />
            </v-list>
        </v-menu>
    </div>
</template>

<script setup>
import { addSection, availableSections, removeSection, settingsOf } from '@/resume/resume'
import { hasSidebar } from '@/resume/design'
import { SECTIONS } from '@/resume/sections'
import { computed, nextTick, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import PersonalCard from './PersonalCard.vue'
import SectionCard from './SectionCard.vue'

const props = defineProps({
    resume: { type: Object, required: true }
})

const settings = computed(() => settingsOf(props.resume))
const withSidebar = computed(() => hasSidebar(settings.value.design.layout))
const available = computed(() => availableSections(props.resume))

const sections = computed({
    get: () => settings.value.sections,
    set: value => { settings.value.sections = value },
})

const justAdded = ref(null)

const add = async key => {
    justAdded.value = key
    addSection(props.resume, key)
    await nextTick()
    document.querySelector(`.section-card[data-section="${key}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
