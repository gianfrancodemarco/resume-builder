<template>
    <div>
        <!-- Desktop menu -->
        <div v-if="!isMobile" class="menu-container" :class="{ 'open': menuOpen }">
            <v-btn icon="ph-list" color="primary" class="menu-toggle" variant="text" @click="toggleMenu" />

            <div class="menu-content" v-if="menuOpen">
                <div class="menu-actions">
                    <v-btn block color="white" prepend-icon="ph-x" class="action-btn" @click="toggleMenu">Close
                        this menu</v-btn>
                    <v-btn block color="primary" prepend-icon="ph-brackets-curly" class="action-btn"
                        @click="() => { closeAllMenus(); handleExportJSON() }">Export JSON</v-btn>
                    <v-btn block color="primary" prepend-icon="ph-upload" class="action-btn"
                        @click="() => { closeAllMenus(); handleImportJSON() }">Import JSON</v-btn>
                    <v-btn block color="primary" prepend-icon="ph-file-pdf" class="action-btn"
                        @click="() => { closeAllMenus(); handleDownloadPDF() }">Download PDF</v-btn>
                    <v-btn block color="primary" prepend-icon="ph-file-code" class="action-btn"
                        @click="() => { closeAllMenus(); handleDownloadHTML() }">Download HTML</v-btn>
                    <v-btn block color="primary" prepend-icon="ph-file-text" class="action-btn"
                        @click="() => { closeAllMenus(); handleConvertCV() }">Convert CV</v-btn>
                </div>
            </div>
        </div>

        <!-- Mobile menu -->
        <div v-else class="mobile-actions">
            <div v-if="showActions" class="action-buttons">
                <div class="action-item">
                    <span class="mobile-action-label">Close this menu</span>
                    <v-btn icon="ph-x" color="white" class="mobile-action-btn" elevation="2" @click="toggleActions" />
                </div>
                <div class="action-item">
                    <span class="mobile-action-label">Export JSON</span>
                    <v-btn icon="ph-brackets-curly" color="primary"
                        @click="() => { closeAllMenus(); handleExportJSON() }" class="mobile-action-btn"
                        elevation="2" />
                </div>
                <div class="action-item">
                    <span class="mobile-action-label">Import JSON</span>
                    <v-btn icon="ph-upload" color="primary" @click="() => { closeAllMenus(); handleImportJSON() }"
                        class="mobile-action-btn" elevation="2" />
                </div>
                <div class="action-item">
                    <span class="mobile-action-label">Download PDF</span>
                    <v-btn icon="ph-file-pdf" color="primary" @click="() => { closeAllMenus(); handleDownloadPDF() }"
                        class="mobile-action-btn" elevation="2" />
                </div>
                <div class="action-item">
                    <span class="mobile-action-label">Download HTML</span>
                    <v-btn icon="ph-file-code" color="primary" @click="() => { closeAllMenus(); handleDownloadHTML() }"
                        class="mobile-action-btn" elevation="2" />
                </div>
                <div class="action-item">
                    <span class="mobile-action-label">Convert CV</span>
                    <v-btn icon="ph-file-text" color="primary" @click="() => { closeAllMenus(); handleConvertCV() }"
                        class="mobile-action-btn" elevation="2" />
                </div>
            </div>
            <v-btn icon="ph-lightning" color="primary" class="mobile-action-btn" elevation="2" @click="toggleActions" />
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
    handleDownloadHTML: Function,
    handleConvertCV: Function
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

.mobile-action-label {
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    white-space: nowrap;
}

.mobile-action-btn {
    width: 48px !important;
    height: 48px !important;
    transition: all .2s ease;
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