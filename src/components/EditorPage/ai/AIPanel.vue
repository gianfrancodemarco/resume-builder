<template>
    <div class="panel-stack">
        <section class="panel-card">
            <div class="card-header">
                <v-icon icon="ph-sparkle" size="18" class="card-icon" />
                <span class="card-title">AI assistant</span>
                <v-spacer />
                <v-btn size="small" variant="text" prepend-icon="ph-gear" @click="settingsOpen = true">
                    Settings
                </v-btn>
            </div>
            <div class="card-body">
                <v-alert v-if="!configured" type="info" variant="tonal" density="compact" class="mb-3">
                    AI features use your own <a href="https://openrouter.ai/keys" target="_blank"
                        rel="noopener">OpenRouter API key</a>. It stays in this browser tab.
                    <div class="mt-2">
                        <v-btn size="small" variant="flat" color="primary" @click="settingsOpen = true">
                            Add key
                        </v-btn>
                    </div>
                </v-alert>
                <AIGeneration :resume-info="content" :generation-api-key="apiKey" :generation-model="model || ''"
                    :openai-api-key="openaiApiKey" :transcription-language="transcriptionLanguage"
                    @update:resume-info="applyContent" @need-settings="settingsOpen = true" />
            </div>
        </section>

        <section class="panel-card">
            <div class="card-header">
                <v-icon icon="ph-file-arrow-up" size="18" class="card-icon" />
                <span class="card-title">Import an existing CV</span>
            </div>
            <div class="card-body">
                <ConvertCV :api-key="apiKey" :model="model || ''" @update:resume-info="applyContent"
                    @need-settings="settingsOpen = true" />
            </div>
        </section>

        <v-dialog v-model="settingsOpen" max-width="480">
            <v-card title="AI settings">
                <v-card-text class="settings">
                    <div>
                        <label class="field-label" for="openrouter-key">OpenRouter API key</label>
                        <v-text-field id="openrouter-key" v-model="apiKey" :type="showKeys ? 'text' : 'password'"
                            variant="outlined" density="compact" hide-details autocomplete="off"
                            :append-inner-icon="showKeys ? 'ph-eye-slash' : 'ph-eye'"
                            @click:append-inner="showKeys = !showKeys" />
                    </div>
                    <div>
                        <label class="field-label" for="ai-model">Model</label>
                        <v-autocomplete id="ai-model" v-model="model" :items="models" item-title="name" item-value="id"
                            variant="outlined" density="compact" hide-details :loading="!models.length" />
                    </div>
                    <div class="voice">
                        <span class="voice-title">Voice input (optional)</span>
                        <label class="field-label" for="openai-key">OpenAI API key, for transcription</label>
                        <v-text-field id="openai-key" v-model="openaiApiKey" :type="showKeys ? 'text' : 'password'"
                            variant="outlined" density="compact" hide-details autocomplete="off" />
                        <label class="field-label mt-3" for="voice-language">Spoken language</label>
                        <v-select id="voice-language" v-model="transcriptionLanguage" :items="LANGUAGES"
                            item-title="name" item-value="code" variant="outlined" density="compact" hide-details />
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" variant="flat" @click="settingsOpen = false">Done</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { resumeContent, withContent } from '@/resume/resume'
import { CVConversionService } from '@/services/CVConversionService'
import { computed, onMounted, ref } from 'vue'
import AIGeneration from './AIGeneration.vue'
import ConvertCV from './ConvertCV.vue'

const props = defineProps({
    resume: { type: Object, required: true }
})

const emit = defineEmits(['update:resume'])

const DEFAULT_MODEL = 'google/gemini-2.5-flash'

const LANGUAGES = [
    { name: 'Auto detect', code: null },
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
]

const settingsOpen = ref(false)
const showKeys = ref(false)
const apiKey = ref('')
const model = ref(null)
const models = ref([])
const openaiApiKey = ref('')
const transcriptionLanguage = ref(null)

const configured = computed(() => Boolean(apiKey.value && model.value))

// The AI tools see and return only the JSON Resume content; design, layout
// and photo are kept from the current resume
const content = computed(() => resumeContent(props.resume))
const applyContent = newContent => emit('update:resume', withContent(props.resume, newContent))

onMounted(async () => {
    try {
        models.value = await CVConversionService.fetchAvailableModels()
    } catch (error) {
        console.error('Error fetching models:', error)
    }
    model.value ??= models.value.find(m => m.id === DEFAULT_MODEL)?.id ?? models.value[0]?.id ?? null
})
</script>

<style scoped>
.settings {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.voice {
    padding-top: 14px;
    border-top: 1px solid rgb(var(--v-theme-editor-border));
}

.voice-title {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
}
</style>
