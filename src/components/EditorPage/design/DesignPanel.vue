<template>
    <div class="panel-stack design-panel">
        <section class="panel-card">
            <div class="card-body">
                <h3 class="group-title">Layout</h3>
                <div class="layouts">
                    <button v-for="(layout, key) in LAYOUTS" :key="key" type="button" class="layout-option"
                        :class="{ selected: design.layout === key }" :aria-pressed="design.layout === key"
                        @click="design.layout = key">
                        <div class="layout-thumb">
                            <ResumePreview :resume="withDesign(resume, { layout: key })" :max-pages="1"
                                :debounce="400" page-width="100%" />
                        </div>
                        <span class="layout-name">{{ layout.name }}</span>
                    </button>
                </div>

                <h3 class="group-title">Accent color</h3>
                <div class="swatches">
                    <button v-for="accent in ACCENTS" :key="accent.value" type="button" class="swatch"
                        :class="{ selected: sameColor(design.accent, accent.value) }"
                        :style="{ background: accent.value }" :title="accent.name" :aria-label="accent.name"
                        @click="design.accent = accent.value">
                        <v-icon v-if="sameColor(design.accent, accent.value)" icon="ph-check" size="16" />
                    </button>
                    <v-menu :close-on-content-click="false" location="bottom">
                        <template v-slot:activator="{ props: menuProps }">
                            <button v-bind="menuProps" type="button" class="swatch custom"
                                :class="{ selected: isCustomAccent }"
                                :style="isCustomAccent ? { background: design.accent } : {}" title="Custom color"
                                aria-label="Custom color">
                                <v-icon :icon="isCustomAccent ? 'ph-check' : 'ph-plus'" size="16" />
                            </button>
                        </template>
                        <v-color-picker v-model="design.accent" mode="hex" :modes="['hex']" elevation="8" />
                    </v-menu>
                </div>

                <h3 class="group-title">Fonts</h3>
                <div class="pairings">
                    <button v-for="(pairing, key) in FONT_PAIRINGS" :key="key" type="button" class="pairing"
                        :class="{ selected: design.fonts === key }" :aria-pressed="design.fonts === key"
                        @click="design.fonts = key">
                        <span class="pairing-name" :style="{ fontFamily: `'${pairing.heading}'` }">{{ pairing.name }}</span>
                        <span class="pairing-sample" :style="{ fontFamily: `'${pairing.body}'` }">
                            {{ pairing.heading === pairing.body ? pairing.body : `${pairing.heading} + ${pairing.body}` }}
                        </span>
                    </button>
                </div>

                <div class="toggles">
                    <div>
                        <h3 class="group-title">Text size</h3>
                        <v-btn-toggle v-model="design.size" mandatory divided density="comfortable" variant="outlined"
                            color="primary">
                            <v-btn v-for="(size, key) in SIZES" :key="key" :value="key">{{ size.name }}</v-btn>
                        </v-btn-toggle>
                    </div>
                    <div>
                        <h3 class="group-title">Density</h3>
                        <v-btn-toggle v-model="design.density" mandatory divided density="comfortable"
                            variant="outlined" color="primary">
                            <v-btn v-for="(density, key) in DENSITIES" :key="key" :value="key">{{ density.name }}</v-btn>
                        </v-btn-toggle>
                    </div>
                    <div v-if="hasSidebar(design.layout)">
                        <h3 class="group-title">Sidebar</h3>
                        <v-btn-toggle v-model="design.sidebarLeft" mandatory divided density="comfortable"
                            variant="outlined" color="primary">
                            <v-btn :value="true">Left</v-btn>
                            <v-btn :value="false">Right</v-btn>
                        </v-btn-toggle>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ACCENTS, DENSITIES, FONT_PAIRINGS, LAYOUTS, SIZES, hasSidebar } from '@/resume/design'
import { settingsOf, withDesign } from '@/resume/resume'
import { computed } from 'vue'
import ResumePreview from '../ResumePreview.vue'

const props = defineProps({
    resume: { type: Object, required: true }
})

const design = computed(() => settingsOf(props.resume).design)

const sameColor = (a, b) => a?.toLowerCase() === b.toLowerCase()
const isCustomAccent = computed(() => !ACCENTS.some(a => sameColor(design.value.accent, a.value)))
</script>

<style scoped>
.group-title {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.7;
    margin: 18px 0 8px;
}

.group-title:first-child {
    margin-top: 0;
}

.layouts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.layout-option,
.pairing {
    border: 1.5px solid rgb(var(--v-theme-editor-border));
    border-radius: 10px;
    background: transparent;
    color: inherit;
    text-align: left;
    transition: border-color 0.15s, background 0.15s;
}

.layout-option:hover,
.pairing:hover {
    border-color: rgba(var(--v-theme-primary), 0.6);
}

.layout-option.selected,
.pairing.selected {
    border-color: rgb(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), 0.08);
}

.layout-option {
    padding: 8px;
}

.layout-thumb {
    aspect-ratio: 210 / 297;
    overflow: hidden;
    border-radius: 4px;
    background: white;
}

.layout-thumb :deep(.resume-page) {
    box-shadow: none;
}

.layout-name {
    display: block;
    margin-top: 6px;
    font-weight: 500;
    text-align: center;
}

.swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.swatch {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    color: white;
    border: 2px solid transparent;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15) inset;
}

.swatch.selected {
    outline: 2px solid rgb(var(--v-theme-primary));
    outline-offset: 2px;
}

.swatch.custom:not(.selected) {
    border: 1.5px dashed rgb(var(--v-theme-editor-border));
    color: rgb(var(--v-theme-editor-text-muted));
    box-shadow: none;
}

.pairings {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
}

.pairing {
    display: flex;
    flex-direction: column;
    padding: 8px 12px;
}

.pairing-name {
    font-size: 1.05rem;
    font-weight: 700;
}

.pairing-sample {
    font-size: 0.78rem;
    opacity: 0.7;
}

.toggles {
    display: flex;
    flex-wrap: wrap;
    column-gap: 20px;
    margin-top: 18px;
}
</style>
