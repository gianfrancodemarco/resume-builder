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
                                <span class="color-hex mr-2">{{ local.colors[key].toUpperCase() }}</span>
                                <v-menu location="bottom end" :close-on-content-click="false">
                                    <template v-slot:activator="{ props }">
                                        <div class="color-preview" v-bind="props"
                                            :style="{ backgroundColor: local.colors[key] }">
                                            <v-icon icon="mdi-pencil" size="small" class="edit-icon"></v-icon>
                                        </div>
                                    </template>
                                    <v-card class="color-picker-card">
                                        <v-color-picker v-model="local.colors[key]" mode="hex"
                                            hide-inputs></v-color-picker>
                                        <v-divider></v-divider>
                                        <div class="pa-2">
                                            <v-text-field v-model="local.colors[key]" class="color-input"
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
                        <v-select v-model="local.typography.headingFont" :items="fontOptions" variant="outlined"
                            density="comfortable"></v-select>
                    </div>
                    <div>
                        <div class="text-subtitle-2 mb-2">Body Font</div>
                        <v-select v-model="local.typography.bodyFont" :items="fontOptions" variant="outlined"
                            density="comfortable"></v-select>
                    </div>
                    <div>
                        <div class="text-subtitle-2 mb-2">Font Sizes</div>
                        <v-slider v-model="local.typography.baseSize" label="Base Size" min="12" max="20" step="1"
                            thumb-label></v-slider>
                        <v-slider v-model="local.typography.headingSize" label="Heading Size" min="16" max="32" step="1"
                            thumb-label></v-slider>
                    </div>
                </div>
            </v-window-item>

            <v-window-item value="spacing">
                <div class="d-flex flex-column gap-4 pa-4">
                    <div>
                        <div class="text-subtitle-2 mb-2">Section Spacing</div>
                        <v-slider v-model="local.spacing.section" label="Section Gap" min="8" max="48" step="4"
                            thumb-label></v-slider>
                    </div>
                    <div>
                        <div class="text-subtitle-2 mb-2">Content Spacing</div>
                        <v-slider v-model="local.spacing.content" label="Content Gap" min="4" max="24" step="2"
                            thumb-label></v-slider>
                    </div>
                    <div>
                        <div class="text-subtitle-2 mb-2">Sidebar Position</div>
                        <v-switch v-model="local.spacing.sidebarLeft" label="Move sidebar to left" color="primary"
                            hide-details></v-switch>
                    </div>
                </div>
            </v-window-item>
        </v-window>
    </div>
</template>

<script>
export default {
    props: {
        styleData: {
            type: Object,
            required: true
        }
    },
    emits: ['update:style-data'],
    data() {
        return {
            activeTab: 'colors',
            local: this.styleData,
            fontOptions: [
                'Roboto',
                'Arial',
                'Helvetica',
                'Times New Roman',
                'Georgia',
                'Verdana',
                'Open Sans',
                'Lato',
                'Montserrat',
                'Poppins'
            ],
            colorFields: {
                primary: { label: 'Primary Color' },
                text: { label: 'Text Color' },
                background: { label: 'Background Color' },
                sidebar: { label: 'Sidebar Color' },
                link: { label: 'Link Color' }
            }
        }
    },
    watch: {
        local: {
            handler(newVal) {
                this.$emit('update:style-data', JSON.parse(JSON.stringify(newVal)))
            },
            deep: true
        }
    },
    methods: {
        validateHex(key) {
            const value = this.local.colors[key]
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
            this.local.colors[key] = cleanValue
        }
    }
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
    font-family: monospace;
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
    font-family: monospace;
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
</style>