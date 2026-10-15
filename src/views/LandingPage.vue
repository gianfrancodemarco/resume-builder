<template>
    <div class="landing-container">
        <!-- Background with animated gradient -->
        <div class="background-animation">
            <div class="gradient-bg"></div>
            <div class="floating-shapes">
                <div class="shape shape-1"></div>
                <div class="shape shape-2"></div>
            </div>
        </div>

        <!-- Main content -->
        <div class="content-wrapper">
            <v-btn class="theme-toggle" :icon="isDark ? 'ph-sun' : 'ph-moon'" variant="text"
                :aria-label="isDark ? 'Light theme' : 'Dark theme'" @click="toggleTheme" />
            <main class="hero-section">
                <div class="hero-content">
                    <h1 class="hero-title">
                        Create Your Perfect
                        <span class="title-highlight">Resume</span>
                        in Minutes
                    </h1>

                    <p class="hero-description">Write it once, pick a design, and download a PDF that looks
                        exactly like the preview. No account, nothing leaves your browser.
                    </p>

                    <div class="typing-container">
                        <span class="typing-text"></span>
                        <span class="cursor">|</span>
                    </div>

                    <div class="cta-buttons">
                        <v-btn color="primary" class="primary-btn" size="large" to="/editor" elevation="0">
                            <span class="btn-icon">✨</span>
                            Start Building
                        </v-btn>
                    </div>

                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">📐</div>
                            <div class="feature-content">
                                <h3 class="feature-title">Pixel-perfect PDF</h3>
                                <p class="feature-description">What you see is exactly what you download, on every
                                    device and browser</p>
                            </div>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">🔓</div>
                            <div class="feature-content">
                                <h3 class="feature-title">Open format, private by design</h3>
                                <p class="feature-description">Your resume is a JSON Resume file that stays in your
                                    browser. Import it, export it, take it anywhere</p>
                            </div>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">🚀</div>
                            <div class="feature-content">
                                <h3 class="feature-title">Free & Open Source</h3>
                                <p class="feature-description">No sign-up. The full source code is on GitHub</p>
                            </div>
                        </div>

                        <div class="feature-card guide-card">
                            <div class="feature-icon">📚</div>
                            <div class="feature-content">
                                <h3 class="feature-title">CV Writing Guide</h3>
                                <p class="feature-description">Learn how to write an outstanding CV with Guido's
                                    comprehensive guide for developers</p>
                                <a href="https://github.com/GuidoPenta/galactic-CV-guide-for-developers/blob/main/docs/english.md"
                                    target="_blank" class="guide-link">
                                    Read the Guide →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="hero-visual" aria-hidden="true">
                    <!-- Rendered by the app itself (sample resume), see public/landing -->
                    <img src="/landing/classic.png" alt="" class="resume-shot back" />
                    <img src="/landing/sidebar.png" alt="" class="resume-shot front" />
                </div>
            </main>

            <footer class="footer">
                <div class="footer-content">
                    <div class="footer-links">
                        <a href="https://gianfrancodemarco.dev" target="_blank" class="footer-link">
                            gianfrancodemarco.dev
                        </a>
                        <span class="footer-separator">•</span>
                        <a href="https://github.com/gianfrancodemarco/resume-builder" target="_blank"
                            class="footer-link">
                            <span class="github-icon">⭐</span>
                            Star on GitHub
                        </a>
                    </div>
                    <div class="footer-tagline">
                        Built with ❤️ and Vue.js
                    </div>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { useThemeToggle } from '@/composables/useThemeToggle'
import { onMounted } from 'vue'

const { isDark, toggleTheme } = useThemeToggle()

const sentences = [
    "Live preview of the real PDF as you type",
    "Clean layouts that look right with any color",
    "Import your old CV with AI",
    "Works on your phone too",
    "No registration required",
    "Open source and completely free",
]

onMounted(() => {
    const typingText = document.querySelector('.typing-text')
    let currentSentenceIndex = 0
    let currentCharIndex = 0
    let isDeleting = false
    let typingSpeed = 50

    function type() {
        const currentSentence = sentences[currentSentenceIndex]

        if (isDeleting) {
            typingText.textContent = currentSentence.substring(0, currentCharIndex - 1)
            currentCharIndex--
            typingSpeed = 30
        } else {
            typingText.textContent = currentSentence.substring(0, currentCharIndex + 1)
            currentCharIndex++
            typingSpeed = 50
        }

        if (!isDeleting && currentCharIndex === currentSentence.length) {
            isDeleting = true
            typingSpeed = 2000
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false
            currentSentenceIndex = (currentSentenceIndex + 1) % sentences.length
            typingSpeed = 500
        }

        setTimeout(type, typingSpeed)
    }

    type()
})
</script>

<style scoped>
.landing-container {
    min-height: 100vh;
    width: 100%;
    position: relative;
    overflow-x: hidden;
    background: rgb(var(--v-theme-background));
    display: flex;
    flex-direction: column;
}

/* Background Animation */
.background-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.gradient-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
    opacity: 0.08;
}

.floating-shapes {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.shape {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(45deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
    opacity: 0.08;
    animation: float 8s ease-in-out infinite;
}

.shape-1 {
    width: 100px;
    height: 100px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.shape-2 {
    width: 80px;
    height: 80px;
    top: 60%;
    right: 15%;
    animation-delay: 4s;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-15px) rotate(90deg);
    }
}

/* Content Wrapper */
.content-wrapper {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    flex-direction: column;
    color: rgb(var(--v-theme-on-background));
    justify-content: space-between;
    min-height: 100vh;
}

/* Hero Section */
.hero-section {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
    padding: 2rem 4rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    margin-bottom: 1rem;
}

.hero-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.hero-title {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1.1;
    margin: 0;
}

.title-highlight {
    background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-description {
    font-size: 1.1rem;
    line-height: 1.5;
    color: rgba(var(--v-theme-on-background), 0.8);
    margin: 0;
}

.typing-container {
    min-height: 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: rgba(var(--v-theme-on-background), 0.9);
    font-style: italic;
}

.cursor {
    animation: blink 1s infinite;
}

@keyframes blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}

.cta-buttons {
    display: flex;
    margin-top: 0.5rem;
}

.primary-btn {
    background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary))) !important;
    border-radius: 12px !important;
    font-weight: 600 !important;
    text-transform: none !important;
    padding: 0 2rem !important;
    height: 3rem !important;
    transition: all 0.3s ease !important;
}

.primary-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 25px rgba(var(--v-theme-primary), 0.3) !important;
}

.btn-icon {
    margin-right: 0.5rem;
}

/* Features Grid */
.features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin: 1rem auto 1rem auto;
    align-items: stretch;
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
}

.feature-card {
    background: rgba(var(--v-theme-surface), 0.6);
    border: 1px solid rgba(var(--v-theme-on-background), 0.1);
    border-radius: 16px;
    padding: 1rem;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 100%;
}

.feature-card:hover {
    background: rgba(var(--v-theme-on-background), 0.08);
    border-color: rgba(var(--v-theme-on-background), 0.2);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.feature-icon {
    font-size: 1.5rem;
    width: fit-content;
}

.feature-content {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    flex: 1;
}

.feature-title {
    font-size: 1rem;
    font-weight: 600;
    color: rgb(var(--v-theme-on-background));
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.coming-soon-badge {
    background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
    color: rgb(var(--v-theme-on-background));
    font-size: 0.6rem;
    font-weight: 600;
    padding: 0.15rem 0.5rem;
    border-radius: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {

    0%,
    100% {
        opacity: 0.8;
        transform: scale(1);
    }

    50% {
        opacity: 1;
        transform: scale(1.05);
    }
}

.feature-description {
    font-size: 0.85rem;
    color: rgba(var(--v-theme-on-background), 0.7);
    line-height: 1.3;
    margin: 0;
    flex: 1;
}

/* Softer shadows on a light background */
:global(.v-theme--light) .landing-container {
    --shot-shadow: 0.18;
}

.theme-toggle {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 3;
}

/* Hero Visual */
.hero-visual {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 560px;
}

.resume-shot {
    position: absolute;
    width: min(360px, 38vw);
    border-radius: 6px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, var(--shot-shadow, 0.45));
    transition: transform 0.4s ease;
}

.resume-shot.back {
    transform: translate(70px, 20px) rotate(6deg);
    opacity: 0.85;
}

.resume-shot.front {
    transform: translate(-40px, -10px) rotate(-3deg);
}

.hero-visual:hover .resume-shot.back {
    transform: translate(110px, 24px) rotate(8deg);
}

.hero-visual:hover .resume-shot.front {
    transform: translate(-70px, -14px) rotate(-4deg);
}

/* Footer */
.footer {
    padding: 2rem 4rem;
    backdrop-filter: blur(10px);
    background: rgba(var(--v-theme-on-background), 0.03);
    border-top: 1px solid rgba(var(--v-theme-on-background), 0.08);
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
}

.footer-links {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.footer-link {
    color: rgba(var(--v-theme-on-background), 0.7);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.footer-link:hover {
    color: rgb(var(--v-theme-on-background));
}

.footer-separator {
    color: rgba(var(--v-theme-on-background), 0.4);
}

.footer-tagline {
    color: rgba(var(--v-theme-on-background), 0.6);
    font-size: 0.9rem;
}

.guide-icon {
    font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .hero-section {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2rem;
        padding: 2rem;
        margin-bottom: 1rem;
    }

    .features-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin: 1rem auto;
    }

    .cta-buttons {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2.2rem;
    }

    .hero-description {
        font-size: 1rem;
    }

    .primary-btn {
        width: 100%;
        max-width: 280px;
        height: 2.8rem !important;
    }

    .features-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin: 1rem auto;
    }

    .feature-card {
        padding: 1rem;
        text-align: center;
        height: 100%;
        align-items: center;
    }

    .feature-icon {
        font-size: 1.5rem;
        align-self: center;
    }

    .feature-content {
        align-items: center;
        text-align: center;
        width: 100%;
    }

    .feature-title {
        justify-content: center;
        text-align: center;
        width: 100%;
    }

    .guide-link {
        align-self: center !important;
        margin-top: auto;
        justify-self: center;
        display: flex;
        justify-content: center;
        width: 100%;
        text-align: center;
    }

    .hero-visual {
        display: none;
    }

    .footer {
        padding: 1rem 2rem;
        position: relative;
        bottom: 0;
        width: 100%;
    }

    .footer-content {
        flex-direction: column;
        gap: 0.8rem;
        text-align: center;
    }
}

@media (max-width: 480px) {
    .hero-section {
        padding: 1.5rem 1rem;
        margin-bottom: 0.5rem;
    }

    .hero-title {
        font-size: 1.8rem;
    }

    .hero-description {
        font-size: 0.9rem;
    }

    .typing-container {
        font-size: 0.9rem;
        min-height: 1.2rem;
    }

    .features-grid {
        margin: 0.5rem auto;
    }

    .feature-card {
        padding: 0.8rem;
        text-align: center;
        align-items: center;
    }

    .feature-icon {
        font-size: 1.3rem;
        align-self: center;
    }

    .feature-content {
        align-items: center;
        text-align: center;
        width: 100%;
    }

    .feature-title {
        font-size: 0.9rem;
        justify-content: center;
        text-align: center;
        width: 100%;
    }

    .feature-description {
        font-size: 0.8rem;
        text-align: center;
    }

    .guide-link {
        align-self: center !important;
        margin-top: auto;
        justify-self: center;
        display: flex;
        justify-content: center;
        width: 100%;
        text-align: center;
    }

    .footer {
        padding: 0.8rem 1rem;
        position: relative;
        bottom: 0;
        width: 100%;
    }

    .footer-links {
        flex-direction: column;
        gap: 0.4rem;
    }

    .footer-separator {
        display: none;
    }
}

.guide-card {
    background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1), rgba(var(--v-theme-secondary), 0.1));
    border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

.guide-card:hover {
    background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.15), rgba(var(--v-theme-secondary), 0.15));
    border-color: rgba(var(--v-theme-primary), 0.3);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.2);
}

.guide-link {
    color: rgb(var(--v-theme-primary));
    text-decoration: none;
    font-weight: 600;
    font-size: 0.8rem;
    margin-top: auto;
    padding: 0.3rem 0.6rem;
    background: rgba(var(--v-theme-primary), 0.1);
    border-radius: 6px;
    border: 1px solid rgba(var(--v-theme-primary), 0.2);
    transition: all 0.3s ease;
    display: inline-block;
    width: fit-content;
    align-self: flex-start;
}

.guide-link:hover {
    background: rgba(var(--v-theme-primary), 0.2);
    border-color: rgba(var(--v-theme-primary), 0.4);
    color: rgb(var(--v-theme-on-background));
    transform: translateY(-1px);
}
</style>