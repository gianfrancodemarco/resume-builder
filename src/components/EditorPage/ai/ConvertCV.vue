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

        <v-btn block color="primary" variant="flat" prepend-icon="ph-sparkle" class="mt-2" :loading="loading"
            :disabled="!formValid || loading" @click="convert">
            Convert
        </v-btn>

        <v-overlay :model-value="loading" class="align-center justify-center">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <v-alert v-model="alertMessage.show" :type="alertMessage.type" :title="alertMessage.title"
            :text="alertMessage.message" closable @click:close="hideAlert" class="alert-message" timeout="3000" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { CVConversionService } from '@/services/CVConversionService'

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

const form = ref(null)
const formValid = ref(false)
const file = ref(null)
const loading = ref(false)

const alertMessage = ref({
    show: false,
    title: '',
    message: '',
    type: 'success'
})

const showAlert = (title, message, type = 'success') => {
    alertMessage.value = {
        show: true,
        title,
        message,
        type
    }
    setTimeout(() => {
        hideAlert()
    }, 3000)
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

const handleConvert = async ({ file, apiKey, model }) => {
    if (window.sa_event) {
        window.sa_event('convert_cv')
    }
    loading.value = true
    emit('conversion-started')
    try {
        emit('update:resume-info', await CVConversionService.convertCV(file, apiKey, model))
        showAlert('CV successfully converted!', 'Your CV has been successfully converted.', 'success')
    } catch (error) {
        showAlert('Error converting CV', error.message, 'error')
        emit('conversion-error', error)
    } finally {
        loading.value = false
        emit('conversion-finished')
    }
}
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
</style>