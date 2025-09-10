<template>
    <div class="editor-sections">
        <div class="editor-section">
            <div class="section-header">
                <span class="section-title">API Settings</span>
            </div>
            <div class="section-content">
                <div class="subsection">
                    <span class="subsection-title">AI Generation</span>
                    <v-text-field v-model="generationApiKey" label="OpenRouter API Key"
                        :rules="[v => !!v || 'API Key is required']" required
                        :type="generationApiKeyVisible ? 'text' : 'password'"
                        :append-inner-icon="generationApiKeyVisible ? 'ph-eye-slash' : 'ph-eye'"
                        @click:append-inner="toggleApiKeyVisibility('generation')" />
                    <v-autocomplete v-model="generationModel" :items="models" label="Select Model"
                        :rules="[v => !!v || 'Model selection is required']" required item-title="name"
                        item-value="id" />
                </div>
                <div class="subsection">
                    <span class="subsection-title">AI Transcription</span>
                    <v-text-field v-model="openaiApiKey" label="OpenAI API Key"
                        :rules="[v => !!v || 'API Key is required']" required
                        :type="openaiApiKeyVisible ? 'text' : 'password'"
                        :append-inner-icon="openaiApiKeyVisible ? 'ph-eye-slash' : 'ph-eye'"
                        @click:append-inner="toggleApiKeyVisibility('openai')" />
                    <v-autocomplete v-model="transcriptionLanguage" :items="languages" label="Select Language"
                        item-title="name" item-value="code">
                        <template v-slot:selection="{ item }">
                            <div class="d-flex align-center">
                                <img v-if="getFlagUrl(item.raw.code)" :src="getFlagUrl(item.raw.code)" class="flag-icon"
                                    alt="" />
                                <span class="lang-name">{{ item.raw.name }}</span>
                            </div>
                        </template>
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props" title>
                                <template v-slot:prepend>
                                    <img v-if="getFlagUrl(item.raw.code)" :src="getFlagUrl(item.raw.code)"
                                        class="flag-icon" alt="" />
                                    <div v-else class="flag-placeholder"></div>
                                </template>
                                <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                            </v-list-item>
                        </template>
                    </v-autocomplete>
                </div>
            </div>
        </div>
        <div class="editor-section">
            <v-tabs v-model="activeTab">
                <v-tab value="ai-generation">AI Generation</v-tab>
                <v-tab value="convert-cv">Convert CV</v-tab>
            </v-tabs>
            <v-window v-model="activeTab">
                <v-window-item value="ai-generation">
                    <div class="section-content">
                        <AIGeneration :resume-info="props.resumeData" @update:resume-info="handleUpdateResumeData"
                            :generation-api-key="generationApiKey" :generation-model="generationModel"
                            :openai-api-key="openaiApiKey" :transcription-language="transcriptionLanguage" />
                    </div>
                </v-window-item>
                <v-window-item value="convert-cv">
                    <div class="section-content">
                        <ConvertCV @update:resumeData="handleUpdateResumeData" :api-key="generationApiKey"
                            :model="generationModel" />
                    </div>
                </v-window-item>
            </v-window>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import ConvertCV from './ConvertCV.vue'
import AIGeneration from './AIGeneration.vue'
import { CVConversionService } from '@/services/CVConversionService'

const props = defineProps({
    resumeData: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:resumeData'])
const activeTab = ref('ai-generation')
const generationApiKey = ref('')
const openaiApiKey = ref('')
const generationModel = ref(null)
const models = ref([])
const generationApiKeyVisible = ref(false)
const openaiApiKeyVisible = ref(false)
const transcriptionLanguage = ref(null)
const languages = ref([
    { name: 'Auto Detect', code: null },
    { name: 'English', code: 'en' },
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' },
    { name: 'Italian', code: 'it' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Dutch', code: 'nl' },
    { name: 'Russian', code: 'ru' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Korean', code: 'ko' },
    { name: 'Chinese', code: 'zh' },
])

let generationApiTimer = null
let openaiApiTimer = null

const getFlagUrl = (langCode) => {
    if (!langCode) {
        return null
    }
    const langToCountry = {
        en: 'GB',
        es: 'ES',
        fr: 'FR',
        de: 'DE',
        it: 'IT',
        pt: 'PT',
        nl: 'NL',
        ru: 'RU',
        ja: 'JP',
        ko: 'KR',
        zh: 'CN',
    }
    const countryCode = langToCountry[langCode]
    return countryCode ? `https://flagsapi.com/${countryCode}/flat/24.png` : null
}

const toggleApiKeyVisibility = (keyType) => {
    if (keyType === 'generation') {
        generationApiKeyVisible.value = !generationApiKeyVisible.value
        if (generationApiKeyVisible.value) {
            clearTimeout(generationApiTimer)
            generationApiTimer = setTimeout(() => {
                generationApiKeyVisible.value = false
            }, 2000)
        }
    } else if (keyType === 'openai') {
        openaiApiKeyVisible.value = !openaiApiKeyVisible.value
        if (openaiApiKeyVisible.value) {
            clearTimeout(openaiApiTimer)
            openaiApiTimer = setTimeout(() => {
                openaiApiKeyVisible.value = false
            }, 2000)
        }
    }
}

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

    const browserLang = navigator.language.split('-')[0]
    const foundLang = languages.value.find(l => l.code === browserLang)
    if (foundLang) {
        transcriptionLanguage.value = foundLang.code
    }
})

watch(models, (newVal) => {
    if (!generationModel.value && newVal && newVal.length > 0) {
        const defaultModel = newVal.find(model => model.id === 'google/gemini-2.5-flash')
        generationModel.value = defaultModel ? defaultModel.id : newVal[0].id
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

.subsection {
    margin-bottom: 1rem;
}

.subsection-title {
    font-weight: 500;
    margin-bottom: 0.5rem;
    display: block;
}

.flag-icon {
    width: 24px;
    height: 18px;
    margin-right: 12px;
}

.lang-name {
    line-height: 1;
}

.flag-placeholder {
    width: 24px;
    height: 18px;
    margin-right: 12px;
}
</style>