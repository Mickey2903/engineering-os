import { describe, expect, it } from "vitest";

import { AIProviderFactory } from "../../../src/services/ai/AIProviderFactory";
import { MockAIProvider } from "../../../src/services/ai/providers/MockAIProvider";


describe("AIProviderFactory", () => {

  it("creates mock AI provider", () => {

    const provider =
      AIProviderFactory.create({
  provider: "mock",
});


    expect(provider)
      .toBeInstanceOf(
        MockAIProvider,
      );

  });


  it("created provider can generate response", async () => {

    const provider =
      AIProviderFactory.create({
  provider: "mock",
});


    const response =
      await provider.generate({
        prompt:
          "Test prompt",
      });


    expect(response.content)
      .toContain(
        "Test prompt",
      );


    expect(response.model)
      .toBe(
        "mock",
      );

  });

});
