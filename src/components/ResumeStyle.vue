<template>
    <div class="style-editor">
        <v-tabs v-model="activeTab" color="primary" class="mb-4">
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
                    <div>
                        <div class="text-subtitle-2 mb-2">Primary Color</div>
                        <v-color-picker v-model="local.colors.primary" mode="hex" hide-inputs></v-color-picker>
                    </div>
                    <div>
                        <div class="text-subtitle-2 mb-2">Text Color</div>
                        <v-color-picker v-model="local.colors.text" mode="hex" hide-inputs></v-color-picker>
                    </div>
                    <div>
                        <div class="text-subtitle-2 mb-2">Background Color</div>
                        <v-color-picker v-model="local.colors.background" mode="hex" hide-inputs></v-color-picker>
                    </div>
                    <div>
                        <div class="text-subtitle-2 mb-2">Sidebar Color</div>
                        <v-color-picker v-model="local.colors.sidebar" mode="hex" hide-inputs />
                    </div>
                    <div>
                        <div class="text-subtitle-2 mb-2">Link Color</div>
                        <v-color-picker v-model="local.colors.link" mode="hex" hide-inputs />
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
            ]
        }
    },
    watch: {
        local: {
            handler(newVal) {
                this.$emit('update:style-data', JSON.parse(JSON.stringify(newVal)))
            },
            deep: true
        }
    }
}
</script>

<style scoped>
.style-editor {
    padding: 16px;
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
</style>