<template>
    <div class="landing-bg">
        <div class="center-content">
            <div class="logo-anim">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="36" stroke="#fff" stroke-width="4" opacity="0.2" />
                    <circle class="pulse" cx="40" cy="40" r="24" stroke="#fff" stroke-width="4" />
                    <text x="50%" y="54%" text-anchor="middle" fill="#fff" font-size="28"
                        font-family="Oswald, sans-serif" dy=".3em">RB</text>
                </svg>
            </div>
            <h1 class="landing-title">Resume Builder</h1>
            <p class="landing-subtitle">Create a stunning resume in minutes.<br>Modern, fast, and free.</p>
            <v-btn color="primary" class="landing-btn" large to="/editor">Start Editing</v-btn>
        </div>
    </div>
</template>

<script setup>
// No script needed
</script>

<style scoped>
.landing-bg {
    min-height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg, #0f2027 0%, #2c5364 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

.center-content {
    text-align: center;
    color: #fff;
    z-index: 2;
    position: relative;
    padding: 48px 24px 32px 24px;
    border-radius: 24px;
    background: rgba(0, 0, 0, 0.25);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
    backdrop-filter: blur(8px);
}

.logo-anim {
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
}

.pulse {
    stroke-dasharray: 150;
    stroke-dashoffset: 0;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        stroke-dashoffset: 150;
        opacity: 0.2;
    }

    50% {
        stroke-dashoffset: 0;
        opacity: 1;
    }

    100% {
        stroke-dashoffset: 150;
        opacity: 0.2;
    }
}

.landing-title {
    font-family: 'Oswald', sans-serif;
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: 1px;
}

.landing-subtitle {
    font-size: 1.2rem;
    font-weight: 400;
    margin-bottom: 32px;
    opacity: 0.92;
}

.landing-btn {
    height: 40px !important;
    font-size: 1rem;
    font-weight: 600;
    padding: 12px 16px;
    border-radius: 32px;
    background: #0f2027 !important;
    box-shadow: 0 4px 16px rgba(15, 32, 39, 0.18);
    transition: background 0.2s, box-shadow 0.2s;
}

.landing-btn:hover {
    background: #1a2c35 !important;
    box-shadow: 0 8px 32px rgba(15, 32, 39, 0.22);
}
</style>