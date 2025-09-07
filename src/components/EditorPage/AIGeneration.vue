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

const PROMPT_EDIT = `
You are an experienced HR and career consultant helping a user improve an existing resume.

Goals:
- Understand what the user wants to improve or change.
- Use the information they provide to suggest edits or updates to their resume.
- Always ask clarifying questions if information is missing or unclear before making changes.

Instructions:
1. Start by asking the user what specific parts of their resume they want to improve (e.g., formatting, phrasing, adding achievements).
2. The resume may contain the following sections: Name, Title, Work History, Education, and custom sections like Skills, Hobbies, Contacts, Projects, etc.
3. When the user provides information, incorporate it into your suggestions and show an updated draft.
4. Use HTML tags for formatting (headings, lists, emphasis) when presenting changes or examples.
5. Stay collaborative: confirm changes with the user before finalizing.
6. Do not show the resume draft or raw text to the user.

Example:
- You: "Which section of your resume would you like to work on first: Work History, Skills, or something else?"
`;

const PROMPT_SCRATCH = `
You are an experienced HR and career consultant guiding a user to build a resume from scratch.

Goals:
- Collect one piece of information at a time.
- Build a complete, well-structured resume step by step.
- Proactively request the next field if you already have the previous one.

Instructions:
1. Ask for the following fields in order: Full Name → Title → Work History → Education → Skills → Hobbies (or other optional sections).
2. Start by asking for the user's full name. Once provided, move on to the next field.
3. Be specific in your requests (e.g., "Could you list your most recent job title and employer?").
4. If any information is unclear or missing, ask for clarification before adding it.
5. As soon as you receive new information, add it to the resume draft (use placeholders if necessary).
6. Use HTML tags to format the resume content as you build it (headings for sections, lists for items).
7. Do not show the resume draft or raw text to the user.

Example:
- You: "Let's build your resume. Could you please provide your full name?"
- User: "John Doe"
- You: "Great! What's your current professional title?"
- User: "Software Engineer at Google"
- You: "Perfect. Could you share your work history (jobs, dates, responsibilities)?"
`;


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
            activePrompt: null,
        };
    },
    created() {
        this.loadHistory();
    },
    methods: {
        loadHistory() {
            const savedState = localStorage.getItem("ai-generation-state");
            if (savedState) {
                const state = JSON.parse(savedState);
                this.history = state.history || [];
                this.activePrompt = state.activePrompt || null;
            }
        },
        saveHistory() {
            const state = {
                history: this.history,
                activePrompt: this.activePrompt,
            };
            localStorage.setItem("ai-generation-state", JSON.stringify(state));
        },
        clearHistory() {
            this.history = [];
            this.activePrompt = null;
            localStorage.removeItem("ai-generation-state");
            localStorage.removeItem("ai-generation-history"); // for migration
        },
        async sendMessage() {
            if (!this.userInput.trim() || this.isLoading || !this.activePrompt) return;

            const userMessage = { sender: "user", text: this.userInput };
            this.history.push(userMessage);
            const currentInput = this.userInput;
            this.userInput = "";
            this.isLoading = true;

            try {
                const response = await AIGenerationService.generate(this.resumeInfo, this.history, this.apiKey, this.model, this.activePrompt);
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
                this.history = this.history.slice(0, index + 1);
                this.saveHistory();
            }
        },
        formatMessage(text) {
            return text.replace(/\n/g, '<br>');
        },
        async startConversation(prompt, resumeData) {
            if (this.isLoading) return;
            this.isLoading = true;
            this.activePrompt = prompt;

            try {
                const response = await AIGenerationService.generate(resumeData, [], this.apiKey, this.model, prompt);
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
            this.startConversation(PROMPT_SCRATCH, newResume);
        },
        editExistingResume() {
            this.startConversation(PROMPT_EDIT, this.resumeInfo);
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