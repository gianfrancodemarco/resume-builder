<template>
    <div class="panel-card" data-section="personal">
        <div class="card-body personal">
            <div class="photo">
                <label class="photo-upload" :title="basics.image ? 'Change photo' : 'Add photo'">
                    <input type="file" accept="image/*" class="d-none" aria-label="Profile photo"
                        @change="onPhotoChange" />
                    <div v-if="basics.image" class="photo-preview" :style="{
                        backgroundImage: `url(${basics.image})`,
                        backgroundSize: `${photo.scale}% auto`,
                        backgroundPosition: `${photo.x}% ${photo.y}%`
                    }" />
                    <div v-else class="photo-placeholder">
                        <v-icon icon="ph-image" size="22" />
                        <span>Photo</span>
                    </div>
                </label>
            </div>
            <div class="names">
                <div>
                    <label class="field-label" for="basics-name">Full name</label>
                    <v-text-field id="basics-name" v-model="basics.name" variant="outlined" density="compact"
                        hide-details aria-label="Name" />
                </div>
                <div>
                    <label class="field-label" for="basics-label">Title</label>
                    <v-text-field id="basics-label" v-model="basics.label" variant="outlined" density="compact"
                        hide-details placeholder="Software Engineer" aria-label="Title" />
                </div>
            </div>
        </div>

        <div v-if="basics.image" class="photo-actions">
            <v-btn size="small" variant="text" :prepend-icon="adjusting ? 'ph-caret-up' : 'ph-caret-down'"
                @click="adjusting = !adjusting">Adjust photo</v-btn>
            <v-btn size="small" variant="text" color="error" prepend-icon="ph-trash" @click="removePhoto">
                Remove photo
            </v-btn>
        </div>
        <div v-if="basics.image && adjusting" class="photo-sliders">
            <div v-for="slider in PHOTO_SLIDERS" :key="slider.key" class="slider-row">
                <span>{{ slider.label }}</span>
                <v-slider v-model="photo[slider.key]" :min="slider.min" :max="slider.max" step="1" hide-details
                    color="primary" :aria-label="slider.label" />
            </div>
        </div>
    </div>
</template>

<script setup>
// Name, title and photo. The photo crop is an app setting stored in meta.
import { settingsOf } from '@/resume/resume'
import { computed, ref } from 'vue'

const props = defineProps({
    resume: { type: Object, required: true }
})

const PHOTO_SLIDERS = [
    { key: 'scale', label: 'Zoom', min: 50, max: 300 },
    { key: 'x', label: 'Horizontal', min: 0, max: 100 },
    { key: 'y', label: 'Vertical', min: 0, max: 100 },
]

const basics = computed(() => props.resume.basics)
const photo = computed(() => settingsOf(props.resume).photo)
const adjusting = ref(false)

const onPhotoChange = event => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = e => { props.resume.basics.image = e.target.result }
        reader.readAsDataURL(file)
    }
    event.target.value = null
}

const removePhoto = () => {
    delete props.resume.basics.image
    adjusting.value = false
}
</script>

<style scoped>
.personal {
    display: flex;
    gap: 16px;
    align-items: center;
}

.photo-upload {
    display: block;
    cursor: pointer;
}

.photo-preview,
.photo-placeholder {
    width: 84px;
    height: 84px;
    border-radius: 50%;
}

.photo-preview {
    background-repeat: no-repeat;
}

.photo-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    font-size: 0.75rem;
    border: 1.5px dashed rgb(var(--v-theme-editor-border));
    color: rgb(var(--v-theme-editor-text-muted));
}

.photo-upload:hover .photo-placeholder {
    border-color: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-primary));
}

.names {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
}

.photo-actions {
    display: flex;
    justify-content: space-between;
    padding: 0 8px 4px;
}

.photo-sliders {
    padding: 0 16px 12px;
}

.slider-row {
    display: grid;
    grid-template-columns: 90px 1fr;
    align-items: center;
    font-size: 0.85rem;
}
</style>
