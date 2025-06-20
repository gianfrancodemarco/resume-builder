<template>
    <div class="style-editor">
        <!-- Colors Section -->
        <div class="editor-section" data-section="colors">
            <div class="section-header">
                <div class="d-flex align-center w-100">
                    <span class="section-title">
                        <v-icon icon="ph-palette" class="mr-2" /> Colors
                    </span>
                </div>
            </div>
            <div class="section-content">
                <div class="d-flex flex-column gap-4">
                    <div v-for="(color, key) in colorFields" :key="key" class="color-field">
                        <div class="d-flex align-center justify-space-between mb-2">
                            <span class="text-subtitle-2">{{ color.label }}</span>
                            <div class="d-flex align-center">
                                <span class="color-hex mr-2">{{ styleData.colors[key].toUpperCase() }}</span>
                                <v-menu location="bottom end" :close-on-content-click="false">
                                    <template v-slot:activator="{ props }">
                                        <div class="color-preview" v-bind="props"
                                            :style="{ backgroundColor: styleData.colors[key] }">
                                            <v-icon icon="ph-pencil-simple" size="small" class="edit-icon"></v-icon>
                                        </div>
                                    </template>
                                    <v-card class="color-picker-card">
                                        <v-color-picker v-model="styleData.colors[key]" mode="hex"
                                            hide-inputs></v-color-picker>
                                        <v-divider></v-divider>
                                        <div class="pa-2">
                                            <v-text-field v-model="styleData.colors[key]" class="color-input"
                                                density="compact" hide-details variant="outlined"
                                                @input="validateHex(key)" placeholder="#000000"></v-text-field>
                                        </div>
                                    </v-card>
                                </v-menu>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Typography Section -->
        <div class="editor-section" data-section="typography">
            <div class="section-header">
                <div class="d-flex align-center w-100">
                    <span class="section-title">
                        <v-icon icon="ph-text-t" class="mr-2" /> Typography
                    </span>
                </div>
            </div>
            <div class="section-content">
                <div class="d-flex flex-column gap-4">
                    <div>
                        <div class="text-subtitle-2 mb-2">Heading Font</div>
                        <v-select v-model="styleData.typography.headingFont" :items="fontOptions" variant="outlined"
                            density="comfortable" :item-text="item => item" :item-value="item => item">
                            <template v-slot:selection="{ item }">
                                <span :style="{ fontFamily: item.value }">{{ item.value }}</span>
                            </template>
                            <template v-slot:item="{ props: itemProps, item }">
                                <v-list-item v-bind="itemProps" :style="{ fontFamily: item.value }" />
                            </template>
                        </v-select>
                    </div>
                    <div>
                        <div class="text-subtitle-2 mb-2">Default Body Font</div>
                        <v-select v-model="styleData.typography.bodyFont" :items="fontOptions" variant="outlined"
                            density="comfortable" :item-text="item => item" :item-value="item => item">
                            <template v-slot:selection="{ item }">
                                <span :style="{ fontFamily: item.value }">{{ item.value }}</span>
                            </template>
                            <template v-slot:item="{ props: itemProps, item }">
                                <v-list-item v-bind="itemProps" :style="{ fontFamily: item.value }" />
                            </template>
                        </v-select>
                    </div>
                    <div>
                        <div class="text-subtitle-2 mb-2">Font Sizes</div>
                        <v-slider v-model="styleData.typography.baseSize" label="Base Size" min="12" max="20" step="1"
                            thumb-label class="style-slider"></v-slider>
                        <v-slider v-model="styleData.typography.headingSize" label="Heading Size" min="16" max="32"
                            step="1" thumb-label class="style-slider"></v-slider>
                    </div>
                </div>
            </div>
        </div>

        <!-- Spacing Section -->
        <div class="editor-section" data-section="spacing">
            <div class="section-header">
                <div class="d-flex align-center w-100">
                    <span class="section-title">
                        <v-icon icon="ph-arrows-out-line-vertical" class="mr-2" /> Spacing
                    </span>
                </div>
            </div>
            <div class="section-content">
                <div class="d-flex flex-column gap-4">
                    <div>
                        <div class="text-subtitle-2 mb-2">Section Spacing</div>
                        <v-slider v-model="styleData.spacing.section" label="Section Gap" min="12" max="48" step="4"
                            thumb-label class="style-slider"></v-slider>
                    </div>
                    <div>
                        <div class="text-subtitle-2 mb-2">Content Spacing</div>
                        <v-slider v-model="styleData.spacing.content" label="Content Gap" min="0" max="24" step="2"
                            thumb-label class="style-slider"></v-slider>
                    </div>
                    <div>
                        <div class="text-subtitle-2 mb-2">Sidebar Width</div>
                        <v-slider v-model="styleData.spacing.sidebarWidth" label="Width" min="200" max="400" step="10"
                            thumb-label class="style-slider"></v-slider>
                    </div>
                    <div>
                        <v-switch v-model="styleData.spacing.sidebarLeft" label="Sidebar on Left" hide-details
                            density="compact" color="primary"></v-switch>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ResumeStyle2ColumnsV1 } from '@/models/ResumeStyle/ResumeStyle2ColumnsV1'

const props = defineProps({
    styleData: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:style-data', 'change'])

const fontOptions = ResumeStyle2ColumnsV1.FONT_OPTIONS

const colorFields = {
    primary: { label: 'Primary Color' },
    text: { label: 'Text Color' },
    background: { label: 'Background Color' },
    sidebar: { label: 'Sidebar Color' },
    link: { label: 'Link Color' }
}

const validateHex = (key) => {
    const value = props.styleData.colors[key]
    // Remove any non-hex characters
    let cleanValue = value.replace(/[^0-9A-Fa-f]/g, '')

    // Ensure it starts with #
    if (!cleanValue.startsWith('#')) {
        cleanValue = '#' + cleanValue
    }

    // Ensure it's 6 characters after the #
    if (cleanValue.length > 7) {
        cleanValue = cleanValue.slice(0, 7)
    }

    // Update the value
    props.styleData.colors[key] = cleanValue
    emit('change')
}
</script>

<style scoped src="./ResumeEditorStyles.css"></style>

<style scoped>
.color-field {
    border-radius: 12px;
    padding: 12px 16px;
}

.color-preview {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    border: 2px solid rgba(0, 0, 0, 0.08);
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
}

.color-preview:hover {
    transform: scale(1.05);
    border-color: rgba(0, 0, 0, 0.16);
}

.color-picker-card {
    max-width: 300px;
}

.color-input {
    font-family: monospace;
}

.style-slider {
    margin-bottom: 16px;
}
</style>