<template>
  <div class="editor-card">
    <v-window v-model="activeTab" class="editor-window">
      <v-window-item value="info">
        <ResumeInfo :resume="props.resume" :is-mobile="props.isMobile" />
      </v-window-item>

      <v-window-item value="style">
        <ResumeStyle :resume="props.resume" />
      </v-window-item>

      <v-window-item value="ai">
        <AIHub :resume="props.resume" @update:resume="emit('update:resume', $event)" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AIHub from './AIHub/AIHub.vue'
import './ResumeEditorStyles.css'
import ResumeInfo from './ResumeInfo/ResumeInfo.vue'
import ResumeStyle from './ResumeStyle/ResumeStyle.vue'
import './SliderStyles.css'

const props = defineProps({
  resume: {
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

const emit = defineEmits(['update:resume', 'update:activeTab'])

const activeTab = ref(props.activeTab)

// Watch for changes in the activeTab prop
watch(() => props.activeTab, (newValue) => {
  activeTab.value = newValue
})

// Watch for changes in the local activeTab and emit to parent
watch(activeTab, (newValue) => {
  emit('update:activeTab', newValue)
})

</script>