<template>
    <div>
        <!-- Desktop menu -->
        <div v-if="!isMobile" class="menu-container" :class="{ 'open': menuOpen }">
            <v-btn icon="mdi-menu" color="primary" class="menu-toggle" variant="text" @click="toggleMenu" />

            <div class="menu-content" v-if="menuOpen">
                <div class="menu-actions">
                    <v-btn block color="white" prepend-icon="mdi-close" class="menu-action-btn"
                        @click="toggleMenu">Close this menu</v-btn>
                    <v-btn block color="primary" prepend-icon="mdi-code-json" class="menu-action-btn"
                        @click="handleExportJSON">Export JSON</v-btn>
                    <v-btn block color="primary" prepend-icon="mdi-upload" class="menu-action-btn"
                        @click="handleImportJSON">Import JSON</v-btn>
                    <v-btn block color="primary" prepend-icon="mdi-file-pdf-box" class="menu-action-btn"
                        @click="handleDownloadPDF">Download PDF</v-btn>
                    <v-btn block color="primary" prepend-icon="mdi-file-code" class="menu-action-btn"
                        @click="handleDownloadHTML">Download HTML</v-btn>
                </div>
            </div>
        </div>

        <!-- Mobile menu -->
        <div v-else class="mobile-actions">
            <div v-if="showActions" class="action-buttons">
                <div class="action-item">
                    <span class="action-label">Close this menu</span>
                    <v-btn icon="mdi-close" color="white" class="action-btn" elevation="2" @click="toggleActions" />
                </div>
                <div class="action-item">
                    <span class="action-label">Export JSON</span>
                    <v-btn icon="mdi-code-json" color="primary" @click="handleExportJSON" class="action-btn"
                        elevation="2" />
                </div>
                <div class="action-item">
                    <span class="action-label">Import JSON</span>
                    <v-btn icon="mdi-upload" color="primary" @click="handleImportJSON" class="action-btn"
                        elevation="2" />
                </div>
                <div class="action-item">
                    <span class="action-label">Download PDF</span>
                    <v-btn icon="mdi-file-pdf-box" color="primary" @click="handleDownloadPDF" class="action-btn"
                        elevation="2" />
                </div>
                <div class="action-item">
                    <span class="action-label">Download HTML</span>
                    <v-btn icon="mdi-file-code" color="primary" @click="handleDownloadHTML" class="action-btn"
                        elevation="2" />
                </div>
            </div>
            <v-btn icon="mdi-lightning-bolt" color="primary" class="action-btn" elevation="2" @click="toggleActions" />
        </div>

        <!-- Overlay -->
        <div v-if="menuOpen || showActions" class="menu-overlay" @click="closeAllMenus"></div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

const props = defineProps({
    handleExportJSON: Function,
    handleImportJSON: Function,
    handleDownloadPDF: Function,
    handleDownloadHTML: Function
})

const menuOpen = ref(false)
const showActions = ref(false)

const toggleMenu = () => {
    menuOpen.value = !menuOpen.value
    if (menuOpen.value) {
        showActions.value = false
    }
}

const toggleActions = () => {
    showActions.value = !showActions.value
    if (showActions.value) {
        menuOpen.value = false
    }
}

const closeAllMenus = () => {
    menuOpen.value = false
    showActions.value = false
}
</script>

<style scoped>
.menu-container {
    position: fixed;
    top: 0;
    right: 0;
    width: 64px;
    height: 100vh;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 120;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.menu-container.open {
    width: 280px;
}

.menu-toggle {
    margin: 16px 0;
    background: none !important;
}

.menu-content {
    width: 100%;
    padding: 16px;
    opacity: 0;
    transform: translateX(20px);
    animation: slideInDesktop 0.3s forwards;
}

.menu-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.menu-action-btn {
    height: 48px;
    border-radius: 8px;
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0.3px;
    transition: all 0.2s ease;
}

.menu-action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Mobile styles */
.mobile-actions {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
    z-index: 130;
}

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-end;
}

.action-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.action-label {
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    white-space: nowrap;
}

.action-btn {
    width: 48px !important;
    height: 48px !important;
    transition: all 0.2s ease;
}

.action-btn:hover {
    transform: translateY(-2px);
}

.menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    z-index: 110;
    animation: fadeIn 0.3s forwards;
}

@keyframes slideInDesktop {
    from {
        opacity: 0;
        transform: translateX(20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@media (max-width: 600px) {
    .mobile-actions {
        bottom: 16px;
        right: 16px;
    }
}
</style>