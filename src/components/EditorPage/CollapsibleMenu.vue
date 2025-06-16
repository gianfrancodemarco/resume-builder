<template>
    <div>
        <!-- Slim hamburger column -->
        <div class="menu-hamburger-col" :class="{ 'open': menuOpen }">
            <div>
                <v-btn icon="mdi-menu" color="primary" class="menu-hamburger-btn" variant="plain" @click="toggleMenu" />
            </div>
            <div class="menu-content" v-if="menuOpen">
                <div class="menu-actions">
                    <v-btn block color="primary" prepend-icon="mdi-code-json" class="menu-action-btn"
                        @click="handleExportJSON">Export JSON</v-btn>
                    <v-btn block color="primary" prepend-icon="mdi-upload" class="menu-action-btn"
                        @click="handleImportJSON">Import JSON</v-btn>
                    <v-btn block color="primary" prepend-icon="mdi-file-pdf-box" class="menu-action-btn"
                        @click="handleDownloadPDF">Download PDF</v-btn>
                    <v-btn block color="primary" prepend-icon="mdi-file-code" class="menu-action-btn"
                        @click="handleDownloadHTML">Download HTML</v-btn>
                    <v-btn block color="primary" prepend-icon="mdi-close" class="menu-action-btn"
                        @click="toggleMenu">Close</v-btn>
                </div>
            </div>
        </div>

        <!-- Mobile menu -->
        <div v-if="isMobile" class="mobile-actions">
            <div v-if="menuOpen" class="action-buttons">
                <div class="action-item">
                    <span class="action-label">Close this menu</span>
                    <v-btn icon="mdi-close" color="white" class="action-btn" elevation="2" @click="toggleMenu" />
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
            <v-btn icon="mdi-lightning-bolt" color="primary" class="action-btn" elevation="2" @click="toggleMenu" />
        </div>

        <!-- Mobile overlay -->
        <div v-if="isMobile && menuOpen" class="mobile-overlay" @click="toggleMenu"></div>

        <!-- Desktop overlay -->
        <div v-if="!isMobile && menuOpen" class="desktop-overlay" @click="toggleMenu"></div>
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
const toggleMenu = () => {
    menuOpen.value = !menuOpen.value
}
</script>

<style scoped>
.menu-hamburger-col {
    position: fixed;
    top: 0;
    right: 0;
    width: 44px;
    height: 100vh;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 120;
    cursor: pointer;
    box-shadow: none;
    padding: 0;
    transition: width 0.3s ease;
}

.menu-hamburger-col.open {
    width: 320px;
}

.menu-hamburger-btn {
    margin-top: 8px;
    margin-bottom: 0;
    background: none !important;
    box-shadow: none !important;
}

.menu-content {
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #eee;
}

.menu-title {
    color: #222;
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.menu-close-btn {
    background: none !important;
    color: #222 !important;
}

.menu-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
}

.menu-action-btn {
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    height: 44px;
    border: 1px solid #e0e0e0;
    box-shadow: none !important;
    background: white !important;
    color: #222 !important;
    transition: background 0.2s, color 0.2s;
}

.menu-action-btn:hover {
    background: #e0e0e0 !important;
    color: #111 !important;
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
    z-index: 100;
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

.mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 99;
}

.desktop-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
}

@media (max-width: 600px) {
    .mobile-actions {
        bottom: 16px;
        right: 16px;
    }

    .action-btn {
        width: 40px !important;
        height: 40px !important;
    }
}
</style>