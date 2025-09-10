class TranscriptionService {
    /**
     * Transcribes audio using the OpenAI Whisper API.
     * @param {Blob} audioBlob - The audio data to transcribe.
     * @param {string} apiKey - The OpenAI API key.
     * @param {string} language - The language of the audio data in ISO-639-1 format (e.g., 'en', 'es').
     * @returns {Promise<string>} - The transcribed text.
     */
    async transcribe(audioBlob, apiKey, language) {
        if (!apiKey) {
            throw new Error("OpenAI API Key is required for transcription.");
        }

        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');
        formData.append('model', 'gpt-4o-transcribe');
        if (language) {
            formData.append('language', language);
        }

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
            body: formData
        });

        if (response.status === 401) {
            throw new Error('Invalid OpenAI API key. Please check your API key and try again.');
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || 'An unknown error occurred during transcription.');
        }

        const data = await response.json();
        return data.text;
    }
}

export default new TranscriptionService(); 