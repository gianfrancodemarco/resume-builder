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
                        <div class="slider-container">
                            <div class="text-subtitle-2">Base Size</div>
                            <v-slider v-model="styleData.typography.baseSize" min="12" max="20" step="1"
                                thumb-label></v-slider>
                        </div>
                        <div class="slider-container">
                            <div class="text-subtitle-2">Heading Size</div>
                            <v-slider v-model="styleData.typography.headingSize" min="16" max="32" step="1"
                                thumb-label></v-slider>
                        </div>
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
                    <div class="slider-container">
                        <div class="text-subtitle-2">Section Spacing</div>
                        <v-slider v-model="styleData.spacing.section" min="12" max="48" step="4" thumb-label></v-slider>
                    </div>
                    <div class="slider-container">
                        <div class="text-subtitle-2">Content Spacing</div>
                        <v-slider v-model="styleData.spacing.content" min="0" max="24" step="2" thumb-label></v-slider>
                    </div>
                    <div class="slider-container">
                        <div class="text-subtitle-2">Sidebar Width</div>
                        <v-slider v-model="styleData.spacing.sidebarWidth" min="0" max="400" step="10"
                            thumb-label></v-slider>
                    </div>
                    <div>
                        <v-switch v-model="styleData.spacing.sidebarLeft" :disabled="!isSidebarPresent"
                            label="Sidebar on Left" hide-details density="compact" color="primary"></v-switch>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ResumeStyleV1 } from '@/models/ResumeStyle/ResumeStyleV1'
import { computed } from 'vue'

const props = defineProps({
    styleData: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:style-data', 'change'])

const fontOptions = ResumeStyleV1.FONT_OPTIONS

const colorFields = {
    primary: { label: 'Primary Color' },
    text: { label: 'Text Color' },
    background: { label: 'Background Color' },
    sidebarBackground: { label: 'Sidebar Background Color' },
    sidebarText: { label: 'Sidebar Text Color' },
    datesTextColor: { label: 'Dates Text Color' },
    subtitleTextColor: { label: 'Subtitle Text Color' },
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

const isSidebarPresent = computed(() => {
    return props.styleData.spacing.sidebarWidth > 0
})
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

.color-preview .edit-icon {
    color: rgba(0, 0, 0, 0.6);
    opacity: 0.7;
}

.color-preview:hover .edit-icon {
    opacity: 1;
}

.color-hex {
    color: rgb(var(--v-theme-editor-text-secondary));
    font-family: monospace;
    font-size: 0.9rem;
}

.color-picker-card {
    max-width: 300px;
    background-color: rgb(var(--v-theme-surface)) !important;
    border: 1px solid rgb(var(--v-theme-editor-border)) !important;
}

.color-input {
    font-family: monospace;
}

/* Override Vuetify slider defaults completely */
:deep(.v-slider) {
    margin-bottom: 16px;
    min-height: 40px;
}

:deep(.v-slider .v-slider-track) {
    height: 4px !important;
    border-radius: 2px !important;
}

:deep(.v-slider .v-slider-track__fill) {
    background-color: rgb(var(--v-theme-primary)) !important;
    border-radius: 2px !important;
    opacity: 1 !important;
    visibility: visible !important;
}

:deep(.v-slider .v-slider-track__background) {
    background-color: rgb(var(--v-theme-editor-border)) !important;
    border-radius: 2px !important;
    opacity: 1 !important;
    visibility: visible !important;
}

/* Force small thumb size */
:deep(.v-slider .v-slider-thumb) {
    background-color: rgb(var(--v-theme-primary)) !important;
    border: 2px solid rgb(var(--v-theme-surface)) !important;
    width: 12px !important;
    height: 12px !important;
    min-width: 12px !important;
    min-height: 12px !important;
    max-width: 12px !important;
    max-height: 12px !important;
    transform: translate(-50%, -50%) !important;
}

:deep(.v-slider .v-slider-thumb::before) {
    width: 12px !important;
    height: 12px !important;
    min-width: 12px !important;
    min-height: 12px !important;
    max-width: 12px !important;
    max-height: 12px !important;
}

:deep(.v-slider .v-slider-thumb__label) {
    background-color: rgb(var(--v-theme-primary)) !important;
    color: white !important;
    font-weight: 600 !important;
}

:deep(.v-slider .v-label) {
    color: rgb(var(--v-theme-editor-text-primary)) !important;
    font-weight: 500 !important;
}

/* Additional overrides for Vuetify's default styling */
:deep(.v-slider .v-slider-track__background::before) {
    background-color: rgb(var(--v-theme-editor-border)) !important;
    opacity: 1 !important;
}

:deep(.v-slider .v-slider-track__fill::before) {
    background-color: rgb(var(--v-theme-primary)) !important;
    opacity: 1 !important;
}

/* Style the text labels */
.text-subtitle-2 {
    color: rgb(var(--v-theme-editor-text-primary)) !important;
    font-weight: 500;
    width: 50%;
    display: inline-block;
}

/* Create 50/50 layout for slider containers */
.slider-container {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
}

.slider-container .text-subtitle-2 {
    width: 50%;
    margin-bottom: 0;
}

.slider-container .v-slider {
    width: 50%;
    margin-bottom: 0;
}

/* Style the switch with better visibility */
:deep(.v-switch) {
    margin-bottom: 16px;
}

:deep(.v-switch .v-label) {
    color: rgb(var(--v-theme-editor-text-primary)) !important;
    font-weight: 500;
}

:deep(.v-switch .v-selection-control__input) {
    color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-switch .v-selection-control__wrapper) {
    background-color: rgba(0, 0, 0, 0.12) !important;
}

:deep(.v-switch .v-selection-control--dirty .v-selection-control__wrapper) {
    background-color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-switch .v-selection-control__thumb) {
    background-color: white !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>