<template>
    <div class="style-editor">
        <v-tabs v-model="activeTab" color="primary" class="style-tabs mb-4">
            <v-tab value="colors">
                <v-icon icon="mdi-palette" class="mr-2" />
                Colors
            </v-tab>
            <v-tab value="typography">
                <v-icon icon="mdi-format-font" class="mr-2" />
                Typography
            </v-tab>
            <v-tab value="spacing">
                <v-icon icon="mdi-format-line-spacing" class="mr-2" />
                Spacing
            </v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
            <v-window-item value="colors">
                <div class="d-flex flex-column gap-4 pa-4">
                    <div v-for="(color, key) in colorFields" :key="key" class="color-field">
                        <div class="d-flex align-center justify-space-between mb-2">
                            <span class="text-subtitle-2">{{ color.label }}</span>
                            <div class="d-flex align-center">
                                <span class="color-hex mr-2">{{ styleData.colors[key].toUpperCase() }}</span>
                                <v-menu location="bottom end" :close-on-content-click="false">
                                    <template v-slot:activator="{ props }">
                                        <div class="color-preview" v-bind="props"
                                            :style="{ backgroundColor: styleData.colors[key] }">
                                            <v-icon icon="mdi-pencil" size="small" class="edit-icon"></v-icon>
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
            </v-window-item>

            <v-window-item value="typography">
                <div class="d-flex flex-column gap-4 pa-4">
                    <div>
                        <div class="text-subtitle-2 mb-2">Heading Font</div>
                        <v-select v-model="styleData.typography.headingFont" :items="fontOptions" variant="outlined"
                            density="comfortable" :item-text="item => item" :item-value="item => item">
                            <template v-slot:selection="{ item }">
                                <span :style="{ fontFamily: item.value }">{{ item.value }}</span>
                            </template>
                            <template v-slot:item="{ props: itemProps, item }">
                                <v-list-item v-bind="itemProps" :style="{ fontFamily: item.value }"/>
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
            </v-window-item>

            <v-window-item value="spacing">
                <div class="d-flex flex-column gap-4 pa-4">
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
            </v-window-item>
        </v-window>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ResumeStyle2ColumnsV1 } from '@/models/ResumeStyle/ResumeStyle2ColumnsV1'

const props = defineProps({
    styleData: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:style-data', 'change'])

const activeTab = ref('colors')

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

<style scoped>
.style-editor {
    padding: 16px;
}

.style-tabs {
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

:deep(.v-window) {
    background: transparent;
}

:deep(.v-window__container) {
    height: auto !important;
}

:deep(.v-window-item) {
    height: auto !important;
}

.color-field {
    background-color: #f8fafc;
    border-radius: 12px;
    padding: 12px 16px;
    border: 1px solid rgba(0, 0, 0, 0.08);
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

.edit-icon {
    opacity: 0;
    color: white;
    transition: opacity 0.2s ease-in-out;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.color-preview:hover .edit-icon {
    opacity: 1;
}

.color-picker-card {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
}

:deep(.v-slider .v-slider-track__fill) {
    background-color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-slider .v-slider-thumb__surface) {
    border-color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-select .v-field) {
    border-radius: 8px !important;
}

:deep(.v-select .v-field__outline) {
    border-color: rgba(0, 0, 0, 0.12) !important;
}

:deep(.v-select .v-field--focused .v-field__outline) {
    border-color: rgb(var(--v-theme-primary)) !important;
}

.color-pickers {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
}

.color-picker-item {
    display: flex;
    align-items: center;
    gap: 16px;
}

.color-picker-item label {
    min-width: 120px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.87);
}

.color-hex {
    font-size: 0.9em;
    color: rgba(0, 0, 0, 0.6);
}

:deep(.v-color-picker) {
    width: 100%;
    max-width: 200px;
}

:deep(.v-color-picker__input) {
    display: none;
}

.color-input {
    width: 100%;
}

:deep(.color-input .v-field__input) {
    font-size: 0.9em;
    padding: 0 8px;
    min-height: 32px;
}

:deep(.color-input .v-field__outline) {
    border-color: rgba(0, 0, 0, 0.12);
}

:deep(.color-input .v-field--focused .v-field__outline) {
    border-color: rgb(var(--v-theme-primary));
}

.style-slider {
    max-width: 340px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    display: block;
}
</style>