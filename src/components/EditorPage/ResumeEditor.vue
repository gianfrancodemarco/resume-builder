<template>
  <div class="editor-card">
    <v-window v-model="activeTab" class="editor-window">
      <v-window-item value="info">
        <ResumeInfo v-model:resume-data="props.resumeData" :is-mobile="props.isMobile"
          @update:resume-data="updateResumeData" @change="emit('change')" />
      </v-window-item>

      <v-window-item value="style">
        <ResumeStyle v-model:style-data="props.style" :resume-data="props.resumeData" @update:style-data="updateStyle" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import './ResumeEditorStyles.css'
import { ref, watch } from 'vue'
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
  },
  activeTab: {
    type: String,
    default: 'info'
  }
})

const emit = defineEmits(['update:resumeData', 'update:style', 'save', 'change', 'preview', 'update:activeTab'])

const activeTab = ref(props.activeTab)

// Watch for changes in the activeTab prop
watch(() => props.activeTab, (newValue) => {
  activeTab.value = newValue
})

// Watch for changes in the local activeTab and emit to parent
watch(activeTab, (newValue) => {
  emit('update:activeTab', newValue)
})

const updateStyle = (newStyle) => {
  emit('update:style', newStyle)
  emit('change')
}

const updateResumeData = (newData) => {
  emit('update:resumeData', newData)
  emit('change')
}
</script>