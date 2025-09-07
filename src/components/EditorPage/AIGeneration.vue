<template>
    <div class="ai-generation" :class="{ 'initial-state': history.length === 0 && !isLoading }">
        <div v-if="history.length > 0 || isLoading" class="chat-history">
            <div v-for="(message, index) in history" :key="index" :class="['message', message.sender]">
                <p v-html="formatMessage(message.text)"></p>
                <v-tooltip v-if="message.resumeInfo" text="Restore this version" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="ph-clock-counter-clockwise" @click="restoreCheckpoint(index)"
                            class="restore-button" variant="text" size="x-small"></v-btn>
                    </template>
                </v-tooltip>
            </div>
            <div v-if="isLoading" class="message assistant">
                <p><i>Generating...</i></p>
            </div>
        </div>
        <div v-if="history.length > 0" class="chat-input-container">
            <div class="chat-input">
                <v-textarea v-model="userInput" @keydown.enter="handleEnter" placeholder="Type your message..." rows="2"
                    auto-grow variant="filled" class="chat-textarea" hide-details></v-textarea>
                <v-tooltip text="Send Message">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="ph-paper-plane-right" @click="sendMessage"
                            :disabled="isLoading || !userInput.trim()" variant="text" class="send-button"></v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="Clear History">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="ph-trash" @click="clearHistory" variant="text" color="error"
                            class="clear-button"></v-btn>
                    </template>
                </v-tooltip>
            </div>
        </div>
        <div v-if="history.length === 0 && !isLoading" class="initial-actions">
            <v-btn @click="editExistingResume" class="start-button" :disabled="isLoading">
                Edit Your Resume
            </v-btn>
            <v-btn @click="startFromScratch" class="start-button" :disabled="isLoading">
                Start from Scratch
            </v-btn>
        </div>
    </div>
</template>

<script>
import AIGenerationService from "../../services/AIGenerationService";
import { ResumeDataV2 } from '@/models/ResumeData/ResumeDataV2';

const INITIAL_PROMPT_EDIT = "You are an HR expert in resume creation. Your goal is to help the user improve their existing resume. Start by asking them what they want to improve or change.";
const INITIAL_PROMPT_SCRATCH = "You are an HR expert guiding a user to build a new resume from scratch. Your goal is to ask for one piece of information at a time to build a complete resume. Proactively ask for the following fields in this order: Name, Title, Work History, Education, Skills, and Hobbies. Start by asking for the user's full name. When the user provides you with info, use that to update the resume and ask for the next piece of information (be specific on what you need)";

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
        async startConversation(prompt, resumeData) {
            if (this.isLoading) return;
            this.isLoading = true;

            try {
                const response = await AIGenerationService.generate(resumeData, prompt, this.apiKey, this.model);
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
                    text: `Sorry, I encountered an error: ${error.message}`,
                };
                this.history.push(errorMessage);
            } finally {
                this.isLoading = false;
                this.saveHistory();
            }
        },
        startFromScratch() {
            const newResume = new ResumeDataV2();
            this.$emit("update:resumeInfo", newResume);
            this.startConversation(INITIAL_PROMPT_SCRATCH, newResume);
        },
        editExistingResume() {
            this.startConversation(INITIAL_PROMPT_EDIT, this.resumeInfo);
        },
        handleEnter(event) {
            if (!event.shiftKey) {
                event.preventDefault();
                this.sendMessage();
            }
        },
    },
};
</script>

<style scoped src="./AIGeneration.css"></style>