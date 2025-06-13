<template>
    <div class="resizable-split" :class="{ 'mobile-view': isMobile }">
        <div class="left-pane" :style="{ width: isMobile ? `${leftWidth}%` : '50%' }">
            <slot name="left"></slot>
        </div>
        <div v-if="isMobile" class="resize-handle" @mousedown.prevent="startResize" @touchstart.prevent="startResize"
            @touchmove.prevent="handleResize" @touchend.prevent="stopResize">
        </div>
        <div class="right-pane" :style="{ width: isMobile ? `${100 - leftWidth}%` : '50%' }">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)
const leftWidth = ref(50)
const isResizing = ref(false)

onMounted(() => {
    window.addEventListener('mousemove', handleResize)
    window.addEventListener('mouseup', stopResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleResize)
    window.removeEventListener('mouseup', stopResize)
})

const startResize = (e) => {
    isResizing.value = true
    e.preventDefault()
}

const handleResize = (e) => {
    if (!isResizing.value) return

    const container = document.querySelector('.resizable-split')
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const clientX = e.clientX || (e.touches && e.touches[0].clientX)

    if (clientX) {
        const newWidth = ((clientX - containerRect.left) / containerRect.width) * 100
        leftWidth.value = Math.min(Math.max(newWidth, 20), 80) // Limit between 20% and 80%
    }
}

const stopResize = () => {
    isResizing.value = false
}
</script>

<style scoped>
.resizable-split {
    display: flex;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.left-pane {
    height: 100%;
    overflow-y: auto;
    transition: width 0.1s ease;
    flex-shrink: 0;
}

.right-pane {
    height: 100%;
    overflow-y: auto;
    transition: width 0.1s ease;
    flex-shrink: 0;
}

.resize-handle {
    width: 12px;
    background: #e0e0e0;
    cursor: col-resize;
    position: relative;
    z-index: 10;
    flex-shrink: 0;
    touch-action: none;
}

.resize-handle:hover,
.resize-handle:active {
    background: #bdbdbd;
}

.resize-handle::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 30px;
    background: #9e9e9e;
    border-radius: 1px;
}
</style>