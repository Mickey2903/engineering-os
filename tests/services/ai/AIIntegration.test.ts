import { describe, expect, it } from "vitest";

import { AIService } from "../../../src/services/ai/AIService";
import { AIConfigurationService } from "../../../src/services/ai/AIConfigurationService";


describe("AI integration flow", () => {

  it("runs complete configuration to provider pipeline", async () => {

    const configurationService =
      new AIConfigurationService({
        aiProvider:
          "mock",

        aiModel:
          "test-model",
      });


    const aiService =
      new AIService(
        configurationService,
      );


    const response =
      await aiService.generate({
        prompt:
          "Analyse engineering object",
      });


    expect(response.content)
      .toContain(
        "Analyse engineering object",
      );


    expect(response.model)
      .toBe(
        "test-model",
      );

  });

});
