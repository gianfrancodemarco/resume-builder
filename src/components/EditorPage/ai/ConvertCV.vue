<template>
    <div class="convert-cv-container">
        <p class="section-description">
            Upload your current CV as a PDF and the AI fills in the editor. This replaces the current content
            and can take a minute.
        </p>
        <v-form ref="form" v-model="formValid">
            <v-file-input v-model="file" label="CV (PDF)" accept=".pdf" :rules="[v => !!v || 'File is required']"
                required :disabled="loading" variant="outlined" density="compact" prepend-icon=""
                prepend-inner-icon="ph-file-pdf" @change="handleFileChange" />
        </v-form>

        <v-btn block color="primary" variant="flat" prepend-icon="ph-sparkle" class="mt-2"
            :disabled="!formValid || loading" @click="convert">
            Convert
        </v-btn>

        <!-- Conversion in progress -->
        <v-dialog :model-value="loading" persistent max-width="420">
            <v-card class="progress-card">
                <div class="scan" aria-hidden="true">
                    <div class="page">
                        <span v-for="n in 7" :key="n" class="line" :style="{ width: `${LINE_WIDTHS[n - 1]}%` }" />
                    </div>
                    <div class="beam" />
                </div>

                <h3 class="progress-title">Converting your CV</h3>
                <p class="progress-file">{{ fileName }}</p>

                <ol class="steps">
                    <li v-for="(step, index) in STEPS" :key="step.label"
                        :class="{ done: index < stepIndex, active: index === stepIndex }">
                        <v-icon v-if="index < stepIndex" icon="ph-check" size="16" class="step-icon" />
                        <v-progress-circular v-else-if="index === stepIndex" indeterminate size="14" width="2"
                            class="step-icon" />
                        <span v-else class="step-icon step-dot" />
                        {{ step.label }}
                    </li>
                </ol>

                <p class="progress-hint">
                    {{ elapsedLabel }} · The AI reads the whole document, so this usually takes 20 to 60 seconds.
                </p>

                <v-card-actions class="justify-center">
                    <v-btn variant="text" @click="cancel">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-alert v-model="alertMessage.show" :type="alertMessage.type" :title="alertMessage.title"
            :text="alertMessage.message" closable @click:close="hideAlert" class="alert-message" />
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { CVConversionService } from '@/services/CVConversionService'
import { trackEvent } from '@/analytics'

const props = defineProps({
    apiKey: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['update:resume-info', 'need-settings', 'conversion-started', 'conversion-finished', 'conversion-error'])

// The request reports no progress: these advance on typical timings and the
// last one stays active until the answer arrives
const STEPS = [
    { label: 'Uploading your CV', after: 0 },
    { label: 'Reading the document', after: 3 },
    { label: 'Extracting experience, education and skills', after: 10 },
    { label: 'Building your resume', after: 25 },
]
const LINE_WIDTHS = [55, 90, 80, 95, 70, 85, 60]

const form = ref(null)
const formValid = ref(false)
const file = ref(null)
const loading = ref(false)
const elapsed = ref(0)
let timer = null
let controller = null

const fileName = computed(() => file.value?.name || (Array.isArray(file.value) ? file.value[0]?.name : '') || '')
const stepIndex = computed(() => STEPS.findLastIndex(step => elapsed.value >= step.after))
const elapsedLabel = computed(() => `${Math.floor(elapsed.value / 60)}:${String(elapsed.value % 60).padStart(2, '0')}`)

const alertMessage = ref({
    show: false,
    title: '',
    message: '',
    type: 'success'
})

let alertTimer = null
const showAlert = (title, message, type = 'success') => {
    alertMessage.value = { show: true, title, message, type }
    clearTimeout(alertTimer)
    alertTimer = setTimeout(hideAlert, 4000)
}

const hideAlert = () => {
    alertMessage.value.show = false
}

const handleFileChange = (event) => {
    const newFile = event.target.files[0]
    if (newFile) {
        try {
            CVConversionService.validateFile(newFile)
        } catch (error) {
            showAlert('Invalid File', error.message, 'error')
            file.value = null
        }
    }
}

const convert = () => {
    if (!props.apiKey || !props.model) {
        emit('need-settings')
        return
    }
    handleConvert({ file: file.value, apiKey: props.apiKey, model: props.model })
}

const startProgress = () => {
    elapsed.value = 0
    timer = setInterval(() => { elapsed.value++ }, 1000)
}

const stopProgress = () => {
    clearInterval(timer)
    controller = null
    loading.value = false
}

const cancel = () => {
    controller?.abort()
}

const handleConvert = async ({ file, apiKey, model }) => {
    trackEvent('convert_cv')
    controller = new AbortController()
    loading.value = true
    startProgress()
    emit('conversion-started')
    try {
        const content = await CVConversionService.convertCV(file, apiKey, model, { signal: controller.signal })
        emit('update:resume-info', content)
        showAlert('CV converted', 'Your CV is now in the editor. Check it over before downloading.', 'success')
    } catch (error) {
        if (error.name !== 'AbortError') {
            showAlert('Error converting CV', error.message, 'error')
            emit('conversion-error', error)
        }
    } finally {
        stopProgress()
        emit('conversion-finished')
    }
}

onBeforeUnmount(() => {
    controller?.abort()
    clearInterval(timer)
    clearTimeout(alertTimer)
})
</script>

<style scoped>
.section-description {
    font-size: 0.9rem;
    color: rgba(var(--v-theme-on-surface), 0.7);
    margin-bottom: 16px;
}

.alert-message {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
}

.progress-card {
    padding: 28px 24px 12px;
    text-align: center;
}

/* A page with a light beam scanning it */
.scan {
    position: relative;
    width: 72px;
    height: 92px;
    margin: 0 auto 18px;
}

.page {
    display: flex;
    flex-direction: column;
    gap: 7px;
    height: 100%;
    padding: 14px 10px;
    border-radius: 6px;
    background: rgb(var(--v-theme-editor-field-bg));
    border: 1px solid rgb(var(--v-theme-editor-border));
}

.line {
    height: 4px;
    border-radius: 2px;
    background: rgba(var(--v-theme-on-surface), 0.18);
}

.line:first-child {
    height: 6px;
    background: rgba(var(--v-theme-primary), 0.7);
}

.beam {
    position: absolute;
    left: -6px;
    right: -6px;
    height: 3px;
    border-radius: 3px;
    background: rgb(var(--v-theme-primary));
    box-shadow: 0 0 12px 3px rgba(var(--v-theme-primary), 0.45);
    animation: scan 1.8s ease-in-out infinite alternate;
}

@keyframes scan {
    from { top: 6px; }
    to { top: calc(100% - 9px); }
}

@media (prefers-reduced-motion: reduce) {
    .beam { animation: none; top: 50%; }
}

.progress-title {
    font-size: 1.1rem;
    font-weight: 600;
}

.progress-file {
    margin: 2px 0 16px;
    font-size: 0.85rem;
    color: rgb(var(--v-theme-editor-text-muted));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.steps {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    display: inline-flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
    font-size: 0.9rem;
}

.steps li {
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgb(var(--v-theme-editor-text-muted));
}

.steps li.active {
    color: rgb(var(--v-theme-on-surface));
    font-weight: 500;
}

.steps li.done {
    color: rgb(var(--v-theme-editor-text-secondary));
}

.step-icon {
    flex: none;
    width: 16px;
    color: rgb(var(--v-theme-primary));
}

.step-dot {
    height: 6px;
    width: 6px;
    margin: 0 5px;
    border-radius: 50%;
    background: rgb(var(--v-theme-editor-border));
}

.progress-hint {
    margin: 18px 0 4px;
    font-size: 0.8rem;
    color: rgb(var(--v-theme-editor-text-muted));
}
</style>
