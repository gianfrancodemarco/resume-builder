<template>
    <div class="landing-bg">
        <div class="center-content">
            <h1 class="landing-title">Resume Builder</h1>
            <p class="landing-subtitle">Create a stunning resume in minutes.<br>Modern, fast, and free.</p>
            <div class="typing-container">
                <span class="typing-text"></span>
                <span class="cursor">|</span>
            </div>
            <v-btn color="primary" class="landing-btn" large to="/editor">Create your resume</v-btn>
            <div class="website-link">
            <a href="https://gianfrancodemarco.dev" target="_blank"
                rel="noopener noreferrer">gianfrancodemarco.dev</a>
            <span class="separator">•</span>
            <a href="https://github.com/gianfrancodemarco/resume-builder" target="_blank" rel="noopener noreferrer">
                ⭐ Star on GitHub
            </a>
        </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'

const sentences = [
    "Experienced software developer with 5+ years in web development",
    "Strong background in project management and team leadership",
    "Proficient in multiple programming languages and frameworks",
    "Excellent communication and problem-solving skills",
    "Track record of delivering successful projects on time",
    "Passionate about creating innovative solutions",
    "Adaptable and quick to learn new technologies",
    "Detail-oriented with a focus on quality"
]

onMounted(() => {
    const typingText = document.querySelector('.typing-text')
    let currentSentenceIndex = 0
    let currentCharIndex = 0
    let isDeleting = false
    let typingSpeed = 30

    function type() {
        const currentSentence = sentences[currentSentenceIndex]

        if (isDeleting) {
            typingText.textContent = currentSentence.substring(0, currentCharIndex - 1)
            currentCharIndex--
            typingSpeed = 20
        } else {
            typingText.textContent = currentSentence.substring(0, currentCharIndex + 1)
            currentCharIndex++
            typingSpeed = 30
        }

        if (!isDeleting && currentCharIndex === currentSentence.length) {
            isDeleting = true
            typingSpeed = 2000
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false
            currentSentenceIndex = (currentSentenceIndex + 1) % sentences.length
            typingSpeed = 300
        }

        setTimeout(type, typingSpeed)
    }

    type()
})
</script>

<style scoped>
.landing-bg {
    min-height: 100%;
    width: 100%;
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
    width: 100%;
    max-width: 800px;
}

.typing-container {
    min-height: 60px;
    height: 60px;
    width: 100%;
    max-width: 500px;
    margin: 0 auto 48px auto;
    font-size: 1.2rem;
    font-weight: 400;
    opacity: 0.92;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    padding: 0 20px;
}

.typing-text {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    text-align: left;
    font-style: italic;
    color: rgba(255, 255, 255, 0.85);
}

.cursor {
    display: inline-block;
    margin-left: 2px;
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

.landing-title {
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: 1px;
}

.landing-subtitle {
    font-size: 1.2rem;
    font-weight: 400;
    margin-bottom: 48px;
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

.website-link {
    gap: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10rem;
}

.website-link a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 4px;
}

.website-link a:hover {
    color: #fff;
}

.separator {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8rem;
}

/* Tablet styles */
@media (max-width: 960px) {
    .landing-title {
        font-size: 2.4rem;
    }

    .landing-subtitle {
        font-size: 1.1rem;
    }

    .typing-container {
        font-size: 1.1rem;
        min-height: 50px;
        height: 50px;
    }
}

/* Mobile styles */
@media (max-width: 600px) {
    .center-content {
        padding: 32px 16px 24px 16px;
    }

    .landing-title {
        font-size: 2rem;
        margin-bottom: 8px;
    }

    .landing-subtitle {
        font-size: 1rem;
        margin-bottom: 32px;
        padding: 0 16px;
    }

    .typing-container {
        font-size: 0.95rem;
        min-height: 40px;
        height: 40px;
        margin-bottom: 32px;
        padding: 0 16px;
    }

    .landing-btn {
        height: 36px !important;
        font-size: 0.95rem;
        padding: 8px 16px;
    }

    .website-link {
        bottom: 2.5rem;
        flex-direction: column;
        gap: 4px;
    }

    .website-link .separator {
        display: none;
    }

    .website-link a {
        font-size: 0.85rem;
    }
}

/* Small mobile styles */
@media (max-width: 360px) {
    .landing-title {
        font-size: 1.8rem;
    }

    .landing-subtitle {
        font-size: 0.9rem;
    }

    .typing-container {
        font-size: 0.85rem;
    }
}
</style>