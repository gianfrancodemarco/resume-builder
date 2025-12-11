<template>
    <div class="convert-cv-container">
        <p class="section-description">
            Convert your old CV into Resume Builder format.<br />
            Note that this may take a while, depending on the model you choose.
        </p>
        <v-form ref="form" v-model="formValid">
            <v-file-input v-model="file" label="Upload CV (PDF)" accept=".pdf" :rules="[v => !!v || 'File is required']"
                required :disabled="loading" @change="handleFileChange" />
        </v-form>

        <v-btn block color="white" prepend-icon="mdi-file-document-edit" class="my-4 bg-primary action-btn"
            :loading="loading" :disabled="!formValid || loading || !apiKey || !model"
            @click="() => handleConvert({ file: file, apiKey: apiKey, model: model })">
            {{ loading ? 'Converting...' : 'Convert' }}
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

const emit = defineEmits(['update:resumeData', 'conversion-started', 'conversion-finished', 'conversion-error'])

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

const handleConvert = async ({ file, apiKey, model }) => {
    if (window.sa_event) {
        window.sa_event('convert_cv')
    }
    loading.value = true
    emit('conversion-started')
    try {
        const newResumeData = await CVConversionService.convertCV(file, apiKey, model)
        emit('update:resumeData', newResumeData)
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

.action-btn {
    margin-top: 16px;
}

.alert-message {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
}
</style>