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
            <main class="hero-section">
                <div class="hero-content">
                    <h1 class="hero-title">
                        Create Your Perfect
                        <span class="title-highlight">Resume</span>
                        in Minutes
                    </h1>

                    <p class="hero-description">Build professional resumes with our modern, intuitive editor.
                        Export to PDF, customize styles, and stand out from the crowd.
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
                            <div class="feature-icon">🚀</div>
                            <div class="feature-content">
                                <h3 class="feature-title">Free & Open Source</h3>
                                <p class="feature-description">Completely free to use with full source code available on
                                    GitHub</p>
                            </div>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">📄</div>
                            <div class="feature-content">
                                <h3 class="feature-title">Multiple Export Formats</h3>
                                <p class="feature-description">Export to PDF, HTML, or JSON for later editing and
                                    sharing</p>
                            </div>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">🎨</div>
                            <div class="feature-content">
                                <h3 class="feature-title">Professional Templates</h3>
                                <p class="feature-description">Choose from multiple templates designed for different
                                    industries</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="hero-visual">
                    <div class="mockup-container">
                        <div class="mockup-screen">
                            <div class="mockup-header">
                                <div class="mockup-dots">
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                </div>
                            </div>
                            <div class="mockup-content">
                                <!-- Left Column -->
                                <div class="mockup-left-column">
                                    <div class="mockup-section">
                                        <div class="mockup-section-title"></div>
                                        <div class="mockup-line"></div>
                                        <div class="mockup-line short"></div>
                                        <div class="mockup-line"></div>
                                    </div>
                                    <div class="mockup-section">
                                        <div class="mockup-section-title short"></div>
                                        <div class="mockup-line"></div>
                                        <div class="mockup-line short"></div>
                                    </div>
                                    <div class="mockup-section">
                                        <div class="mockup-section-title short"></div>
                                        <div class="mockup-line"></div>
                                        <div class="mockup-line"></div>
                                    </div>
                                </div>

                                <!-- Right Column -->
                                <div class="mockup-right-column">
                                    <div class="mockup-section">
                                        <div class="mockup-section-title"></div>
                                        <div class="mockup-line"></div>
                                        <div class="mockup-line short"></div>
                                        <div class="mockup-line"></div>
                                        <div class="mockup-line short"></div>
                                    </div>
                                    <div class="mockup-section">
                                        <div class="mockup-section-title short"></div>
                                        <div class="mockup-line"></div>
                                        <div class="mockup-line"></div>
                                        <div class="mockup-line short"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
import { onMounted } from 'vue'

const sentences = [
    "Professional templates for every industry",
    "Real-time preview as you type",
    "Export to PDF with perfect formatting",
    "Customizable colors and layouts",
    "Mobile-friendly responsive design",
    "No registration required",
    "Open source and completely free",
    "Built with modern web technologies"
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
    overflow: hidden;
    background: #0a0a0a;
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    background: linear-gradient(45deg, #667eea, #764ba2);
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
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    color: #ffffff;
}

/* Hero Section */
.hero-section {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    padding: 4rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

.hero-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin: 0;
}

.title-highlight {
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-description {
    font-size: 1.25rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
}

.typing-container {
    min-height: 2rem;
    font-size: 1.1rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
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
    margin-top: 1rem;
}

.primary-btn {
    background: linear-gradient(135deg, #667eea, #764ba2) !important;
    border-radius: 12px !important;
    font-weight: 600 !important;
    text-transform: none !important;
    padding: 0 2.5rem !important;
    height: 3.5rem !important;
    transition: all 0.3s ease !important;
}

.primary-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3) !important;
}

.btn-icon {
    margin-right: 0.5rem;
}

/* Features Grid */
.features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 2rem;
}

.feature-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.feature-card:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.feature-icon {
    font-size: 2rem;
    width: fit-content;
}

.feature-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.feature-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
}

.feature-description {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
    margin: 0;
}

/* Hero Visual */
.hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
}

.mockup-container {
    position: relative;
    perspective: 1200px;
}

.mockup-screen {
    width: 320px;
    height: 420px;
    background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    transform: rotateY(-20deg) rotateX(8deg);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.mockup-screen:hover {
    transform: rotateY(-15deg) rotateX(5deg) translateY(-10px);
    box-shadow: 0 35px 70px rgba(0, 0, 0, 0.4);
}

.mockup-header {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.mockup-dots {
    display: flex;
    gap: 0.5rem;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
}

.mockup-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    height: calc(100% - 3rem);
}

.mockup-left-column {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.mockup-right-column {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.mockup-section {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.mockup-section-title {
    height: 14px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
    width: 80%;
}

.mockup-section-title.short {
    width: 60%;
}

.mockup-line {
    height: 6px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 3px;
    animation: pulse 2s ease-in-out infinite;
}

.mockup-line:nth-child(2) {
    animation-delay: 0.2s;
}

.mockup-line:nth-child(3) {
    animation-delay: 0.4s;
}

.mockup-line:nth-child(4) {
    animation-delay: 0.6s;
}

.mockup-line:nth-child(5) {
    animation-delay: 0.8s;
}

.mockup-line.short {
    width: 70%;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 0.6;
    }

    50% {
        opacity: 1;
    }
}

/* Add floating animation to the entire mockup */
.mockup-container {
    animation: float-mockup 6s ease-in-out infinite;
}

@keyframes float-mockup {

    0%,
    100% {
        transform: translateY(0px) rotateY(-20deg) rotateX(8deg);
    }

    50% {
        transform: translateY(-15px) rotateY(-18deg) rotateX(6deg);
    }
}

.mockup-container:hover {
    animation-play-state: paused;
}

/* Footer */
.footer {
    padding: 2rem 4rem;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.03);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
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
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.footer-link:hover {
    color: #ffffff;
}

.footer-separator {
    color: rgba(255, 255, 255, 0.4);
}

.footer-tagline {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .hero-section {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 3rem;
        padding: 3rem 2rem;
    }

    .features-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .cta-buttons {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }

    .hero-description {
        font-size: 1.1rem;
    }

    .primary-btn {
        width: 100%;
        max-width: 300px;
    }

    .features-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .feature-card {
        padding: 1.25rem;
        text-align: center;
    }

    .feature-icon {
        font-size: 1.5rem;
        align-self: center;
    }

    .hero-visual {
        display: none;
    }

    .footer {
        padding: 1.5rem 2rem;
    }

    .footer-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
}

@media (max-width: 480px) {
    .hero-section {
        padding: 2rem 1rem;
    }

    .hero-title {
        font-size: 2rem;
    }

    .hero-description {
        font-size: 1rem;
    }

    .typing-container {
        font-size: 1rem;
    }

    .feature-card {
        padding: 1rem;
        text-align: center;
    }

    .feature-icon {
        font-size: 1.5rem;
        align-self: center;
    }

    .feature-title {
        font-size: 1rem;
    }

    .feature-description {
        font-size: 0.85rem;
    }

    .footer {
        padding: 1rem;
    }

    .footer-links {
        flex-direction: column;
        gap: 0.5rem;
    }

    .footer-separator {
        display: none;
    }
}
</style>