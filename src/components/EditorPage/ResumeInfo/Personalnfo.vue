<template>
    <div class="editor-section" data-section="personal">
        <div class="section-header">
            <div class="d-flex align-center w-100">
                <span class="section-title">
                    Personal Information
                </span>
            </div>
        </div>
        <div class="section-content">
            <v-text-field v-model="basics.name" label="Name" variant="outlined" density="comfortable" class="mb-2"
                aria-label="Name" />
            <v-text-field v-model="basics.label" label="Title" variant="outlined" density="comfortable" class="mb-2"
                placeholder="Software Engineer" aria-label="Title" />

            <div class="d-flex align-center justify-center mb-2">
                <label class="profile-image-upload" style="cursor:pointer; display:inline-block;">
                    <input type="file" accept="image/*" style="display:none;" @change="handleImageChange"
                        aria-label="Profile Image" />
                    <v-avatar size="72" class="profile-avatar">
                        <div v-if="basics.image" :style="{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            backgroundImage: `url(${basics.image})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: `${photo.scale}% auto`,
                            backgroundPosition: `${photo.x}% ${photo.y}%`
                        }" aria-label="Profile Image" />
                        <template v-else>
                            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                                <circle cx="36" cy="36" r="36" fill="#e0e0e0" />
                                <ellipse cx="36" cy="32" rx="14" ry="14" fill="#bdbdbd" />
                                <ellipse cx="36" cy="58" rx="18" ry="10" fill="#bdbdbd" />
                            </svg>
                        </template>
                    </v-avatar>
                </label>
                <v-btn v-if="basics.image" icon="ph-delete" color="default" size="small" class="ml-2"
                    @click="clearImage" aria-label="Clear Profile Image" />
            </div>

            <div v-if="basics.image" class="d-flex flex-column mb-2">
                <div v-for="slider in PHOTO_SLIDERS" :key="slider.key" class="slider-container">
                    <div class="text-subtitle-2">{{ slider.label }}</div>
                    <v-slider v-model="photo[slider.key]" :min="slider.min" :max="slider.max" step="1" thumb-label
                        hide-details>
                        <template v-slot:thumb-label>{{ photo[slider.key] }} %</template>
                    </v-slider>
                </div>
            </div>

            <div class="text-subtitle-2 mb-2">Contact</div>
            <v-text-field v-model="basics.email" label="Email" type="email" variant="outlined" density="comfortable"
                class="mb-2" :rules="[emailRule]" />
            <v-text-field v-model="basics.phone" label="Phone" variant="outlined" density="comfortable" class="mb-2" />
            <v-text-field v-model="basics.url" label="Website" variant="outlined" density="comfortable" class="mb-2"
                @blur="basics.url = normalizeUrl(basics.url)" />
            <div class="d-flex ga-2">
                <v-text-field v-model="location.city" label="City" variant="outlined" density="comfortable" />
                <v-text-field v-model="location.region" label="Region" variant="outlined" density="comfortable" />
                <v-text-field v-model="location.countryCode" label="Country code" placeholder="US"
                    variant="outlined" density="comfortable" />
            </div>
            <div class="d-flex ga-2 mb-2">
                <v-text-field v-model="location.address" label="Address" variant="outlined" density="comfortable" />
                <v-text-field v-model="location.postalCode" label="Postal code" variant="outlined"
                    density="comfortable" />
            </div>

            <div class="text-subtitle-2 mb-2">Summary</div>
            <MarkdownEditor v-model="summary" />
        </div>
    </div>
</template>

<script setup>
// Edits the JSON Resume `basics`; the photo crop is an app setting in meta
import { settingsOf } from '@/resume/resume'
import { normalizeUrl } from '@/resume/values'
import { computed } from 'vue'
import MarkdownEditor from './MarkdownEditor.vue'

const props = defineProps({
    resume: {
        type: Object,
        required: true
    }
})

const PHOTO_SLIDERS = [
    { key: 'x', label: 'Image Left', min: 0, max: 100 },
    { key: 'y', label: 'Image Top', min: 0, max: 100 },
    { key: 'scale', label: 'Image Scale', min: 50, max: 300 },
]

const basics = computed(() => props.resume.basics)
const photo = computed(() => settingsOf(props.resume).photo)
const location = computed(() => props.resume.basics.location)
const summary = computed({
    get: () => basics.value.summary || '',
    set: value => { basics.value.summary = value },
})

const emailRule = v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email'

const clearImage = () => {
    delete props.resume.basics.image
}

const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            props.resume.basics.image = e.target.result
        }
        reader.readAsDataURL(file)
    }
    event.target.value = null
}
</script>
