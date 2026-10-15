<template>
    <div class="resume-pages" :class="{ updating }">
        <div v-for="(page, i) in visiblePages" :key="i" class="resume-page"
            :style="{ aspectRatio: `${page.width} / ${page.height}` }">
            <!-- One SVG holds every page stacked; each sheet shows its own slice -->
            <img :src="svgUrl" alt="" draggable="false" :style="{
                width: `${docWidth / page.width * 100}%`,
                height: `${docHeight / page.height * 100}%`,
                top: `-${page.top / page.height * 100}%`
            }" />
        </div>

        <div v-if="!pages.length && !error" class="resume-page resume-page-placeholder">
            <v-progress-circular indeterminate color="primary" />
        </div>

        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="preview-error">
            {{ error }}
        </v-alert>
    </div>
</template>

<script setup>
import { TypstService } from '@/typst/TypstService'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
    resumeData: {
        type: Object,
        required: true
    },
    resumeStyle: {
        type: Object,
        required: true
    },
    // Limits how many pages are shown, e.g. 1 for template thumbnails
    maxPages: {
        type: Number,
        default: Infinity
    },
    debounce: {
        type: Number,
        default: 150
    }
})

const svgUrl = ref('')
const pages = ref([])
const error = ref('')
const updating = ref(false)

const docSize = ref({ width: 0, height: 0 })
const docWidth = computed(() => docSize.value.width)
const docHeight = computed(() => docSize.value.height)
const visiblePages = computed(() => pages.value.slice(0, props.maxPages))

let timer = null
let latestRequest = 0

const render = async () => {
    const request = ++latestRequest
    updating.value = true
    try {
        const { svg, size, pages: info } = await TypstService.renderSvg(props.resumeData, props.resumeStyle)
        if (request !== latestRequest) return // a newer edit superseded this render

        let top = 0
        pages.value = info.map(p => {
            const page = { ...p, top }
            top += p.height
            return page
        })
        docSize.value = size
        if (svgUrl.value) URL.revokeObjectURL(svgUrl.value)
        svgUrl.value = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
        error.value = ''
    } catch (e) {
        if (request !== latestRequest) return
        console.error('Error rendering resume:', e)
        // Keep showing the last good render
        error.value = e.message || 'Failed to render the resume.'
    } finally {
        if (request === latestRequest) updating.value = false
    }
}

watch(
    () => [props.resumeData, props.resumeStyle],
    () => {
        clearTimeout(timer)
        timer = setTimeout(render, props.debounce)
    },
    { deep: true }
)

render()

onBeforeUnmount(() => {
    clearTimeout(timer)
    latestRequest++
    if (svgUrl.value) URL.revokeObjectURL(svgUrl.value)
})
</script>

<style scoped>
.resume-pages {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
}

.resume-page {
    position: relative;
    width: 210mm;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.resume-page img {
    position: absolute;
    left: 0;
    display: block;
    max-width: none;
    user-select: none;
}

.resume-page-placeholder {
    aspect-ratio: 210 / 297;
    display: flex;
    align-items: center;
    justify-content: center;
}

.updating .resume-page img {
    transition: opacity 0.2s ease 0.3s;
    opacity: 0.85;
}

.preview-error {
    width: 210mm;
    max-width: 100%;
}
</style>
