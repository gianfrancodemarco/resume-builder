import { describe, it, expect, vi } from "vitest";
import AIGenerationService from "../AIGenerationService";

describe("AIGenerationService", () => {
    it("should return a mocked response", async () => {
        const resumeInfo = { personal: { name: "John Doe" } };
        const message = "Change my name";

        console.log = vi.fn();

        const result = await AIGenerationService.generate(resumeInfo, message);

        expect(result).toHaveProperty("answer");
        expect(result).toHaveProperty("resumeInfo");
        expect(result.resumeInfo.personal.name).toBe("AI Generated Name");
        expect(console.log).toHaveBeenCalledWith("Calling mock LLM with:", { resumeInfo, message });
    });
}); 