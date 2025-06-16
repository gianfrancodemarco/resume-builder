<template>
  <div class="editor-card" :class="{ 'pt-8': !isMobile }">
    <v-tabs v-model="activeTab" color="primary" class="editor-tabs">
      <v-tab value="info">
        Info
      </v-tab>
      <v-tab value="style">
        Style
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab" class="editor-window">
      <v-window-item value="info">
        <ResumeInfo v-model:resume-data="props.resumeData" :is-mobile="props.isMobile"
          @update:resume-data="updateResumeData" @change="emit('change')" />
      </v-window-item>

      <v-window-item value="style">
        <ResumeStyle v-model:style-data="props.style" @update:style-data="updateStyle" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResumeStyle from './ResumeStyle.vue'
import ResumeInfo from './ResumeInfo.vue'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  style: {
    type: Object,
    required: true
  },
  isMobile: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:resumeData', 'update:style', 'save', 'change', 'preview'])

const activeTab = ref('info')

const updateStyle = (newStyle) => {
  emit('update:style', newStyle)
  emit('change')
}

const updateResumeData = (newData) => {
  emit('update:resumeData', newData)
  emit('change')
}
</script>

<style scoped src="./ResumeEditorStyles.css"></style>