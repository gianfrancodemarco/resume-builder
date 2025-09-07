<template>
    <div class="ai-generation" :class="{ 'initial-state': history.length === 0 && !isLoading }">
        <div v-if="history.length > 0 || isLoading" class="chat-history">
            <div v-for="(message, index) in history" :key="index" :class="['message', message.sender]">
                <p v-html="formatMessage(message.text)"></p>
                <button v-if="message.resumeInfo" @click="restoreCheckpoint(index)" class="restore-button">
                    Restore this version
                </button>
            </div>
            <div v-if="isLoading" class="message assistant">
                <p><i>Generating...</i></p>
            </div>
        </div>
        <div v-if="history.length > 0" class="chat-input-container">
            <div class="chat-input">
                <textarea v-model="userInput" @keyup.enter="sendMessage" placeholder="Type your message..."
                    rows="1"></textarea>
                <button @click="sendMessage" :disabled="isLoading || !userInput.trim()">Send</button>
            </div>
            <div class="controls">
                <button v-if="history.length > 0" @click="clearHistory" class="clear-button">Clear History</button>
            </div>
        </div>
        <button v-if="history.length === 0 && !isLoading" @click="startGuidedGeneration" class="start-button"
            :disabled="isLoading">
            Start Guided Generation
        </button>
    </div>
</template>

<script>
import AIGenerationService from "../../services/AIGenerationService";

const INITIAL_PROMPT = "You are an HR expert in resume creation. Your goal is to help the user improve their resume. Start by asking them what they want to improve.";

export default {
    name: "AIGeneration",
    props: {
        resumeInfo: {
            type: Object,
            required: true,
        },
        apiKey: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            userInput: "",
            history: [],
            isLoading: false,
        };
    },
    created() {
        this.loadHistory();
    },
    methods: {
        loadHistory() {
            const savedHistory = localStorage.getItem("ai-generation-history");
            if (savedHistory) {
                this.history = JSON.parse(savedHistory);
            }
        },
        saveHistory() {
            localStorage.setItem("ai-generation-history", JSON.stringify(this.history));
        },
        clearHistory() {
            this.history = [];
            localStorage.removeItem("ai-generation-history");
        },
        async sendMessage() {
            if (!this.userInput.trim() || this.isLoading) return;

            const userMessage = { sender: "user", text: this.userInput };
            this.history.push(userMessage);
            const currentInput = this.userInput;
            this.userInput = "";
            this.isLoading = true;

            try {
                const response = await AIGenerationService.generate(this.resumeInfo, currentInput, this.apiKey, this.model);
                const assistantMessage = {
                    sender: "assistant",
                    text: response.answer,
                    resumeInfo: response.resumeInfo,
                };
                this.history.push(assistantMessage);
                this.$emit("update:resumeInfo", response.resumeInfo);
            } catch (error) {
                console.error("Error generating AI response:", error);
                const errorMessage = {
                    sender: "assistant",
                    text: "Sorry, I encountered an error. Please try again.",
                };
                this.history.push(errorMessage);
            } finally {
                this.isLoading = false;
                this.saveHistory();
            }
        },
        restoreCheckpoint(index) {
            const checkpoint = this.history[index];
            if (checkpoint && checkpoint.resumeInfo) {
                this.$emit("update:resumeInfo", checkpoint.resumeInfo);
            }
        },
        formatMessage(text) {
            return text.replace(/\n/g, '<br>');
        },
        async startGuidedGeneration() {
            if (this.isLoading) return;
            this.isLoading = true;

            try {
                const response = await AIGenerationService.generate(this.resumeInfo, INITIAL_PROMPT, this.apiKey, this.model);
                const assistantMessage = {
                    sender: "assistant",
                    text: response.answer,
                    resumeInfo: response.resumeInfo,
                };
                this.history.push(assistantMessage);
                this.$emit("update:resumeInfo", response.resumeInfo);
            } catch (error) {
                console.error("Error generating AI response:", error);
                const errorMessage = {
                    sender: "assistant",
                    text: "Sorry, I encountered an error. Please try again.",
                };
                this.history.push(errorMessage);
            } finally {
                this.isLoading = false;
                this.saveHistory();
            }
        },
    },
};
</script>

<style scoped src="./AIGeneration.css"></style>