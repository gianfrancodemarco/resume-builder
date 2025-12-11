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
                    <input type="file" 
                        accept="image/*" 
                        style="display:none;" 
                        @change="handleImageChange"
                        aria-label="Profile Image"
                    />
                    <v-avatar size="72" class="profile-avatar">
                        <img
                            v-if="props.resumeData.personal.imageData"
                            :src="props.resumeData.personal.imageData"
                            alt="Profile Image"
                            style="object-fit: cover; width: 100%; height: 100%;"
                        />
                        <template v-else>
                            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                                <circle cx="36" cy="36" r="36" fill="#e0e0e0"/>
                                <ellipse cx="36" cy="32" rx="14" ry="14" fill="#bdbdbd"/>
                                <ellipse cx="36" cy="58" rx="18" ry="10" fill="#bdbdbd"/>
                            </svg>
                        </template>
                    </v-avatar>
                </label>
                    <v-btn 
                        v-if="props.resumeData.personal.imageData"
                        icon="ph-delete" 
                        color="default" 
                        size="small" 
                        class="ml-2"
                        @click="handleClearImage"
                        aria-label="Clear Profile Image"
                    />
            </div>
            
            <!-- <div v-if="props.resumeData.personal.imageData">
                <div class="d-flex flex-column">
                    <div class="slider-container">
                        <div class="text-subtitle-2">Image Zoom</div>
                        <v-slider v-model="props.resumeData.personal.imageZoom" min="1" max="100" step="1" thumb-label>
                            <template v-slot:thumb-label="props.resumeData.personal.imageZoom">
                                {{ props.resumeData.personal.imageZoom }} %
                            </template>
                        </v-slider>
                    </div>
                </div>
            </div> -->
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
            props.resumeData.personal.imageData = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    event.target.value = null;
}

const handleClearImage = () => {
    props.resumeData.personal.imageData = ''
}
</script>