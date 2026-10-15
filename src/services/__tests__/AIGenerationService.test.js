import { describe, it, expect, vi, afterEach } from "vitest";
import AIGenerationService from "../AIGenerationService";

const reply = content => ({
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue({ choices: [{ message: { content: JSON.stringify(content) } }] }),
});

describe("AIGenerationService", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("requires an API key and a model", async () => {
        await expect(AIGenerationService.generate({}, [], "", "model", "prompt")).rejects.toThrow("API Key is required.");
        await expect(AIGenerationService.generate({}, [], "key", "", "prompt")).rejects.toThrow("Model is required.");
    });

    it("sends the resume and the JSON Resume schema, and returns the cleaned result", async () => {
        global.fetch = vi.fn().mockResolvedValue(reply({
            answer: "Done",
            resumeInfo: { basics: { name: "Jane Doe", email: "" }, work: [], skills: [{ name: "Vue", keywords: [] }] },
        }));
        const resumeInfo = { basics: { name: "John Doe" } };

        const result = await AIGenerationService.generate(resumeInfo, [{ sender: "user", text: "Rename me" }], "key", "model", "Be helpful.");

        const body = JSON.parse(fetch.mock.calls[0][1].body);
        expect(body.messages[0].content).toContain(JSON.stringify(resumeInfo));
        expect(body.messages[1]).toEqual({ role: "user", content: "Rename me" });
        expect(body.response_format.json_schema.schema.properties.resumeInfo.properties.basics).toBeDefined();
        expect(result).toEqual({ answer: "Done", resumeInfo: { basics: { name: "Jane Doe" }, skills: [{ name: "Vue" }] } });
    });

    it("reports an invalid API key", async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 401 });
        await expect(AIGenerationService.generate({}, [], "key", "model", "prompt")).rejects.toThrow("Invalid API key");
    });
});
