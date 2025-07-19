<template>
  <component 
    :is="templateComponent" 
    v-bind="$props"
    @update="$emit('update', $event)"
  />
</template>

<script>
import BaseTemplate from './BaseTemplate.vue'
import TwoColumnTemplate from './TwoColumnTemplate.vue'
import OneColumnModern from './OneColumnModern.vue'

const TEMPLATE_COMPONENTS = {
  'TwoColumnsBlue': TwoColumnTemplate,
  'TwoColumnsGreen': TwoColumnTemplate,
  'OneColumnModern': OneColumnModern
}

export default {
  name: 'TemplateFactory',
  components: {
    BaseTemplate
  },
  props: {
    resumeData: {
      type: Object,
      required: true
    },
    style: {
      type: Object,
      required: true
    },
    downloadId: {
      type: String,
      default: ''
    },
    sidebarPosition: {
      type: String,
      default: 'right',
      validator: (value) => ['left', 'right'].includes(value)
    }
  },
  emits: ['update'],
  computed: {
    templateComponent() {
      // Use explicit templateName if available, otherwise default to TwoColumnsBlue
      const templateName = this.style.templateName || 'TwoColumnsBlue'
      return TEMPLATE_COMPONENTS[templateName] || TwoColumnTemplate
    }
  },
  beforeUnmount() {
    // Ensure child components are properly unmounted
    this.$nextTick(() => {
      // Force cleanup of any remaining custom CSS
      const remainingStyles = document.querySelectorAll('style[id^="resume-custom"]')
      remainingStyles.forEach(style => style.remove())
    })
  }
}
</script> 