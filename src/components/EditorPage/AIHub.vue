<template>
    <div class="editor-sections">
        <div class="editor-section">
            <div class="section-header">
                <span class="section-title">API Settings</span>
            </div>
            <div class="section-content">
                <v-text-field v-model="apiKey" label="OpenRouter API Key" :rules="[v => !!v || 'API Key is required']"
                    required />

                <v-autocomplete v-model="selectedModel" :items="models" label="Select Model"
                    :rules="[v => !!v || 'Model selection is required']" required item-title="name" item-value="id" />
            </div>
        </div>
        <div class="editor-section">
            <v-tabs v-model="activeTab">
                <v-tab value="convert-cv">Convert CV</v-tab>
            </v-tabs>
            <v-window v-model="activeTab">
                <v-window-item value="convert-cv">
                    <div class="section-content">
                        <ConvertCV @update:resumeData="handleUpdateResumeData" :api-key="apiKey"
                            :model="selectedModel" />
                    </div>
                </v-window-item>
            </v-window>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import ConvertCV from './ConvertCV.vue'
import { CVConversionService } from '@/services/CVConversionService'

const emit = defineEmits(['update:resumeData'])
const activeTab = ref('convert-cv')
const apiKey = ref('')
const selectedModel = ref(null)
const models = ref([])

const loadAvailableModels = async () => {
    try {
        models.value = await CVConversionService.fetchAvailableModels()
    } catch (error) {
        console.error('Error fetching models:', error)
        models.value = []
    }
}

onMounted(async () => {
    await loadAvailableModels()
})

watch(models, (newVal) => {
    if (!selectedModel.value && newVal && newVal.length > 0) {
        const defaultModel = newVal.find(model => model.id === 'google/gemini-2.0-flash-001')
        selectedModel.value = defaultModel ? defaultModel.id : newVal[0].id
    }
}, { immediate: true })


const handleUpdateResumeData = (newResumeData) => {
    emit('update:resumeData', newResumeData)
}
</script>

<style scoped>
.editor-sections {
    background: transparent;
}

:deep(.v-tabs) {
    border-bottom: 1px solid rgb(var(--v-theme-editor-section-border));
}
</style>