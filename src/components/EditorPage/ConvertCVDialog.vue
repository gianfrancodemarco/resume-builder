<template>
    <v-dialog v-model="localDialog" click-outside="close" max-width="600px">
        <v-card>
            <v-card-title>
                Convert CV
            </v-card-title>
            <v-card-subtitle>
                Convert your old CV into Resume Builder format.
            </v-card-subtitle>

            <v-card-text>
                <v-form ref="form" v-model="formValid">
                    <v-text-field v-model="apiKey" label="OpenRouter API Key"
                        :rules="[v => !!v || 'API Key is required']" required :disabled="loading" />

                    <v-autocomplete v-model="selectedModel" :items="models" label="Select Model"
                        :rules="[v => !!v || 'Model selection is required']" required :disabled="loading"
                        item-title="title" item-value="value">
                    </v-autocomplete>

                    <v-file-input v-model="file" label="Upload CV (PDF/Image/Text)" accept=".pdf,.png,.jpg,.jpeg,.txt"
                        :rules="[v => !!v || 'File is required']" required :disabled="loading"
                        @change="handleFileChange"></v-file-input>
                </v-form>
            </v-card-text>

            <v-card-actions class="menu-actions">
                <div>
                    <v-btn block color="red" prepend-icon="mdi-close" class="bg-error action-btn" :disabled="loading"
                        @click="close">
                        Cancel
                    </v-btn>
                    <v-btn block color="white" prepend-icon="mdi-file-document-edit" class="my-4 bg-primary action-btn"
                        :loading="loading" :disabled="!formValid || loading"
                        @click="() => handleConvert({ file: file, apiKey: apiKey, model: selectedModel })">
                        {{ loading ? 'Converting...' : 'Convert' }}
                    </v-btn>
                </div>
            </v-card-actions>

            <v-overlay :model-value="loading" class="align-center justify-center">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { CVConversionService } from '@/services/CVConversionService'

const emit = defineEmits(['close'])

const props = defineProps({
    models: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    dialog: {
        type: Boolean,
        required: true,
        default: false
    },
    handleConvert: {
        type: Function,
        required: true
    }
})

const localDialog = computed({
    get: () => props.dialog,
    set: (value) => {
        if (!value) {
            emit('close')
        }
    }
})

const form = ref(null)
const formValid = ref(false)
const apiKey = ref('')
const selectedModel = ref(null)
const file = ref(null)

watch(() => props.models, (newVal) => {
    if (!selectedModel.value && newVal && newVal.length > 0) {
        const defaultModel = newVal.find(model => model.value === 'openai/gpt-4.1')
        selectedModel.value = defaultModel.value || newVal[0].value
    }
}, { immediate: true })

const close = () => {
    emit('close')
    form.value?.reset()
    apiKey.value = ''
    selectedModel.value = null
    file.value = null
}

const handleFileChange = (newFile) => {
    if (newFile) {
        try {
            CVConversionService.validateFile(newFile)
        } catch (error) {
            alert(error.message)
            file.value = null
        }
    }
}

</script>