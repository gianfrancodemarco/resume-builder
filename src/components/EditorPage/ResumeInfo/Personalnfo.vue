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
            <v-text-field v-model="props.resumeData.personal.name" label="Name" variant="outlined" density="comfortable"
                class="mb-2" aria-label="Name" />
            <v-text-field v-model="props.resumeData.personal.title" label="Title" variant="outlined"
                density="comfortable" aria-label="Title" />

            <div class="d-flex align-center justify-center">
                <label class="profile-image-upload" style="cursor:pointer; display:inline-block;">
                    <input type="file" accept="image/*" style="display:none;" @change="handleImageChange"
                        aria-label="Profile Image" />
                    <v-avatar size="72" class="profile-avatar">
                        <div v-if="props.resumeData.personal.image.data" :style="{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            backgroundImage: `url(${props.resumeData.personal.image.data})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: `${props.resumeData.personal.image.scale ?? 100}% auto`,
                            backgroundPosition: `${props.resumeData.personal.image.x ?? 50}% ${props.resumeData.personal.image.y ?? 50}%`
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
                <v-btn v-if="props.resumeData.personal.image.data" icon="ph-delete" color="default" size="small"
                    class="ml-2" @click="handleClearImage" aria-label="Clear Profile Image" />
            </div>

            <div v-if="props.resumeData.personal.image.data">
                <div class="d-flex flex-column">
                    <div class="slider-container">
                        <div class="text-subtitle-2">Image Left</div>
                        <v-slider v-model="props.resumeData.personal.image.x" min="0" max="100" step="1" thumb-label hide-details>
                            <template v-slot:thumb-label>
                                {{ props.resumeData.personal.image.x ?? 50 }} %
                            </template>
                        </v-slider>
                    </div>
                    <div class="slider-container">
                        <div class="text-subtitle-2">Image Top</div>
                        <v-slider v-model="props.resumeData.personal.image.y" min="0" max="100" step="1" thumb-label hide-details>
                            <template v-slot:thumb-label>
                                {{ props.resumeData.personal.image.y ?? 50 }} %
                            </template>
                        </v-slider>
                    </div>
                    <div class="slider-container">
                        <div class="text-subtitle-2">Image Scale</div>
                        <v-slider v-model="props.resumeData.personal.image.scale" min="50" max="300" step="1"
                            thumb-label hide-details>
                            <template v-slot:thumb-label>
                                {{ props.resumeData.personal.image.scale ?? 100 }} %
                            </template>
                        </v-slider>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    resumeData: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:resume-data', 'change'])

const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            props.resumeData.personal.image.data = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    event.target.value = null;
}

const handleClearImage = () => {
    props.resumeData.personal.image.data = ''
}
</script>