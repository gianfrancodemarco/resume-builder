<template>
    <div ref="pane" class="preview-pane">
        <div class="preview-scroll">
            <div class="preview-pages" :style="{ zoom: scale }">
                <ResumePreview :resume="resume" loading-label="Preparing your resume…" @rendered="pages = $event.pages" />
            </div>
        </div>

        <div class="preview-toolbar" role="toolbar" aria-label="Preview">
            <v-btn icon="ph-minus" size="small" variant="text" aria-label="Zoom out" :disabled="scale <= MIN_ZOOM"
                @click="zoomBy(-ZOOM_STEP)" />
            <span class="zoom-value">{{ Math.round(scale * 100) }}%</span>
            <v-btn icon="ph-plus" size="small" variant="text" aria-label="Zoom in" :disabled="scale >= MAX_ZOOM"
                @click="zoomBy(ZOOM_STEP)" />
            <v-divider vertical class="mx-1" />
            <v-btn size="small" variant="text" :color="fit ? 'primary' : undefined" prepend-icon="ph-arrows-horizontal"
                @click="fit = true">Fit</v-btn>
            <v-divider vertical class="mx-1" />
            <span class="page-count">{{ pages }} {{ pages === 1 ? 'page' : 'pages' }}</span>
        </div>
    </div>
</template>

<script setup>
import { useLocalStorage, useResizeObserver } from '@vueuse/core'
import { computed, ref } from 'vue'
import ResumePreview from './ResumePreview.vue'

defineProps({
    resume: {
        type: Object,
        required: true
    }
})

const PAGE_WIDTH = 794 // A4 at 96 dpi, in CSS px
const GUTTER = 48
const MIN_ZOOM = 0.25
const MAX_ZOOM = 2
const ZOOM_STEP = 0.1

const pane = ref(null)
const paneWidth = ref(PAGE_WIDTH + GUTTER)
const fit = useLocalStorage('resume-preview-fit', true)
const storedZoom = useLocalStorage('resume-preview-zoom', 1)
const manualZoom = computed({
    get: () => Number.isFinite(storedZoom.value)
        ? Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, storedZoom.value))
        : 1,
    set: value => { storedZoom.value = value }
})
const pages = ref(0)

useResizeObserver(pane, ([entry]) => {
    paneWidth.value = entry.contentRect.width
})

const fitZoom = computed(() => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, (paneWidth.value - GUTTER) / PAGE_WIDTH)))
const scale = computed(() => (fit.value ? fitZoom.value : manualZoom.value))

const zoomBy = step => {
    manualZoom.value = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round((scale.value + step) * 10) / 10))
    fit.value = false
}
</script>

<style scoped>
.preview-pane {
    position: relative;
    height: 100%;
    min-width: 0;
    background: rgb(var(--v-theme-editor-preview-bg));
}

.preview-scroll {
    height: 100%;
    overflow: auto;
    padding: 24px 24px 88px;
}

.preview-pages {
    width: fit-content;
    margin: 0 auto;
}

.preview-toolbar {
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgb(var(--v-theme-editor-border));
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
    white-space: nowrap;
}

.zoom-value {
    min-width: 44px;
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-size: 0.85rem;
}

.page-count {
    padding: 0 6px;
    font-size: 0.85rem;
    opacity: 0.75;
}
</style>
