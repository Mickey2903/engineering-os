import { describe, expect, it } from "vitest";

import { AIService } from "../../../src/services/ai/AIService";
import type { AIConfigurationService } from "../../../src/services/ai/AIConfigurationService";


describe("AIService", () => {

  it("uses configured provider to generate response", async () => {

    const configurationService = {
  get: () => ({
    provider: "mock",
    model: "test-model",
  }),
} as AIConfigurationService;


    const service =
      new AIService(
        configurationService,
      );


    const response =
      await service.generate({
        prompt:
          "Test AI request",
      });


    expect(response.content)
      .toContain(
        "Test AI request",
      );


    expect(response.model)
  .toBe(
    "test-model",
  );

  });


});
