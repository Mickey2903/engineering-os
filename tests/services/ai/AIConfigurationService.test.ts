import { describe, expect, it } from "vitest";

import { AIConfigurationService } from "../../../src/services/ai/AIConfigurationService";


describe("AIConfigurationService", () => {

  it("converts engineering settings to AI configuration", () => {

    const service =
      new AIConfigurationService({
        aiProvider: "ollama",

        aiModel:
          "llama3",

        aiEndpoint:
          "http://localhost:11434/api/chat",
      });


    const configuration =
      service.get();


    expect(configuration.provider)
      .toBe(
        "ollama",
      );


    expect(configuration.model)
      .toBe(
        "llama3",
      );


    expect(configuration.endpoint)
      .toBe(
        "http://localhost:11434/api/chat",
      );

  });


  it("does not add empty optional values", () => {

    const service =
      new AIConfigurationService({
        aiProvider: "mock",
      });


    const configuration =
      service.get();


    expect(configuration)
      .toEqual({
        provider:
          "mock",
      });

  });

});
